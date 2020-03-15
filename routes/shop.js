const router = require('koa-router')()
router.prefix('/shops')
const shopModel=require('../model/shopModel.js')
const common=require('../model/common.js')

//查询门店
router.get('/',async ctx=>{
    await common.check(ctx,shopModel)
})

//门店详情
router.get('/detail',async ctx=>{
  const pop1={path:'roleId',select:'roleName'}
  await common.detail(ctx,shopModel,pop1,pop2)
})

//新增门店
router.post('/', async ctx=> {
    await common.add(ctx,shopModel)
})

//删除门店
router.delete('/',async ctx=>{
    await common.del(ctx,shopModel)
})

//修改门店
router.put('/',async ctx=>{
    await common.change(ctx,shopModel)
})

//登陆账号
router.post('/login',async ctx=>{
  const body=ctx.request.body
  await shopModel.find({shopAccount:body.shopAccount})
  .then(data=>{
    if(data.length==0){
      ctx.body={
        code:1,
        msg:'账号不存在',
        data:[]
      }
    }else{
      if(data[0].shopPassword===body.shopPassword){
        ctx.body={
          code:0,
          msg:'登录成功',
          data:[data[0]._id]
        }
      }else{
        ctx.body={
          code:1,
          msg:'密码错误',
          data:[]
        }
      }
    }
  })
  .catch(err=>{
    ctx.body={
      code:1,
      msg:'登陆失败',
      data:[err]
    }
  })
  
})
module.exports = router
