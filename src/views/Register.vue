<template>
  <div class="row justify-content-center">
    <div class="col-lg-5 col-md-7">
      <div class="card bg-secondary shadow border-0">
        <div class="card-body px-lg-5 py-lg-5">
          <form @submit="submit()" role="form">

            <base-input class="input-group-alternative mb-3" placeholder="Name" addon-left-icon="ni ni-hat-3"
              v-model="model.name">
            </base-input>

            <base-input class="input-group-alternative mb-3" placeholder="Email" addon-left-icon="ni ni-email-83"
              v-model="email">
            </base-input>

            <small class="text-muted" v-if="emailValidStatus">
              {{emailValidStatus}}
            </small>

            <div v-if="kolomPassword">
              <base-input class="input-group-alternative" placeholder="Password" type="password"
                addon-left-icon="ni ni-lock-circle-open" v-model="password">
              </base-input>

              <div class="text-muted font-italic">
                <small>password strength:
                  <span v-if="passStrong" class="text-success font-weight-700">strong</span>
                  <span v-if="passWeak" class="text-warning font-weight-700">weak</span>
                </small>

                <span v-if="ifColumnNull" class="d-block">
                  <small>
                    Semua kolom tidak boleh kosong!
                  </small>
                </span>

                <span class="d-block" v-if="loginStatus">
                  <small>
                    {{loginStatus}}
                  </small>
                </span>
              </div>
            </div>

            <div class="text-center">
              <base-button :disabled="disableBTN" @click="submit()" type="primary" class="my-4">Create account
              </base-button>
            </div>
          </form>
        </div>
      </div>
      <div class="row mt-3">
        <div class="col-6">
          <a href="#" class="text-light">
            <small>Forgot password?</small>
          </a>
        </div>
        <div class="col-6 text-right">
          <router-link to="/login" class="text-light">
            <small>Login into your account</small>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import axios from 'axios'
  export default {
    name: 'register',
    data() {
      return {
        disableBTN: true,
        passStrong: false,
        passWeak: true,
        ifColumnNull: false,
        loginStatus: null,
        kolomPassword: false,
        emailValidStatus: null,
        password: '',
        email: '',
        model: {
          name: '',
        }
      }
    },

    watch: {
      email() {
        if(this.email.length > 0) {
          if (this.email.indexOf('@') > 0 && this.email.indexOf('.') > 0) {
            this.kolomPassword = true
            this.emailValidStatus = null
          } else {
            this.kolomPassword = false
            this.emailValidStatus = 'Email tidak valid'
          }
        }
      },

      password() {
        if (this.password.length >= 8) {
          this.passStrong = true
          this.passWeak = false
          this.disableBTN = false
        } else {
          this.passStrong = false
          this.passWeak = true
          this.disableBTN = true
        }
      }
    },

    methods: {
      submit() {
        if (this.model.name && this.email && this.password) {
          axios({
            method: 'GET',
            url: 'http://api.bikermart.co.id/v1/user/registerSave',
            params: {
              'key': 'Bikermart#2020',
              'email': this.email,
              'name' : this.model.name,
              'password': this.password
            }
          }).then((res) => {
            console.log(res.data);
            this.loginStatus = res.data.data.status.replace('_', ' ')

            if (res.data.data.status == 'succcess_add_user') {
              setInterval(() => {
                this.$router.replace('/login')
              }, 2000);
            } else {
              this.loginStatus = res.data.data.status.replace('_', ' ')
            }
          }).catch((err) => {
            this.loginStatus = "Terjadi kesalahan ketika menyimpan data, silahkan coba lagi!"
            console.log(err);
          })
        } else {
          this.ifColumnNull = true;
        }
      }
    },

    mounted() {

      if (sessionStorage.getItem('LoggedUserYukPickup_email') && sessionStorage.getItem('LoggedUserYukPickup_token')) {
        var email = sessionStorage.getItem('LoggedUserYukPickup_email')
        var token = sessionStorage.getItem('LoggedUserYukPickup_token')
        //  var name = sessionStorage.getItem('LoggedUserYukPickup_name')

        //  Cek sesi aktif ke server
        axios.get('https://api.bikermart.co.id/v1/user/sessionChecker?key=Bikermart%232020&email=' + encodeURIComponent(
            email) + '&token=' +
          encodeURIComponent(token)).then((res) => {
          console.log(res);
          if (res.data.data.status == 'user_ditemukan' && email == res.data.data.email) {
            this.$router.replace('/dashboard')
          }
        }).catch((err) => {
          console.error(err);
        })

      }
    }
  }
</script>
<style>
</style>
