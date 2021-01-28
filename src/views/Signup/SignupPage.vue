<template>
  <div>
    <NavigationBar/>
    <v-container>
      <v-layout class="text-center my-12 ml-12">
        <v-flex>
          <v-card height="">
            <img src="https://img.freepik.com/free-vector/login-concept-illustration_114360-757.jpg?size=338&ext=jpg" alt="" width="80%">
          </v-card>
        </v-flex>
        <v-flex class="grey lighten-4">
          <v-container style="position: relative;top: 13%;" class="text-center">
            <v-card flat>
              <v-card-title primary-title>
                <h4>Login</h4>
              </v-card-title>
              <v-form>
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
  </div>
</template>

<script>
import NavigationBar from "../../components/NavigationBar";

export default {
  components: { NavigationBar },
  data () {
    return{
      signInFormData: {},
      userDetails: []
    }
  },
  methods: {
  signIn(){
    this.$router.push('roomsmanagement')
    // this.userDetails.forEach(val => {
    //   if(val.email === this.signInFormData.userEmail && val.password === this.signInFormData.password) this.$router.push('roomsmanagement')
    // })
  },
  async getDetails(){
    let empDetails = await this.getDetailsFromApi('https://traineesapi.firebaseio.com/employeeDetails.json')
    this.userDetails = this.getArrayObjFromObjList(empDetails)
  }
  },
  mounted () {
    this.getDetails()
  }
}
</script>