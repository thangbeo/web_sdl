<template>
  <div>
    <div class="font-weight-bold fs-18 py-2">Thống kê doanh thu</div>
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
                    @click="redirectPageRevenue"
                  >
                    <img src="~/assets/icon/dashboard/revenue.svg" />
                    <div class="pl-4">
                      <div class="fs-14">Tổng doanh thu</div>
                      <div class="font-weight-bold fs-24">
                        {{ $formatMoney({ amount: 60000 }) }}
                      </div>
                      <div class="fs-14">{{ 'USD' }}</div>
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
                    Doanh thu theo thời gian
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
                    <v-tabs v-model="tab" active-class="primary--text">
                      <v-tabs-slider
                        :style="`width: 50%; margin-left: ${
                          tab === 0 ? '40px' : '33px'
                        } !important`"
                      />
                      <v-tab
                        :class="
                          (tab !== 0 && 'black--text') +
                          ' text-none letter-spacing-normal fs-17 font-weight-bold'
                        "
                      >
                        Top 10 doanh thu
                      </v-tab>
                      <v-tab
                        :class="
                          (tab !== 1 && 'black--text') +
                          ' text-none letter-spacing-normal fs-17 font-weight-bold'
                        "
                      >
                        Top 10 NCC
                      </v-tab>
                    </v-tabs>
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
                  <v-tabs-items v-model="tab">
                    <v-tab-item>
                      <apexchart
                        type="bar"
                        height="300"
                        :options="chartOptions2"
                        :series="series2"
                      />
                    </v-tab-item>

                    <v-tab-item>
                      <apexchart
                        type="bar"
                        height="300"
                        :options="chartOptions2"
                        :series="series2"
                      />
                    </v-tab-item>
                  </v-tabs-items>
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
  name: 'RevenueStatistics',
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
          columnWidth: '45%',
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
          // show: false,
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
    toRevenue: '/dashboard/revenue',
  }),
  created() {
    // console.log('week: ', moment().week())
    setTimeout(() => {
      this.series = [
        {
          name: 'Doanh thu',
          data: [
            9000,
            1000,
            2000,
            2800,
            1600,
            2100,
            1300,
            3000,
            4000,
            1000,
            7000,
            6000,
          ],
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
    redirectPageRevenue() {
      this.$router.push(this.toRevenue)
    },
  },
}
</script>
