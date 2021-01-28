<template>
  <v-app>
    <v-banner
      color="red"
      style="border-radius: 3px"
      class="my-3 ma-2"
    ><h3>Rooms Management</h3></v-banner>
    <v-form
      ref="roomsForm"
      lazy-validation
    >
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="6" md="4">
            <v-text-field outlined dense label="Room Number" v-model="roomsFormDetails.roomNumber" type="number" :rules="requiredValidation"/>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field outlined dense type="number" label="Number of bed" v-model="roomsFormDetails.numberOfBed" :rules="requiredValidation"/>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-select :items="RoomType" outlined dense label="Room Type" v-model="roomsFormDetails.roomType" :rules="requiredValidation"></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" sm="6" md="4">
            <v-text-field outlined dense type="number" label="Rate" v-model="roomsFormDetails.rate" :rules="requiredValidation"/>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field outlined dense type="number" label="Max Person Allowed" v-model="roomsFormDetails.maxPerson" :rules="requiredValidation"/>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-file-input outlined show-size counter multiple dense label="SelectImage" v-model="roomsFormDetails.file" @change="getImageUrl(roomsFormDetails.file[0])" :rules="requiredValidation"/>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-row>
          <v-col class="text-center">
            <v-btn text @click="$refs.roomsForm.reset()">
              Cancel
            </v-btn>
            <v-btn class="mx-3" color="#EF5350" v-show="saveBtn" @click="saveRoomDetails">
              Save
            </v-btn>
            <v-btn class="mx-3" color="#EF5350" v-show="updateBtn" @click="updateRoomDetails">
              Update
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-form>
    <table-data :data="RoomsDetails" class="my-3 pa-3"/>
  </v-app>
</template>

<script>
import TableData from '../../components/TableData.vue'
export default {
  components: { TableData },
  data () {
    return {
      saveBtn: true,
      updateBtn: false,
      RoomType: ['Ac', 'Non Ac'],
      RoomsDetails: {
        headers: [
          { text: 'Room Number', value: 'roomNumber' }, { text: 'Number of Bed', value: 'numberOfBed' }, { text: 'Room Type', value: 'roomType' }, { text: 'Rate', value: 'rate' }, { text: 'Max Person', value: 'maxPerson' }, { text: 'Image', value: 'image' }, { text: 'Actions', value: 'actions'}
        ],
        list: [],
        actionsList:[{
          click: (item) => this.editRoomDetails(item),
          icon:'mdi-pencil'
        },{
          click: (item) => this.delRoomDetails(item),
          icon:'mdi-delete'
        }]
      },
      roomsFormDetails: {}
    }
  },
  methods: {
    saveRoomDetails () {
      if(this.$refs.roomsForm.validate()) {
        this.postDetailsToApi('https://traineesapi.firebaseio.com/rooms.json',this.roomsFormDetails)
        this.getTableDetails()
        this.$refs.roomsForm.reset()
      }
    },
    async getTableDetails () {
      let roomDetails = await this.getDetailsFromApi('https://traineesapi.firebaseio.com/rooms.json')
      this.RoomsDetails.list = this.getArrayObjFromObjList(roomDetails)
    },
    editRoomDetails (roomdetails) {
      this.roomsFormDetails = Object.assign({}, roomdetails)
      this.saveBtn = false
      this.updateBtn = true
    },
    updateRoomDetails () {
      if(this.$refs.roomsForm.validate()){
        this.updateDetailsToApi('https://traineesapi.firebaseio.com/rooms/' + this.roomsFormDetails.id + '.json', this.roomsFormDetails)
        this.getTableDetails()
        this.saveBtn = true
        this.updateBtn = false
        this.$refs.roomsForm.reset()
      }
    },
    delRoomDetails (item) {
      item.url = 'https://traineesapi.firebaseio.com/rooms/' + item.id + '.json'
      this.$store.commit('showDelDialog', item)
      this.getTableDetails()
    },
    getImageUrl(file){
      if(file){
        var reader = new FileReader();
        reader.addEventListener('load', (e) => {
          this.roomsFormDetails.image = e.target.result
        })
        reader.readAsDataURL(file)
      }
    }
  },
  mounted () {
    this.getTableDetails()
  }
}
</script>

<style>

</style>