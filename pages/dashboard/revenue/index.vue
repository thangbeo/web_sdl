<template>
  <div>
    <v-row>
      <v-col cols="12">
        <div class="white border-radius-3">
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
              Doanh thu theo địa phương
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

      <v-col cols="12">
        <div class="white border-radius-3">
          <div class="pa-4" style="overflow-x: hidden">
            <div class="fs-16 font-weight-black d-flex align-center">
              Doanh thu theo danh mục sản phẩm
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
      title: 'Tổng doanh thu',
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
            columnWidth: '25%',
          },
        },
        colors: ['#FF0F59', '#F5972D', '#47BBFF'],
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
            columnWidth: '10%',
          },
        },
        colors: ['#47BBFF'],
        dataLabels: {
          enabled: false,
        },
        xaxis: {
          categories: ['Khách sạn', 'Nhà hàng', 'Sản phẩm', 'Tour du lịch'],
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
          name: 'Tỉnh/Thành phố',
          data: [1000, 1000, 1000, 1000, 1000, 1000, 1000, 0, 0, 0, 0, 0],
        },
        {
          name: 'Quận/Huyện',
          data: [4000, 4000, 4000, 4000, 4000, 4000, 4000, 0, 0, 0, 0, 0],
        },
        {
          name: 'Phường/Xã',
          data: [5800, 5800, 5800, 5800, 5800, 5800, 5800, 0, 0, 0, 0, 0],
        },
      ]
      this.series2 = [{ name: 'Doanh thu', data: [5000, 8000, 4200, 3800] }]
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
