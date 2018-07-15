<template>
  <v-toolbar dark color="primary" id="js-toolbar" height="56">
    <v-toolbar-side-icon @click="updateLeftNav()"></v-toolbar-side-icon>
    <v-toolbar-title class="white--text">鸡汤毒汤段子网</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn icon>
      <v-icon>search</v-icon>
    </v-btn>
    <v-btn icon @click="updateContent()">
      <v-icon>sync</v-icon>
    </v-btn>
  </v-toolbar>
</template>


<script>
import bus from "../eventBus.js";
export default {
  data: () => ({
    leftNav: false
  }),
  methods: {
    updateLeftNav: function() {
      this.leftNav = !this.leftNav;
      bus.$emit("updateLeftNav", this.leftNav);
    },
    updateContent: function() {
      bus.$emit("updateContent");
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
