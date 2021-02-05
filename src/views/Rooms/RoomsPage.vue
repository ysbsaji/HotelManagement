<template>
  <div>
    <NavigationBar/>
    <div>
      <h1 class="display-1 my-6 text-center">ROOMS</h1>
      <p class="headline text-center">FEEL FREE TO EXPLORE IN HOTEL VIP</p>
    </div>
      <v-row class="pa-2">
        <v-col cols="12" md="4" lg="3" sm="6" v-for="(item, index) in roomDetails" :key="index">
          <v-hover v-slot="{ hover }">
            <v-card class="mx-auto my-12" max-width="374" :elevation="hover ? 24 : 0">
              <v-img height="250" @click="getIMageUrl(item)" :src="item.image"></v-img>
              <v-card-title>Room Details</v-card-title>
              <v-card-text>
                <p><b>Room Number:</b> {{ item.roomNumber }} </p>
                <p><b>Room Type:</b> {{ item.roomType }} </p>
                <p><b>Number of Bed:</b> {{ item.numberOfBed }} </p>
                <p><b>Maximum Person Allowed:</b> {{ item.maxPerson }} </p>
                <p><b>Room Rate:</b> {{ item.rate | moneySymbol }}</p>
              </v-card-text>
              <v-divider class="mx-4"></v-divider>
              <v-card-title>Amenties</v-card-title>
              <v-card-text>
                <v-chip-group column>
                  <v-chip>24 hours room service</v-chip>
                  <v-chip>swimming pool</v-chip>
                  <v-chip>TV</v-chip>
                  <v-chip>Extra bed</v-chip>
                </v-chip-group>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                <v-list-item>
                  <v-row justify="center">
                    <v-btn :disabled="item.bookingStatus" color="deep-purple lighten-2" @click="bookingRoom(item)">Book Now</v-btn>
                  </v-row>
                </v-list-item>
              </v-card-actions>
            </v-card>
          </v-hover>
        </v-col>
      </v-row>
      <v-dialog v-model="roomBokingDialog" persistent width="500">
        <v-card>
          <v-card-title class="headline grey lighten-2">
            Book Your Room Here.
          </v-card-title>
          <v-card-text>
            <v-form ref="cafeForm" class="mt-3" lazy-validation>
              <v-text-field outlined dense label="Name" v-model="customerDetails.name" :rules="requiredValidation"/>
              <v-text-field outlined dense type="email" label="Email" v-model="customerDetails.email" :rules="emailValidation"/>
              <v-text-field outlined dense type="number" label="Contact Number" v-model="customerDetails.contactNumber" :rules="requiredValidation"/>
              <v-menu v-model="datePicker" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="auto">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field outlined dense v-model="customerDetails.checkInDate" :rules="requiredValidation" label="Checkin Date" prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"></v-text-field>
                </template>
                <v-date-picker :min="customerDetails.checkInDate" v-model="customerDetails.checkInDate" @input="datePicker = false"></v-date-picker>
              </v-menu>
              <v-digital-time-picker prepend-icon="mdi-clock-time-four-outline" v-model="customerDetails.checkInTime" outlined dense label="Check In time" />
              <v-menu v-model="datePicker1" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="auto">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field outlined dense v-model="customerDetails.checkOutDate" label="Checkout Date" prepend-icon="mdi-calendar" :rules="dateValidation" readonly v-bind="attrs" v-on="on"></v-text-field>
                </template>
                <v-date-picker v-model="customerDetails.checkOutDate" @input="datePicker1 = false"></v-date-picker>
              </v-menu>
              <v-digital-time-picker prepend-icon="mdi-clock-time-four-outline" v-model="customerDetails.checkOutTime" :rules="timeValidation" outlined dense label="Check Out time" />
            </v-form>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text :loading="btnLoading" @click="confirmYourBooking()">Book</v-btn>
            <v-btn color="primary" text @click="roomBokingDialog = false; $refs.cafeForm.reset()">Cancel</v-btn>
          </v-card-actions>  
        </v-card>
    </v-dialog>
    <v-snackbar color="red" v-model="snackbarForRoom">This room has booked already those days. So book another room or book another days</v-snackbar>
  </div>
</template>

<script>
import NavigationBar from "../../components/NavigationBar";
export default {
  data () {
    return {
      snackbarForRoom: false,
      snackbarForRoomDia: false,
      customerDetails: {
        checkInDate: new Date().toISOString().substr(0, 10),
        checkOutDate: new Date().toISOString().substr(0, 10),
      },
      bookingRoomDetails: '',
      detailsOfBookedRooms: null,
      roomBokingDialog: false,
      roomDetails: [],
      datePicker: false,
      datePicker1: false,
      dateValidation: [
        v => !!v || 'required',
        (v) => {
          if (Date.parse(v) >= Date.parse(this.customerDetails.checkInDate)) {
            return true
          }else { return 'CheckOut Date Should greater than checkin date'}
        }
      ],
      timeValidation: [
        v => !!v || 'required',
        (v) => {
          if (Date.parse(this.customerDetails.checkInDate) === Date.parse(this.customerDetails.checkOutDate)) {
            return this.customerDetails.checkInTime <= v ? true : 'Time should be Greater than CheckInTime'
          }else { return true }
        }
      ]
    }
  },
  components: { NavigationBar },
  methods: {
    bookingRoom (roomdetails) {
      this.roomBokingDialog = true
      this.bookingRoomDetails = roomdetails
    },
    async confirmYourBooking () {
      if (this.$refs.cafeForm.validate()) {
        this.btnLoading = true
        this.roomDetails.forEach(val => {
          if (this.bookingRoomDetails.id === val.id) {
            if (val.bookingDetails) val.bookingDetails.forEach(val => {
              let checkInDate = Date.parse(this.customerDetails.checkInDate)
              let checkOutDate = Date.parse(this.customerDetails.checkOutDate)
              let from = Date.parse(val.checkInDate)
              let to = Date.parse(val.checkOutDate)
              if((checkInDate <= to && checkInDate >= from)){
                this.snackbarForRoomDia = true
              }
              if((checkOutDate <= to && checkOutDate >= from)) {
                this.snackbarForRoomDia = true
              }
            })
          }
        })
        if (!this.snackbarForRoomDia){
          this.customerDetails.role = 'Customer'
          this.bookingRoomDetails.bookingDetails.push(this.customerDetails)
          this.bookingRoomDetails.status = 'Booked'
          await this.updateDetailsToApi('https://traineesapi.firebaseio.com/rooms/' + this.bookingRoomDetails.id + '.json', this.bookingRoomDetails)
          this.roomBokingDialog = false
          this.snackbarForRoomDia = false
          this.btnLoading = false
        }else { this.snackbarForRoom = true, this.snackbarForRoomDia = false, this.roomBokingDialog = false,  this.btnLoading = false }
        this.$refs.cafeForm.reset()
      }
    },
    async getDetails () {
      let roomDetails = await this.getDetailsFromApi('https://traineesapi.firebaseio.com/rooms.json')
      if (roomDetails) this.roomDetails = await this.getArrayObjFromObjList(roomDetails)
      this.roomDetails.forEach(val => { if (!val.bookingDetails) val.bookingDetails = [] })
    },
  },
  mounted () {
    this.getDetails()
  }
}
</script>

<style>

</style>