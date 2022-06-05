<template>
  <div>
    <v-row>
      <v-col cols="12">
        <div class="white border-radius-3">
          <div class="pa-4" style="overflow-x: hidden">
            <div class="fs-16 d-flex font-weight-black align-center">
              <div>Thống kê lượt nhận xét</div>
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
                type="area"
                height="620"
                :options="chartOptions"
                :series="series"
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
import moment from 'moment'

export default {
  components: {},
  data() {
    return {
      title: 'Chi tiết số lượt nhận xét',
      open_confirm: false,
      time: 1,
      list_time: [{ value: 1, text: 'Hiện tại' }],
      series: [],
      chartOptions: {},
    }
  },
  watch: {
    '$store.state.app.change_back'(value) {
      this.open_confirm = true
    },
  },
  mounted() {
    this.$store.commit('app/checkBack', true)

    const year = moment(new Date()).format('YYYY')
    const month = moment(new Date()).format('MM')
    const daysOfMonth = new Date(year, month, 0).getDate()
    const array = Number(daysOfMonth) + 1

    const categories = []

    for (let i = 0; i < array; i++) {
      categories.push(i + 1)
    }

    this.chartOptions = {
      chart: {
        type: 'area',
        height: 300,
        toolbar: {
          show: true,
        },
      },
      plotOptions: {
        bar: {
          // columnWidth: '25%',
        },
      },
      colors: ['#47BBFF'],
      stroke: {
        // show: true,
        curve: 'smooth',
        // width: 2,
        // colors: ['transparent'],
      },
      dataLabels: {
        enabled: false,
      },
      labels: {
        show: true,
      },
      xaxis: {
        categories,
        tickAmount: categories.length,
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
    }

    setTimeout(() => {
      this.series = [
        {
          name: 'Số lượng',
          data: [10, 20, 50, 60, 40, 30, 60, 90, 150, 180],
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
