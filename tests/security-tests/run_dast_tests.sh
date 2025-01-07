#!/bin/bash
echo "running owasp/zap docker to verify the application rest api endpoints with required checks"

mkdir -p $(pwd)/test-results

docker pull zaproxy/zap-stable

HOST_URL=http://host.docker.internal:5500
DOCKER_NETWORK=host
DOCKER_VOLUME_SRC_PATH=$(pwd)
BASE_FOLDER_PATH=/zap/wrk
LOG_FILE_PATH=/zap/wrk/test-results/req-resp-log.txt

# Check if the CI environment variable is set to true 
if [ -n "${CI}" ] && [ "${CI}" = "true" ]; then 
    HOST_URL=http://backend:5500
    DOCKER_NETWORK=zap
fi

echo "
      HOST_URL=$HOST_URL \n
      DOCKER_NETWORK=$DOCKER_NETWORK \n
      DOCKER_VOLUME_SRC_PATH=$DOCKER_VOLUME_SRC_PATH \n
      BASE_FOLDER_PATH=$BASE_FOLDER_PATH \n
      LOG_FILE_PATH=$LOG_FILE_PATH"

mkdir -p $BASE_FOLDER_PATH/test-results
touch $BASE_FOLDER_PATH/test-results/pen-test-results.txt
chmod a+w $BASE_FOLDER_PATH/test-results/pen-test-results.txt

docker run --rm --network=$DOCKER_NETWORK \
  --add-host host.docker.internal:host-gateway \
  -e TZ=America/Winnipeg \
  -e HOST_URL=$HOST_URL \
  -e BASE_FOLDER_PATH=$BASE_FOLDER_PATH \
  -e LOG_FILE_PATH=$LOG_FILE_PATH \
  -e APP_DOMAIN=$HOST_URL \
  -e CI=$CI \
  -v "$DOCKER_VOLUME_SRC_PATH":/zap/wrk/:rw \
  -t zaproxy/zap-stable \
  bash -c "
  curl $HOST_URL/health && \
  token=$(curl -X POST $HOST_URL/client_login -d 'userName=Admin&email=admin@test.com&password=admin@1234' | jq -j '.token') && \
  export API_AUTH_TOKEN=$token && \
  zap-api-scan.py -I -d \
  -t $HOST_URL/swagger.json \
  -f openapi \
  -P 5500 \
  -J $BASE_FOLDER_PATH/test-results/report_json.json \
  -w $BASE_FOLDER_PATH/test-results/report_md.md \
  -r $BASE_FOLDER_PATH/test-results/report_html.html \
  --hook=$BASE_FOLDER_PATH/zap/zap_hook.py || true && \
  curl --location --output /home/zap/jq https://github.com/jqlang/jq/releases/latest/download/jq-linux-amd64 && \
  chmod +x /home/zap/jq && \
  /home/zap/jq --version && \
  source $BASE_FOLDER_PATH/pen_tests_swagger.sh > $BASE_FOLDER_PATH/test-results/pen-test-results.txt || true"