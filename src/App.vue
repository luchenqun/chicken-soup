<template>
  <v-app id="app">
    <head-toolbar />
    <router-view />
    <!-- <bottom-navigation /> -->
    <left-navigation />
  </v-app>
</template>
<script>
import BottomNavigation from "@/components/BottomNavigation.vue";
import HeadToolbar from "@/components/HeadToolbar.vue";
import LeftNavigation from "@/components/LeftNavigation.vue";
export default {
  data: () => ({}),
  computed: {},
  components: {
    BottomNavigation,
    HeadToolbar,
    LeftNavigation
  }
};
</script>

<style>
</style>
