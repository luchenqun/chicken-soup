<template>
  <v-app id="app">
    <head-toolbar />
    <router-view />
    <bottom-navigation />
  </v-app>
</template>
<script>
import BottomNavigation from "@/components/BottomNavigation.vue";
import HeadToolbar from "@/components/HeadToolbar.vue";
export default {
  data: () => ({}),
  computed: {},
  components: {
    BottomNavigation,
    HeadToolbar
  }
};
</script>

<style>
</style>
