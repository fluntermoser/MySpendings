# MySpendings
The whole project is split in to seperate applications 
because we want to be able to use the same server and database for multiple clients
(e.g. WebApplication and Android App use the same server to comunicate with)

# Requirements
For this application to run you must have mysql and node.js installed on your machine

# Setup
Server:
- start MySql Server (install if you haven't already)
- create Databse using the SQL Code from /server/defaultschema.sql
- create SQL User with permissions for the newly created database and enter credentials in /server/config.json file
- (optional) change server port in /server/config.json
- enter a secret Key in /server/config.json file
- open command prompt go to /server/ folder and run "npm install"
- start server using "node /server/app.js"

Client:
- (optional) configure server location in /client/src/assets/config/config.json
- open command prompt go to /client/ folder and run "npm install"
- start client using "ng serve --open"

(starting server and client on one machine requires using two terminals)