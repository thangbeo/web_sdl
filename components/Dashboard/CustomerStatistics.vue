<template>
  <div>
    <div class="font-weight-bold fs-18 py-2">Thống kê khách hàng</div>
    <div>
      <v-row>
        <v-col cols="6">
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
                    style="height: 132px"
                    @click="redirectPageRegistrationCustomer"
                  >
                    <img src="~/assets/icon/dashboard/ncc.svg" />
                    <div class="pl-4">
                      <div class="fs-14">Tổng số khách hàng đăng ký</div>
                      <div class="font-weight-bold fs-24">
                        {{ $formatMoney({ amount: 60000 }) }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </v-hover>
        </v-col>
        <v-col cols="6">
          <v-hover>
            <template v-slot:default="{ hover }">
              <div
                :class="`white cp transition-swing border-radius-3 elevation-${
                  hover ? 20 : 0
                }`"
              >
                <div class="pa-4">
                  <div class="fs-16 d-flex align-center">
                    Lượt giao dịch
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
                    style="height: 132px"
                    @click="redirectPageExchange"
                  >
                    <img src="~/assets/icon/dashboard/trade.svg" />
                    <div class="pl-4">
                      <div class="fs-14">Số lượt giao dịch</div>
                      <div class="font-weight-bold fs-24">
                        {{ $formatMoney({ amount: 60000 }) }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </v-hover>
        </v-col>
        <v-col cols="12">
          <div class="white border-radius-3">
            <div class="pa-4" style="overflow-x: hidden">
              <div class="fs-16 d-flex align-center">
                Số lượng khách hàng truy cập
                <div class="flex-grow-1"></div>
                <v-autocomplete
                  v-model="year"
                  :items="list_year"
                  style="max-width: 120px"
                  append-icon="mdi-chevron-down"
                  class="border-1 fs-14"
                  solo
                  flat
                  dense
                  hide-details
                >
                </v-autocomplete>
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
                  type="line"
                  height="320"
                  width="100%"
                  :options="chartOptions"
                  :series="series"
                />
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'CustomerStatistics',
  data: () => ({
    time: 1,
    list_time: [{ value: 1, text: 'Hiện tại' }],
    chartOptions: {
      chart: {
        height: 350,
        type: 'line',
        toolbar: {
          show: false,
        },
      },
      xaxis: {
        categories: [
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12,
          13,
          14,
          15,
          16,
          17,
          18,
          19,
          20,
          21,
          22,
          23,
          24,
          25,
          26,
          27,
          28,
          29,
          30,
        ],
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
      },
      colors: ['#FF0F59', '#F5972D', '#17E555', '#47BBFF'],
      legend: {
        show: false,
      },
    },
    series: [],
    year: '',
    list_year: [],
    toRegistrationCustomer: '/dashboard/registration-customer',
    toExchange: '/dashboard/exchange',
  }),
  created() {
    const year = Number(moment(new Date()).format('YYYY'))
    this.year = year
    for (let i = 0; i < 11; i++) {
      this.list_year.push(year - i)
    }

    setTimeout(() => {
      this.series = [
        {
          name: 'Khách sạn',
          data: this.setData(),
        },
        {
          name: 'Nhà hàng',
          data: this.setData(),
        },
        {
          name: 'Tour',
          data: this.setData(),
        },
        {
          name: 'SP du lịch',
          data: this.setData(),
        },
      ]
    }, 1000)
  },
  methods: {
    setData() {
      const array = []
      for (let i = 0; i < 30; i++) {
        array.push(Math.floor(Math.random() * 9701) + 300)
      }
      return array
    },
    redirectPageRegistrationCustomer() {
      this.$router.push(this.toRegistrationCustomer)
    },
    redirectPageExchange() {
      this.$router.push(this.toExchange)
    },
  },
}
</script>
