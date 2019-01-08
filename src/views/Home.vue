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
                  <p class="text-sm-left" style="font-size:15px;">共发表 {{user.jokeNum}} 条，被收藏评论 {{user.favoriteNum}} 次</p>
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
          <v-flex xs7>
            <p class="text-sm-left">
              <span>{{ this.types[joke.type] }}</span>
              &nbsp;&nbsp;&nbsp;&nbsp;浏览 {{joke.see}} 次
            </p>
          </v-flex>
          <v-flex xs2></v-flex>
          <v-flex xs3>
            <v-layout align-right justify-space-around style="margin-top:-12px;">
              <v-spacer></v-spacer>
              <v-btn icon v-if="favorited" @click="like">
                <v-icon size="25" color="red">favorite</v-icon>
              </v-btn>
              <v-btn icon v-else @click="like">
                <v-icon size="25">favorite_border</v-icon>
              </v-btn>
              <!-- <v-icon size="25">chat</v-icon>
              <v-icon size="25">fas fa-share</v-icon>-->
            </v-layout>
          </v-flex>
        </v-layout>
      </v-container>
      <v-container fluid style="padding:3px 8px 0px 8px;" v-if="favorites.length > 0">
        <p class="text-sm-left" style="margin:0px">
          <v-icon small style="margin:0px 5px 0px 0px">favorite</v-icon>
          {{ favorites.map(item => item.nickname ).join("，")}} {{favorites.length}} 人收藏
        </p>
      </v-container>
      <v-content fluid>
        <v-container fluid style="padding:8px 8px 0px 8px;" v-if="!loading && comments.length > 0">
          <v-content page style="margin: 0px 0px 2px 0px;" v-for="c in comments" :key="c.lid">
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
              <v-btn flat icon color="green" style="margin:5px 0px 0px 0px;float:right">
                <v-icon>send</v-icon>
              </v-btn>
            </v-flex>
          </v-layout>
        </v-content>
      </v-content>
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
    favorited: false,
    favorites: [],
    loading: false,
    types: {
      "1": "心灵毒汤"
    },
    user_id: "",
    users: [],
    comments: []
  }),
  methods: {
    async getContent() {
      this.content = "";
      this.loading = true;
      this.favorited = false;
      await this.$sleep(Math.random() * 1000)
      let params = {
        // id: 333260
      }
      let resp = await axios.get("/api/joke/", { params });
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
        this.user = resp.data.user;
        this.users.push(this.user);
      }

      if (!this.user.avatar) {
        this.$set(this.user, "avatar", "data:image/png;base64," + new Identicon(md5(this.user.account)).toString());
      }
      for (let c of resp.data.comments) {
        if (!c.avatar) {
          this.$set(c, "avatar", "data:image/png;base64," + new Identicon(md5(c.account)).toString());
        }
      }

      this.favorites = resp.data.favorites;
      this.comments = resp.data.comments;

      if (this.user_id > 0) {
        for (const fav of this.favorites) {
          if (fav.link_id == this.user_id) {
            this.favorited = true;
            break;
          }
        }
      }

      this.$nextTick().then(() => {
        this.$scrollTo("#js-home");
      });
      this.loading = false;
    },
    async like() {
      if (this.favorited) {
        let lid = -1;
        for (const fav of this.favorites) {
          if (fav.link_id == this.user_id) {
            lid = fav.lid;
            break;
          }
        }
        let params = {
          lid: lid,
        }
        let resp = await axios.post("/api/del-link/", params);
      } else {
        if (this.user_id < 0) {
          alert("请先点击右上角按钮登录......");
          return;
        }
        let params = {
          joke_id: this.joke.pid,
          user_id: this.joke.user_id,
          link_id: this.user_id
        }
        let resp = await axios.post("/api/add-favorite/", params);
      }
      this.favorited = !this.favorited;
    }
  },
  created: async function () {
    let resp = await axios.get("/api/types/", {});
    for (let item of resp.data) {
      this.types[item.type] = item.title;
    }
    this.user_id = localStorage.getItem('user_id') || (-1);
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