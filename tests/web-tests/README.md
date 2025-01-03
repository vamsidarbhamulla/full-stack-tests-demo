# web-automation-tests

##### Table of Contents  
[1. testing-stack](#testing-stack)  
[2. test-repo-dependencies](#repo-deps)  
[3. test-run-setup](#test-run)  

<a name="testing-stack"></a>  

## 1. Testing stack

- **playwright** - nodejs runner based ui test automation framework,      
- **typescript** - test script creation  
- **eslint + prettier** - linting 

<a name="repo-deps"></a>

## 2. Test repo dependencies  
> **Note**   
> Need to run this step to install steps once for every new repo level dependencies added/updated   
```shell
npm install 
npm run install:browsers
```

<a name="test-run"></a>   

## 3. Test run setup   
> **Warning**  
> Need to create a local file named **.local.env**  for config values under env folder
```shell
npm run test:chromium
npm run report

# command to run tests against different browser
npm run test:webkit 
npm run report 

npm run test:firefox
```
 
