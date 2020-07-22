<template>
  <div>
    <cardStatus></cardStatus>

    <div class="container-fluid mt--7">
      <div class="row">
        <div class="col">
          <div class="card shadow">
            <div class="card-header border-0">
              <div class="row align-items-center">
                <div class="col">
                  <h3 class="mb-0">
                    Produk
                  </h3>
                </div>
                <div class="col text-right">

                  <input class="form-control-sm mr-2 border-secondary" id="searchBar" v-model="searchBar"
                    placeholder="Search Product" type="text">

                  <base-button data-toggle="modal" data-target="#modalImport" type="success" size="sm">import
                  </base-button>

                  <download-csv type="success" name="Export All Product - YukPickup.csv" separator-excel='true'
                    class="d-inline btn btn-sm tombol btn-success" :data="tableData">
                    export
                  </download-csv>

                  <base-button data-toggle="modal" data-target="#addProduct" type="success" size="sm"> <i
                      class="ni ni-fat-add"></i>
                  </base-button>
                </div>
              </div>
            </div>

            <div class="table-responsive">
              <table class="table align-items-center table-flush">
                <tr>
                  <th>ID</th>
                  <th>Image</th>
                  <th>SKU</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Brand</th>
                  <th>Sell price</th>
                  <th>Weight (kg)</th>
                  <th></th>
                </tr>

                <tbody id="konten">
                  <tr v-for="(p, index) in tableData" :key="index" :id="index">
                    <th>
                      {{index + 1}}
                    </th>
                    <td>
                      <img @mouseover="imagePreview(index)" class="thumbnail" @mouseout="imagePreviewClose()"
                        :src="p.photo_1" width="70px" alt="">
                    </td>
                    <td>
                      {{p.product_id}}
                    </td>
                    <td>
                      {{p.name}}
                    </td>
                    <td>
                      {{p.category}}
                    </td>
                    <td>
                      {{p.brand}}
                    </td>
                    <td>
                      {{p.sell_price}}
                    </td>
                    <td>
                      {{p.weight_kg}}
                    </td>

                    <td class="text-right">
                      <base-dropdown class="dropdown" position="right">
                        <a @click="productAction()" slot="title" class="btn btn-icon-only text-light" role="button"
                          data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                          <i class="fas fa-ellipsis-v"></i>
                        </a>

                        <template>
                          <div class="border-bottom px-2 pb-2">
                            <small>
                              <b>
                                {{p.name.substr(0, 20)}}...
                              </b>
                            </small>
                          </div>
                          <a @click="editProductFunc(index)" class="dropdown-item" style="cursor: pointer">Edit</a>
                          <a @click="deleteProduct(index)" class="dropdown-item" style="cursor: pointer">Delete</a>
                          <a class="dropdown-item" @click="generateBarcode(index)" style="cursor: pointer">Generate Barcode</a>
                        </template>
                      </base-dropdown>
                    </td>

                  </tr>
                </tbody>

              </table>
            </div>

          </div>
        </div>
      </div>
    </div>

    <!-- The Modal -->
    <div class="modal fade" id="addProduct">
      <div class="modal-dialog">
        <div class="modal-content">

          <form @submit.prevent="submitAddProduct()">
            <!-- Modal Header -->
            <div class="modal-header">
              <h4 class="modal-title">Add Product</h4>
              <button type="button" class="close" data-dismiss="modal">&times;</button>
            </div>

            <!-- Modal body -->
            <div class="modal-body">
              <small>Nama Produk</small>
              <input class="form-control mb-2 mt-1" required v-model="addProduct.name" type="text">

              <small>SKU Produk</small>
              <input class="form-control mb-2 mt-1" required v-model="addProduct.product_id" type="text">

              <small>Kategori Produk</small>
              <input class="form-control mb-2 mt-1" required v-model="addProduct.category" type="text">

              <small>Brand Produk</small>
              <input class="form-control mb-2 mt-1" required v-model="addProduct.brand" type="text">

              <small>Harga Produk</small>
              <input class="form-control mb-2 mt-1" required v-model="addProduct.sell_price" type="number">

              <small>Berat Produk</small>
              <input class="form-control mb-2 mt-1" required v-model="addProduct.weight_kg" type="number">

              <small> <code>*</code> URL Gambar Produk</small>
              <input @change="addProductImagePreviewChange()" class="form-control mb-2 mt-1"
                placeholder="https://i.ibb.co/6J5pFqK/54c4a3cf1e2b0e90eb1d2fc8f0f06a4c.jpg" required
                v-model="addProduct.photo_1" type="text">

              <div class="my-2" v-if="statusTambahProduk">
                Status : {{statusTambahProduk}}
              </div>

              <small>
                <code>*</code> Contoh pengisian ambil URLnya dengan ekstensinya seperti ini
                https://i.ibb.co/6J5pFqK/54c4a3cf1e2b0e90eb1d2fc8f0f06a4c.jpg <br>
                Silahkan teman teman bisa menggunakan layanan <a target="_blank" href="https://imgbb.com/">imgbb</a>
                untuk menyimpan gambar gratis. Jika pengisian sudah benar maka akan muncul kotak preview gambar secara
                otomatis.

                <div v-if="addProductImagePreview" class="mt-2">
                  Preview Produk

                  <img class="d-block mt-1" :src="addProductImagePreview" width="60px" alt="">
                </div>
              </small>
            </div>

            <!-- Modal footer -->
            <div class="modal-footer">
              <button id="submitAddProduct" :disabled="submitAddProductDisable" type="submit" class="btn btn-success">
                <img v-if="submitAddProductLoading" :src="submitAddProductLoading" width="20x" alt="">
                Submit
              </button>
              <button type="button" class="btn border" data-dismiss="modal">Close</button>
            </div>
          </form>

        </div>
      </div>
    </div>

    <div class="modal fade" id="editProduct">
      <div class="modal-dialog">
        <div class="modal-content">

          <form @submit.prevent="editProductSubmitData()">
            <!-- Modal Header -->
            <div class="modal-header">
              <h4 class="modal-title">Edit Product</h4>
              <button type="button" class="close" data-dismiss="modal">&times;</button>
            </div>

            <!-- Modal body -->
            <div class="modal-body">
              <small>Nama Produk</small>
              <input class="form-control mb-2 mt-1" required v-model="editProduct.name" type="text">

              <small>SKU Produk</small>
              <input class="form-control mb-2 mt-1" required v-model="editProduct.product_id" type="text">

              <small>Kategori Produk</small>
              <input class="form-control mb-2 mt-1" required v-model="editProduct.category" type="text">

              <small>Brand Produk</small>
              <input class="form-control mb-2 mt-1" required v-model="editProduct.brand" type="text">

              <small>Harga Produk</small>
              <input class="form-control mb-2 mt-1" required v-model="editProduct.sell_price" type="number">

              <small>Berat Produk</small>
              <input class="form-control mb-2 mt-1" required v-model="editProduct.weight_kg" type="number">

              <small> <code>*</code> URL Gambar Produk</small>
              <input  class="form-control mb-2 mt-1"
                placeholder="https://i.ibb.co/6J5pFqK/54c4a3cf1e2b0e90eb1d2fc8f0f06a4c.jpg" required
                v-model="editProduct.photo_1" type="text">

              <div class="my-2" v-if="statuseditProduk">
                Status : {{statuseditProduk}}
              </div>

              <div v-if="editProduct.photo_1" class="mt-3">
                  <small>Preview Gambar</small>

                  <img class="d-block mt-1" :src="editProduct.photo_1" width="60px" alt="">
                </div>
            </div>

            <!-- Modal footer -->
            <div class="modal-footer">
              <button id="submitAddProduct" :disabled="submitEditProductDisable" type="submit" class="btn btn-success">
                <img v-if="submitEditProductLoading" :src="submitEditProductLoading" width="20x" alt="">
                Submit
              </button>
              <button type="button" class="btn border" data-dismiss="modal">Close</button>
            </div>
          </form>

        </div>
      </div>
    </div>

    <!-- The Modal -->
    <div class="modal" id="modalImagePreview">
      <div class="modal-dialog">
        <div class="modal-content">

          <!-- Modal body -->
          <div class="modal-body">
            <img :src="tempGambarPreview" width="100%" alt="" srcset="">
          </div>

        </div>
      </div>
    </div>

    <!-- The Modal -->
    <div class="modal fade" id="modalConfirmDelProduct">
      <div class="modal-dialog modal-sm">
        <div class="modal-content">

          <!-- Modal Header -->
          <div class="modal-body">
            <h3 class="d-block">Are you sure want to delete {{confirmDeleteProduct}} ?</h3>

            <div class="mt-3" v-if="deleteProductStatus">
              {{deleteProductStatus}}
            </div>
          </div>

          <!-- Modal footer -->
          <div class="modal-footer">
            <button type="button" class="btn btn-danger" @click="deleteProductYes()">Yes</button>
            <button type="button" class="btn border" @click="deleteProductNo()" data-dismiss="modal">No</button>
          </div>

        </div>
      </div>
    </div>

    <!-- The Modal -->
    <div class="modal fade" id="modalImport">
      <div class="modal-dialog">
        <div class="modal-content">

          <!-- Modal Header -->
          <div class="modal-header">
            <h4 class="modal-title">Import Produk</h4>
            <button type="button" class="close" data-dismiss="modal">&times;</button>
          </div>

          <!-- Modal body -->
          <div class="modal-body">
            <small>Import Csv</small>
            <vue-csv-import autoMatchFields class="mt-2" v-model="csvImport" @change="hideTextUnderInput()"
              submitBtnText="Buka" loadBtnText="Buka" headers="true"
              :map-fields="['app_id', 'product_id', 'name', 'category', 'brand', 'sell_price', 'weight_kg', 'photo_1']">
            </vue-csv-import>

            <small v-if="jmlcsvImport">
              Jumlah data : {{csvImport.length}} <br>

              {{jmlDataError}}
            </small>

            <small v-if="successAddData">
              {{successAddData}}
            </small>

            <div v-if="helperText">
              <download-csv class="nav-link px-0 d-inline text-primary" name="Template Import Produk.csv"
                :data="jsonData">
                <small>
                  Download Template Import Produk disini
                </small>
              </download-csv>

              <div class="d-inline">
                <small>
                  dan setelah diunduh silahkan konversi csv menjadi excel terlebih dahulu menggunakan <a target="_blank"
                    href="https://convertio.co/csv-xlsx/">tools ini</a> sebelum csv tadi digunakan

                  Dan ketika ingin diunggah kembali kesini harus di konversi kembali dari excel menjadi csv, bisa juga
                  menggunakan <a href="https://convertio.co/id/xls-csv/" target="_blank">tools ini</a>
                  <br>
                  Keterangan :
                  <ul>
                    <li>app_id = produk tersebut adalah produk dari aplikasi mana, tuliskan saja id aplikasinya, id
                      aplikasi bisa dilihat pada halaman <router-link to="/dashboard">dashboard</router-link>
                    </li>
                    <li>product_id = SKU produk penjual</li>
                    <li>name = nama produk</li>
                    <li>category = kategori produk </li>
                    <li>brand : adalah brand produk tersebut</li>
                    <li>sell_price = harga jual produk</li>
                    <li>weight_kg = berat produk dalam kg</li>
                    <li>photo_1 = URL gambar produk</li>
                  </ul>
                </small>
              </div>
            </div>
          </div>

          <!-- Modal footer -->
          <div class="modal-footer">
            <button v-if="SubmitData" :disabled="SubmitDataDisable" id="SubmitData" @click.prevent="sendData()"
              class="btn btn-primary">
              <img src="" width="20x" alt="">
              Submit
            </button>
            <button type="button" v-if="settingsColumn" id="settingsColumn" @click="settingsColumnClick()"
              class="btn border">Settings</button>
            <button type="button" class="btn border" data-dismiss="modal">Close</button>
          </div>

        </div>
      </div>
    </div>

  </div>
