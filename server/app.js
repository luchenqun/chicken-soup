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

let spidering = false;
let index = 0;
setInterval(async () => {
  if (spidering) return;
  spidering = true;
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
    let date = $(".ft")
      .text()
      .trim(); // 创建日期

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
      let date = $(this)
        .children(".meta")
        .text()
        .trim();
      comments.push({
        joke_id: pid,
        user_id: 1,
        link_id: 1,
        date: date,
        comment: comment,
        type: 1
      });
    });

    let nextHref = $(".forum2").attr("href");
    item.id = nextHref.substring(nextHref.lastIndexOf("/") + 1); // 下一个爬取的id

    let see = $(`#${pid}`)
      .text()
      .trim(); // 创建日期

    let content = (title + (title && text && "<br/>") + text).replace(/\n/g, "<br/>");

    let data = {
      pid: pid,
      user_id: 1,
      content: content,
      type: item.type,
      created_at: date,
      imgs: JSON.stringify(imgs),
      see: parseInt(see) + 1
    };

    // console.log(pid, JSON.stringify(content), item.type, date, JSON.stringify(imgs), see + 1, comments);

    // 插段子
    let joke = await Jokes.findOne({
      where: { pid },
      raw: true
    });
    if (joke) {
      console.log("joke database already hava : ", url);
    } else {
      await Jokes.create(data);
    }

    // 插段子评论
    for (const comment of comments) {
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
  } catch (error) {
    console.log(url, "error", error);
  }

  spidering = false;
  index++;
  if (index % 200 === 0) {
    fs.writeFileSync(path.join(__dirname, "config.json"), JSON.stringify(config));
  }
}, 3000);
