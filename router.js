// 注意require('koa-router')返回的是函数:
const router = require('koa-router')();
const program =require('./controller/program.js')
const task = require('./controller/task.js')
const account = require('./controller/account')
const landMasks = require('./controller/landMasks')
const operate= require('./controller/operate')
const diary= require('./controller/diary')

const schame='/api'

// add url-route:
router.post(schame+'/account/register',account.register)
router.post(schame+'/account/login',account.login)

//
router.post(schame+'/program/list', program.list);
router.post(schame+'/program/add',program.add)
router.post(schame+'/program/del',program.del)
router.post(schame+'/program/update',program.update)
router.post(schame+'/program/startUp',program.startUp)

//landmasks
router.post(schame+'/landMasks/list',landMasks.list)
router.post(schame+'/landMasks/add',landMasks.add)
router.post(schame+'/landMasks/update',landMasks.update)

//task
router.post(schame+'/task/list',task.list)
router.post(schame+'/task/add',task.add)
router.post(schame+'/task/update',task.update)
router.post(schame+'/task/del',task.del)
router.post(schame+'/task/updateStatus',task.updateStatus)
router.post(schame+'/task/updateProgress',task.updateProgress)

//日记
router.post(schame+'/diary/list',diary.list)
router.post(schame+'/diary/add',diary.add);
router.post(schame+'/diary/update',diary.update)

//
router.post(schame+'/today/repeat',operate.todayRepeatTasks)
router.post(schame+'/today/noRepeat',operate.todayNoRepeatTasks)

// consul健康检查
router.get('/health/',async (ctx, next)=>{
    // console.log(ctx)
    ctx.body='ok'
    await next()
})
module.exports=router
