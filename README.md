STEP #1
Create .env file in back-end directory

APP_SERVER=`server domain`
APP_DATABASE=`databse name`
APP_LOGIN=`databse login`
APP_PASSWORD=`database password`

APP_ACCESS_TOKEN = `unique string of characters, longer = better`

APP_REFRESH_TOKEN = `unique string of characters, longer = better`

STEP #2
npm install

Step #3
run container with DB
docker-compose up -d
Import DB (this_vote.sql) via phpmyadmin (localhost:8082)
 
Step #4

chose backend directory
cd back-end

// to start with nodemon automatically will start with .env

npm run start
or
// to start just node server with .env file
npm run start:dev

setp #4

chose fontend dierctory

cd front-end

npm start
