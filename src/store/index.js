import Vue from 'vue'
import Vuex from 'vuex'
import test from './test';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    showDelDialog: false,
    delDetails : {},
    userDetails: null,
    imgDialog: false,
    image: ''
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
    },
    imgDialog (state, data) {
      state.imgDialog = data
    },
    assignImg (state, data) {
      state.image = data.image
    }
  },
  actions: {
    userRoleChange (payload,data) {
      payload.commit('userDetails', data)
    },
    imgDialog (payload, data) {
      payload.commit('imgDialog', true)
      payload.commit('assignImg', data)
    }
  },
  modules: {
    test
  },
  getters: {
    getDelDialog (state) {
      return state.showDelDialog
    },
  }
})
