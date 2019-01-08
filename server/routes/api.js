const Router = require("koa-router");
const fs = require("fs");
const path = require("path");

const orm = require("../models/orm.js");
const Jokes = orm.Jokes;
const Links = orm.Links;
const Users = orm.Users;
const sequelize = orm.sequelize;
const Sequelize = orm.Sequelize;
const Op = Sequelize.Op;

const crypto = require("crypto");
const salt = "i love yijia";

var api = function() {
  const router = Router();

  router.prefix("/api");

  router.get("/joke", async ctx => {
    try {
      let options = {
        limit: 1,
        raw: true
      };
      if (ctx.query.id) {
        options.where = {
          pid: ctx.query.id
        };
      } else {
        options.order = sequelize.random();
      }
      let joke = (await Jokes.findAll(options))[0];
      joke.imgs && (joke.imgs = JSON.parse(joke.imgs));

      let links = await Links.findAll({
        where: {
          joke_id: joke.pid
        },
        raw: true
      });

      let uids = [joke.user_id];
      uids = Array.from(new Set(uids.concat(links.map(link => link.link_id))));
      let users = await Users.findAll({
        where: {
          uid: {
            [Op.or]: uids
          }
        },
        raw: true
      });

      let favorites = [];
      let comments = [];
      for (let link of links) {
        let linkUser = users.find(user => user.uid === link.link_id);
        link = Object.assign(link, {
          uid: linkUser.uid,
          nickname: linkUser.nickname,
          avatar: linkUser.avatar,
          account: linkUser.account
        });
        link.type === 0 ? favorites.push(link) : comments.push(link);
      }
      let data = {
        ret: 0,
        joke: joke,
        favorites: favorites,
        comments: comments
      };

      ctx.body = data;
    } catch (error) {
      ctx.body = {
        ret: 1,
        message: error.message
      };
    }
  });

  router.get("/user", async ctx => {
    try {
      let user = await Users.findOne({
        where: {
          uid: ctx.query.id
        },
        attributes: { exclude: ["password"] },
        raw: true
      });

      let jokeNum = await Jokes.findAll({
        where: {
          user_id: ctx.query.id
        },
        attributes: [[sequelize.fn("COUNT", sequelize.col("user_id")), "jokeNum"]],
        raw: true
      });

      let favoriteNum = await Links.findAll({
        where: {
          user_id: ctx.query.id
        },
        attributes: [[sequelize.fn("COUNT", sequelize.col("user_id")), "favoriteNum"]],
        raw: true
      });
      user = Object.assign(user, jokeNum[0], favoriteNum[0]);

      let data = {
        user: user,
        ret: 0
      };
      ctx.body = data;
    } catch (error) {
      ctx.body = {
        ret: 1,
        message: error.message
      };
    }
  });

  router.get("/types", async ctx => {
    let config = {};
    try {
      config = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "config.json"), "utf8"));
    } catch (error) {
      config = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "config.default.json"), "utf8"));
    }
    ctx.body = config.items;
  });

  router.post("/login", async ctx => {
    let { account, password } = ctx.request.body;
    password = crypto
      .createHmac("sha256", password)
      .update(salt)
      .digest("hex");
    try {
      let user = await Users.findOne({
        where: { account, password },
        attributes: { exclude: ["password"] },
        raw: true
      });
      let data = {
        user: user,
        ret: 0
      };
      ctx.body = data;
    } catch (error) {
      ctx.body = {
        ret: 1,
        message: error.message
      };
    }
  });

  router.post("/sign-up", async ctx => {
    let { account, nickname, password, email } = ctx.request.body;
    password = crypto
      .createHmac("sha256", password)
      .update(salt)
      .digest("hex");

    try {
      let user = (await Users.create({ account, nickname, password, email })).get({ plain: true });
      ctx.body = {
        user: user,
        ret: 0
      };
    } catch (error) {
      ctx.body = {
        ret: 1,
        message: error.message
      };
    }
  });

  router.post("/del-link", async ctx => {
    let { lid } = ctx.request.body;
    try {
      Links.destroy({
        where: { lid }
      });
      ctx.body = {
        ret: 0
      };
    } catch (error) {
      ctx.body = {
        ret: 1,
        message: error.message
      };
    }
  });

  router.post("/add-favorite", async ctx => {
    let { joke_id, user_id, link_id } = ctx.request.body;
    try {
      await Links.create({ joke_id, user_id, link_id });
      ctx.body = {
        ret: 0
      };
    } catch (error) {
      ctx.body = {
        ret: 1,
        message: error.message
      };
    }
  });

  return router.routes();
};

module.exports = api;
