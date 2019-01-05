var Router = require("koa-router");
var db = require("../models/db.js");
let fs = require("fs");
let path = require("path");

var api = function () {
  const router = Router();

  router.prefix("/api");

  router.get("/joke", async ctx => {
    let data = await db.joke(ctx.query.id);
    ctx.body = data;
  });

  router.get("/user", async ctx => {
    let data = await db.user(ctx.query.id);
    ctx.body = data;
  });

  router.get("/types", async ctx => {
    let config = {}
    try {
      config = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "config.json"), 'utf8'));
    } catch (error) {
      config = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "config.default.json"), 'utf8'));
    }
    ctx.body = config.items;
  });

  return router.routes();
};

module.exports = api;