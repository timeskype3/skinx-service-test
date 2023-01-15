# Getting Started with SkinX service

## Steps to Setup

`prerequisite`
- docker installation

In the project directory, you need to run:

### 1.`docker-compose up` 
to start up MongoDB in docker or in case of first run, init Mongo script. 
It may take up to 10 - 15 minutes.

### 2.`npm install`
to install all node_modules as listed in packages.json

### 3.`npm run build`
to build project and complie in to Javascript type (*Important: imgration script need this step*)

### 4.`npm run imgrate:posts`
to imgrate posts and create all of users from PostedBy name with 1234 as all user's defaut password. So, you can use PostedBy with lowercase as a Username and 1234 for loging in. (eg. PostedBy: Cale, username: cale, password: 1234 ).
This step will take a couple minutes to process, wait until `Migrate: Success` appear in the command line.

### 5.`npm run start`
to start up the skinx-service then it will run on port 4001

#### `There are  8 routes`
For paths that required authentication need to be attached with `x-access-token`: token in headers every time requesting.

| path         | method | AUTH    | definition                       |
|--------------|--------|---------|----------------------------------|
| /test        |   GET  |    no   | test connection                  |
| /register    |  POST  |    no   | Create user accont               |
| /login       |  POST  |    no   | Login to get access token        |
| /profile     |   GET  | require | Get my profile                   |
| /posts       |   GET  | require | Get all posts                    |
| /posts       |  POST  | require | Create post                      |
| /posts/:id   |   GET  | require | Get post detail by Id            |
| /search/tags |   GET  | require | Get all posts with included tags |