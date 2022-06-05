<template>
  <div>
    <div class="font-weight-bold fs-18 py-2">Thống kê Nhà cung cấp</div>
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
                    Lượt đăng ký
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
                    @click="redirectPageSupplier"
                  >
                    <img src="~/assets/icon/dashboard/ncc.svg" />
                    <div class="pl-4">
                      <div class="fs-14">Tổng số NCC đăng ký</div>
                      <div class="font-weight-bold fs-24">
                        {{ $formatMoney({ amount: 4480 }) }}
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
                <div class="pa-4 pb-2">
                  <div class="fs-16 d-flex align-center">
                    <v-tabs v-model="tab" active-class="primary--text">
                      <v-tabs-slider
                        :style="`width: 50%; margin-left: ${
                          tab === 0 ? '36px' : '35px'
                        } !important`"
                      />
                      <v-tab
                        :class="
                          (tab !== 0 && 'black--text') +
                          ' text-none letter-spacing-normal fs-17 font-weight-bold'
                        "
                      >
                        Danh mục SP
                      </v-tab>
                      <v-tab
                        :class="
                          (tab !== 1 && 'black--text') +
                          ' text-none letter-spacing-normal fs-17 font-weight-bold'
                        "
                      >
                        Top NCC theo SL ...
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
                        type="line"
                        height="300"
                        :options="chartOptions"
                        :series="series"
                      />
                    </v-tab-item>

                    <v-tab-item>
                      <apexchart
                        type="line"
                        height="300"
                        :options="chartOptions"
                        :series="series"
                      />
                    </v-tab-item>
                  </v-tabs-items>
                </div>
              </div>
            </v-col>
            <v-col cols="6" class="py-0">
              <div class="white border-radius-3">
                <div class="pa-4 pb-2">
                  <div class="fs-16 d-flex align-center">
                    <v-tabs v-model="tab1" active-class="primary--text">
                      <v-tabs-slider
                        :style="`width: 50%; margin-left: ${
                          tab1 === 0 ? '28px' : '30px'
                        } !important`"
                      />
                      <v-tab
                        :class="
                          (tab1 !== 0 && 'black--text') +
                          ' text-none letter-spacing-normal fs-17 font-weight-bold'
                        "
                      >
                        Top NCC được ưa thích
                      </v-tab>
                      <v-tab
                        :class="
                          (tab1 !== 1 && 'black--text') +
                          ' text-none letter-spacing-normal fs-17 font-weight-bold'
                        "
                      >
                        Top NCC...
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
                  <v-tabs-items v-model="tab1">
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
  name: 'SupplierStatistics',
  data: () => ({
    time: 1,
    list_time: [{ value: 1, text: 'Hiện tại' }],
    tab: 0,
    tab1: 0,
    series: [],
    chartOptions: {
      chart: {
        group: 'social',
        type: 'line',
        toolbar: {
          show: false,
        },
      },
      colors: ['#FF0F59', '#F5972D', '#17E555', '#47BBFF'],
      markers: {
        size: 5,
        hover: {
          size: 7,
        },
        strokeColors: ['#FF0F59', '#F5972D', '#17E555', '#47BBFF'],
        strokeWidth: 2,
        fillOpacity: 0.1,
        strokeDashArray: [0.1, 10, 5, 10000],
      },
      legend: {
        position: 'top',
        horizontalAlign: 'left',
        fontSize: '10px',
        offsetX: 10,
        offsetY: -5,
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
            return `Tháng ${val}`
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
          'Nhà cung cấp 1',
          'Nhà cung cấp 2',
          'Nhà cung cấp 3',
          'Nhà cung cấp 4',
          'Nhà cung cấp 5',
          'Nhà cung cấp 6',
          'Nhà cung cấp 7',
          'Nhà cung cấp 8',
          'Nhà cung cấp 9',
          'Nhà cung cấp 10',
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
    toSupplier: '/dashboard/registration-ncc',
  }),
  created() {
    // console.log('week: ', moment().week())
    setTimeout(() => {
      this.series = [
        {
          name: 'Khách sạn',
          data: [
            3800,
            300,
            500,
            200,
            2100,
            6500,
            5800,
            6000,
            6200,
            4000,
            4500,
            4700,
          ],
        },
        {
          name: 'Nhà hàng',
          data: [
            4000,
            4600,
            6200,
            4000,
            4200,
            4300,
            4000,
            6200,
            8100,
            8500,
            8600,
            8000,
          ],
        },
        {
          name: 'Tour',
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
        {
          name: 'SP du lịch',
          data: [
            6000,
            5900,
            5700,
            6000,
            6300,
            5700,
            7100,
            8000,
            8900,
            9800,
            10900,
            9200,
          ],
        },
      ]
      this.series2 = [
        {
          data: [400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380],
        },
      ]
    }, 1000)
  },
  methods: {
    redirectPageSupplier() {
      this.$router.push(this.toSupplier)
    },
  },
}
</script>
