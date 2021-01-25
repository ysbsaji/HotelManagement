<template>
  <v-app>
    {{ $route.name }}
    <v-navigation-drawer app v-model="drawer" v-if="['RoomsManagement', 'EmployeeManagement', 'CustomerManagement', 'CafeteriaManagement'].includes($route.name)">
      <img src="https://i.pinimg.com/originals/9c/37/a1/9c37a1385c59def72e2e3b470c49b475.png" alt="" width="100%" height="20%">
      <v-list
        dense
        nav
      >
        <v-list-item
          v-for="item in navigationListItems"
          :key="item.title"
          :to="item.link"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app color="#e74c3c" v-if="['RoomsManagement', 'EmployeeManagement', 'CustomerManagement', 'CafeteriaManagement'].includes($route.name)">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      {{ $route.name }}
      <!-- -->
    </v-app-bar>

    <!-- Sizes your content based upon application components -->
    <v-main>
			<!-- Provides the application the proper gutter -->
			<v-container fluid>

			<!-- If using vue-router -->
			<router-view class="pa-0"></router-view>
			</v-container>
    </v-main>

    <v-footer v-if="['RoomsManagement', 'EmployeeManagement', 'CustomerManagement', 'CafeteriaManagement'].includes($route.name)" app>
      <!-- -->
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      drawer: false,
      navigationListItems:[
        { title: 'Rooms', icon: 'mdi-view-dashboard-outline', link:'/roomsmanagement' },{ title: 'Cafeteria', icon: 'mdi-view-dashboard-outline', link:'/cafeteriamanagement' },
        { title: 'Employee', icon: 'mdi-view-dashboard-outline', link:'/employeemanagement' },{ title: 'Cutomer', icon: 'mdi-view-dashboard-outline', link:'/customermanagement' }
      ]
    }
  },
  mounted () {
    console.log(this.$route.name);
  }
}
</script>

<style>

</style>