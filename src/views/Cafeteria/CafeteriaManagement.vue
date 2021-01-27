<template>
  <div>
    <h1 class="mt-3">Cafeteria Table Creation:</h1>
    <v-form ref="cafeForm" class="my-3 pa-3">
      <v-row>
        <v-col cols="12" sm="6" md="3">
          <v-text-field outlined dense label="Table Number" v-model="cafeFormDetails.tableNumber" :rules="requiredValidation"/>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-text-field outlined dense label="Total chairs" v-model="cafeFormDetails.totalChairs" :rules="requiredValidation"/>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-file-input outlined show-size counter multiple dense label="SelectImage" v-model="cafeFormDetails.file" @change="getImageUrl(cafeFormDetails.file[0])" :rules="requiredValidation"/>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-btn color="#EF5350" v-show="saveBtn" @click="saveCafeDetails">Save</v-btn>
          <v-btn class="mx-3" color="#EF5350" v-show="updateBtn" @click="updateCafeDetails" >Update</v-btn>
        </v-col>
      </v-row>
    </v-form>
    <table-data :data="cafeTableDetails"/>
    <h1 class="mt-3"> Food </h1>
    <v-form ref="cafeForm" class="my-3 pa-3">
      <v-row>
        <v-col cols="12" sm="6" md="4">
          <v-text-field outlined dense label="Food Name" v-model="foodDetails.foodName" :rules="requiredValidation"/>
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-text-field outlined dense label="Rate" type="number" v-model="foodDetails.rate" :rules="requiredValidation"/>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-btn color="#EF5350" v-show="saveBtn1" @click="saveFoodDetails">Save</v-btn>
          <v-btn class="mx-3" color="#EF5350" v-show="updateBtn1" @click="updateFoodDetails" >Update</v-btn>
        </v-col>
      </v-row>
    </v-form>
    <table-data :data="foodTableDetails"/>
  </div>
</template>

<script>
import TableData from '../../components/TableData.vue'
export default {
  components: { TableData },
  data () {
    return {
      foodDetails: {},
      saveBtn: true,
      saveBtn1: true,
      updateBtn1: false,
      updateBtn: false,
      cafeFormDetails: {},
      cafeTableDetails: {
        headers: [
          { text: 'Table Number', value: 'tableNumber' },{ text: 'Total Chairs', value: 'totalChairs' }, { text: 'Image', value: 'image' }, { text: 'Actions', value: 'actions'}
        ],
        list: [],
        actionsList:[{
            click: (item) => this.editCafeDetails(item),
            icon:'mdi-pencil'
          },{
            click: (item) => this.delCafeDetails(item),
            icon:'mdi-delete'
          }]
      },
      foodTableDetails: {
        headers: [
          { text: 'Food Name', value: 'foodName' },{ text: 'Rate', value: 'rate' }, { text: 'Actions', value: 'actions'}
        ],
        list: [],
        actionsList:[{
            click: (item) => this.editFoodDetails(item),
            icon:'mdi-pencil'
          },{
            click: (item) => this.delFoodDetails(item),
            icon:'mdi-delete'
          }]
      },
    }
  },
  methods: {
    saveCafeDetails () {
      this.postDetailsToApi('https://traineesapi.firebaseio.com/cafeteriaDetails.json',this.cafeFormDetails)
      this.getTableDetails()
    },
    getImageUrl (file) {
      if(file){
        var reader = new FileReader();
        reader.addEventListener('load', (e) => {
          this.cafeFormDetails.image = e.target.result
        })
        reader.readAsDataURL(file)
      }
    },
    editCafeDetails (cafeDetails) {
      this.cafeFormDetails = Object.assign({}, cafeDetails)
      this.saveBtn = false
      this.updateBtn = true
    },
    updateCafeDetails () {
      this.updateDetailsToApi('https://traineesapi.firebaseio.com/cafeteriaDetails/' + this.cafeFormDetails.id + '.json', this.cafeFormDetails)
      this.getTableDetails()
      this.saveBtn = true
      this.updateBtn = false
    },
    delCafeDetails (cafeDetails) {
      cafeDetails.url = 'https://traineesapi.firebaseio.com/cafeteriaDetails/' + cafeDetails.id + '.json'
      this.$store.commit('showDelDialog', cafeDetails)
      this.getTableDetails()
    },
    async getTableDetails () {
      let cafeDetails = await this.getDetailsFromApi('https://traineesapi.firebaseio.com/cafeteriaDetails.json')
      this.cafeTableDetails.list = this.getArrayObjFromObjList(cafeDetails)
      let foodDetails = await this.getDetailsFromApi('https://traineesapi.firebaseio.com/foodDetails.json')
      this.foodTableDetails.list = this.getArrayObjFromObjList(foodDetails)
    },
    saveFoodDetails () {
      this.foodDetails.quantity = 0
      this.foodDetails.price = 0
      this.postDetailsToApi('https://traineesapi.firebaseio.com/foodDetails.json',this.foodDetails)
      this.getTableDetails()
    },
    editFoodDetails (foodDetails) {
      this.foodDetails = Object.assign({}, foodDetails)
      this.saveBtn1 = false
      this.updateBtn1 = true
    },
    updateFoodDetails () {
      this.updateDetailsToApi('https://traineesapi.firebaseio.com/foodDetails/' + this.foodDetails.id + '.json', this.foodDetails)
      this.getTableDetails()
      this.saveBtn1 = true
      this.updateBtn1 = false
    },
    delFoodDetails (item) {
      item.url = 'https://traineesapi.firebaseio.com/foodDetails/' + item.id + '.json'
      this.$store.commit('showDelDialog', item)
      this.getTableDetails()
    }
  },
  mounted () {
    this.getTableDetails()
  }
}
</script>

<style>

</style>