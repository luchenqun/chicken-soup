<template>
  <v-content style="background-color:#fff;margin: auto;height:100%" id="js-home" v-touch="{left: () => getContent()}">
    <v-content style="width:600px;margin:60px 0px 0px 0px;">
      <v-container fluid style="padding:8px 8px 0px 8px;">
        <v-content page style="height:80px;margin: auto;">
          <div style="width:80px;height:80px;float:left">
            <v-avatar size="80" color="grey lighten-4">
              <img :src="user.avatar" alt="avatar">
            </v-avatar>
          </div>
          <div style="margin-left:90px;height:80px;">
            <v-content fluid>
              <v-layout row wrap>
                <v-flex xs12 style="height:30px;">
                  <p class="text-sm-left" style="font-size:20px;">{{user.nickname}}</p>
                </v-flex>
                <v-flex xs12 style="height:25px;">
                  <p class="text-sm-left" style="font-size:15px;">
                    第 {{user.uid}} 号会员，加入于
                    <timeago :since="user.registered" :includeSeconds="true" :autoUpdate="1"></timeago>
                  </p>
                </v-flex>
                <v-flex xs12 style="height:25px;">
                  <p class="text-sm-left" style="font-size:15px;">共发表 {{user.jokeNum}} 条，被收藏 {{user.favoriteNum}} 次</p>
                </v-flex>
              </v-layout>
            </v-content>
          </div>
        </v-content>
      </v-container>
      <v-container fluid style="padding:8px 8px 0px 8px;">
        <div class="text-xs-center" v-if="loading">
          <v-progress-circular :size="70" :width="7" color="purple" indeterminate></v-progress-circular>
        </div>
        <span style="font-size:20px;" v-else v-html="joke.content"></span>
      </v-container>
      <v-container fluid style="padding:8px 8px 0px 8px;text-align: center;" v-if="joke.imgs">
        <img :src="img" style="max-width: 100%;height: auto;" v-for="(img, index) in joke.imgs" :key="index">
      </v-container>
      <v-container fluid style="padding:8px 8px 0px 8px;height:25px">
        <v-layout row wrap>
          <v-flex xs3>
            <p class="text-sm-left">浏览 {{joke.see}} 次</p>
          </v-flex>
          <v-flex xs4></v-flex>
          <v-flex xs5>
            <v-layout align-center justify-space-around>
              <v-icon size="25">favorite_border</v-icon>
              <v-icon size="25">chat</v-icon>
              <v-icon size="25">fas fa-share</v-icon>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-container>
      <v-container fluid style="padding:3px 8px 0px 8px;" v-if="favorite.length > 0">
        <p class="text-sm-left" style="margin:0px">
          <v-icon small style="margin:0px 5px 0px 0px">favorite</v-icon>
          {{ favorite.map(item => item.nickname ).join("，")}} {{favorite.length}} 人收藏
        </p>
      </v-container>
      <v-container fluid style="padding:0px 8px 0px 0px;">
        <v-container fluid style="padding:8px 8px 0px 8px;" v-if="comment.length > 0">
          <v-content page style="margin: 0px 0px 2px 0px;" v-for="c in comment" :key="c.lid">
            <div style="width:40px;height:40px;float:left">
              <v-avatar size="40" color="grey lighten-4">
                <img :src="c.avatar" alt="avatar">
              </v-avatar>
            </div>
            <div style="margin-left:50px;">
              <p class="text-sm-left" style="margin:0px">
                <span style="color:RGB(41,92,157);">{{c.nickname}}</span>
                : {{c.comment}}
              </p>
              <p style="margin-bottom:5px" class="grey--text">
                <timeago :since="c.date" :includeSeconds="true" :autoUpdate="1"></timeago>
              </p>
            </div>
          </v-content>
        </v-container>
        <v-container fluid>
          <v-divider style="background-color:#949494"></v-divider>
          <v-textarea color="teal" clearable hide-details maxlength="120">
            <div slot="label">评论</div>
          </v-textarea>
          <v-layout row wrap style="margin-top:6px;">
            <v-flex xs6>
              <v-btn flat icon color="primary" style="margin-top:1px;margin-left:0px;">
                <v-icon>sentiment_satisfied_alt</v-icon>
              </v-btn>
            </v-flex>
            <v-flex xs6>
              <v-btn small color="primary" style="margin:5px 0px 0px 0px;float:right">发送评论</v-btn>
            </v-flex>
          </v-layout>
        </v-container>
      </v-container>
      <div class="text-xs-center">
        <v-btn fab dark large :loading="loading" color="green darken-2" @click="getContent">
          <v-icon x-large dark>autorenew</v-icon>
        </v-btn>
      </div>
    </v-content>
  </v-content>
</template>

<script>
import axios from "axios";
import Identicon from "identicon.js";
import md5 from "md5";
import bus from "../eventBus.js";

