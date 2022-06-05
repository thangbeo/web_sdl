<template>
  <div>
    <div class="font-weight-bold fs-18 py-2">Thống kê sản phẩm</div>
    <div>
      <v-row>
        <v-col cols="3">
          <v-hover>
            <template v-slot:default="{ hover }">
              <div
                :class="`white cp transition-swing border-radius-3 elevation-${
                  hover ? 20 : 0
                }`"
              >
                <div class="pa-4">
                  <div class="fs-16 d-flex align-center">
                    Doanh thu
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
                  <div
                    class="d-flex align-center"
                    style="height: 315px"
                    @click="redirectPageProduct"
                  >
                    <img src="~/assets/icon/dashboard/product.svg" />
                    <div class="pl-4">
                      <div class="fs-14">Tổng sản phẩm</div>
                      <div class="font-weight-bold fs-24">
                        {{ $formatMoney({ amount: 60000 }) }}
                      </div>
                      <div class="fs-14 font-weight-bold">
                        <span style="color: #f5972d">Chưa duyệt:</span>
                        {{ '4000' }}
                      </div>
                      <div class="fs-14 font-weight-bold">
                        <span style="color: #17e555">Đã duyệt:</span>
                        {{ '5000' }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </v-hover>
        </v-col>
        <v-col cols="9">
          <v-row>
            <v-col cols="6" class="py-0">
              <div class="white border-radius-3">
                <div class="pa-4" style="overflow-x: hidden">
                  <div class="fs-16 d-flex align-center">
                    Top SP giao dịch nhiều nhất
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
                  <div id="chart">
                    <apexchart
                      type="bar"
                      height="300"
                      :options="chartOptions"
                      :series="series"
                    />
                  </div>
                </div>
              </div>
            </v-col>
            <v-col cols="6" class="py-0">
              <div class="white border-radius-3">
                <div class="pa-4 pb-2">
                  <div class="fs-16 d-flex align-center">
                    Top SP được đánh giá 4-5 sao
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
          </v-row>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
// import moment from 'moment'

export default {
  name: 'ProductStatistics',
  data: () => ({
    time: 1,
    list_time: [{ value: 1, text: 'Hiện tại' }],
    tab: 0,
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
          columnWidth: '70%',
          distributed: false,
          horizontal: true,
          dataLabels: {
            position: 'bottom',
          },
        },
      },
      colors: ['#47BBFF'],
      dataLabels: {
        enabled: true,
        textAnchor: 'start',
        style: {
          colors: ['#fff'],
          fontSize: '10px',
        },
        formatter(val, opt) {
          return opt.w.globals.labels[opt.dataPointIndex]
        },
        offsetX: 0,
        dropShadow: {
          enabled: true,
        },
      },
      stroke: {
        width: 1,
        colors: ['#fff'],
      },
      xaxis: {
        categories: [
          'Sản phẩm du lịch 1',
          'Sản phẩm du lịch 2',
          'Sản phẩm du lịch 3',
          'Sản phẩm du lịch 4',
          'Sản phẩm du lịch 5',
          'Sản phẩm du lịch 6',
          'Sản phẩm du lịch 7',
          'Sản phẩm du lịch 8',
          'Sản phẩm du lịch 9',
          'Sản phẩm du lịch 10',
        ],
      },
      yaxis: {
        labels: {
          show: false,
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
          columnWidth: '70%',
          distributed: false,
          horizontal: true,
          dataLabels: {
            position: 'bottom',
          },
        },
      },
      colors: ['#47BBFF'],
      dataLabels: {
        enabled: true,
        textAnchor: 'start',
        style: {
          colors: ['#fff'],
          fontSize: '10px',
        },
        formatter(val, opt) {
          return opt.w.globals.labels[opt.dataPointIndex]
        },
        offsetX: 0,
        dropShadow: {
          enabled: true,
        },
      },
      stroke: {
        width: 1,
        colors: ['#fff'],
      },
      xaxis: {
        categories: [
          'Sản phẩm du lịch 1',
          'Sản phẩm du lịch 2',
          'Sản phẩm du lịch 3',
          'Sản phẩm du lịch 4',
          'Sản phẩm du lịch 5',
          'Sản phẩm du lịch 6',
          'Sản phẩm du lịch 7',
          'Sản phẩm du lịch 8',
          'Sản phẩm du lịch 9',
          'Sản phẩm du lịch 10',
        ],
      },
      yaxis: {
        labels: {
          show: false,
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
    toProduct: '/dashboard/product',
  }),
  created() {
    // console.log('week: ', moment().week())
    setTimeout(() => {
      this.series = [
        {
          name: 'Doanh thu',
          data: [400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380],
        },
      ]
      this.series2 = [
        {
          name: 'Doanh thu',
          data: [400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380],
        },
      ]
    }, 1000)
  },
  methods: {
    redirectPageProduct() {
      this.$router.push(this.toProduct)
    },
  },
}
</script>
