## About 
On this example we are creating a **REST server** using **nodejs** and **express** ,with this example we will be able to create, read , update and delete users from nosql data base , also , we have two ways for the user login , the first one is registering in the platform using the register formulary with the user data and password,for hasing the user password we use **bycript** , and for the session management we are using **JWT** (with no libraries like passport just jsonwebtoken librar ), the second way is using **google OAuth**, with this we dont need to be resgistered in the platform just need to have a google account .
We are saving the user data in **mongo DB atlas** , using **mongoose** as the ORM for data base management , this database has a simple scheme , the only collection used at the moment is the user collection , this one has the next ***properties*** 


> - id : genreted by mongo atlas by default .
> - role: the user role in the system .
>- state: define if the user is active or not in the system .
> - google :define if the user has the google sign in .
> - name: user name .
> - email : user email .
> - password : user password hashed .


This rest server example is implemented with **two enviroments** , the first one is the production enviroment deployed on **Heroku**, with some enviroment variables already configured with the heroku CLI , but if you want to use it in a local way , the proyect is also configured with **local enviroment** on **port 5000** . 

---

## Getting started 
### Local enviroment
* Clone the repo https://github.com/julianfelipe98/RESTserver
* In the proyect directory : `npm install`
* In the proyect directory : `npm run`
### Production enviroment
* www.herokudeploy.com

---
##Request Docs
[DOCS](https://documenter.getpostman.com/view/14133981/TVzViw4f)

---

##More about technologies and libraries on this proyect
> - [NodeJS](https://nodejs.org)
> - [Express](https://expressjs.com)
> - [MongoDB](https://www.mongodb.com)
> - [Mongoose](https://mongoosejs.com/)
> - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
> - [Bycript](https://www.npmjs.com/package/bcrypt)
> - [JWT](https://jwt.io)
> - [Google OAuth](https://developers.google.com/identity/sign-in/web/sign-in)
> - [Heroku](https://heroku.com)
> - [Underscore](https://underscorejs.org/)
> - [Mongoose Unique Validator](https://www.npmjs.com/package/mongoose-unique-validator)

