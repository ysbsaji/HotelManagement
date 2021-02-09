<template>
  <div>
    <v-card flat>
    <v-card-title>
      Your Information
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text v-for="(item, index) in userDetails" :key="index">
      <p><b>Room Number :</b>{{ item.roomNumber }}</p>
      <p><b>Room Type :</b>{{ item.roomType }}</p>
      <p><b>Customer Name :</b>{{ item.cus.name }}</p>
      <p><b>Contact Number :</b>{{ item.cus.contactNumber }}</p>
      <p><b>CheckIn Date :</b>{{ item.cus.checkInDate }}</p>
      <p><b>CheckOut Date :</b>{{ item.cus.checkOutDate }}</p>
    </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      userDetails: []
    }
  },
  mounted () {
    let details = localStorage.getItem('userDetails')
    this.userDetails = [JSON.parse(details)]
  }
}
</script>

<style>

</style>