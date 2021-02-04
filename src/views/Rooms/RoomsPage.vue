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
              <!-- <v-text-field outlined dense type="password" label="Password" v-model="customerDetails.password" :rules="passwordValidation"/> -->
              <v-menu v-model="datePicker" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="auto">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field outlined dense v-model="customerDetails.checkInDate" :rules="requiredValidation" label="Checkin Date" prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"></v-text-field>
                </template>
                <v-date-picker :min="customerDetails.checkInDate" v-model="customerDetails.checkInDate" @input="datePicker = false"></v-date-picker>
              </v-menu>
              <v-menu v-model="datePicker1" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="auto">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field outlined dense v-model="customerDetails.checkOutDate" label="Checkout Date" prepend-icon="mdi-calendar" :rules="dateValidation" readonly v-bind="attrs" v-on="on"></v-text-field>
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
              :loading="btnLoading"
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
            return ''
          }else { return 'CheckOut Date Should greater than checkin date'}
        }
      ],
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
              let todayDate = this.customerDetails.checkInDate
              let check = Date.parse(todayDate)
              let todayDate1 = this.customerDetails.checkOutDate
              let check1 = Date.parse(todayDate1)
              let from = Date.parse(val.checkInDate)
              let to = Date.parse(val.checkOutDate)
              if((check <= to && check >= from)){
                this.snackbarForRoomDia = true
              }
              if((check1 <= to && check1 >= from)) {
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
      if (roomDetails) this.roomDetails = this.getArrayObjFromObjList(roomDetails)
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