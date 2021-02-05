<template>
  <div>
    <v-expansion-panels accordion>
      <v-expansion-panel>
        <v-expansion-panel-header color="red" class="ma-3" style="border-radius: 3px">
          <h3>Cafeteria Management</h3>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-btn class="mx-3" color="#EF5350" @click="cafeFormDia = true; saveBtn = true; updateBtn = false ">Add</v-btn>
          <table-data :data="cafeTableDetails" class="my-3 pa-3"/>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header color="red" class="ma-3" style="border-radius: 3px">
          <h3>Food Management</h3>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-btn class="mx-3" color="#EF5350" @click="foodFormDia = true; saveBtn1 = true; updateBtn1 = false ">Add</v-btn>
          <table-data :data="foodTableDetails" class="my-3 pa-3"/>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-dialog v-model="cafeFormDia" persistent max-width="600px">
      <v-card height="440">
        <v-card-title class="headline grey lighten-2">Manage Cafeteria Table here!</v-card-title>
        <v-divider class="mb-2"></v-divider>
        <v-card-text>
          <v-form ref="cafeForm" class="my-3 pa-3">
            <v-row>
              <v-col cols="12" sm="12" md="12">
                <v-text-field outlined dense label="Table Number" type="number" v-model="cafeFormDetails.tableNumber" :rules="requiredValidation"/>
              </v-col>
              <v-col cols="12" sm="12" md="12">
                <v-text-field outlined dense label="Total chairs" type="number" v-model="cafeFormDetails.totalChairs" :rules="requiredValidation"/>
              </v-col>
              <v-col cols="12" sm="12" md="12">
                <v-file-input outlined show-size counter multiple dense label="SelectImage" v-model="cafeFormDetails.file" @change="cafeFormDetails.file ? getImageUrl(cafeFormDetails.file[0]) : false" :rules="requiredValidation"/>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-row>
            <v-col class="text-center">
              <v-btn text class="mx-3" @click="$refs.cafeForm.reset(); cafeFormDia = false; saveBtn = true; updateBtn = false ">Cancel</v-btn>
              <v-btn color="#EF5350" v-show="saveBtn" @click="saveCafeDetails" :loading="btnLoading">Save</v-btn>
              <v-btn class="mx-3" color="#EF5350" v-show="updateBtn" @click="updateCafeDetails" :loading="btnLoading">Update</v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="foodFormDia" persistent max-width="600px">
      <v-card height="300">
        <v-card-title class="headline grey lighten-2">Manage Food here!</v-card-title>
        <v-divider class="mb-2"></v-divider>
        <v-card-text>
          <v-form ref="foodForm">
            <v-row>
              <v-col cols="12" sm="12" md="12">
                <v-text-field outlined dense label="Food Name" v-model="foodDetails.foodName" :rules="requiredValidation"/>
              </v-col>
              <v-col cols="12" sm="12" md="12">
                <v-text-field outlined dense label="Rate" type="number" v-model="foodDetails.rate" :rules="requiredValidation"/>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-row>
            <v-col class="text-center">
              <v-btn text class="mx-3" @click="$refs.foodForm.reset(); foodFormDia = false; saveBtn1 = true; updateBtn1 = false ">Cancel</v-btn>
              <v-btn color="#EF5350" v-show="saveBtn1" @click="saveFoodDetails" :loading="btnLoading1">Save</v-btn>
              <v-btn class="mx-3" color="#EF5350" v-show="updateBtn1" @click="updateFoodDetails" :loading="btnLoading1">Update</v-btn>
            </v-col>
          </v-row>
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
      foodFormDia: false,
      btnLoading1: false,
      cafeFormDia: false,
      foodDetails: {},
      cafeFormDetails: {},
      cafeTableDetails: {
        headers: [
          { text: 'Table Number', value: 'tableNumber' },{ text: 'Total Chairs', value: 'totalChairs' }, { text: 'Image', value: 'image' }, { text: 'Actions', value: 'actions'}
        ],
        list: [],
        loading: true,
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
        loading: true,
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
    async saveCafeDetails () {
      if (this.$refs.cafeForm.validate()) {
        this.btnLoading = true
        await this.postDetailsToApi('https://traineesapi.firebaseio.com/cafeteriaDetails.json',this.cafeFormDetails)
        await this.getTableDetails()
        this.cafeFormDia = false
        this.$refs.cafeForm.reset()
      }
    },
    getImageUrl (file) {
      if (file) {
        var reader = new FileReader();
        reader.addEventListener('load', (e) => {
          this.cafeFormDetails.image = e.target.result
        })
        reader.readAsDataURL(file)
      }
    },
    editCafeDetails (cafeDetails) {
      this.cafeFormDetails = Object.assign({}, cafeDetails)
      this.cafeFormDetails.file = [{}]
      this.saveBtn = false
      this.updateBtn = this.cafeFormDia = true
    },
    async updateCafeDetails () {
      if (this.$refs.cafeForm.validate()) {
        this.btnLoading = true
        await this.updateDetailsToApi('https://traineesapi.firebaseio.com/cafeteriaDetails/' + this.cafeFormDetails.id + '.json', this.cafeFormDetails)
        await this.getTableDetails()
        this.saveBtn = true
        this.updateBtn = this.cafeFormDia = false
        this.$refs.cafeForm.reset()
      }
    },
    delCafeDetails (cafeDetails) {
      cafeDetails.url = 'https://traineesapi.firebaseio.com/cafeteriaDetails/' + cafeDetails.id + '.json'
      this.$store.commit('showDelDialog', cafeDetails)
      this.getTableDetails()
    },
    async getTableDetails () {
      let cafeDetails = await this.getDetailsFromApi('https://traineesapi.firebaseio.com/cafeteriaDetails.json')
      if (cafeDetails) this.cafeTableDetails.list = this.getArrayObjFromObjList(cafeDetails)
      this.cafeTableDetails.loading = false
      let foodDetails = await this.getDetailsFromApi('https://traineesapi.firebaseio.com/foodDetails.json')
      if (foodDetails) this.foodTableDetails.list = this.getArrayObjFromObjList(foodDetails)
      this.foodTableDetails.loading = false
      this.btnLoading = false
      this.btnLoading1 = false
    },
    async saveFoodDetails () {
      if (this.$refs.foodForm.validate()) {
        this.btnLoading1 = true
        this.foodDetails.quantity = 0
        this.foodDetails.price = 0
        await this.postDetailsToApi('https://traineesapi.firebaseio.com/foodDetails.json',this.foodDetails)
        await this.getTableDetails()
        this.foodFormDia = false
        this.$refs.foodForm.reset()
      }
    },
    editFoodDetails (foodDetails) {
      this.foodDetails = Object.assign({}, foodDetails)
      this.saveBtn1 = false
      this.updateBtn1 = this.foodFormDia = true
    },
    async updateFoodDetails () {
      this.btnLoading1 = true
      await this.updateDetailsToApi('https://traineesapi.firebaseio.com/foodDetails/' + this.foodDetails.id + '.json', this.foodDetails)
      await this.getTableDetails()
      this.saveBtn1 = true
      this.updateBtn1 = this.foodFormDia = false
      this.$refs.foodForm.reset()
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