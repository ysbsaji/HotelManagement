<template>
  <v-app>
    <v-navigation-drawer app v-if="false">
      <!-- -->
    </v-navigation-drawer>

    <v-app-bar app color="primary" v-if="false">
      <!-- -->
    </v-app-bar>

    <!-- Sizes your content based upon application components -->
    <v-main>
			<!-- Provides the application the proper gutter -->
			<v-container fluid>

			<!-- If using vue-router -->
			<router-view style="padding:0%"></router-view>
			</v-container>
    </v-main>

    <v-footer v-if="false" app>
      <!-- -->
    </v-footer>
  </v-app>
</template>

<script>
export default {

}
</script>

<style>

</style>