const db = require('../db.js')
const sql = require('../utils/sql.js')
const moment = require('moment')

exports.todayTasks = async (ctx, next) => {

    // 用户下，所有的项目
    const programRes = await db.exec('select * from program where user_id=?', [ctx.state.account.user_id]);

    if (!programRes.error) {
        const programIds = programRes.data.map(item => item.id);
        //所有项目下的任务
        const taskRes = await db.exec(
            `select 
            task.id id,
            task.name name,
            task.targets targets,
            task.is_repeat is_repeat,
            task.start_time start_time,
            task.program_id program_id,
            task.landmarks_id landmarks_id,
            task.time_of_day time_of_day,
            task.status status,
            program.name programName,
            program.level level,
            landmarks.name landmarksName,
            diary.data diaryText
             from 
                       task 
                       left join landmarks on task.landmarks_id=landmarks.id
                       left join program on task.program_id= program.id
                       left join diary on task.id=diary.task_id
                       where task.program_id in (${programIds.map(() => '?').join(',')}) order by task.start_time `,
            programIds);
        if (!taskRes.error) {
            const tasks = taskRes.data;

            //找出所有重复的任务。和不重复，时间是今天的任务
            let result = tasks.map(item => {
                item.user_id = ctx.state.account.user_id;

                if (item.is_repeat === 1) {

                    return item;
                } else {

                    const todayStart = moment(moment(new Date()).format('YYYY-MM-DD 00:00:00'));
                    const todayEnd = moment(moment(new Date()).format('YYYY-MM-DD 24:00:00'));
                    if (moment(item.start_time).isBetween(todayStart, todayEnd)) {

                        return item;
                    }
                }
            })
            result = result.filter(item => !!item).sort()
            console.log(result)
            ctx.body = JSON.stringify({
                success: true,
                data: result,
                msg: '今日任务加载成功'
            })
        } else {
            ctx.body = JSON.stringify({
                success: false,
                msg: taskRes.data.toString()
            })
        }
    } else {
        ctx.body = JSON.stringify({
            success: false,
            msg: programRes.data.toString()
        })
    }
    next()

}
