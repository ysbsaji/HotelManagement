<template>
    <v-container fluid>
      <NavigationBar/>
    <v-carousel hide-delimiters cycle>
      <v-carousel-item
        v-for="(item,i) in carouselItems"
        :key="i"
        :src="item.src"
      ></v-carousel-item>
    </v-carousel>
    <div class="my-6">
      <p class="display-1 text-center">Hospitality Solutions</p>
      <v-row>
        <v-col cols="6" class="text-center"><img src="https://www.staah.com/images/STAAH_Beta_STAAH_Beta_hm_cm.jpg" alt="No Image"> </v-col>
        <v-col cols="6">
          <p class="headline  pa-8 my-12">"It's not your customer's job to remember you, it is your obligation and responsibilty to make sure they don't have to change to forget you."</p>
        </v-col>
      </v-row>
    </div>
    <v-parallax :src="imageLink.main" height="500">
      <v-layout column align-center justify-center>
        <div class="headline white--text mb-3 text-xs-center">Powering Your Online Revenue</div>
        <em>Hospitality Technology Solutions to attract, convert, analyse and maximise your bookings.</em>
      </v-layout>
    </v-parallax>
    <v-row>
      <v-col cols="6" class="text-center mt-12"> 
        <img height="200px" :src="imageLink.logo">
      </v-col>
      <v-col cols="6"  class="text-center">
        <v-form>
          <v-container>
            <h1 class="my-6">Leave your Comment here...!</h1>
            <v-row>
              <v-col cols="12 px-12">
                <v-text-field dense label="Name" outlined></v-text-field>
                <v-text-field  dense  label="Email" placeholder="Placeholder" outlined></v-text-field>
                <v-textarea label="Comment"  auto-grow outlined rows="3" ></v-textarea>
                <v-btn depressed>Submit</v-btn>
                <v-btn depressed class="mx-2">Clear</v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-col>
    </v-row>
    <v-parallax :src="imageLink.social_cover" height="380">
      <v-layout column align-center justify-center>
        <div class="headline white--text mb-3 text-xs-center">We are dropping cool news on socials</div>
      </v-layout>
      <v-layout justify-space-around justify-center>
        <v-icon x-large dark>mdi-facebook</v-icon>
        <v-icon x-large dark>mdi-twitter</v-icon>
        <v-icon x-large dark>mdi-whatsapp</v-icon>
        <v-icon x-large dark>mdi-instagram</v-icon>
        <v-icon x-large dark>mdi-discord</v-icon>
      </v-layout>
    </v-parallax>
  </v-container>
</template>

<script>
import NavigationBar from "../../components/NavigationBar";
export default {
  components: { NavigationBar },
  data () {
    return {
      carouselItems: [
        { src: 'https://miro.medium.com/max/2400/1*XUrSasLtkB0VoXcLEMfJKg.jpeg'}, { src: 'https://wallpapercave.com/wp/wp1846066.jpg'}, { src: 'https://wallpapercave.com/wp/wp1846094.jpg'}, { src: 'https://www.wallpapertip.com/wmimgs/86-862208_encore-resort-king-room.jpg'}
      ],
      imageLink: {
        main: "https://firebasestorage.googleapis.com/v0/b/endorfinevue.appspot.com/o/assets%2Fb13f0434-b228-11e6-8e5d-5252025056ab_web_scale_0.4666667_0.4666667__.jpg?alt=media&token=660df23e-599e-434b-9313-ba69c973eeea",
        logo: "https://image.shutterstock.com/image-vector/hotel-vector-icon-on-white-260nw-408618085.jpg",
        social_cover: "https://firebasestorage.googleapis.com/v0/b/endorfinevue.appspot.com/o/assets%2Fo-NIGHTCLUB-facebook.jpg?alt=media&token=cefc5c4c-9714-41da-9c22-f63caf5e89a4"
      }
    }
  },
}
</script>
