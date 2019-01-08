<template>
  <v-content>
    <v-toolbar dark color="primary" id="js-toolbar" height="56">
      <v-toolbar-side-icon @click="updateLeftNav()"></v-toolbar-side-icon>
      <v-toolbar-title class="white--text">{{ welcome }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="loginSignUpShow=1">
        <v-icon>{{this.logined ? "person" : "person_outline"}}</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>search</v-icon>
      </v-btn>
      <!-- <v-btn icon @click="updateContent()">
        <v-icon>sync</v-icon>
      </v-btn>-->
    </v-toolbar>
    <v-layout row justify-center>
      <v-dialog v-model="loginSignUpShow" persistent max-width="400px">
        <v-card>
          <v-card-title>
            <span class="headline">{{ loginSignUpShow == 1 ? "登陆" : "注册" }}</span>
          </v-card-title>
          <v-card-text>
            <v-content grid-list-md>
              <v-layout wrap>
                <v-flex xs12>
                  <v-text-field v-model="account" label="账号"></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field v-model="password" type="password" label="密码"></v-text-field>
                </v-flex>
                <v-flex xs12 v-if="loginSignUpShow == 2">
                  <v-text-field v-model="email" label="邮箱"></v-text-field>
                </v-flex>
                <v-flex xs12 v-if="loginSignUpShow == 2">
                  <v-text-field v-model="nickname" label="昵称"></v-text-field>
                </v-flex>
              </v-layout>
            </v-content>
          </v-card-text>
          <v-card-actions>
            <span v-if="loginSignUpShow == 1" @click="loginSignUpShow=2">&nbsp;&nbsp;没账号，点我注册</span>
            <span v-if="loginSignUpShow == 2" @click="loginSignUpShow=1">&nbsp;&nbsp;有账号，点我登陆</span>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click.native="loginSignUpShow = 0">取消</v-btn>
            <v-btn color="blue darken-1" flat @click.native="login" v-if="loginSignUpShow == 1">登陆</v-btn>
            <v-btn color="blue darken-1" flat @click.native="signUp" v-if="loginSignUpShow == 2">注册</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
    <v-snackbar v-model="snackbar" color="success" auto-height top vertical>{{ message }}</v-snackbar>
  </v-content>
</template>


<script>
import bus from "../eventBus.js";
import axios from "axios";
export default {
  data: () => ({
    leftNav: false,
    account: "",
    password: "",
    nickname: "",
    email: "",
    loginSignUpShow: 0, // 0 不显示 1 显示登陆 2 显示注册
    logined: false,
    snackbar: false,
    message: "",
    welcome: "段子语录集锦"
  }),
  methods: {
    updateLeftNav: function () {
      this.leftNav = !this.leftNav;
      bus.$emit("updateLeftNav", this.leftNav);
    },
    updateContent: function () {
      bus.$emit("updateContent");
    },
    login: async function () {
      let params = {
        account: this.account,
        password: this.password
      }
      let resp = await axios.post("/api/login/", params);
      let user = resp.data.user;
      this.snackbar = true;
      if (user.uid) {
        this.message = "登陆成功";
        this.loginSignUpShow = 0;
        localStorage.setItem("user_id", user.uid);
        localStorage.setItem("nickname", user.nickname);
        this.welcome = "欢迎你，" + user.nickname;
        this.logined = true;
      } else {
        this.message = "登陆失败，请重试";
        this.account = "";
        this.password = "";
      }
    },
    signUp: async function () {
      let params = {
        account: this.account,
        nickname: this.nickname,
        password: this.password,
        email: this.email
      }
      let resp = await axios.post("/api/sign-up/", params);
      let user = resp.data.user;
      this.snackbar = true;
      if (user && user.uid) {
        this.message = "注册成功";
        this.loginSignUpShow = 0;
        localStorage.setItem("user_id", user.uid);
        localStorage.setItem("nickname", this.nickname);
        this.welcome = "欢迎你，" + this.nickname;
        this.logined = true;
      } else {
        this.message = "注册失败，信息：" + resp.data.message;
        this.account = "";
        this.email = "";
      }
    }
  },
  created: async function () {
    this.logined = localStorage.getItem('user_id');
    let nickname = localStorage.getItem('nickname')
    if (nickname) {
      this.welcome = "欢迎你，" + nickname;
    }

  },
  computed: {}
};
</script>

<style>
#js-toolbar {
  position: fixed;
  z-index: 100;
  left: 0;
  top: 0;
}
</style>
