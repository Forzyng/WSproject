import forms from '@/store/modules/auth/forms'
import router from '@/router'
export default {
  state: {
    JwtToken: localStorage.getItem('JwtToken') || null,
    user: JSON.parse(localStorage.getItem('user')) || null
  },
  getters: {
    JwtToken: (state) => state.JwtToken,
    user: (state) => state.user
  },
  mutations: {
    JwtToken: (state, data) => {
      state.JwtToken = data
      localStorage.setItem('JwtToken', data)
    },
    user: (state, data) => {
      state.user = data
      localStorage.setItem('user', JSON.stringify(data))
    }
  },
  actions: {
    UserLogout ({ state, commit, dispatch }, data = null) {
      commit('JwtToken', null)
      commit('user', null)
      localStorage.clear()
      router.push('/login')
    }
  },
  modules: {
    forms,
    router
  }
  // ...

}
