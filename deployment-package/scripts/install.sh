#!/bin/bash
set -e

# SentraTech Proxy Service Installation Script
# Run with: sudo bash install.sh

echo "🚀 Starting SentraTech Proxy Service Installation..."

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "❌ Please run as root: sudo bash install.sh"
    exit 1
fi

# Variables
SERVICE_USER="sentratech"
SERVICE_GROUP="sentratech"
INSTALL_DIR="/opt/sentratech-proxy"
LOG_DIR="/var/log/sentratech"
DATA_DIR="/var/data/pending_submissions"
NGINX_SITES_DIR="/etc/nginx/sites-available"
NGINX_ENABLED_DIR="/etc/nginx/sites-enabled"

echo "📦 Installing system dependencies..."

# Update package list
apt-get update

# Install required system packages
apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    nginx \
    mongodb \
    certbot \
    python3-certbot-nginx \
    curl \
    wget \
    htop \
    ufw

echo "👤 Creating service user and directories..."

# Create service user and group
if ! id "$SERVICE_USER" &>/dev/null; then
    useradd --system --group --no-create-home --shell /bin/false $SERVICE_USER
    echo "✅ Created service user: $SERVICE_USER"
else
    echo "✅ Service user already exists: $SERVICE_USER"
fi

# Create directories
mkdir -p $INSTALL_DIR
mkdir -p $LOG_DIR
mkdir -p $DATA_DIR

# Set ownership and permissions
chown -R $SERVICE_USER:$SERVICE_GROUP $INSTALL_DIR
chown -R $SERVICE_USER:$SERVICE_GROUP $LOG_DIR
chown -R $SERVICE_USER:$SERVICE_GROUP $DATA_DIR

chmod 755 $INSTALL_DIR
chmod 755 $LOG_DIR
chmod 755 $DATA_DIR

echo "🐍 Setting up Python environment..."

# Copy application files
cp -r backend/* $INSTALL_DIR/

# Create virtual environment
cd $INSTALL_DIR
python3 -m venv venv

# Install Python dependencies
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

echo "⚙️  Installing service configuration..."

# Install systemd service
cp config/sentratech-proxy.service /etc/systemd/system/
systemctl daemon-reload
systemctl enable sentratech-proxy

echo "🌐 Configuring Nginx..."

# Install Nginx configuration
cp config/nginx-sentratech.conf $NGINX_SITES_DIR/sentratech.net

# Create basic index.html if it doesn't exist
WWW_DIR="/var/www/sentratech.net"
mkdir -p $WWW_DIR
if [ ! -f "$WWW_DIR/index.html" ]; then
    cat > $WWW_DIR/index.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>SentraTech</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .container { max-width: 600px; margin: 0 auto; }
        h1 { color: #333; }
        .status { padding: 20px; background: #f0f8f0; border: 1px solid #4CAF50; border-radius: 5px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>SentraTech</h1>
        <div class="status">
            <h2>✅ Service Active</h2>
            <p>The SentraTech proxy service is running and ready to accept form submissions.</p>
            <p>API Endpoint: <code>/api/collect</code></p>
        </div>
    </div>
</body>
</html>
EOF
fi

chown -R www-data:www-data $WWW_DIR

echo "🔥 Configuring firewall..."

# Configure UFW firewall
ufw --force reset
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 'Nginx Full'
ufw allow 27017  # MongoDB
ufw --force enable

echo "🗄️  Starting MongoDB..."

# Start and enable MongoDB
systemctl enable mongod
systemctl start mongod

echo "📋 Creating environment configuration..."

# Create environment file from template
cp config/.env.template $INSTALL_DIR/.env
chown $SERVICE_USER:$SERVICE_GROUP $INSTALL_DIR/.env
chmod 600 $INSTALL_DIR/.env

echo ""
echo "🎉 Installation completed successfully!"
echo ""
echo "📝 Next steps:"
echo "1. Edit the environment file: $INSTALL_DIR/.env"
echo "   - Set your DASHBOARD_API_KEY"
echo "   - Verify ADMIN_DASHBOARD_URL"
echo ""
echo "2. Start the service:"
echo "   systemctl start sentratech-proxy"
echo ""
echo "3. Configure SSL certificates:"
echo "   bash scripts/setup-ssl.sh"
echo ""
echo "4. Test the installation:"
echo "   curl -X POST http://localhost:8001/api/health"
echo ""
echo "📊 Service status:"
echo "   systemctl status sentratech-proxy"
echo ""
echo "📄 View logs:"
echo "   journalctl -u sentratech-proxy -f"
echo "   tail -f $LOG_DIR/collect.log"
echo ""