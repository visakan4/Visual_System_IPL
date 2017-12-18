# Installation

#### 1) Prerequisites
* Please make sure node.js is installed https://nodejs.org/en/download/ 
* Install yarn locally https://yarnpkg.com/lang/en/docs/install/


#### 2) Clone repository
* make sure git is installed
* clone the repo from here https://bitbucket.org/visakan4/vat_frontend using `git clone git@bitbucket.org:visakan4/vat_frontend.git`
 
#### 2) Install Project dependencies
* run the following command to download the packages `yarn install`
* run `yarn start` to run the frontend app server. (The local address would be localhost:3000/ )


#### 3) Connect with backend services
* To connect with the backend services, just change the `apiEndpoint` in `/src/config.js` to the address where backend server is running (usually it would be localhost:5000/ )
* To use the backend services deployed to heroku, change the apiEndpoint in `/src/config.js` to https://vat-backend.herokuapp.com


Note: All the packages in package.json are third party plugins used to support this project.