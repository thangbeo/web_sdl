<template>
  <div>
    <v-row>
      <v-col cols="12">
        <div class="white border-radius-3">
          <div class="pa-4 pb-2">
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
              Số lượng khách hàng đã tham gia giao dịch
            </div>
            <div>
              <apexchart
                type="line"
                height="320"
                :options="chartOptions"
                :series="series"
              />
            </div>
          </div>
        </div>
      </v-col>

      <v-col cols="12">
        <div class="white border-radius-3">
          <div class="pa-4 pb-2">
            <div
              class="fs-16 d-flex align-center"
              style="position: absolute; right: 20px; z-index: 100"
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
              Trạng thái giao dịch
            </div>
            <div>
              <apexchart
                type="bar"
                height="320"
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
      title: 'Số lượt giao dịch',
      open_confirm: false,
      time: 1,
      list_time: [{ value: 1, text: 'Hiện tại' }],
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
          fontSize: '11px',
          offsetX: 280,
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
          toolbar: {
            show: false,
          },
        },
        plotOptions: {
          bar: {
            columnWidth: '35%',
          },
        },
        colors: ['#FF0F59', '#F5972D', '#47BBFF', '#17E555'],
        legend: {
          position: 'top',
          horizontalAlign: 'left',
          fontSize: '11px',
          offsetX: 140,
          offsetY: -2,
          markers: {
            width: 6,
            height: 6,
          },
        },
        stroke: {
          show: true,
          width: 2,
          colors: ['transparent'],
        },
        dataLabels: {
          enabled: false,
        },
        xaxis: {
          categories: [
            'Thứ 2',
            'Thứ 3',
            'Thứ 4',
            'Thứ 5',
            'Thứ 6',
            'Thứ 7',
            'Chủ Nhật',
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
              return new Intl.NumberFormat('en-US').format(val) + ' giao dịch'
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
          name: 'Đã hủy',
          data: [1000, 1000, 1000, 1000, 1000],
        },
        {
          name: 'Chưa thanh toán',
          data: [4000, 4000, 4000, 4000, 4000],
        },
        {
          name: 'Thanh toán',
          data: [6000, 6000, 6000, 6000, 6000],
        },
        {
          name: 'Thành công',
          data: [9000, 9000, 9000, 9000, 9000],
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
