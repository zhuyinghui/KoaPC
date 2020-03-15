//会员表
const mongoose = require("mongoose");
const schema={
    shopId:{type:String,ref:'shop'},
    memberId:{type:String,ref:'member'},
    projectId:Object,
    staffId:{type:String,ref:'staff'},
    bookingTime:Date,
    bookingType:{type:Number,min:1,max:2},
    bookingMoney:Number,
    messageHint:Boolean,
    bookingStatus:{type:Number,default:1},
    refundReason:String,
    createTime:{type:Date,default:Date.now}
}
const Schema=mongoose.Schema(schema);
const Model=mongoose.model('booking',Schema);
module.exports=Model;