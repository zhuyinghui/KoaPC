//用户表
const mongoose = require("mongoose");
const schema={
    roleId:{type:String,ref:'role'},
    shopAccount:String,
    shopPassword:String,
    shopStatus:Boolean,
    shopName:String,
    shopPicture:String,
    shopImages:Array,
    shopAddress:String,
    addressCode:Array,
    addressPositon:Array,
    shopPhone:String,
    shopLicense:String,
    shopScale:Number
}
const Schema=mongoose.Schema(schema);
const Model=mongoose.model('shop',Schema);
module.exports=Model;