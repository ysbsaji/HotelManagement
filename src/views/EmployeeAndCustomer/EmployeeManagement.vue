<template>
  <div>
    <form ref="empForm" lazy-validation>
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="6" md="4">
            <v-text-field outlined dense label="Name" v-model="empFormDetails.name" :rules="requiredValidation"/>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field outlined dense type="email" label="Email" v-model="empFormDetails.email" :rules="requiredValidation"/>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field outlined dense type="number" label="Phone Number" v-model="empFormDetails.phoneNumber" :rules="requiredValidation"/>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" sm="6" md="4">
            <v-select :items="role" outlined dense label="Role" v-model="empFormDetails.role" :rules="requiredValidation"></v-select>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field outlined dense type="password" label="Password" v-model="empFormDetails.password" :rules="requiredValidation"/>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-file-input outlined show-size counter multiple dense label="SelectImage" v-model="empFormDetails.file" @change="getImageUrl(empFormDetails.file[0])" :rules="requiredValidation"/>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-row>
          <v-col class="text-center">
            <v-btn text>
              Cancel
            </v-btn>
            <v-btn class="mx-3" color="#EF5350" @click="saveEmpFromDetails">
              Save
            </v-btn>
             <v-btn class="mx-3" color="#EF5350" >
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
      empFormDetails: {},
      employeeDetails: {
        headers: [
          { text: 'Name', value: 'name' }, { text: 'Email', value: 'email' }, { text: 'Phone Number', value: 'phoneNumber' }, { text: 'Role', value: 'role' }, { text: 'Password', value: 'password' }, { text: 'Image', value: 'image' }, { text: 'Actions', value: 'actions'}
        ],
        list: [],
        actionsList:[{
          click: (item) => this.edit(item),
          icon:'mdi-pencil'
        },{
          click: (item) => this.del(item),
          icon:'mdi-delete'
        }]
      }
    }
  },
  methods: {
    saveEmpFromDetails(){
      console.log(typeof this.$refs);
      this.$refs.empForm.reset()
      // this.postDetailsToApi('https://traineesapi.firebaseio.com/employeeDetails.json',this.empFormDetails)
      // this.getTableDetails()
    },
    async getTableDetails(){
      let empDetails = await this.getDetailsFromApi('https://traineesapi.firebaseio.com/employeeDetails.json')
      this.employeeDetails.list = this.getArrayObjFromObjList(empDetails)
    },
    getImageUrl(file){
      if(file){
        var reader = new FileReader();
        reader.addEventListener('load', (e) => {
          this.empFormDetails.image = e.target.result
        })
        reader.readAsDataURL(file)
      }
    }
  },
  mounted () {
    this.getTableDetails()
  }
}
</script>

<style>

</style>