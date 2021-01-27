<template>
  <v-app>
    <v-navigation-drawer app v-model="drawer" v-if="['RoomsManagement', 'EmployeeManagement', 'CustomerManagement', 'CafeteriaManagement', 'RoomStaffAssign', 'CafeteriaStaffAssign'].includes($route.name)">
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
       <v-list-group :value="false"  prepend-icon="mdi-cog-outline">
          <template v-slot:activator>
            <v-list-item-title>Settings</v-list-item-title>
          </template>
            <v-list-item  v-for="(item) in settingsItems" :key="item.title" :to="item.link">
              <v-list-item-icon><v-icon v-text="item.icon"></v-icon></v-list-item-icon>
              <v-list-item-content><v-list-item-title v-text="item.title"></v-list-item-title></v-list-item-content>
          </v-list-item>
        </v-list-group>
    </v-navigation-drawer>

    <v-app-bar app color="#e74c3c" v-if="['RoomsManagement', 'EmployeeManagement', 'CustomerManagement', 'CafeteriaManagement', 'RoomStaffAssign', 'CafeteriaStaffAssign'].includes($route.name)">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
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
      drawer: false,
      navigationListItems: [
        { title: 'RoomsAllocation', icon: 'mdi-home-outline', link:'/roomstaffassign' }, { title: 'CafetetriaAllocation', icon: 'mdi-home-export-outline', link:'/cafeteriastaffassign' }
      ],
      settingsItems: [
        { title: 'Rooms', icon: 'mdi-home-outline', link:'/roomsmanagement' },{ title: 'Cafeteria', icon: 'mdi-home-export-outline', link:'/cafeteriamanagement' },
        { title: 'Employee', icon: 'mdi-account-supervisor', link:'/employeemanagement' }
      ]
    }
    //{ title: 'Cutomer', icon: 'mdi-account-outline', link:'/customermanagement' }
  },
  computed: {
    deleteDialog () {
      return this.$store.state.showDelDialog
    }
  },
  methods: {
    delRecordsFromApi(){
      this.deleteDetailsFromApi(this.$store.state.delDetails.url)
      this.$store.commit('hideDelDialog', false)
    }
  },
  mounted () {
    //
  }
}
</script>

<style>

</style>