// 注意require('koa-router')返回的是函数:
const router = require('koa-router')();
const program =require('./controller/program.js')
const task = require('./controller/task.js')

// add url-route:
router.get('/program/list', program.list);
router.post('/program/add',program.add)
router.post('/program/del',program.del)

//task
router.post('/task/list',task.list)
router.post('/task/add',task.add)

// consul健康检查
router.get('/health/',async (ctx, next)=>{
    // console.log(ctx)
    ctx.body='ok'
    await next()
})
module.exports=router