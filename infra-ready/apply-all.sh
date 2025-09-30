#!/usr/bin/env bash
set -euo pipefail

# SentraTech Infrastructure Setup - One Command Application
# Run this script after updating namespace and service names in YAML files

echo "🚀 SentraTech Infrastructure Setup"
echo "================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Configuration - UPDATE THESE VALUES
NAMESPACE="emergent-agents-env"
ADMIN_DEPLOYMENT="admin-proxy"
SERVICE_NAME="admin-proxy-service"

echo -e "\n📋 Configuration:"
echo "Namespace: $NAMESPACE"
echo "Admin Deployment: $ADMIN_DEPLOYMENT"
echo "Service Name: $SERVICE_NAME"

read -p "Press Enter to continue or Ctrl+C to cancel..."

# Function to check command success
check_result() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ $1${NC}"
    else
        echo -e "${RED}❌ $1${NC}"
        exit 1
    fi
}

# 1. Update CoreDNS for external DNS resolution
echo -e "\n🔧 Step 1: Updating CoreDNS..."
kubectl apply -f coredns-configmap.yaml
check_result "CoreDNS ConfigMap applied"

kubectl rollout restart deployment/coredns -n kube-system
check_result "CoreDNS restarted"

kubectl rollout status deployment/coredns -n kube-system --timeout=300s
check_result "CoreDNS ready"

# 2. Apply NetworkPolicy for egress traffic
echo -e "\n🛡️ Step 2: Applying NetworkPolicy..."
# Update namespace in the NetworkPolicy file
sed -i "s/emergent-agents-env/$NAMESPACE/g" networkpolicy-egress.yaml
kubectl apply -f networkpolicy-egress.yaml
check_result "NetworkPolicy applied"

# 3. Apply Ingress with WebSocket support
echo -e "\n🌐 Step 3: Updating Ingress..."
# Update namespace and service name in Ingress file
sed -i "s/emergent-agents-env/$NAMESPACE/g" ingress-websocket.yaml
sed -i "s/admin-proxy-service/$SERVICE_NAME/g" ingress-websocket.yaml
kubectl apply -f ingress-websocket.yaml
check_result "Ingress applied"

# 4. Restart admin proxy deployment
echo -e "\n🔄 Step 4: Restarting Admin Proxy..."
if kubectl get deployment $ADMIN_DEPLOYMENT -n $NAMESPACE > /dev/null 2>&1; then
    kubectl rollout restart deployment/$ADMIN_DEPLOYMENT -n $NAMESPACE
    check_result "Admin Proxy restarted"
    
    kubectl rollout status deployment/$ADMIN_DEPLOYMENT -n $NAMESPACE --timeout=300s
    check_result "Admin Proxy ready"
else
    echo -e "${YELLOW}⚠️ Deployment '$ADMIN_DEPLOYMENT' not found in namespace '$NAMESPACE'${NC}"
    echo "Please update the ADMIN_DEPLOYMENT variable in this script"
fi

# 5. Wait for services to be ready
echo -e "\n⏰ Step 5: Waiting for services..."
sleep 30

# 6. Basic verification
echo -e "\n✅ Step 6: Basic Verification..."
kubectl get pods -n $NAMESPACE
kubectl get ingress -n $NAMESPACE
kubectl get networkpolicy -n $NAMESPACE

echo -e "\n🎉 Infrastructure setup completed!"
echo -e "\nNext steps:"
echo -e "1. Set environment variables:"
echo -e "   export KNS=\"$NAMESPACE\""
echo -e "   export POD=\$(kubectl get pods -n $NAMESPACE -o jsonpath='{.items[0].metadata.name}')"
echo -e "   export ADMIN_URL=\"https://real-time-dash.preview.emergentagent.com\""
echo -e "   export INGEST_KEY=\"a0d3f2b6c9e4d1784a92f3c1b5e6d0aa7c18e2f49b35c6d7e8f0a1b2c3d4e5f6\""
echo -e "   export AUTH_EMAIL=\"swapnil.roy@sentratech.net\""
echo -e "   export AUTH_PASSWORD=\"Sentra@2025\""
echo -e ""
echo -e "2. Run verification script:"
echo -e "   bash verify-infrastructure.sh"