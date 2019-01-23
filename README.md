# MySpendings
The whole project is split in to seperate applications 
because we want to be able to do the same things for mutliple clients
(e.g. WebApplication and Android App use the same server to comunicate with)

#Setup
- start MySql Server
- create Databse using the SQL Code from /server/defaultschema.sql
- create SQL User for the newly created database and enter credentials in /server/config.json file
- enter a secret Key in /server/config.json file
- enter server location in /client/config.json (for now the default value should work)
- open command prompt go to /client/ folder and run "npm install"
- open command prompt go to /server/ folder and run "npm install"
- start server using "node /server/app.js"
- start client using "ng serve --open"