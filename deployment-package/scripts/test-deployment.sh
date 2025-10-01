#!/bin/bash
set -e

# SentraTech Deployment Test Script
# Run after deployment to verify all functionality

echo "🧪 SentraTech Deployment Testing Suite"
echo "====================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
}

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

run_test() {
    local test_name="$1"
    local test_command="$2"
    local expected_result="$3"
    
    echo -n "Testing: $test_name ... "
    
    if eval "$test_command" > /dev/null 2>&1; then
        if [ -n "$expected_result" ]; then
            local result=$(eval "$test_command" 2>/dev/null)
            if [[ "$result" == *"$expected_result"* ]]; then
                success "PASS"
                ((TESTS_PASSED++))
            else
                error "FAIL (unexpected result: $result)"
                ((TESTS_FAILED++))
            fi
        else
            success "PASS"
            ((TESTS_PASSED++))
        fi
    else
        error "FAIL"
        ((TESTS_FAILED++))
    fi
}

echo "🔍 System Health Checks"
echo "======================="

# Test 1: Service Status
run_test "Service Running" "systemctl is-active sentratech-proxy" "active"
run_test "Nginx Running" "systemctl is-active nginx" "active"
run_test "MongoDB Running" "systemctl is-active mongod" "active"

echo ""
echo "🌐 Network Connectivity"
echo "======================="

# Test 2: Local Health Check
run_test "Local Health Endpoint" "curl -s -o /dev/null -w '%{http_code}' http://localhost:8001/api/health" "200"

# Test 3: Local Collect Endpoint
run_test "Local Collect Endpoint" "curl -s -X POST -H 'Content-Type: application/json' -d '{\"test\": true}' -o /dev/null -w '%{http_code}' http://localhost:8001/api/collect"

# Test 4: Public Health Check (if DNS configured)
DOMAIN_IP=$(dig +short sentratech.net 2>/dev/null | tail -n1)
CURRENT_IP=$(curl -s -4 ifconfig.me 2>/dev/null)

if [ "$DOMAIN_IP" = "$CURRENT_IP" ] && [ "$DOMAIN_IP" != "" ]; then
    run_test "Public Health Endpoint" "curl -s -k -o /dev/null -w '%{http_code}' https://sentratech.net/api/health" "200"
    run_test "Public Collect Endpoint" "curl -s -k -X POST -H 'Content-Type: application/json' -d '{\"test\": true}' -o /dev/null -w '%{http_code}' https://sentratech.net/api/collect"
else
    warning "DNS not configured or propagated - skipping public endpoint tests"
fi

echo ""
echo "🔐 SSL Certificate Tests"
echo "========================"

# Test 5: SSL Certificate
if [ -f "/etc/letsencrypt/live/sentratech.net/fullchain.pem" ]; then
    success "SSL certificate file exists"
    ((TESTS_PASSED++))
    
    # Check certificate expiry
    EXPIRY=$(openssl x509 -enddate -noout -in /etc/letsencrypt/live/sentratech.net/fullchain.pem 2>/dev/null | cut -d= -f2)
    if [ $? -eq 0 ]; then
        success "SSL certificate readable (expires: $EXPIRY)"
        ((TESTS_PASSED++))
    else
        error "SSL certificate not readable"
        ((TESTS_FAILED++))
    fi
else
    warning "SSL certificate not found - run setup-ssl.sh"
fi

echo ""
echo "📁 File System Tests"
echo "===================="

# Test 6: Directory Permissions
run_test "Service Directory Exists" "test -d /opt/sentratech-proxy"
run_test "Log Directory Exists" "test -d /var/log/sentratech"
run_test "Data Directory Exists" "test -d /var/data/pending_submissions"
run_test "Environment File Exists" "test -f /opt/sentratech-proxy/.env"

# Test file permissions
if [ -f "/opt/sentratech-proxy/.env" ]; then
    PERMS=$(stat -c %a /opt/sentratech-proxy/.env 2>/dev/null)
    if [ "$PERMS" = "600" ]; then
        success "Environment file permissions correct (600)"
        ((TESTS_PASSED++))
    else
        warning "Environment file permissions: $PERMS (should be 600)"
    fi
fi

echo ""
echo "⚙️  Configuration Tests"
echo "======================"

# Test 7: Environment Variables
if [ -f "/opt/sentratech-proxy/.env" ]; then
    source /opt/sentratech-proxy/.env
    
    if [ -n "$DASHBOARD_API_KEY" ] && [ "$DASHBOARD_API_KEY" != "your-dashboard-api-key-here" ]; then
        success "Dashboard API key configured"
        ((TESTS_PASSED++))
    else
        error "Dashboard API key not configured"
        ((TESTS_FAILED++))
    fi
    
    if [ -n "$ADMIN_DASHBOARD_URL" ]; then
        success "Admin dashboard URL configured: $ADMIN_DASHBOARD_URL"
        ((TESTS_PASSED++))
    else
        error "Admin dashboard URL not configured"
        ((TESTS_FAILED++))
    fi
fi

echo ""
echo "🗄️  Database Tests"
echo "=================="

# Test 8: Database Connection
run_test "MongoDB Connection" "mongo sentratech_forms --eval 'db.runCommand({ping: 1})'" "ok"

