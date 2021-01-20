const express = require("express");
const utilities = require("../utilities/utilities");
let {
  validateToken,
  validateUserRole,
} = require("../middlewares/authentication");
let app = express();
let Category = require("../models/category");
const _ = require("underscore");
const updateValidFields = ["description"];
const errors = require("../utilities/errors");

app.get("/categories", validateToken, (req, res) => {
  Category.find({}, "description user")
    .sort("description")
    //poputlate nos permite popular la consulta , con esto , si tenemos relacion con  otra tabla nos permitira traer datos de esa tabla que nosotros queramos en la consulta
    .populate("user", "name email")
    .exec((err, categories) => {
      if (err) return utilities.returnMessage(res, 500, false, err);
      Category.countDocuments({}, (err, count) => {
        if (err) return utilities.returnMessage(res, 500, false, err);
        utilities.returnMessage(res, 200, true, categories, count);
      });
    });
});

app.post("/categories", validateToken, (req, res) => {
  let category = createCategory(req);
  category.save((err, categoryDB) => {
    if (err) return utilities.returnMessage(res, 500, false, err);
    utilities.returnMessage(res, 200, true, categoryDB);
  });
});

let createCategory = (jsonCategory) => {
  return new Category({
    description: jsonCategory.body.description,
    user: jsonCategory.user,
  });
};

app.get("/categories/:id", validateToken, (req, res) => {
  let categoryId = req.params.id;
  Category.findById(categoryId, (err, categoryDB) => {
    if (err) return utilities.returnMessage(res, 400, false, err);
    if (!categoryDB)
      return utilities.returnMessage(res, 400, false, errors.noObjFindOnDB);
    return utilities.returnMessage(res, 200, true, categoryDB);
  });
});

app.put("/categories/:id", validateToken, (req, res) => {
  let categoryId = req.params.id;
  let updatedCategory = _.pick(req.body, updateValidFields);
  Category.findByIdAndUpdate(
    categoryId,
    updatedCategory,
    { new: true, runValidators: true, context: "query" },
    (err, categoryDB) => {
      if (err) return utilities.returnMessage(res, 500, false, err);
      if (!categoryDB)
        return utilities.returnMessage(res, 400, false, errors.noObjFindOnDB);
      utilities.returnMessage(res, 200, true, categoryDB);
    }
  );
});

app.delete("/categories/:id", [validateToken, validateUserRole], (req, res) => {
  let categoryId = req.params.id;
  Category.findByIdAndRemove(categoryId, (err, categoryDB) => {
    if (err) return utilities.returnMessage(res, 400, false, err);
    if (!categoryDB)
      return utilities.returnMessage(res, 400, false, errors.noObjFindOnDB);
    utilities.returnMessage(res, 200, true, categoryDB);
  });
});

module.exports = app;
