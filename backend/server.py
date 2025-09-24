from fastapi import FastAPI, APIRouter, HTTPException, BackgroundTasks, WebSocket, WebSocketDisconnect
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr, validator
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone, timedelta
import asyncio
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import json
from emergentintegrations.llm.chat import LlmChat, UserMessage

# Configure logging first
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# ROI Calculator Models
class ROIInput(BaseModel):
    call_volume: int = Field(..., description="Monthly call volume")
    current_cost_per_call: float = Field(..., description="Current cost per call in USD")
    average_handle_time: int = Field(..., description="Average handle time in seconds")
    agent_count: int = Field(..., description="Current agent count")
    
class ROIResults(BaseModel):
    # Current metrics
    current_monthly_cost: float
    current_annual_cost: float
    
    # Projected metrics with SentraTech
    new_monthly_cost: float
    new_annual_cost: float
    monthly_savings: float
    annual_savings: float
    cost_reduction_percent: float
    
    # Performance improvements
    new_aht: float
    time_saved_per_call: float
    total_time_saved_monthly: float
    aht_reduction_percent: float
    
    # Automation metrics
    automated_calls: float
    human_assisted_calls: float
    automation_rate: float
    
    # ROI
    roi: float

class ROICalculation(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    input_data: ROIInput
    results: ROIResults
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    user_info: Optional[dict] = None

# Demo Request & CRM Models
class DemoRequest(BaseModel):
    email: EmailStr
    name: str
    company: str  # Required field, no default value
    phone: str = ""
    call_volume: str = ""
    message: str = ""
    
    @validator('name')
    def name_must_not_be_empty(cls, v):
        if not v or not v.strip():
            raise ValueError('Name cannot be empty')
        return v.strip()
    
    @validator('company')
    def company_must_not_be_empty(cls, v):
        if not v or not v.strip():
            raise ValueError('Company cannot be empty')
        return v.strip()
    
    @validator('phone')
    def validate_phone(cls, v):
        if v and v.strip():
            # Basic phone validation
            import re
            phone_pattern = r'^[\+]?[\d\s\-\(\)]{7,20}$'
            if not re.match(phone_pattern, v.strip()):
                raise ValueError('Invalid phone number format')
        return v.strip() if v else ""

class DemoRequestResponse(BaseModel):
    success: bool
    contact_id: str = None
    message: str
    reference_id: str = None

class HubSpotContact(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    firstname: str
    lastname: str = ""
    phone: str = ""
    company: str = ""
    call_volume: str = ""
    message: str = ""
    created_date: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    source: str = "website_demo_form"

# Live Chat Models
class ChatMessage(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: str
    content: str
    sender: str  # "user" or "assistant"
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    
class ChatSession(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: Optional[str] = None
    started_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    last_activity: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    messages: List[ChatMessage] = []
    context: Dict[str, Any] = {}

# WebSocket Connection Manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}
        
    async def connect(self, websocket: WebSocket, session_id: str):
        await websocket.accept()
        self.active_connections[session_id] = websocket
        logger.info(f"WebSocket connected for session: {session_id}")
        
    def disconnect(self, session_id: str):
        if session_id in self.active_connections:
            del self.active_connections[session_id]
            logger.info(f"WebSocket disconnected for session: {session_id}")
            
    async def send_personal_message(self, message: str, session_id: str):
        if session_id in self.active_connections:
            websocket = self.active_connections[session_id]
            await websocket.send_text(message)
            
    async def send_typing_indicator(self, session_id: str, is_typing: bool):
        if session_id in self.active_connections:
            typing_message = {
                "type": "typing",
                "is_typing": is_typing,
                "timestamp": datetime.now(timezone.utc).isoformat()
            }
            websocket = self.active_connections[session_id]
            await websocket.send_text(json.dumps(typing_message))

# Live Chat Service
class LiveChatService:
    def __init__(self):
        self.llm_key = os.environ.get('EMERGENT_LLM_KEY')
        if not self.llm_key:
            logger.warning("EMERGENT_LLM_KEY not found in environment variables")
            
    async def create_chat_session(self, user_id: Optional[str] = None) -> str:
        """Create a new chat session"""
        session = ChatSession(user_id=user_id)
        
        # Save to database
        session_dict = session.dict()
        session_dict['started_at'] = session_dict['started_at'].isoformat()
        session_dict['last_activity'] = session_dict['last_activity'].isoformat()
        
        await db.chat_sessions.insert_one(session_dict)
        logger.info(f"Created new chat session: {session.id}")
        
        return session.id
    
    async def get_chat_session(self, session_id: str) -> Optional[ChatSession]:
        """Get chat session from database"""
        session_data = await db.chat_sessions.find_one({"id": session_id})
        if session_data:
            # Handle datetime parsing
            if isinstance(session_data.get('started_at'), str):
                session_data['started_at'] = datetime.fromisoformat(session_data['started_at'])
            if isinstance(session_data.get('last_activity'), str):
                session_data['last_activity'] = datetime.fromisoformat(session_data['last_activity'])
            return ChatSession(**session_data)
        return None
    
    async def save_message(self, session_id: str, content: str, sender: str) -> ChatMessage:
        """Save a message to the database and return the message object"""
        message = ChatMessage(
            session_id=session_id,
            content=content,
            sender=sender
        )
        
        # Save message to database
        message_dict = message.dict()
        message_dict['timestamp'] = message_dict['timestamp'].isoformat()
        
        await db.chat_messages.insert_one(message_dict)
        
        # Update session last activity
        await db.chat_sessions.update_one(
            {"id": session_id},
            {"$set": {"last_activity": datetime.now(timezone.utc).isoformat()}}
        )
        
        logger.info(f"Saved message from {sender} in session {session_id}")
        return message
    
    async def get_ai_response(self, session_id: str, user_message: str) -> str:
        """Get AI response using Emergent LLM integration"""
        try:
            if not self.llm_key:
                return "I'm sorry, but the AI chat service is currently unavailable. Please try again later or contact our support team."
            
            # Initialize LLM Chat with SentraTech context
            system_message = """You are an AI assistant for SentraTech, a company that provides AI-powered customer support solutions. 

Your role is to help visitors understand our platform and answer questions about:
- AI-powered customer routing (sub-50ms response times)
- 70% automation capabilities for customer interactions
- Real-time BI dashboards and analytics
- Cost savings and ROI benefits (typically 45% cost reduction)
- Integration with existing systems (CRM, helpdesk, etc.)
- Platform security and compliance features

Be helpful, professional, and knowledgeable about AI customer support solutions. If asked about specific technical implementation or pricing, suggest they schedule a demo or speak with our sales team.

Keep responses concise and focused on how SentraTech can solve their customer support challenges."""
            
            chat = LlmChat(
                api_key=self.llm_key,
                session_id=session_id,
                system_message=system_message
            ).with_model("openai", "gpt-4o-mini")  # Using default model
            
            # Create user message
            user_msg = UserMessage(text=user_message)
            
            # Get AI response
            response = await chat.send_message(user_msg)
            
            return response.strip()
            
        except Exception as e:
            logger.error(f"Error getting AI response: {str(e)}")
            return "I apologize, but I'm having trouble processing your message right now. Our human support team is available to help you - please feel free to schedule a demo or contact us directly."
    
    async def get_chat_history(self, session_id: str, limit: int = 50) -> List[ChatMessage]:
        """Get chat history for a session"""
        messages = await db.chat_messages.find(
            {"session_id": session_id}
        ).sort("timestamp", 1).limit(limit).to_list(limit)
        
        result = []
        for msg in messages:
            if isinstance(msg.get('timestamp'), str):
                msg['timestamp'] = datetime.fromisoformat(msg['timestamp'])
            result.append(ChatMessage(**msg))
        
        return result

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

# Mock HubSpot Service
class MockHubSpotService:
    """Mock HubSpot service that simulates API responses"""
    
    def __init__(self):
        self.contacts_db = {}  # In-memory storage for demo
    
    async def create_contact(self, demo_request: DemoRequest) -> Dict[str, Any]:
        """Simulate HubSpot contact creation"""
        try:
            # Parse name into first/last name
            name_parts = demo_request.name.strip().split(' ', 1)
            firstname = name_parts[0]
            lastname = name_parts[1] if len(name_parts) > 1 else ""
            
            # Check if contact already exists (by email)
            existing_contact = None
            for contact_id, contact in self.contacts_db.items():
                if contact['email'].lower() == demo_request.email.lower():
                    existing_contact = contact_id
                    break
            
            if existing_contact:
                logger.info(f"Mock HubSpot: Contact already exists for {demo_request.email}")
                return {
                    "success": True,
                    "contact_id": existing_contact,
                    "message": "Contact already exists - updated with new information",
                    "is_new": False
                }
            
            # Create new contact
            contact_id = f"mock_contact_{str(uuid.uuid4())[:8]}"
            
            contact_data = {
                "id": contact_id,
                "email": demo_request.email,
                "firstname": firstname,
                "lastname": lastname,
                "phone": demo_request.phone,
                "company": demo_request.company,
                "call_volume": demo_request.call_volume,
                "message": demo_request.message,
                "created_date": datetime.now(timezone.utc).isoformat(),
                "source": "website_demo_form"
            }
            
            # Store in mock database
            self.contacts_db[contact_id] = contact_data
            
            logger.info(f"Mock HubSpot: Created contact {contact_id} for {demo_request.email}")
            
            # Simulate API delay
            await asyncio.sleep(0.5)
            
            return {
                "success": True,
                "contact_id": contact_id,
                "message": "Contact created successfully in HubSpot",
                "is_new": True
            }
            
        except Exception as e:
            logger.error(f"Mock HubSpot service error: {str(e)}")
            return {
                "success": False,
                "message": f"Error creating contact: {str(e)}"
            }
    
    async def get_contact(self, contact_id: str) -> Optional[Dict[str, Any]]:
        """Get contact by ID"""
        return self.contacts_db.get(contact_id)
    
    def get_all_contacts(self) -> Dict[str, Any]:
        """Get all contacts for debugging"""
        return self.contacts_db

# Mock Email Service
class MockEmailService:
    """Mock email service for sending notifications"""
    
    def __init__(self):
        self.sent_emails = []  # Store sent emails for testing
    
    async def send_demo_confirmation(self, email: str, name: str, contact_id: str) -> bool:
        """Send demo request confirmation to user"""
        try:
            email_content = {
                "to": email,
                "subject": "Demo Request Confirmed - SentraTech AI Platform",
                "body": f"""
Dear {name},

Thank you for your interest in SentraTech's AI-powered customer support platform!

We've received your demo request and our team will contact you within 1-2 business days to schedule a personalized demonstration.

Your reference ID: {contact_id}

During the demo, you'll see:
• Sub-50ms AI routing in action
• 70% automation capabilities 
• Real-time BI dashboards
• Custom ROI analysis for your business

If you have any immediate questions, please don't hesitate to reach out.

Best regards,
The SentraTech Team

---
This is a mock email service. In production, this would be sent via SMTP.
                """,
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "type": "demo_confirmation"
            }
            
            self.sent_emails.append(email_content)
            logger.info(f"Mock Email: Sent demo confirmation to {email}")
            
            # Simulate email sending delay
            await asyncio.sleep(0.3)
            
            return True
            
        except Exception as e:
            logger.error(f"Mock email service error: {str(e)}")
            return False
    
    async def send_internal_notification(self, demo_request: DemoRequest, contact_id: str) -> bool:
        """Send internal notification about new demo request"""
        try:
            internal_recipients = ["sales@sentratech.com", "demo-requests@sentratech.com"]  # Mock recipients
            
            email_content = {
                "to": internal_recipients,
                "subject": f"New Demo Request: {demo_request.name} - {demo_request.company}",
                "body": f"""
New Demo Request Received:

Name: {demo_request.name}
Email: {demo_request.email}
Company: {demo_request.company}
Phone: {demo_request.phone}
Monthly Call Volume: {demo_request.call_volume}

Message:
{demo_request.message}

HubSpot Contact ID: {contact_id}

Please follow up within 24 hours.

---
This is a mock email service. In production, this would be sent via SMTP.
                """,
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "type": "internal_notification"
            }
            
            self.sent_emails.append(email_content)
            logger.info(f"Mock Email: Sent internal notification for {demo_request.email}")
            
            return True
            
        except Exception as e:
            logger.error(f"Mock internal email error: {str(e)}")
            return False
    
    def get_sent_emails(self) -> List[Dict[str, Any]]:
        """Get all sent emails for debugging"""
        return self.sent_emails

# Initialize services
hubspot_service = MockHubSpotService()
email_service = MockEmailService()
connection_manager = ConnectionManager()
chat_service = LiveChatService()

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# ROI Calculator Routes
def calculate_roi_metrics(input_data: ROIInput) -> ROIResults:
    """Calculate ROI metrics based on input parameters"""
    
    # Current costs
    monthly_volume = input_data.call_volume
    current_monthly_cost = monthly_volume * input_data.current_cost_per_call
    current_annual_cost = current_monthly_cost * 12
    
    # SentraTech improvements (these are based on typical performance gains)
    automation_rate = 0.7  # 70% automation
    aht_reduction = 0.35   # 35% AHT reduction
    cost_reduction = 0.45  # 45% cost reduction
    
    # New costs with SentraTech
    new_cost_per_call = input_data.current_cost_per_call * (1 - cost_reduction)
    new_monthly_cost = monthly_volume * new_cost_per_call
    new_annual_cost = new_monthly_cost * 12
    
    # Savings calculations
    monthly_savings = current_monthly_cost - new_monthly_cost
    annual_savings = current_annual_cost - new_annual_cost
    
    # Time savings
    new_aht = input_data.average_handle_time * (1 - aht_reduction)
    time_saved_per_call = input_data.average_handle_time - new_aht
    total_time_saved_monthly = (time_saved_per_call * monthly_volume) / 3600  # hours
    
    # Automation metrics
    automated_calls = monthly_volume * automation_rate
    human_assisted_calls = monthly_volume * (1 - automation_rate)
    
    # ROI calculation
    roi = (annual_savings / new_annual_cost) * 100 if new_annual_cost > 0 else 0
    
    return ROIResults(
        current_monthly_cost=current_monthly_cost,
        current_annual_cost=current_annual_cost,
        new_monthly_cost=new_monthly_cost,
        new_annual_cost=new_annual_cost,
        monthly_savings=monthly_savings,
        annual_savings=annual_savings,
        cost_reduction_percent=cost_reduction * 100,
        new_aht=new_aht,
        time_saved_per_call=time_saved_per_call,
        total_time_saved_monthly=total_time_saved_monthly,
        aht_reduction_percent=aht_reduction * 100,
        automated_calls=automated_calls,
        human_assisted_calls=human_assisted_calls,
        automation_rate=automation_rate * 100,
        roi=roi
    )

@api_router.post("/roi/calculate", response_model=ROIResults)
async def calculate_roi(input_data: ROIInput):
    """Calculate ROI metrics without saving to database"""
    try:
        results = calculate_roi_metrics(input_data)
        return results
    except Exception as e:
        logger.error(f"Error calculating ROI: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Error calculating ROI: {str(e)}")

class ROISaveRequest(BaseModel):
    input_data: ROIInput
    user_info: Optional[dict] = None

@api_router.post("/roi/save", response_model=ROICalculation)
async def save_roi_calculation(request: ROISaveRequest):
    """Calculate and save ROI calculation to database"""
    try:
        results = calculate_roi_metrics(request.input_data)
        
        # Create ROI calculation record
        calculation = ROICalculation(
            input_data=request.input_data,
            results=results,
            user_info=request.user_info
        )
        
        # Convert to dict for MongoDB storage
        calculation_dict = calculation.dict()
        
        # Handle datetime serialization
        calculation_dict['timestamp'] = calculation_dict['timestamp'].isoformat()
        
        # Save to database
        await db.roi_calculations.insert_one(calculation_dict)
        
        return calculation
    except Exception as e:
        logger.error(f"Error saving ROI calculation: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Error saving ROI calculation: {str(e)}")

@api_router.get("/roi/calculations", response_model=List[ROICalculation])
async def get_roi_calculations(limit: int = 100):
    """Get recent ROI calculations"""
    try:
        calculations = await db.roi_calculations.find().sort("timestamp", -1).limit(limit).to_list(limit)
        
        # Handle datetime parsing
        for calc in calculations:
            if isinstance(calc.get('timestamp'), str):
                calc['timestamp'] = datetime.fromisoformat(calc['timestamp'])
        
        return [ROICalculation(**calc) for calc in calculations]
    except Exception as e:
        logger.error(f"Error fetching ROI calculations: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Error fetching ROI calculations: {str(e)}")

# Demo Request & CRM Routes
@api_router.post("/demo/request", response_model=DemoRequestResponse)
async def create_demo_request(
    demo_request: DemoRequest,
    background_tasks: BackgroundTasks
):
    """Create a demo request and add to CRM"""
    try:
        # Create contact in HubSpot (mock)
        hubspot_result = await hubspot_service.create_contact(demo_request)
        
        if hubspot_result["success"]:
            contact_id = hubspot_result["contact_id"]
            
            # Save to database
            demo_record = {
                "id": str(uuid.uuid4()),
                "contact_id": contact_id,
                "email": demo_request.email,
                "name": demo_request.name,
                "company": demo_request.company,
                "phone": demo_request.phone,
                "call_volume": demo_request.call_volume,
                "message": demo_request.message,
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "source": "website_form"
            }
            
            await db.demo_requests.insert_one(demo_record)
            
            # Schedule email notifications as background tasks
            background_tasks.add_task(
                email_service.send_demo_confirmation,
                demo_request.email,
                demo_request.name,
                contact_id
            )
            
            background_tasks.add_task(
                email_service.send_internal_notification,
                demo_request,
                contact_id
            )
            
            logger.info(f"Demo request created successfully: {contact_id}")
            
            return DemoRequestResponse(
                success=True,
                contact_id=contact_id,
                message="Demo request submitted successfully! We'll contact you within 1-2 business days.",
                reference_id=demo_record["id"]
            )
        else:
            raise HTTPException(status_code=400, detail=hubspot_result["message"])
            
    except Exception as e:
        logger.error(f"Demo request creation failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to process demo request. Please try again.")

@api_router.get("/demo/requests", response_model=List[dict])
async def get_demo_requests(limit: int = 50):
    """Get recent demo requests (for admin/debugging)"""
    try:
        requests = await db.demo_requests.find().sort("timestamp", -1).limit(limit).to_list(limit)
        
        # Convert ObjectId to string for JSON serialization
        for request in requests:
            if '_id' in request:
                request['_id'] = str(request['_id'])
        
        return requests
    except Exception as e:
        logger.error(f"Error fetching demo requests: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Error fetching demo requests: {str(e)}")

@api_router.get("/debug/hubspot/contacts")
async def debug_hubspot_contacts():
    """Debug endpoint to see mock HubSpot contacts"""
    return {
        "contacts": hubspot_service.get_all_contacts(),
        "total_contacts": len(hubspot_service.get_all_contacts())
    }

@api_router.get("/debug/emails")
async def debug_sent_emails():
    """Debug endpoint to see sent emails"""
    return {
        "sent_emails": email_service.get_sent_emails(),
        "total_emails": len(email_service.get_sent_emails())
    }

# Live Chat API Routes
@api_router.post("/chat/session")
async def create_chat_session(user_id: Optional[str] = None):
    """Create a new chat session"""
    try:
        session_id = await chat_service.create_chat_session(user_id)
        return {
            "success": True,
            "session_id": session_id,
            "message": "Chat session created successfully"
        }
    except Exception as e:
        logger.error(f"Error creating chat session: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to create chat session")

@api_router.get("/chat/session/{session_id}/history")
async def get_chat_history(session_id: str, limit: int = 50):
    """Get chat history for a session"""
    try:
        messages = await chat_service.get_chat_history(session_id, limit)
        return {
            "success": True,
            "messages": [
                {
                    "id": msg.id,
                    "content": msg.content,
                    "sender": msg.sender,
                    "timestamp": msg.timestamp.isoformat()
                }
                for msg in messages
            ]
        }
    except Exception as e:
        logger.error(f"Error fetching chat history: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch chat history")

@api_router.post("/chat/message")
async def send_chat_message(session_id: str, message: str):
    """Send a message via REST API (fallback for non-WebSocket clients)"""
    try:
        # Save user message
        user_message = await chat_service.save_message(session_id, message, "user")
        
        # Get AI response
        ai_response_content = await chat_service.get_ai_response(session_id, message)
        
        # Save AI response
        ai_message = await chat_service.save_message(session_id, ai_response_content, "assistant")
        
        return {
            "success": True,
            "user_message": {
                "id": user_message.id,
                "content": user_message.content,
                "sender": user_message.sender,
                "timestamp": user_message.timestamp.isoformat()
            },
            "ai_response": {
                "id": ai_message.id,
                "content": ai_message.content,
                "sender": ai_message.sender,
                "timestamp": ai_message.timestamp.isoformat()
            }
        }
    except Exception as e:
        logger.error(f"Error processing chat message: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to process message")

# WebSocket endpoint for real-time chat
@app.websocket("/ws/chat/{session_id}")
async def websocket_endpoint(websocket: WebSocket, session_id: str):
    await connection_manager.connect(websocket, session_id)
    try:
        # Send welcome message
        welcome_message = {
            "type": "system",
            "content": "Connected to SentraTech AI Assistant. How can I help you today?",
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        await websocket.send_text(json.dumps(welcome_message))
        
        while True:
            # Receive message from client
            data = await websocket.receive_text()
            message_data = json.loads(data)
            
            if message_data.get("type") == "user_message":
                user_content = message_data.get("content", "")
                
                if user_content.strip():
                    # Save user message
                    user_message = await chat_service.save_message(session_id, user_content, "user")
                    
                    # Send typing indicator
                    await connection_manager.send_typing_indicator(session_id, True)
                    
                    # Get AI response
                    ai_response_content = await chat_service.get_ai_response(session_id, user_content)
                    
                    # Stop typing indicator
                    await connection_manager.send_typing_indicator(session_id, False)
                    
                    # Save AI response
                    ai_message = await chat_service.save_message(session_id, ai_response_content, "assistant")
                    
                    # Send AI response to client
                    response_message = {
                        "type": "ai_response",
                        "id": ai_message.id,
                        "content": ai_response_content,
                        "sender": "assistant",
                        "timestamp": ai_message.timestamp.isoformat()
                    }
                    await websocket.send_text(json.dumps(response_message))
                    
            elif message_data.get("type") == "ping":
                # Respond to ping to keep connection alive
                pong_message = {
                    "type": "pong",
                    "timestamp": datetime.now(timezone.utc).isoformat()
                }
                await websocket.send_text(json.dumps(pong_message))
                
    except WebSocketDisconnect:
        connection_manager.disconnect(session_id)
        logger.info(f"Client disconnected from session: {session_id}")
    except Exception as e:
        logger.error(f"WebSocket error for session {session_id}: {str(e)}")
        connection_manager.disconnect(session_id)

# Real-time Metrics Models
class MetricSnapshot(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    active_chats: int
    response_time_ms: float
    automation_rate: float
    customer_satisfaction: float
    resolution_rate: float
    daily_volume: int
    cost_savings: float
    agent_utilization: float

class DashboardMetrics(BaseModel):
    current_metrics: MetricSnapshot
    trends: Dict[str, List[float]]
    alerts: List[Dict[str, Any]]
    uptime: float

class MetricsHistory(BaseModel):
    metric_name: str
    values: List[float]
    timestamps: List[str]
    timeframe: str  # "1h", "24h", "7d", "30d"

# Real-time Metrics Service
class MetricsService:
    def __init__(self):
        self.base_metrics = {
            "active_chats": 145,
            "response_time_ms": 47.5,
            "automation_rate": 0.72,
            "customer_satisfaction": 0.96,
            "resolution_rate": 0.94,
            "daily_volume": 2847,
            "cost_savings": 125000.0,
            "agent_utilization": 0.83
        }
        
    def generate_realistic_variation(self, base_value: float, variation_percent: float = 0.05) -> float:
        """Generate realistic variations in metrics"""
        import random
        variation = random.uniform(-variation_percent, variation_percent)
        return base_value * (1 + variation)
    
    async def get_current_metrics(self) -> MetricSnapshot:
        """Generate current real-time metrics with realistic variations"""
        import random
        
        # Simulate realistic variations
        metrics = {
            "active_chats": max(1, int(self.generate_realistic_variation(self.base_metrics["active_chats"], 0.15))),
            "response_time_ms": max(10, self.generate_realistic_variation(self.base_metrics["response_time_ms"], 0.20)),
            "automation_rate": min(1.0, max(0.5, self.generate_realistic_variation(self.base_metrics["automation_rate"], 0.08))),
            "customer_satisfaction": min(1.0, max(0.8, self.generate_realistic_variation(self.base_metrics["customer_satisfaction"], 0.03))),
            "resolution_rate": min(1.0, max(0.85, self.generate_realistic_variation(self.base_metrics["resolution_rate"], 0.05))),
            "daily_volume": max(100, int(self.generate_realistic_variation(self.base_metrics["daily_volume"], 0.25))),
            "cost_savings": max(50000, self.generate_realistic_variation(self.base_metrics["cost_savings"], 0.12)),
            "agent_utilization": min(1.0, max(0.6, self.generate_realistic_variation(self.base_metrics["agent_utilization"], 0.10)))
        }
        
        return MetricSnapshot(**metrics)
    
    async def get_dashboard_data(self) -> DashboardMetrics:
        """Get complete dashboard data including trends and alerts"""
        current = await self.get_current_metrics()
        
        # Generate trend data (last 24 data points)
        trends = {}
        for metric in ["response_time_ms", "automation_rate", "customer_satisfaction", "active_chats"]:
            trend_values = []
            base_val = getattr(current, metric)
            for i in range(24):
                # Simulate hourly trend data
                variation = self.generate_realistic_variation(base_val, 0.1)
                trend_values.append(round(variation, 2))
            trends[metric] = trend_values
        
        # Generate alerts
        alerts = []
        if current.response_time_ms > 60:
            alerts.append({
                "type": "warning",
                "message": f"Response time elevated: {current.response_time_ms:.1f}ms",
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "severity": "medium"
            })
        
        if current.customer_satisfaction < 0.90:
            alerts.append({
                "type": "alert", 
                "message": f"Customer satisfaction below target: {current.customer_satisfaction:.1%}",
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "severity": "high"
            })
            
        # Calculate uptime (simulate 99.9% with occasional variations)
        uptime = min(100, max(99.5, self.generate_realistic_variation(99.92, 0.005)))
        
        return DashboardMetrics(
            current_metrics=current,
            trends=trends,
            alerts=alerts,
            uptime=round(uptime, 2)
        )
    
    async def save_metric_snapshot(self, snapshot: MetricSnapshot):
        """Save metrics snapshot to database for historical analysis"""
        snapshot_dict = snapshot.dict()
        snapshot_dict['timestamp'] = snapshot_dict['timestamp'].isoformat()
        await db.metrics_snapshots.insert_one(snapshot_dict)
    
    async def get_metrics_history(self, metric_name: str, timeframe: str = "24h") -> MetricsHistory:
        """Get historical metrics data"""
        # Calculate time range
        hours_map = {"1h": 1, "24h": 24, "7d": 168, "30d": 720}
        hours = hours_map.get(timeframe, 24)
        
        start_time = datetime.now(timezone.utc) - timedelta(hours=hours)
        
        # Query database for historical data
        cursor = db.metrics_snapshots.find({
            "timestamp": {"$gte": start_time.isoformat()},
        }).sort("timestamp", 1)
        
        values = []
        timestamps = []
        
        async for doc in cursor:
            if metric_name in doc:
                values.append(doc[metric_name])
                timestamps.append(doc["timestamp"])
        
        # If no data, generate sample data
        if not values:
            current = await self.get_current_metrics()
            base_value = getattr(current, metric_name, 0)
            
            for i in range(min(24, hours)):
                values.append(self.generate_realistic_variation(base_value, 0.1))
                timestamp = start_time + timedelta(hours=i)
                timestamps.append(timestamp.isoformat())
        
        return MetricsHistory(
            metric_name=metric_name,
            values=values,
            timestamps=timestamps,
            timeframe=timeframe
        )

# Initialize metrics service
metrics_service = MetricsService()

# Metrics API Endpoints
@api_router.get("/metrics/live", response_model=MetricSnapshot)
async def get_live_metrics():
    """Get current real-time metrics"""
    try:
        metrics = await metrics_service.get_current_metrics()
        # Save snapshot for historical analysis
        await metrics_service.save_metric_snapshot(metrics)
        return metrics
    except Exception as e:
        logger.error(f"Error getting live metrics: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get live metrics")

@api_router.get("/metrics/dashboard", response_model=DashboardMetrics)
async def get_dashboard_metrics():
    """Get complete dashboard data including metrics, trends, and alerts"""
    try:
        return await metrics_service.get_dashboard_data()
    except Exception as e:
        logger.error(f"Error getting dashboard metrics: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get dashboard metrics")

@api_router.get("/metrics/history/{metric_name}", response_model=MetricsHistory)
async def get_metric_history(metric_name: str, timeframe: str = "24h"):
    """Get historical data for a specific metric"""
    try:
        return await metrics_service.get_metrics_history(metric_name, timeframe)
    except Exception as e:
        logger.error(f"Error getting metric history: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get metric history")

@api_router.get("/metrics/kpis")
async def get_key_performance_indicators():
    """Get key performance indicators for hero section display"""
    try:
        current = await metrics_service.get_current_metrics()
        
        return {
            "response_time": f"{current.response_time_ms:.0f}ms",
            "automation_rate": f"{current.automation_rate:.0%}", 
            "uptime": "99.9%",
            "satisfaction": f"{current.customer_satisfaction:.0%}",
            "cost_savings": f"${current.cost_savings:,.0f}",
            "daily_volume": f"{current.daily_volume:,}",
            "resolution_rate": f"{current.resolution_rate:.0%}"
        }
    except Exception as e:
        logger.error(f"Error getting KPIs: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get KPIs")

# WebSocket for real-time metrics updates
@app.websocket("/ws/metrics")
async def websocket_metrics_endpoint(websocket: WebSocket):
    """WebSocket endpoint for real-time metrics updates"""
    await websocket.accept()
    
    try:
        while True:
            # Send updated metrics every 5 seconds
            metrics = await metrics_service.get_current_metrics()
            metrics_dict = metrics.dict()
            metrics_dict['timestamp'] = metrics_dict['timestamp'].isoformat()
            
            await websocket.send_text(json.dumps({
                "type": "metrics_update",
                "data": metrics_dict
            }))
            
            await asyncio.sleep(5)  # Update every 5 seconds
            
    except WebSocketDisconnect:
        logger.info("Metrics WebSocket client disconnected")
    except Exception as e:
        logger.error(f"Metrics WebSocket error: {str(e)}")

# Analytics & Tracking Models
class PageView(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    session_id: str
    user_id: Optional[str] = None
    page_path: str
    page_title: str
    referrer: Optional[str] = None
    user_agent: str
    ip_address: str
    device_type: str  # "desktop", "mobile", "tablet"
    browser: str
    os: str
    country: Optional[str] = None
    duration: Optional[int] = None  # Time spent on page in seconds

class UserInteraction(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    session_id: str
    user_id: Optional[str] = None
    event_type: str  # "click", "form_submit", "scroll", "download", etc.
    element_id: Optional[str] = None
    element_class: Optional[str] = None
    element_text: Optional[str] = None
    page_path: str
    additional_data: Optional[Dict[str, Any]] = None

class ConversionEvent(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    session_id: str
    user_id: Optional[str] = None
    event_name: str  # "demo_request", "roi_calculation", "chat_started", etc.
    funnel_step: str
    conversion_value: Optional[float] = None
    page_path: str
    source: str  # "organic", "direct", "social", etc.
    campaign: Optional[str] = None

class PerformanceMetric(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    session_id: str
    page_path: str
    metric_name: str  # "page_load_time", "api_response_time", etc.
    metric_value: float
    additional_context: Optional[Dict[str, Any]] = None

class AnalyticsRequest(BaseModel):
    session_id: str
    user_id: Optional[str] = None
    event_type: str
    page_path: str
    page_title: Optional[str] = None
    referrer: Optional[str] = None
    user_agent: Optional[str] = None
    additional_data: Optional[Dict[str, Any]] = None

class AnalyticsStats(BaseModel):
    total_page_views: int
    unique_visitors: int
    avg_session_duration: float
    bounce_rate: float
    top_pages: List[Dict[str, Any]]
    conversion_rate: float
    device_breakdown: Dict[str, int]
    traffic_sources: Dict[str, int]

# Analytics & Tracking Service
class AnalyticsService:
    def __init__(self):
        self.session_data = {}  # In-memory session tracking
        
    def parse_user_agent(self, user_agent: str) -> Dict[str, str]:
        """Parse user agent to extract browser, OS, and device info"""
        # Simple user agent parsing (in production, use a proper library)
        device_type = "desktop"
        browser = "unknown"
        os = "unknown"
        
        if user_agent:
            user_agent_lower = user_agent.lower()
            
            # Device detection
            if "mobile" in user_agent_lower or "android" in user_agent_lower:
                device_type = "mobile"
            elif "tablet" in user_agent_lower or "ipad" in user_agent_lower:
                device_type = "tablet"
                
            # Browser detection
            if "chrome" in user_agent_lower:
                browser = "Chrome"
            elif "firefox" in user_agent_lower:
                browser = "Firefox"
            elif "safari" in user_agent_lower and "chrome" not in user_agent_lower:
                browser = "Safari"
            elif "edge" in user_agent_lower:
                browser = "Edge"
                
            # OS detection
            if "windows" in user_agent_lower:
                os = "Windows"
            elif "macintosh" in user_agent_lower or "mac os" in user_agent_lower:
                os = "macOS"
            elif "linux" in user_agent_lower:
                os = "Linux"
            elif "android" in user_agent_lower:
                os = "Android"
            elif "ios" in user_agent_lower or "iphone" in user_agent_lower:
                os = "iOS"
        
        return {
            "device_type": device_type,
            "browser": browser,
            "os": os
        }
    
    async def track_page_view(self, request, analytics_data: AnalyticsRequest):
        """Track a page view"""
        try:
            # Parse user agent
            user_info = self.parse_user_agent(analytics_data.user_agent or "")
            
            # Get client IP
            ip_address = request.client.host if request.client else "unknown"
            
            page_view = PageView(
                session_id=analytics_data.session_id,
                user_id=analytics_data.user_id,
                page_path=analytics_data.page_path,
                page_title=analytics_data.page_title or "",
                referrer=analytics_data.referrer,
                user_agent=analytics_data.user_agent or "",
                ip_address=ip_address,
                device_type=user_info["device_type"],
                browser=user_info["browser"],
                os=user_info["os"]
            )
            
            # Save to database
            page_view_dict = page_view.dict()
            page_view_dict['timestamp'] = page_view_dict['timestamp'].isoformat()
            await db.page_views.insert_one(page_view_dict)
            
            # Update session data
            self.session_data[analytics_data.session_id] = {
                "last_activity": datetime.now(timezone.utc),
                "page_count": self.session_data.get(analytics_data.session_id, {}).get("page_count", 0) + 1
            }
            
            logger.info(f"Page view tracked: {analytics_data.page_path} - Session: {analytics_data.session_id}")
            return {"success": True, "page_view_id": page_view.id}
            
        except Exception as e:
            logger.error(f"Error tracking page view: {str(e)}")
            return {"success": False, "error": str(e)}
    
    async def track_user_interaction(self, request, analytics_data: AnalyticsRequest):
        """Track user interaction event"""
        try:
            interaction = UserInteraction(
                session_id=analytics_data.session_id,
                user_id=analytics_data.user_id,
                event_type=analytics_data.event_type,
                page_path=analytics_data.page_path,
                element_id=analytics_data.additional_data.get("element_id") if analytics_data.additional_data else None,
                element_class=analytics_data.additional_data.get("element_class") if analytics_data.additional_data else None,
                element_text=analytics_data.additional_data.get("element_text") if analytics_data.additional_data else None,
                additional_data=analytics_data.additional_data
            )
            
            # Save to database
            interaction_dict = interaction.dict()
            interaction_dict['timestamp'] = interaction_dict['timestamp'].isoformat()
            await db.user_interactions.insert_one(interaction_dict)
            
            logger.info(f"User interaction tracked: {analytics_data.event_type} - Session: {analytics_data.session_id}")
            return {"success": True, "interaction_id": interaction.id}
            
        except Exception as e:
            logger.error(f"Error tracking user interaction: {str(e)}")
            return {"success": False, "error": str(e)}
    
    async def track_conversion_event(self, session_id: str, event_name: str, page_path: str, 
                                   funnel_step: str, conversion_value: Optional[float] = None,
                                   user_id: Optional[str] = None):
        """Track conversion event"""
        try:
            conversion = ConversionEvent(
                session_id=session_id,
                user_id=user_id,
                event_name=event_name,
                funnel_step=funnel_step,
                conversion_value=conversion_value,
                page_path=page_path,
                source="direct",  # Could be enhanced with referrer analysis
            )
            
            # Save to database
            conversion_dict = conversion.dict()
            conversion_dict['timestamp'] = conversion_dict['timestamp'].isoformat()
            await db.conversion_events.insert_one(conversion_dict)
            
            logger.info(f"Conversion tracked: {event_name} - Session: {session_id}")
            return {"success": True, "conversion_id": conversion.id}
            
        except Exception as e:
            logger.error(f"Error tracking conversion: {str(e)}")
            return {"success": False, "error": str(e)}
    
    async def get_analytics_stats(self, timeframe: str = "24h") -> AnalyticsStats:
        """Get analytics statistics"""
        try:
            # Calculate time range
            hours_map = {"1h": 1, "24h": 24, "7d": 168, "30d": 720}
            hours = hours_map.get(timeframe, 24)
            start_time = datetime.now(timezone.utc) - timedelta(hours=hours)
            
            # Get page views
            page_views_cursor = db.page_views.find({
                "timestamp": {"$gte": start_time.isoformat()}
            })
            
            page_views = []
            unique_sessions = set()
            device_breakdown = {"desktop": 0, "mobile": 0, "tablet": 0}
            page_counts = {}
            
            async for pv in page_views_cursor:
                page_views.append(pv)
                unique_sessions.add(pv["session_id"])
                device_breakdown[pv.get("device_type", "desktop")] += 1
                page_counts[pv.get("page_path", "/")] = page_counts.get(pv.get("page_path", "/"), 0) + 1
            
            # Calculate top pages
            top_pages = [
                {"page": path, "views": count}
                for path, count in sorted(page_counts.items(), key=lambda x: x[1], reverse=True)[:5]
            ]
            
            # Get conversions
            conversions_count = await db.conversion_events.count_documents({
                "timestamp": {"$gte": start_time.isoformat()}
            })
            
            # Calculate metrics
            total_page_views = len(page_views)
            unique_visitors = len(unique_sessions)
            conversion_rate = (conversions_count / max(unique_visitors, 1)) * 100
            bounce_rate = 45.2  # Simulated for now
            avg_session_duration = 180.5  # Simulated for now
            
            return AnalyticsStats(
                total_page_views=total_page_views,
                unique_visitors=unique_visitors,
                avg_session_duration=avg_session_duration,
                bounce_rate=bounce_rate,
                top_pages=top_pages,
                conversion_rate=conversion_rate,
                device_breakdown=device_breakdown,
                traffic_sources={"direct": 60, "organic": 25, "social": 10, "referral": 5}
            )
            
        except Exception as e:
            logger.error(f"Error getting analytics stats: {str(e)}")
            # Return default stats on error
            return AnalyticsStats(
                total_page_views=0,
                unique_visitors=0,
                avg_session_duration=0.0,
                bounce_rate=0.0,
                top_pages=[],
                conversion_rate=0.0,
                device_breakdown={"desktop": 0, "mobile": 0, "tablet": 0},
                traffic_sources={}
            )

# Initialize analytics service
analytics_service = AnalyticsService()

# Analytics API Endpoints
@api_router.post("/analytics/track")
async def track_analytics_event(request: Request, analytics_data: AnalyticsRequest):
    """Track analytics event (page view or interaction)"""
    try:
        if analytics_data.event_type == "page_view":
            result = await analytics_service.track_page_view(request, analytics_data)
        else:
            result = await analytics_service.track_user_interaction(request, analytics_data)
        
        return result
    except Exception as e:
        logger.error(f"Error tracking analytics event: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to track event")

@api_router.post("/analytics/conversion")
async def track_conversion(
    session_id: str,
    event_name: str,
    page_path: str,
    funnel_step: str,
    conversion_value: Optional[float] = None,
    user_id: Optional[str] = None
):
    """Track conversion event"""
    try:
        result = await analytics_service.track_conversion_event(
            session_id, event_name, page_path, funnel_step, conversion_value, user_id
        )
        return result
    except Exception as e:
        logger.error(f"Error tracking conversion: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to track conversion")

@api_router.get("/analytics/stats", response_model=AnalyticsStats)
async def get_analytics_statistics(timeframe: str = "24h"):
    """Get analytics statistics"""
    try:
        return await analytics_service.get_analytics_stats(timeframe)
    except Exception as e:
        logger.error(f"Error getting analytics stats: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get analytics stats")

@api_router.get("/analytics/performance")
async def get_performance_metrics(timeframe: str = "24h"):
    """Get performance metrics"""
    try:
        # Calculate time range
        hours_map = {"1h": 1, "24h": 24, "7d": 168, "30d": 720}
        hours = hours_map.get(timeframe, 24)
        start_time = datetime.now(timezone.utc) - timedelta(hours=hours)
        
        # Get performance data
        perf_cursor = db.performance_metrics.find({
            "timestamp": {"$gte": start_time.isoformat()}
        })
        
        metrics_data = {"page_load_times": [], "api_response_times": []}
        async for metric in perf_cursor:
            if metric.get("metric_name") == "page_load_time":
                metrics_data["page_load_times"].append(metric.get("metric_value", 0))
            elif metric.get("metric_name") == "api_response_time":
                metrics_data["api_response_times"].append(metric.get("metric_value", 0))
        
        # Calculate averages
        avg_page_load = sum(metrics_data["page_load_times"]) / len(metrics_data["page_load_times"]) if metrics_data["page_load_times"] else 2.1
        avg_api_response = sum(metrics_data["api_response_times"]) / len(metrics_data["api_response_times"]) if metrics_data["api_response_times"] else 45.3
        
        return {
            "avg_page_load_time": round(avg_page_load, 2),
            "avg_api_response_time": round(avg_api_response, 2),
            "total_requests": len(metrics_data["page_load_times"]) + len(metrics_data["api_response_times"]),
            "performance_score": min(100, max(0, 100 - (avg_page_load * 10) - (avg_api_response / 2)))
        }
        
    except Exception as e:
        logger.error(f"Error getting performance metrics: {str(e)}")
        return {
            "avg_page_load_time": 2.1,
            "avg_api_response_time": 45.3,
            "total_requests": 0,
            "performance_score": 85
        }

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
