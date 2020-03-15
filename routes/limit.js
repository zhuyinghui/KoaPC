const router = require('koa-router')()
router.prefix('/limits')
const limitModel=require('../model/limitModel')
const common=require('../model/common.js')

//获取权限
router.get('/',async ctx=>{
    await common.check(ctx,limitModel)
})

//新增权限
router.post('/', async ctx=> {
    await common.add(ctx,limitModel)
})

//删除权限
router.delete('/',async ctx=>{
    await common.del(ctx,limitModel)
})

//修改权限
router.put('/',async ctx=>{
    await common.change(ctx,limitModel)
})

module.exports = router
