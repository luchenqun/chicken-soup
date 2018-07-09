<template>
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
</template>
<script>
export default {
  data: () => ({}),
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
