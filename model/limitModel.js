//权限表
const mongoose = require("mongoose");
const schema={
    limitName:String,
    limitContent:String,
    limitType:{type:Number,min:1,max:3},
    limitSystem:{type:Number,min:1,max:2},
    createTime:{type:Date,default:Date.now}
}
const Schema=mongoose.Schema(schema);
const Model=mongoose.model('limit',Schema);
module.exports=Model;