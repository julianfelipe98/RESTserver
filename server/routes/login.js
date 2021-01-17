const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const utilities = require("../utilities/utilities");

const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.CLIENT_ID);
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
    if (!passwordMatch)
      return utilities.returnMessage(res, 400, false, passwordError);
    let token = createToken(userDB);
    // despues de enviarlo la parte del front deberia guardar el token en local storage
    utilities.returnMessage(res, 200, true, userDB, null, token);
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

/* -------------------------------------------------------------------------- */
/*                            GOOGLE SIGN IN CONFIG                           */
/* -------------------------------------------------------------------------- */
/**
 * google method for verify token and return the user logged in with google data
 * @date 2021-01-17
 * @param {String} token
 * @returns {JSON}
 */
async function verify(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  return {
    name: payload.name,
    email: payload.email,
    img: payload.picture,
    google: true,
  };
}
app.post("/google", async (req, res) => {
  let token = req.body.idtoken;
  let googleUser = await verify(token).catch((err) => {
    return utilities.returnMessage(res, 403, false, err);
  });
  // user email data base validation
  User.findOne({ email: googleUser.email }, (err, userDB) => {
    //error validation
    if (err) return utilities.returnMessage(res, 500, false, err);
    if (userDB) {
      if (userDB.google === false) {
        // if user already has authenticate in a normal way with the same email is not able to do it with google
        const AlreadyAuthErr = "Must to authenticate in a normal way";
        return utilities.returnMessage(res, 400, false, AlreadyAuthErr);
      } else {
        //if the user has alredy used that email for authentication so  we just have to renovate the token
        let token = createToken(userDB);
        utilities.returnMessage(res, 200, true, userDB, null, token);
      }
    } else {
      // if is the first time that the user authenticate to the platform with that email , we create the user on our db ,and genrete the token
      let user = new User();
      user.name = googleUser.name;
      user.email = googleUser.email;
      user.img = googleUser.img;
      user.google = true;
      user.password = ":)";
      user.save((err, userDB) => {
        if (err) return utilities.returnMessage(res, 500, false, err);
        let token = createToken(userDB);
        utilities.returnMessage(res, 200, true, userDB, null, token);
      });
    }
  });
});

module.exports = app;
