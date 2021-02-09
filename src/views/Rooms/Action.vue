<template>
  <div>
    <v-card flat>
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
  </div>
</template>

<script>
export default {
  data () {
    return {
      RoomType: ['Ac', 'Non Ac'],
      roomsFormDetails: {}
    }
  },
  async mounted () {
    if (this.$route.params.name !== 'new'){
      this.roomsFormDetails = await this.getDetailsFromApi(`https://traineesapi.firebaseio.com/rooms/${this.$route.params.name}.json`)
      this.roomsFormDetails.file = [{}]
      this.saveBtn = false
      this.updateBtn = true
    }
  },
  methods: {
    async saveRoomDetails () {
      if(this.$refs.roomsForm.validate()) {
        this.btnLoading =  true
        this.roomsFormDetails.status = 'Free'
        this.roomsFormDetails.isAssigned = ''
        let details = await this.postDetailsToApi('https://traineesapi.firebaseio.com/rooms.json',this.roomsFormDetails)
        this.$router.push({ path: `/roomspage/actions/${details.name}`})
        // this.$router.push('/roomspage/roomsmanagement')
        this.btnLoading =  false
        this.$refs.roomsForm.reset()
      }
    },
     async updateRoomDetails () {
      if(this.$refs.roomsForm.validate()) {
        this.btnLoading = true
        await this.updateDetailsToApi('https://traineesapi.firebaseio.com/rooms/' + this.$route.params.name + '.json', this.roomsFormDetails)
        this.saveBtn = true
        this.updateBtn = false
        this.$router.push('/roomspage/roomsmanagement')
        this.$refs.roomsForm.reset()
      }
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
}
</script>

<style>

</style>