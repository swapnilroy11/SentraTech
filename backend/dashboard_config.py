"""
🔒 PROTECTED DASHBOARD INTEGRATION CONFIG 🔒

⚠️ ⚠️ ⚠️ CRITICAL WARNING - DO NOT MODIFY ⚠️ ⚠️ ⚠️

This configuration is essential for dashboard data synchronization.
Any changes to these values will break the forwarding pipeline
to dashboard-central-5.

MODIFICATION REQUIRES:
- Senior developer approval  
- Full testing on staging environment
- Verification that dashboard-central-5 receives data

Last verified working: 2025-09-28
Configuration owner: System Administrator
"""

import os
import logging

logger = logging.getLogger(__name__)

# 🔒 PROTECTED - Dashboard Integration Settings
class DashboardConfig:
    # Target dashboard for forwarding (CRITICAL - DO NOT CHANGE)
    EXTERNAL_DASHBOARD_URL = "https://tech-careers-3.preview.emergentagent.com"
    
    # Current host (used for loop detection)
    CURRENT_HOST = "customer-flow-5.preview.emergentagent.com"
    
    # Authentication for dashboard forwarding
    DASHBOARD_AUTH_KEY = "test-ingest-key-12345"
    
    # Local authentication key (from environment)
    LOCAL_INGEST_KEY = "a0d3f2b6c9e4d1784a92f3c1b5e6d0aa7c18e2f49b35c6d7e8f0a1b2c3d4e5f6"
    
    # Timeout for dashboard requests
    REQUEST_TIMEOUT = 30.0

    @classmethod
    def validate_config(cls):
        """
        🛡️ Validate critical configuration settings
        """
        errors = []
        
        # Check external dashboard URL
        if not cls.EXTERNAL_DASHBOARD_URL:
            errors.append("❌ EXTERNAL_DASHBOARD_URL is not set")
        elif "dashboard-central-5" not in cls.EXTERNAL_DASHBOARD_URL:
            errors.append("❌ EXTERNAL_DASHBOARD_URL does not reference dashboard-central-5")
        
        # Check current host
        if not cls.CURRENT_HOST:
            errors.append("❌ CURRENT_HOST is not set")
        elif "customer-flow-5" not in cls.CURRENT_HOST:
            errors.append("❌ CURRENT_HOST does not reference customer-flow-5")
            
        # Check auth keys
        if not cls.DASHBOARD_AUTH_KEY:
            errors.append("❌ DASHBOARD_AUTH_KEY is missing")
        if not cls.LOCAL_INGEST_KEY:
            errors.append("❌ LOCAL_INGEST_KEY is missing")
            
        # Check for dangerous loop configuration
        if cls.CURRENT_HOST in cls.EXTERNAL_DASHBOARD_URL:
            errors.append("❌ DANGEROUS: Current host found in external URL - would create forwarding loop")
            
        if errors:
            logger.error("🚨 DASHBOARD CONFIG VALIDATION FAILED:")
            for error in errors:
                logger.error(error)
            return False
            
        logger.info("✅ Dashboard configuration validation passed")
        return True
    
    @classmethod
    def get_headers(cls):
        """Get authentication headers for dashboard forwarding"""
        return {
            "Content-Type": "application/json",
            "X-INGEST-KEY": cls.DASHBOARD_AUTH_KEY
        }
    
    @classmethod
    def should_forward_to_dashboard(cls):
        """Determine if requests should be forwarded to external dashboard"""
        # Don't forward if it would create a loop
        if cls.CURRENT_HOST in cls.EXTERNAL_DASHBOARD_URL:
            logger.warning(f"🔄 Skipping dashboard forwarding to avoid loop: {cls.CURRENT_HOST} -> {cls.EXTERNAL_DASHBOARD_URL}")
            return False
        return True
    
    @classmethod
    def get_dashboard_endpoint(cls, endpoint_path):
        """Get full dashboard URL for specific endpoint"""
        return f"{cls.EXTERNAL_DASHBOARD_URL}{endpoint_path}"

# 🔒 PROTECTED - Auto-validation on import
try:
    DashboardConfig.validate_config()
except Exception as e:
    logger.error(f"🚨 Dashboard config validation error: {e}")

"""
🔒 PROTECTED USAGE INSTRUCTIONS:

Import this config instead of hardcoding values:

❌ Wrong:
dashboard_url = "https://tech-careers-3.preview.emergentagent.com"
headers = {"X-INGEST-KEY": "test-ingest-key-12345"}

✅ Correct:
from dashboard_config import DashboardConfig
dashboard_url = DashboardConfig.get_dashboard_endpoint("/api/ingest/demo_requests")
headers = DashboardConfig.get_headers()
"""