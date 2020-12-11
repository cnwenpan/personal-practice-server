const db = require('../db.js')
const sql = require('../utils/sql.js')

// 查
exports.list = async (ctx, next) => {

    const {error, data} = await db.exec(sql.programList);

    if (error) {
        ctx.body = {
            success: false,
            data: error.toString()
        }
    } else {
        ctx.body = JSON.stringify({
            success: true,
            data: data
        })
    }
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
        next()
        return
    }

    //  任务名，云重判断
    const {error, data} = await db.exec(sql.programHas, [name])

    if (error) {
        ctx.body = JSON.stringify({
            success: false,
            msg: data.toString()
        })

    } else {
        if (data && data.length > 0) {
            ctx.body = JSON.stringify({
                success: false,
                msg: '项目名已经存在'
            })
            next()
            return
        }

        // name,level,end_time,create_time,user_id
        const {error, data} = await db.exec(sql.programAdd, [name, level, end_time, new Date()])
        if (error) {
            ctx.body = JSON.stringify({
                success: false,
                msg: data.toString()
            })

        } else {
            ctx.body = JSON.stringify({
                success: true,
                data,
            })
        }
    }
    next()
}

// 删
exports.del = async (ctx, next) => {
    const {id} = ctx.request.body;
    if (id) {
        const {error, data} = await db.exec(sql.programDel, [id])
        if (error) {
            ctx.body = JSON.stringify({
                success: false,
                msg: data.toString()
            })

            next()
            return
        }

        ctx.body = JSON.stringify({
            success: true,
            msg: '操作成功'
        })

    } else {
        ctx.body = JSON.stringify({
            success: false,
            msg: 'id不能为空'
        })
    }
    next()
}
