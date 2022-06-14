import router from '@/router'

export default {
  // namespace: true,
  state: {
    fileName: null,
    newPassword: '',
    newEmail: '',
    newFullname: '',
    newDescription: '',
    ErrorsValidationUpdating: null,
    Updating: false
  },
  getters: {
    canUpdatePrivacy: (state) => {
      if (state.newPassword.length === 0 && state.newEmail.length === 0) return false
      return true
    },
    canUpdateUser: (state) => {
      if (state.Updating === true) return false
      return true
    },
    fileName: (state) => state.fileName,
    newPassword: (state) => state.newPassword,
    newEmail: (state) => state.newEmail,
    newFullname: (state) => state.newFullname,
    newDescription: (state) => state.newDescription,
    ErrorsValidationUpdating: (state) => state.ErrorsValidation,
    Updating: (state) => state.Sending,
    isBuf: (state) => {
      if (state.fileName === null) return false
      return true
    },
    currentAvatarUrl: (state) => {
      if (state.user) { // если я залогинен
        if (state.user.avatar) { // если у меня есть аватар
          return state.user.avatar + '?updated_at=' + state.user.updated_at
        }
      }
      return null
    }
  },
  mutations: {
    newPassword: (state, data) => { state.newPassword = data },
    newEmail: (state, data) => { state.newEmail = data },
    newFullname: (state, data) => { state.newFullname = data },
    newDescription: (state, data) => { state.newDescription = data },
    ErrorsValidationUpdating: (state, data) => { state.ErrorsValidationUpdating = data },
    Updating: (state, data) => { state.Updating = data },
    fileName: (state, data) => {
      state.fileName = data
      console.log(state.fileName)
    }
  },
  actions: {
    RestoreUserAvatar ({ state, commit, dispatch }, data = null) {
      commit('fileName', data)
    },
    validateUpdatePrivacyForm ({ state, commit, dispatch }, data = null) {
      commit('ErrorsValidation', null)
      const email = state.newEmail
      const password = state.newPassword
      if (password.length <= 5 || password.length >= 35) { commit('ErrorsValidation', 'Invalid Data') }
      if (email.length <= 5 || email.length >= 30) { commit('ErrorsValidation', 'Invalid Data') }
    },
    btnRedirectToUpdate ({ state, commit, dispatch }, data = null) {
      router.push('/redactprofile')
    },
    apiTryUpdatePolicyUser ({ state, commit, dispatch }, data = null) {
      console.log('Try to update')
      const body = {
        email: state.newEmail,
        password: state.newPassword
      }
      dispatch('validateUpdatePrivacyForm')
      console.log('Valid')
      if (state.ErrorsValidation) {
        dispatch('toastError', state.ErrorsValidation)
        console.log('Return false')
        return false
      }
      commit('Updating', true)
      console.log('Fetch')
      fetch('http://localhost:3000/api/', {
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
        body: JSON.stringify(body) // body data type must match "Content-Type" header
      })
        .then(res => {
          if (res.ok) {
            commit('Updating', false)
            return res.json()
          } else {
            commit('Updating', false)
            dispatch('toastInfo', 'Ooops smth went wrong')
          }
        })
        .then(json => {
          if (!json) return
          console.log(json)
          dispatch('toastSuccess', ' User Policy updated')
          // this.$router.push({ name: 'home' })
          // TODO  уйти на другой маршрут, сообщить что все хорошо
        })
        .catch(err => {
          dispatch('errorLogAjax', err)
        })
    },
    tryUpdateUser ({ state, commit, dispatch }) {
      console.log('Try to update')
      if (state.fileName === null) {
        commit('fileName', JSON.parse(localStorage.getItem('avatar')))
      }
      if (/\d/.test(state.newFullname.value)) {
        return false
      }
      const user = {
        fullname: state.newFullname,
        description: state.newDescription,
        avatar: state.fileName
      }
      commit('Updating', true)
      console.log('Fetch')
      fetch('http://localhost:3000/api/tryUpdateUser', {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          authorization: localStorage.getItem('JwtToken'),
          'Content-Type': 'application/json'
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *client
        body: JSON.stringify(user) // body data type must match "Content-Type" header
      })
        .then(res => {
          if (res.ok) {
            commit('Updating', false)
            return res.json()
          } else {
            dispatch('toastError', 'Invalid Data')
            commit('Updating', false)
          }
        }
        )
        .then(json => {
          if (!json) return
          console.log(json)
          dispatch('toastSuccess', ' You successfully updated user ')
          const upduser = JSON.parse(localStorage.getItem('user'))
          upduser.description = state.newDescription
          console.log(state.newDescription)
          upduser.fullname = state.newFullname
          console.log(state.newFullname)
          //
          upduser.avatar = state.fileName
          console.log(state.fileName)
          console.log(upduser)
          localStorage.removeItem('user')
          localStorage.setItem('user', JSON.stringify(upduser))
          commit('user', upduser)
          commit('avatar', upduser.avatar)
          router.push('/myprofile')
          // this.$router.push({ name: 'login', query: { redirect: '/' } })
        })
        .catch(err => {
          dispatch('errorLogAjax', err)
          commit('Updating', false)
        })
    },
    apiUpdateAvatar ({ state, commit, dispatch }, data = null) {
      console.log(localStorage.getItem('JwtToken'))
      fetch('http://localhost:3000/users/updateAvatar', {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        // credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          authorization: localStorage.getItem('JwtToken'),
          // 'Content-Type': 'multipart/form-data charset=utf-8; boundary=' + Math.random().toString().substr(2)
          'Content-Type': 'application/json'
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        // redirect: 'follow', // manual, *follow, error
        // referrerPolicy: 'no-referrer', // no-referrer, *client
        body: JSON.stringify({ filename: state.fileName }) // body data type must match "Content-Type" header
      })
        .then(res => {
          console.log(res)
          return res.json()
        })
        .then(json => {
          console.log(json)
          // commit('fileName', json.filename)
          // dispatch('toastSuccess', ' Avatar Uploads ')
          // // TODO  уйти на другой маршрут, сообщить что все хорошо
        })
        .catch(err => {
          dispatch('errorLogAjax', err)
        })
    },
    apiUploadAvatar ({ state, commit, dispatch }, data) {
      dispatch('toastInfo', 'Upload to Server Start')

      const formData = new FormData()
      formData.append('img', data)
      commit('Updating', true)
      fetch('http://localhost:3000/api/helpers/converter/avatar', {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        // credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          authorization: localStorage.getItem('JwtToken')
          // 'Content-Type': 'application/json'
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        // redirect: 'follow', // manual, *follow, error
        // referrerPolicy: 'no-referrer', // no-referrer, *client
        body: formData // body data type must match "Content-Type" header
      })
        .then(res => {
          if (res.ok) {
            commit('Updating', false)
            return res.json()
          } else {
            commit('Updating', false)
            dispatch('toastInfo', 'Ooops smth went wrong')
          }
        })
        .then(json => {
          console.log(json.filename)
          commit('fileName', json.filename)
          dispatch('toastSuccess', ' Avatar Uploads ')
          // TODO  уйти на другой маршрут, сообщить что все хорошо
        })
        .catch(err => {
          dispatch('errorLogAjax', err)
          commit('Updating', false)
        })
    }
  },
  modules: {
    router
  }

}
