import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Axios from 'axios'
import vuetify from './plugins/vuetify'
import Common from './mixins/Common'
import Validation from './mixins/validation'
import VDigitalTimePicker from 'v-digital-time-picker'
import VueCookies from 'vue-cookies'
Vue.use(VueCookies)

Vue.use(VDigitalTimePicker)

let mixins = { Common, Validation }
Object.keys(mixins).forEach(key => {
  Vue.mixin(mixins[key])
})

Vue.prototype.$http = Axios;
Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
