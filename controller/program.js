const db = require('../db.js')
const sql = require('../utils/sql.js')

// 查
exports.list = async (ctx, next) => {

    const res = await db.exec(sql.programList);

    console.log('进了programlist',res)


    ctx.body = JSON.stringify({
        success: true,
        data: res
    })
    next()
}

// 增
exports.add = async (ctx, next) => {
    const {
        name,
        level,
        end_time
    } = ctx.request.body;

    if (!name) {
        ctx.body = JSON.stringify({
            success: false
        })
    } else {

        //  任务名，云重判断
        const arr = await db.exec(sql.programHas, [name]).catch(e => {
            console.log(e)
            ctx.body = JSON.stringify({
                success: false
            })
        })

        if (arr && arr.length > 0) {
            ctx.body = JSON.stringify({
                success: false,
                msg: '项目名已经存在'
            })

            return
        }

        // name,level,end_time,create_time,user_id

        await db.exec(sql.programAdd, [name, level,end_time,new Date()]).catch(
            e => {
                console.log(e)
                ctx.body = JSON.stringify({
                    success: false
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
exports.del = async (ctx, next) => {
    const {id} = ctx.request.body;
    if (id) {
        await db.exec(sql.programDel, [id]).catch(e => {
            console.log(e)
            ctx.body = JSON.stringify({
                success: false,
                msg: '未知错误'
            })

        })

        ctx.body = JSON.stringify({
            success: true,
        })

    } else {
        ctx.body = JSON.stringify({
            success: false,
            msg: 'id不能为空'
        })
    }
}


// detail
exports.detail = async (ctx, next) => {
    const {id} = ctx.request.body;
    if (id) {
        const res = await db.exec(sql.programDetail, [id]).catch(e => {
            console.log(e)
            ctx.body = JSON.stringify({
                success: false,
                msg: '未知错误'
            })

        })

        ctx.body = JSON.stringify({
            success: true,
            data: res
        })

    } else {
        ctx.body = JSON.stringify({
            success: false,
            msg: 'id不能为空'
        })
    }

    await next()
}


