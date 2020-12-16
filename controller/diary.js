const moment =require('moment')
const db = require('../db.js')

const sql = require('../utils/sql.js')

exports.add = async (ctx, next) => {
    const {taskId, data: diaryText} = ctx.request.body;

    if (taskId) {
        const {error, data} = await db.exec(sql.diaryAdd, [taskId, diaryText, new Date()]);

        if (error) {
            ctx.body = JSON.stringify({
                success: false,
                msg: data.toString()
            })
        } else {
            ctx.body = JSON.stringify({
                success: true,
                msg: '保存成功'
            })
        }

    } else {
        ctx.body = JSON.stringify({
            success: false,
            msg: '任务id不能为空'
        })
    }
}


exports.update = async (ctx, next) => {
    const {id, data: diaryText} = ctx.request.body;

    if (id) {
        const {error, data} = await db.exec(sql.diaryUpdate, [diaryText, id]);

        if (error) {
            ctx.body = JSON.stringify({
                success: false,
                msg: data.toString()
            })
        } else {
            ctx.body = JSON.stringify({
                success: true,
                msg: '保存成功'
            })
        }

    } else {
        ctx.body = JSON.stringify({
            success: false,
            msg: '任务id不能为空'
        })
    }
}

exports.list = async (ctx, next) => {
    const {error, data} = await db.exec(`
        select diary.data diaryText,program.name,program.level level,task.create_time time
         from diary 
         left join task on diary.task_id=task.id
         left join program on task.program_id=program.id
         where program.user_id=? order by task.create_time
    `, [ctx.state.account.user_id]);

    if (error) {
        ctx.body = JSON.stringify({
            success: false,
            msg: data.toString()
        })
    } else {

        data.forEach(item=>item.time=moment(item.time).format('YYYY-MM-DD'))
        const result = []
        data.forEach(item => {
            const index = result.findIndex(obj => item.time === obj.time)
            if (index > -1) {
                result[index]['list'].push(item)
            } else {
                result.push({
                    time: item.time,
                    list: [item]
                })
            }
        })
        ctx.body = JSON.stringify({
            success: true,
            data: result,
            msg:'日记清单加载成功'
        })
    }
    next()
}
