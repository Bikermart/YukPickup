<template>
  <div id="app">
    <notifications></notifications>
    <router-view />
  </div>
</template>

<script>
  import axios from 'axios'
  export default {
    data() {
      return {

      }
    },

    mounted() {
      if (sessionStorage.getItem('LoggedUserYukPickup_email') && sessionStorage.getItem('LoggedUserYukPickup_token')) {
        var email = sessionStorage.getItem('LoggedUserYukPickup_email')
        var token = sessionStorage.getItem('LoggedUserYukPickup_token')
        //  var name = sessionStorage.getItem('LoggedUserYukPickup_name')

        //  Cek sesi aktif ke server
        axios.get('https://api.bikermart.co.id/v1/user/sessionChecker?key=Bikermart%232020&email=' + encodeURIComponent(email) + '&token=' +
          encodeURIComponent(token)).then((res) => {
          console.log(res);
          if (res.data.data.status == 'user_ditemukan' && email == res.data.data.email) {
            this.$router.replace('/dashboard')
          } else {
            this.$router.replace('/login')
          }
        }).catch((err) => {
          console.error(err);
        })

      } else {
        this.$router.replace('/login')
      }
    }
  }
</script>

<style>
  .modal.show {
    background-color: transparent;
  }

  .modal-backdrop {
    display: none;
  }

  *:focus {
      outline: none;
  }
</style>