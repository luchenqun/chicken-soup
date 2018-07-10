import Koa from 'koa';
import path from 'path';
import serve from 'koa-static';
import bodyparser from 'koa-bodyparser';

import api from './routes/api';

const app = new Koa();

app.use(async ctx => {
  ctx.body = 'i love this world';
});

app.use(
  serve(path.resolve(__dirname, '../dist'), {
    maxage: 1000 * 60 * 60 * 24 * 30, // a month
  }),
);
app.use(bodyparser());
app.use(api());


app.listen(8000);