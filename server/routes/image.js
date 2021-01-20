const express = require("express");
const app = express();
const path = require("path");
const User = require("../models/user");
const Product = require("../models/product");
const defaultProductImg = path.join(__dirname, "../assets/default-product.svg");
const defaultUserImg = path.join(__dirname, "../assets/default-user.svg");
const defaultImg = path.join(__dirname, "../assets/default.jpg");
const utilities = require("../utilities/utilities");

app.get("/images/:type/:id", async (req, res) => {
  //recibe el id , busca en la base de dato y devuelve la imagen del product o del usuario corresponiente
  let type = req.params.type;
  let id = req.params.id;
  let img;
  switch (type) {
    case "users":
      img = findImg(User, id, res);
      if (!img) img = defaultUserImg;
      break;
    case "products":
      img = findImg(Product, id, res);
      console.log(img);
      if (!img) img = defaultProductImg;
      break;
    default:
      img = defaultImg;
      break;
  }
  res.sendFile(img);
});
let findImg = (Schema, id, res) => {
  Schema.findById(id, (err, schemaDB) => {
    if (!schemaDB) return undefined;
    if (err) return utilities.returnMessage(res, 400, false, err);
    return schemaDB.img;
  });
};

module.exports = app;
