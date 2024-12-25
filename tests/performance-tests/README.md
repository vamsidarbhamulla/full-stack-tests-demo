# performance automation tests

##### Table of Contents  
[1. testing-stack](#testing-stack)  
[2. test-repo-dependencies](#repo-deps)  
[3. test-run-setup](#test-run)  

<a name="testing-stack"></a>  

## 1. Testing stack

- **k6** - load + report generation using GoLang goroutine  
- **xk6** - k6 extension system to enhance the k6 core features with required functionality 
- **xk6-dashboard** - load test live monitoring  
- **javascript** - test script creation  
- **docker** - containerization setup for ci flow
- **colima oci + docker-compose** - containerization run for local ci

> **Warning**  
> - Currently os dependencies script will work on mac os & linux os & windows os (wsl)  
> - For pure windows os setup please install the below list of softwares manually
- node  
- npm  
- golang  
- k6  
- xk6    
- chromium 
- python3
- docker 
- colima oci

> **Note**  
> - docker and colima oci are optional replacement stack to avoid all the other dependencies installation in local machine


<a name="repo-deps"></a>

## 2. Test repo dependencies  
> **Note**   
> Need to run this step to install steps once for every new repo level dependencies added/updated   
```shell
npm install
npm run build-xk6
```
> **Note**  
> - ```build-xk6``` command will create a binary under ```bin/k6``` path to use for load test run with k6 plugin extensions 
> - For Windows git bash require npm config setup is required to point to bash shell to run the shell commands. Need to run the below commands to setup the config. 
```shell
npm config ls -l | grep shell
npm config set script-shell "C:\\Program Files\\git\\bin\\bash.exe"
npm config ls -l | grep shell
```
The below result should be shown in windows git bash after the above config setup: 
```shell
script-shell = null ; overridden by user
shell = "C:\\WINDOWS\\system32\\cmd.exe"
script-shell = "C:\\Program Files\\git\\bin\\bash.exe"
```


<a name="test-run"></a>   

## 3.1 Test run setup   
> **Warning**  
> Need to create a local file named **.local.env**  for config values under env folder
```shell
npm run test --file=user_login_test
TEST_ENV=local npm run src/tests/user_login_test # pass in TEST_ENV environment variable
```


### 3.2 Docker Test run 
> **Note**  
> Commands to run docker based tests 
```shell
# docker stop $(docker -aq) && docker rm $(docker -aq)
TEST_ENV=local TEST_NAME=user_registration_test docker-compose up --build  --force-recreate  --abort-on-container-exit
```

> **Note**  
> Command to run tests using docker-compose 
```shell
./run_tests_from_docker.sh
```
 
