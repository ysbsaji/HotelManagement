<template>
  <div>
    <form ref="empForm">
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="6" md="4">
            <v-text-field outlined dense label="Name"/>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field outlined dense type="email" label="Email"/>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field outlined dense type="number" label="Phone Number"/>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" sm="6" md="4">
            <v-select :items="role" outlined dense label="Role"></v-select>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field outlined dense type="password" label="Password"/>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field outlined dense label="Image"/>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-row>
          <v-col class="text-center">
            <v-btn text>
              Cancel
            </v-btn>
            <v-btn type="submit" class="mx-3" color="#EF5350" >
              Save
            </v-btn>
             <v-btn type="submit" class="mx-3" color="#EF5350" >
              Update
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </form>
    <table-data :data="employeeDetails"/>
  </div>
</template>

<script>
import TableData from '../../components/TableData.vue'
export default {
  components: { TableData },
  data () {
    return {
      role: [ 'Manager', 'Staff' ],
      employeeDetails: {
        headers: [
          { text: 'Id', value: 'id' }, { text: 'Name', value: 'name' }, { text: 'Email', value: 'email' }, { text: 'Phone Number', value: 'phoneNumber' }, { text: 'Role', value: 'role' }, { text: 'Password', value: 'password' }, { text: 'Actions', value: 'actions'}
        ],
        list: [ { id: 9}],
        actionsList:[{
            click: (item) => this.edit(item),
            icon:'mdi-pencil'
          },{
            click: (item) => this.del(item),
            icon:'mdi-delete'
          }]
      }
    }
  }
}
</script>

<style>

</style>