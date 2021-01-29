<template>
  <v-app>
    <v-navigation-drawer app v-model="drawer" v-if="['RoomsManagement', 'EmployeeManagement', 'CustomerManagement', 'CafeteriaManagement', 'RoomStaffAssign', 'CafeteriaStaffAssign'].includes($route.name)">
      <img class="mx-3 my-3" src="https://cdn1.vectorstock.com/i/1000x1000/95/55/hotel-icon-summer-vacation-vector-13839555.jpg" alt="" width="90%" height="20%">
      <v-list
        color="mt-6"
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
       <v-list-group prepend-icon="mdi-cog-outline" v-if="userDetails.role == 'Manager'">
          <template v-slot:activator>
            <v-list-item-title>Settings</v-list-item-title>
          </template>
            <v-list-item  v-for="(item) in settingsItems" :key="item.title" :to="item.link">
              <v-list-item-icon><v-icon v-text="item.icon"></v-icon></v-list-item-icon>
              <v-list-item-content><v-list-item-title v-text="item.title"></v-list-item-title></v-list-item-content>
          </v-list-item>
        </v-list-group>
    </v-navigation-drawer>

    <v-app-bar elevation="0" app color="#e74c3c" v-if="['RoomsManagement', 'EmployeeManagement', 'CustomerManagement', 'CafeteriaManagement', 'RoomStaffAssign', 'CafeteriaStaffAssign'].includes($route.name)">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      {{ userDetails.name }}  {{ userDetails.role }}
      <v-spacer></v-spacer>
      <v-tooltip bottom>
      <template v-slot:activator="{ on }">
      <v-avatar
        size="56"
        v-on="on"
        @click="logout"
      > <v-icon>mdi-logout</v-icon></v-avatar>
      </template>
      <span>Log Out</span>
      </v-tooltip>
    </v-app-bar>
    <v-main>
			<v-container fluid class="pa-0">
        <router-view class="pa-0"></router-view>
			</v-container>
    </v-main>
    <v-row justify="center">
      <v-dialog
        v-model="deleteDialog"
        persistent
        max-width="500"
      >
        <v-card>
          <v-card-title class="headline">
            Are you sure want to delete ?
          </v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="green darken-1"
              text
              @click="delRecordsFromApi"
            >
              Yes
            </v-btn>
            <v-btn
              color="green darken-1"
              text
              @click="$store.commit('hideDelDialog', false)"
            >
              No
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
    <v-footer v-if="['RoomsManagement', 'EmployeeManagement', 'CustomerManagement', 'CafeteriaManagement', 'RoomStaffAssign', 'CafeteriaStaffAssign'].includes($route.name)" app>
      <!-- -->
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      userDetails: null,
      authentication: false,
      drawer: true,
      navigationListItems: [
        { title: 'RoomsAllocation', icon: 'mdi-home-outline', link:'/roomstaffassign' }, { title: 'CafetetriaAllocation', icon: 'mdi-home-export-outline', link:'/cafeteriastaffassign' }
      ],
      settingsItems: [
        { title: 'Rooms', icon: 'mdi-home-outline', link:'/roomsmanagement' },{ title: 'Cafeteria', icon: 'mdi-home-export-outline', link:'/cafeteriamanagement' },
        { title: 'Employee', icon: 'mdi-account-supervisor', link:'/employeemanagement' }
      ]
    }
  },
  computed: {
    deleteDialog () {
      return this.$store.state.showDelDialog
    }
  },
  methods: {
    delRecordsFromApi () {
      this.deleteDetailsFromApi(this.$store.state.delDetails.url)
      this.$store.commit('hideDelDialog', false)
      if(this.$store.state.delDetails.title){
        this.$root.$emit('statusChange', false)
      }
    },
    logout () {
      this.$router.push('signuppage')
      localStorage.setItem('authentication', false)
    },
    getAuthUserDetails () {
      let details = localStorage.getItem('userDetails')
      this.userDetails = JSON.parse(details)
      this.authentication = localStorage.getItem('authentication')
      !JSON.parse(this.authentication) ? this.$router.push('signuppage') : false
    }
  },
  mounted () {
    this.getAuthUserDetails()
  }
}
</script>

<style>

</style>