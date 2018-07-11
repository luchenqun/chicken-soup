let Koa = require("koa");
let path = require("path");
let serve = require("koa-static");
let bodyparser = require("koa-bodyparser");
let api = require("./routes/api");

const app = new Koa();

app.use(
  serve(path.resolve(__dirname, "../dist"), {
    maxage: 1000 * 60 * 60 * 24 * 30 // a month
  })
);
app.use(bodyparser());
app.use(api());

app.listen(8000);
