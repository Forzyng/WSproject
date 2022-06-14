import { createStore } from 'vuex'
import toasts from '@/store/toasts'
import logs from '@/store/logs'
import auth from '@/store/modules/auth'
import profile from '@/store/modules/profile'

export default createStore({
  state: {
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    toasts,
    logs,
    auth,
    profile
  }
})
