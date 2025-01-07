# syntax = docker/dockerfile:1.0-experimental

### commands to run this dockerfile individually from repo root folder
## docker buildx build --platform=linux/amd64 -t backend:v1  -f backend/Dockerfile .
## docker network create zap || true
## docker run --platform=linux/amd64 -e TASK_NAME=task_with_swagger.py --network=zap --name backend --rm -t backend:v1 

FROM python:3.11-alpine

ENV REPO_PATH=/usr/repo
ENV TZ=Canada/Central

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