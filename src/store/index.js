import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    showDelDialog: false,
    delDetails : {},
    userDetails: null,
  },
  mutations: {
    showDelDialog (state, data) {
      state.delDetails = data
      state.showDelDialog = true 
    },
    hideDelDialog (state, data) {
      state.showDelDialog = data
    },
    userDetails (state, data) {
      state.userDetails = data
    }
  },
  actions: {
    userRoleChange (payload,data) {
      payload.commit('userDetails', data)
    }
  },
  modules: {
  }
})
