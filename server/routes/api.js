var Router = require("koa-router");
var db = require("../models/db.js");
var api = function() {
  const router = Router();

  router.prefix("/api");

  router.get("/chicken", async ctx => {
    // console.log(ctx.req);
    let data = await db.post(parseInt(Math.random() * 500) + 1);
    ctx.body = data;
  });

  return router.routes();
};

module.exports = api;
