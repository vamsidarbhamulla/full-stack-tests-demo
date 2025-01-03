#!/bin/bash

# kill the process to stop the server if needed
kill $(pgrep -f flask) || true

FLASK_APP=task_with_swagger.py flask run -h localhost -p 5500 &

