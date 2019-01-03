let Koa = require("koa");
let path = require("path");
let serve = require("koa-static");
let bodyparser = require("koa-bodyparser");
let api = require("./routes/api");
let db = require("./models/db.js");
let rp = require("request-promise");

const app = new Koa();

app.use(
  serve(path.resolve(__dirname, "../dist"), {
    maxage: 1000 * 60 * 60 * 24 * 30 // a month
  })
);
app.use(bodyparser());
app.use(api());

app.listen(8000);

setTimeout(async () => {

}, 100)

setInterval(async () => {
  let body = await rp("https://www.nihaowua.com/home.html");
  let bIndex = body.search(/<div id=\"post*/i);
  let eIndex = body.indexOf("</div>", bIndex);
  body = body.substring(bIndex, eIndex);
  body += "<"; // 防止div结尾情况
  bIndex = body.indexOf(">");
  body = body.substr(bIndex + 3);
  bIndex = body.indexOf(">");
  eIndex = body.indexOf("<");
  body = body.substring(bIndex + 1, eIndex);
  console.log(body);

  await db.insertBySpider(body);
}, 30000);
