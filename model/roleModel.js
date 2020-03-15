
const mongoose = require("mongoose");
const schema={
    roleName:String,
    roleContent:String,
    limitIds:Array,
    createTime:{type:Date,default:Date.now}
}
const Schema=mongoose.Schema(schema);
const Model=mongoose.model('role',Schema);
module.exports=Model;
// "5e22efdbda00f2178c398663","5e22efedda00f2178c398664", "5e22f001da00f2178c398665","5e22f015da00f2178c398666"