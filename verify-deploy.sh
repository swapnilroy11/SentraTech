#!/usr/bin/env bash
# verify-deploy.sh
# Usage: DASHBOARD_API_KEY="sk-..." ./verify-deploy.sh
# Optional env overrides:
#   COLLECT_PORT   (default 3003)
#   PUBLIC_HOST    (default sentratech.net)
#   DASHBOARD_HOST (default admin.sentratech.net)
#   PROXY_LOG      (default /var/log/sentratech/collect.log)
#   DASHBOARD_LOG  (set to path on dashboard host or local path if available)
# Requires: curl, sed, grep, date, openssl (installed on most servers)
set -eo pipefail

# --------------------------
# Configurable vars (edit or export before running)
COLLECT_PORT="${COLLECT_PORT:-3003}"
PUBLIC_HOST="${PUBLIC_HOST:-sentratech.net}"
DASHBOARD_HOST="${DASHBOARD_HOST:-admin.sentratech.net}"
PROXY_LOG="${PROXY_LOG:-/var/log/sentratech/collect.log}"
DASHBOARD_LOG="${DASHBOARD_LOG:-/var/log/*}"   # try common locations; better to set exact path
RESULT_DIR="${RESULT_DIR:-/tmp/verify-deploy-$(date +%s)}"
DASHBOARD_API_KEY="${DASHBOARD_API_KEY:-}"

# Minimum checks
if [ -z "$DASHBOARD_API_KEY" ]; then
  echo "ERROR: Please export DASHBOARD_API_KEY before running."
  echo "  e.g. export DASHBOARD_API_KEY='sk-...' && ./verify-deploy.sh"
  exit 2
fi

mkdir -p "$RESULT_DIR"
OUT="$RESULT_DIR/out.txt"
MASK="REDACTED_TOKEN"

echo "Starting verification run. Results will be in: $RESULT_DIR"
echo "Timestamp: $(date -u +"%Y-%m-%dT%H:%M:%SZ")" | tee "$OUT"

# Helper: mask actual token in outputs
mask_token() {
  sed "s/${DASHBOARD_API_KEY}/${MASK}/g"
}

# Generate trace IDs
TRACE_LOCAL="PROXY-LOCAL-$(date +%s)"
TRACE_PUBLIC="PROXY-PUB-$(date +%s)"
TRACE_FINAL="FINAL-PROD-$(date +%s)"

# Function to run curl and capture output, masking token in headers
run_curl() {
  local url="$1"
  local body="$2"
  local fname="$3"
  echo "=== CURL -> $url" | tee -a "$OUT"
  # Use --insecure only for debugging self-signed certs; avoid if using Let's Encrypt
  curl -v -sS --show-error -X POST "$url" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $DASHBOARD_API_KEY" \
    -d "$body" 2>&1 | mask_token | tee -a "$RESULT_DIR/$fname"
  echo -e "\n--- end curl ---" | tee -a "$OUT"
}

# Local test (direct to proxy on localhost)
LOCAL_URL="http://127.0.0.1:${COLLECT_PORT}/api/collect"
LOCAL_BODY="{\"name\":\"PROXY-DEPLOY-LOCAL\",\"email\":\"deploy.local@${PUBLIC_HOST}\",\"trace_id\":\"${TRACE_LOCAL}\"}"
run_curl "$LOCAL_URL" "$LOCAL_BODY" "curl-local.txt"

# Public test (via production domain)
PUBLIC_URL="https://${PUBLIC_HOST}/api/collect"
PUBLIC_BODY="{\"name\":\"PROXY-DEPLOY-PUB\",\"email\":\"deploy.public@${PUBLIC_HOST}\",\"trace_id\":\"${TRACE_PUBLIC}\"}"
run_curl "$PUBLIC_URL" "$PUBLIC_BODY" "curl-public.txt"

# Final production-style test
FINAL_BODY="{\"name\":\"FINAL-PROD\",\"email\":\"final@${PUBLIC_HOST}\",\"trace_id\":\"${TRACE_FINAL}\"}"
run_curl "$PUBLIC_URL" "$FINAL_BODY" "curl-final.txt"

# TLS check (openssl) — capture server cert details
echo "=== TLS check for $PUBLIC_HOST:443 ===" | tee -a "$OUT"
openssl s_client -connect "${PUBLIC_HOST}:443" -servername "${PUBLIC_HOST}" </dev/null 2>&1 | sed -n '1,120p' | mask_token | tee -a "$RESULT_DIR/openssl.txt"

# Wait a short time for logs to flush then grep logs
echo "Waiting 2 seconds for logs to flush..."
sleep 2

echo "=== Searching proxy logs ($PROXY_LOG) for trace IDs ===" | tee -a "$OUT"
grep -n -E "${TRACE_LOCAL}|${TRACE_PUBLIC}|${TRACE_FINAL}" "$PROXY_LOG" 2>/dev/null | tee -a "$RESULT_DIR/proxy-log-grep.txt" || echo "No proxy log entries found in $PROXY_LOG" | tee -a "$OUT"

# Dashboard logs: try to grep common locations or provided path (may need sudo)
echo "=== Searching dashboard logs (glob: $DASHBOARD_LOG) for trace IDs ===" | tee -a "$OUT"
# This command may require sudo depending on log permissions
if sudo grep -n -R -E "${TRACE_LOCAL}|${TRACE_PUBLIC}|${TRACE_FINAL}" $DASHBOARD_LOG 2>/dev/null | tee -a "$RESULT_DIR/dashboard-log-grep.txt"; then
  echo "Found trace ids in dashboard logs." | tee -a "$OUT"
else
  echo "No dashboard logs matched locally. If your dashboard is on a separate host, ask dashboard team to grep for these trace ids:" | tee -a "$OUT"
  echo "  $TRACE_LOCAL" | tee -a "$OUT"
  echo "  $TRACE_PUBLIC" | tee -a "$OUT"
  echo "  $TRACE_FINAL" | tee -a "$OUT"
fi

# Summarize results (based on curl outputs)
echo "=== SUMMARY ===" | tee -a "$OUT"
for f in curl-local.txt curl-public.txt curl-final.txt; do
  echo "---- $f ----" | tee -a "$OUT"
  head -n 200 "$RESULT_DIR/$f" | mask_token | tee -a "$OUT"
done

echo "Full raw outputs are available under: $RESULT_DIR"
echo "Please share the following items with dashboard/ops for final verification if needed:"
echo "- $RESULT_DIR/curl-public.txt"
echo "- $RESULT_DIR/curl-final.txt"
echo "- $RESULT_DIR/proxy-log-grep.txt"
echo "- $RESULT_DIR/dashboard-log-grep.txt (if present)"

# Exit with 0 if at least public curl returned a 200 somewhere in curl-public.txt
if grep -q "HTTP/1.1 200" "$RESULT_DIR/curl-public.txt" || grep -q "HTTP/2 200" "$RESULT_DIR/curl-public.txt"; then
  echo "PUBLIC CURL OK" | tee -a "$OUT"
  exit 0
else
  echo "PUBLIC CURL FAILED — inspect $RESULT_DIR for details" | tee -a "$OUT"
  exit 3
fi