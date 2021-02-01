<template>
  <div>
    <NavigationBar/>
    <div>
      <h1 class="display-1 my-6 text-center">ROOMS</h1>
      <p class="headline text-center">FEEL FREE TO EXPLORE IN HOTEL VIP</p>
    </div>
      <v-row>
        <v-col cols="3" v-for="(item, index) in roomDetails" :key="index">
          <v-card
            class="mx-auto my-12"
            max-width="374"
          >
            <v-img
              height="250"
              :src="item.image"
            ></v-img>
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
                  <v-btn
                    :disabled="item.bookingStatus"
                    color="deep-purple lighten-2"
                    @click="bookingRoom(item)"
                  >
                    Book Now
                  </v-btn>
                </v-row>
              </v-list-item>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <v-dialog
        v-model="roomBokingDialog"
        width="500"
      >
        <v-card>
          <v-card-title class="headline grey lighten-2">
            Book Your Room Here.
          </v-card-title>
          <v-card-text>
            <v-form ref="cafeForm" class="mt-3" lazy-validation>
              <v-text-field outlined dense label="Name" v-model="customerDetails.name" :rules="requiredValidation"/>
              <v-text-field outlined dense type="email" label="Email" v-model="customerDetails.email" :rules="emailValidation"/>
              <v-text-field outlined dense type="number" label="Contact Number" v-model="customerDetails.contactNumber" :rules="requiredValidation"/>
              <v-text-field outlined dense type="password" label="Password" v-model="customerDetails.password" :rules="passwordValidation"/>
              <v-menu v-model="datePicker" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="auto">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field outlined dense v-model="customerDetails.checkInDate" label="Checkin Date" prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"></v-text-field>
                </template>
                <v-date-picker :min="customerDetails.checkInDate" v-model="customerDetails.checkInDate" @input="datePicker = false"></v-date-picker>
              </v-menu>
              <v-menu v-model="datePicker1" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="auto">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field outlined dense v-model="customerDetails.checkOutDate" label="Checkout Date" prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"></v-text-field>
                </template>
                <v-date-picker v-model="customerDetails.checkOutDate" @input="datePicker1 = false"></v-date-picker>
              </v-menu>
            </v-form>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              text
              @click="confirmYourBooking()"
            >
              Book
            </v-btn>
            <v-btn
              color="primary"
              text
              @click="roomBokingDialog = false; $refs.cafeForm.reset()"
            >
              Cancel
            </v-btn>
          </v-card-actions>
           
        </v-card>
    </v-dialog>
  </div>
</template>

<script>
import NavigationBar from "../../components/NavigationBar";
export default {
  data () {
    return {
      customerDetails: {
        checkInDate: new Date().toISOString().substr(0, 10),
        checkOutDate: new Date().toISOString().substr(0, 10),
      },
      bookingRoomDetails: '',
      roomBokingDialog: false,
      roomDetails: [],
      datePicker: false,
      datePicker1: false
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
        this.roomBokingDialog = false
        if (this.customerDetails.checkInDate === new Date().toISOString().substr(0, 10)) {
          this.bookingRoomDetails.bookingStatus = true
        }else{ this.bookingRoomDetails.bookingStatus = false }
        this.bookingRoomDetails.roomId = this.bookingRoomDetails.id
        await this.updateDetailsToApi('https://traineesapi.firebaseio.com/rooms/' + this.bookingRoomDetails.roomId  + '.json', this.bookingRoomDetails)
        let bookedRoomDetails = { ...this.bookingRoomDetails, ...this.customerDetails}
        await this.postDetailsToApi('https://traineesapi.firebaseio.com/bookedrooms.json',bookedRoomDetails)
        await this.postDetailsToApi('https://traineesapi.firebaseio.com/bookedroomsDetails.json',bookedRoomDetails)
        this.$refs.cafeForm.reset()
      }
    },
    async getDetails () {
      let roomDetails =await this.getDetailsFromApi('https://traineesapi.firebaseio.com/rooms.json')
      if (roomDetails) this.roomDetails = this.getArrayObjFromObjList(roomDetails)
      let bookedRooms =await this.getDetailsFromApi('https://traineesapi.firebaseio.com/bookedrooms.json')
      if (bookedRooms) var details = this.getArrayObjFromObjList(bookedRooms)
      details.forEach(val => {
        let todayDate = new Date().toISOString().substr(0, 10)
        let check = Date.parse(todayDate)
        let from = Date.parse(val.checkInDate)
        let to = Date.parse(val.checkOutDate)
        if((check <= to && check >= from)){
          this.roomDetails.forEach(value => {
            value.roomId === val.roomId ? value.bookingStatus = true : false
          })
        }
      })
    },
  },
  mounted () {
    this.getDetails()
  }
}
</script>

<style>

</style>