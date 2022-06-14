import router from '@/router'

export default {
  // namespace: true,
  state: {
    passwordForLogin: '',
    loginForLogin: '',
    login: '',
    avatar: JSON.parse(localStorage.getItem('avatar')) || '',
    email: '',
    password: '',
    registerCheck: false,
    ErrorsValidation: null,
    Sending: false
  },
  getters: {
    canRegister: (state) => {
      if (state.login.length === 0) return false
      if (state.email.length === 0) return false
      if (state.password.length === 0) return false
      if (state.Sending === true) return false
      return true
    },
    canLogin: (state) => {
      if (state.loginForLogin.length === 0) return false
      if (state.passwordForLogin.length === 0) return false
      if (state.Sending === true) return false
      return true
    },
    passwordForLogin: (state) => state.passwordForLogin,
    loginForLogin: (state) => state.loginForLogin,
    login: (state) => state.login,
    email: (state) => state.email,
    password: (state) => state.password,
    registerCheck: (state) => state.registerCheck,
    ErrorsValidation: (state) => state.ErrorsValidation,
    Sending: (state) => state.Sending,
    avatar: (state) => state.avatar
  },
  mutations: {
    passwordForLogin: (state, data) => { state.passwordForLogin = data },
    loginForLogin: (state, data) => { state.loginForLogin = data },
    login: (state, data) => { state.login = data },
    email: (state, data) => { state.email = data },
    password: (state, data) => { state.password = data },
    registerCheck: (state, data) => { state.registerCheck = data },
    ErrorsValidation: (state, data) => { state.ErrorsValidation = data },
    Sending: (state, data) => { state.Sending = data },
    avatar: (state, data) => {
      state.avatar = data
      console.log(state.avatar)
      localStorage.setItem('avatar', JSON.stringify(data))
    }
  },
  actions: {
    email ({ commit, dispatch }, data) {
      if (!data) data = ''
      commit('email', data)
      dispatch('validateForm')
    },
    password ({ commit, dispatch }, data) {
      if (!data) data = ''
      commit('password', data)
      dispatch('validateForm')
    },
    registerCheck ({ commit, dispatch }, data) {
      commit('registerCheck', data)
      dispatch('validateForm')
    },
    validateForm ({ state, commit, dispatch }, data = null) {
      commit('ErrorsValidation', null)
      const login = state.login
      const email = state.email
      const password = state.password
      const registerCheck = state.registerCheck
      if (email.length <= 5 || email.length >= 35) { commit('ErrorsValidation', 'Email must be more than 5 symbols but less than 35') }
      if (password.length <= 5 || password.length >= 35) { commit('ErrorsValidation', 'Password must be more than 5 symbols but less than 35') }
      if (login.length <= 5 || login.length >= 20) { commit('ErrorsValidation', 'Login must be more than 5 symbols but less than 20') }
      if (registerCheck === false) { commit('ErrorsValidation', 'You need to be agree with our privacy') }
    },
    validateLoginForm ({ state, commit, dispatch }, data = null) {
      commit('ErrorsValidation', null)
      const login = state.loginForLogin
      const password = state.passwordForLogin
      if (password.length <= 5 || password.length >= 35) { commit('ErrorsValidation', 'Invalid Attemp') }
      if (login.length <= 5 || login.length >= 20) { commit('ErrorsValidation', 'Invalid Attemp') }
    },
    apiTryCrateUser ({ state, commit, dispatch }, data = null) {
      console.log('Try create')
      const newUser = {
        login: state.login,
        email: state.email,
        password: state.password
      }
      dispatch('validateForm')
      console.log('Valid')
      if (state.ErrorsValidation) {
        dispatch('toastError', state.ErrorsValidation)
        console.log('Return false')
        return false
      }
      commit('Sending', true)
      console.log('Fetch')
      fetch('http://localhost:3000/api/tryCreateUser', {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          'Content-Type': 'application/json'
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *client
        body: JSON.stringify(newUser) // body data type must match "Content-Type" header
      })
        .then(res => {
          if (res.ok) {
            commit('Sending', false)
            return res.json()
          } else {
            commit('Sending', false)
            dispatch('toastInfo', 'User Already Exist')
          }
        })
        .then(json => {
          if (!json) return
          console.log(json)
          dispatch('toastSuccess', ' User Created. Check your email to confirm acc')
          // this.$router.push({ name: 'home' })
          // TODO  уйти на другой маршрут, сообщить что все хорошо
        })
        .catch(err => {
          dispatch('errorLogAjax', err)
          commit('Sending', false)
        })
    },
    apiTryLogin ({ state, commit, dispatch }) {
      console.log('Try to login')
      const user = {
        email: state.loginForLogin,
        password: state.passwordForLogin
      }
      console.log('Validating')
      dispatch('validateLoginForm')
      if (state.ErrorsValidation) {
        dispatch('toastError', state.ErrorsValidation)
        return false
      }
      commit('Sending', true)
      console.log('Fetch')
      fetch('http://localhost:3000/api/auth', {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          'Content-Type': 'application/json'
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *client
        body: JSON.stringify(user) // body data type must match "Content-Type" header
      })
        .then(res => {
          if (res.status === 200) {
            commit('Sending', false)
            return res.json()
          } else {
            if (res.status === 401) {
              dispatch('toastInfo', 'You need to confirm acc')
              commit('Sending', false)
            } else {
              dispatch('toastError', 'Invalid Data')
              commit('Sending', false)
            }
          }
        }
        )
        .then(json => {
          if (!json) return
          console.log(json)
          dispatch('toastSuccess', ' You successfully entered ')
          commit('JwtToken', json.token)
          commit('user', json.user)
          commit('avatar', json.user.avatar)
          router.push('/myprofile')
          // this.$router.push({ name: 'login', query: { redirect: '/' } })
          // TODO  уйти на другой маршрут, сообщить что все хорошо
        })
        .catch(err => {
          dispatch('errorLogAjax', err)
          commit('Sending', false)
        })
    }
  },
  modules: {
    router
  }

}
