#!/usr/bin/env bash
set -euo pipefail

# Required env vars:
# KNS=<namespace>
# POD=<backend-pod-name>
# ADMIN_URL=https://customer-flow-5.preview.emergentagent.com
# INGEST_KEY=<32-byte-hex>
# AUTH_EMAIL=swapnil.roy@sentratech.net
# AUTH_PASSWORD=Sentra@2025

echo "== Cluster DNS/egress =="
kubectl exec -n "${KNS}" -it "${POD}" -- nslookup api.sentratech.net || true
kubectl exec -n "${KNS}" -it "${POD}" -- curl -vk https://api.sentratech.net/v1/health || true
kubectl exec -n "${KNS}" -it "${POD}" -- curl -vk -X POST https://api.sentratech.net/v1/auth/login \
  -H 'Content-Type: application/json' \
  -d "{\"email\":\"${AUTH_EMAIL}\",\"password\":\"${AUTH_PASSWORD}\"}" || true

echo "== Admin proxy health =="
curl -s "${ADMIN_URL}/api/health" | jq -r '.' || true
curl -s "${ADMIN_URL}/api/_diag/upstream" | jq -r '.' || true

echo "== Admin proxy login via /api/auth/login =="
curl -vk -c /tmp/c.txt -b /tmp/c.txt \
  -X POST "${ADMIN_URL}/api/auth/login" \
  -H 'Content-Type: application/json' \
  -d "{\"email\":\"${AUTH_EMAIL}\",\"password\":\"${AUTH_PASSWORD}\"}" || true

echo "== Ingest smoke tests (shared secret only) =="
curl -sD- -X POST "${ADMIN_URL}/api/ingest/demo_requests" \
  -H "X-INGEST-KEY: ${INGEST_KEY}" -H 'Content-Type: application/json' \
  -d '{"user_name":"TestUser","email":"test@example.com","company":"Acme","call_volume":"10000","interaction_volume":"5000","message":"Test"}' | head -n 40

curl -sD- -X POST "${ADMIN_URL}/api/ingest/contact_requests" \
  -H "X-INGEST-KEY: ${INGEST_KEY}" -H 'Content-Type: application/json' \
  -d '{"full_name":"Test User","work_email":"test@client.com","company_name":"Beta LLC","monthly_volume":"10k-50k","preferred_contact_method":"email","message":"Test"}' | head -n 40

curl -sD- -X POST "${ADMIN_URL}/api/ingest/roi_reports" \
  -H "X-INGEST-KEY: ${INGEST_KEY}" -H 'Content-Type: application/json' \
  -d '{"country":"US","monthly_volume":1200,"bpo_spending":25000,"sentratech_spending":11000,"sentratech_bundles":5,"monthly_savings":14000,"roi":74.36,"cost_reduction":0.42,"contact_email":"ops@sentratech.net"}' | head -n 40

curl -sD- -X POST "${ADMIN_URL}/api/ingest/subscriptions" \
  -H "X-INGEST-KEY: ${INGEST_KEY}" -H 'Content-Type: application/json' \
  -d '{"email":"newsletter-test@example.com","source":"infrastructure_test","preferences":{"updates":true,"product_news":true}}' | head -n 40

echo "== Expected outcomes =="
echo "- DNS resolves; upstream health/login return 200"
echo "- /api/health shows mock:false, ingest_configured:true"
echo "- /api/_diag/upstream shows dns_ok:true, health_ok:true, login_ok:true"
echo "- All ingest calls 200/201; new rows visible with WS highlights"