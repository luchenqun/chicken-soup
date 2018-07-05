<template>
  <v-app id="app">
    <v-toolbar dark color="primary">
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

    <v-content style="background-color:#E0E0E0;">
      <v-container fluid style="padding:8px;">
        <v-content style="height:80px;">
          <div style="width:80px;height:80px;float:left">
            <v-avatar size="80" color="grey lighten-4">
              <img src="./assets/avatar.jpg" alt="avatar">
            </v-avatar>
          </div>
          <div style="margin-left:80px;height:80px;">
            <p class="text-md-center">Center align on medium viewport sizes</p>
            <p class="text-md-center">Center align on medium viewport sizes</p>
            <p class="text-md-center">Center align on medium viewport sizes</p>
            <p class="text-md-center">Center align on medium viewport sizes</p>
          </div>
        </v-content>
      </v-container>
    </v-content>
    <v-footer dark height="auto">
      <v-card class="flex" flat tile>
        <v-card-title class="teal">
          <strong class="subheading">Get connected with us on social networks!</strong>
          <v-spacer></v-spacer>
          <v-btn v-for="icon in icons" :key="icon" class="mx-3" dark icon>
            <v-icon size="24px">{{ icon }}</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-actions class="grey darken-3 justify-center">
          &copy;2018 —
          <strong>Vuetify</strong>
        </v-card-actions>
      </v-card>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    icons: ["fab fa-facebook", "fab fa-twitter", "fab fa-google-plus", "fab fa-linkedin", "fab fa-instagram"]
  })
};
</script>

<style>
</style>
