# Configuration

### Database

Servo expects there to be a MySQL server running on localhost:3306. You can configure the database connection in `src/main/resources/application.yml`

Install HeidiSQL: 

https://www.heidisql.com/download.php

And create a new database called "servo" running on port 3306 with the same root credentials specified in `application.yml` 

### Backend

To start the Spring Boot server, first install Maven (install JDK 8 instead of JDK 10):

https://www.mkyong.com/maven/how-to-install-maven-in-windows/

With maven now added to the system PATH, you can open a terminal and navigate to the project root and run:

`mvn spring-boot:run`

The server will now be running on port 8080.

### Front End

You can use the React client to interact with the server. To start it, first install Node:

https://www.guru99.com/download-install-node-js.html

Open a terminal and navigate to the `client` directory in the project folder. Run:

`npm install`

And then to start the server, run:

`npm run start`

This will open a browser window with the Servo home page.

![alt text](https://github.com/mxmstr/servo-backend/blob/master/screenshots/login.PNG){:height="10%" width="10%"}

# screenshots

# Diagrams, uml, wireframes
# User stories
