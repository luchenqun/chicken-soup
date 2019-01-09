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
let types = {};
for (item of items) {
  types[item.pinyin] = item.type;
}

// http://www.360wa.com/m 首页爬(比较固定)
// http://www.360wa.com/m/classics 精华(随机出)
let spiderCount = 0;
let userId = parseInt(config.userId) || 880000;
let page = 1;
let spidering = false;
setInterval(async () => {
  if (spidering) return;
  spidering = true;
  try {
    let url = `http://www.360wa.com/m/user/${userId}/${page}`;
    if (spiderCount % 1000 === 0) {
      url = "http://www.360wa.com/m";
    } else if (spiderCount % 10 === 0) {
      url = "http://www.360wa.com/m/classics";
    }
    console.log(url);
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
        console.log("√j ", pid);
      } else {
        await Jokes.create(data);
        console.log("↓j ", pid);
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
            console.log("√c ", pid);
          } else {
            await Links.create(comment);
            console.log("↓c ", pid);
          }
        }
      }
    }

    if (url.indexOf("user") > 0) {
      if (jokes.length > 0) {
        page++;
      } else {
        config.userId = userId;
        fs.writeFileSync(path.join(__dirname, "config.json"), JSON.stringify(config));

        userId++;
        page = 1;
      }
    }
  } catch (error) {
    console.log("error", error);
  }

  spidering = false;
  spiderCount++;
}, 9000);

let index = 0;
let spideringProduct = false;
setInterval(async () => {
  if (spideringProduct) return;
  spideringProduct = true;
  let item = items[index % items.length];
  let pid = item.id;
  let url = `http://www.360wa.com/${item.pinyin}/product/${item.id}`;
  try {
    let body = await rp(url);
    let $ = cheerio.load(body, {
      decodeEntities: false
    });

    let title = $(".title")
      .text()
      .trim(); // 标题

    let $content = $(".article-content").eq(0);
    let text = $content.text().trim(); // 正文

    let imgs = []; // 正文里面包含的图片
    $content.children("img").each(function(i, elem) {
      let src = $(this).attr("src");
      imgs.push(src);
    });

    let comments = []; // 评论
    $(".comment").each(function(i, elem) {
      if (i == 0) return;
      let comment = $(this)
        .children("p")
        .text()
        .trim();
      comments.push({
        joke_id: pid,
        user_id: 1,
        link_id: 1,
        comment: comment,
        type: 1
      });
    });

    let nextHref = $(".forum2").attr("href");
    item.id = nextHref.substring(nextHref.lastIndexOf("/") + 1); // 下一个爬取的id

    let see = $(`#${pid}`)
      .text()
      .trim(); // 创建日期

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
      type: item.type,
      imgs: JSON.stringify(imgs),
      see: parseInt(see) + 1
    };

    // console.log(pid, JSON.stringify(content), item.type, JSON.stringify(imgs), see + 1, comments);

    // 插段子
    let joke = await Jokes.findOne({
      where: { pid },
      raw: true
    });
    if (joke) {
      console.log("√j ", pid);
    } else {
      await Jokes.create(data);
      console.log("↓j ", pid);
    }

    // 插段子评论
    for (const comment of comments) {
      let link = await Links.findOne({
        where: comment,
        raw: true
      });
      if (link) {
        console.log("√c ", pid);
      } else {
        await Links.create(comment);
        console.log("↓c ", pid);
      }
    }
  } catch (error) {
    console.log(url, "error", error);
  }

  spideringProduct = false;
  index++;
  if (index % 200 === 0) {
    fs.writeFileSync(path.join(__dirname, "config.json"), JSON.stringify(config));
  }
}, 3000);
