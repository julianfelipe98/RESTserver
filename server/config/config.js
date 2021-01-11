const mongoose = require("mongoose");
let urlDB;
/**
 * PORT
 */
process.env.PORT = process.env.PORT || 5000;

//entorno
process.env.NODE_ENV = process.env.NODE_ENV || "dev";

//base de datos
/**
 * mongoose config
 */
// aunque la base de datos no exista mongoose crea la base de datos a la cual se establece la conexion
// la base de datos aparecera posteriormente a hacer una insercion , si solo se levanta el servidor no necesariamente tiene que aparecer en el robo3t o la consola
/**
 * conexion de mongo atlas
 * user:julianfelipe98
 * password correo personal:DMjxXvzaoUeAHrbU
 * password institucional:ZTft6XfsoCidSPzq
 * conexion personal:mongodb+srv://julianfelipe98:DMjxXvzaoUeAHrbU@cluster0.qkhzn.mongodb.net/coffee
 * conexion institucional:mongodb+srv://julianfelipe98:ZTft6XfsoCidSPzq@cluster0.mbkyt.mongodb.net/coffee
 */
if (process.env.NODE_ENV === "dev") {
  urlDB = "mongodb://localhost:27017/coffee";
} else {
  urlDB =
    "mongodb+srv://julianfelipe98:DMjxXvzaoUeAHrbU@cluster0.qkhzn.mongodb.net/coffee";
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
