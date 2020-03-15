//会员表
const mongoose = require("mongoose");
const schema={
    roleId:{type:String,ref:'role'},
    memberName:String,
    memberSex:Number,
    memberAccount:String,
    memberPassword:String,
    createTime:{type:Date,default:Date.now}
}
const Schema=mongoose.Schema(schema);
const Model=mongoose.model('member',Schema);
module.exports=Model;