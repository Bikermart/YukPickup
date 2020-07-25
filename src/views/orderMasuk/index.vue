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
                                        Order Masuk
                                    </h3>
                                </div>
                                <div class="col text-right">

                                    <input class="form-control-sm border form-control-alternative mr-2 border-secondary"
                                        id="searchBar" v-model="searchBar" placeholder="Search Product" type="text">

                                    <base-button data-toggle="modal" data-target="#modalImport" type="success"
                                        size="sm">Import
                                    </base-button>

                                    <download-csv name="Export All Order - YukPickup.csv" separator-excel='true'
                                        class="btn btn-sm btn-success" :data="exportData">
                                        Export
                                    </download-csv>

                                </div>
                            </div>
                        </div>

                        <div class="table-responsive">
                            <table class="table align-items-center table-flush">
                                <tr>
                                    <th>No</th>
                                    <th>Id Transaksi</th>
                                    <th>Pembeli</th>
                                    <th>No telp</th>
                                    <th>Alamat</th>
                                    <th></th>
                                </tr>

                                <tbody id="konten">
                                    <tr v-for="(p, index) in tableData" :key="index" :id="index">
                                        <th>
                                            {{index + 1}}
                                        </th>
                                        <td>
                                            {{p.trxId}}
                                        </td>
                                        <td>
                                            {{p.buyerName}}
                                        </td>
                                        <td>
                                            {{p.buyerPhone}}
                                        </td>
                                        <td>
                                            {{p.buyerAddress}}
                                        </td>

                                        <td class="text-right">
                                            <base-dropdown class="dropdown" position="right">
                                                <a slot="title" class="btn btn-icon-only text-light" role="button"
                                                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                    <i class="fas fa-ellipsis-v"></i>
                                                </a>

                                                <template>
                                                    <a @click="rincianTrx(p.trxId)" class="dropdown-item"
                                                        style="cursor: pointer">Rincian</a>
                                                    <a class="dropdown-item" @click="editTrxItem(p.trxId, null)"
                                                        style="cursor: pointer">Edit</a>
                                                    <a class="dropdown-item" @click="deleteTrx(p.trxId, null)"
                                                        style="cursor: pointer">Delete</a>
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
        <div class="modal fade" id="modalRincianTrx">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">

                    <!-- Modal Header -->
                    <div class="modal-header">
                        <h4 class="modal-title">Rincian Transaksi : ID {{detailTrx.trxId}} </h4>
                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                    </div>

                    <!-- Modal body -->
                    <div class="modal-body">

                        <div class="alert py-2 alert-danger" id="alertError_rincianTrx" v-if="alertError_rincianTrx">
                            Peringatan! {{alertError_rincianTrx}}
                        </div>

                        <div class="alert py-2 alert-success" id="alertSuccess_rincianTrx"
                            v-if="alertSuccess_rincianTrx">
                            Berhasil! {{alertSuccess_rincianTrx}}
                        </div>

                        <div class="row">
                            <div class="col mb-2">
                                Informasi Pembeli
                                <small>
                                    <table class="w-100">
                                        <tr>
                                            <td>Nama</td>
                                            <td style="width: 20px" class="text-center">
                                                :
                                            </td>
                                            <td>
                                                {{detailTrx.buyerName}}
                                            </td>
                                        </tr>

                                        <tr>
                                            <td>
                                                No Hp
                                            </td>
                                            <td style="width: 20px" class="text-center">
                                                :
                                            </td>
                                            <td>
                                                {{detailTrx.buyerPhone}}
                                            </td>
                                        </tr>

                                        <tr>
                                            <td>
                                                Alamat
                                            </td>
                                            <td style="width: 20px" class="text-center">
                                                :
                                            </td>
                                            <td>
                                                {{detailTrx.buyerAddress}}
                                            </td>
                                        </tr>
                                    </table>
                                </small>
                            </div>

                            <div class="col-lg-8 col-sm-12 col-md-12 mt-2">

                                <div v-if="animasiPesananDitandaiSelesai" style="height: 100%"
                                    class="justify-content-center text-center d-flex align-items-center">
                                    <div class="text-center mt-3">
                                        <img src="img/check.png" width="90px" alt="">
                                        <h5 class="mt-3">Pesanan Selesai dan siap dikirim</h5>
                                    </div>
                                </div>

                                <div v-if="infoItem">
                                    Informasi Item

                                    <div class="table-responsive mt-2">
                                        <table class="table">
                                            <tr>
                                                <td>No</td>
                                                <td>SKU</td>
                                                <td>Nama</td>
                                                <td>
                                                    Qty
                                                </td>
                                                <td></td>
                                            </tr>

                                            <tbody>
                                                <tr v-for="(i, index) in rincianTrxItem" :key="index">
                                                    <td>
                                                        {{index + 1}}
                                                    </td>
                                                    <td>
                                                        {{i.productId}}
                                                    </td>
                                                    <td>
                                                        {{i.productName}}
                                                    </td>
                                                    <td>
                                                        {{i.qty}}
                                                    </td>
                                                    <td>
                                                        <button @click="scanBarShow(i.productId)"
                                                            :id="'scanBarShowBtnProductId' + i.productId"
                                                            class="btn btn-sm scanBarShowBtnProduct">
                                                            <i class="fas fa-barcode"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Modal footer -->
                    <div class="modal-footer">
                        <input autofocus placeholder="Scan SKU Barang" id="scanBar"
                            class="form-control border form-control-alternative d-inline col" v-model="scanBarval"
                            @change="scanBarRead()" type="text" v-if="scanBar">
                        <button type="button" class="btn border" @click="scanCloseAction()"
                            v-if="scanClose">Cancel</button>
                        <button class="btn btn-success w-100" @click="pesananSelesaiBtnAct()"
                            v-if="pesananSelesaiBtn">Tandai Selesai</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- The Modal -->
        <div class="modal fade" id="modalEditTrx">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">

                    <form @submit.prevent="editTrxItem(editTrxData.trxId, 'save')">
                        <!-- Modal Header -->
                        <div class="modal-header">
                            <h4 class="modal-title">Edit Transaksi id {{editTrxData.trxId}} </h4>
                            <button @click="dismisEditTrx()" type="button" class="close"
                                data-dismiss="modal">&times;</button>
                        </div>

                        <!-- Modal body -->
                        <div class="modal-body">
                            <div class="row">
                                <div class="col mb-2">

                                    <div class="text-muted mb-3">
                                        Informasi Pembeli
                                    </div>

                                    <input required placeholder="Nama Pembeli" v-model="editTrxData.buyerName"
                                        class="form-control border form-control-alternative mb-3" type="text">

                                    <input required placeholder="No Hp Pembeli" v-model="editTrxData.buyerPhone"
                                        class="form-control border form-control-alternative mb-3" type="text">

                                    <textarea v-model="editTrxData.buyerAddress" placeholder="Alamat Pembeli" required
                                        rows="5" class="form-control form-control-alternative border">

                                </textarea>

                                    <br>

                                    <p class="text-muted">
                                        <small>
                                            Total Pesanan : Rp.
                                            {{editTrxData_detailItem_allPrice.reduce((a,b) => a+b, 0)}}

                                            <br>

                                            <span v-if="editTrxData_Status">
                                                Status : {{editTrxData_Status}}
                                            </span>
                                        </small>
                                    </p>

                                </div>

                                <div class="col-lg-8 col-sm-12 col-md-12" style="height: 60vh; overflow-y: auto">
                                    <div class="text-muted mb-3">
                                        Informasi Barang
                                    </div>

                                    <div v-for="(trx, index) in editTrxData_detailItem" :key="index">
                                        <div class="row mb-3">
                                            <div class="col-8">
                                                <select name="product" v-model="trx.productId" class="custom-select">
                                                    <!-- <option selected :value="trx.productId"> {{trx.productId}} -
                                                        {{trx.productName}}</option> -->

                                                    <option v-for="p in editTrxData_detailItem_allProduct"
                                                        :key="p.product_id" :value="p.product_id">
                                                        {{p.product_id}} - {{p.name}}
                                                    </option>
                                                </select>
                                            </div>

                                            <div class="col">
                                                <input class="form-control form-control-alternative"
                                                    @change="changePriceOnQtyInput()" placeholder="Qty"
                                                    v-model="trx.qty" type="number">
                                            </div>
                                        </div>
                                    </div>

                                    <button v-if="itemEditDelete_onEditTrx" @click="removeOneItemOneditItem()"
                                        class="btn btn-sm ml-2 float-right mt-3 btn-success" type="button">
                                        <i class="ni ni-fat-delete"></i>
                                    </button>

                                    <button v-if="itemEditDelete_onEditTrx" @click="addItemOneditItem()"
                                        class="btn btn-sm float-right mt-3 btn-success" type="button">
                                        <i class="ni ni-fat-add"></i>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Modal footer -->
                        <div class="modal-footer">
                            <button type="submit" class="btn btn-success submitEditTrx">
                                <img src="" width="20x" alt="">
                                Save
                            </button>
                            <button type="button" class="btn border" @click="dismisEditTrx()"
                                data-dismiss="modal">Cancel</button>
                        </div>
                    </form>

                </div>
            </div>
        </div>

        <!-- The Modal -->
        <div class="modal fade" id="modalConfirmDelete">
            <div class="modal-dialog">
                <div class="modal-content">

                    <!-- Modal body -->
                    <div class="modal-body">
                        Are you sure want to delete all order item with transaction id {{deleteTrx_temp}} ?
                    </div>

                    <!-- Modal footer -->
                    <div class="modal-footer">
                        <button class="btn btn-success submitDeleteBtn" @click="deleteTrx(deleteTrx_temp, 'delete')"
                            type="button">
                            <img src="" width="20x" alt="">
                            Yes
                        </button>
                        <button type="button" class="btn border" data-dismiss="modal">Cancel</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- The Modal -->
        <div class="modal fade" id="modalImport">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">

                    <!-- Modal Header -->
                    <div class="modal-header">
                        <h4 class="modal-title">Import Orderan</h4>
                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                    </div>

                    <!-- Modal body -->
                    <div class="modal-body">
                        <div class="row">
                            <div class="col mb-2">
                                <vue-csv-import v-model="csvImport" submitBtnText="Buka" autoMatchFields
                                    loadBtnText="Buka" headers="true"
                                    :map-fields="['trxId', 'appId', 'buyerName', 'buyerPhone', 'buyerAddress', 'productId', 'productName', 'qty']">
                                </vue-csv-import>

                                <p v-if="csvImport.length > 0">
                                    <small>
                                        {{csvImport.length}} data akan diimport{{importStatus}}
                                    </small>
                                </p>
                            </div>

                            <div v-if="instruksiPengisian" class="col-lg-8 col-sm-12 col-md-12">
                                Instruksi Import data
                                <ol>
                                    <li>Jika aplikasimu belum memiliki orderan masuk, silahkan ke langkah no 2 dan
                                        hiraukan langkah no 3, jika sudah memiliki orderan maka langsung lanjut ke
                                        langkah 3, hiraukan langkah 2 </li>
                                    <li>Unduh <a target="_blank"
                                            href="https://api.bikermart.co.id/assets/yukpickup/orderMasuk_Excel_Sample/orderMasuk.xlsx">template
                                            contoh import disini</a> </li> (template berupa xlsx belum berupa csv)
                                    <li>Jika aplikasimu sudah memiliki orderan masuk, silahkan unduh
                                        <download-csv name="Export All Order - YukPickup.csv" separator-excel='true'
                                            class="nav-link p-0 d-inline text-primary" :data="exportData">
                                            export data orderanmu disini
                                        </download-csv>
                                    </li>
                                    <li>isi template tersebut dengan benar</li>
                                    <li>Setelah selesai mengisi silahkan konversi excel tadi menjadi csv <a
                                            target="_blank" href="https://convertio.co/xlsx-csv/">menggunakan tools
                                            ini</a> </li>
                                    <li>Lalu import pada menu ini</li>
                                </ol>

                                Petunjuk pengisian excel
                                <ol>
                                    <li>id : id data (bisa di kosongkan saja)</li>
                                    <li>trxId : ID transaksi diisi bebas, namun pastikan setiap pembeli ID transaksinya
                                        berbeda. Cth, Jika agus membeli sepatu dan buku maka buat dua baris data dan
                                        samaakan id transaksinya (lihat template contoh) </li>
                                    <li>appId : ID aplikasi bisa dilihat pada halaman dashboard</li>
                                    <li>buyerName : Nama Pembeli</li>
                                    <li>buyerPhone : No Telp pembeli</li>
                                    <li>buyerAddress : Alamat pembeli </li>
                                    <li>productId : Id produk berupa SKU produk yang dibeli</li>
                                    <li>productName : Nama barang yang dibeli pembeli</li>
                                </ol>
                            </div>
                        </div>
                    </div>

                    <!-- Modal footer -->
                    <div class="modal-footer">
                        <button type="button" @click="settingsBtnAction()" v-if="settingsBtn"
                            class="btn border">Settings</button>
                        <button type="button" @click="submitImportData()" class="btn btn-success submitImportData">
                            <img src="" width="20x" alt="">
                            Import
                        </button>
                        <button type="button" class="btn border modalDismisBtn" data-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import cardStatus from '@/components/cardStatus.vue';
    import axios from 'axios';
    import {
        VueCsvImport
    } from 'vue-csv-import';
    import $ from 'jquery'
    import Vue from 'vue'
    import JsonCSV from 'vue-json-csv'

    Vue.component('downloadCsv', JsonCSV)

    const email = sessionStorage.getItem('LoggedUserYukPickup_email')
    const token = sessionStorage.getItem('LoggedUserYukPickup_token')
    const app_id = localStorage.getItem('yukpickup_selected_app_id')
    const key = 'Bikermart#2020'

    export default {
        components: {
            cardStatus,
            VueCsvImport
        },
        data() {
            return {
                searchBar: null,
                tableData: [],
                exportData: [],
                csvImport: [],
                rincianTrxItem: [],
                settingsBtn: false,
                instruksiPengisian: true,
                importStatus: null,
                infoItem: true,

                scanBar: false,
                scanBarval: null,
                scanClose: false,

                temp_scan: null,

                alertSuccess_rincianTrx: null,
                alertError_rincianTrx: null,
                pesananSelesaiBtn: false,
                animasiPesananDitandaiSelesai: false,

                itemEditDelete_onEditTrx: false,

                deleteTrx_temp: null,
                editTrxData: {
                    'trxId': null,
                    'appId': null,
                    'buyerName': null,
                    'buyerPhone': null,
                    'buyerAddress': null,
                    'productId': null,
                    'productName': null,
                    'qty': null,
                },

                editTrxData_detailItem: [],
                editTrxData_detailItem_allProduct: [],
                editTrxData_detailItem_allPrice: [],

                editTrxData_Status: null,

                detailTrx: {
                    'trxId': null,
                    'appId': null,
                    'buyerName': null,
                    'buyerPhone': null,
                    'buyerAddress': null,
                    'productId': null,
                    'productName': null,
                    'qty': null,
                }
            };
        },

        watch: {
            csvImport() {
                $('.submitImportData').hide();
                $('.modalDismisBtn').hide();

                if (this.csvImport.length > 0) {
                    this.settingsBtn = true
                    this.instruksiPengisian = false

                    $('.submitImportData').show();
                    $('.modalDismisBtn').hide();
                } else {
                    this.settingsBtn = false
                    this.instruksiPengisian = false
                    this.csvImport = []

                    $('.submitImportData').hide();
                    $('.modalDismisBtn').show();
                    $('.submitImportData img').hide();
                }
            }
        },

        methods: {

            editTrxItem(key, action) {
                if (action == 'save') {
                    $('.submitEditTrx').prop('disabled', true)
                    $('.submitEditTrx img').attr('src', 'img/loading-white.gif')

                    var buyer = {
                        'trxId': this.editTrxData.trxId,
                        'appId': this.editTrxData.appId,
                        'buyerName': this.editTrxData.buyerName,
                        'buyerPhone': this.editTrxData.buyerPhone,
                        'buyerAddress': this.editTrxData.buyerAddress,
                    }

                    var item = this.editTrxData_detailItem

                    // Kirim ke server berupa data Raw JSON

                    // Buyer detail
                    var FormData = require('form-data')
                    var myData = new FormData()
                    myData.set('buyerRaw', JSON.stringify(buyer))
                    myData.set('itemRaw', JSON.stringify(item))

                    axios({
                        url: 'https://api.bikermart.co.id/v2/order/saveEditItemTrx',
                        method: 'post',
                        headers: {
                            key: 'Bikermart#2020',
                            email: sessionStorage.getItem('LoggedUserYukPickup_email'),
                            token: sessionStorage.getItem('LoggedUserYukPickup_token'),
                            app_id: localStorage.getItem('yukpickup_selected_app_id')
                        },
                        data: myData
                    }).then((res) => {

                        if (res.data.msg == 'success') {
                            this.editTrxData_Status = res.data.msg
                        } else {
                            this.editTrxData_Status = 'Terjadi kegagalan, silahkan coba lagi'
                        }

                        setInterval(() => {
                            this.editTrxData_Status = null
                        }, 4000);

                        $('.submitEditTrx').prop('disabled', false)
                        $('.submitEditTrx img').attr('src', '')

                    }).catch((err) => {
                        console.error(err);
                        this.editTrxData_Status = 'Terjadi kegagalan, silahkan coba lagi'
                    })


                } else {
                    this.editTrxData_detailItem_allProduct = []
                    this.editTrxData_detailItem = []
                    this.editTrxData = []
                    this.itemEditDelete_onEditTrx = false
                    this.editTrxData_detailItem_allPrice = []

                    $('.submitEditTrx').prop('disabled', false)
                    $('.submitEditTrx img').attr('src', '')

                    for (let i = 0; i < this.tableData.length; i++) {
                        if (this.tableData[i].trxId == key) {
                            this.editTrxData = this.tableData[i]
                        }
                    }

                    axios({
                        url: 'https://api.bikermart.co.id/v2/order/getOrderIdTrx',
                        headers: {
                            key: 'Bikermart#2020',
                            email: sessionStorage.getItem('LoggedUserYukPickup_email'),
                            token: sessionStorage.getItem('LoggedUserYukPickup_token'),
                            app_id: localStorage.getItem('yukpickup_selected_app_id')
                        },
                        params: {
                            trxId: key
                        }
                    }).then((res) => {
                        this.editTrxData_detailItem = res.data.item

                        // Menambahkan semua harga item barang
                        for (let i = 0; i < this.editTrxData_detailItem.length; i++) {
                            axios({
                                url: 'https://api.bikermart.co.id/v2/order/getProductPriceBySKU',
                                headers: {
                                    key: 'Bikermart#2020',
                                    email: sessionStorage.getItem('LoggedUserYukPickup_email'),
                                    token: sessionStorage.getItem('LoggedUserYukPickup_token'),
                                    app_id: localStorage.getItem('yukpickup_selected_app_id')
                                },
                                params: {
                                    sku: this.editTrxData_detailItem[i].productId
                                }
                            }).then((res) => {
                                this.editTrxData_detailItem_allPrice.push(res.data.item.sell_price *
                                    this
                                    .editTrxData_detailItem[i].qty)
                            })
                        }
                    }).catch((err) => {
                        console.error(err);
                    })

                    // Mendapatkan semua produk untuk di loop pada tag html select

                    axios({
                        url: 'https://api.bikermart.co.id/v1/product/getProductByIdApp',
                        params: {
                            key: 'Bikermart#2020',
                            email: sessionStorage.getItem('LoggedUserYukPickup_email'),
                            token: sessionStorage.getItem('LoggedUserYukPickup_token'),
                            app_id: localStorage.getItem('yukpickup_selected_app_id')
                        },
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    }).then((res) => {
                        this.editTrxData_detailItem_allProduct = res.data.data.product
                        this.itemEditDelete_onEditTrx = true
                    })

                    $('#modalEditTrx').modal('show')
                }
            },

            changePriceOnQtyInput() {
                this.editTrxData_detailItem_allPrice = []

                // Menambahkan semua harga item barang
                for (let i = 0; i < this.editTrxData_detailItem.length; i++) {
                    axios({
                        url: 'https://api.bikermart.co.id/v2/order/getProductPriceBySKU',
                        headers: {
                            key: 'Bikermart#2020',
                            email: sessionStorage.getItem('LoggedUserYukPickup_email'),
                            token: sessionStorage.getItem('LoggedUserYukPickup_token'),
                            app_id: localStorage.getItem('yukpickup_selected_app_id')
                        },
                        params: {
                            sku: this.editTrxData_detailItem[i].productId
                        }
                    }).then((res) => {
                        this.editTrxData_detailItem_allPrice.push(res.data.item.sell_price * this
                            .editTrxData_detailItem[i].qty)
                    })
                }
            },

            addItemOneditItem() {
                this.editTrxData_detailItem.push({
                    productId: '',
                    productName: '',
                    qty: '0'
                })

                this.editTrxData_detailItem_allPrice = []

                // Menambahkan semua harga item barang
                for (let i = 0; i < this.editTrxData_detailItem.length; i++) {
                    axios({
                        url: 'https://api.bikermart.co.id/v2/order/getProductPriceBySKU',
                        headers: {
                            key: 'Bikermart#2020',
                            email: sessionStorage.getItem('LoggedUserYukPickup_email'),
                            token: sessionStorage.getItem('LoggedUserYukPickup_token'),
                            app_id: localStorage.getItem('yukpickup_selected_app_id')
                        },
                        params: {
                            sku: this.editTrxData_detailItem[i].productId
                        }
                    }).then((res) => {
                        this.editTrxData_detailItem_allPrice.push(res.data.item.sell_price * this
                            .editTrxData_detailItem[i].qty)
                    })
                }
            },

            dismisEditTrx() {
                this.editTrxData_detailItem_allProduct = []
                this.editTrxData_detailItem = []
                this.editTrxData_detailItem = []

                $('.submitEditTrx').prop('disabled', false)
                $('.submitEditTrx img').attr('src', '')
            },

            removeOneItemOneditItem() {
                this.editTrxData_detailItem.pop()

                this.editTrxData_detailItem_allPrice = []

                // Menambahkan semua harga item barang
                for (let i = 0; i < this.editTrxData_detailItem.length; i++) {
                    axios({
                        url: 'https://api.bikermart.co.id/v2/order/getProductPriceBySKU',
                        headers: {
                            key: 'Bikermart#2020',
                            email: sessionStorage.getItem('LoggedUserYukPickup_email'),
                            token: sessionStorage.getItem('LoggedUserYukPickup_token'),
                            app_id: localStorage.getItem('yukpickup_selected_app_id')
                        },
                        params: {
                            sku: this.editTrxData_detailItem[i].productId
                        }
                    }).then((res) => {
                        this.editTrxData_detailItem_allPrice.push(res.data.item.sell_price * this
                            .editTrxData_detailItem[i].qty)
                    })
                }
            },

            deleteTrx(key, action) {
                $('.submitDeleteBtn img').hide()
                if (action == 'delete') {
                    $('.submitDeleteBtn').prop('disabled', true)
                    $('.submitDeleteBtn img').attr('src', 'img/loading-white.gif')
                    $('.submitDeleteBtn img').show()
                    axios({
                        url: 'https://api.bikermart.co.id/v2/order/deleteOrderByIdTrx',
                        params: {
                            trxId: key
                        },
                        headers: {
                            key: 'Bikermart#2020',
                            email: sessionStorage.getItem('LoggedUserYukPickup_email'),
                            token: sessionStorage.getItem('LoggedUserYukPickup_token'),
                            app_id: localStorage.getItem('yukpickup_selected_app_id')
                        }
                    }).then((res) => {
                        console.log(res.data);
                        $('.submitDeleteBtn').prop('disabled', false)
                        $('#modalConfirmDelete').modal('hide')
                        $('.submitDeleteBtn img').hide()
                        $('.submitDeleteBtn img').attr('src', '')
                        this.getAllOrder()
                    }).catch((err) => {
                        console.error(err);
                        $('.submitDeleteBtn').prop('disabled', false)
                        $('.submitDeleteBtn img').attr('src', '')
                        $('.submitDeleteBtn img').hide()
                    })
                } else {
                    this.deleteTrx_temp = key
                    $('#modalConfirmDelete').modal('show')
                }
            },

            scanBarShow(params) {
                // console.log(params);
                this.temp_scan = params
                this.scanBar = true
                this.scanClose = true
                this.modalClose = false
            },

            scanCloseAction() {
                this.scanBar = false
                this.scanClose = false
                this.modalClose = true
                this.temp_scan = null
            },

            scanBarRead() {
                if (this.scanBarval == this.temp_scan) {
                    this.alertSuccess_rincianTrx = 'Kode barang sesuai'

                    $('#scanBarShowBtnProductId' + this.temp_scan).prop('disabled', true)
                    $('#scanBarShowBtnProductId' + this.temp_scan + ' i').removeClass('fas fa-barcode');
                    $('#scanBarShowBtnProductId' + this.temp_scan + ' i').addClass('ni ni-check-bold text-success');

                    var all_html = $(".scanBarShowBtnProduct i").map(function () {
                        if ($(this).attr('class') == 'ni ni-check-bold text-success')
                            return $(this).attr('class');
                        else
                            return false
                    }).get();

                    for (let i = 0; i < all_html.length; i++) {
                        if (all_html[i] == 'ni ni-check-bold text-success' && all_html.indexOf(false) < 0) {
                            this.pesananSelesaiBtn = true
                            $('#modalRincianTrx .close').hide();
                        } else {
                            this.pesananSelesaiBtn = false
                        }
                    }

                } else {
                    this.alertError_rincianTrx = 'Kode barang tidak sesuai'
                }

                this.scanBarval = null
                this.scanCloseAction()

                setInterval(() => {
                    this.alertSuccess_rincianTrx = null
                    this.alertError_rincianTrx = null
                }, 2000);
            },

            pesananSelesaiBtnAct() {
                axios({
                    url: 'https://api.bikermart.co.id/v2/order/saveOrderSelesai',
                    headers: {
                        key: 'Bikermart#2020',
                        email: sessionStorage.getItem('LoggedUserYukPickup_email'),
                        token: sessionStorage.getItem('LoggedUserYukPickup_token'),
                        app_id: localStorage.getItem('yukpickup_selected_app_id')
                    },
                    params: {
                        trxId: this.detailTrx.trxId
                    }
                }).then((res) => {
                    if (res.data.status == 'success') {
                        console.log('Berhasil menyimpan orderan');
                        this.animasiPesananDitandaiSelesai = true
                        this.infoItem = false
                        this.pesananSelesaiBtn = false
                        $('#modalRincianTrx .close').show();
                    } else {
                        console.error(res.data.status);
                        this.alertError_rincianTrx = 'Terjadi kesalahan, silahkan coba lagi'
                        $('#modalRincianTrx .close').show();
                    }
                }).catch((err) => {
                    this.alertError_rincianTrx = 'Terjadi kesalahan, silahkan coba lagi'
                    console.error(err);
                })
            },

            rincianTrx(key) {
                $('#modalRincianTrx').modal('show')

                if ($(document).width() <= 601) {
                    $('body').css({
                        'overflow': 'hidden'
                    });

                    $('html').css({
                        'overflow': 'hidden'
                    });
                }

                this.detailTrx = []

                for (let i = 0; i < this.tableData.length; i++) {
                    if (this.tableData[i].trxId == key) {
                        this.detailTrx = this.tableData[i]
                    }
                }

                this.rincianTrxItem = []

                // Cari semua item transaksi berdasarkan id transaksi
                axios({
                    url: 'https://api.bikermart.co.id/v2/order/getOrderIdTrx',
                    method: 'get',
                    headers: {
                        key: 'Bikermart#2020',
                        email: sessionStorage.getItem('LoggedUserYukPickup_email'),
                        token: sessionStorage.getItem('LoggedUserYukPickup_token'),
                        app_id: localStorage.getItem('yukpickup_selected_app_id')
                    },
                    params: {
                        trxId: this.detailTrx.trxId
                    }
                }).then((res) => {
                    this.rincianTrxItem = res.data.item
                    console.log(res.data);
                }).catch((err) => {
                    console.error(err);
                })
            },

            settingsBtnAction() {
                $('.vue-csv-mapping').toggle()
            },

            submitImportData() {
                var FormData = require('form-data')
                var myData = new FormData()

                myData.set('raw', JSON.stringify(this.csvImport))

                $('.submitImportData img').attr('src', 'img/loading-white.gif')
                $('.submitImportData img').show();
                $('.submitImportData').prop('disabled', true)

                axios({
                    url: 'https://api.bikermart.co.id/v2/order/importData',
                    method: 'post',
                    headers: {
                        'key': key,
                        'email': email,
                        'token': token,
                        'app_id': app_id,
                        'Content-Type': 'multipart/form-data',
                    },
                    data: myData
                }).then((res) => {
                    console.log(res.data);

                    if (res.data.msg == 'success') {
                        this.importStatus = ', dan berhasil disimpan pada server'

                        setInterval(() => {
                            this.$router.go()
                        }, 3000);
                    } else {
                        this.importStatus = ', dan terjadi kesalahan pada server'
                    }

                    $('.submitImportData img').attr('src', '')
                    $('.submitImportData img').hide();
                    $('.submitImportData').prop('disabled', false)
                }).catch((err) => {
                    console.error(err);

                    $('.submitImportData img').attr('src', '')
                    $('.submitImportData img').hide();
                    $('.submitImportData').prop('disabled', false)
                    this.importStatus = ', dan terjadi kesalahan pada server'
                })
            },

            getAllOrder() {
                axios({
                    url: 'https://api.bikermart.co.id/v2/order/getOrderByApp',
                    method: 'get',
                    headers: {
                        key: key,
                        email: email,
                        token: token,
                        app_id: app_id
                    }
                }).then((res) => {
                    this.tableData = res.data.order

                    // Mengambil semua data transaksi lengkap untuk di ekspor
                    axios({
                        url: 'https://api.bikermart.co.id/v2/order/exportDataByTrxId',
                        headers: {
                            key: 'Bikermart#2020',
                            email: sessionStorage.getItem('LoggedUserYukPickup_email'),
                            token: sessionStorage.getItem('LoggedUserYukPickup_token'),
                            app_id: localStorage.getItem('yukpickup_selected_app_id')
                        }
                    }).then((res) => {
                        this.exportData = res.data.data
                    }).catch((err) => {
                        console.error(err);
                    })
                }).catch((err) => {
                    console.error(err);
                })
            }
        },
        mounted() {
            this.getAllOrder()

            $('#modalRincianTrx .close').click(function () {
                this.temp_scan = null
                this.rincianTrxItem = []
                this.getAllOrder()
            })

            $(document).ready(function () {
                $("#searchBar").on("change keyup dblclick", function () {
                    var value = $(this).val().toLowerCase();
                    $("#konten tr").filter(function () {
                        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
                    });
                });
            });
        }
    };
</script>

<style>
    .vue-csv-mapping {
        display: none;
    }

    .table-responsive {
        height: 45vh;
        overflow-y: hidden;
    }

    @media (max-width: 601px) {

        #modalRincianTrx.modal,
        #modalRincianTrx .modal-dialog,
        #modalRincianTrx .modal-content {
            height: 100vh;
            width: 100%;
            position: fixed;
            overflow: hidden !important;
            left: 0px;
            right: 0px;
            top: 0px;
            border-radius: 0px !important;
        }
    }
</style>
