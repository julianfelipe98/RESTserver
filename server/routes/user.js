//routes
const express = require("express");
const app = express();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const _ = require("underscore");
const { findByIdAndUpdate } = require("../models/user");

app.get("/", (req, res) => {
  res.send("hello world");
});
app.get("/users", (req, res) => {
  // el metodo find me permite traer todos los registros de la coleccion definida
  let since = req.query.since || 0;
  let limit = req.query.limit || 0;
  // si se le envia otro argumento al metodo find podriamos filtrar la busqueda por los atributos que nostros quisieramos que se listaran a la hora de hacer la peticion
  User.find({state:true}, "name email state")
    .skip(Number(since))
    .limit(Number(limit))
    .exec((err, users) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }
      User.countDocuments({state:true}, (err, count) => {
        res.json({
          ok: true,
          users,
          count,
        });
      });
    });
});
app.post("/users", (req, res) => {
  let body = req.body;
  let user = new User({
    name: body.name,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    role: body.role,
  });
  user.save((err, userDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }
    res.json({
      ok: true,
      user: userDB,
    });
  });
});
app.put("/users", (req, res) => {
  res.send("put users");
});
app.put("/users/:id", (req, res) => {
  let id = req.params.id;
  // lo que nos permite hacer el pick de la libreria underscore es que nos retorna una copia del objeto con los atributos que yo le mande como parametro dentro del arreglo
  let body = _.pick(req.body, ["name", "email", "role", "img", "state"]);
  // con el findByIdAndUpdate podemos de hacerlo de una manera mas facil pero tambien perdemos poder de manejo de errores como si el id no existiera ,
  // por esto si lo utilizamos de esta forma tendriamos que mejorar la parte de la validacion en el front
  // hay que tener en cuenta que si se deja solo los parametros de id body y el cb , retornara como respuesta al put el registro antiguo en la base de datos
  // , para ello en la documentacion de mongoose se recibe otro parametro que son las opciones y aqui se le pasa la opcion new
  // para esta parte hay que tener cuidado dado que si conocen el esquema de la base de datos y en la parte del server se maneja como se esta manejando hasta
  //  el momento se podria modificar atributos que no quisieramos , como ejemplo seria si enviaramos en postman el put con el valor del atributo de google
  //  (no se deberia cambiar por parte del usuario) aquie nos modificaria este valor
  // otro ejemplo seria en el cambio de roles , un usuario no deberia poder cambiar los roles del mismo
  // tambien hay que tener en cuenta que para la parte del update si se hace de esta manera no valida , para el caso , el enumerado que habiamos creado anteriormente, por lo cual se podria modificar y no deberia ser asi
  // para esto en la documentacion de mongoose se nos da en las opciones el parametro de run validators
  User.findByIdAndUpdate(
    id,
    body,
    { new: true, runValidators: true },
    (err, userDB) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }
      res.json({
        ok: true,
        user: userDB,
      });
    }
  );
});
// hay que tener en cuenta que en produccion por lo general no se borran los elementos completamente de la db sino que como el mismo ejemplo lo aplica se le cambia el atributo que
//  se tiene definido(para el caso state), que es un booleano de true a false, por lo cual sencillamente el ejemplo con findbyidandremove es solo para ver como funciona el metodo y como se maneja
app.delete("/users/:id", (req, res) => {
  id = req.params.id;
  // User.findByIdAndRemove(id, (err, userDeleted) => {
  //   if (err || !userDeleted) {
  //     if (!err) err = "usuario no encontrado";
  //     return res.status(400).json({
  //       ok: false,
  //       err,
  //     });
  //   }
  //   res.json({
  //     ok: true,
  //     user: userDeleted,
  //   });
  // });
  const state = { state: false };
  User.findByIdAndUpdate(
    id,
    state,
    { new: true, runValidators: true },
    (err, userDB) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }
      res.json({
        ok: true,
        user: userDB,
      });
    }
  );
});

module.exports = {
  app,
};
