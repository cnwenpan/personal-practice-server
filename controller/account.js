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
                ctx.body = JSON.stringify({
                    success: true,
                    msg: '登录成功'
                })

                //加密
                const token= jwt.sign({account: user.account, name: user.name, type: user.type,user_id:user.user_id}, secret)
                //下发用户凭证
                ctx.cookies.set(
                    'token',
                    token,
                    {
                        domain: '10.147.20.228',  // 写cookie所在的域名
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
    const {account, password, phone = '', email = '', nikName = '', name = ''} = ctx.request.body;

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
    //type,user_id,account,password,phone,email,nikName,name,create_time
    const {error, data} = await db.exec(sql.accountAdd, [1, new Date().getTime(), account, password, phone, email, nikName, name, new Date()]);

    if (error) {
        ctx.body = JSON.stringify({
            success: false,
            msg: data.toString()
        })
    } else {

        ctx.body = JSON.stringify({
            success: true,
            msg: '注册成功'
        })
    }
    next()

}
