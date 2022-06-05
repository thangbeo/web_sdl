<template>
  <div>
    <v-row>
      <v-col cols="6">
        <div class="white border-radius-3">
          <div class="pa-4" style="overflow-x: hidden">
            <div class="fs-16 d-flex font-weight-black align-center">
              Số NCC mới đăng ký kinh doanh
              <div class="flex-grow-1"></div>
              <v-autocomplete
                v-model="time"
                :items="list_time"
                style="max-width: 120px"
                append-icon="mdi-chevron-down"
                class="border-1 fs-14"
                solo
                flat
                dense
                hide-details
              >
              </v-autocomplete>
            </div>
            <div id="chart-2">
              <apexchart
                type="bar"
                height="300"
                :options="chartOptions2"
                :series="series2"
              />
            </div>
          </div>
        </div>
      </v-col>
      <v-col cols="6">
        <div class="white border-radius-3 h-100">
          <div class="pa-4" style="overflow-x: hidden">
            <div
              class="fs-16 d-flex align-center"
              style="position: absolute; right: 20px; top: 20px; z-index: 100"
            >
              <div class="flex-grow-1"></div>
              <v-autocomplete
                v-model="time"
                :items="list_time"
                style="max-width: 120px"
                append-icon="mdi-chevron-down"
                class="border-1 fs-14"
                solo
                flat
                dense
                hide-details
              >
              </v-autocomplete>
            </div>
            <div class="font-weight-black" style="position: absolute">
              Thống kê tình trạng NCC
            </div>
            <div id="chart">
              <apexchart
                type="bar"
                height="340"
                :options="chartOptions"
                :series="series"
              />
            </div>
          </div>
        </div>
      </v-col>

      <v-col cols="12">
        <div class="white border-radius-3">
          <div class="pa-4" style="overflow-x: hidden">
            <div class="fs-16 font-weight-black d-flex align-center pb-1">
              Chi tiết số NCC đã đăng ký
              <div class="flex-grow-1"></div>
            </div>

            <div>
              <v-data-table
                :headers="headers"
                :items="items"
                :items-per-page="pageSize"
                hide-default-footer
                loading-text="Xin chờ..."
                no-results-text="Không có kết quả phù hợp"
                no-data-text="Không có dữ liệu"
                fixed-header
                multi-sort
                :sort-desc="true"
              >
                <template v-slot:[`item.status`]="{ item }">
                  <div v-if="item.status === 1" style="color: #47bbff">
                    Đang hoạt động
                  </div>
                  <div v-else style="color: #ff0f59">Dừng hoạt động</div>
                </template>
              </v-data-table>
              <pagination
                :page-info="pageInfo"
                :page="page"
                :page-size="pageSize"
                :page-count="pageCount"
                @changePage="changePage"
                @changePageSize="changePageSize"
              />
            </div>
          </div>
        </div>
      </v-col>
    </v-row>

    <yes-no-alert
      :open="open_confirm"
      alert-msg="Bạn chắc chắn muốn thoát không?"
      @toggle="open_confirm = !open_confirm"
      @OK="toggle"
    />
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      title: 'Tổng số NCC mới đăng ký kinh doanh',
      open_confirm: false,
      time: 1,
      list_time: [{ value: 1, text: 'Hiện tại' }],
      series: [],
      chartOptions: {
        chart: {
          type: 'bar',
          height: 300,
          toolbar: {
            show: false,
          },
        },
        plotOptions: {
          bar: {
            columnWidth: '35%',
          },
        },
        colors: ['#FF0F59', '#47BBFF'],
        stroke: {
          show: true,
          width: 2,
          colors: ['transparent'],
        },
        dataLabels: {
          enabled: false,
        },
        legend: {
          position: 'top',
          horizontalAlign: 'left',
          fontSize: '12px',
          offsetX: 182,
          offsetY: -2,
          markers: {
            width: 6,
            height: 6,
          },
        },
        xaxis: {
          categories: [
            'T1',
            'T2',
            'T3',
            'T4',
            'T5',
            'T6',
            'T7',
            'T8',
            'T9',
            'T10',
            'T11',
            'T12',
          ],
          labels: {
            style: {
              fontSize: '12px',
            },
          },
        },
        yaxis: {
          labels: {
            minWidth: 40,
          },
        },
        tooltip: {
          x: {
            show: true,
            formatter(val) {
              return (val || '').replace('T', 'Tháng ')
            },
          },
          y: {
            formatter(val) {
              return new Intl.NumberFormat('en-US').format(val)
            },
          },
        },
      },
      series2: [],
      chartOptions2: {
        chart: {
          type: 'bar',
          height: 300,
          toolbar: {
            show: false,
          },
        },
        plotOptions: {
          bar: {
            columnWidth: '20%',
          },
        },
        colors: ['#47BBFF'],
        dataLabels: {
          enabled: false,
        },
        xaxis: {
          categories: [
            'T1',
            'T2',
            'T3',
            'T4',
            'T5',
            'T6',
            'T7',
            'T8',
            'T9',
            'T10',
            'T11',
            'T12',
          ],
          labels: {
            style: {
              fontSize: '12px',
            },
          },
        },
        yaxis: {
          labels: {
            minWidth: 40,
          },
        },
        tooltip: {
          y: {
            formatter(val) {
              return new Intl.NumberFormat('en-US').format(val)
            },
          },
        },
      },
      items: [
        { id: 1, status: 1 },
        { id: 2, status: 0 },
      ],
      page: 1,
      pageCount: 1,
      pageSize: 50,
      pageInfo: {},
    }
  },
  computed: {
    headers() {
      return [
        {
          text: 'Tên NCC',
          value: 'name',
          sortable: false,
          width: 300,
        },
        {
          text: 'Doanh nghiệp',
          value: 'enterprise',
          sortable: false,
          width: 300,
        },
        {
          text: 'Mã đăng ký kinh doanh',
          value: 'code',
          sortable: false,
          width: 300,
        },
        {
          text: 'Loại sản phẩm',
          value: 'product_type',
          sortable: false,
          width: 300,
        },
        {
          text: 'Trạng thái',
          value: 'status',
          sortable: false,
          width: 300,
        },
      ]
    },
  },
  watch: {
    '$store.state.app.change_back'(value) {
      this.open_confirm = true
    },
  },
  mounted() {
    this.$store.commit('app/checkBack', true)
    setTimeout(() => {
      this.series = [
        {
          name: 'Không hoạt động',
          data: [8600, 1000, 3000, 6200, 6100, 0, 0, 0, 0, 0, 0, 0],
        },
        {
          name: 'Hoạt động',
          data: [4000, 8000, 2000, 1000, 1800, 0, 0, 0, 0, 0, 0, 0],
        },
      ]
      this.series2 = [
        {
          name: 'NCC',
          data: [8000, 4400, 6200, 3800, 6200, 2500, 0, 0, 0, 0, 0, 0],
        },
      ]
    }, 1000)
  },
  beforeDestroy() {
    this.$store.commit('app/checkBack', false)
  },
  methods: {
    toggle() {
      this.$router.push('/dashboard')
    },
    changePage(value) {
      this.page = value
      this.getList()
    },
    changePageSize(pageSizes) {
      if (pageSizes !== this.itemsPerPage) {
        this.page = 1
        this.pageSize = pageSizes
        this.getList()
      }
    },
    getList() {},
  },
  head() {
    this.$store.commit('app/setTitle', this.title)
    return {
      title: this.title,
    }
  },
}
</script>
