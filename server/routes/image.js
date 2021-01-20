const express = require("express");
const app = express();
const path = require("path");
const User = require("../models/user");
const Product = require("../models/product");
const defaultProductImg = "https://res.cloudinary.com/uptc-restserver-jc/image/upload/v1611172334/default-product_s7qk3l.svg";
const defaultUserImg = "https://res.cloudinary.com/uptc-restserver-jc/image/upload/v1611172320/default-user_bhcaxb.svg";
const utilities = require("../utilities/utilities");

app.get("/images/:type/:id", async (req, res) => {
  //recibe el id , busca en la base de dato y devuelve la imagen del product o del usuario corresponiente
  let type = req.params.type;
  let id = req.params.id;
  let img;
  switch (type) {
    case "users":
      img=await findImg(User,id,res)
      img=(!img) ? defaultUserImg : img;
      break;
    case "products":
      img = await findImg(Product, id, res);
      img=(!img) ? defaultProductImg : img;
      break;
    default:
      img = defaultProductImg;
      break;
  }
  utilities.returnMessage(res,200,true,img)
});
let findImg = (Schema, id, res) => {
  return new Promise((resolve, reject) => {
    Schema.findById(id, (err, schemaDB) => {
      if (!schemaDB) return resolve(undefined);
      if (err) return reject(utilities.returnMessage(res, 400, false, err));
      resolve(schemaDB.img);
    });
  });
};

module.exports = app;
