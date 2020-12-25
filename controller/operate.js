const db = require('../db.js')
const sql = require('../utils/sql.js')
const moment = require('moment')

exports.todayTasks = async (ctx, next) => {

    // 用户下，所有的项目
    const programRes = await db.exec('select * from program where user_id=?', [ctx.state.account.user_id]);

    if (!programRes.error) {
        if (programRes.data.length === 0) {
            ctx.body = JSON.stringify({
                success: true,
                data: [],
                msg: '今日任务加载成功'
            })
            next()
            return
        }
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
            task.progress progress,
            task.description description,
            status.id status,
            status.create_time finish_time,
            program.name programName,
            program.level level,
            program.start_time programStatus,
            landmarks.name landmarksName,
            diary.data diaryText,
            diary.create_time diaryTime,
            diary.id diaryId
             from 
                       task 
                       left join landmarks on task.landmarks_id=landmarks.id
                       left join program on task.program_id= program.id
                       left join (select * from status where DATEDIFF(create_time,now())=0) as status on task.id=status.record_id
                       left join (select * from  diary where DATEDIFF(create_time,now())=0) as diary on task.id=diary.task_id
                       where 
                       task.program_id in (${programIds.map(() => '?').join(',')})
                       and program.start_time is not null
                       
                       order by task.start_time `,
            programIds);
        if (!taskRes.error) {
            const tasks = taskRes.data;
            const todayStart = moment(moment(new Date()).format('YYYY-MM-DD 00:00:00'));
            const todayEnd = moment(moment(new Date()).format('YYYY-MM-DD 24:00:00'));
            //找出所有重复的任务。和不重复，时间是今天的任务
            let repeatResult = tasks.map(item => {
                item.user_id = ctx.state.account.user_id;


                if (item.is_repeat === 1) {
                    if (!item.diaryTime || moment(item.diaryTime).isBetween(todayStart, todayEnd)) {
                        return item
                    }

                }
            })
            let notRepeatResult = tasks.map(item => {
                if (item.is_repeat === 0) {
                    return item
                }
            })
            notRepeatResult = notRepeatResult.filter(item => !!item).sort()
            repeatResult = repeatResult.filter(item => !!item).sort()
            ctx.body = JSON.stringify({
                success: true,
                data: {
                    repeatResult,
                    notRepeatResult,
                },
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
