<template>
        <div class="row justify-content-center">
            <div class="col-lg-5 col-md-7">
                <div class="card bg-secondary shadow border-0">
                    <div class="card-body px-lg-5 py-lg-5">
                        <form role="form">
                            <base-input class="input-group-alternative mb-3"
                                        placeholder="Email"
                                        addon-left-icon="ni ni-email-83"
                                        v-model="model.email">
                            </base-input>

                            <base-input class="input-group-alternative"
                                        placeholder="Password"
                                        type="password"
                                        addon-left-icon="ni ni-lock-circle-open"
                                        v-model="model.password">
                            </base-input>

                            <p v-show="errorMsg" class="text-muted">
                              <small>
                                {{errorText}}
                              </small>
                            </p>
                            
                            <div class="text-center">
                                <base-button type="primary" @click="login()" class="my-3 w-100">Sign in</base-button>
                            </div>
                        </form>
                    </div>
                </div>
                <div class="row mt-3">
                    <div class="col-6">
                        <a href="#" class="text-light"><small>Forgot password?</small></a>
                    </div>
                    <div class="col-6 text-right">
                        <router-link to="/register" class="text-light"><small>Create new account</small></router-link>
                    </div>
                </div>
            </div>
        </div>
</template>
<script>
  import axios from 'axios'
  export default {
    name: 'login',
    data() {
      return {
        errorMsg: false,
        errorText: '',
        model: {
          email: '',
          password: ''
        }
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
    },

    methods: {
      login() {

        console.log(this.model);

        if(this.model.email && this.model.password) {
          axios.get('https://api.bikermart.co.id/v1/user/loginDetect?key=Bikermart%232020&email='+ encodeURIComponent(this.model.email) +'&password=' + encodeURIComponent(this.model.password)).then((res) => {
            console.log(res.data);
              this.errorMsg  = true

            if(res.data.data.status == "user_bisa_masuk" && res.data.data.token) {
                sessionStorage.setItem('LoggedUserYukPickup_email', res.data.data.email)
                sessionStorage.setItem('LoggedUserYukPickup_token', res.data.data.token)
                sessionStorage.setItem('LoggedUserYukPickup_name', res.data.data.name)

                this.errorText = 'Berhasil login!' 
                this.$router.replace('/dashboard')
            } else {
              this.errorText = 'Peringatan : User tidak ditemukan, periksa kembali email dan password'
            }
          }).catch((err) => {
            console.error(err);
            this.errorText = 'Peringatan : User tidak ditemukan, periksa kembali email dan password'
          })
        } else {
          this.errorMsg  = true
          this.errorText = 'Peringatan : Email dan password harus diisi!'
        }
      }
    }
  }
</script>
<style>
</style>