export default {
  data: () => ({
    joke: {},
    user: {},
    content: "",
    favorite: [],
    loading: false,
    types: [
      { pinyin: "bqb", type: 1, title: "心灵毒汤" },
      { pinyin: "bqb", type: 2, title: "表情包" },
      { pinyin: "gaoxiaotu", type: 3, title: "搞笑图片" },
      { pinyin: "gaoxiaogif", type: 4, title: "搞笑动态图片" },
      { pinyin: "shenhuifu", type: 5, title: "神回复" },
      { pinyin: "shentucao", type: 6, title: "神吐槽" },
      { pinyin: "shenzhuanzhe", type: 7, title: "神转折" },
      { pinyin: "duanzi", type: 8, title: "段子" },
      { pinyin: "wuduanzi", type: 9, title: "污段子" },
      { pinyin: "gaoxiaoduihua", type: 10, title: "搞笑对话段子" },
      { pinyin: "neihanduanzi", type: 11, title: "内涵段子" },
      { pinyin: "qiushi", type: 12, title: "糗事段子" },
      { pinyin: "shehui", type: 13, title: "新闻有才评论" },
      { pinyin: "yule", type: 14, title: "娱乐搞笑" },
      { pinyin: "keji", type: 15, title: "IT科技搞笑" },
      { pinyin: "aiqingxiaohua", type: 16, title: "爱情笑话" },
      { pinyin: "nannuxiaohua", type: 17, title: "男女笑话" },
      { pinyin: "jiatingxiaohua", type: 18, title: "家庭笑话" },
      { pinyin: "fuqixiaohua", type: 19, title: "夫妻笑话" },
      { pinyin: "ertongxiaohua", type: 20, title: "儿童笑话" },
      { pinyin: "chengrenxiaohua", type: 21, title: "成人笑话" },
      { pinyin: "zhichangxiaohua", type: 22, title: "职场笑话" },
      { pinyin: "guanchangxiaohua", type: 23, title: "官场笑话" },
      { pinyin: "daxuexiaohua", type: 24, title: "大学笑话" },
      { pinyin: "qinshixiaohua", type: 25, title: "寝室笑话" },
      { pinyin: "gudaixiaohua", type: 26, title: "古代笑话" },
      { pinyin: "xiaoyuanxiaohua", type: 27, title: "校园笑话" },
      { pinyin: "ketangxiaohua", type: 28, title: "课堂笑话" },
      { pinyin: "dongwuxiaohua", type: 29, title: "动物笑话" },
      { pinyin: "kouwuxiaohua", type: 30, title: "口误笑话" },
      { pinyin: "diyuxiaohua", type: 31, title: "地域笑话" },
      { pinyin: "mingrenxiaohua", type: 32, title: "名人笑话" },
      { pinyin: "xiaohua", type: 33, title: "笑话" },
      { pinyin: "lengxiaohua", type: 34, title: "冷笑话" },
      { pinyin: "duanxiaohua", type: 35, title: "短笑话" },
      { pinyin: "yulu", type: 36, title: "经典语录" },
      { pinyin: "qgyl", type: 37, title: "情感语录" },
      { pinyin: "ganwu", type: 38, title: "人生感悟" },
      { pinyin: "znlyl", type: 39, title: "正能量语录" },
      { pinyin: "jitang", type: 40, title: "心灵鸡汤" },
      { pinyin: "mingyan", type: 41, title: "名人名言" },
      { pinyin: "duanjuzi", type: 42, title: "短句子" },
      { pinyin: "meiju", type: 43, title: "优美句子" },
      { pinyin: "shici", type: 44, title: "诗词名句" },
      { pinyin: "xiaogushi", type: 45, title: "小故事" },
      { pinyin: "youmogushi", type: 46, title: "幽默故事" },
      { pinyin: "dayoushi", type: 47, title: "打油诗" },
      { pinyin: "shunkouliu", type: 48, title: "顺口溜" },
      { pinyin: "jipintu", type: 49, title: "极品图" },
      { pinyin: "gaigeci", type: 50, title: "搞笑改歌词" },
      { pinyin: "wanggou", type: 51, title: "网购神评论" },
      { pinyin: "gaoxiaoweibo", type: 52, title: "搞笑微博" }
    ],
    comment: []
  }),
  methods: {
    async getContent() {
      this.content = "";
      this.loading = true;
      await this.$sleep(Math.random() * 1000)

      let resp = await axios.get("/api/joke/", {});
      this.joke = resp.data.joke;
      this.user = resp.data.user;
      if (!this.user.avatar) {
        this.$set(this.user, "avatar", "data:image/png;base64," + new Identicon(md5(this.user.account)).toString());
      }
      for (let c of resp.data.comment) {
        if (!c.avatar) {
          this.$set(c, "avatar", "data:image/png;base64," + new Identicon(md5(c.account)).toString());
        }
      }

      this.favorite = resp.data.favorite;
      this.comment = resp.data.comment;
      this.$nextTick().then(() => {
        this.$scrollTo("#js-home");
      });
      this.loading = false;
    }
  },
  created: async function () {
    await this.getContent();
  },
  beforeMount() {
    bus.$on("updateContent", async () => {
      await this.getContent();
    });
  }
};
</script>

<style>
#js-menu {
  z-index: 200;
  position: fixed;
  bottom: 0;
  width: 100%;
}
</style>