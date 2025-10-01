#!/usr/bin/env bash
set -e

TRACE="PROD-PUB-$(date +%s)"

echo "=== SentraTech Production Deployment Verification ==="
echo "Running public test with trace_id=$TRACE"
echo ""

# Public test through HTTPS nginx proxy
curl -v -X POST "https://sentratech.net/api/collect" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"PROD-PUB-TEST\",\"email\":\"prod@test.com\",\"trace_id\":\"$TRACE\"}" \
  -k

echo
echo "Sleeping 3s then checking logs..."
sleep 3

echo "=== Proxy logs ==="
sudo tail -n 200 /var/log/sentratech/collect.log | egrep "$TRACE" -A2 -B2 || echo "No proxy logs found for $TRACE"

echo "=== Dashboard logs (example paths) ==="
sudo grep -R "$TRACE" /var/log -n 2>/dev/null || echo "No dashboard logs found for $TRACE (check dashboard server separately)"

echo "=== Nginx access logs ==="
sudo tail -n 100 /var/log/nginx/access.log | grep "/api/collect" | tail -5 || echo "No nginx access logs found"

echo "=== Service Status ==="
echo "PM2 Status:"
pm2 status 2>/dev/null || echo "PM2 not running"

echo "Proxy Service Health:"
curl -s "http://127.0.0.1:3003/internal/collect-health" || echo "Health check failed"

echo ""
echo "=== Deployment Verification Complete ==="
echo "Trace ID tested: $TRACE"