const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");

let categorySchema=new Schema({
    description:{type:String ,unique:true,required:[true,"The description is required"]},
    user:{type:Schema.Types.ObjectID, ref:"User"}
})
// let categorySchema = new Schema({
//     descripcion:{type:String,unique:true,required:[true,'The description is required']},
//     user: { type: Schema.Types.ObjectId, ref: 'User' }
// });
categorySchema.plugin(uniqueValidator, {
    message: "{PATH} must be unique",
  });
module.exports=mongoose.model('Category',categorySchema);