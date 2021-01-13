const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const utilities = require("../utilities/utilities");

const userError = "(User) or password are not correct";
const passwordError = "User or (password) are not correct";

app.post("/login", (req, res) => {
  let body = req.body;
  User.findOne({ email: body.email }, (err, userDB) => {
    if (err) return utilities.returnMessage(res, 400, false, err);
    // por seguridad cuando ya esta montada la app en produccion no se pone lo de los parentesis dado que por seguridad ,
    // si se dejara asi esto le daria pistas a alguien que estuviera tratando de robar las credenciales , por lo cual sin impotar cual sea el erro ,
    //  bien sea de usuario o contraseña se le indica al usuario que es alguno de estos dos y no el error especifico
    if (!userDB) return utilities.returnMessage(res, 400, false, userError);
    let passwordMatch = bcrypt.compareSync(body.password, userDB.password);
    if (!passwordMatch) return utilities.returnMessage(res, 400, false, passwordError);
    let token = createToken(userDB);
    // despues de enviarlo la parte del front deberia guardar el token en local storage
    utilities.returnMessage(res, 200, true, userDB, null,token);
  });
});
const createToken = (userDB) => {
  return jwt.sign(
    {
      user: userDB,
    },
    process.env.SEED,
    { expiresIn: process.env.EXPIRATION_TOKEN }
  );
};
module.exports = app;
