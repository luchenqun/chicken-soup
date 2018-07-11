var Router = require("koa-router");
var api = function() {
  const router = Router();

  router.prefix("/api");

  router.get("/hello", async ctx => {
    ctx.body = "Hello Vue";
  });

  return router.routes();
};

module.exports = api;
