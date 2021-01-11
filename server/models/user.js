const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
let Schema = mongoose.Schema;

/* -------------------------------------------------------------------------- */
/*                                 VALID ROLES                                */
/* -------------------------------------------------------------------------- */

let validRoles={
  values:['ADMIN_ROLE','USER_ROLE'],
  message:'{VALUE} No es un rol valido'
};

/* -------------------------------------------------------------------------- */
/*                                SCHEMA CONFIG                               */
/* -------------------------------------------------------------------------- */

let userSchema = new Schema({
  name: {
    type: String,
    required: [true, "The name is required"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "The email is required"],
  },
  password: {
    type: String,
    required: [true, "The password is required"],
  },
  img: {
    type: String,
    required: [false, "The img is not required"],
  },
  role: {
    type: String,
    default: "USER_ROLE",
    enum:validRoles
  },
  state: {
    type: Boolean,
    default: true,
  },
  google: {
    type: Boolean,
    default: false,
  },
});
/**
 * el mongoose-validator nos permite validar y manejar de mejor manera los errores , para el caso manejamos el error de unicidad por medio del siguiente mensaje
 */

 /**
  * override the json user for not returning the password when the method is called
  * @date 2021-01-11
  * @returns {object}
  */
 userSchema.methods.toJSON=function(){
   let user=this;
   let userObject=user.toObject();
   delete userObject.password;
   return userObject;
 }

/**
 * method for validate unique exception in a better way implementing the unique validator
 * @date 2021-01-11
 * @param {enum} uniqueValidator
 * @param {String} {message:"{PATH}mustbeunique"
 * @returns {void}
 */
userSchema.plugin(uniqueValidator, {
  message: "{PATH} must be unique",
});

module.exports = mongoose.model("User", userSchema);
