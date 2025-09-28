#!/bin/bash

# SentraTech Infrastructure Setup Script
# Run this script with cluster admin privileges

set -e

echo "🚀 Applying SentraTech Infrastructure Configuration"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Variables - UPDATE THESE TO MATCH YOUR ENVIRONMENT
NAMESPACE="emergent-agents-env"
ADMIN_DEPLOYMENT="admin-proxy"
BACKEND_DEPLOYMENT="backend"

echo -e "\n📋 Configuration Summary:"
echo "Namespace: $NAMESPACE"
echo "Admin Deployment: $ADMIN_DEPLOYMENT"
echo "Backend Deployment: $BACKEND_DEPLOYMENT"

read -p "Press Enter to continue or Ctrl+C to cancel..."

# Function to check command success
check_result() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ $1: SUCCESS${NC}"
    else
        echo -e "${RED}❌ $1: FAILED${NC}"
        exit 1
    fi
}

# 1. Apply CoreDNS Configuration
echo -e "\n🔧 Step 1: Updating CoreDNS Configuration..."
kubectl apply -f 01-coredns-configmap.yaml
check_result "CoreDNS ConfigMap Update"

echo "Restarting CoreDNS deployment..."
kubectl rollout restart deployment/coredns -n kube-system
check_result "CoreDNS Restart"

echo "Waiting for CoreDNS to be ready..."
kubectl rollout status deployment/coredns -n kube-system --timeout=300s
check_result "CoreDNS Rollout Status"

# 2. Apply Network Policy
echo -e "\n🛡️  Step 2: Applying Network Policies..."
kubectl apply -f 02-network-policy-egress.yaml
check_result "Network Policy Application"

# 3. Apply Ingress Configuration
echo -e "\n🌐 Step 3: Updating Ingress Configuration..."
kubectl apply -f 03-ingress-websocket.yaml
check_result "Ingress Configuration Update"

# 4. Restart Application Deployments
echo -e "\n🔄 Step 4: Restarting Application Deployments..."

# Check if admin proxy deployment exists
if kubectl get deployment $ADMIN_DEPLOYMENT -n $NAMESPACE > /dev/null 2>&1; then
    kubectl rollout restart deployment/$ADMIN_DEPLOYMENT -n $NAMESPACE
    check_result "Admin Proxy Restart"
    
    kubectl rollout status deployment/$ADMIN_DEPLOYMENT -n $NAMESPACE --timeout=300s
    check_result "Admin Proxy Rollout Status"
else
    echo -e "${YELLOW}⚠️ Admin deployment '$ADMIN_DEPLOYMENT' not found in namespace '$NAMESPACE'${NC}"
fi

# Check if backend deployment exists
if kubectl get deployment $BACKEND_DEPLOYMENT -n $NAMESPACE > /dev/null 2>&1; then
    kubectl rollout restart deployment/$BACKEND_DEPLOYMENT -n $NAMESPACE
    check_result "Backend Restart"
    
    kubectl rollout status deployment/$BACKEND_DEPLOYMENT -n $NAMESPACE --timeout=300s
    check_result "Backend Rollout Status"
else
    echo -e "${YELLOW}⚠️ Backend deployment '$BACKEND_DEPLOYMENT' not found in namespace '$NAMESPACE'${NC}"
fi

# 5. Verification
echo -e "\n✅ Step 5: Infrastructure Verification..."

echo "Checking pods status..."
kubectl get pods -n $NAMESPACE

echo -e "\nChecking ingress status..."
kubectl get ingress -n $NAMESPACE

echo -e "\nChecking network policies..."
kubectl get networkpolicy -n $NAMESPACE

# 6. Test DNS Resolution
echo -e "\n🔍 Step 6: Testing DNS Resolution..."
POD_NAME=$(kubectl get pods -n $NAMESPACE -l app=$BACKEND_DEPLOYMENT -o jsonpath='{.items[0].metadata.name}' 2>/dev/null || 
           kubectl get pods -n $NAMESPACE -o jsonpath='{.items[0].metadata.name}')

if [ ! -z "$POD_NAME" ]; then
    echo "Testing DNS resolution from pod: $POD_NAME"
    kubectl exec $POD_NAME -n $NAMESPACE -- nslookup api.sentratech.net || echo "DNS test failed"
    
    echo "Testing external connectivity..."
    kubectl exec $POD_NAME -n $NAMESPACE -- curl -k --connect-timeout 10 https://api.sentratech.net/v1/health || echo "Connectivity test failed"
else
    echo -e "${YELLOW}⚠️ No pods found for testing${NC}"
fi

echo -e "\n🎉 Infrastructure setup completed!"
echo -e "Next steps:"
echo -e "1. Run the verification script: ./verify-infrastructure.sh"
echo -e "2. Check admin proxy health: curl -s https://admin-matrix.preview.emergentagent.com/api/health"
echo -e "3. Verify ingest configuration shows 'ingest_configured': true"