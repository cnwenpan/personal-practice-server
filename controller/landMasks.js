const db = require('../db.js')
const sql = require('../utils/sql.js')

exports.list = async (ctx, next) => {
    const {programId} = ctx.request.body;
    if (programId) {
        const {error, data} = await db.exec(sql.landMasksList, [programId]);
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

exports.add=async (ctx,next)=>{
    const {programId,name,endTime}= ctx .request.body;
    if(programId){
        const {error, data} = await db.exec(sql.landMasksAdd, [programId,name,new Date(),new Date(endTime)]);
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
    }else {
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