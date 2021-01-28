<template>
  <div>
    <v-banner
      color="red"
      style="border-radius: 3px"
      class="my-3 ma-2"
    ><h3>Cafeteria Staff Assign</h3></v-banner>
    <form ref="cafeAllocationForm" class="my-6 pa-4">
      <v-row>
        <v-col cols="3">
          <v-select :items="orderedFoodList" item-text="tableNumber" v-model="cafeAllocationDetails.id" :disabled="selectCustomer" item-value="id" outlined dense label="Customer"></v-select>
        </v-col>
        <v-col cols="3">
          <v-select :items="employeeDetails" item-text="name" item-value="id" v-model="cafeAllocationDetails.employeeId" outlined dense label="Employee"></v-select>
        </v-col>
         <v-col cols="3">
          <v-select :items="status" item-text="name" item-value="id" v-model="cafeAllocationDetails.status" outlined dense label="Status"></v-select>
        </v-col>
        <v-col cols="3">
          <v-btn class="mx-3" color="#EF5350" @click="saveAllocateStaffForOrder">Save</v-btn>
          <v-btn class="mx-3" color="#EF5350" @click="updateAllocateStaffForOrder">Update</v-btn>
        </v-col>
      </v-row>
    </form>
    <table-data :data="foodDetails" class="my-3 pa-3"/>
  </div>
</template>

<script>
import TableData from '../../components/TableData.vue'
export default {
  components: { TableData },
  data () {
    return {
      status: ['Ordered', 'Got Ready', 'Deliverd'],
      updateDetail: {},
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
      },
    }
  },
  mounted () {
    this.getDetails()
  },
  methods: {
    async getDetails () {
      let orderedDetails = await this.getDetailsFromApi('https://traineesapi.firebaseio.com/orderedFoodDetails.json')
      if (orderedDetails) this.orderedFoodList = this.getArrayObjFromObjList(orderedDetails)
      let empDetails = await this.getDetailsFromApi('https://traineesapi.firebaseio.com/employeeDetails.json')
      this.employeeDetails = this.getArrayObjFromObjList(empDetails)
      let allocationDetails = await this.getDetailsFromApi('https://traineesapi.firebaseio.com/cafeOrderAllocation.json')
      for(let i in allocationDetails){
        allocationDetails[i].forEach(val =>{ 
          val.orderId = i
          this.foodDetails.list.push(val) 
        })
      }
    },
    async saveAllocateStaffForOrder () {
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
    },
    updateAllocateStaffForOrder () {
      this.updateDetail
      let empDetails = {}
      let data = []
      this.employeeDetails.forEach(val => {
        val.id === this.cafeAllocationDetails.employeeId ? empDetails = Object.assign({}, val) : false
      })
      this.foodDetails.list.forEach(val => {
        val.orderId === this.updateDetail.orderId ? (val.employeeId = empDetails.id, val.empName = empDetails.name, val.status = this.cafeAllocationDetails.status, data.push(val)) : false
      })
      this.updateDetailsToApi('https://traineesapi.firebaseio.com/cafeOrderAllocation/' + this.updateDetail.orderId + '.json', data)
    },
    editAllocateStaffForOrder (details) {
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
        let details1 = await this.getDetailsFromApi('https://traineesapi.firebaseio.com/cafeteriaDetails/' + details.tableId + '.json')
        details1.bookingStatus = data
        await this.updateDetailsToApi('https://traineesapi.firebaseio.com/cafeteriaDetails/' + details.tableId  + '.json', details1)
      })
    }
  },
  beforeDestroy () {
    this.$root.$off('statusChange')
  }
}
</script>

<style>

</style>