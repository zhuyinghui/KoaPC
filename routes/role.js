const router = require('koa-router')()
router.prefix('/roles')
const roleModel=require('../model/roleModel')
const common=require('../model/common.js')

//获取角色
router.get('/',async ctx=>{
    await common.check(ctx,roleModel)
})

//新增角色
router.post('/', async ctx=> {
    await common.add(ctx,roleModel)
})

//删除角色
router.delete('/',async ctx=>{
    await common.del(ctx,roleModel)
})

//修改角色
router.put('/',async ctx=>{
    await common.change(ctx,roleModel)
})

module.exports = router
