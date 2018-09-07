# Project Description

Analyzing the player skills and identifying the right players for the team is crucial for all sports. It becomes even more important when there are lot of players competing for a single spot. In order to ease the scouting process, we have created a visualization system with help from machine learning algorithms for the [IPL](https://en.wikipedia.org/wiki/Indian_Premier_League) data. Coaches/Managers can make use of the various visualizations to find the right players for their team. 

Coaches/Managers can make use of this system to analyze the statistics about the players and compare how they fare against other players. They can also make use of this system to analyze how their team has performed over the years and find the areas to be strengthened. The visualization systesm is built following the UI design principles. The system also allows the user to apply various customizations to their 
results. 

# Technologies

**Languages:** Python, JavaScript, HTML, CSS

**Libraries:** ReactJS, pandas, SciKit Learn, NumPy, Flask, d3.js, Bootstrap

**Tools:** Heroku, Git, PyCharm, Sublime Text

# Dataset

Kaggle Link: https://www.kaggle.com/harsha547/indian-premier-league-csv-dataset/data

# Architecture

![alt text](https://github.com/visakan4/Visual_System_IPL_ML/blob/master/images/architecture.PNG "Architecture")

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

*Note: All the packages in package.json are third party plugins used to support this project.*

# Screenshots

### Streamgraph

![alt text](https://github.com/visakan4/Visual_System_IPL_ML/blob/master/images/StreamGraph.png "Stream Graph")

### TreeMap

![alt text](https://github.com/visakan4/Visual_System_IPL_ML/blob/master/images/TreeMap.png "Tree Map")

### Line Graph

![alt text](https://github.com/visakan4/Visual_System_IPL_ML/blob/master/images/LineGraph.jpg "Line Graph")

### Stacked Bar Graph

![alt text](https://github.com/visakan4/Visual_System_IPL_ML/blob/master/images/StackedBarGraph.png "Stacked Bar Graph")

![alt text](https://github.com/visakan4/Visual_System_IPL_ML/blob/master/images/StackedBarGraph2.png "Stacked Bar Graph")

### Clustering

![alt text](https://github.com/visakan4/Visual_System_IPL_ML/blob/master/images/clustering.PNG "Clustering")

### Forced Layout

![alt text](https://github.com/visakan4/Visual_System_IPL_ML/blob/master/images/ForcedLayout.jpg "Forced Layout")
