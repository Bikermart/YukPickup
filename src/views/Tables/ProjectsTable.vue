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
                  <base-button type="success" size="sm">import</base-button>
                  <base-button type="success" size="sm">export</base-button>
                </div>
              </div>
            </div>

            <div class="table-responsive">
              <base-table class="table align-items-center table-flush">
                <template slot="columns">
                  <th>ID</th>
                  <th>Data</th>
                  <th></th>
                </template>

                <template v-row="(row, index) in tableData">
                  <th scope="row">
                    1
                  </th>
                  <td class="budget">
                    1234
                  </td>

                  <td class="text-right">
                    <base-dropdown class="dropdown" position="right">
                      <a slot="title" class="btn btn-sm btn-icon-only text-light" role="button" data-toggle="dropdown"
                        aria-haspopup="true" aria-expanded="false">
                        <i class="fas fa-ellipsis-v"></i>
                      </a>

                      <template>
                        <a class="dropdown-item" href="#">Action</a>
                        <a class="dropdown-item" href="#">Another action</a>
                        <a class="dropdown-item" href="#">Something else here</a>
                      </template>
                    </base-dropdown>
                  </td>

                </template>

              </base-table>
            </div>

          </div>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
  import cardStatus from '@/components/cardStatus.vue';
  export default {
    name: 'tables',
    components: {
      cardStatus
    },

    data() {
      return {
        
      }
    }
  };
</script>

<style>
  .table-responsive {
    height: 70vh;
  }
</style>
