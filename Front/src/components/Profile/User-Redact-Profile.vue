<template>
  <div class="container rounded bg-white mt-5 mb-5">
    <div class="row">
      <div class="col-md-3 border-right">
        <div class="d-flex flex-column align-items-center text-center p-3 py-5"><span class="font-weight-bold"> Previous</span><img v-bind:src=MainAvatarUrl alt="avatar" class="rounded-circle img-fluid" style="width: 150px;"> <span v-if="isBuf" class="font-weight-bold"> New</span> <img v-if="isBuf" v-bind:src=currentAvatarUrl  class="rounded-circle img-fluid" style="width: 150px;"><span class="font-weight-bold"> Login: {{ UserLogin }}</span>
          <div class="input-group">
            <div class="input-group-prepend">
              <span @click="RestoreUserAvatar" class="input-group-text" id="inputGroupFileAddon01" href="#" ><img src="http://localhost:3000/store/icons/trash_can_icon.png"  style="width:25px;" /></span>
            </div>
            <div class="custom-file">
              <input @change="uploadAvatar" type="file" accept=".jpg, .jpeg, .png, .bmp"  class="custom-file-input" id="inputGroupFile01" name="inputGroupFile01"
                     aria-describedby="inputGroupFileAddon01">
              <label class="custom-file-label" for="inputGroupFile01"></label>

            </div>
          </div>
        </div>
      </div>
      <div class="col-md-5 border-right">
        <div class="p-3 py-5">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h4 class="text-right">Profile Settings</h4>
          </div>
          <div class="row mt-3">
            <div class="col-md-12"><label class="labels">Full name</label><input type="text" class="form-control" placeholder="Full name" v-model="UserFullName"></div>
            <div class="col-md-12"><label class="labels">Description</label><textarea v-model="UserDescription" placeholder="Description" style="resize: none; height: 150px; margin-bottom: 7px;" maxlength="250" id="form10" class="md-textarea form-control" rows="3"></textarea></div>
          </div>
          <div class="mt-5 text-center"><button class="btn btn-primary profile-button" type="button" @click="saveUser" :disabled=canSendForm>Save Profile</button></div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="p-3 py-5">
          <div class="d-flex justify-content-between align-items-center experience"><span>Edit Policy</span><button class="btn btn-primary profile-button" type="button" :disabled=canSendForm>Save Policy</button></div><br>
          <div class="col-md-12"><label class="labels">Password</label><input type="text" class="form-control" placeholder="Password" value=""></div> <br>
          <div class="col-md-12"><label class="labels">Email</label><input type="text" class="form-control" placeholder="Email" v-model="UserEmail"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex'
import { computed } from 'vue'
export default {
  name: 'User-Redact-Profile',
  setup () {
    const store = useStore()
    return {
      MainAvatarUrl: computed(() => 'http://localhost:3000/store/avatars' + store.getters.user.avatar),
      currentAvatarUrl: computed(() => 'http://localhost:3000/uploads' + store.getters.fileName),
      UserLogin: computed(() => store.getters.user.login),
      isBuf: computed(() => store.getters.isBuf),
      saveUser: function () {
        store.dispatch('tryUpdateUser')
      },
      RestoreUserAvatar: function () {
        store.dispatch('RestoreUserAvatar')
      },
      UserFullName: computed({
        get () {
          return store.getters.user.fullname
        },
        set (data) {
          store.commit('newFullname', data)
        }
      }),
      UserDescription: computed({
        get () {
          return store.getters.user.description
        },
        set (data) {
          store.commit('newDescription', data)
        }
      }),
      UserEmail: computed({
        get () {
          return store.getters.user.email
        },
        set (data) {
          store.commit('newEmail', data)
        }
      }),
      uploadAvatar: function (e) {
        const files = e.target.files || e.dataTransfer.files
        if (!files.length) return
        store.dispatch('apiUploadAvatar', files[0])
      },
      canSendForm: computed(() => !store.getters.canUpdateUser)
    }
  }
}
</script>

<style scoped>
body {
  background: rgb(99, 39, 120)
}

.form-control:focus {
  box-shadow: none;
  border-color: #BA68C8
}

.profile-button {
  background: rgb(99, 39, 120);
  box-shadow: none;
  border: none
}

.profile-button:hover {
  background: #682773
}

.profile-button:focus {
  background: #682773;
  box-shadow: none
}

.profile-button:active {
  background: #682773;
  box-shadow: none
}

.back:hover {
  color: #682773;
  cursor: pointer
}

.labels {
  font-size: 11px
}

.add-experience:hover {
  background: #BA68C8;
  color: #fff;
  cursor: pointer;
  border: solid 1px #BA68C8
}
</style>
