<template>
    <base-nav class="navbar-top navbar-dark"
              id="navbar-main"
              :show-toggle-button="false"
              expand>
        <form class="navbar-search navbar-search-dark form-inline mr-3 d-none d-md-flex ml-lg-auto">
            <div class="form-group mb-0">
                <!-- <base-input placeholder="Search"
                            class="input-group-alternative"
                            alternative=""
                            addon-right-icon="fas fa-search">
                </base-input> -->

                <select class="form-control" @change="setSelectedApp()" v-model="SelectedApp">
                  <option class="text-dark" v-for="(app, index) in allApp" :key="index" :value="app.id">{{app.name}}</option>
                </select>
            </div>
        </form>
        <ul class="navbar-nav align-items-center d-none d-md-flex">
            <li class="nav-item dropdown">
                <base-dropdown class="nav-link pr-0">
                    <div class="media align-items-center" slot="title">
                <span class="avatar avatar-sm rounded-circle">
                  <img alt="Image placeholder" src="img/user.png">
                </span>
                        <div class="media-body ml-2 d-none d-lg-block">
                            <span class="mb-0 text-sm  font-weight-bold">
                              {{username}}
                            </span>
                        </div>
                    </div>

                    <template>
                        <div class=" dropdown-header noti-title">
                            <h6 class="text-overflow m-0">Welcome!</h6>
                        </div>
                        <router-link to="/profile" class="dropdown-item">
                            <i class="ni ni-single-02"></i>
                            <span>My profile</span>
                        </router-link>
                        <div class="dropdown-divider"></div>
                        <router-link @click="logout()" to="/login" class="dropdown-item">
                            <i class="ni ni-user-run"></i>
                            <span>Logout</span>
                        </router-link>
                    </template>
                </base-dropdown>
            </li>
        </ul>
    </base-nav>
</template>
<script>
import axios from 'axios'
  export default {
    data() {
      return {
        activeNotifications: false,
        showMenu: false,
        searchQuery: '',
        username: sessionStorage.getItem('LoggedUserYukPickup_name'),
        allApp: [],
        SelectedApp: null
      };
    },

    mounted() {

      var selectedAppId = localStorage.getItem('yukpickup_selected_app_id')
      this.SelectedApp = selectedAppId

      axios({
        url: 'https://api.bikermart.co.id/v1/user/getApp?key=Bikermart%232020&email='+ encodeURIComponent(sessionStorage.getItem('LoggedUserYukPickup_email')) +'&token=' + encodeURIComponent(sessionStorage.getItem('LoggedUserYukPickup_token')),
        method: "get",
        headers: {
          'Accept': "application/json"
        }
      }).then((res) => {
        this.allApp = res.data.data
      })
    },

    methods: {
      toggleSidebar() {
        this.$sidebar.displaySidebar(!this.$sidebar.showSidebar);
      },
      hideSidebar() {
        this.$sidebar.displaySidebar(false);
      },
      toggleMenu() {
        this.showMenu = !this.showMenu;
      },

      logout() {
        localStorage.removeItem('yukpickup_selected_app_name')
        localStorage.removeItem('yukpickup_selected_app_id')
        sessionStorage.removeItem('LoggedUserYukPickup_email')
        sessionStorage.removeItem('LoggedUserYukPickup_token')
        sessionStorage.removeItem('LoggedUserYukPickup_name')
      },

      setSelectedApp() {
        //  alert()

         axios.get('https://api.bikermart.co.id/v1/user/getAppById?key=Bikermart%232020&app_id=' + this.SelectedApp).then((res) => {
           var app_id = res.data.data.id
           var app_name = res.data.data.name

           localStorage.setItem('yukpickup_selected_app_name', app_name)
           localStorage.setItem('yukpickup_selected_app_id', app_id)

           this.$router.go()
         }).catch((err) => {
           console.error(err);
         })
      }
    }
  };
</script>

