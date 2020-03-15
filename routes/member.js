const router = require('koa-router')()
router.prefix('/members')
const memberModel=require('../model/memberModel.js')
const common=require('../model/common.js')

//登陆会员
router.get('/login',async ctx=>{
    console.log('会员已登陆');
})

//新增会员
router.post('/',async ctx=>{
    await common.add(ctx,memberModel)
})

router.get('/',async ctx=>{
    await common.check(ctx,memberModel)
})

router.delete('/',async ctx=>{
    await common.del(ctx,memberModel)
})

router.put('/',async ctx=>{
    await common.change(ctx,memberModel)
})
module.exports = router
