#!bin/sh

TEST_ENV=local TEST_NAME=user_registration_test docker-compose up

TEST_ENV=local TEST_NAME=user_registration_test docker-compose up --build  --force-recreate --abort-on-container-exit