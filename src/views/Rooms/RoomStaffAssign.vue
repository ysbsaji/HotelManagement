<template>
  <div>
    <v-banner color="red" style="border-radius: 3px" class="my-3 ma-2"><h3>Room Allocation Management</h3></v-banner>
    <table-data :data="RoomsDetails" class="my-3 pa-3"/>
    <v-dialog v-model="isAssignDialog" width="500">
      <v-card>
        <v-card-title class="headline grey lighten-2">
          Assign Employee To Customer
        </v-card-title>
        <v-card-text class="mt-3">
          <v-select :items="employeeDetails" item-text="name" item-value="id" v-model="assignEmployee.employeeId" :rules="requiredValidation" outlined dense label="Employee"></v-select>
        </v-card-text>
        <v-divider></v-divider>
          <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text :loading="btnLoading" @click="confirmAssign()">Assign</v-btn>
          </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="statusDialog" persistent width="100%">
      <v-card>
        <v-card-title>
          Customer Information
        </v-card-title>
        <v-card-text>
          <table-data :data="BookingDetails" class="my-3 pa-3"/>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="statusDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import TableData from '../../components/TableData.vue'
export default {
  components: { TableData },
  data () {
    return {
      userDetails: [],
      isAssignDialog: false,
      showDetails: false,
      statusDialog: false,
      assignEmployee: {},
      updateDetails: {},
      employeeDetails: [],
      RoomsDetails: {
        headers: [
          { text: 'Room Number', value: 'roomNumber' }, { text: 'Room Type', value: 'roomType' }, { text: 'Number of Bed', value: 'numberOfBed' }, { text: 'Max person', value: 'maxPerson' }, { text: 'Rate', value: 'rate' }, { text: 'Status', value: 'status' }, { text: 'Is Assigned', value: 'isAssigned' }
        ],
        list: [],
        loading: true,
        bookedList:[{
          click: (item) => this.bookedDetails(item),
          icon:'mdi-clipboard-account-outline'
        }],
        isAssignedList:[{
          click: (item) => this.assignEmpToCus(item),
          icon:'mdi-clipboard-account-outline'
        }]
      },
      BookingDetails: {
      headers: [
        { text: 'Customer Name', value: 'name' }, { text: 'Contact NUmber', value: 'contactNumber' }, { text: 'Check IN Date', value: 'checkInDate' }, { text: 'CheckOut Date', value: 'checkOutDate' }, { text: 'CheckIn Time', value: 'checkInTime' }, { text: 'CheckOut Time', value: 'checkOutTime' }
      ],
      list: []
      },
    }
  },
  mounted () {
    this.getDetailOfBookingRooms()
  },
  methods: {
    assignEmpToCus (details) {
      this.updateDetails = details
      this.isAssignDialog = true
    },
    async confirmAssign () {
      this.btnLoading = true
      this.employeeDetails.find(val => { if (val.id === this.assignEmployee.employeeId) this.updateDetails.isAssigned = val.name })
      await  this.updateDetailsToApi('https://traineesapi.firebaseio.com/rooms/' + this.updateDetails.id + '.json', this.updateDetails)
      this.btnLoading = this.isAssignDialog = false
    },
    async getDetailOfBookingRooms () {
      let empDetails = await this.getDetailsFromApi('https://traineesapi.firebaseio.com/employeeDetails.json')
      if (empDetails) this.employeeDetails = this.getArrayObjFromObjList(empDetails)
      let rooms = await this.getDetailsFromApi('https://traineesapi.firebaseio.com/rooms.json')
      if (rooms) this.RoomsDetails.list = await  this.getArrayObjFromObjList(rooms)
      if (this.$store.state.userDetails.role === 'Manager') {
        this.RoomsDetails.list.forEach(value => {
        if (value.bookingDetails) value.bookingDetails.forEach(val => {
          let today = Date.parse(new Date().toISOString().substr(0, 10))
          let check = Date.parse(val.checkOutDate)
          let forStatus
          check >= today ? forStatus = true : forStatus = false
          !forStatus ? (value.status = 'Free', value.isAssigned = '') : value.status = 'Booked'
        })
      })
      }else {
        let filter = this.RoomsDetails.list
        this.RoomsDetails.list = []
        filter.find((value) => {
          if (value.isAssigned === this.$store.state.userDetails.name) {
            this.RoomsDetails.list.push(value)
          }
        })
      }
      this.RoomsDetails.loading = false
    },
    bookedDetails(details){
      this.statusDialog = true
      this.BookingDetails.list = []
      details.bookingDetails.forEach(val => {
        let today = Date.parse(new Date().toISOString().substr(0, 10))
        let check = Date.parse(val.checkOutDate)
        if (check >= today) this.BookingDetails.list.push(val)
      })
    }
  },
}
</script>

<style>

</style>