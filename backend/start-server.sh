#!/bin/bash
FLASK_APP=task.py flask run -h localhost -p 5500 &

# kill the process to stop the server if needed
# kill $(pgrep -f flask)