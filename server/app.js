const Koa = require('koa');
const app = new Koa();

app.use(async ctx => {
  ctx.body = 'i love this world';
});

app.listen(3000);