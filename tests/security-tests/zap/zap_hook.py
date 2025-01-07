# A scan hook (https://www.zaproxy.org/docs/docker/scan-hooks/) which adds a script for logging all requests.
# Then run ZAP like this:
#     docker run -v $(pwd):/zap/wrk/:rw -t zaproxy/zap-stable zap_hook.py -t http://host.docker.internal:5500/swagger.json
#     -f openapi --hook=zap_hook.py
# The requests and responses should be written to a req-resp-log.txt file in the CWD/test-results directory.
# Note that not all hooks will be called in all scans.

import os
def zap_started(zap, target):
    basePath = os.getenv("BASE_FOLDER_PATH", "/zap/wrk")
    print("basePath:({})".format(basePath))
    filePath = "{}/{}".format(basePath, 'zap/httpHandler.js')
    print("fullFilePath:({})".format(filePath))
    zap.script.load('httpHandler.js', 'httpsender', 'Oracle Nashorn',  filePath)
    zap.script.enable('httpHandler.js')
    print("zap_started({}, {})".format(zap, target))

# def load_config(config, config_dict, config_msg, out_of_scope_dict):
# 	print("load_config({}, {}, {}, {})".format(config, config_dict, config_msg, out_of_scope_dict))




