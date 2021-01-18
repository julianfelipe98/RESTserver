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
const unexistentCategory = "The category doesnt exist in the system";

app.get("/categories", validateToken, (req, res) => {
  Category.find({}, "description user").exec((err, categories) => {
    if (err) return utilities.returnMessage(res, 500, false, err);
    Category.countDocuments({}, (err, count) => {
      if (err) return utilities.returnMessage(res, 500, false, err);
      utilities.returnMessage(res, 200, true, categories, count);
    });
  });
});

app.post("/categories", validateToken, (req, res) => {
  let category = createCategory(req.body);
  category.save((err, categoryDB) => {
    if (err) return utilities.returnMessage(res, 500, false, err);
    utilities.returnMessage(res, 200, true, categoryDB);
  });
});

let createCategory = (jsonCategory) => {
  return new Category({
    description: jsonCategory.description,
    user: jsonCategory.user,
  });
};

app.get("/categories/:id", validateToken, (req, res) => {
  let categoryId = req.params.id;
  Category.findById(categoryId, (err, categoryDB) => {
    if (err) return utilities.returnMessage(res, 400, false, err);
    if (!categoryDB)
      return utilities.returnMessage(res, 400, false, unexistentCategory);
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
        return utilities.returnMessage(res, 400, false, unexistentCategory);
      utilities.returnMessage(res, 200, true, categoryDB);
    }
  );
});

app.delete("/categories/:id", [validateToken, validateUserRole], (req, res) => {
  let categoryId = req.params.id;
  Category.findByIdAndRemove(categoryId, (err, categoryDB) => {
    if (err) return utilities.returnMessage(res, 400, false, err);
    if (!categoryDB)
      return utilities.returnMessage(res, 400, false, unexistentCategory);
    utilities.returnMessage(res, 200, true, categoryDB);
  });
});

module.exports = app;
