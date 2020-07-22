<template>
  <div>
    <base-header type="gradient-success" class="pb-6 pb-8 pt-5 pt-md-8">
      <h1 class="text-white">Manage Your Apps</h1>
    </base-header>

    <br>

    <div class="container">
      <div class="row">
        <div class="col-lg-4 col-md-3 col-sm-12">
          <a href="#" data-toggle="modal" data-target="#newAppModal">
            <div class="card apps-card">
              <div class="card-body text-center">
                <h1 class="createnewApp text-success">
                  +
                </h1>
              </div>
            </div>
          </a>
        </div>

        <div v-for="(a, index) in allApp" :key="index" class="col-lg-4 col-md-3 col-sm-12">
          <a @click="setSelectedApp(a.id)" href="#">
            <div class="card apps-card">
              <div class="card-body text-left">
                <div>
                  <h1 class="text-success">
                    {{a.name}}
                  </h1>

                  <p class="text-muted">
                      <small>
                        Dibuat pada {{a.created_at}}
                      </small>
                  </p>
                </div>
              </div>

              <div class="card-footer">
                <div class="row">
                  <div class="col">
                    <span class="badge badge-success badge-pill ">
                      App Id : {{a.id}}
                    </span>
                  </div>

                  <div>
                    <button class="btn btn-danger btn-sm">
                      <i class="ni ni-button-power mt-1"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>

    <!-- The Modal -->
    <div class="modal fade" id="newAppModal">
      <div class="modal-dialog">
        <div class="modal-content">

          <form @submit="save()">
            <!-- Modal Header -->
            <div class="modal-header">
              <h4 class="modal-title">Tambah Aplikasi</h4>
              <button type="button" class="close" data-dismiss="modal">&times;</button>
            </div>

            <!-- Modal body -->
            <div class="modal-body">
              <small>Nama Aplikasi</small>
              <input v-model="app.name" required class="form-control mb-3 mt-2" type="text">

              <!-- <small>Logo Aplikasi</small>
              <input class="d-block mt-2 mb-3" type="file" @change="imageToBase64"> -->

              <p v-if="errorText" class="text-muted">
                <small>
                  {{errorText}}
                </small>
              </p>

              <div class="mt-3" v-show="imagePreview">
                <small>Preview Logo</small> <br>
                <img :src="app.image" class="mt-2" width="100px" alt="">
              </div>
            </div>

            <!-- Modal footer -->
            <div class="modal-footer">
              <button type="submit" id="simpanAppBtn" class="btn btn-success">
                <img src="" width="20x" alt="">
                Simpan
              </button>
              <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
            </div>
          </form>

        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import $ from 'jquery'
  import axios from 'axios'

  export default {
    components: {

    },
    data() {
      return {
        imagePreview: false,
        errorText: null,
        allApp: [],
        app: {
          name: '',
          // image: '',
          user_email: sessionStorage.getItem('LoggedUserYukPickup_email'),
          user_token: sessionStorage.getItem('LoggedUserYukPickup_token')
        }
      };
    },

    mounted() {
      this.getAllApp()
    },

    methods: {

      setSelectedApp(appId) {

        axios.get('https://api.bikermart.co.id/v1/user/getAppById?key=Bikermart%232020&app_id=' + appId).then((res) => {
           var app_id = res.data.data.id
           var app_name = res.data.data.name

           localStorage.setItem('yukpickup_selected_app_name', app_name)
           localStorage.setItem('yukpickup_selected_app_id', app_id)

           this.$router.go()
         }).catch((err) => {
           console.error(err);
         })
      },

      getAllApp() {
        axios({
          url: 'https://api.bikermart.co.id/v1/user/getApp?key=Bikermart%232020&email='+ encodeURIComponent(sessionStorage.getItem('LoggedUserYukPickup_email')) +'&token=' + encodeURIComponent(sessionStorage.getItem('LoggedUserYukPickup_token')),
          method: 'get',
          headers: {
            'Accept' : 'application/json',
          }
        }).then((res) => {
          this.allApp = res.data.data
        }).catch((err) => {
          console.log(err);
        })
      },
      
      save() {

        $('#simpanAppBtn').prop('disabled', true)
        $('#simpanAppBtn img').attr('src', 'img/loading-white.gif')

        axios.get(
          'https://api.bikermart.co.id/v1/user/addApp?key=Bikermart%232020&email=' + encodeURIComponent(this.app
            .user_email) +
          '&token=' + encodeURIComponent(this.app.user_token) +
          '&app_name=' + encodeURIComponent(this.app.name) 

        ).then((res) => {
          if (res.data.data.status == 'success_save_user_app') {
            $('#simpanAppBtn').prop('disabled', false)
            $('#simpanAppBtn img').attr('src', '#')
            this.errorText = 'Berhasil menyimpan data'

            setTimeout(() => {
              $('#newAppModal').modal('hide');
            }, 2000);
          } else {
            $('#simpanAppBtn').prop('disabled', false)
            $('#simpanAppBtn img').attr('src', '#')
            this.errorText = 'Terjadi kesalahan ketika menyimpan data!'
          }

          this.getAllApp()
        }).catch((err) => {
          $('#simpanAppBtn').prop('disabled', false)
          $('#simpanAppBtn img').attr('src', '#')
          this.errorText = 'Terjadi kesalahan ketika menyimpan data!'
          console.log(err);
        })

      },

      imageToBase64(ev) {
        const file = ev.target.files[0];
        const reader = new FileReader();

        // Pilih variabel app
        const imageTemp = this.app

        reader.onload = function (e) {
          // Letakan value pada variabel app image melalui konstanta imageTemp
          imageTemp.image = e.target.result
        };

        this.imagePreview = true
        reader.readAsDataURL(file);
      }
    }
  };
</script>
<style>
  .apps-card {
    height: 200px;
  }

  .apps-card .card-body {
    justify-content: center;
    display: flex;
    align-items: center;
  }

  .apps-card .createnewApp {
    font-size: 6rem;
  }

  .modal.show {
    background-color: transparent;
  }

  .modal-backdrop {
    display: none;
  }
</style>
