from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime, timezone


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

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
