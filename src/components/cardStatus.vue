<template>
    <div>
        <base-header type="gradient-success" class="pb-6 pb-8 pt-5 pt-md-8">
            <!-- Card stats -->
            <div class="row">
                <div class="col-xl-3 col-lg-6">
                    <stats-card title="Total Kategori"
                                type="gradient-red"
                                :sub-title="kategoriProduk"
                                icon="ni ni-app"
                                class="mb-4 mb-xl-0">
                    </stats-card>
                </div>
                <div class="col-xl-3 col-lg-6">
                    <stats-card title="Total Produk"
                                type="gradient-orange"
                                :sub-title="totalProduk"
                                icon="ni ni-chart-bar-32"
                                class="mb-4 mb-xl-0">
                    </stats-card>
                </div>
                <div class="col-xl-3 col-lg-6">
                    <stats-card title="Orderan Masuk"
                                type="gradient-green"
                                :sub-title="totalOrderan"
                                icon="ni ni-money-coins"
                                class="mb-4 mb-xl-0">
                    </stats-card>

                </div>
                <div class="col-xl-3 col-lg-6">
                    <stats-card title="Orderan Selesai"
                                type="gradient-info"
                                :sub-title="orderSelesai"
                                icon="ni ni-chart-bar-32"
                                class="mb-4 mb-xl-0">
                    </stats-card>
                </div>
            </div>
        </base-header>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    data() {
        return {
            kategoriProduk: 0,
            totalProduk: 0,
            totalOrderan: 0,
            orderSelesai: 0
        }
    },

    mounted() {
        this.get('kategori')
        this.get('produk')
        this.get('orderan')
        this.get('orderanSelesai')
    },

    methods: {
        get(params) {

            var key = encodeURIComponent('Bikermart#2020')
            var url = null

            if(params == 'produk') {
                url = 'https://api.bikermart.co.id/v1/product/getProductByIdApp?key=' + key + '&app_id=' + localStorage.getItem('yukpickup_selected_app_id')

                axios.get(url).then((res) => {

                    if(res.data.data.product.length > 0)
                        return this.totalProduk = res.data.data.product.length
                    else 
                        this.totalProduk = '0'
                }).catch((err) => {
                    console.log(err);
                    this.totalProduk = '0'
                })

            } else if(params == 'kategori') {
                 url = 'https://api.bikermart.co.id/v1/product/allCategory?app_id='+ localStorage.getItem('yukpickup_selected_app_id') +'&key=' + key

                 axios.get(url).then((res) => {
                    if(res.data.data.length > 0) {
                        return this.kategoriProduk = res.data.total
                    } else {
                        this.kategoriProduk = '0'
                    }
                 }).catch((err) => {
                     this.kategoriProduk = '??'
                     console.error(err);
                 })

                //  this.kategoriProduk = '0'
            } else if(params == 'orderan') {
                //  url = ''

                axios({
                    url: 'https://api.bikermart.co.id/v2/order/getOrderByApp',
                    method: 'get',
                    headers: {
                        key: 'Bikermart#2020',
                        email: sessionStorage.getItem('LoggedUserYukPickup_email'),
                        token: sessionStorage.getItem('LoggedUserYukPickup_token'),
                        app_id: localStorage.getItem('yukpickup_selected_app_id')
                    }
                }).then((res) => {
                    this.totalOrderan = res.data.total
                    // console.log(res);
                }).catch((err) => {
                    console.error(err);
                    this.totalOrderan = 0
                })
                
            } else if(params == 'orderanSelesai') {
                axios({
                    url: 'https://api.bikermart.co.id/v2/order/getOrderSelesaiByAppId',
                    method: 'get',
                    headers: {
                        key: 'Bikermart#2020',
                        email: sessionStorage.getItem('LoggedUserYukPickup_email'),
                        token: sessionStorage.getItem('LoggedUserYukPickup_token'),
                        app_id: localStorage.getItem('yukpickup_selected_app_id')
                    }
                }).then((res) => {
                    this.orderSelesai = res.data.total
                }).catch((err) => {
                    this.orderSelesai = '0'
                    console.log(err);
                })
                
            }

            
         }
    }
}
</script>