let Koa = require("koa");
let path = require("path");
let serve = require("koa-static");
let bodyparser = require("koa-bodyparser");
let api = require("./routes/api");
let db = require("./models/db.js");
let rp = require("request-promise");
let cheerio = require("cheerio");

const app = new Koa();

app.use(
  serve(path.resolve(__dirname, "../dist"), {
    maxage: 1000 * 60 * 60 * 24 * 30 // a month
  })
);
app.use(bodyparser());
app.use(api());

app.listen(8000);

const host = "http://www.360wa.com";
let items = [
  { id: "336369", pinyin: "bqb", type: 2, title: "表情包" },
  { id: "336593", pinyin: "gaoxiaotu", type: 3, title: "搞笑图片" },
  { id: "336613", pinyin: "gaoxiaogif", type: 4, title: "搞笑动态图片" },
  { id: "336595", pinyin: "shenhuifu", type: 5, title: "神回复" },
  { id: "336621", pinyin: "shentucao", type: 6, title: "神吐槽" },
  { id: "336606", pinyin: "shenzhuanzhe", type: 7, title: "神转折" },
  { id: "336622", pinyin: "duanzi", type: 8, title: "段子" },
  { id: "336393", pinyin: "wuduanzi", type: 9, title: "污段子" },
  { id: "336615", pinyin: "gaoxiaoduihua", type: 10, title: "搞笑对话段子" },
  { id: "332811", pinyin: "neihanduanzi", type: 11, title: "内涵段子" },
  { id: "336206", pinyin: "qiushi", type: 12, title: "糗事段子" },
  { id: "334865", pinyin: "shehui", type: 13, title: "新闻有才评论" },
  { id: "333260", pinyin: "yule", type: 14, title: "娱乐搞笑" },
  { id: "336454", pinyin: "keji", type: 15, title: "IT科技搞笑" },
  { id: "336625", pinyin: "aiqingxiaohua", type: 16, title: "爱情笑话" },
  { id: "336400", pinyin: "nannuxiaohua", type: 17, title: "男女笑话" },
  { id: "336389", pinyin: "jiatingxiaohua", type: 18, title: "家庭笑话" },
  { id: "336399", pinyin: "fuqixiaohua", type: 19, title: "夫妻笑话" },
  { id: "336385", pinyin: "ertongxiaohua", type: 20, title: "儿童笑话" },
  { id: "336598", pinyin: "chengrenxiaohua", type: 21, title: "成人笑话" },
  { id: "336230", pinyin: "zhichangxiaohua", type: 22, title: "职场笑话" },
  { id: "324492", pinyin: "guanchangxiaohua", type: 23, title: "官场笑话" },
  { id: "335210", pinyin: "daxuexiaohua", type: 24, title: "大学笑话" },
  { id: "335000", pinyin: "qinshixiaohua", type: 25, title: "寝室笑话" },
  { id: "294017", pinyin: "gudaixiaohua", type: 26, title: "古代笑话" },
  { id: "331697", pinyin: "xiaoyuanxiaohua", type: 27, title: "校园笑话" },
  { id: "333588", pinyin: "ketangxiaohua", type: 28, title: "课堂笑话" },
  { id: "334072", pinyin: "dongwuxiaohua", type: 29, title: "动物笑话" },
  { id: "326215", pinyin: "kouwuxiaohua", type: 30, title: "口误笑话" },
  { id: "336609", pinyin: "diyuxiaohua", type: 31, title: "地域笑话" },
  { id: "331296", pinyin: "mingrenxiaohua", type: 32, title: "名人笑话" },
  { id: "335254", pinyin: "xiaohua", type: 33, title: "笑话" },
  { id: "336617", pinyin: "lengxiaohua", type: 34, title: "冷笑话" },
  { id: "336394", pinyin: "duanxiaohua", type: 35, title: "短笑话" },
  { id: "336620", pinyin: "yulu", type: 36, title: "经典语录" },
  { id: "336610", pinyin: "qgyl", type: 37, title: "情感语录" },
  { id: "336403", pinyin: "ganwu", type: 38, title: "人生感悟" },
  { id: "336624", pinyin: "znlyl", type: 39, title: "正能量语录" },
  { id: "336218", pinyin: "jitang", type: 40, title: "心灵鸡汤" },
  { id: "327180", pinyin: "mingyan", type: 41, title: "名人名言" },
  { id: "336616", pinyin: "duanjuzi", type: 42, title: "短句子" },
  { id: "336619", pinyin: "meiju", type: 43, title: "优美句子" },
  { id: "319348", pinyin: "shici", type: 44, title: "诗词名句" },
  { id: "336623", pinyin: "xiaogushi", type: 45, title: "小故事" },
  { id: "336227", pinyin: "youmogushi", type: 46, title: "幽默故事" },
  { id: "335515", pinyin: "dayoushi", type: 47, title: "打油诗" },
  { id: "336247", pinyin: "shunkouliu", type: 48, title: "顺口溜" },
  { id: "336607", pinyin: "jipintu", type: 49, title: "极品图" },
  { id: "329568", pinyin: "gaigeci", type: 50, title: "搞笑改歌词" },
  { id: "327160", pinyin: "wanggou", type: 51, title: "网购神评论" },
  { id: "327303", pinyin: "gaoxiaoweibo", type: 52, title: "搞笑微博" }
];

(async () => {
  await db.updateId();
})();

// http://www.360wa.com/m/duanxiaohua/latest
// http://www.360wa.com/duanxiaohua/product/336394

let spider = async () => {};

let spidering = false;
let index = 0;
setInterval(async () => {
  if (spidering) return;
  spidering = true;
  let item = items[index];
  let pid = item.id;
  let url = `http://www.360wa.com/${item.pinyin}/product/${item.id}`;

  let body = await rp(url);
  let $ = cheerio.load(body, { decodeEntities: false });

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

  let nextHref = $(".forum2").attr("href");
  item.id = nextHref.substring(nextHref.lastIndexOf("/") + 1); // 下一个爬取的id

  let see = $(`#${pid}`)
    .text()
    .trim(); // 创建日期

  let content = (title + (title && text && "<br/>") + text).replace(/\n/g, "<br/>");

  let data = {
    pid: pid,
    user_id: 1,
    content: JSON.stringify(content),
    type: item.type,
    created_at: JSON.stringify(date),
    imgs: JSON.stringify(JSON.stringify(imgs)),
    see: parseInt(see) + 1
  };

  // console.log(pid, JSON.stringify(content), item.type, date, JSON.stringify(imgs), see + 1);

  await db.insertBySpider(data);
  spidering = false;
  index++;
  index === items.length && (index = 0);
}, 3000);
