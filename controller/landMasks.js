const db = require('../db.js')
const sql = require('../utils/sql.js')

exports.list = async (ctx, next) => {
    const {programId} = ctx.request.body;
    if (programId) {
        const {error, data} = await db.exec(sql.landMasksList, [programId]);
        const taskSql = `select * from task where landmarks_id in(${data.map(item => '?').join(',')}) order by start_time`
        const {error: taskError, data: taskData} = await db.exec(taskSql, data.map(item => item.id))
        if (!error && !taskError) {

            let list = []
            data.forEach(land => {
                const arr = [];
                land.type = 'landmarks'
                taskData.map(item => {
                    if (item.landmarks_id === land.id) {
                        arr.push(item)
                    }
                })
                arr.push(land)
                list = list.concat(arr)
            })

            ctx.body = JSON.stringify({
                success: true,
                data: list
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
            msg: 'programId不能为空'
        })
    }
    next()
}

exports.add = async (ctx, next) => {
    const {programId, name, endTime} = ctx.request.body;
    if (programId) {
        const {error, data} = await db.exec(sql.landMasksAdd, [programId, name, new Date(), new Date(endTime)]);
        if (!error) {
            ctx.body = JSON.stringify({
                success: true,
                data: data
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
            msg: 'programId不能为空'
        })
    }
    next()
}

exports.update = async (ctx, next) => {
    const {id, name, endTime} = ctx.request.body;
    if (id) {
        const {error, data} = await db.exec(sql.landMasksUpdate, [name, endTime, id])
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