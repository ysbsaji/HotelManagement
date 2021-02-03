<template>
  <div>
    <v-banner
      color="red"
      style="border-radius: 3px"
      class="my-3 ma-2"
    ><h3>Cafeteria Allocation Management</h3></v-banner>
    <v-form ref="cafeAllocationForm" class="my-6 pa-4" v-if="$store.state.userDetails.role === 'Manager'">
      <v-row>
        <v-col cols="3">
          <v-select :items="orderedFoodList" item-text="tableNumber" v-model="cafeAllocationDetails.id" :disabled="selectCustomer" :rules="requiredValidation" item-value="id" outlined dense label="Customer"></v-select>
        </v-col>
        <v-col cols="3">
          <v-select :items="employeeDetails" item-text="name" item-value="id" v-model="cafeAllocationDetails.employeeId" :rules="requiredValidation" outlined dense label="Employee"></v-select>
        </v-col>
          <v-col cols="3">
          <v-select :items="status" item-text="name" item-value="id" v-model="cafeAllocationDetails.status" :rules="requiredValidation" outlined dense label="Status"></v-select>
        </v-col>
        <v-col cols="3">
          <v-btn text @click="selectCustomer = false; saveBtn = true; updateBtn = false; $refs.cafeAllocationForm.reset()">Cancel</v-btn>
          <v-btn class="mx-3" color="#EF5350" v-show="saveBtn" @click="saveAllocateStaffForOrder">Save</v-btn>
          <v-btn class="mx-3" color="#EF5350" v-show="updateBtn" @click="updateAllocateStaffForOrder">Update</v-btn>
        </v-col>
      </v-row>
    </v-form>
    <h3 class="ml-3">Staff Assigned Tables</h3>
    <table-data :data="foodDetails" class="my-3 pa-3"/>
    <v-row class="pa-3">
      <v-col>
        <v-card height="100%">
          <v-card-title>
            Booked Tables
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text v-for="(item, index) in bookedTableDetails" :key="index">
            <b>{{ item.tableNumber }}</b>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col>
        <v-card height="100%">
          <v-card-title>
            Non Booked Tables
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text v-for="(item, index) in NonBookedTableDetails" :key="index">
            <b>{{ item.tableNumber }}</b>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
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
      status: ['Ordered', 'Got Ready', 'Deliverd'],
      updateDetail: {},
      bookedTableDetails: [],
      NonBookedTableDetails: [],
      selectCustomer: false,
      cafeAllocationDetails: {},
      orderedFoodList : [],
      employeeDetails: [],
      foodDetails: {
        headers: [
          { text: 'Table Number', value: 'tableNumber' }, { text: 'Food', value: 'foodName' }, { text: 'Quantity', value: 'quantity' }, { text: 'Price', value: 'price' }, { text: 'Employee Name', value: 'empName' }, { text: 'Food Status', value: 'status' }, { text: 'Actions', value: 'actions'}
        ],
        list: [],
        actionsList:[{
          click: (item) => this.editAllocateStaffForOrder(item),
          icon:'mdi-pencil'
        },{
          click: (item) => this.delAllocateStaffForOrder(item),
          icon:'mdi-delete'
        }]
      }
    }
  },
  mounted () {
    this.getDetails()
  },
  methods: {
    async getDetails () {
      if (this.$store.state.userDetails.role !== 'Manager') this.foodDetails.headers = [{ text: 'Table Number', value: 'tableNumber' }, { text: 'Food', value: 'foodName' }, { text: 'Quantity', value: 'quantity' }, { text: 'Price', value: 'price' }, { text: 'Employee Name', value: 'empName' }, { text: 'Food Status', value: 'status' }]
      let orderedDetails = await this.getDetailsFromApi('https://traineesapi.firebaseio.com/orderedFoodDetails.json')
      if (orderedDetails) this.orderedFoodList = this.getArrayObjFromObjList(orderedDetails)
      let empDetails = await this.getDetailsFromApi('https://traineesapi.firebaseio.com/employeeDetails.json')
      if (empDetails) this.employeeDetails = this.getArrayObjFromObjList(empDetails)
      let allocationDetails = await this.getDetailsFromApi('https://traineesapi.firebaseio.com/cafeOrderAllocation.json')
      if (allocationDetails) {
        for(let i in allocationDetails){
          allocationDetails[i].forEach(val =>{
            val.orderId = i 
            if (this.$store.state.userDetails.role === 'Manager') {
              this.foodDetails.list.push(val) 
            }else {
              this.$store.state.userDetails.name === val.empName ? this.foodDetails.list.push(val) : false
            }
          })
        }
      }
      let orderList = await this.getDetailsFromApi('https://traineesapi.firebaseio.com/orderedListDetails.json')
      if (orderList) this.bookedTableDetails = this.getArrayObjFromObjList(orderList)
      let tableDetails = await this.getDetailsFromApi('https://traineesapi.firebaseio.com/cafeteriaDetails.json')
      if (tableDetails) var totalTable = this.getArrayObjFromObjList(tableDetails)
      if (this.bookedTableDetails.length > 0) {
        totalTable.forEach(value => {
          if (!value.bookingStatus) this.NonBookedTableDetails.push(value)
        })
      }else { this.NonBookedTableDetails = totalTable }
    },
    async saveAllocateStaffForOrder () {
      if (this.$refs.cafeAllocationForm.validate()){
        let orderedDetails = {}
        let empDetails = {}
        this.orderedFoodList.forEach(val => {
          val.id === this.cafeAllocationDetails.id ?  orderedDetails = Object.assign({}, val): false
        })
        this.employeeDetails.forEach(val => {
          val.id === this.cafeAllocationDetails.employeeId ? empDetails = Object.assign({}, val) : false
        })
        let tableId = orderedDetails.tableId
        let tableNumber = orderedDetails.tableNumber
        delete orderedDetails.tableId
        delete orderedDetails.tableNumber
        delete orderedDetails.id
        for(let i in orderedDetails){
          orderedDetails[i].tableNumber = tableNumber
          orderedDetails[i].tableId = tableId
          orderedDetails[i].empName = empDetails.name
          orderedDetails[i].employeeId = empDetails.id
          orderedDetails[i].status = this.cafeAllocationDetails.status
          this.foodDetails.list.push(orderedDetails[i])
        }
        await this.postDetailsToApi('https://traineesapi.firebaseio.com/cafeOrderAllocation.json',orderedDetails)
        await this.deleteDetailsFromApi('https://traineesapi.firebaseio.com/orderedFoodDetails/' + this.cafeAllocationDetails.id + '.json')
        this.orderedFoodList.find((val,index) => {val.id === this.cafeAllocationDetails.id ? this.orderedFoodList.splice(index,1) : false})
        let orderList = await this.getDetailsFromApi('https://traineesapi.firebaseio.com/orderedListDetails.json')
        if (orderList) this.bookedTableDetails = this.getArrayObjFromObjList(orderList)
        this.$refs.cafeAllocationForm.reset()
      }
    },
    updateAllocateStaffForOrder () {
      this.saveBtn = true
      this.updateBtn = false
      let empDetails = {}
      let data = []
      this.employeeDetails.forEach(val => {
        val.id === this.cafeAllocationDetails.employeeId ? empDetails = Object.assign({}, val) : false
      })
      this.foodDetails.list.forEach((val) => {
        val.tableId === this.updateDetail.tableId ? (val.employeeId = empDetails.id, val.empName = empDetails.name, val.status = this.cafeAllocationDetails.status, data.push(val)) : false
      })
      if (this.updateDetail.orderId) this.updateDetailsToApi('https://traineesapi.firebaseio.com/cafeOrderAllocation/' + this.updateDetail.orderId + '.json', data)
      this.$refs.cafeAllocationForm.reset()
    },
    editAllocateStaffForOrder (details) {
      this.saveBtn = false
      this.updateBtn = true
      this.updateDetail = details
      this.cafeAllocationDetails.employeeId = details.employeeId
      this.cafeAllocationDetails.status = details.status
      this.selectCustomer = true
    },
    delAllocateStaffForOrder (details) {
      details.title = 'cafeStaff'
      details.url = 'https://traineesapi.firebaseio.com/cafeOrderAllocation/' + details.orderId + '.json'
      this.$store.commit('showDelDialog', details)
      this.$root.$on('statusChange', async (data) => {
        this.foodDetails.list.forEach((val, index) => {
          val.tableId === details.tableId ? this.foodDetails.list.splice(index,1) : false
        })
        this.bookedTableDetails.forEach((val, index) =>{
          if (val.tableId === details.tableId) this.deleteDetailsFromApi('https://traineesapi.firebaseio.com/orderedListDetails/' + val.id + '.json'), this.bookedTableDetails.splice(index,1)
        })
        let details1 = await this.getDetailsFromApi('https://traineesapi.firebaseio.com/cafeteriaDetails/' + details.tableId + '.json')
        details1.bookingStatus = data
        await this.updateDetailsToApi('https://traineesapi.firebaseio.com/cafeteriaDetails/' + details.tableId  + '.json', details1)
      })
    },
  },
  beforeDestroy () {
    this.$root.$off('statusChange')
  }
}
</script>

<style>

</style>