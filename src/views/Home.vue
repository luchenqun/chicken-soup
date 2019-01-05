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
          <v-progress-linear :indeterminate="true"></v-progress-linear>
        </div>
        <span style="font-size:20px;" v-else v-html="joke.content"></span>
      </v-container>
      <v-container fluid style="padding:8px 8px 0px 8px;text-align: center;" v-if="!loading && joke.imgs">
        <img :src="img" style="max-width: 100%;height: auto;" v-for="(img, index) in joke.imgs" :key="index">
      </v-container>
      <v-container fluid style="padding:8px 8px 0px 8px;height:25px" v-if="!loading">
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
        <v-container fluid style="padding:8px 8px 0px 8px;" v-if="!loading && comment.length > 0">
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
        <v-content style="padding:12px 8px 8px 8px;">
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
        </v-content>
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
    types: [],
    users: [],
    comment: []
  }),
  methods: {
    async getContent() {
      this.content = "";
      this.loading = true;
      await this.$sleep(Math.random() * 1000)

      let resp = await axios.get("/api/joke/", {});
      this.joke = resp.data.joke;
      this.user = {};
      for (let user of this.users) {
        if (user.uid === this.joke.user_id) {
          this.user = user;
          break;
        }
      }
      if (!this.user.uid) {
        let params = {
          id: this.joke.user_id
        }
        let resp = await axios.get("/api/user/", { params });
        this.user = resp.data;
        this.users.push(this.user);
      }

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
    let resp = await axios.get("/api/types/", {});
    this.types = resp.data;
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