#!/usr/bin/env python3
"""
Production Build Script for SentraTech Enterprise Deployment
Builds both website and dashboard for production deployment
"""
import os
import subprocess
import json
import shutil
from datetime import datetime
from pathlib import Path

class ProductionBuilder:
    def __init__(self):
        self.root_dir = Path("/app")
        self.website_dir = self.root_dir / "website"
        self.dashboard_dir = self.root_dir / "dashboard" 
        self.backend_dir = self.root_dir / "backend"
        
        # Production configuration
        self.production_config = {
            "website": {
                "REACT_APP_API_BASE": "https://sentratech.net/api/proxy",
                "REACT_APP_WS_URL": "wss://admin.sentratech.net/ws",
                "REACT_APP_DOMAIN": "sentratech.net",
                "REACT_APP_SITE_MODE": "public",
                "NODE_ENV": "production"
            },
            "dashboard": {
                "REACT_APP_API_BASE": "https://admin.sentratech.net/api/forms",
                "REACT_APP_WS_URL": "wss://admin.sentratech.net/ws", 
                "REACT_APP_DASHBOARD_MODE": "admin",
                "REACT_APP_API_VERSION": "v1",
                "NODE_ENV": "production"
            }
        }
    
    def update_env_file(self, app_dir: Path, env_vars: dict):
        """Update .env file with production variables"""
        env_file = app_dir / ".env"
        
        print(f"📝 Updating {env_file} with production variables...")
        
        with open(env_file, 'w') as f:
            for key, value in env_vars.items():
                f.write(f"{key}={value}\n")
        
        print(f"✅ Updated {env_file}")
    
    def run_command(self, command: str, cwd: Path) -> bool:
        """Run shell command and return success status"""
        try:
            print(f"🔧 Running: {command} (in {cwd})")
            result = subprocess.run(
                command.split(),
                cwd=cwd,
                capture_output=True,
                text=True,
                timeout=300  # 5 minute timeout
            )
            
            if result.returncode == 0:
                print(f"✅ Command succeeded: {command}")
                return True
            else:
                print(f"❌ Command failed: {command}")
                print(f"   stdout: {result.stdout}")
                print(f"   stderr: {result.stderr}")
                return False
                
        except subprocess.TimeoutExpired:
            print(f"⏱️ Command timed out: {command}")
            return False
        except Exception as e:
            print(f"❌ Command error: {command} - {str(e)}")
            return False
    
    def install_dependencies(self, app_dir: Path) -> bool:
        """Install production dependencies"""
        print(f"📦 Installing dependencies for {app_dir.name}...")
        
        # Use yarn for faster installs
        if (app_dir / "yarn.lock").exists():
            return self.run_command("yarn install --production", app_dir)
        else:
            return self.run_command("npm ci --production", app_dir)
    
    def build_app(self, app_dir: Path, app_name: str) -> bool:
        """Build React application for production"""
        print(f"🏗️ Building {app_name} for production...")
        
        # Update environment variables
        self.update_env_file(app_dir, self.production_config[app_name])
        
        # Install dependencies
        if not self.install_dependencies(app_dir):
            return False
        
        # Build the application
        build_command = "yarn build" if (app_dir / "yarn.lock").exists() else "npm run build"
        if not self.run_command(build_command, app_dir):
            return False
        
        # Verify build output
        build_dir = app_dir / "build"
        if not build_dir.exists():
            print(f"❌ Build directory not found: {build_dir}")
            return False
        
        # Check for essential files
        essential_files = ["index.html", "static"]
        for file_name in essential_files:
            if not (build_dir / file_name).exists():
                print(f"❌ Essential file missing from build: {file_name}")
                return False
        
        print(f"✅ {app_name} build completed successfully")
        return True
    
    def prepare_backend(self) -> bool:
        """Prepare backend for production deployment"""
        print("🐍 Preparing backend for production...")
        
        # Install Python dependencies
        requirements_file = self.backend_dir / "requirements.txt"
        if requirements_file.exists():
            if not self.run_command("pip install -r requirements.txt", self.backend_dir):
                return False
        
        # Update backend .env for production
        backend_env = self.backend_dir / ".env"
        production_backend_vars = {
            "MONGO_URL": "mongodb://localhost:27017/sentratech_forms",
            "EMERGENT_API_KEY": "sk-emergent-7A236FdD2Ce8d9b52C",
            "ADMIN_DASHBOARD_URL": "https://admin.sentratech.net/api/forms",
            "CORS_ORIGINS": "https://sentratech.net,https://www.sentratech.net,https://admin.sentratech.net",
            "WS_PORT": "8002",
            "WS_HEARTBEAT_INTERVAL": "30000",
            "WS_MAX_RETRIES": "3",
            "PROXY_TIMEOUT": "10000",
            "PROXY_RETRIES": "3",
            "PROXY_BACKOFF": "500",
            "IDEMPOTENCY_WINDOW": "120000"
        }
        
        with open(backend_env, 'w') as f:
            for key, value in production_backend_vars.items():
                f.write(f"{key}={value}\n")
        
        print("✅ Backend preparation completed")
        return True
    
    def create_deployment_package(self) -> bool:
        """Create deployment package with all built assets"""
        print("📦 Creating deployment package...")
        
        deployment_dir = self.root_dir / "deployment"
        if deployment_dir.exists():
            shutil.rmtree(deployment_dir)
        deployment_dir.mkdir()
        
        # Copy built website
        website_build = self.website_dir / "build"
        if website_build.exists():
            shutil.copytree(website_build, deployment_dir / "website")
            print("✅ Website build copied to deployment package")
        
        # Copy built dashboard  
        dashboard_build = self.dashboard_dir / "build"
        if dashboard_build.exists():
            shutil.copytree(dashboard_build, deployment_dir / "dashboard")
            print("✅ Dashboard build copied to deployment package")
        
        # Copy backend
        shutil.copytree(self.backend_dir, deployment_dir / "backend")
        print("✅ Backend copied to deployment package")
        
        # Copy configuration files
        config_files = [
            "emergent.config.js",
            "enterprise_smoke_tests.py"
        ]
        
        for config_file in config_files:
            config_path = self.root_dir / config_file
            if config_path.exists():
                shutil.copy2(config_path, deployment_dir / config_file)
                print(f"✅ {config_file} copied to deployment package")
        
        # Create deployment manifest
        manifest = {
            "version": "1.0.0",
            "timestamp": datetime.now().isoformat(),
            "components": {
                "website": {
                    "domain": "sentratech.net",
                    "build_dir": "website/",
                    "api_base": "https://sentratech.net/api/proxy"
                },
                "dashboard": {
                    "domain": "admin.sentratech.net", 
                    "build_dir": "dashboard/",
                    "api_base": "https://admin.sentratech.net/api/forms",
                    "websocket": "wss://admin.sentratech.net/ws"
                },
                "backend": {
                    "directory": "backend/",
                    "main_file": "server.py",
                    "port": 8001
                }
            },
            "urls": {
                "website": "https://sentratech.net",
                "dashboard": "https://admin.sentratech.net", 
                "api_endpoints": {
                    "roi_calculator": "https://admin.sentratech.net/api/forms/roi-calculator",
                    "demo_request": "https://admin.sentratech.net/api/forms/demo-request",
                    "contact_sales": "https://admin.sentratech.net/api/forms/contact-sales",
                    "newsletter_signup": "https://admin.sentratech.net/api/forms/newsletter-signup",
                    "job_application": "https://admin.sentratech.net/api/forms/job-application"
                }
            }
        }
        
        manifest_file = deployment_dir / "deployment_manifest.json"
        with open(manifest_file, 'w') as f:
            json.dump(manifest, f, indent=2)
        
        print(f"✅ Deployment package created at {deployment_dir}")
        print(f"📋 Deployment manifest: {manifest_file}")
        
        return True
    
    def build_all(self) -> bool:
        """Build complete production deployment"""
        print("🚀 Starting SentraTech Enterprise Production Build")
        print("="*60)
        
        start_time = datetime.now()
        
        try:
            # Build website
            if not self.build_app(self.website_dir, "website"):
                print("❌ Website build failed")
                return False
            
            # Build dashboard  
            if not self.build_app(self.dashboard_dir, "dashboard"):
                print("❌ Dashboard build failed")
                return False
            
            # Prepare backend
            if not self.prepare_backend():
                print("❌ Backend preparation failed")
                return False
            
            # Create deployment package
            if not self.create_deployment_package():
                print("❌ Deployment package creation failed")
                return False
            
            end_time = datetime.now()
            duration = (end_time - start_time).total_seconds()
            
            print("\n" + "="*60)
            print("🎉 PRODUCTION BUILD COMPLETED SUCCESSFULLY")
            print("="*60)
            print(f"⏱️ Build Time: {duration:.1f} seconds")
            print(f"📦 Deployment Package: /app/deployment/")
            print(f"🌐 Website: https://sentratech.net")
            print(f"📊 Dashboard: https://admin.sentratech.net")
            print(f"🔌 WebSocket: wss://admin.sentratech.net/ws")
            print("\n🚀 Ready for production deployment!")
            
            return True
            
        except Exception as e:
            print(f"❌ Build failed with error: {str(e)}")
            return False

def main():
    """Main build script entry point"""
    builder = ProductionBuilder()
    success = builder.build_all()
    
    if success:
        print("\n✅ Production build completed successfully")
        print("🔄 Next steps:")
        print("   1. Run smoke tests: python enterprise_smoke_tests.py")
        print("   2. Deploy using emergent.config.js")
        print("   3. Verify all domains are accessible")
        return 0
    else:
        print("\n❌ Production build failed")
        return 1

if __name__ == "__main__":
    exit(main())