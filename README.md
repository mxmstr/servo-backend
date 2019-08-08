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

### Frontend

You can use the React client to interact with the server. To start it, first install Node:

https://www.guru99.com/download-install-node-js.html

Open a terminal and navigate to the `client` directory in the project folder. Run:

`npm install`

And then to start the server, run:

`npm run start`

This will open a browser window with the Servo home page.

### Mobile

You can find the Android customer app here: https://github.com/mxmstr/servo-android

# About

Servo is a prototype for restaurant management software. It is designed to streamline the customer experience by handling reservations, ordering, and payment through a mobile app. On the business side, restaurant staff and managers can use a web portal to view orders and change menu items.

One of the biggest challenges was implementing oAuth2 security and connecting it with my backend logic. Okta in particular doesn't have the most comprehensive tutorials, leaving me to fill in the gaps. For example, some features that were present in the Okta React module wouldn't be present in Okta Java SDK, or vice versa. This required some extensive rewiring of the security pipeline to get Android, React, and Spring to communicate properly. As a result, I decided to use the Okta-generated user ID as the universal personal identifier across the full stack. This allowed all personal user information to be kept separate from the app-specific user data.

Scalability was also an issue when it came to the front end. There was a wide range of data which needed to be editable for business users, and only so much time to customize views for each table. I took advantage of React's component-based architecture to create a modular ItemList element which could be reused for almost all of the views and could be configured to edit a table in a variety of ways. This made it much easier to limit what data could be visible and editable to users.

# Wireframes and User Stories

https://docs.google.com/presentation/d/1KBoNeWJiPTsLH2tVn1RpcKJelRB2MnoCL5Gw5ZLMCSk/edit?usp=sharing

# Screenshots

![alt text](https://github.com/mxmstr/servo-backend/blob/master/screenshots/login.PNG)
![alt text](https://github.com/mxmstr/servo-backend/blob/master/screenshots/register.PNG)
![alt text](https://github.com/mxmstr/servo-backend/blob/master/screenshots/menu.PNG)
![alt text](https://github.com/mxmstr/servo-backend/blob/master/screenshots/tables.PNG)
![alt text](https://github.com/mxmstr/servo-backend/blob/master/screenshots/tickets.PNG)

