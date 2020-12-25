const Koa = require('koa');
const bodyParser = require('koa-bodyparser')
const cors = require('koa2-cors');
const log4js = require('koa-log4')
const jwt = require('jsonwebtoken')
const {secret,whiteInventory} = require('./config')
const app = new Koa();

// 路由
const router = require('./router.js')

app.use(log4js.koaLogger(log4js.getLogger("http"), {level: 'info'}))

// 允许跨域
app.use(cors({
    origin: function (ctx) {
        return '*';
    },
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 5,
    credentials: true,
    allowMethods: ['GET', 'POST', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));

// http,body解析
app.use(bodyParser({enableTypes: ['json', 'form', 'text']}))

app.use(async (ctx, next) => {
    console.log(ctx.url)
//验证token
    const requestUrl = ctx.request.originalUrl;
    //白名单 ，不验证token
    if (whiteInventory.indexOf(requestUrl) > -1) {
        await next()
    } else {
        const token = ctx.cookies.get('token')||ctx.request.headers.get('token')
        if (!token) {
            ctx.body = JSON.stringify({
                code: 1001,
                success:false,
                msg: '请先登录'
            })
        } else {
            let decoded
            try {
                decoded = jwt.verify(token, secret)
                if (!decoded.user_id) {
                    ctx.body = JSON.stringify({
                        code: 1001,
                        success:false,
                        msg: '登录异常，请重新登录'
                    })
                } else {
                    ctx.state.account=decoded;
                    await next()
                }
            } catch (e) {
                console.log(e)
                ctx.body = JSON.stringify({
                    code: 1002,
                    success:false,
                    msg: e.toString()
                })
            }
        }
    }


})

app.use(router.routes());

// 返回格式json
app.use(async ctx => {
    ctx.type = 'json';
    console.log(ctx.url)
});

app.listen(2083);
