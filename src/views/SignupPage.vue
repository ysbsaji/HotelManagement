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
              <v-text-field prepend-icon="mdi-person" label="Username"></v-text-field>
              <v-text-field prepend-icon="mdi-lock" label="Password" type="password"></v-text-field>
              <v-card-actions>
                <v-btn primary large block to="/roomsmanagement">Login</v-btn>
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
import NavigationBar from "../components/NavigationBar";

export default {
  components: { NavigationBar },
  data () {
    return{
      //
    }
  },
  methods: {
   //
  }
}
</script>