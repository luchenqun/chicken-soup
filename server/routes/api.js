import Router from 'koa-router';

export default function () {
  const router = Router();

  router.prefix('/api');

  router.get('/hello', async (ctx) => {
    ctx.body = 'Hello Vue';
  });

  return router.routes();

}