<template>
  <v-app class="grey lighten-4" style="background-image: url('https://images.unsplash.com/photo-1604403428907-673e7f4cd341?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MTF8fGxvZ2lufGVufDB8fDB8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'); width: 100%;  background-repeat:repeat">
    <NavigationBar/>
    <v-container class="signin">
      <v-row justify="center" class="mx-auto">
        <v-col cols="12" lg="4" md="4" class="text-center">
          <v-card flat>
            <v-card-title>
              <h4>Login</h4>
            </v-card-title>
            <v-divider></v-divider>
            <v-form ref="signinForm" class="px-8">
            <v-text-field prepend-icon="mdi-account" label="User Email" v-model="signInFormData.userEmail" :rules="emailValidation"></v-text-field>
            <v-text-field prepend-icon="mdi-lock" label="Password" type="password" v-model="signInFormData.password" :rules="passwordValidation"></v-text-field>
            <v-checkbox v-model="customerCheckbox" label="I am a customer"></v-checkbox>
            <v-card-actions>
              <v-btn primary large block @click="signIn">Login</v-btn>
            </v-card-actions>
            </v-form>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-snackbar v-model="snackbarForSignin">Wrong email or password
      <template v-slot:action>
        <v-btn color="pink" text @click="snackbarForSignin = false">Close</v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>
import NavigationBar from "../../components/NavigationBar";
import VueCookies from 'vue-cookies'

export default {
  components: { NavigationBar },
  data () {
    return {
      snackbarForSignin: false,
      signInFormData: {},
      userDetails: [],
      customerArr: [],
      customerCheckbox: false
    }
  },
  methods: {
  signIn () {
    if (this.$refs.signinForm.validate()) {
      this.userDetails.find(val => {
        // if (this.customerCheckbox) {
        //   this.customerArr.forEach(value => {
        //     if (value.bookingDetails) value.bookingDetails.forEach(val => {
        //       val.email === this.signInFormData.userEmail && val.password === this.signInFormData.password  ? (value.cus = val , this.setLoginDetails(value), this.$router.push('customer')) : this.snackbarForSignin = true
        //     })
        //   })
        // }else 
        // {
          if (val.email === this.signInFormData.userEmail && val.password === this.signInFormData.password) {
            delete val.image
            this.setCookie('activeUserDetails',JSON.stringify(val),1)
            this.$root.$emit('getUserDetails')
            this.$refs.signinForm.reset()
            this.$router.push('roomspage/')
        } else { this.snackbarForSignin = true }
        // }
      })
    }
  },
  setCookie (cName, cValue, days) {
    var d = new Date();
    d.setTime(d.getTime() + (days*24*60*60*1000));
    var expires = "expires=" + d.toGMTString();
    VueCookies.set(cName, cValue, expires)
  },
  // setLoginDetails (val) {
  //   localStorage.setItem('userDetails', JSON.stringify(val))
  //   this.$root.$emit('getUserDetails')
  //   this.$refs.signinForm.reset()
  // },
  async getDetails () {
    let empDetails = await this.getDetailsFromApi('https://traineesapi.firebaseio.com/employeeDetails.json')
    if (empDetails) this.userDetails = this.getArrayObjFromObjList(empDetails)
    let customer = await this.getDetailsFromApi('https://traineesapi.firebaseio.com/rooms.json')
    this.customerArr = this.getArrayObjFromObjList(customer)
  }
  },
  mounted () {
    this.getDetails()
  }
}
</script>

<style scoped>
.signin {
  margin-top: 10%
}
</style>