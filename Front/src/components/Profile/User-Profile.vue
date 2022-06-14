<template>
  <section style="background-color: #ebebeb;">
    <div class="container py-5">

      <div class="row">
        <div class="col-lg-4">
          <div class="card mb-4">
            <div class="card-body text-center">
              <img v-bind:src=currentAvatarUrl alt="avatar" class="rounded-circle img-fluid" style="width: 150px;">
              <h5 class="my-3">{{ UserLogin }}</h5>
              <p class="text-muted mb-1"> {{ UserFullName }}</p>
              <div class="d-flex justify-content-center mb-1">
                <button style="border-radius: 8px; border: 1px solid #b2b2b2" type="button" class="btn btn-outline-primary ms-1" id="Redact" @click="GoRedact">Redact Profile</button>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-4 mb20" style="text-align:center">
              <h5 class="text-muted mb-0">0</h5>
              <h6 class="text-small text-muted">Followers</h6>
            </div>
            <div class="col-md-4 mb20" style="text-align:center">
              <h5 class="text-muted mb-0">0</h5>
              <h6 class="text-small text-muted">Following</h6>
            </div>
            <div class="col-md-4 mb20" style="text-align:center">
              <h5 class="text-muted mb-0">0</h5>
              <h6 class="text-small text-muted">Posts</h6>
            </div>
          </div>
        </div>
        <div class="col-lg-8">
          <div class="card mb-4">
            <div class="card-body">
              <div class="row">
                <div class="col-sm-3">
                  <p class="mb-0">Here from</p>
                </div>
                <div class="col-sm-9">
                  <p class="text-muted mb-0" id="CreatedAt">{{ UserCreatedAt }}</p>
                </div>
              </div>
              <hr>
              <div class="row">
                <div class="col-sm-3">
                  <p class="mb-0" id="UpdatedAt">Last time updated</p>
                </div>
                <div class="col-sm-9">
                  <p class="text-muted mb-0" id="CreatedAt">{{ UserUpdatedAt }}</p>
                </div>
              </div>
              <hr>
              <div class="row" v-if="UserFullName">
                <div class="col-sm-3">
                  <p class="mb-0" id="UpdatedAt">Full name</p>
                </div>
                <div class="col-sm-9">
                  <p class="text-muted mb-0" id="Fullname">{{ UserFullName }}</p>
                </div>
              </div>
              <hr v-if="UserFullName">
              <div class="row">
                <div class="col-sm-3">
                  <p class="mb-0">Login</p>
                </div>
                <div class="col-sm-9">
                  <p class="text-muted mb-0" id="Login">{{ UserLogin }}</p>
                </div>
              </div>
              <hr>
              <div class="row" v-if="UserDescription">
                <div class="col-sm-3">
                  <p class="mb-0">Description</p>
                </div>
                <div class="col-sm-9">

                  <p class="text-muted mb-0" id="Description">{{ UserDescription }}</p>
                </div>
              </div>
              <hr v-if="UserDescription">

            </div>
          </div>
          <!---->
          <div class="row">
            <div class="col-md-12">
              <div class="card mb-4 mb-md-0">
                <div class="card-body" id="yourimg">
                  <img id="result" />

                </div>
              </div>
            </div>
          </div>

          <form  method="post" enctype="multipart/form-data">
            <div class="row">
              <div class="col-md-12">
                <div class="card mb-4 mb-md-0">
                  <div class="card-body">
                    <div class="md-form">
                      <div class="row">
                        <textarea style="resize: none; height: 150px; margin-bottom: 7px;" maxlength="250" id="form10" class="md-textarea form-control" rows="3"></textarea>
                        <div class="col-md-3">
                          <button class="btn btn-primary" style="border-radius: 8px; border: 1px solid #b2b2b2; ">Add</button>
                        </div>
                        <div class="col-md-9">
                          <div class="input-group">
                            <div class="input-group-prepend">
                              <span class="input-group-text" id="inputGroupFileAddon01" href="#" ><img src="http://localhost:3000/store/icons/trash_can_icon.png"  style="width:25px;" /></span>
                            </div>
                            <div class="custom-file">
                              <input type="file" accept=".jpg, .jpeg, .png, .bmp"  class="custom-file-input" id="inputGroupFile01" name="inputGroupFile01"
                                     aria-describedby="inputGroupFileAddon01">
                              <label class="custom-file-label" for="inputGroupFile01">Choose file</label>

                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>

        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { useStore } from 'vuex'
import { computed } from 'vue'
export default {
  name: 'User-Profile',
  mounted () {
    const FReader = new FileReader()

    // событие, когда файл загрузится
    FReader.onload = function (e) {
      document.querySelector('#result').src = e.target.result
    }

    // выполнение функции при выборки файла
    document.querySelector('input').addEventListener('change', loadImageFile)

    // функция выборки файла
    function loadImageFile () {
      const file = document.querySelector('input').files[0]
      FReader.readAsDataURL(file)
    }
    //
    const but = document.querySelector('#inputGroupFileAddon01')
    const img = document.querySelector('#result')
    const inp = document.querySelector('#inputGroupFile01')
    but.onclick = function () {
      inp.value = ''
      img.src = ''
    }
  },
  setup () {
    const store = useStore()
    return {
      currentAvatarUrl: computed(() => 'http://localhost:3000/store/avatars' + store.getters.user.avatar),
      UserLogin: computed(() => store.getters.user.login),
      UserEmail: computed(() => store.getters.user.email),
      UserDescription: computed(() => store.getters.user.description),
      UserCreatedAt: computed(() => store.getters.user.created_at.toLocaleString()),
      UserUpdatedAt: computed(() => store.getters.user.updated_at.toLocaleString()),
      UserFullName: computed(() => store.getters.user.fullname),
      GoRedact: () => { store.dispatch('btnRedirectToUpdate') }
    }
  }
}
</script>

<style scoped>

</style>
