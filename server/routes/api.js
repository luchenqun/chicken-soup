var Router = require("koa-router");
var db = require("../models/db.js");
let fs = require("fs");
let path = require("path");
const crypto = require('crypto');
const salt = "i love yijia";

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

  router.post("/login", async ctx => {
    let {
      account,
      password
    } = ctx.request.body;
    let passwordHash = crypto.createHmac('sha256', password).update(salt).digest('hex');
    let data = await db.login(account, passwordHash);
    ctx.body = data || {};
  });

  router.post("/sign-up", async ctx => {
    let {
      account,
      nickname,
      password,
      email
    } = ctx.request.body;
    let passwordHash = crypto.createHmac('sha256', password).update(salt).digest('hex');
    let data = await db.signUp(account, nickname, passwordHash, email);
    ctx.body = data;
  });

  router.post("/del-link", async ctx => {
    let {
      lid,
    } = ctx.request.body;
    let data = await db.delLink(lid);
    ctx.body = data;
  });

  router.post("/add-favorite", async ctx => {
    let data = await db.insert(ctx.request.body, "links");
    ctx.body = data;
  });

  return router.routes();
};

module.exports = api;