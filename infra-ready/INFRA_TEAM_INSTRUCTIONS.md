# 🚀 SentraTech Infrastructure Setup - Ready-to-Apply

## 📋 **Quick Start (One Command)**

1. **Update configuration** in `apply-all.sh`:
   ```bash
   NAMESPACE="your-actual-namespace"
   ADMIN_DEPLOYMENT="your-admin-deployment-name"  
   SERVICE_NAME="your-service-name"
   ```

2. **Apply all infrastructure changes**:
   ```bash
   chmod +x apply-all.sh
   ./apply-all.sh
   ```

3. **Run verification**:
   ```bash
   # Set required environment variables
   export KNS="your-namespace"
   export POD=$(kubectl get pods -n $KNS -o jsonpath='{.items[0].metadata.name}')
   export ADMIN_URL="https://formflow-repair.preview.emergentagent.com"
   export INGEST_KEY="a0d3f2b6c9e4d1784a92f3c1b5e6d0aa7c18e2f49b35c6d7e8f0a1b2c3d4e5f6"
   export AUTH_EMAIL="swapnil.roy@sentratech.net"
   export AUTH_PASSWORD="Sentra@2025"
   
   # Run verification
   chmod +x verify-infrastructure.sh
   bash verify-infrastructure.sh
   ```

## 📄 **Individual Components (Manual Application)**

If you prefer to apply components individually:

### **1. CoreDNS (DNS Resolution)**
```bash
kubectl apply -f coredns-configmap.yaml
kubectl rollout restart deployment/coredns -n kube-system
kubectl rollout status deployment/coredns -n kube-system
```

### **2. NetworkPolicy (Egress Traffic)**
```bash
# Update namespace in networkpolicy-egress.yaml first
kubectl apply -f networkpolicy-egress.yaml
```

### **3. Ingress (WebSocket Support)**
```bash
# Update namespace and service names in ingress-websocket.yaml first
kubectl apply -f ingress-websocket.yaml
```

### **4. Restart Deployments**
```bash
kubectl rollout restart deployment/admin-proxy -n your-namespace
```

## 🔍 **Required Outputs to Send Back**

After applying the infrastructure changes, please provide these outputs:

### **1. Admin Proxy Health**
```bash
curl -s https://formflow-repair.preview.emergentagent.com/api/health
```
**Expected**: `{"ingest_configured": true, "mock": false}`

### **2. Admin Proxy Diagnostics**  
```bash
curl -s https://formflow-repair.preview.emergentagent.com/api/_diag/upstream
```
**Expected**: `{"dns_ok": true, "health_ok": true, "login_ok": true}`

### **3. Full Verification Output**
```bash
# After setting environment variables above
bash verify-infrastructure.sh
```

### **4. WebSocket Test (Optional)**
- Open browser to `https://formflow-repair.preview.emergentagent.com`
- Check Network tab in DevTools
- Confirm `/api/ws` shows Status: 101 (WebSocket Upgrade)

## 🛠️ **What Each Component Does**

| Component | Purpose | File |
|-----------|---------|------|
| **CoreDNS** | Enables DNS resolution for `api.sentratech.net` | `coredns-configmap.yaml` |
| **NetworkPolicy** | Allows outbound HTTPS traffic to external APIs | `networkpolicy-egress.yaml` |  
| **Ingress** | Enables WebSocket upgrades and proper routing | `ingress-websocket.yaml` |
| **Verification** | Tests all connectivity and functionality | `verify-infrastructure.sh` |

## 🚨 **Troubleshooting**

### **DNS Still Not Working**
```bash
# Check CoreDNS pods
kubectl get pods -n kube-system -l k8s-app=kube-dns

# Check CoreDNS logs  
kubectl logs -n kube-system -l k8s-app=kube-dns --tail=20

# Test DNS from a pod
kubectl exec -n your-namespace -it your-pod -- nslookup api.sentratech.net
```

### **NetworkPolicy Issues**
```bash
# Check if NetworkPolicies exist
kubectl get networkpolicy -n your-namespace

# If too restrictive, temporarily delete
kubectl delete networkpolicy allow-egress-https -n your-namespace
```

### **Ingress Issues**
```bash
# Check ingress status
kubectl describe ingress admin-proxy-ingress -n your-namespace

# Check nginx ingress controller logs
kubectl logs -n ingress-nginx -l app.kubernetes.io/component=controller --tail=20
```

## ✅ **Success Criteria**

The verification should show:
- ✅ DNS resolution working for `api.sentratech.net`
- ✅ Upstream health returning HTTP 200
- ✅ Admin proxy health showing `ingest_configured: true`
- ✅ All ingest endpoints accepting data (HTTP 200/201)
- ✅ WebSocket connections upgrading successfully

## 📞 **Support**

If issues persist:
1. Verify cluster has external internet access
2. Check cloud provider firewall rules
3. Confirm NGINX Ingress Controller is installed and working
4. Test basic external connectivity: `kubectl run test --rm -it --image=busybox -- nslookup google.com`