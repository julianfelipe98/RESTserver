const jwt = require("jsonwebtoken");
const utilities = require("../utilities/utilities");
const adminRoleErr = "need the admin role for this process";
/* -------------------------------------------------------------------------- */
/*                               VALIDATE TOKEN                               */
/* -------------------------------------------------------------------------- */
let validateToken = (req, res, next) => {
  // el metodo get de un req nos permite tener acceso a los headers de la peticion
  let token = req.get("Authorization");
  jwt.verify(token, process.env.SEED, (err, decoded) => {
    if (err) return utilities.returnMessage(res, 401, false, err);
    req.user = decoded.user;
    next();
  });
};
/* -------------------------------------------------------------------------- */
/*                             VALIDATE ADMIN ROLE                            */
/* -------------------------------------------------------------------------- */
let validateUserRole = (req, res, next) => {
  let currentUserRole = req.user.role;
  if (currentUserRole !== "ADMIN_ROLE")
    return utilities.returnMessage(res, 401, false, adminRoleErr);
  next();
};
module.exports = {
  validateToken,
  validateUserRole,
};
