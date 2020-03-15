const router = require('koa-router')()
router.prefix('/bookings')
const bookingModel=require('../model/bookingModel')
const common=require('../model/common.js')

//获取预约
router.get('/',async ctx=>{
    await common.check(ctx,bookingModel)
})

//新增预约
router.post('/', async ctx=> {
    // await common.add(ctx,bookingModel)
    /*
    1 获取预约的时间，和预约的项目编号
    2 根据项目编号查询出项目的时长
    3 计算出预约的结束时间=预约的时间+项目的时长
    4 获取员工编号，查询出员工的未完成预约订单
    5 拿出员工每一个订单的预约开始和结束时间
    6 判断是否有预约冲突
    */
   const body=ctx.request.body
   //查询项目时长
   const projectDuration=1800000
//    await projectModel.find({_id:body.projectId}).then(data=>{
//     projectDuration=data[0].projectDuration
//    })
   //预约的起止时间
   const bookingTime=parseInt(new Date(body.bookingTime).getTime())
   let insert={
       startTime:bookingTime,
       endTime:bookingTime+projectDuration
   }
   //查询员工的未完成预约订单,将每一个订单的预约时间计算出来
   let timeList=[]
   await bookingModel.find({bookingStatus:1}).then(data=>{
        for(let it of data){
            const bookingTime2=parseInt(new Date(it.bookingTime).getTime())
            let time={
                startTime:bookingTime2,
                endTime:bookingTime2+it.projectId.projectDuration
            }
            timeList.push(time)
        }
   })
   //时间戳转换成日期格式的函数
   const getDate=(timestamp)=>{
        const date=new Date(timestamp),
        Y=date.getFullYear()+'-',
        M=(date.getMonth()+1<10?'0'+(date.getMonth()+1):date.getMonth()+1)+'-',
        D=date.getDate()+' ',
        h=(date.getHours()<10?'0'+date.getHours():date.getHours())+':',
        m=(date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes())+':',
        s=(date.getSeconds()<10?'0'+date.getSeconds():date.getSeconds())
        return Y+M+D+h+m+s;
   }
   //判断提交的预约时间和员工的订单是否有冲突,获取冲突的时间段
   let ifBooking=true
   let conflictTime=''
   for(let it of timeList){
     if(!(insert.endTime<=it.startTime||insert.startTime>=it.endTime)){
       ifBooking=false
        conflictTime=getDate(it.startTime)+'至'+getDate(it.endTime)
       break
     }
   }
   if(ifBooking){
    await common.add(ctx,bookingModel)
     ctx.body={
         code:0,
         msg:'预约成功',
         data:[]
     }
   }else{
     ctx.body={
        code:1,
        msg:conflictTime+'已有预约！',
        data:[]
    }
   }
})

//删除预约
router.delete('/',async ctx=>{
    await common.del(ctx,bookingModel)
})

//修改预约
router.put('/',async ctx=>{
    await common.change(ctx,bookingModel)
})

module.exports = router
