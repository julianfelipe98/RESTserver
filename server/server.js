const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const router = require("./routes/router");
const path =require("path");






//config
require("./config/config");

/* -------------------------------------------------------------------------- */
/*                                 MIDDLEWARE                                 */
/* -------------------------------------------------------------------------- */

//parse applicarion/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
//global routes
app.use(router);

/* -------------------------------------------------------------------------- */
/*                                  SETTINGS                                  */
/* -------------------------------------------------------------------------- */
app.use(express.static(path.join(__dirname, "../public")));
/* -------------------------------------------------------------------------- */
/*                                   LISTEN                                   */
/* -------------------------------------------------------------------------- */
app.listen(process.env.PORT, () => {
  console.log(`server running on port ${process.env.PORT}`);
});
