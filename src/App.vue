<template>
  <v-app>
    <v-navigation-drawer app v-model="drawer" v-if="['Customer', 'RoomsManagement', 'EmployeeManagement', 'CustomerManagement', 'CafeteriaManagement', 'RoomStaffAssign', 'CafeteriaStaffAssign'].includes($route.name)">
      <img class="mx-3 my-3" src="@/assets/logo-hotel.png" alt="" width="90%">
      <v-divider></v-divider>
      <v-list color="mt-6" dense nav v-if="['Manager', 'Staff'].includes(userDetails.role)">
        <v-list-item v-for="item in navigationListItems" :key="item.title" :to="item.link">
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
          </v-list-item>
      </v-list>
      <v-list color="mt-6" dense nav v-if="!['Manager', 'Staff'].includes(userDetails.role)" @click="$router.push('/cafeteriapage')">
        <v-list-item to="/cafeteriapage">
          <v-list-item-icon><v-icon>mdi-home-export-outline</v-icon></v-list-item-icon>
          <v-list-item-content><v-list-item-title></v-list-item-title>Cafeteria</v-list-item-content>
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

    <v-app-bar elevation="0" app color="#e74c3c" v-if="['Customer', 'RoomsManagement', 'EmployeeManagement', 'CustomerManagement', 'CafeteriaManagement', 'RoomStaffAssign', 'CafeteriaStaffAssign'].includes($route.name)">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      {{ userDetails.name }}  {{ userDetails.role }}
      <v-spacer></v-spacer>
      <v-tooltip bottom>
      <template v-slot:activator="{ on }">
      <v-avatar size="56" v-on="on" @click="logout"><v-icon>mdi-logout</v-icon></v-avatar>
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
      <v-dialog v-model="getDelDialog" persistent max-width="500">
        <v-card>
          <v-card-title class="headline">
            Are you sure want to delete ?
          </v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="delRecordsFromApi" :loading="btnLoading">Yes</v-btn>
            <v-btn color="green darken-1" text @click="$store.commit('hideDelDialog', false)">No</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
    <v-dialog v-model="imgDialog" width="800">
      <v-img :src="$store.state.image" width="100%" contain></v-img>
    </v-dialog>
  </v-app>
</template>

<script>
import VueCookies from 'vue-cookies'
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      userDetails: null,
      drawer: true,
      navigationListItems: [
        { title: 'RoomsAllocation', icon: 'mdi-home-outline', link:'/roomspage/' }, { title: 'CafetetriaAllocation', icon: 'mdi-home-export-outline', link:'/cafeteriastaffassign' }
      ],
      settingsItems: [
        { title: 'Rooms', icon: 'mdi-home-outline', link:'/roomspage/roomsmanagement' },{ title: 'Cafeteria', icon: 'mdi-home-export-outline', link:'/cafeteriamanagement' },
        { title: 'Employee', icon: 'mdi-account-supervisor', link:'/employeemanagement' }
      ]
    }
  },
  computed: {
    ...mapGetters(['getDelDialog']),
    imgDialog: {
      get () {
        return this.$store.state.imgDialog
      },
      set (value) {
        this.$store.commit('imgDialog', value)
      }
    }
  },
  methods: {
    async delRecordsFromApi () {
      this.btnLoading = true
      await this.deleteDetailsFromApi(this.$store.state.delDetails.url)
      this.$store.commit('hideDelDialog', false)
      this.btnLoading = false
    },
    logout () {
      this.$router.push('/signuppage')
      VueCookies.remove('activeUserDetails')
    },
    getAuthUserDetails () {
      this.userDetails = VueCookies.get('activeUserDetails')
      this.$store.dispatch('userRoleChange', this.userDetails)
      if (this.$route.name !== 'HomePage') !VueCookies.get('activeUserDetails') ? this.$router.push('/signuppage') : false
    }
  },
  mounted () {
    // this.$store.commit('change', 'britto')
    // console.log(this.$store.state.test.name)
    this.getAuthUserDetails()
    this.$root.$on('getUserDetails', () => {
      this.getAuthUserDetails()
    })
  },
  beforeDestroy () {
    this.$root.$off('getUserDetails')
  }
}
</script>

<style>

</style>