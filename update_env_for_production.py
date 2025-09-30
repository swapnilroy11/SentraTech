#!/usr/bin/env python3
"""
Script to update environment configurations for sentratech.net production deployment
"""
import os

def update_dashboard_env():
    """Update dashboard .env file for production"""
    dashboard_env_path = "/app/dashboard/.env"
    
    env_content = """REACT_APP_BACKEND_URL=https://admin.sentratech.net
REACT_APP_WS_URL=wss://admin.sentratech.net/ws
WDS_SOCKET_PORT=443

# Dashboard Configuration
REACT_APP_DASHBOARD_MODE=admin
REACT_APP_API_VERSION=v1
"""
    
    with open(dashboard_env_path, 'w') as f:
        f.write(env_content)
    print("✅ Updated dashboard/.env for production (admin.sentratech.net)")

def update_website_env():
    """Update website .env file for production"""
    website_env_path = "/app/website/.env"
    
    env_content = """REACT_APP_BACKEND_URL=https://sentratech.net/api/proxy
REACT_APP_WS_URL=wss://admin.sentratech.net/ws

# Website Configuration 
REACT_APP_SITE_MODE=public
REACT_APP_DOMAIN=sentratech.net
"""
    
    with open(website_env_path, 'w') as f:
        f.write(env_content)
    print("✅ Updated website/.env for production (sentratech.net)")

def update_backend_env():
    """Update backend .env file for production"""
    backend_env_path = "/app/backend/.env"
    
    # Read existing content
    try:
        with open(backend_env_path, 'r') as f:
            lines = f.readlines()
    except FileNotFoundError:
        lines = []
    
    # Update or add specific lines for production
    new_lines = []
    found_keys = set()
    
    for line in lines:
        if line.startswith('ADMIN_DASHBOARD_URL='):
            new_lines.append('ADMIN_DASHBOARD_URL=https://admin.sentratech.net/api/forms\n')
            found_keys.add('ADMIN_DASHBOARD_URL')
        elif line.startswith('CORS_ORIGINS='):
            new_lines.append('CORS_ORIGINS=https://sentratech.net,https://www.sentratech.net,https://admin.sentratech.net\n')
            found_keys.add('CORS_ORIGINS')
        else:
            new_lines.append(line)
    
    # Add missing keys
    if 'ADMIN_DASHBOARD_URL' not in found_keys:
        new_lines.append('ADMIN_DASHBOARD_URL=https://admin.sentratech.net/api/forms\n')
    if 'CORS_ORIGINS' not in found_keys:
        new_lines.append('CORS_ORIGINS=https://sentratech.net,https://www.sentratech.net,https://admin.sentratech.net\n')
    
    with open(backend_env_path, 'w') as f:
        f.writelines(new_lines)
    print("✅ Updated backend/.env for production domains")

def show_deployment_summary():
    """Show deployment configuration summary"""
    print("\n" + "="*60)
    print("🚀 PRODUCTION DEPLOYMENT CONFIGURATION SUMMARY")
    print("="*60)
    print("📊 Admin Dashboard: https://admin.sentratech.net")
    print("🌐 Main Website: https://sentratech.net")
    print("🔑 Demo Login Credentials:")
    print("   Email: admin@sentratech.net")
    print("   Password: sentratech2025")
    print("\n📁 Updated Files:")
    print("   - /app/dashboard/.env (backend URL → admin.sentratech.net)")
    print("   - /app/website/.env (backend URL → sentratech.net)")
    print("   - /app/backend/.env (CORS origins & dashboard URL)")
    print("\n🎨 Theme Applied:")
    print("   - Dark theme with neon green (#00FF41) accents")
    print("   - Inter font family")
    print("   - Professional enterprise dashboard styling")
    print("\n⚠️  Next Steps for Production:")
    print("   1. Configure DNS: admin.sentratech.net → your server")
    print("   2. Set up SSL certificates for both domains")
    print("   3. Update supervisor to run dashboard on production port")
    print("   4. Test login flow on production domains")
    print("="*60)

if __name__ == "__main__":
    print("🔧 Configuring SentraTech for Production Deployment...")
    
    update_dashboard_env()
    update_website_env() 
    update_backend_env()
    
    show_deployment_summary()
    
    print("\n✅ Configuration complete! Ready for sentratech.net deployment.")