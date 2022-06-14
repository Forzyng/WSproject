<template>
  <div class="header">
    <a href="#default" class="logo"><router-link to="/">Triangle</router-link></a>
    <div class="header-right">
      <a href="#home"><router-link to="/"><img src="http://localhost:3000/store/icons/home-icon.png" style="width:25px"/><span style="margin-left: 7px;font-weight:bold;">Home</span></router-link></a>
      <a href="#about"><router-link to="/about"><img src="http://localhost:3000/store/icons/question-icon.png" style="width:25px"/><span style="margin-left: 7px;font-weight:bold;">About</span></router-link></a>
      <a href="#about" v-if="!isAuthenticated"><router-link to="/login">Login or Register</router-link></a>

        <!--<div class="dropdown" v-if="isAuthenticated">
          <button class="dropbtn">Profile</button>
          <div class="dropdown-content">
            <a href="#">New post</a>
            <a href="#">Settings</a>
            <a href="#">Logout</a>
          </div>
        </div>-->
      <!--  <li v-for="user in users" :key="user.id">
    <img class="round" style="width:50px" v-bind:src=currentAvatarUrl alt="curAvatar"/><span style="margin-left: 7px;font-weight:bold;">{UserLogin}</span>      <router-link :to="{ name: 'User', params: { login: user.login }}">{{ user.login }}</router-link>
        </li> -->
      <a href="#setings" v-if="isAuthenticated"><router-link to="/"><img src="http://localhost:3000/store/icons/setting-icon.webp" style="width:25px"/><span style="margin-left: 7px;font-weight:bold;">Settings</span></router-link></a>
      <a href="#profile" v-if="isAuthenticated"><router-link to="/myprofile"><img class="round" style="width:25px" v-bind:src=currentAvatarUrl /><span style="margin-left: 7px;font-weight:bold;">{{ UserLogin }}</span></router-link></a>
      <a href="#logout" v-if="isAuthenticated" @click="UserLogout"><router-link to="/login"><img  style="width:25px" src="http://localhost:3000/store/icons/logout.png" /><span style="margin-left: 7px;font-weight:bold;">Logout</span></router-link></a>
      </div>
  </div>
</template>

<script>
import { useStore } from 'vuex'
import { computed } from 'vue'
export default {
  name: 'Header-Routes',
  setup () {
    const store = useStore()
    return {
      isAuthenticated: computed(() => store.getters.JwtToken),
      currentAvatarUrl: computed(() => 'http://localhost:3000/store/avatars' + store.getters.user.avatar),
      UserLogout: function () {
        store.dispatch('UserLogout')
      },
      UserLogin: computed(() => store.getters.user.login)
    }
  }
}
</script>

<style scoped>
.round {
  border-radius: 100px; /* Радиус скругления */
  border: 2px solid black; /* Параметры рамки */
  box-shadow: 0 0 7px #666; /* Параметры тени */
}

.header {
  overflow: hidden;
  background-color: #f1f1f1;
  padding: 20px 10px;
}

/* Style the header links */
.header a {
  float: left;
  color: black;
  text-align: center;
  padding: 12px;
  text-decoration: none;
  font-size: 18px;
  line-height: 25px;
  border-radius: 4px;
}

/* Style the logo link (notice that we set the same value of line-height and font-size to prevent the header to increase when the font gets bigger */
.header a.logo {
  font-size: 25px;
  font-weight: bold;
}

/* Change the background color on mouse-over */
.header a:hover {
  background-color: #ddd;
  color: black;
}

/* Style the active/current link*/
.header a.active {
  background-color: dodgerblue;
  color: white;
}

/* Float the link section to the right */
.header-right {
  float: right;
}

/* Add media queries for responsiveness - when the screen is 500px wide or less, stack the links on top of each other */
@media screen and (max-width: 500px) {
  .header a {
    float: none;
    display: block;
    text-align: left;
  }
  .header-right {
    float: none;
  }
}
.dropbtn {
  background-color: #4CAF50;
  color: white;
  padding: 16px;
  font-size: 16px;
  border: none;
  cursor: pointer;
}

/* The container <div> - needed to position the dropdown content */
.dropdown {
  position: relative;
  display: inline-block;
}

/* Dropdown Content (Hidden by Default) */
.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f9f9f9;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
}

/* Links inside the dropdown */
.dropdown-content a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}

/* Change color of dropdown links on hover */
.dropdown-content a:hover {background-color: #d8d8d8}

/* Show the dropdown menu on hover */
.dropdown:hover .dropdown-content {
  display: block;
}

/* Change the background color of the dropdown button when the dropdown content is shown */
.dropdown:hover .dropbtn {
  background-color: #3e8e41;
}
</style>
