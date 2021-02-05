<template>
  <div>
    <v-banner
      color="red"
      style="border-radius: 3px"
      class="my-3 ma-2"
    ><h3>Rooms Management</h3></v-banner>
    <v-btn class="mx-3 my-3" elevation="0" color="#EF5350" @click="roomFormDia = true; saveBtn = true; updateBtn = false ">Add</v-btn>
    <v-dialog v-model="roomFormDia" max-width="600" persistent>
      <v-card height="400">
        <v-card-title class="headline grey lighten-2"> Manage Rooms Here !</v-card-title>
        <v-divider class="mb-2"></v-divider>
        <v-card-text>
          <v-form
            ref="roomsForm"
            lazy-validation
          >
            <v-row>
              <v-col cols="12" sm="6" md="6">
                <v-text-field outlined dense label="Room Number" v-model="roomsFormDetails.roomNumber" type="number" :rules="requiredValidation"/>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-text-field outlined dense type="number" label="Number of bed" v-model="roomsFormDetails.numberOfBed" :rules="requiredValidation"/>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="6" md="6">
                <v-select :items="RoomType" outlined dense label="Room Type" v-model="roomsFormDetails.roomType" :rules="requiredValidation"></v-select>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-text-field outlined dense type="number" label="Rate" v-model="roomsFormDetails.rate" :rules="requiredValidation"/>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="6" md="6">
                <v-text-field outlined dense type="number" label="Max Person Allowed" v-model="roomsFormDetails.maxPerson" :rules="requiredValidation"/>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-file-input outlined show-size counter multiple dense label="SelectImage" v-model="roomsFormDetails.file" @change="roomsFormDetails.file ? getImageUrl(roomsFormDetails.file[0]) : false" :rules="requiredValidation"/>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-row>
            <v-col class="text-center">
              <v-btn text @click="$refs.roomsForm.reset(); saveBtn = true; updateBtn = false; roomFormDia = false ">Cancel</v-btn>
              <v-btn class="mx-3" color="#EF5350" v-show="saveBtn" :loading="btnLoading" @click="saveRoomDetails">Save</v-btn>
              <v-btn class="mx-3" color="#EF5350" v-show="updateBtn" :loading="btnLoading" @click="updateRoomDetails">Update</v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <table-data :data="RoomsDetails" class="my-3 pa-3"/>
  </div>
</template>

<script>
import TableData from '../../components/TableData.vue'
export default {
  components: { TableData },
  data () {
    return {
      roomFormDia: false,
      RoomType: ['Ac', 'Non Ac'],
      RoomsDetails: {
        headers: [
          { text: 'Room Number', value: 'roomNumber' }, { text: 'Number of Bed', value: 'numberOfBed' }, { text: 'Room Type', value: 'roomType' }, { text: 'Rate', value: 'rate' }, { text: 'Max Person', value: 'maxPerson' }, { text: 'Image', value: 'image' }, { text: 'Actions', value: 'actions'}
        ],
        list: [],
        loading: true,
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
    async saveRoomDetails () {
      if(this.$refs.roomsForm.validate()) {
        this.btnLoading =  true
        this.roomsFormDetails.status = 'Free'
        this.roomsFormDetails.isAssigned = ''
        await this.postDetailsToApi('https://traineesapi.firebaseio.com/rooms.json',this.roomsFormDetails)
        await this.getTableDetails()
        this.roomFormDia = false
        this.$refs.roomsForm.reset()
      }
    },
    async getTableDetails () {
      let roomDetails = await this.getDetailsFromApi('https://traineesapi.firebaseio.com/rooms.json')
      if (roomDetails) this.RoomsDetails.list = await this.getArrayObjFromObjList(roomDetails)
      this.RoomsDetails.loading = this.btnLoading = false
    },
    editRoomDetails (roomdetails) {
      this.roomsFormDetails = Object.assign({}, roomdetails)
      this.roomsFormDetails.file = [{}]
      this.saveBtn = false
      this.updateBtn = this.roomFormDia = true
    },
    async updateRoomDetails () {
      if(this.$refs.roomsForm.validate()) {
        this.btnLoading = true
        await this.updateDetailsToApi('https://traineesapi.firebaseio.com/rooms/' + this.roomsFormDetails.id + '.json', this.roomsFormDetails)
        await this.getTableDetails()
        this.saveBtn = true
        this.updateBtn = this.roomFormDia = false
        this.$refs.roomsForm.reset()
      }
    },
    delRoomDetails (item) {
      item.url = 'https://traineesapi.firebaseio.com/rooms/' + item.id + '.json'
      this.$store.commit('showDelDialog', item)
      this.getTableDetails()
    },
    getImageUrl (file) {
      if (file) {
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