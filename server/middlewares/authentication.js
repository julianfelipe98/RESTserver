const jwt = require("jsonwebtoken");
const utilities = require("../utilities/utilities");
/* -------------------------------------------------------------------------- */
/*                               VALIDATE TOKEN                               */
/* -------------------------------------------------------------------------- */
let validateToken = (req, res, next) => {
  // el metodo get de un req nos permite tener acceso a los headers de la peticion
  let token = req.get("Authorization");
  jwt.verify(token, process.env.SEED, (err, decoded) => {
    if (err) return utilities.returnMessage(res, 401, false, err);
    req.user=decoded.user;
    next();
  });
};

module.exports = {
  validateToken,
};
