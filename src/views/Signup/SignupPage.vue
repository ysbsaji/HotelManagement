<template>
  <div>
    <NavigationBar/>
    <v-container class="signin">
      <v-layout class="text-center my-12 ml-12">
        <v-flex>
          <img src="https://img.freepik.com/free-vector/login-concept-illustration_114360-757.jpg?size=338&ext=jpg" alt="" width="80%">
        </v-flex>
        <v-flex class="grey lighten-4">
          <v-container style="position: relative;top: 13%;" class="text-center">
            <v-card flat>
              <v-card-title primary-title>
                <h4>Login</h4>
              </v-card-title>
              <v-form ref="signinForm">
              <v-text-field prepend-icon="mdi-person" label="User Email" v-model="signInFormData.userEmail" :rules="emailValidation"></v-text-field>
              <v-text-field prepend-icon="mdi-lock" label="Password" type="password" v-model="signInFormData.password" :rules="passwordValidation"></v-text-field>
              <v-card-actions>
                <v-btn primary large block @click="signIn">Login</v-btn>
              </v-card-actions>
              </v-form>
            </v-card>
          </v-container>
        </v-flex>
      </v-layout>
    </v-container>
    <v-snackbar v-model="snackbarForSignin">Wrong email or password
      <template v-slot:action>
        <v-btn
          color="pink"
          text
          @click="snackbarForSignin = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import NavigationBar from "../../components/NavigationBar";

export default {
  components: { NavigationBar },
  data () {
    return {
      snackbarForSignin: false,
      signInFormData: {},
      userDetails: []
    }
  },
  methods: {
  signIn () {
    if (this.$refs.signinForm.validate()) {
      this.userDetails.forEach(val => {
        if (val.email === this.signInFormData.userEmail && val.password === this.signInFormData.password) {
          localStorage.setItem('userDetails', JSON.stringify(val))
          localStorage.setItem('authentication', true)
          this.$router.push('roomstaffassign')
          this.$refs.signinForm.reset()
        }else { this.snackbarForSignin = true }
      })
    }
  },
  async getDetails () {
    let empDetails = await this.getDetailsFromApi('https://traineesapi.firebaseio.com/employeeDetails.json')
    if (empDetails) this.userDetails = this.getArrayObjFromObjList(empDetails)
  }
  },
  mounted () {
    this.getDetails()
  }
}
</script>

<style scoped>
.signin{
  padding-right: 20%;
  padding-left: 20%
}
</style>