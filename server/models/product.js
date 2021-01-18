const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");

let productSchema = new Schema({
  name: { type: String, required: [true, "The name is required"] },
  unitPrice: { type: Number, required: [true, "The unit price is required"] },
  description: { type: String, required: false },
  state: { type: Boolean, required: true, default: true },
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  user: { type: Schema.Types.ObjectId, ref: "User" },
});

productSchema.plugin(uniqueValidator, {
    message: "{PATH} must be unique",
  });

module.exports = mongoose.model("Product", productSchema);
