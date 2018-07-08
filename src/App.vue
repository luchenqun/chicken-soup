<template>
  <v-app id="app">
    <v-toolbar dark color="primary" id="js-toolbar" height="56">
      <v-toolbar-side-icon></v-toolbar-side-icon>
      <v-toolbar-title class="white--text">Title</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>search</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>apps</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>refresh</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>more_vert</v-icon>
      </v-btn>
    </v-toolbar>

    <v-content style="background-color:#fff;margin: auto;">
      <v-content style="max-width:600px;margin:60px 0px;">
        <v-container fluid style="padding:8px 8px 0px 8px;">
          <v-content page style="height:80px;margin: auto;">
            <div style="width:80px;height:80px;float:left">
              <v-avatar size="80" color="grey lighten-4">
                <img src="./assets/avatar.jpg" alt="avatar">
              </v-avatar>
            </div>
            <div style="margin-left:90px;height:80px;">
              <v-content fluid>
                <v-layout row wrap>
                  <v-flex xs12 style="height:30px;">
                    <p class="text-sm-left" style="font-size:20px;">匿名</p>
                  </v-flex>
                  <v-flex xs12 style="height:25px;">
                    <p class="text-sm-left" style="font-size:15px;">第 70234 号会员，加入于3月前</p>
                  </v-flex>
                  <v-flex xs12 style="height:25px;">
                    <p class="text-sm-left" style="font-size:15px;">发表10条，被收藏100次</p>
                  </v-flex>
                </v-layout>
              </v-content>
            </div>
          </v-content>
        </v-container>
        <v-container fluid style="padding:8px 8px 0px 8px;;">
          <span class="subheading">Lorem Lorem Lorem Lorem Lorem ipsum dolor sit amet, pri veniam forensibus id. Vis maluisset molestiae id, ad semper lobortis cum. At impetus detraxit incorrupte usu, repudiare assueverit ex eum, ne nam essent vocent admodum.</span>
        </v-container>
        <v-container fluid style="padding:8px 8px 0px 8px;text-align: center;" v-if="true">
          <img src="./assets/t.jpg" style="max-width: 100%;height: auto;" />
        </v-container>
        <v-container fluid style="padding:8px 8px 0px 8px;height:25px">
          <v-layout row wrap>
            <v-flex xs3>
              <p class="text-sm-left">浏览 100 次</p>
            </v-flex>
            <v-flex xs3>
            </v-flex>
            <v-flex xs6>
              <v-layout align-center justify-space-around>
                <v-icon small>fas fa-lock</v-icon>
                <v-icon small>fas fa-search</v-icon>
                <v-icon small>fas fa-list</v-icon>
                <v-icon small>fas fa-edit</v-icon>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-container>
        <v-container fluid style="padding:3px 8px 0px 8px;">
          <p class="text-sm-left" style="margin:0px">
            <v-icon small style="margin:0px 5px 0px 0px">favorite</v-icon>會飛啲魚♂、绿血贵族@安浪科技、-仅此而已、老男人-80后的大叔、一叶知秋、pangwen、战胜自我、百事逍遥子、池毓兴、*^O^*天然呆、云晴岚雷雾雨、贝铃·Turing、ZEROD、東升、Bell、Setsuna(:;(∩´﹏`∩);:)、老实的胖子、只有神知道的世界、猫的树、雨淅沥沥的下等27人收藏</p>
        </v-container>
        <v-container fluid style="padding:0px 8px 0px 0px;">
          <v-container fluid style="padding:8px 8px 0px 8px;">
            <v-content page style="margin: 0px;">
              <div style="width:40px;height:40px;float:left">
                <v-avatar size="40" color="grey lighten-4">
                  <img src="./assets/avatar.jpg" alt="avatar">
                </v-avatar>
              </div>
              <div style="margin-left:50px;">
                <p class="text-sm-left" style="margin:0px">泥巴 : “老板，我在公司干了5年了，对公司没有功劳也有苦劳，为什么大家都加工资了，我的工资还是2500？是不是应该给我加点工资呢？” “小王啊，你对公司的付出我是看在眼里的，我也觉得挺对不住你的，这样吧，从这个月工资给你涨到8000，你觉得怎么样？” 老板话说完笑呵呵的看着我，然后我也笑了，顺便放下了手里的大砍刀。</p>
                <p style="margin-bottom:5px">前天 19点39分</p>
              </div>
            </v-content>
            <v-content page style="margin: 0px;">
              <div style="width:40px;height:40px;float:left">
                <v-avatar size="40" color="grey lighten-4">
                  <img src="./assets/t.jpg" alt="avatar">
                </v-avatar>
              </div>
              <div style="margin-left:50px;">
                <p class="text-sm-left" style="margin:0px">會飛啲魚♂ : 天天的不好好上班，净看这些洗脑的段子，告诉我哪里看的，我也要看</p>
                <p style="margin-bottom:5px">今天 12点30分</p>
              </div>
            </v-content>
          </v-container>
          <v-container fluid>
            <v-divider></v-divider>
            <v-textarea color="teal" clearable hide-details maxlength="120">
              <div slot="label">评论</div>
            </v-textarea>
            <v-layout row wrap style="margin-top:6px;">
              <v-flex xs6>
                <v-btn flat icon color="primary" style="margin-top:0px;margin-left:0px;">
                  <v-icon>sentiment_satisfied_alt</v-icon>
                </v-btn>
              </v-flex>
              <v-flex xs6>
                <v-btn small color="primary" style="margin:5px 0px 0px 0px;float:right">
                  发送
                </v-btn>
              </v-flex>
            </v-layout>
          </v-container>
        </v-container>
      </v-content>
    </v-content>

    <v-card height="56px" id="js-main-btn">
      <v-bottom-nav :active.sync="bottomNav" :color="color" :value="true" absolute shift>
        <v-btn dark>
          <span>新增</span>
          <v-icon>add</v-icon>
        </v-btn>
        <v-btn dark>
          <span>上一条</span>
          <v-icon>arrow_back</v-icon>
        </v-btn>
        <v-btn dark>
          <span>随机</span>
          <v-icon>sync</v-icon>
        </v-btn>
        <v-btn dark>
          <span>下一条</span>
          <v-icon>arrow_forward</v-icon>
        </v-btn>
        <v-btn dark>
          <span>我的</span>
          <v-icon>person</v-icon>
        </v-btn>
      </v-bottom-nav>
    </v-card>

  </v-app>
</template>

<script>
export default {
  data: () => ({
    icons: ["fab fa-facebook", "fab fa-twitter", "fab fa-google-plus", "fab fa-linkedin", "fab fa-instagram"],
    favorites: ["一米阳光", "别说你怎么样。", "荒梦", "大梦平生", "浥轻尘", "砥砺前行", "　int♝＝0；", "*^O^*天然呆", "云晴岚雷雾雨", "Th.D", "宿州网站建设", "开心就好", "欲。", "不想翻身的咸鱼", "简森", "☞逸光惜晨☜"],
    praises: ["阿毛", "會飛啲魚♂", "-仅此而已", "人走茶易凉°C", "青木", "园来有你", "一叶知秋", "我不是漫游", "钟钟", "百事逍遥子", "砥砺前行", "好名字能让人印象深刻", "池毓兴", "*^O^*天然呆", "云晴岚雷雾雨", "茴香味老中医", "光属性宅男", "只有神知道的世界", "来年秋风起"],
    bottomNav: 2
  }),
  computed: {
    color() {
      switch (this.bottomNav) {
        case 0:
          return "blue-grey";
        case 1:
          return "teal";
        case 2:
          return "brown";
        case 3:
          return "indigo";
        case 4:
          return "indigo";
      }
    }
  }
};
</script>

<style>
#js-toolbar {
  position: fixed;
  z-index: 100;
  left: 0;
  top: 0;
}

#js-main-btn {
  width: 100%;
  z-index: 200;
  position: fixed;
  width: 100%;
  bottom: 0;
}
</style>