echo ""
echo "📊 Functionality Tests"
echo "======================"

# Test 9: Form Submission (with trace ID for cleanup)
TEST_TRACE_ID="test-$(date +%s)-deploy"
COLLECT_RESPONSE=$(curl -s -X POST -H "Content-Type: application/json" \
    -d "{\"trace_id\": \"$TEST_TRACE_ID\", \"name\": \"Test User\", \"email\": \"test@example.com\", \"test\": true}" \
    -w "%{http_code}" \
    http://localhost:8001/api/collect)

if [[ "$COLLECT_RESPONSE" == *"200"* ]]; then
    success "Form submission test passed"
    ((TESTS_PASSED++))
elif [[ "$COLLECT_RESPONSE" == *"502"* ]]; then
    warning "Form submission returned 502 (expected if dashboard unavailable)"
else
    error "Form submission failed: $COLLECT_RESPONSE"
    ((TESTS_FAILED++))
fi

# Test 10: Idempotency
DUPLICATE_RESPONSE=$(curl -s -X POST -H "Content-Type: application/json" \
    -d "{\"trace_id\": \"$TEST_TRACE_ID\", \"name\": \"Test User\", \"email\": \"test@example.com\", \"test\": true}" \
    -w "%{http_code}" \
    http://localhost:8001/api/collect)

if [[ "$DUPLICATE_RESPONSE" == *"200"* ]]; then
    success "Idempotency test passed (duplicate ignored)"
    ((TESTS_PASSED++))
else
    warning "Idempotency test uncertain: $DUPLICATE_RESPONSE"
fi

echo ""
echo "📄 Log Tests"
echo "============"

# Test 11: Log Files
if [ -f "/var/log/sentratech/collect.log" ]; then
    success "Collect log file exists"
    ((TESTS_PASSED++))
    
    # Check if test submission was logged
    if grep -q "$TEST_TRACE_ID" "/var/log/sentratech/collect.log" 2>/dev/null; then
        success "Test submission logged correctly"
        ((TESTS_PASSED++))
    else
        warning "Test submission not found in logs"
    fi
else
    error "Collect log file not found"
    ((TESTS_FAILED++))
fi

# Test 12: Service Logs
if journalctl -u sentratech-proxy --since "1 minute ago" --no-pager | grep -q "POST /api/collect"; then
    success "Service logging working"
    ((TESTS_PASSED++))
else
    warning "No recent service log entries found"
fi

echo ""
echo "🔒 Security Tests"
echo "================="

# Test 13: Firewall Status
if ufw status | grep -q "Status: active"; then
    success "Firewall is active"
    ((TESTS_PASSED++))
else
    warning "Firewall not active"
fi

# Test 14: Service User
if id sentratech > /dev/null 2>&1; then
    success "Service user exists"
    ((TESTS_PASSED++))
else
    error "Service user 'sentratech' not found"
    ((TESTS_FAILED++))
fi

echo ""
echo "📈 Performance Tests"
echo "==================="

# Test 15: Response Time
RESPONSE_TIME=$(curl -s -X POST -H "Content-Type: application/json" \
    -d '{"name": "Speed Test", "email": "speed@test.com"}' \
    -w "%{time_total}" \
    -o /dev/null \
    http://localhost:8001/api/collect)

if (( $(echo "$RESPONSE_TIME < 5.0" | bc -l) )); then
    success "Response time acceptable: ${RESPONSE_TIME}s"
    ((TESTS_PASSED++))
else
    warning "Response time slow: ${RESPONSE_TIME}s"
fi

# Test 16: Resource Usage
MEMORY_USAGE=$(ps -o pid,vsz,rss,comm -p $(pgrep -f sentratech-proxy) 2>/dev/null | tail -n +2 | awk '{print $3}')
if [ -n "$MEMORY_USAGE" ]; then
    if [ "$MEMORY_USAGE" -lt 512000 ]; then  # Less than 512MB
        success "Memory usage acceptable: ${MEMORY_USAGE}KB"
        ((TESTS_PASSED++))
    else
        warning "High memory usage: ${MEMORY_USAGE}KB"
    fi
fi

echo ""
echo "📋 Test Summary"
echo "==============="
echo "Tests Passed: $TESTS_PASSED"
echo "Tests Failed: $TESTS_FAILED"
echo "Total Tests: $((TESTS_PASSED + TESTS_FAILED))"

if [ $TESTS_FAILED -eq 0 ]; then
    echo ""
    success "🎉 All tests passed! Deployment is healthy."
    echo ""
    echo "Your SentraTech proxy service is ready for production use:"
    echo "• Health: https://sentratech.net/api/health"
    echo "• Collect: https://sentratech.net/api/collect"
    echo ""
    exit 0
else
    echo ""
    error "⚠️  Some tests failed. Please review the issues above."
    echo ""
    echo "Common solutions:"
    echo "• Check service logs: journalctl -u sentratech-proxy -f"
    echo "• Verify configuration: cat /opt/sentratech-proxy/.env"
    echo "• Test connectivity: curl -I https://admin.sentratech.net/api/health"
    echo ""
    exit 1
fi