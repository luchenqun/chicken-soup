<template>
  <v-card height="56px" id="js-bottom-navigation">
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
</template>

<script>
export default {
  data: () => ({
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
#js-bottom-navigation {
  width: 100%;
  z-index: 200;
  position: fixed;
  width: 100%;
  bottom: 0;
}
</style>
