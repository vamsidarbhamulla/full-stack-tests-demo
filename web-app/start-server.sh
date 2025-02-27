#!/bin/bash

# Check if the CI environment variable is set to false 
if [ -n "${CI}" ] && [ "${CI}" = "false" ]; then 
    # Execute the docker ps command 
    echo "Stopping and removing all containers"
    docker stop $(docker ps -a -q)
    docker rm $(docker ps -a -q)  || true
else 
    echo "CI environment always start with clean env" 
fi
# clean up running/stopped containers for a fresh start 


# pull down the latest image for owasp juice shop
# reference: https://github.com/juice-shop/juice-shop?tab=readme-ov-file#docker-container
docker pull bkimminich/juice-shop
# run the image in background as a container listening on port 3000
# with the NODE_ENV variable set to unsafe to access all the possible security vulnerabilities
docker run -e "NODE_ENV=unsafe" -d --rm -p 3000:3000 bkimminich/juice-shop
# run a curl command to verify the server is up and running 
# this command returns the homepage html content
sleep 10 && curl http://localhost:3000 | grep " <title>OWASP Juice Shop</title>"

