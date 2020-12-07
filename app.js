const Koa = require('koa');
const bodyParser = require('koa-bodyparser')
var cors = require('koa2-cors');
const log4js = require('koa-log4')
const app = new Koa();

// 路由
const router = require('./router.js')

app.use(log4js.koaLogger(log4js.getLogger("http"), { level: 'info' }))


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
app.use(bodyParser({ enableTypes: ['json', 'form', 'text'] }))


app.use(router.routes());

// 返回格式json
app.use(async ctx => {
  ctx.type = 'json';
  console.log(ctx.url)
});

app.listen(3000);
