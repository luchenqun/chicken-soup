const Koa = require("koa");
const path = require("path");
const serve = require("koa-static");
const bodyparser = require("koa-bodyparser");
const api = require("./routes/api");
const rp = require("request-promise");
const cheerio = require("cheerio");
const fs = require("fs");

const orm = require("./models/orm.js");
const Jokes = orm.Jokes;
const Links = orm.Links;
const sequelize = orm.sequelize;
const Sequelize = orm.Sequelize;
const Op = Sequelize.Op;

const app = new Koa();

app.use(
  serve(path.resolve(__dirname, "../dist"), {
    maxage: 1000 * 60 * 60 * 24 * 30 // a month
  })
);
app.use(bodyparser());
app.use(api());

app.listen(8000);

let config = {};
try {
  config = JSON.parse(fs.readFileSync(path.join(__dirname, "config.json"), "utf8"));
} catch (error) {
  config = JSON.parse(fs.readFileSync(path.join(__dirname, "config.default.json"), "utf8"));
}

let items = config.items;

// http://www.360wa.com/m/duanxiaohua/latest
// http://www.360wa.com/duanxiaohua/product/336394
// http://www.360wa.com/m/classics
let spidering = false;
let types = {};
for (item of items) {
  types[item.pinyin] = item.type;
}
setInterval(async () => {
  if (spidering) return;
  spidering = true;
  try {
    const url = `http://www.360wa.com/m/classics`;
    let body = await rp(url);
    let $ = cheerio.load(body, {
      decodeEntities: false
    });

    let jokes = $(".list");
    for (let i = 0; i < jokes.length; i++) {
      let joke = jokes[i];
      // 链接
      let href = $(joke)
        .children(".cls-point")
        .find("a")
        .attr("href");

      if (!href) continue;

      let hrefArr = href.split("/");
      let pid = hrefArr[hrefArr.length - 1];
      let type = types[hrefArr[hrefArr.length - 3]];

      // 标题
      let title = $(joke)
        .children(".cls-point")
        .find("h1")
        .text()
        .trim();

      // 内容
      let text = $(joke)
        .children(".cls-point")
        .find("p")
        .text()
        .trim();

      // 点赞数(当查看数)
      let see = parseInt(
        $(joke)
          .children(".point-user")
          .find("#" + pid)
          .text()
          .trim()
      );

      // 正文里面包含的图片
      let imgs = [];
      $(joke)
        .children(".cls-point")
        .find("img")
        .each(function() {
          imgs.push($(this).attr("src"));
        });

      if (title) {
        title = "<h1>" + title + "</h1>";
      }
      if (text) {
        text = "<p>" + text + "</p>";
      }

      let content = (title + text).replace(/\n/g, "<br/>");

      let data = {
        pid: pid,
        user_id: 1,
        content: content,
        type: type,
        imgs: JSON.stringify(imgs),
        see: see
      };

      // 插段子
      let jokeFind = await Jokes.findOne({
        where: { pid },
        raw: true
      });
      if (jokeFind) {
        console.log("joke database already hava, pid = ", pid);
      } else {
        await Jokes.create(data);
      }

      // 爬评论
      const commitUrl = `http://www.360wa.com/topic!ajaxViewComments.html?topicId=${pid}`;
      body = await rp(commitUrl);
      $ = cheerio.load(body, {
        decodeEntities: false
      });

      let comments = $(".left2"); // 评论
      for (let i = 0; i < comments.length; i++) {
        let text = $(comments[i])
          .text()
          .replace(/\s/g, "");
        text = text.substring(text.lastIndexOf(")") + 1);
        if (text) {
          let comment = {
            joke_id: pid,
            user_id: 1,
            link_id: 1,
            comment: text,
            type: 1
          };
          let link = await Links.findOne({
            where: comment,
            raw: true
          });
          if (link) {
            console.log("commit database already hava : ", comment.comment);
          } else {
            await Links.create(comment);
          }
        }
      }
    }
  } catch (error) {
    console.log("error", error);
  }

  spidering = false;
}, 9000);
