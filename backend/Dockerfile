# syntax = docker/dockerfile:1.0-experimental

### commands to run this dockerfile individually from repo root folder
## docker buildx build --platform=linux/amd64 -t backend:v1  -f backend/Dockerfile .
## docker network create zap || true
## docker run --platform=linux/amd64 -e TASK_NAME=task_with_swagger.py --network=zap --name backend --rm -t backend:v1 

FROM python:3.11-alpine

# SHELL ["/bin/bash", "-c"]

ENV REPO_PATH=/usr/repo
ENV TZ=Canada/Central
ENV NODE_TLS_REJECT_UNAUTHORIZED='0'

ENV BASE_URL=http://localhost:5500
ENV TASK_NAME=task.py
ENV TEST_ENV=local
ENV PORT=5500

EXPOSE $PORT

COPY backend/ backend/
RUN pip install -r backend/requirments.txt
RUN chmod -R u+w /backend/database.db

# CMD flask run -h 0.0.0.0 -p 5500
CMD cd /backend && pwd && ls -la && \
python3 --version && \
FLASK_APP=$TASK_NAME flask run --host 0.0.0.0 -p $PORT




# FROM debian:bullseye

# SHELL ["/bin/bash", "-c"] 

# # docker container specific environment variables
# ENV REPO_PATH=/usr/repo
# ENV TZ=Canada/Central
# ENV NODE_TLS_REJECT_UNAUTHORIZED='0'

# ENV BASE_URL=http://localhost:5500
# ENV TASK_NAME=task_with_swagger.py
# ENV TEST_ENV=local

# # this environment variable is required to provide the encoded jdk url 
# # as a default argument without getting decoded while passing as a
# # string substitution to wget or curl download in debain
# ENV LANG=C.UTF-8

# ENV USER=backend_user
# ENV GROUP=backend_user
# ENV PORT=5500

# EXPOSE $PORT

# RUN addgroup --gid 1000 ${USER} && \
#     adduser --uid 1000 --ingroup ${GROUP} --home /home/${USER} --shell /bin/sh --disabled-password --gecos "" ${USER}

# # install fixuid
# # refer for more details: https://github.com/boxboat/fixuid
# ARG FIXUID_VERSION=0.6.0
# RUN apt-get update && \
#     apt-get install -y locales apt-utils chromium-bsu wget curl jq zip unzip groff ca-certificates gnupg && \
#     wget -q -O - https://github.com/boxboat/fixuid/releases/download/v${FIXUID_VERSION}/fixuid-${FIXUID_VERSION}-linux-amd64.tar.gz | tar -C /usr/local/bin -xzf - && \
#     chown root:root /usr/local/bin/fixuid && \
#     chmod 4755 /usr/local/bin/fixuid && \
#     mkdir -p /etc/fixuid && \
#     printf "user: ${USER}\ngroup: ${GROUP}\n" > /etc/fixuid/config.yml

# # install python3
# RUN apt-get clean && apt-get update && apt-get install -y software-properties-common gcc && \
#     apt-get update && apt-get install -y python3 python3-distutils python3-pip python3-apt

# COPY backend/ backend/
# RUN chmod -R u+w /backend/database.db

# # install dependencies
# RUN cd /backend && pip3 install --no-cache-dir -r requirments.txt 

# # finish all the required dependencies installation before this step 
# # we might get permission issues for new folder creation with fixuid post USER construct in Dockerfile
# RUN chown -R ${USER}:${GROUP} /backend && \ 
# chmod -R u+w /backend/database.db

# USER ${USER}

# ENTRYPOINT ["fixuid"]

# CMD cd /backend && pwd && ls -la && \
# python3 --version && \
# FLASK_APP=$TASK_NAME flask run --host 0.0.0.0 -p $PORT