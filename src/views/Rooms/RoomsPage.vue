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
              <p><b>Room Rate:</b> {{ item.rate }} </p>
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
            <v-card-actions>
              <v-btn
                :disabled="item.bookingStatus"
                color="deep-purple lighten-2"
                @click="bookingRoom(item)"
              >
                Book Now
              </v-btn>
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
            <form ref="roomBookingForm" class="mt-4">
              <v-text-field outlined dense label="Name" v-model="customerDetails.name"/>
              <v-text-field outlined dense type="email" label="Email" v-model="customerDetails.email"/>
              <v-text-field outlined dense type="number" label="Contact Number" v-model="customerDetails.contactNumber"/>
            </form>
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
              @click="roomBokingDialog = false"
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
      customerDetails: {},
      bookingRoomDetails: '',
      roomBokingDialog: false,
      roomDetails: []
    }
  },
  components: { NavigationBar },
  methods: {
    bookingRoom(roomdetails){
      this.roomBokingDialog = true
      this.bookingRoomDetails = roomdetails
    },
    async confirmYourBooking(){
      this.bookingRoomDetails.bookingStatus = true
      this.bookingRoomDetails.roomId = this.bookingRoomDetails.id
      await this.updateDetailsToApi('https://traineesapi.firebaseio.com/rooms/' + this.bookingRoomDetails.roomId  + '.json', this.bookingRoomDetails)
      let bookedRoomDetails = { ...this.bookingRoomDetails, ...this.customerDetails}
      await this.postDetailsToApi('https://traineesapi.firebaseio.com/bookedrooms.json',bookedRoomDetails)
    },
    async getDetails(){
      let details =await this.getDetailsFromApi('https://traineesapi.firebaseio.com/rooms.json')
      this.roomDetails = this.getArrayObjFromObjList(details)
    }
  },
  mounted () {
    this.getDetails()
  },
  filters: {
    moneySymbol(v) {
      return v +'&#8377;'
    },
  }
}
</script>

<style>

</style>