from fastapi import FastAPI, APIRouter, HTTPException, BackgroundTasks
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr, validator
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone
import asyncio
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

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
    company: str = ""
    phone: str = ""
    call_volume: str = ""
    message: str = ""
    
    @validator('name')
    def name_must_not_be_empty(cls, v):
        if not v or not v.strip():
            raise ValueError('Name cannot be empty')
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
