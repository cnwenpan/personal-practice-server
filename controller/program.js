const db = require('../db.js')
const sql = require('../utils/sql.js')

// 查
exports.list = async (ctx, next) => {

    const {error, data} = await db.exec(sql.programList,[ctx.state.account.user_id]);

    if (error) {
        ctx.body = {
            success: false,
            data: data.toString()
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
        userId,
        endTime: end_time
    } = ctx.request.body;

    if (!name) {
        ctx.body = JSON.stringify({
            success: false,
            msg: '项目名不能为空'
        })
        next()
        return
    }

    if (!level) {
        ctx.body = JSON.stringify({
            success: false,
            msg: '优先级不能为空'
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
        const {error, data: result} = await db.exec(sql.programAdd, [name, level, new Date(end_time), new Date(), ctx.state.account.user_id])
        if (error) {
            ctx.body = JSON.stringify({
                success: false,
                msg: result.toString()
            })

        } else {
            ctx.body = JSON.stringify({
                success: true,
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

exports.update = async (ctx, next) => {
    const {id, name, level, endTime} = ctx.request.body;
    if (id) {
        const {error, data} = await db.exec(sql.programUpdate, [name, level, endTime, id])
        if (!error) {
            ctx.body = JSON.stringify({
                success: true,
                msg: '修改成功'
            })
        } else {
            ctx.body = JSON.stringify({
                success: false,
                msg: data.toString()
            })
        }
    } else {
        ctx.body = JSON.stringify({
            success: false,
            msg: 'id不能为空'
        })
    }
    next()
}
exports.startUp = async (ctx, next) => {
    const {id} = ctx.request.body;
    if (id) {
        const {error, data} = await db.exec(sql.programStartUp, [new Date(), id])
        if (!error) {
            ctx.body = JSON.stringify({
                success: true,
                msg: '启动成功'
            })
        } else {
            ctx.body = JSON.stringify({
                success: false,
                msg: data.toString()
            })
        }
    } else {
        ctx.body = JSON.stringify({
            success: false,
            msg: 'id不能为空'
        })
    }
    next()
}
