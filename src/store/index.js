import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    showDelDialog: false,
    delDetails : {}
  },
  mutations: {
    showDelDialog (state, data){
      state.delDetails = data
      state.showDelDialog = true 
    },
    hideDelDialog(state, data){
      state.showDelDialog = data
    }
  },
  actions: {
  },
  modules: {
  }
})
