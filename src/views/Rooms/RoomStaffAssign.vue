<template>
  <div>
    <form ref="roomAllocationForm" class="my-6 pa-4">
      <v-row>
        <v-col cols="4">
          <v-select :items="customerDetails" item-text="name" v-model="roomAllocationDetails.customerId" item-value="id" outlined dense label="Customer"></v-select>
        </v-col>
        <v-col cols="4">
          <v-select :items="employeeDetails" item-text="name" item-value="id" v-model="roomAllocationDetails.employeeId" outlined dense label="Employee"></v-select>
        </v-col>
        <v-col cols="4">
          <v-btn class="mx-3" color="#EF5350" @click="allocateStaffToRoom">Save</v-btn>
        </v-col>
      </v-row>
    </form>
    <table-data :data="RoomsDetails"/>
  </div>
</template>

<script>
import TableData from '../../components/TableData.vue'
export default {
  components: { TableData },
  data () {
    return {
      roomAllocationDetails: {},
      customerDetails: [],
      employeeDetails: [],
      RoomsDetails: {
        headers: [
          { text: 'Customer Name', value: 'name' }, { text: 'Contact Number', value: 'contactNumber' }, { text: 'Room Number', value: 'roomNumber' }, { text: 'Employee Name', value: 'empName' }, { text: 'Actions', value: 'actions'}
        ],
        list: [],
        actionsList:[{
            click: (item) => this.edit(item),
            icon:'mdi-pencil'
          },{
            click: (item) => this.del(item),
            icon:'mdi-delete'
          }]
      },
    }
  },
  mounted () {
    this.getDetailOfBookingRooms()
  },
  methods: {
    async allocateStaffToRoom(){
      let cusDetails = {}
      let empDetails = {}
      this.customerDetails.forEach(val => {
        val.id === this.roomAllocationDetails.customerId ?  cusDetails = Object.assign({}, val): false
      })
      this.employeeDetails.forEach(val => {
        val.id === this.roomAllocationDetails.employeeId ? empDetails = Object.assign({}, val) : false
      })
      delete cusDetails.id
      cusDetails.empName = empDetails.name
      cusDetails.employeeId = empDetails.id
      await this.postDetailsToApi('https://traineesapi.firebaseio.com/roomAllocation.json',cusDetails)
      let allocationDetails = await this.getDetailsFromApi('https://traineesapi.firebaseio.com/roomAllocation.json')
      this.RoomsDetails.list = this.getArrayObjFromObjList(allocationDetails)
      await this.deleteDetailsFromApi('https://traineesapi.firebaseio.com/bookedrooms/' + this.roomAllocationDetails.customerId + '.json')
    },
    async getDetailOfBookingRooms(){
      let cusDetails = await this.getDetailsFromApi('https://traineesapi.firebaseio.com/bookedrooms.json')
      if (cusDetails) {
        for(let i in cusDetails){
          delete cusDetails[i].id
        }
        this.customerDetails = this.getArrayObjFromObjList(cusDetails)  
      }
      let empDetails = await this.getDetailsFromApi('https://traineesapi.firebaseio.com/employeeDetails.json')
      this.employeeDetails = this.getArrayObjFromObjList(empDetails)
      let allocationDetails = await this.getDetailsFromApi('https://traineesapi.firebaseio.com/roomAllocation.json')
      this.RoomsDetails.list = this.getArrayObjFromObjList(allocationDetails)
    }
  }
}
</script>

<style>

</style>