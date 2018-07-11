<template>
  <v-card height="56px" id="js-bottom-navigation">
    <v-bottom-nav :active.sync="defaultSelect" :color="bottomBarArray[defaultSelect].color" :value="true" absolute shift>
      <v-btn dark v-for="(item, index) in bottomBarArray" :key="index" @click="clickItem(index, item.path)">
        <span>{{item.title}}</span>
        <v-icon>{{item.icon}}</v-icon>
      </v-btn>
    </v-bottom-nav>
  </v-card>
</template>

<script>
import bus from "../eventBus.js";
export default {
  data: () => ({
    defaultSelect: 0,
    bottomBarArray: [
      {
        icon: "add",
        color: "blue-grey",
        title: "新增",
        path: "tags"
      },
      {
        icon: "arrow_back",
        color: "teal",
        title: "上一条",
        path: "note"
      },
      {
        icon: "sync",
        color: "brown",
        title: "随机",
        path: "add"
      },
      {
        icon: "arrow_forward",
        color: "indigo",
        title: "下一条",
        path: "setting"
      },
      {
        icon: "person",
        color: "green",
        title: "个人",
        path: "setting"
      }
    ]
  }),
  methods: {
    clickItem(index, path) {
      this.defaultSelect = index;
      this.$router.push({ path: path });
    }
  },
  beforeMount() {
    bus.$on("router", path => {
      this.defaultSelect = -1;
      this.bottomBarArray.forEach((item, index) => {
        if (item.path === path) {
          this.defaultSelect = index;
        }
      });
    });
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
