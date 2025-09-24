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