</template>
<script>
  import cardStatus from '@/components/cardStatus.vue';
  import Vue from 'vue'
  import JsonCSV from 'vue-json-csv'
  import $ from 'jquery'
  import {
    VueCsvImport
  } from 'vue-csv-import';
  import axios from 'axios';

  Vue.component('downloadCsv', JsonCSV)

  export default {
    name: 'tables',
    components: {
      cardStatus,
      VueCsvImport
    },

    data() {
      return {
        addProduct: {
          app_id: localStorage.getItem('yukpickup_selected_app_id'),
          product_id: null,
          name: null,
          category: null,
          brand: null,
          sell_price: null,
          weight_kg: null,
          photo_1: null,

          // Autentikasi User ke server
          email: sessionStorage.getItem('LoggedUserYukPickup_email'),
          token: sessionStorage.getItem('LoggedUserYukPickup_token')
        },

        editProduct: {
          id: null,
          app_id: localStorage.getItem('yukpickup_selected_app_id'),
          product_id: null,
          name: null,
          category: null,
          brand: null,
          sell_price: null,
          weight_kg: null,
          photo_1: null,

          // Autentikasi User ke server
          email: sessionStorage.getItem('LoggedUserYukPickup_email'),
          token: sessionStorage.getItem('LoggedUserYukPickup_token')
        },

        statusTambahProduk: null,
        tempGambarPreview: null,
        deleteProductStatus: null,
        tableData: [],
        csvImport: [],
        searchBar: null,
        confirmDeleteProduct: null,
        confirmDeleteProductID: null,
        helperText: true,
        submitAddProductLoading: null,
        submitAddProductDisable: false,
        addProductImagePreview: null,
        settingsColumn: false,
        SubmitData: false,
        jmlDataError: null,
        successAddData: null,
        statuseditProduk: null,
        submitEditProductLoading: null,
        submitEditProductDisable: false,
        SubmitDataDisable: false,
        jmlcsvImport: false,
        jsonData: [{
          'app_id': '1',
          'product_id': 'Tas',
          'name': 'Tas - Hapus ini sebelum mulai mengisi csv, ini hanya contoh',
          'category': 'Tas',
          'brand': 'None',
          'sell_price': '1000',
          'weight_kg': '1',
          'photo_1': 'https://i.ibb.co/6J5pFqK/54c4a3cf1e2b0e90eb1d2fc8f0f06a4c.jpg'
        }]
      }
    },

    watch: {
      searchBar() {
        if (this.searchBar == '') {
          this.getAllProduct()
        }
      },

      csvImport() {
        if (this.csvImport.length > 0) {
          this.hideTextUnderInput()
          this.settingsColumn = true
          this.SubmitData = true
          this.jmlcsvImport = true

          $('#SubmitData img').hide();
        } else {
          this.settingsColumn = false
          this.SubmitData = false
          this.jmlcsvImport = false

          $('#SubmitData img').show();
        }
      }
    },

    mounted() {

      $(document).ready(function () {
        $("#searchBar").on("change keyup dblclick", function () {
          var value = $(this).val().toLowerCase();
          $("#konten tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
          });
        });
      });

      this.getAllProduct()

      $('#searchBar').on('dblclick', function () {
        $(this).val('')
        this.getAllProduct()
      });

    },

    methods: {
      addProductImagePreviewChange() {
        if (this.addProduct.photo_1) {
          this.addProductImagePreview = this.addProduct.photo_1
        } else {
          this.addProductImagePreview = null
        }
      },

      editProductFunc(key) {
        for (let i = 0; i < this.tableData.length; i++) {
          if (i == key) {
            this.editProduct = this.tableData[i]

            $('#editProduct').modal('show')
          }
        }
      },

      editProductSubmitData() {

        this.submitEditProductLoading = 'img/loading-white.gif',
        this.submitEditProductDisable = true,

        axios({
          url: 'https://api.bikermart.co.id/v1/product/editProduct',
          method: 'get',
          params: {
            id: this.editProduct.id,
            app_id: this.editProduct.app_id,
            product_id: this.editProduct.product_id,
            name: this.editProduct.name,
            category: this.editProduct.category,
            brand: this.editProduct.brand,
            sell_price: this.editProduct.sell_price,
            weight_kg: this.editProduct.weight_kg,
            photo_1: this.editProduct.photo_1,

            // Autentikasi ke server
            key: "Bikermart#2020",
            email: sessionStorage.getItem('LoggedUserYukPickup_email'),
            token: sessionStorage.getItem('LoggedUserYukPickup_token')
          }
        }).then((res) => {

          this.submitEditProductLoading = '',
          this.submitEditProductDisable = false

          if(res.data.msg == 'success') {
            this.statuseditProduk = "Sukses update data"

            $('#editProduct').modal('hide')
          } else {
            this.statuseditProduk = "terjadi kesalahan update data!"
          }

        }).catch((err) => {
          console.error(err);
          this.submitEditProductLoading = '',
          this.submitEditProductDisable = false
          this.statuseditProduk = "terjadi kesalahan update data!"
        })
      },

      generateBarcode(key) {
        for (let i = 0; i < this.tableData.length; i++) {
          if (i == key) {
            window.open(this.tableData[i].barcodeImg)
          }
        }
      },

      deleteProductYes() {
        axios({
          method: "GET",
          url: "https://api.bikermart.co.id/v1/product/deleteProductById?key=Bikermart%232020&id="+ this.confirmDeleteProductID +"&email="+ sessionStorage.getItem('LoggedUserYukPickup_email') +"&token=" + sessionStorage.getItem('LoggedUserYukPickup_token')
        }).then((res) => {
          console.log(res.data.msg);
          if(res.data.msg == 'success_delete_product') {

            this.deleteProductStatus = res.data.data
            this.confirmDeleteProductID = null
            this.confirmDeleteProduct = null
            
            setInterval(() => {
                this.$router.go() 
            }, 2000);
          }
        }).catch((err) => {
          console.error(err);
          this.confirmDeleteProductID = null
          this.confirmDeleteProduct = null
        })
      },

      deleteProductNo() {
        this.confirmDeleteProductID = null
        this.confirmDeleteProduct = null
      },

      deleteProduct(key) {
        $('#modalConfirmDelProduct').modal('show');

        for (let i = 0; i < this.tableData.length; i++) {
          if (i == key) {
            this.confirmDeleteProduct = this.tableData[i].name
            this.confirmDeleteProductID = this.tableData[i].id
          }
        }
      },

      productAction() {
        this.confirmDeleteProduct = null
        this.confirmDeleteProductID = null
      },

      submitAddProduct() {

        this.submitAddProductLoading = 'img/loading-white.gif'
        this.submitAddProductDisable = true

        axios({
          url: 'https://api.bikermart.co.id/v1/product/addProduct',
          params: {

            app_id: this.addProduct.app_id,
            product_id: this.addProduct.product_id,
            name: this.addProduct.name,
            category: this.addProduct.category,
            brand: this.addProduct.brand,
            sell_price: this.addProduct.sell_price,
            weight_kg: this.addProduct.weight_kg,
            photo_1: this.addProduct.photo_1,

            // Autentikasi ke server
            key: "Bikermart#2020",
            email: this.addProduct.email,
            token: this.addProduct.token
          }
        }).then((res) => {
          this.statusTambahProduk = (res.data.msg).replace('_', ' ')
          console.log(res.data);

          this.submitAddProductLoading = ''
          this.submitAddProductDisable = false

          if (res.data.msg == 'success') {
            this.getAllProduct()
            setInterval(() => {
              this.$router.go()
            }, 3000);

            this.addProduct = {
              app_id: localStorage.getItem('yukpickup_selected_app_id'),
              product_id: null,
              name: null,
              category: null,
              brand: null,
              sell_price: null,
              weight_kg: null,
              photo_1: null,

              // Autentikasi User ke server
              email: sessionStorage.getItem('LoggedUserYukPickup_email'),
              token: sessionStorage.getItem('LoggedUserYukPickup_token')
            }
          }
        }).catch((err) => {
          console.error(err);
        })
      },

      imagePreview(key) {

        for (let i = 0; i < this.tableData.length; i++) {
          if (i == key) {
            this.tempGambarPreview = this.tableData[i].photo_1
          }
        }

        $('#modalImagePreview').modal('show')
      },

      imagePreviewClose() {
        $('#modalImagePreview').modal('hide')
      },

      getAllProduct() {
        var active_app_id = localStorage.getItem('yukpickup_selected_app_id')

        axios({
          method: 'get',
          url: 'https://api.bikermart.co.id/v1/product/getProductByIdApp',
          params: {
            'key': 'Bikermart#2020',
            'app_id': active_app_id
          },
          headers: {
            'Content-Type': 'application/json',
          }
        }).then((res) => {
          this.tableData = res.data.data.product
        }).catch((err) => {
          console.error(err);
        })
      },

      sendData() {

        $('#SubmitData img').attr('src', 'img/loading-white.gif')
        $('#SubmitData img').show();
        this.SubmitDataDisable = true

        // Menggunakan fasilitas form data untuk save datanya
        var FormData = require('form-data')
        var myData = new FormData()
        myData.append('raw', JSON.stringify(this.csvImport))
        myData.append('app_id', localStorage.getItem('yukpickup_selected_app_id'))
        myData.append('token', sessionStorage.getItem('LoggedUserYukPickup_token'))
        myData.append('email', sessionStorage.getItem('LoggedUserYukPickup_email'))

        axios({
          method: 'POST',
          url: 'https://api.bikermart.co.id/v1/product/saveRawDataProduct',
          headers: {
            'key': 'Bikermart#2020',
            'Content-Type': 'multipart/form-data',
            'accept': 'text/plain'
          },

          data: myData,
        }).then((res) => {

          this.successAddData = res.data.data
          $('#SubmitData img').hide();
          $('#SubmitData img').attr('src', '')
          this.SubmitDataDisable = false

          setInterval(() => {
            $('#modalImport').modal('hide')

            setInterval(() => {
              this.$router.go()
            }, 1000);

          }, 2000);
        }).catch((err) => {
          $('#SubmitData img').hide();
          $('#SubmitData img').attr('src', '')
          this.SubmitDataDisable = false
          console.error(err);
        })
      },

      hideTextUnderInput() {
        this.helperText = false
        this.settingsColumn = true
        this.jmlcsvImport = true

        this.SubmitData = true
        $('#SubmitData img').hide();

        // if (this.csvImport.length > 150) {
        //   this.jmlDataError = 'Jumlah data tidak boleh melebihi 150 data'
        //   this.SubmitDataDisable = true
        // } else {
        //   this.SubmitData = true
        //   $('#SubmitData img').hide();
        // }
      },

      settingsColumnClick() {
        $('.vue-csv-mapping').toggle();
      }
    }
  };
</script>

<style>
  .table-responsive {
    height: 80vh;
  }

  .nav-link {
    cursor: pointer;
  }

  .vue-csv-mapping {
    display: none;
  }

  .thumbnail {
    cursor: pointer;
  }

  .tombol {
    padding: 5px;
    padding-left: 4px;
    padding-right: 7px;
  }
</style>
