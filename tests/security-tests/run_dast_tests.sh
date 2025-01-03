#! bin/bash
echo "running owasp/zap docker to verify the application rest api endpoints with required checks"

mkdir -p $(pwd)/test-results

token=$(curl -X POST http://localhost:5500/client_login -d 'userName=Admin&email=admin@test.com&password=admin@1234' | jq -j '.token')

docker pull zaproxy/zap-stable
docker run --rm --network=host \
  --add-host host.docker.internal:host-gateway \
  -e TZ=America/Winnipeg \
  -e app_domain=$app_domain \
  -e api_auth_token=$token \
  -v "$(pwd)":/zap/wrk/:rw \
  zaproxy/zap-stable \
  zap-api-scan.py -I \
  -t http://host.docker.internal:5500/swagger.json \
  -f openapi \
  -P 5500 \
  -r /zap/wrk/test-results/zaptestreport.html \
  --hook=/zap/wrk/zap/zap_hook.py