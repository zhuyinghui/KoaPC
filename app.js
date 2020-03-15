const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const cors = require('koa2-cors')
const session = require('koa-session')


// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

// app.use(views(__dirname + '/views', {
//   extension: 'pug'
// }))

//跨域处理
app.use(cors({
  origin:'http://localhost:8080',
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
  maxAge: 5,
  credentials: true,
  allowMethods: ['GET', 'POST', 'DELETE','PUT'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept','token'],
}))

//session配置
app.keys = ['some secret hurr'];
const CONFIG = {
  key: 'koaSession', /* cookie键值 */
  maxAge: 1800000, /* cookie过期时间，单位ms,60s过期 */
  overwrite: true, /* 是否可以重写 */
  httpOnly: true, /* cookie是否只有服务器端可以访问 */
  signed: true, 
  rolling: true, /* 是否在每次请求是强行设置cookie，重置cookie过期时间 */
};
app.use(session(CONFIG, app));

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

//权限拦截
const limitModel=require('./model/limitModel')
const roleModel=require('./model/roleModel')
const shopModel=require('./model/shopModel')
const memberModel=require('./model/memberModel')
const url = require('url')

app.use(async(ctx,next)=>{

  //1 获取当前请求的名称及来源域
  const path=url.parse(ctx.request.url).pathname
  const limitPath=ctx.request.method+path
  const domain=ctx.request.header.origin
  console.log('domain',domain);
  
  //2 设置不需要权限拦截的接口
  const passLimit=['POST/shops/login','POST/members/login']

  //3 判断当前请求是否需要拦截?
  if(passLimit.includes(limitPath)){
    //不拦截-->请求通过
    await next()
    return
  }
  
  //4 请求拦截-->判断当前请求是否有用户凭证?
  if(
    ctx.request.header.token==='undefined'||
    ctx.request.header.token===undefined
  ){
    //无用户凭证-->请求驳回
    ctx.body={
      code:1,
      msg:'无用户凭证',
      data:[]
    }
    return
  }

  //5 有用户凭证-->判断当前用户是否为超级管理员
  let token=ctx.request.header.token
  if(token==='5e22eef2da00f2178c398662'){
    await next()
    return
  }

  //6 非超级管理员-->查询用户的权限组编号
  let roleId='',limitIds=[],limitArray=[]
  //如果请求来自pc端，就查询门店表，否则查询会员表
  await shopModel.find({_id:token})
  .then(shopData=>{
    roleId=shopData[0].roleId||''
  })

  await roleModel.find({_id:roleId})
  .then(roleData=>{
    limitIds=roleData[0].limitIds
  })
  
  //7 根据编号查询用户权限组的名称
  await limitModel.find({_id:{$in:limitIds}})
  .then(limitData=>{
    for(let item of limitData){
      limitArray.push(item.limitContent)
    }
  })

  //8 判断用户是否有当前请求的权限
  if(!limitArray.includes(limitPath)){
    //无权限-->请求驳回
    ctx.body={
      code:1,
      msg:'无操作权限',
      data:[]
    }
    return
  }
  //有权限-->请求通过
  await next()
})

// routes,注册路由
const fs =  require('fs');
fs.readdirSync('./routes').forEach(route=> {
  let api = require(`./routes/${route}`);
  app.use(api.routes(), api.allowedMethods())
});

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error',err)
});

//连接数据库
const common = require('./model/common')
common.connect()





module.exports = app
