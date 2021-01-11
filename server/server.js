const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const router = require("./routes/user");
//config
require("./config/config");

//middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(router.app);

app.listen(process.env.PORT, () => {
  console.log(`server running on port ${process.env.PORT}`);
});
