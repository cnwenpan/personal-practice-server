const db = require('../db.js')
const sql = require('../utils/sql.js')

// 查
exports.list = async (ctx, next) => {
    const {
        programId,
    } = ctx.request.body;

    const res = await db.exec(sql.taskList,[programId]);

    await next()

    ctx.body = JSON.stringify({
        success: true,
        data: res
    })
}

// 增
exports.add = async (ctx, next) => {
    const {
        programId,
        name,
        des,
        type,duration,status,time
    } = ctx.request.body;
    
    if (!name||!programId) {
        ctx.body = JSON.stringify({
            success: false,
            msg:'参数错误'
        })
    } else {

        const arr = await db.exec(sql.taskHas, [name]).catch(e => {
            ctx.body = JSON.stringify({
                success: false,
                msg:'数据库异常'
            })
        })

        if(arr&&arr.length>0){
            ctx.body = JSON.stringify({
                success: false,
                msg:'任务已经存在'
            })

            return
        }
        await db.exec(sql.taskAdd, [name, des,programId,type,duration,status,time]).catch( 
            e => {
                console.log(e)
                ctx.body = JSON.stringify({
                    success: false,
                    msg:'数据库异常'
                })

            }
        );
        ctx.body = JSON.stringify({
            success: true
        })
    }
    await next()
}
// 删
exports.del= async (ctx,next)=>{
    const {id} = ctx.request.body;
    if(id){
       await db.exec(sql.taskDel,[id]).catch(e=>{
            console.log(e)
                ctx.body = JSON.stringify({
                    success: false,
                    msg:'未知错误'
                })

        })

        ctx.body = JSON.stringify({
            success: true,
        })

    }else{
        ctx.body = JSON.stringify({
            success: false,
            msg:'id不能为空'
        })
    }
}


// 改


