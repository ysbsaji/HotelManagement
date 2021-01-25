<template>
  <v-app>
    <form ref="roomsForm">
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="6" md="4">
            <v-text-field outlined dense label="Room Number" v-model="roomsFormDetails.roomNumber"/>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field outlined dense type="number" label="Number of bed" v-model="roomsFormDetails.numberOfBed"/>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-select :items="RoomType" outlined dense label="Room Type" v-model="roomsFormDetails.roomType"></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" sm="6" md="4">
            <v-text-field outlined dense type="number" label="Rate" v-model="roomsFormDetails.rate"/>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field outlined dense type="number" label="Max Person Allowed" v-model="roomsFormDetails.maxPerson"/>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field outlined dense label="Image"/>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-row>
          <v-col class="text-center">
            <v-btn text>
              Cancel
            </v-btn>
            <v-btn class="mx-3" color="#EF5350" @click="saveRoomDetails">
              Save
            </v-btn>
             <v-btn class="mx-3" color="#EF5350" >
              Update
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </form>
    <table-data :data="RoomsDetails"/>
  </v-app>
</template>

<script>
import TableData from '../../components/TableData.vue'
export default {
  components: { TableData },
  data () {
    return {
      RoomType: ['Ac', 'Non Ac'],
      RoomsDetails: {
        headers: [
          { text: 'Id', value: 'id' }, { text: 'Room Number', value: 'roomNumber' }, { text: 'Number of Bed', value: 'numberOfBed' }, { text: 'Room Type', value: 'roomType' }, { text: 'Rate', value: 'rate' }, { text: 'Max Person', value: 'maxPerson' }, { text: 'Actions', value: 'actions'}
        ],
        list: [ { id: 9}],
        actionsList:[{
            click: (item) => this.edit(item),
            icon:'mdi-pencil'
          },{
            click: (item) => this.del(item),
            icon:'mdi-delete'
          }]
      },
      roomsFormDetails: {}
    }
  },
  methods: {
    edit (item) {
      console.log(item)
    },
    saveRoomDetails(){
      this.$http.post('https://traineesapi.firebaseio.com/rooms.json', JSON.stringify(this.roomsFormDetails))
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
    }
  }
}
</script>

<style>

</style>
    NavigationBar