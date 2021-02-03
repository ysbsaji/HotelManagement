<template>
  <div>
    <v-banner
      color="red"
      style="border-radius: 3px"
      class="my-3 ma-2"
    ><h3>Rooms Allocation Management</h3></v-banner>
      <v-form ref="roomAllocationForm" class="my-6 pa-4" v-if="$store.state.userDetails.role === 'Manager'">
        <v-row>
          <v-col cols="4">
            <v-select :items="customerDetails" item-text="name" v-model="roomAllocationDetails.customerId" :disabled="selectCustomer" item-value="id" :rules="requiredValidation" outlined dense label="Customer"></v-select>
          </v-col>
          <v-col cols="4">
            <v-select :items="employeeDetails" item-text="name" item-value="id" v-model="roomAllocationDetails.employeeId" :rules="requiredValidation" outlined dense label="Employee"></v-select>
          </v-col>
          <v-col cols="4">
            <v-btn text @click="selectCustomer = false; saveBtn = true; updateBtn = false; $refs.roomAllocationForm.reset()">Cancel</v-btn>
            <v-btn class="mx-3" color="#EF5350" v-show="saveBtn" @click="saveAllocateStaffToRoom">Save</v-btn>
            <v-btn class="mx-3" color="#EF5350" v-show="updateBtn" @click="updateAllocateStaffToRoom">Update</v-btn>
          </v-col>
        </v-row>
      </v-form>
    <h3 class="ml-3">Staff Assigned Rooms</h3>
    <table-data :data="RoomsDetails" class="my-3 pa-3"/>
    <h3 class="ml-3">Booked Rooms</h3>
    <table-data :data="bookedRoomDetails" class="my-3 pa-3"/>
    <h3 class="ml-3">Non Booked Rooms</h3>
    <table-data :data="nonBookedRoomDetails" class="my-3 pa-3"/>
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
      selectCustomer: false,
      roomAllocationDetails: {},
      customerDetails: [],
      employeeDetails: [],
      updateDetail: {},
      RoomsDetails: {
        headers: [
          { text: 'Customer Name', value: 'name' }, { text: 'Contact Number', value: 'contactNumber' }, { text: 'Room Number', value: 'roomNumber' }, { text: 'Rate', value: 'rate' }, { text: 'Check IN', value: 'checkInDate' }, { text: 'Check Out', value: 'checkOutDate' }, { text: 'Employee Name', value: 'empName' }, { text: 'Actions', value: 'actions'}
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
      bookedRoomDetails: {
        headers: [
          { text: 'Customer Name', value: 'name' }, { text: 'Contact Number', value: 'contactNumber' }, { text: 'Emial', value: 'email' }, { text: 'Password', value: 'password' }, { text: 'Rate', value: 'rate' }, { text: 'Room Number', value: 'roomNumber' }, { text: 'Check IN', value: 'checkInDate' }, { text: 'Check Out', value: 'checkOutDate' }
        ],
        list: []
      },
      nonBookedRoomDetails: {
        headers: [
          { text: 'Room Number', value: 'roomNumber' }, { text: 'Number of Bed', value: 'numberOfBed' }, { text: 'Room Type', value: 'roomType' }, { text: 'Rate', value: 'rate' }, { text: 'Max Person', value: 'maxPerson' }, { text: 'Image', value: 'image' }
        ],
        list: []
      }
    }
  },
  mounted () {
    this.getDetailOfBookingRooms()
  },
  methods: {
    async saveAllocateStaffToRoom () {
      if (this.$refs.roomAllocationForm.validate()) {
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
        await this.getDetailOfBookingRooms()
        this.$refs.roomAllocationForm.reset()
      }
    },
    editAllocateDetails (details) {
      this.saveBtn = false
      this.updateBtn = true
      this.updateDetail = details
      this.roomAllocationDetails =  details
      this.selectCustomer = true
      this.employeeDetails.forEach(val => {
        val.id === details.employeeId ?( this.roomAllocationDetails.employeeId = val.id ): false
      })
    },
    delAllocateDetails (details) {
      console.log(details)
      console.log(this.bookedRoomDetails.list)
      details.url = 'https://traineesapi.firebaseio.com/roomAllocation/' + details.id + '.json'
      details.title = 'roomStaff'
      this.$store.commit('showDelDialog', details)
      this.$root.$on('statusChange', async (data) => {
        this.RoomsDetails.list.forEach((val, index) => {
          val.id === details.id ? this.RoomsDetails.list.splice(index, 1) : false
        })
        this.bookedRoomDetails.list.forEach((val, index) => {
          if (val.roomId === details.roomId)  this.deleteDetailsFromApi('https://traineesapi.firebaseio.com/bookedroomsDetails/' + val.id + '.json'), this.bookedRoomDetails.list.splice(index,1)
        })
        let rooms = await this.getDetailsFromApi('https://traineesapi.firebaseio.com/rooms/' + details.roomId + '.json')
        rooms.bookingStatus = data
        await this.updateDetailsToApi('https://traineesapi.firebaseio.com/rooms/' + details.roomId + '.json', rooms)
      })
    },
    updateAllocateStaffToRoom () {
      this.saveBtn = true
      this.updateBtn = false
      this.selectCustomer = false
      let empDetails = {}
      this.employeeDetails.forEach(val => {
        val.id === this.roomAllocationDetails.employeeId ? empDetails = Object.assign({}, val) : false
      })
      this.updateDetail.empName = empDetails.name
      this.updateDetail.employeeId = empDetails.id
      this.updateDetailsToApi('https://traineesapi.firebaseio.com/roomAllocation/' + this.updateDetail.id + '.json', this.updateDetail)
      this.$refs.roomAllocationForm.reset()
    },
    async getDetailOfBookingRooms () {
      if (this.$store.state.userDetails.role !== 'Manager') this.RoomsDetails.headers = [{ text: 'Customer Name', value: 'name' }, { text: 'Contact Number', value: 'contactNumber' }, { text: 'Room Number', value: 'roomNumber' }, { text: 'Rate', value: 'rate' }, { text: 'Check IN', value: 'checkInDate' }, { text: 'Check Out', value: 'checkOutDate' }, { text: 'Employee Name', value: 'empName' }]
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
      if (this.$store.state.userDetails.role === 'Manager') {
        if (allocationDetails) this.RoomsDetails.list = this.getArrayObjFromObjList(allocationDetails)
      }else {
        for (let i in allocationDetails) { if (allocationDetails[i].empName === this.$store.state.userDetails.name) this.RoomsDetails.list.push(allocationDetails[i]) }
      }
      let BookedroomDetails = await this.getDetailsFromApi('https://traineesapi.firebaseio.com/bookedroomsDetails.json')
      if (BookedroomDetails) this.bookedRoomDetails.list = this.getArrayObjFromObjList(BookedroomDetails)
      let rooms = await this.getDetailsFromApi('https://traineesapi.firebaseio.com/rooms.json')
      let RoomDetails = this.getArrayObjFromObjList(rooms)
      this.nonBookedRoomDetails.list = []
      if (this.bookedRoomDetails.list.length > 0) {
        this.bookedRoomDetails.list.forEach(val => {
          RoomDetails.forEach(value => {
            if (val.roomId !== value.roomId) this.nonBookedRoomDetails.list.push(value)
          })
        })
      }else { this.nonBookedRoomDetails.list = RoomDetails }
    }
  },
  beforeDestroy () {
    this.$root.$off('statusChange')
  }
}
</script>

<style>

</style>