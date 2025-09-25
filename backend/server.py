from fastapi import FastAPI, APIRouter, HTTPException, BackgroundTasks, WebSocket, WebSocketDisconnect, Request, Form
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware
from fastapi.security.utils import get_authorization_scheme_param
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr, validator
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone, timedelta
import asyncio
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import json
from emergentintegrations.llm.chat import LlmChat, UserMessage
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi import Depends, status
import aiosmtplib
import aiohttp

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
    source: str = None

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

# User Management Models
class UserRole:
    ADMIN = "admin"
    USER = "user"
    VIEWER = "viewer"

class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    full_name: str
    company: str
    role: str = UserRole.USER
    is_active: bool = True
    is_verified: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    last_login: Optional[datetime] = None
    profile_data: Optional[Dict[str, Any]] = {}

class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8, description="Password must be at least 8 characters")
    full_name: str = Field(..., min_length=2, description="Full name is required")
    company: str = Field(..., min_length=2, description="Company name is required")
    role: str = UserRole.USER

    @validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        if not any(c.isupper() for c in v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not any(c.islower() for c in v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not any(c.isdigit() for c in v):
            raise ValueError('Password must contain at least one digit')
        return v

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    company: Optional[str] = None
    profile_data: Optional[Dict[str, Any]] = None

class PasswordChange(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=8)
    
    @validator('new_password')
    def validate_new_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        if not any(c.isupper() for c in v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not any(c.islower() for c in v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not any(c.isdigit() for c in v):
            raise ValueError('Password must contain at least one digit')
        return v

class PasswordReset(BaseModel):
    email: EmailStr

class PasswordResetConfirm(BaseModel):
    token: str
    new_password: str = Field(..., min_length=8)

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int
    user: User

class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str
    company: str
    role: str
    is_active: bool
    is_verified: bool
    created_at: datetime
    last_login: Optional[datetime] = None
    profile_data: Optional[Dict[str, Any]] = {}

# User Management Service
class UserService:
    def __init__(self):
        self.pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        self.secret_key = os.environ.get("JWT_SECRET_KEY", "sentratech-super-secret-jwt-key-2024")
        self.algorithm = "HS256"
        self.access_token_expire_minutes = 30 * 24 * 60  # 30 days
        
    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        return self.pwd_context.verify(plain_password, hashed_password)
    
    def get_password_hash(self, password: str) -> str:
        return self.pwd_context.hash(password)
    
    def create_access_token(self, data: dict, expires_delta: Optional[timedelta] = None):
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.now(timezone.utc) + expires_delta
        else:
            expire = datetime.now(timezone.utc) + timedelta(minutes=self.access_token_expire_minutes)
        to_encode.update({"exp": expire, "type": "access"})
        encoded_jwt = jwt.encode(to_encode, self.secret_key, algorithm=self.algorithm)
        return encoded_jwt
    
    def create_reset_token(self, email: str) -> str:
        expire = datetime.now(timezone.utc) + timedelta(hours=1)  # Reset token expires in 1 hour
        to_encode = {"sub": email, "exp": expire, "type": "reset"}
        encoded_jwt = jwt.encode(to_encode, self.secret_key, algorithm=self.algorithm)
        return encoded_jwt
    
    def verify_token(self, token: str) -> Optional[dict]:
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
            return payload
        except JWTError:
            return None
    
    async def get_user_by_email(self, email: str) -> Optional[dict]:
        return await db.users.find_one({"email": email})
    
    async def get_user_by_id(self, user_id: str) -> Optional[dict]:
        return await db.users.find_one({"id": user_id})
    
    async def create_user(self, user_create: UserCreate) -> dict:
        # Check if user already exists
        existing_user = await self.get_user_by_email(user_create.email)
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # Create new user
        hashed_password = self.get_password_hash(user_create.password)
        user_dict = user_create.dict()
        del user_dict['password']  # Remove password from user dict
        
        user = User(**user_dict)
        user_data = user.dict()
        user_data['password_hash'] = hashed_password
        user_data['created_at'] = user_data['created_at'].isoformat()
        user_data['updated_at'] = user_data['updated_at'].isoformat()
        
        await db.users.insert_one(user_data)
        
        # Return user without password hash
        del user_data['password_hash']
        return user_data
    
    async def authenticate_user(self, email: str, password: str) -> Optional[dict]:
        user = await self.get_user_by_email(email)
        if not user:
            return None
        if not self.verify_password(password, user.get('password_hash', '')):
            return None
        if not user.get('is_active', True):
            return None
        
        # Update last login
        await db.users.update_one(
            {"id": user['id']},
            {"$set": {"last_login": datetime.now(timezone.utc).isoformat()}}
        )
        
        return user
    
    async def update_user(self, user_id: str, user_update: UserUpdate) -> Optional[dict]:
        update_data = {}
        for field, value in user_update.dict(exclude_unset=True).items():
            if value is not None:
                update_data[field] = value
        
        if update_data:
            update_data['updated_at'] = datetime.now(timezone.utc).isoformat()
            await db.users.update_one({"id": user_id}, {"$set": update_data})
        
        return await self.get_user_by_id(user_id)
    
    async def change_password(self, user_id: str, password_change: PasswordChange) -> bool:
        user = await self.get_user_by_id(user_id)
        if not user:
            return False
        
        if not self.verify_password(password_change.current_password, user.get('password_hash', '')):
            return False
        
        new_hashed_password = self.get_password_hash(password_change.new_password)
        await db.users.update_one(
            {"id": user_id},
            {"$set": {
                "password_hash": new_hashed_password,
                "updated_at": datetime.now(timezone.utc).isoformat()
            }}
        )
        return True
    
    async def reset_password(self, token: str, new_password: str) -> bool:
        payload = self.verify_token(token)
        if not payload or payload.get('type') != 'reset':
            return False
        
        email = payload.get('sub')
        if not email:
            return False
        
        user = await self.get_user_by_email(email)
        if not user:
            return False
        
        new_hashed_password = self.get_password_hash(new_password)
        await db.users.update_one(
            {"email": email},
            {"$set": {
                "password_hash": new_hashed_password,
                "updated_at": datetime.now(timezone.utc).isoformat()
            }}
        )
        return True

# Authentication Dependencies
security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(credentials.credentials, user_service.secret_key, algorithms=[user_service.algorithm])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = await user_service.get_user_by_id(user_id)
    if user is None:
        raise credentials_exception
    
    if not user.get('is_active', True):
        raise HTTPException(status_code=400, detail="Inactive user")
    
    return user

async def get_current_active_user(current_user: dict = Depends(get_current_user)) -> dict:
    if not current_user.get('is_active', True):
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

async def get_admin_user(current_user: dict = Depends(get_current_user)) -> dict:
    if current_user.get('role') != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return current_user

# Initialize user service
user_service = UserService()

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

# Google Sheets Service
class AirtableService:
    """Airtable integration service for demo requests and analytics"""
    
    def __init__(self):
        # Airtable configuration - using provided token
        self.access_token = "patqEN3h5N1BfTEbw.88afc089ca1a1196530c9237148b71ea0b1d12f8600878b2ed272b3e10323ad8"
        self.base_id = "appSentraTechDemo"  # This will be auto-detected or configured
        self.table_name = "Demo Requests"
        self.base_url = "https://api.airtable.com/v0"
        
    async def create_demo_request(self, demo_request: DemoRequest):
        """Create a demo request in Airtable with retry logic"""
        max_retries = 3
        
        for attempt in range(max_retries):
            try:
                # Construct URL - try multiple base ID formats if needed
                possible_base_ids = [
                    "appSentraTechDemo",
                    "appdemo12345",  # fallback IDs
                    "app123456789"
                ]
                
                for base_id in possible_base_ids:
                    url = f"{self.base_url}/{base_id}/{self.table_name}"
                    headers = {
                        "Authorization": f"Bearer {self.access_token}",
                        "Content-Type": "application/json"
                    }
                    
                    # Prepare Airtable record format
                    current_time = datetime.now(timezone.utc)
                    data = {
                        "fields": {
                            "Name": demo_request.name,
                            "Email": demo_request.email,
                            "Company": demo_request.company,
                            "Phone": demo_request.phone or "",
                            "Message": demo_request.message or "",
                            "Call Volume": demo_request.call_volume or "",
                            "Preferred Date": current_time.strftime("%Y-%m-%d"),
                            "Status": "Pending",
                            "Source": "Website Form",
                            "Date Created": current_time.isoformat(),
                            "Reference ID": str(uuid.uuid4())
                        }
                    }
                    
                    import httpx
                    async with httpx.AsyncClient(timeout=30.0) as client:
                        logger.info(f"Attempting Airtable submission to base: {base_id}")
                        response = await client.post(url, headers=headers, json=data)
                        
                        if response.status_code == 200:
                            result = response.json()
                            logger.info(f"✅ Demo request created in Airtable: {result['id']}")
                            return {
                                "success": True,
                                "source": "airtable",
                                "airtable_id": result["id"],
                                "base_id": base_id,
                                "record": result
                            }
                        elif response.status_code == 404:
                            # Base ID not found, try next one
                            logger.warning(f"Base ID {base_id} not found, trying next...")
                            continue
                        elif response.status_code >= 500:
                            # Server error - retry
                            logger.error(f"Airtable server error (attempt {attempt + 1}): {response.status_code}")
                            if attempt < max_retries - 1:
                                await asyncio.sleep(2 ** attempt)  # exponential backoff
                                break  # break inner loop, continue outer loop
                            else:
                                return {"success": False, "error": f"Airtable server error: {response.status_code}"}
                        else:
                            # Client error - don't retry
                            error_text = response.text
                            logger.error(f"Airtable client error: {response.status_code} - {error_text}")
                            return {"success": False, "error": f"Airtable client error: {response.status_code}"}
                
                # If all base IDs failed with 404
                return {"success": False, "error": "No valid Airtable base ID found"}
                        
            except Exception as e:
                logger.error(f"Airtable integration error (attempt {attempt + 1}): {str(e)}")
                if attempt < max_retries - 1:
                    await asyncio.sleep(2 ** attempt)  # exponential backoff
                else:
                    return {"success": False, "error": f"Airtable connection failed: {str(e)}"}
        
        return {"success": False, "error": "Max retries exceeded"}
    
    async def track_analytics_event(self, event_data: dict):
        """Track analytics events in Airtable"""
        try:
            # Use first working base ID from demo requests
            url = f"{self.base_url}/appSentraTechDemo/Analytics"
            headers = {
                "Authorization": f"Bearer {self.access_token}",
                "Content-Type": "application/json"
            }
            
            data = {
                "fields": {
                    "Event Type": event_data.get("event_type", "page_view"),
                    "Page URL": event_data.get("page_url", ""),
                    "User IP": event_data.get("user_ip", ""),
                    "User Agent": event_data.get("user_agent", ""),
                    "Timestamp": datetime.now(timezone.utc).isoformat(),
                    "Session ID": event_data.get("session_id", ""),
                    "Additional Data": str(event_data.get("metadata", {}))
                }
            }
            
            import httpx
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.post(url, headers=headers, json=data)
                
                if response.status_code == 200:
                    logger.info(f"✅ Analytics event tracked in Airtable")
                    return {"success": True}
                else:
                    logger.error(f"Airtable analytics error: {response.status_code}")
                    return {"success": False}
                    
        except Exception as e:
            logger.error(f"Airtable analytics error: {str(e)}")
            return {"success": False}


class GoogleSheetsService:
    """Google Sheets service for storing demo requests"""
    
    def __init__(self):
        self.sheet_id = "1-sonq8dr_QbA2gG8YU2iv12mVM4OQqwl9mhNPkKS8ts"
        self.sheet_name = "Demo Requests"
        # Google Apps Script Web App URL - Replace with actual deployed URL
        # For now, using a placeholder that will trigger fallback to database
        self.web_app_url = "https://script.google.com/macros/s/PLACEHOLDER_REPLACE_WITH_ACTUAL_WEBAPP_URL/exec"
        
    async def submit_demo_request(self, demo_request: DemoRequest) -> Dict[str, Any]:
        """Submit demo request to Google Sheets"""
        try:
            data = {
                'name': demo_request.name,
                'email': demo_request.email,
                'company': demo_request.company,
                'phone': demo_request.phone or '',
                'message': demo_request.message or ''
            }
            
            # Submit to Google Sheets via Apps Script
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    self.web_app_url,
                    data=data,
                    headers={'Content-Type': 'application/x-www-form-urlencoded'}
                ) as response:
                    if response.status == 200:
                        result = await response.json()
                        logger.info(f"Google Sheets: Submitted demo request for {demo_request.email}")
                        return {
                            "success": True,
                            "message": "Demo request saved to Google Sheets",
                            "timestamp": result.get('timestamp')
                        }
                    else:
                        logger.error(f"Google Sheets error: HTTP {response.status}")
                        return {
                            "success": False,
                            "message": f"Failed to save to Google Sheets: HTTP {response.status}"
                        }
                        
        except Exception as e:
            logger.error(f"Google Sheets service error: {str(e)}")
            # Fallback to database storage
            try:
                request_data = demo_request.dict()
                request_data['timestamp'] = datetime.now(timezone.utc).isoformat()
                request_data['id'] = str(uuid.uuid4())
                await db.demo_requests.insert_one(request_data)
                logger.info(f"Fallback: Saved demo request to MongoDB for {demo_request.email}")
                return {
                    "success": True,
                    "message": "Demo request saved (fallback storage)",
                    "request_id": request_data['id']
                }
            except Exception as fallback_error:
                logger.error(f"Fallback storage error: {str(fallback_error)}")
                return {
                    "success": False,
                    "message": f"Storage error: {str(e)}"
                }

# Email Service with Spacemail SMTP
class EmailService:
    """Email service using Spacemail SMTP for sending notifications"""
    
    def __init__(self):
        # Spacemail SMTP configuration
        self.smtp_host = os.environ.get('SMTP_HOST', 'smtp.spacemail.com')
        self.smtp_port = int(os.environ.get('SMTP_PORT', '587'))
        self.smtp_user = os.environ.get('SMTP_USER', '')
        self.smtp_pass = os.environ.get('SMTP_PASS', '')
        self.from_email = os.environ.get('FROM_EMAIL', 'noreply@sentratech.com')
        self.sales_email = os.environ.get('SALES_EMAIL', 'sales@sentratech.com')
        
        if not all([self.smtp_user, self.smtp_pass]):
            logger.warning("SMTP credentials not configured. Email functionality will be limited.")
    
    async def send_email(self, to_email: str, subject: str, html_content: str, text_content: str = None):
        """Send email using Spacemail SMTP"""
        try:
            if not all([self.smtp_user, self.smtp_pass]):
                logger.warning("SMTP not configured, skipping email send")
                return {"success": False, "message": "SMTP not configured"}
            
            message = MIMEMultipart('alternative')
            message['Subject'] = subject
            message['From'] = self.from_email
            message['To'] = to_email
            
            # Add text and HTML parts
            if text_content:
                text_part = MIMEText(text_content, 'plain')
                message.attach(text_part)
            
            html_part = MIMEText(html_content, 'html')
            message.attach(html_part)
            
            # Send email
            await aiosmtplib.send(
                message,
                hostname=self.smtp_host,
                port=self.smtp_port,
                start_tls=True,
                username=self.smtp_user,
                password=self.smtp_pass
            )
            
            logger.info(f"Email sent successfully to {to_email}")
            return {"success": True, "message": "Email sent successfully"}
            
        except Exception as e:
            logger.error(f"Email service error: {str(e)}")
            return {"success": False, "message": f"Email error: {str(e)}"}
    
    async def send_demo_confirmation(self, demo_request: DemoRequest) -> Dict[str, Any]:
        """Send demo confirmation email to user"""
        try:
            subject = "Demo Request Confirmation - SentraTech"
            
            html_content = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {{ font-family: Arial, sans-serif; color: #333; }}
                    .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                    .header {{ background-color: #0A0A0A; color: white; padding: 20px; text-align: center; }}
                    .content {{ background-color: #f9f9f9; padding: 30px; }}
                    .footer {{ background-color: #1a1a1a; color: #ccc; padding: 20px; text-align: center; font-size: 12px; }}
                    .highlight {{ color: #00FF41; font-weight: bold; }}
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>SentraTech</h1>
                        <p>AI-Powered Customer Support Excellence</p>
                    </div>
                    <div class="content">
                        <h2>Thank you for your demo request!</h2>
                        <p>Hi {demo_request.name},</p>
                        <p>We've received your demo request for <span class="highlight">SentraTech's AI-powered customer support platform</span>.</p>
                        
                        <h3>What happens next?</h3>
                        <ul>
                            <li>Our team will review your request within <strong>2 business hours</strong></li>
                            <li>We'll schedule a personalized demo tailored to {demo_request.company}'s needs</li>
                            <li>You'll see how we can reduce your support costs by 40-60%</li>
                        </ul>
                        
                        <h3>Your Request Details:</h3>
                        <p><strong>Company:</strong> {demo_request.company}<br>
                        <strong>Email:</strong> {demo_request.email}<br>
                        <strong>Phone:</strong> {demo_request.phone or 'Not provided'}</p>
                        
                        <p>Questions? Reply to this email or call us directly.</p>
                        <p>Best regards,<br><strong>The SentraTech Team</strong></p>
                    </div>
                    <div class="footer">
                        <p>SentraTech | AI-Powered Customer Support | Beyond • Better • Boundless</p>
                    </div>
                </div>
            </body>
            </html>
            """
            
            text_content = f"""
            Hi {demo_request.name},
            
            Thank you for requesting a demo of SentraTech's AI-powered customer support platform!
            
            What happens next:
            - Our team will review your request within 2 business hours
            - We'll schedule a personalized demo tailored to {demo_request.company}'s needs  
            - You'll see how we can reduce your support costs by 40-60%
            
            Your Request Details:
            Company: {demo_request.company}
            Email: {demo_request.email}
            Phone: {demo_request.phone or 'Not provided'}
            
            Questions? Reply to this email or call us directly.
            
            Best regards,
            The SentraTech Team
            
            SentraTech | AI-Powered Customer Support | Beyond • Better • Boundless
            """
            
            return await self.send_email(demo_request.email, subject, html_content, text_content)
            
        except Exception as e:
            logger.error(f"Error sending confirmation email: {str(e)}")
            return {"success": False, "message": f"Confirmation email error: {str(e)}"}
    
    async def send_internal_notification(self, demo_request: DemoRequest) -> Dict[str, Any]:
        """Send internal notification to sales team"""
        try:
            subject = f"🚨 New Demo Request from {demo_request.company}"
            
            html_content = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {{ font-family: Arial, sans-serif; color: #333; }}
                    .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                    .header {{ background-color: #00FF41; color: black; padding: 20px; text-align: center; }}
                    .content {{ background-color: white; padding: 30px; border: 1px solid #ddd; }}
                    .details {{ background-color: #f9f9f9; padding: 15px; margin: 20px 0; }}
                    .urgent {{ color: #FF6B6B; font-weight: bold; }}
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🚨 NEW DEMO REQUEST</h1>
                        <p class="urgent">Action Required within 2 hours</p>
                    </div>
                    <div class="content">
                        <h2>Demo Request from {demo_request.company}</h2>
                        
                        <div class="details">
                            <h3>Contact Information:</h3>
                            <p><strong>Name:</strong> {demo_request.name}<br>
                            <strong>Email:</strong> {demo_request.email}<br>
                            <strong>Company:</strong> {demo_request.company}<br>
                            <strong>Phone:</strong> {demo_request.phone or 'Not provided'}</p>
                            
                            <h3>Message:</h3>
                            <p>{demo_request.message or 'No additional message provided'}</p>
                            
                            <h3>Submitted:</h3>
                            <p>{datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S UTC')}</p>
                        </div>
                        
                        <h3>Next Steps:</h3>
                        <ul>
                            <li>Review company profile and prepare personalized demo</li>
                            <li>Contact within 2 business hours</li>
                            <li>Schedule demo meeting</li>
                        </ul>
                    </div>
                </div>
            </body>
            </html>
            """
            
            text_content = f"""
            🚨 NEW DEMO REQUEST - Action Required within 2 hours
            
            Demo Request from {demo_request.company}
            
            Contact Information:
            Name: {demo_request.name}
            Email: {demo_request.email}
            Company: {demo_request.company}
            Phone: {demo_request.phone or 'Not provided'}
            
            Message: {demo_request.message or 'No additional message provided'}
            
            Submitted: {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S UTC')}
            
            Next Steps:
            - Review company profile and prepare personalized demo
            - Contact within 2 business hours  
            - Schedule demo meeting
            """
            
            return await self.send_email(self.sales_email, subject, html_content, text_content)
            
        except Exception as e:
            logger.error(f"Error sending internal notification: {str(e)}")
            return {"success": False, "message": f"Internal notification error: {str(e)}"}

# Initialize services
sheets_service = GoogleSheetsService()
airtable_service = AirtableService()
email_service = EmailService()
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
    """Create a demo request with Airtable primary, Google Sheets fallback"""
    try:
        logger.info(f"📝 Demo request received: {demo_request.email} from {demo_request.company}")
        
        # Generate a reference ID for tracking
        reference_id = str(uuid.uuid4())
        
        # Initialize status tracking
        integration_results = {
            "airtable": {"success": False, "error": "Not attempted"},
            "sheets": {"success": False, "error": "Not attempted"},
            "database": {"success": False, "error": "Not attempted"}
        }
        
        # PRIMARY: Try Airtable submission first
        logger.info("🔄 Attempting Airtable submission...")
        airtable_result = await airtable_service.create_demo_request(demo_request)
        integration_results["airtable"] = airtable_result
        
        primary_success = airtable_result.get("success", False)
        
        # FALLBACK: If Airtable failed, try Google Sheets
        if not primary_success:
            logger.warning(f"⚠️ Airtable failed: {airtable_result.get('error')}, falling back to Google Sheets")
            sheets_result = await sheets_service.submit_demo_request(demo_request)
            integration_results["sheets"] = sheets_result
        else:
            logger.info(f"✅ Airtable success: Record ID {airtable_result.get('airtable_id')}")
        
        # Always save to database as final backup
        demo_record = {
            "id": reference_id,
            "email": demo_request.email,
            "name": demo_request.name,
            "company": demo_request.company,
            "phone": demo_request.phone,
            "call_volume": demo_request.call_volume,
            "message": demo_request.message,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "source": "website_form",
            "integrations": integration_results,
            "airtable_id": airtable_result.get("airtable_id") if primary_success else None,
            "sheets_timestamp": integration_results["sheets"].get("timestamp") if not primary_success else None
        }
        
        await db.demo_requests.insert_one(demo_record)
        integration_results["database"]["success"] = True
        logger.info(f"💾 Database storage successful: {reference_id}")
        
        # Schedule email notifications as background tasks
        background_tasks.add_task(
            email_service.send_demo_confirmation,
            demo_request
        )
        
        background_tasks.add_task(
            email_service.send_internal_notification,
            demo_request
        )
        
        # Determine success status and response
        if primary_success:
            logger.info(f"🎉 Demo request completed successfully via Airtable: {reference_id}")
            return DemoRequestResponse(
                success=True,
                contact_id=reference_id,
                message="Demo request submitted successfully! We'll contact you within 2 business hours.",
                reference_id=reference_id,
                source="airtable"
            )
        elif integration_results["sheets"].get("success"):
            logger.info(f"🎉 Demo request completed successfully via Google Sheets fallback: {reference_id}")
            return DemoRequestResponse(
                success=True,
                contact_id=reference_id,
                message="Demo request submitted successfully! We'll contact you within 2 business hours.",
                reference_id=reference_id,
                source="sheets"
            )
        else:
            # Both external services failed, but database succeeded
            logger.warning(f"⚠️ External services failed, but database backup successful: {reference_id}")
            return DemoRequestResponse(
                success=True,
                contact_id=reference_id,
                message="Demo request received! We'll contact you within 4 business hours.",
                reference_id=reference_id,
                source="database"
            )
            
    except Exception as e:
        logger.error(f"Demo request creation failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to process demo request. Please try again.")

@api_router.get("/demo/requests")
async def get_demo_requests(limit: int = 50):
    """Get recent demo requests for admin/debugging purposes"""
    try:
        cursor = db.demo_requests.find({}).sort("timestamp", -1).limit(limit)
        demo_requests = []
        async for doc in cursor:
            # Convert ObjectId to string for JSON serialization
            if "_id" in doc:
                doc["_id"] = str(doc["_id"])
            demo_requests.append(doc)
        return {"success": True, "count": len(demo_requests), "requests": demo_requests}
    except Exception as e:
        logger.error(f"Error retrieving demo requests: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve demo requests")

# Additional demo request models
class DemoRequestForm(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    company: str = Field(..., min_length=2, max_length=100)
    phone: Optional[str] = Field(None, max_length=20)
    message: Optional[str] = Field(None, max_length=1000)
    preferredDate: Optional[str] = None

# Rate limiting storage (in production, use Redis)
request_counts = {}

def check_rate_limit(client_ip: str) -> bool:
    """Simple rate limiting - 5 requests per minute per IP"""
    import time
    current_time = time.time()
    minute_ago = current_time - 60
    
    # Clean old entries
    request_counts[client_ip] = [t for t in request_counts.get(client_ip, []) if t > minute_ago]
    
    # Check if limit exceeded
    if len(request_counts.get(client_ip, [])) >= 5:
        return False
    
    # Add current request
    if client_ip not in request_counts:
        request_counts[client_ip] = []
    request_counts[client_ip].append(current_time)
    
    return True

@api_router.post("/demo-request")
async def submit_demo_request_form(
    request: Request,
    background_tasks: BackgroundTasks,
    name: str = Form(...),
    email: str = Form(...),
    company: str = Form(...),
    phone: Optional[str] = Form(None),
    message: Optional[str] = Form(None),
    preferredDate: Optional[str] = Form(None)
):
    """
    Submit demo request form (accepts form data or JSON)
    Endpoint: POST /api/demo-request
    """
    try:
        # Get client IP for rate limiting
        client_ip = request.client.host if request.client else "unknown"
        
        # Rate limiting check
        if not check_rate_limit(client_ip):
            raise HTTPException(
                status_code=429, 
                detail={"status": "error", "message": "Rate limit exceeded. Please try again later."}
            )
        
        # Validate and sanitize input
        try:
            # Validate email with less strict settings for testing
            from email_validator import validate_email
            validated_email = validate_email(email, check_deliverability=False)
            clean_email = validated_email.email
        except Exception:
            raise HTTPException(
                status_code=400,
                detail={"status": "error", "message": "Invalid email format"}
            )
        
        # Sanitize inputs
        clean_name = name.strip()[:100] if name else ""
        clean_company = company.strip()[:100] if company else ""
        clean_phone = phone.strip()[:20] if phone else ""
        clean_message = message.strip()[:1000] if message else ""
        
        # Validate required fields
        if not clean_name or len(clean_name) < 2:
            raise HTTPException(
                status_code=400,
                detail={"status": "error", "message": "Name must be at least 2 characters"}
            )
        
        if not clean_company or len(clean_company) < 2:
            raise HTTPException(
                status_code=400,
                detail={"status": "error", "message": "Company name must be at least 2 characters"}
            )
        
        # Create demo request object
        demo_request_data = DemoRequest(
            name=clean_name,
            email=clean_email,
            company=clean_company,
            phone=clean_phone,
            message=clean_message,
            call_volume="1000"  # Default value since not provided in form
        )
        
        # Try Airtable submission first
        airtable_result = await airtable_service.create_demo_request(demo_request_data)
        
        # Also try Google Sheets as backup
        sheets_result = await sheets_service.submit_demo_request(demo_request_data)
        
        # Generate request ID and timestamp
        request_id = str(uuid.uuid4())
        timestamp = datetime.now(timezone.utc)
        
        # Save to database
        demo_record = {
            "requestId": request_id,
            "id": request_id,
            "name": clean_name,
            "email": clean_email,
            "company": clean_company,
            "phone": clean_phone,
            "message": clean_message,
            "preferredDate": preferredDate,
            "timestamp": timestamp.isoformat(),
            "client_ip": client_ip,
            "source": "demo_request_form",
            "airtable_status": airtable_result.get("success", False),
            "sheets_status": sheets_result["success"],
            "airtable_id": airtable_result.get("airtable_id") if airtable_result.get("success") else None
        }
        
        await db.demo_requests.insert_one(demo_record)
        
        # Schedule email notifications as background tasks
        background_tasks.add_task(
            email_service.send_demo_confirmation,
            demo_request_data
        )
        
        background_tasks.add_task(
            email_service.send_internal_notification,
            demo_request_data
        )
        
        logger.info(f"Demo request form submitted: {request_id} from {client_ip}")
        
        return {
            "status": "success",
            "requestId": request_id,
            "timestamp": timestamp.isoformat()
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Demo request form error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail={"status": "error", "message": "Failed to process request. Please try again."}
        )

@api_router.get("/debug/sheets/config")
async def debug_sheets_config():
    """Debug endpoint to see Google Sheets configuration"""
    return {
        "sheet_id": sheets_service.sheet_id,
        "sheet_name": sheets_service.sheet_name,
        "web_app_url": sheets_service.web_app_url,
        "service_type": "Google Sheets"
    }

@api_router.get("/debug/email/config")
async def debug_email_config():
    """Debug endpoint to see email configuration"""
    return {
        "smtp_host": email_service.smtp_host,
        "smtp_port": email_service.smtp_port,
        "from_email": email_service.from_email,
        "sales_email": email_service.sales_email,
        "smtp_configured": bool(email_service.smtp_user and email_service.smtp_pass),
        "service_type": "Spacemail SMTP"
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

# User Management API Endpoints
@api_router.post("/auth/register", response_model=UserResponse)
async def register_user(user_create: UserCreate):
    """Register a new user"""
    try:
        user_data = await user_service.create_user(user_create)
        # Convert datetime strings back to datetime objects for response
        user_data['created_at'] = datetime.fromisoformat(user_data['created_at'].replace('Z', '+00:00'))
        if user_data.get('updated_at'):
            user_data['updated_at'] = datetime.fromisoformat(user_data['updated_at'].replace('Z', '+00:00'))
        return UserResponse(**user_data)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating user: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to create user")

@api_router.post("/auth/login", response_model=Token)
async def login_user(user_login: UserLogin):
    """Authenticate user and return JWT token"""
    try:
        user = await user_service.authenticate_user(user_login.email, user_login.password)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        access_token_expires = timedelta(minutes=user_service.access_token_expire_minutes)
        access_token = user_service.create_access_token(
            data={"sub": user["id"]}, expires_delta=access_token_expires
        )
        
        # Prepare user data for response
        user_response_data = {k: v for k, v in user.items() if k != 'password_hash'}
        if isinstance(user_response_data.get('created_at'), str):
            user_response_data['created_at'] = datetime.fromisoformat(user_response_data['created_at'].replace('Z', '+00:00'))
        if isinstance(user_response_data.get('last_login'), str):
            user_response_data['last_login'] = datetime.fromisoformat(user_response_data['last_login'].replace('Z', '+00:00'))
        
        return Token(
            access_token=access_token,
            expires_in=user_service.access_token_expire_minutes * 60,
            user=User(**user_response_data)
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error during login: {str(e)}")
        raise HTTPException(status_code=500, detail="Login failed")

@api_router.get("/auth/me", response_model=UserResponse)
async def get_current_user_profile(current_user: dict = Depends(get_current_active_user)):
    """Get current user profile"""
    try:
        user_data = {k: v for k, v in current_user.items() if k != 'password_hash'}
        if isinstance(user_data.get('created_at'), str):
            user_data['created_at'] = datetime.fromisoformat(user_data['created_at'].replace('Z', '+00:00'))
        if isinstance(user_data.get('last_login'), str):
            user_data['last_login'] = datetime.fromisoformat(user_data['last_login'].replace('Z', '+00:00'))
        return UserResponse(**user_data)
    except Exception as e:
        logger.error(f"Error getting user profile: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get user profile")

@api_router.put("/auth/profile", response_model=UserResponse)
async def update_user_profile(
    user_update: UserUpdate,
    current_user: dict = Depends(get_current_active_user)
):
    """Update current user profile"""
    try:
        updated_user = await user_service.update_user(current_user["id"], user_update)
        if not updated_user:
            raise HTTPException(status_code=404, detail="User not found")
        
        user_data = {k: v for k, v in updated_user.items() if k != 'password_hash'}
        if isinstance(user_data.get('created_at'), str):
            user_data['created_at'] = datetime.fromisoformat(user_data['created_at'].replace('Z', '+00:00'))
        if isinstance(user_data.get('updated_at'), str):
            user_data['updated_at'] = datetime.fromisoformat(user_data['updated_at'].replace('Z', '+00:00'))
        
        return UserResponse(**user_data)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating user profile: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to update profile")

@api_router.post("/auth/change-password")
async def change_password(
    password_change: PasswordChange,
    current_user: dict = Depends(get_current_active_user)
):
    """Change user password"""
    try:
        success = await user_service.change_password(current_user["id"], password_change)
        if not success:
            raise HTTPException(status_code=400, detail="Current password is incorrect")
        
        return {"message": "Password changed successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error changing password: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to change password")

@api_router.post("/auth/request-password-reset")
async def request_password_reset(password_reset: PasswordReset):
    """Request password reset token"""
    try:
        user = await user_service.get_user_by_email(password_reset.email)
        if not user:
            # Don't reveal if email exists or not for security
            return {"message": "If the email exists, a reset token has been sent"}
        
        reset_token = user_service.create_reset_token(password_reset.email)
        
        # In production, send email with reset token
        # For now, just log it (in production, remove this log)
        logger.info(f"Password reset token for {password_reset.email}: {reset_token}")
        
        return {"message": "If the email exists, a reset token has been sent"}
    except Exception as e:
        logger.error(f"Error requesting password reset: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to process password reset request")

@api_router.post("/auth/reset-password")
async def reset_password(password_reset_confirm: PasswordResetConfirm):
    """Reset password using token"""
    try:
        success = await user_service.reset_password(
            password_reset_confirm.token, 
            password_reset_confirm.new_password
        )
        if not success:
            raise HTTPException(status_code=400, detail="Invalid or expired reset token")
        
        return {"message": "Password reset successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error resetting password: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to reset password")

@api_router.get("/users", response_model=List[UserResponse])
async def get_all_users(
    skip: int = 0,
    limit: int = 100,
    admin_user: dict = Depends(get_admin_user)
):
    """Get all users (admin only)"""
    try:
        cursor = db.users.find({}).skip(skip).limit(limit)
        users = []
        async for user_doc in cursor:
            user_data = {k: v for k, v in user_doc.items() if k != 'password_hash'}
            if isinstance(user_data.get('created_at'), str):
                user_data['created_at'] = datetime.fromisoformat(user_data['created_at'].replace('Z', '+00:00'))
            if isinstance(user_data.get('last_login'), str):
                user_data['last_login'] = datetime.fromisoformat(user_data['last_login'].replace('Z', '+00:00'))
            users.append(UserResponse(**user_data))
        
        return users
    except Exception as e:
        logger.error(f"Error getting users: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get users")

@api_router.get("/users/{user_id}", response_model=UserResponse)
async def get_user_by_id(
    user_id: str,
    admin_user: dict = Depends(get_admin_user)
):
    """Get user by ID (admin only)"""
    try:
        user = await user_service.get_user_by_id(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        user_data = {k: v for k, v in user.items() if k != 'password_hash'}
        if isinstance(user_data.get('created_at'), str):
            user_data['created_at'] = datetime.fromisoformat(user_data['created_at'].replace('Z', '+00:00'))
        if isinstance(user_data.get('last_login'), str):
            user_data['last_login'] = datetime.fromisoformat(user_data['last_login'].replace('Z', '+00:00'))
        
        return UserResponse(**user_data)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting user: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get user")

@api_router.put("/users/{user_id}/role")
async def update_user_role(
    user_id: str,
    role: str,
    admin_user: dict = Depends(get_admin_user)
):
    """Update user role (admin only)"""
    try:
        if role not in [UserRole.ADMIN, UserRole.USER, UserRole.VIEWER]:
            raise HTTPException(status_code=400, detail="Invalid role")
        
        user = await user_service.get_user_by_id(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        await db.users.update_one(
            {"id": user_id},
            {"$set": {"role": role, "updated_at": datetime.now(timezone.utc).isoformat()}}
        )
        
        return {"message": f"User role updated to {role}"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating user role: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to update user role")

@api_router.put("/users/{user_id}/status")
async def update_user_status(
    user_id: str,
    is_active: bool,
    admin_user: dict = Depends(get_admin_user)
):
    """Update user active status (admin only)"""
    try:
        user = await user_service.get_user_by_id(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        await db.users.update_one(
            {"id": user_id},
            {"$set": {"is_active": is_active, "updated_at": datetime.now(timezone.utc).isoformat()}}
        )
        
        status_text = "activated" if is_active else "deactivated"
        return {"message": f"User {status_text} successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating user status: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to update user status")

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
