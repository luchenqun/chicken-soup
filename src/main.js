import Vue from "vue";
import App from "./App.vue";
import router from './router'
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
import VueClipboard from "vue-clipboard2";
import VueScrollTo from "vue-scrollto";
import moment from "moment";
import VueTimeago from "vue-timeago";

Vue.use(Vuetify);
Vue.use(VueClipboard);
Vue.use(VueScrollTo);

moment.locale("zh-cn");
Vue.prototype.$moment = moment;

Vue.prototype.$sleep = time => {
  return new Promise(resolve => setTimeout(resolve, time));
};

Vue.use(VueTimeago, {
  name: "Timeago", // Component name, `Timeago` by default
  locale: "zh-CN", // Default locale
  locales: {
    "zh-CN": require("date-fns/locale/zh_cn")
  }
});

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
