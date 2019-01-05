var Router = require("koa-router");
var db = require("../models/db.js");
var api = function() {
  const router = Router();

  router.prefix("/api");

  router.get("/joke", async ctx => {
    let data = await db.joke(ctx.query.id);
    ctx.body = data;
  });

  return router.routes();
};

module.exports = api;
