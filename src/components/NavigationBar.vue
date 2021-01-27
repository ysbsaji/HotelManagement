<template>
  <div>
    <v-app-bar app color="white">
      <v-avatar
        color="grey-lighten"
        size="60"
        class="mr-6"
      ><img src="https://image.shutterstock.com/image-vector/hotel-vector-icon-on-white-260nw-408618085.jpg" alt="Image is not available"></v-avatar>
      <v-toolbar-title class="mt-2"><img src="@/assets/logo-hotel.png" alt="Image is not available"></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn depressed class="mx-3 white btn btnHover" to="/signuppage">Sign In</v-btn>
        <v-btn class="mx-3 white btn btnHover" to="/roomspage" depressed>Rooms</v-btn>
        <v-btn depressed class="mx-3 white btn btnHover" to="CafeteriaPage">Cafeteria</v-btn>
        <v-btn class="mx-3 white btn btnHover" to="/" depressed>Home</v-btn>
      </v-toolbar-items>
    </v-app-bar>
  </div>
</template>

<script>
export default {
  data () {
    return {
      //
    }
  },
  methods: {
    // 
  },
  computed: {
    //
  },
  mounted () {
    //
  }
};
</script>

<style scoped>

.btn:hover, .btn:focus {
  color: #fff;
  outline: 0;
}

.btnHover {
  -webkit-transition: box-shadow 300ms ease-in-out, color 300ms ease-in-out;
  transition: box-shadow 300ms ease-in-out, color 300ms ease-in-out;
}
.btnHover:hover {
  box-shadow: 0 0 40px 40px #e74c3c inset;
}
</style>