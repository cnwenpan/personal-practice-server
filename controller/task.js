const db = require('../db.js')
const sql = require('../utils/sql.js')

// 查
exports.list = async (ctx, next) => {

    const {landMarkId} = ctx.request.body;
    if (landMarkId) {
        const {error, data} = await db.exec(sql.taskList, [landMarkId]);

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
    } else {
        ctx.body = JSON.stringify({
            success: false,
            msg: 'landMarkId不能为空'
        })
    }


    next()
}

// 增
exports.add = async (ctx, next) => {
    const {
        landMarkId,
        name,
        startTime,
        repeat,
        targets,
        time_of_day,
        description
    } = ctx.request.body;

    if (!landMarkId) {
        ctx.body = JSON.stringify({
            success: false,
            msg: 'landMarkId不能为空'
        })
        next()
        return
    }

    if (!name) {
        ctx.body = JSON.stringify({
            success: false,
            msg: '任务名不能为空'
        })
        next()
        return
    }

    if (!startTime) {
        ctx.body = JSON.stringify({
            success: false,
            msg: '时间不能为空'
        })
        next()
        return
    }


    // name,level,end_time,create_time,user_id
    const {error, data} = await db.exec(sql.taskAdd, [name, new Date(startTime), Number(repeat),Number(time_of_day), Number(targets), description, new Date(), landMarkId, 0])
    if (error) {
        ctx.body = JSON.stringify({
            success: false,
            msg: data.toString()
        })

    } else {
        ctx.body = JSON.stringify({
            success: true,
        })
    }

    next()
}

// 删
exports.del = async (ctx, next) => {
    const {id} = ctx.request.body;
    if (id) {
        const {error, data} = await db.exec(sql.taskDel, [id])
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
    const {
        id,
        name,
        startTime,
        repeat,
        targets,
        time_of_day,
        description
    } = ctx.request.body;

    if (!id) {
        ctx.body = JSON.stringify({
            success: false,
            msg: 'taskId不能为空'
        })
        next()
        return
    }

    if (!name) {
        ctx.body = JSON.stringify({
            success: false,
            msg: '任务名不能为空'
        })
        next()
        return
    }

    if (!startTime) {
        ctx.body = JSON.stringify({
            success: false,
            msg: '时间不能为空'
        })
        next()
        return
    }


    // name,level,end_time,create_time,user_id
    const {error, data} = await db.exec(sql.taskUpdate, [name, new Date(startTime), Number(repeat),Number(time_of_day), Number(targets), description, id])
    if (error) {
        ctx.body = JSON.stringify({
            success: false,
            msg: data.toString()
        })

    } else {
        ctx.body = JSON.stringify({
            success: true,
        })
    }

    next()
}

exports.updateStatus = async (ctx, next) => {
    //状态默认未完成。
    const {taskId, status = 0} = ctx.request.body;
    if (taskId) {

        const {error, data} = await db.exec('update task set status=? where id=?', [status, taskId])
        if (!error) {
            ctx.body = JSON.stringify({
                success: true,
                msg: '更新成功'
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
            msg: 'taskId不能为空'
        })
    }
    next()
}
