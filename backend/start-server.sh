
kill $(pgrep -f flask) || true
FLASK_APP=task.py flask run -h localhost -p 5500