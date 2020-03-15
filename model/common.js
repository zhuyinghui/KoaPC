const mongoose = require("mongoose")
class Common{
    constructor(){}
    //连接数据库
    connect(){
        mongoose.connect("mongodb://127.0.0.1:27017/Cosmetology",{ useNewUrlParser: true,useUnifiedTopology: true })
            .then(
                ()=>{
                    console.log('数据库连接成功')
                },
                err=>{
                    console.log('数据库连接失败',err)
                }
            )
    }
    //封装新增数据的接口
    async add(ctx,ModelName){
        const doc=new ModelName(ctx.request.body)
        let result
        await doc.save()
        .then(data=>{
           result={
               code:0,
               msg:'新增成功',
               data:data
           }
        })
        ctx.body=result
    }
    //封装查看详情的接口
    async detail(ctx,ModelName,...popArray){
        const _id=ctx.request.query._id
        let result
        await ModelName.find({_id:_id})
        .populate(popArray[0])
        .populate(popArray[1])
        .populate(popArray[2])
        .populate(popArray[3])
        .then(data=>{
            result={
                code:0,
                msg:'查看详情',
                data:data
            }
        })
        ctx.body=result
    }
    //封装查询数据的接口，接口参数只有page和limit
    async check(ctx,ModelName){
        //分页参数
        const query=ctx.request.query
        const skipNum=(query.page-1)*query.limit*1
        const limitNum=query.limit*1
        let result
        delete query['limit']
        delete query['page']
        //查询条件总数
        let num=0;
        await ModelName.find(query).countDocuments().then(data=>{
            num=data;
        })
        await ModelName.find(query).skip(skipNum).limit(limitNum)
        .then(data=>{
            result={
                code:0,
                count:num,
                msg:'分页条件查询',
                data:data
            }
        })
        ctx.body=result
    }
    //封装删除的接口，参数是_id，多个以逗号相隔
    async del(ctx,ModelName){
        const idArray=ctx.request.query._id.split(',')
        let result
        await ModelName.remove({_id:{$in:idArray}})
        .then(data=>{
            result={
                code:0,
                msg:'删除成功',
                data:data
            }
        })
        ctx.body=result
    }
    //封装修改的接口，参数是_id和其它参数
    async change(ctx,ModelName){
        const body=ctx.request.body
        let result
        await ModelName.update({_id:body._id},body)
        .then(data=>{
            result={
                code:0,
                msg:'修改成功',
                data:data
            }
        })
        ctx.body=result
    }
    /*
    //封装查看详情的接口
    门店详情
    //其它接口
    登陆shops/login
    修改密码shops/password
    充值members/investments
    新增预约
    修改预约
    重点：如何发通知？
    */

}

module.exports = new Common();