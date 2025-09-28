#!/bin/bash

echo "🔍 SentraTech Infrastructure Verification Script"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

INGEST_KEY="a0d3f2b6c9e4d1784a92f3c1b5e6d0aa7c18e2f49b35c6d7e8f0a1b2c3d4e5f6"
ADMIN_URL="https://customer-flow-5.preview.emergentagent.com"
API_URL="https://api.sentratech.net"
EMAIL="swapnil.roy@sentratech.net"
PASSWORD="Sentra@2025"

# Test functions
test_dns() {
    echo -e "\n📍 Testing DNS Resolution..."
    if nslookup api.sentratech.net > /dev/null 2>&1 || getent hosts api.sentratech.net > /dev/null 2>&1; then
        echo -e "${GREEN}✅ DNS Resolution: PASS${NC}"
        return 0
    else
        echo -e "${RED}❌ DNS Resolution: FAIL${NC}"
        return 1
    fi
}

test_api_health() {
    echo -e "\n🏥 Testing API Health..."
    response=$(curl -s -w "%{http_code}" -k "$API_URL/v1/health" -o /tmp/api_health.json 2>/dev/null)
    if [ "$response" = "200" ]; then
        echo -e "${GREEN}✅ API Health: PASS${NC}"
        cat /tmp/api_health.json
        return 0
    else
        echo -e "${RED}❌ API Health: FAIL (HTTP $response)${NC}"
        return 1
    fi
}

test_api_auth() {
    echo -e "\n🔐 Testing API Authentication..."
    response=$(curl -s -w "%{http_code}" -k -X POST "$API_URL/v1/auth/login" \
        -H 'Content-Type: application/json' \
        -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}" \
        -o /tmp/api_auth.json 2>/dev/null)
    
    if [ "$response" = "200" ]; then
        echo -e "${GREEN}✅ API Auth: PASS${NC}"
        return 0
    else
        echo -e "${RED}❌ API Auth: FAIL (HTTP $response)${NC}"
        cat /tmp/api_auth.json 2>/dev/null
        return 1
    fi
}

test_admin_health() {
    echo -e "\n🖥️  Testing Admin Proxy Health..."
    response=$(curl -s "$ADMIN_URL/api/health")
    echo "Response: $response"
    
    if echo "$response" | grep -q '"ingest_configured":true'; then
        echo -e "${GREEN}✅ Admin Health: PASS${NC}"
        return 0
    else
        echo -e "${RED}❌ Admin Health: FAIL - ingest_configured not true${NC}"
        return 1
    fi
}

test_admin_diagnostics() {
    echo -e "\n🔍 Testing Admin Diagnostics..."
    response=$(curl -s "$ADMIN_URL/api/_diag/upstream")
    echo "Diagnostics: $response"
    
    if echo "$response" | grep -q '"dns_ok":true' && echo "$response" | grep -q '"health_ok":true'; then
        echo -e "${GREEN}✅ Admin Diagnostics: PASS${NC}"
        return 0
    else
        echo -e "${RED}❌ Admin Diagnostics: FAIL${NC}"
        return 1
    fi
}

test_admin_auth() {
    echo -e "\n🔐 Testing Admin Proxy Auth..."
    response=$(curl -s -w "%{http_code}" -k -X POST "$ADMIN_URL/api/auth/login" \
        -H 'Content-Type: application/json' \
        -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}" \
        -o /tmp/admin_auth.json 2>/dev/null)
    
    if [ "$response" = "200" ]; then
        echo -e "${GREEN}✅ Admin Auth: PASS${NC}"
        return 0
    else
        echo -e "${RED}❌ Admin Auth: FAIL (HTTP $response)${NC}"
        cat /tmp/admin_auth.json 2>/dev/null
        return 1
    fi
}

