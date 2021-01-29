<template>
  <div>
    <div>
    <v-banner
      color="red"
      style="border-radius: 3px"
      class="my-3 ma-2"
    ><h3>Employee Management</h3></v-banner>
    <v-form
      ref="empForm"
      lazy-validation
    >
     <v-card-text>
        <v-row>
          <v-col cols="12" sm="6" md="4">
            <v-text-field outlined dense label="Name" v-model="empFormDetails.name" :rules="requiredValidation"/>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field outlined dense type="email" label="Email" v-model="empFormDetails.email" :rules="emailValidation"/>
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
            <v-text-field outlined dense type="password" label="Password" v-model="empFormDetails.password" :rules="passwordValidation"/>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-file-input outlined show-size counter multiple dense label="SelectImage" v-model="empFormDetails.file" @change="empFormDetails.file ? getImageUrl(empFormDetails.file[0]) : false" :rules="requiredValidation"/>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-row>
          <v-col class="text-center">
            <v-btn text @click="$refs.empForm.reset(); saveBtn = true; updateBtn = false ">
              Cancel
            </v-btn>
            <v-btn class="mx-3" color="#EF5350" v-show="saveBtn" @click="saveEmpFromDetails">
              Save
            </v-btn>
             <v-btn class="mx-3" color="#EF5350" v-show="updateBtn" @click="updateEmpFromDetails" >
              Update
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-form>
    </div>
    <table-data :data="employeeDetails" class="my-3 pa-3"/>
  </div>
</template>

<script>
import TableData from '../../components/TableData.vue'
export default {
  components: { TableData },
  data () {
    return {
      saveBtn: true,
      updateBtn: false,
      role: [ 'Manager', 'Staff' ],
      empFormDetails: {},
      employeeDetails: {
        headers: [
          { text: 'Name', value: 'name' }, { text: 'Email', value: 'email' }, { text: 'Phone Number', value: 'phoneNumber' }, { text: 'Role', value: 'role' }, { text: 'Password', value: 'password' }, { text: 'Image', value: 'image' }, { text: 'Actions', value: 'actions'}
        ],
        list: [],
        actionsList: [{
          click: (item) => this.editEmpDetails(item),
          icon: 'mdi-pencil'
        },{
          click: (item) => this.delEmpDetails(item),
          icon: 'mdi-delete'
        }]
      }
    }
  },
  methods: {
    async saveEmpFromDetails () {
      if (this.$refs.empForm.validate()) {
        await this.postDetailsToApi('https://traineesapi.firebaseio.com/employeeDetails.json',this.empFormDetails)
        this.getTableDetails()
        this.$refs.empForm.reset()
      }
    },
    async getTableDetails () {
      let empDetails = await this.getDetailsFromApi('https://traineesapi.firebaseio.com/employeeDetails.json')
      if(empDetails) this.employeeDetails.list = this.getArrayObjFromObjList(empDetails)
    },
    getImageUrl (file) {
      if (file) {
        var reader = new FileReader();
        reader.addEventListener('load', (e) => {
          this.empFormDetails.image = e.target.result
        })
        reader.readAsDataURL(file)
      }
    },
    editEmpDetails (empDetails) {
      this.empFormDetails = Object.assign({}, empDetails)
      this.empFormDetails.file = [{}]
      this.saveBtn = false
      this.updateBtn = true
    },
    async updateEmpFromDetails () {
      if (this.$refs.empForm.validate()) {
        await this.updateDetailsToApi('https://traineesapi.firebaseio.com/employeeDetails/' + this.empFormDetails.id + '.json', this.empFormDetails)
        this.getTableDetails()
        this.saveBtn = true
        this.updateBtn = false
        this.$refs.empForm.reset()
      }
    },
    delEmpDetails (item) {
      item.url = 'https://traineesapi.firebaseio.com/employeeDetails/' + item.id + '.json'
      this.$store.commit('showDelDialog', item)
      this.getTableDetails()
    },
  },
  mounted () {
    this.getTableDetails()
  }
}
</script>

<style>

</style>