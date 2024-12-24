# syntax = docker/dockerfile:1.0-experimental

### docker multi-stage build file

### commands to run this dockerfile individually
## docker buildx build --platform=linux/amd64 -t load-test:v1  -f Dockerfile .
## docker run --platform=linux/amd64 --name test-run --rm load-test:v1 

## docker-compose build --no-cache
## docker-compose up
## docker-compose down --remove-orphans --rmi local

# stage to build k6 executable
FROM golang:1.22-bullseye as go-builder

WORKDIR /app

# setting up xk6 and build k6 bundler with extensions


RUN GO_ENABLED=1 go install -trimpath go.k6.io/xk6/cmd/xk6@latest && \
    rm -rf $GOPATH/go.mod && \
    CGO_ENABLED=1 xk6 build --output '/bin/k6' \
    --with github.com/grafana/xk6-faker@v0.3.2 \
    --with github.com/grafana/xk6-browser \
    --with github.com/avitalique/xk6-file@v1.4.0 \
    --with github.com/szkiba/xk6-csv@v0.1.4 \
    --with github.com/grafana/xk6-sql@v1.0.1 \
    --with github.com/grafana/xk6-sql-driver-sqlite3@v0.1.0 \
    --with github.com/grafana/xk6-exec@v0.4.1

# final load test container that will be used in gitlab pipelines
FROM debian:bullseye

SHELL ["/bin/bash", "-c"] 

# docker container specific environment variables
ENV REPO_PATH=/usr/repo
ENV PATH=/usr/repo/node_modules/.bin:$PATH
ENV TZ=Canada/Central
ENV NODE_TLS_REJECT_UNAUTHORIZED='0'

ENV BASE_URL=http://localhost:5500
ENV TEST_NAME=user_registration_test
ENV TEST_ENV=local
ENV XK6_HEADLESS=true
ENV K6_BROWSER_ENABLED=true
ENV K6_BROWSER_HEADLESS=true
ENV K6_BROWSER_ARGS='no-sandbox,disable-gpu,disable-setuid-sandbox,disable-dev-shm-usage,single-process,disable-web-security,no-zygote,remote-debugging-port=9222'

# this environment variable is required to provide the encoded jdk url 
# as a default argument without getting decoded while passing as a
# string substitution to wget or curl download in debain
ENV LANG=C.UTF-8

ENV USER=load_test_user
ENV GROUP=load_test_user

RUN addgroup --gid 1000 ${USER} && \
    adduser --uid 1000 --ingroup ${GROUP} --home /home/${USER} --shell /bin/sh --disabled-password --gecos "" ${USER}

# install fixuid
# refer for more details: https://github.com/boxboat/fixuid
ARG FIXUID_VERSION=0.6.0
RUN apt-get update && \
    apt-get install -y locales apt-utils chromium-bsu wget curl jq zip unzip groff ca-certificates gnupg && \
    wget -q -O - https://github.com/boxboat/fixuid/releases/download/v${FIXUID_VERSION}/fixuid-${FIXUID_VERSION}-linux-amd64.tar.gz | tar -C /usr/local/bin -xzf - && \
    chown root:root /usr/local/bin/fixuid && \
    chmod 4755 /usr/local/bin/fixuid && \
    mkdir -p /etc/fixuid && \
    printf "user: ${USER}\ngroup: ${GROUP}\n" > /etc/fixuid/config.yml


# install nodejs
RUN apt-get clean && \
    apt-get update && \
    apt-get purge nodejs && \
    rm -r /etc/apt/sources.list.d/nodesource.list || true &&\
    rm -r /etc/apt/keyrings/nodesource.gpg || true && \
    mkdir -p /etc/apt/keyrings && \
    curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg && \
    NODE_MAJOR=20 && \
    echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list && \
    apt-get update && \
    apt-get install -y nodejs && \
    node --version && \
    npm --version 

# install python3
RUN apt-get update && apt-get install -y software-properties-common gcc && \
    apt-get update && apt-get install -y python3 python3-distutils python3-pip python3-apt

COPY --from=go-builder /bin/k6 /usr/repo/bin/k6

COPY backend/ backend/
RUN chmod -R u+w /backend/database.db

WORKDIR /usr/repo
COPY tests/performance-tests/package.json ./ 
COPY tests/performance-tests/env ./env
COPY tests/performance-tests/src ./src

# install load test dependencies
# install load test dependencies
RUN cd /backend && pip3 install --no-cache-dir -r requirments.txt \
    && cd /usr/repo && npm install

# finish all the required dependencies installation before this step 
# we might get permission issues for new folder creation with fixuid post USER construct in Dockerfile
RUN chown -R ${USER}:${GROUP} /usr/repo && \
    chown -R ${USER}:${GROUP} /backend && \ 
chmod -R u+w /backend/database.db

USER ${USER}

ENTRYPOINT ["fixuid"]

CMD cd /backend && pwd && ls -la && \
python3 --version && \
source start-server.sh && \
sleep 1 && \
curl -s http://localhost:5500/ && \
cd /usr/repo && pwd && ls -la && \
npx dotenv -e ./env/.${TEST_ENV}.env ./bin/k6 run src/tests/$TEST_NAME.js