<template>
  <div>
    <NavigationBar/>
    <div>
      <v-row style="background-image: url('https://efacility.r.worldssl.net/wp-content/uploads/2020/10/Cafeteria-Management-Landing-Banner.jpg')">
        <v-col cols="12">
          <img src="https://efacility.r.worldssl.net/wp-content/uploads/2020/10/Cafeteria-Management-Banner.png" alt="" width="40%" height="50%" style="margin-left: 15%; margin-top: 5% ">
        </v-col>
      </v-row>
    </div>
          <v-row>
        <v-col cols="3" v-for="(item, index) in cafeDetails" :key="index">
          <v-card
            class="mx-auto my-12"
            max-width="374"
          >
            <v-img
              height="250"
              :src="item.image"
            ></v-img>

            <v-card-title>Cafeteria Tables</v-card-title>

            <v-card-text>
              <p><b>Table Number:</b> {{ item.tableNumber }} </p>
              <p><b>Nuber of chairs:</b> {{ item.totalChairs }} </p>
            </v-card-text>

            <v-divider class="mx-4"></v-divider>
            <v-card-actions>
              <v-list-item>
                <v-row justify="center">
                  <v-btn
                    color="deep-purple lighten-2"
                    :disabled="item.bookingStatus"
                    @click="orderedTableDetails.tableNumber = item.tableNumber; orderedTableDetails.tableId = item.id; foodOrderDialog = true"
                  >
                    Order Now
                  </v-btn>
                </v-row>
              </v-list-item>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <v-dialog
        v-model="foodOrderDialog"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
      >
        <v-card>
        <v-toolbar
          dark
          color="#EF5350"
        >
          <v-btn
            icon
            dark
            @click="foodOrderDialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Order Your Food Here.</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn
              dark
              text
              @click="saveSelectedFood"
            >
              Save
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <table-data :data="foodTableDetails"/>
        </v-card>
    </v-dialog>
  </div>
</template>

<script>
import NavigationBar from "../../components/NavigationBar";
import TableData from '../../components/TableData.vue'

export default {
  components: { NavigationBar, TableData },
  data () {
    return{
      orderedTableDetails: {},
      foodOrdered: [],
      foodDetails: {},
      cafeDetails: {},
      foodOrderDialog: false,
      foodTableDetails: {
        headers: [
          { text: 'Food Name', value: 'foodName' }, { text: 'Rate', value: 'rate' }, { text: 'Actions', value:'actions'}, { text: 'Quantity', value:'quantity'}, { text: 'Price', value:'price'}
        ],
        list: [],
        actionsList:[{
          click: (item) => this.addQuantity(item),
          icon:'mdi-plus'
        },{
          click: (item) => this.minusQuantity(item),
          icon:'mdi-minus'
        }]
      },
    }
  },
  methods: {
    async getDetails () {
      let details =await this.getDetailsFromApi('https://traineesapi.firebaseio.com/cafeteriaDetails.json')
      if (details) this.cafeDetails = this.getArrayObjFromObjList(details)
      let fooddetails =await this.getDetailsFromApi('https://traineesapi.firebaseio.com/foodDetails.json')
      if (fooddetails) this.foodTableDetails.list = this.getArrayObjFromObjList(fooddetails)
    },
    addQuantity (item) {
      this.foodTableDetails.list.forEach(val => {
        item.id === val.id ? (val.quantity++, val.price = val.quantity * val.rate) : false
      })
    },
    minusQuantity (item) {
      this.foodTableDetails.list.forEach(val => {
        if (item.id === val.id) {
          val.quantity !== 0 ? (val.quantity--, val.price = val.quantity * val.rate) : false
        }
      })
    },
    async saveSelectedFood () {
      this.foodOrderDialog = false
      let orderedList = []
      this.foodTableDetails.list.forEach(val => {
        val.quantity > 0 ? (delete val.id, orderedList.push(val)) : false 
      })
      let details = await this.getDetailsFromApi('https://traineesapi.firebaseio.com/cafeteriaDetails/' + this.orderedTableDetails.tableId + '.json')
      details.bookingStatus = true
      if (details.bookingStatus) {
        await this.updateDetailsToApi('https://traineesapi.firebaseio.com/cafeteriaDetails/' + this.orderedTableDetails.tableId  + '.json', details)
        this.getDetails()
        let foodDetails = { ...orderedList, ...this.orderedTableDetails}
        await this.postDetailsToApi('https://traineesapi.firebaseio.com/orderedFoodDetails.json',foodDetails)
        await this.postDetailsToApi('https://traineesapi.firebaseio.com/orderedListDetails.json',foodDetails)
      }
    }
  },
  mounted () {
    this.getDetails()
  }
}
</script>

<style>

</style>