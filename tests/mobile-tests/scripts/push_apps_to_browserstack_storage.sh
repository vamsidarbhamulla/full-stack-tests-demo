#!/bin/bash

## US
# Android
curl -u "USERNAME:ACCESS_KEY" \
-X POST "https://api-cloud.browserstack.com/app-live/upload" \
-F "file=../apps/WikipediaSample.apk"