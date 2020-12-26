const db = require('../db.js')
const sql = require('../utils/sql.js')
const jwt = require('jsonwebtoken')
const {secret} = require('../config')

exports.login = async (ctx, next) => {
    const {account, password} = ctx.request.body;

    if (account) {
        const {error, data} = await db.exec(sql.accountDetail, [account]);
        if (error) {
            ctx.body = JSON.stringify({
                success: false,
                msg: data.toString()
            })
        } else if (data.length === 0) {
            ctx.body = JSON.stringify(
                {
                    success: false,
                    msg: '账号不存在'
                }
            )
        } else {

            const user = data[0]
            //对比密码
            if (password === user.password) {
                //加密
                const token = jwt.sign({
                    account: user.account,
                    name: user.name,
                    type: user.type,
                    user_id: user.user_id
                }, secret)
                ctx.body = JSON.stringify({
                    success: true,
                    data: {name: user.name, type: user.type, userId: user.user_id, token},
                    msg: '登录成功'
                })

                //下发用户凭证
                ctx.cookies.set(
                    'token',
                    token,
                    {
                        domain: 'practice.jirancloud.com',  // 写cookie所在的域名
                        // domain:'localhost',
                        path: '/',       // 写cookie所在的路径
                        maxAge: 1000 * 60 * 60 * 24 * 10, // cookie有效时长
                        // expires: new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 10)),  // cookie失效时间
                        httpOnly: false,  // 是否只用于http请求中获取
                        overwrite: false  // 是否允许重写
                    }
                )

            } else {
                ctx.body = JSON.stringify({
                    success: false,
                    msg: '密码错误'
                })
            }
        }


    } else {
        ctx.body = JSON.stringify({
            success: false,
            msg: '账号不能为空'
        })
    }

    next()
}

exports.register = async (ctx, next) => {
    const {account, password, phone = '', email = '', nikName = '', name = '',accessCode=''} = ctx.request.body;

    if(!accessCode){
        ctx.body = JSON.stringify({
            success: false,
            msg: '需要邀请码才能注册'
        })
        next()
        return
    }
    // 检查账号
    if (!account) {
        ctx.body = JSON.stringify({
            success: false,
            msg: '账号不能为空'
        })
        next()
        return
    }
    if (!password) {
        ctx.body = JSON.stringify({
            success: false,
            msg: '密码不能为空'
        })
        next()
        return
    }

    const {error:accessError,data:accessData}= await db.exec('select * from register_access_code where id=?',[accessCode]);

    //数据库错误
    if(accessError){
        ctx.body = JSON.stringify({
            success: false,
            msg: accessData.toString()
        })
        next()
        return
    }
    // 不存在
    if(accessData.length===0){
        ctx.body = JSON.stringify({
            success: false,
            msg: '邀请码不存在'
        })
        next()
        return
    }

    //存在，已使用
    if(!!accessData[0]['status']){
        ctx.body = JSON.stringify({
            success: false,
            msg: '邀请码已使用'
        })
        next()
        return
    }

    //type,user_id,account,password,phone,email,nikName,name,create_time
    const {error, data} = await db.exec(sql.accountAdd, [1, new Date().getTime(), account, password, phone, email, nikName, name, new Date()]);

    if (error) {
        ctx.body = JSON.stringify({
            success: false,
            msg: data.toString()
        })
    } else {
        const {error:statusError,data:statusData}=await db.exec('update register_access_code set status = 1 WHERE id = ?',[accessCode])

        ctx.body = JSON.stringify({
            success: true,
            msg: '注册成功'
        })
    }
    next()

}
