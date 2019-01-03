var Router = require("koa-router");
var db = require("../models/db.js");
var api = function() {
  const router = Router();

  router.prefix("/api");

  router.get("/chicken", async ctx => {
    console.log(ctx.query);
    let id = ctx.query.id;
    let data = await db.post(id);
    ctx.body = data;
  });

  router.get("/max-pid", async ctx => {
    ctx.body = await db.postMaxPid();
  });

  return router.routes();
};

module.exports = api;
