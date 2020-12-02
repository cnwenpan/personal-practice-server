const Koa = require('koa');
const bodyParser = require('koa-bodyparser')
var cors = require('koa2-cors');
const log4js = require('koa-log4')
var Consul = require('consul');
const uuid = require('uuid');
const app = new Koa();
const CONSUL_ID = uuid.v4();

// 注册到consul
const consul = new Consul({
  host: '172.16.9.28',
  port: 8500,
  promisify: true,
});

consul.agent.service.register({
  name: 'going',
  address: '172.16.9.28',
  port: 3000,
  check: {
    http: 'http://172.16.9.28:3000/health/',
    interval: '10s',
  }
}, function (err, result) {
  if (err) {
    console.error(err);
    throw err;
  }
  console.log('going' + ' 注册成功！');
})

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