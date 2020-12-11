// 注意require('koa-router')返回的是函数:
const router = require('koa-router')();
const program =require('./controller/program.js')
const task = require('./controller/task.js')
const account = require('./controller/account')

const schame='/api'

// add url-route:
router.post(schame+'/account/register',account.register)
router.post(schame+'/account/login',account.login)

//
router.get('/program/list', program.list);
router.post(schame+'/program/add',program.add)
router.post(schame+'/program/del',program.del)

//task
router.post(schame+'/task/list',task.list)
router.post(schame+'/task/add',task.add)

// consul健康检查
router.get('/health/',async (ctx, next)=>{
    // console.log(ctx)
    ctx.body='ok'
    await next()
})
module.exports=router
