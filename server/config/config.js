const mongoose = require("mongoose");
let urlDB;

/* -------------------------------------------------------------------------- */
/*                                    PORT                                    */
/* -------------------------------------------------------------------------- */

process.env.PORT = process.env.PORT || 5000;

/* -------------------------------------------------------------------------- */
/*                                 ENVIROMENT                                 */
/* -------------------------------------------------------------------------- */

process.env.NODE_ENV = process.env.NODE_ENV || "dev";

/* -------------------------------------------------------------------------- */
/*                                  AUTH SEED                                 */
/* -------------------------------------------------------------------------- */

process.env.SEED = process.env.SEED || "development-seed";

/* -------------------------------------------------------------------------- */
/*                              TOKEN EXPIRATION                              */
/* -------------------------------------------------------------------------- */

process.env.EXPIRATION_TOKEN = "30d";

/* -------------------------------------------------------------------------- */
/*                                  DATA BASE                                 */
/* -------------------------------------------------------------------------- */

/**
 * mongoose config
 * aunque la base de datos no exista mongoose crea la base de datos a la cual se establece la conexionla base de datos aparecera posteriormente a hacer
 * una insercion , si solo se levanta el servidor no necesariamente tiene que aparecer en el robo3t o la consola
 */
if (process.env.NODE_ENV === "dev") {
  urlDB = "mongodb://localhost:27017/coffee";
} else {
  urlDB = process.env.MONGO_URI;
}
mongoose.connect(
  urlDB,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  },
  (err, res) => {
    if (err) throw new err();
    console.log("Database up");
  }
);

/* -------------------------------------------------------------------------- */
/*                              GOOGLE CLIENT ID                              */
/* -------------------------------------------------------------------------- */
process.env.CLIENT_ID =
  process.env.CLIENT_ID ||
  "876986185994-no67q9a94uvtgb3fibdnf3bnks80i0o8.apps.googleusercontent.com";
