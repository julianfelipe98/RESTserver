const express = require("express");
const utilities = require("../utilities/utilities");
let { validateToken } = require("../middlewares/authentication");
let app = express();
let Product = require("../models/product");
const _ = require("underscore");
const updateValidFields = ["name", "unitPrice", "description"];
const unexistentProduct = "The category doesnt exist in the system";
const Deletedstate = { state: false };

app.get("/products", validateToken, (req, res) => {
  Product.find({})
    .sort("name")
    .populate(["user", "category"])
    .exec((err, productsDB) => {
      if (err) return utilities.returnMessage(res, 500, false, err);
      Product.countDocuments({}, (err, count) => {
        if (err) return utilities.returnMessage(res, 500, false, err);
        utilities.returnMessage(res, 200, true, productsDB, count);
      });
    });
});
app.get("/products/:id", validateToken, (req, res) => {
  let productId = req.params.id;
  Product.findById(productId)
    .populate(["user", "category"])
    .exec((err, productDB) => {
      if (err) return utilities.returnMessage(res, 500, false, err);
      if (!productDB)
        return utilities.returnMessage(res, 400, false, unexistentProduct);
      utilities.returnMessage(res, 200, true, productDB);
    });
});

app.get("/products/search/:name", validateToken, (req, res) => {
  let productName = req.params.name;
//   insensible a las mayusculas y minusculas
  let regexName=new RegExp(productName,'i');
  Product.find({ name: regexName })
    .populate(["user", "category"])
    .exec((err, products) => {
      if (err) return utilities.returnMessage(res, 500, false, err);
      if (!products)
        return utilities.returnMessage(res, 400, false, unexistentProduct);
      utilities.returnMessage(res, 200, true, products);
    });
});

app.post("/products", validateToken, (req, res) => {
  let product = createProduct(req);
  product.save((err, productDB) => {
    if (err) return utilities.returnMessage(res, 400, false, err);
    utilities.returnMessage(res, 200, true, productDB);
  });
});
let createProduct = (jsonProduct) => {
  return new Product({
    name: jsonProduct.body.name,
    unitPrice: jsonProduct.body.unitPrice,
    description: jsonProduct.body.description,
    category: jsonProduct.body.category,
    user: jsonProduct.user,
  });
};
app.put("/products/:id", validateToken, (req, res) => {
  let productId = req.params.id;
  let updateProduct = _.pick(req.body, updateValidFields);
  Product.findByIdAndUpdate(
    productId,
    updateProduct,
    { new: true, runValidators: true, context: "query" },
    (err, productDB) => {
      if (err) return utilities.returnMessage(res, 500, false, err);
      if (!productDB)
        return utilities.returnMessage(res, 400, false, unexistentProduct);
      utilities.returnMessage(res, 200, true, productDB);
    }
  );
});
app.delete("/products/:id", validateToken, (req, res) => {
  let productId = req.params.id;
  Product.findByIdAndUpdate(
    productId,
    Deletedstate,
    { new: true, runValidators: true },
    (err, removedProduct) => {
      if (err) return utilities.returnMessage(res, 500, false, err);
      if (!removedProduct)
        return utilities.returnMessage(res, 400, false, unexistentProduct);
      utilities.returnMessage(res, 200, true, removedProduct);
    }
  );
});

module.exports = app;
