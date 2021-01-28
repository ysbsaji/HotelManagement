<template>
  <div>
    <v-banner
      color="red"
      style="border-radius: 3px"
      class="my-3 ma-2"
    ><h3>Rooms Staff Assign</h3></v-banner>
    <form ref="roomAllocationForm" class="my-6 pa-4">
      <v-row>
        <v-col cols="3">
          <v-select :items="customerDetails" item-text="name" v-model="roomAllocationDetails.customerId" :disabled="selectCustomer" item-value="id" outlined dense label="Customer"></v-select>
        </v-col>
        <v-col cols="3">
          <v-select :items="employeeDetails" item-text="name" item-value="id" v-model="roomAllocationDetails.employeeId" outlined dense label="Employee"></v-select>
        </v-col>
        <v-col cols="3">
          <v-select :items="status" v-model="roomAllocationDetails.status" outlined dense label="Status"></v-select>
        </v-col>
        <v-col cols="3">
          <v-btn text @click="cancelForm">Cancel</v-btn>
          <v-btn class="mx-3" color="#EF5350" v-show="saveBtn" @click="saveAllocateStaffToRoom">Save</v-btn>
           <v-btn class="mx-3" color="#EF5350" v-show="updateBtn" @click="updateAllocateStaffToRoom">Update</v-btn>
        </v-col>
      </v-row>
    </form>
    <table-data :data="RoomsDetails" class="my-3 pa-3"/>
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
      status: ['CheckIn', 'CheckOut'],
      selectCustomer: false,
      roomAllocationDetails: {},
      customerDetails: [],
      employeeDetails: [],
      updateDetail: {},
      RoomsDetails: {
        headers: [
          { text: 'Customer Name', value: 'name' }, { text: 'Contact Number', value: 'contactNumber' }, { text: 'Room Number', value: 'roomNumber' }, { text: 'Employee Name', value: 'empName' }, { text: 'Room Status', value: 'status' }, { text: 'Actions', value: 'actions'}
        ],
        list: [],
        actionsList:[{
          click: (item) => this.editAllocateDetails(item),
          icon:'mdi-pencil'
        },{
          click: (item) => this.delAllocateDetails(item),
          icon:'mdi-delete'
        }]
      },
    }
  },
  mounted () {
    this.getDetailOfBookingRooms()
  },
  methods: {
    async saveAllocateStaffToRoom () {
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
      cusDetails.status = this.roomAllocationDetails.status
      await this.postDetailsToApi('https://traineesapi.firebaseio.com/roomAllocation.json',cusDetails)
      let allocationDetails = await this.getDetailsFromApi('https://traineesapi.firebaseio.com/roomAllocation.json')
      this.RoomsDetails.list = this.getArrayObjFromObjList(allocationDetails)
      await this.deleteDetailsFromApi('https://traineesapi.firebaseio.com/bookedrooms/' + this.roomAllocationDetails.customerId + '.json')
      await this.getDetailOfBookingRooms()
      this.cancelForm()
    },
    editAllocateDetails (details) {
      this.saveBtn = false
      this.updateBtn = true
      this.updateDetail = details
      this.selectCustomer = true
      this.roomAllocationDetails.status = details.status
      this.employeeDetails.forEach(val => {
        val.id === details.employeeId ?( this.roomAllocationDetails.employeeId = val.id ): false
      })
    },
    delAllocateDetails (details) {
      console.log(details)
      details.url = 'https://traineesapi.firebaseio.com/roomAllocation/' + details.id + '.json'
      details.title = 'roomStaff'
      this.$store.commit('showDelDialog', details)
      this.$root.$on('statusChange', async (data) => {
        this.RoomsDetails.list.forEach((val, index) => {
          val.id === details.id ? this.RoomsDetails.list.splice(index, 1) : false
        })
        let rooms = await this.getDetailsFromApi('https://traineesapi.firebaseio.com/rooms/' + details.roomId + '.json')
        rooms.bookingStatus = data
        await this.updateDetailsToApi('https://traineesapi.firebaseio.com/rooms/' + details.roomId + '.json', rooms)
      })
    },
    updateAllocateStaffToRoom () {
      this.saveBtn = true
      this.updateBtn = false
      let empDetails = {}
      this.employeeDetails.forEach(val => {
        val.id === this.roomAllocationDetails.employeeId ? empDetails = Object.assign({}, val) : false
      })
      this.updateDetail.empName = empDetails.name
      this.updateDetail.employeeId = empDetails.id
      this.updateDetail.status = this.roomAllocationDetails.status
      this.updateDetailsToApi('https://traineesapi.firebaseio.com/roomAllocation/' + this.updateDetail.id + '.json', this.updateDetail)
      this.cancelForm()
    },
    async getDetailOfBookingRooms () {
      let cusDetails = await this.getDetailsFromApi('https://traineesapi.firebaseio.com/bookedrooms.json')
      if (cusDetails) {
        for(let i in cusDetails){
          delete cusDetails[i].id
        }
        this.customerDetails = this.getArrayObjFromObjList(cusDetails)
      }
      let empDetails = await this.getDetailsFromApi('https://traineesapi.firebaseio.com/employeeDetails.json')
      if (empDetails) this.employeeDetails = this.getArrayObjFromObjList(empDetails)
      let allocationDetails = await this.getDetailsFromApi('https://traineesapi.firebaseio.com/roomAllocation.json')
      if (allocationDetails) this.RoomsDetails.list = this.getArrayObjFromObjList(allocationDetails)
    },
    cancelForm () {
      this.roomAllocationDetails = {}
      this.selectCustomer = false
    }
  },
  beforeDestroy () {
    this.$root.$off('statusChange')
  }
}
</script>

<style>

</style>