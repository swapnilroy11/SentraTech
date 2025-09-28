# SentraTech Infrastructure Configuration Guide

## 🎯 **Objective**
Configure Kubernetes cluster to enable connectivity between the SentraTech application and the external API at `api.sentratech.net`.

## 📋 **Current Issues**
- DNS resolution for `api.sentratech.net` fails within pods
- Admin proxy shows `"ingest_configured": false`
- Upstream authentication unavailable
- WebSocket connections may need optimization

## 🛠️ **Required Infrastructure Changes**

### **Prerequisites**
- Kubernetes cluster admin access
- `kubectl` configured with appropriate context
- Cluster should have NGINX Ingress Controller installed

### **Step 1: Apply All Configurations**

```bash
# Navigate to infrastructure directory
cd /app/infrastructure

# Make script executable
chmod +x apply-infrastructure.sh

# Run the infrastructure setup script
./apply-infrastructure.sh
```

### **Step 2: Verify Namespace and Deployment Names**

Before running, update these variables in `apply-infrastructure.sh`:

```bash
# Update these to match your actual environment
NAMESPACE="emergent-agents-env"          # Your application namespace
ADMIN_DEPLOYMENT="admin-proxy"           # Your admin proxy deployment name  
BACKEND_DEPLOYMENT="backend"             # Your backend deployment name
```

### **Step 3: Manual Application (Alternative)**

If you prefer manual application:

```bash
# 1. Update CoreDNS
kubectl apply -f 01-coredns-configmap.yaml
kubectl rollout restart deployment/coredns -n kube-system
kubectl rollout status deployment/coredns -n kube-system

# 2. Apply Network Policies
kubectl apply -f 02-network-policy-egress.yaml

# 3. Update Ingress
kubectl apply -f 03-ingress-websocket.yaml

# 4. Restart application deployments
kubectl rollout restart deployment/admin-proxy -n emergent-agents-env
kubectl rollout restart deployment/backend -n emergent-agents-env
```

## 🔍 **Verification Steps**

### **1. Check Pod Status**
```bash
kubectl get pods -n emergent-agents-env
```

### **2. Test DNS Resolution**
```bash
POD_NAME=$(kubectl get pods -n emergent-agents-env -o jsonpath='{.items[0].metadata.name}')
kubectl exec $POD_NAME -n emergent-agents-env -- nslookup api.sentratech.net
```

### **3. Test External Connectivity**
```bash
kubectl exec $POD_NAME -n emergent-agents-env -- curl -k https://api.sentratech.net/v1/health
```

### **4. Verify Admin Proxy Health**
```bash
curl -s https://customer-flow-5.preview.emergentagent.com/api/health
# Expected: {"ingest_configured": true}
```

### **5. Run Comprehensive Verification**
```bash
cd /app
./verify-infrastructure.sh
```

## 📊 **Expected Results After Fix**

### **Admin Health Endpoint**
```json
{
  "ok": true,
  "service": "admin-proxy",
  "ext": "https://api.sentratech.net/v1",
  "mock": false,
  "fallback": false,
  "ingest_configured": true
}
```

### **Diagnostics Endpoint**
```json
{
  "host": "api.sentratech.net",
  "base": "https://api.sentratech.net/v1",
  "dns_ok": true,
  "health_ok": true
}
```

### **Authentication Test**
```bash
curl -X POST https://customer-flow-5.preview.emergentagent.com/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"swapnil.roy@sentratech.net","password":"Sentra@2025"}'
# Expected: HTTP 200 with authentication cookies
```

## 🚨 **Troubleshooting**

### **DNS Still Not Resolving**
```bash
# Check CoreDNS pods
kubectl get pods -n kube-system -l k8s-app=kube-dns

# Check CoreDNS logs
kubectl logs -n kube-system -l k8s-app=kube-dns --tail=50

# Restart CoreDNS again if needed
kubectl rollout restart deployment/coredns -n kube-system
```

### **Network Policy Issues**
```bash
# List network policies
kubectl get networkpolicy -n emergent-agents-env

# Delete and reapply if needed
kubectl delete networkpolicy allow-external-api-egress -n emergent-agents-env
kubectl apply -f 02-network-policy-egress.yaml
```

### **Ingress Issues**
```bash
# Check ingress status
kubectl describe ingress admin-proxy-ingress -n emergent-agents-env

# Check ingress controller logs
kubectl logs -n ingress-nginx -l app.kubernetes.io/component=controller --tail=50
```

## 📝 **Configuration Files Included**

1. **`01-coredns-configmap.yaml`** - Updates CoreDNS to forward external DNS queries
2. **`02-network-policy-egress.yaml`** - Allows egress traffic to external APIs  
3. **`03-ingress-websocket.yaml`** - Configures ingress with WebSocket support
4. **`04-deployment-restart.yaml`** - Commands for restarting deployments
5. **`apply-infrastructure.sh`** - Automated setup script

## ✅ **Success Criteria**

- [ ] DNS resolution for `api.sentratech.net` works from pods
- [ ] Admin proxy health shows `"ingest_configured": true`
- [ ] Authentication endpoint returns HTTP 200
- [ ] All ingest endpoints accept data successfully
- [ ] WebSocket connections work properly
- [ ] Verification script shows all tests passing

## 📞 **Support**

If issues persist after applying these changes:

1. Check cluster DNS configuration
2. Verify firewall rules allow outbound HTTPS traffic
3. Confirm the external API `api.sentratech.net` is accessible from your network
4. Review security groups/network ACLs in your cloud provider

Contact your DevOps team or cloud provider support if network-level issues persist.