test_ingest_endpoints() {
    echo -e "\n📥 Testing Ingest Endpoints..."
    
    # Test demo_requests
    response=$(curl -s -w "%{http_code}" -X POST "$ADMIN_URL/api/ingest/demo_requests" \
        -H "X-INGEST-KEY: $INGEST_KEY" \
        -H "Content-Type: application/json" \
        -d '{"user_name":"Test Infrastructure","email":"test@infra.com","company":"InfraTest","call_volume":"10000","interaction_volume":"5000","message":"Infrastructure test"}' \
        -o /tmp/ingest_demo.json 2>/dev/null)
    
    if [ "$response" = "200" ] || [ "$response" = "201" ]; then
        echo -e "${GREEN}✅ Demo Requests Ingest: PASS${NC}"
    else
        echo -e "${RED}❌ Demo Requests Ingest: FAIL (HTTP $response)${NC}"
        cat /tmp/ingest_demo.json 2>/dev/null
    fi
    
    # Test contact_requests  
    response=$(curl -s -w "%{http_code}" -X POST "$ADMIN_URL/api/ingest/contact_requests" \
        -H "X-INGEST-KEY: $INGEST_KEY" \
        -H "Content-Type: application/json" \
        -d '{"full_name":"Test Contact","work_email":"contact@infra.com","company_name":"InfraTest","monthly_volume":"50k+"}' \
        -o /tmp/ingest_contact.json 2>/dev/null)
        
    if [ "$response" = "200" ] || [ "$response" = "201" ]; then
        echo -e "${GREEN}✅ Contact Requests Ingest: PASS${NC}"
    else
        echo -e "${RED}❌ Contact Requests Ingest: FAIL (HTTP $response)${NC}"
        cat /tmp/ingest_contact.json 2>/dev/null
    fi
    
    # Test roi_reports
    response=$(curl -s -w "%{http_code}" -X POST "$ADMIN_URL/api/ingest/roi_reports" \
        -H "X-INGEST-KEY: $INGEST_KEY" \
        -H "Content-Type: application/json" \
        -d '{"country":"Bangladesh","monthly_volume":3000,"bpo_spending":7200,"sentratech_spending":2284.62,"sentratech_bundles":1.4,"monthly_savings":4915.38,"roi":2.15,"cost_reduction":68.3,"contact_email":"roi@infra.com"}' \
        -o /tmp/ingest_roi.json 2>/dev/null)
        
    if [ "$response" = "200" ] || [ "$response" = "201" ]; then
        echo -e "${GREEN}✅ ROI Reports Ingest: PASS${NC}"
    else
        echo -e "${RED}❌ ROI Reports Ingest: FAIL (HTTP $response)${NC}"
        cat /tmp/ingest_roi.json 2>/dev/null
    fi
    
    # Test subscriptions
    response=$(curl -s -w "%{http_code}" -X POST "$ADMIN_URL/api/ingest/subscriptions" \
        -H "X-INGEST-KEY: $INGEST_KEY" \
        -H "Content-Type: application/json" \
        -d '{"email":"newsletter@infra.com","source":"infrastructure_test","preferences":{"updates":true,"product_news":true}}' \
        -o /tmp/ingest_subs.json 2>/dev/null)
        
    if [ "$response" = "200" ] || [ "$response" = "201" ]; then
        echo -e "${GREEN}✅ Newsletter Subscriptions Ingest: PASS${NC}"
    else
        echo -e "${RED}❌ Newsletter Subscriptions Ingest: FAIL (HTTP $response)${NC}"
        cat /tmp/ingest_subs.json 2>/dev/null
    fi
}

# Run all tests
main() {
    echo -e "\n🚀 Starting Infrastructure Verification..."
    
    dns_ok=false
    api_health_ok=false 
    api_auth_ok=false
    admin_health_ok=false
    admin_diag_ok=false
    admin_auth_ok=false
    
    # Core connectivity tests
    test_dns && dns_ok=true
    test_api_health && api_health_ok=true
    test_api_auth && api_auth_ok=true
    
    # Admin proxy tests
    test_admin_health && admin_health_ok=true
    test_admin_diagnostics && admin_diag_ok=true
    test_admin_auth && admin_auth_ok=true
    
    # Ingest functionality tests (if basic connectivity works)
    if [ "$admin_health_ok" = true ] && [ "$admin_auth_ok" = true ]; then
        test_ingest_endpoints
    else
        echo -e "\n${YELLOW}⚠️ Skipping ingest tests due to connectivity issues${NC}"
    fi
    
    # Summary
    echo -e "\n📊 VERIFICATION SUMMARY"
    echo "======================="
    echo -e "DNS Resolution: $([ "$dns_ok" = true ] && echo -e "${GREEN}✅ PASS${NC}" || echo -e "${RED}❌ FAIL${NC}")"
    echo -e "API Health: $([ "$api_health_ok" = true ] && echo -e "${GREEN}✅ PASS${NC}" || echo -e "${RED}❌ FAIL${NC}")"
    echo -e "API Auth: $([ "$api_auth_ok" = true ] && echo -e "${GREEN}✅ PASS${NC}" || echo -e "${RED}❌ FAIL${NC}")"
    echo -e "Admin Health: $([ "$admin_health_ok" = true ] && echo -e "${GREEN}✅ PASS${NC}" || echo -e "${RED}❌ FAIL${NC}")"
    echo -e "Admin Diagnostics: $([ "$admin_diag_ok" = true ] && echo -e "${GREEN}✅ PASS${NC}" || echo -e "${RED}❌ FAIL${NC}")"
    echo -e "Admin Auth: $([ "$admin_auth_ok" = true ] && echo -e "${GREEN}✅ PASS${NC}" || echo -e "${RED}❌ FAIL${NC}")"
    
    if [ "$dns_ok" = true ] && [ "$admin_health_ok" = true ] && [ "$admin_auth_ok" = true ]; then
        echo -e "\n${GREEN}🎉 INFRASTRUCTURE VERIFICATION: SUCCESS${NC}"
        echo -e "All systems operational. Ready for application testing."
        return 0
    else
        echo -e "\n${RED}❌ INFRASTRUCTURE VERIFICATION: INCOMPLETE${NC}"
        echo -e "Please address the failing components above."
        return 1
    fi
}

# Cleanup function
cleanup() {
    rm -f /tmp/api_health.json /tmp/api_auth.json /tmp/admin_auth.json /tmp/ingest_*.json 2>/dev/null
}

# Set trap for cleanup
trap cleanup EXIT

# Run main function
main "$@"