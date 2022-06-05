<template>
  <div>
    <v-row>
      <v-col cols="12" class="font-weight-bold py-0">
        Top 20 sản phẩm được đánh giá 4-5 sao
      </v-col>
      <v-col cols="12">
        <div class="white border-radius-3">
          <div class="pa-4" style="overflow-x: hidden">
            <div class="fs-16 d-flex align-center">
              Thống kê hàng tháng
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

      <v-col cols="12" class="font-weight-bold py-0">
        Top 20 sản phẩm bị phản ảnh nhiều
      </v-col>
      <v-col cols="12">
        <div class="white border-radius-3">
          <div class="pa-4" style="overflow-x: hidden">
            <div class="fs-16 d-flex align-center">
              Thống kê hàng tháng
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
      title: 'Top sản phẩm được đánh giá 4-5 sao',
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
            columnWidth: '50%',
          },
        },
        colors: ['#47BBFF'],
        dataLabels: {
          enabled: false,
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
              return `Ngày ${val}`
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
            columnWidth: '50%',
          },
        },
        colors: ['#47BBFF'],
        dataLabels: {
          enabled: false,
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
              return `Ngày ${val}`
            },
          },
          y: {
            formatter(val) {
              return new Intl.NumberFormat('en-US').format(val)
            },
          },
        },
      },
    }
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
          name: 'Sản phẩm',
          data: [
            1000,
            1000,
            1000,
            1000,
            1000,
            1000,
            1000,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
          ],
        },
      ]
      this.series2 = [
        {
          name: 'Sản phẩm',
          data: [
            5000,
            8000,
            4200,
            3800,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
          ],
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
  },
  head() {
    this.$store.commit('app/setTitle', this.title)
    return {
      title: this.title,
    }
  },
}
</script>
