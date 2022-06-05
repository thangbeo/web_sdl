<template>
  <div>
    <v-row>
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
              Số loại sản phẩm theo danh mục sản phẩm
            </div>
            <div>
              <apexchart
                type="bar"
                height="600"
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
export default {
  components: {},
  data() {
    return {
      title: 'Tổng số lượng sản phẩm',
      open_confirm: false,
      time: 1,
      list_time: [{ value: 1, text: 'Hiện tại' }],
      series: [],
      chartOptions: {
        chart: {
          type: 'bar',
          toolbar: {
            show: false,
          },
        },
        plotOptions: {
          bar: {
            columnWidth: '30%',
          },
        },
        colors: ['#FF0F59', '#F5972D', '#47BBFF', '#17E555'],
        legend: {
          position: 'top',
          horizontalAlign: 'left',
          fontSize: '11px',
          offsetX: 300,
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
              return new Intl.NumberFormat('en-US').format(val) + ' sản phẩm'
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
          name: 'Đã hủy',
          data: [1000, 1000, 1000, 1000, 1000, 0, 0, 0, 0, 0, 0, 0],
        },
        {
          name: 'Chưa thanh toán',
          data: [4000, 4000, 4000, 4000, 4000, 0, 0, 0, 0, 0, 0, 0],
        },
        {
          name: 'Thanh toán',
          data: [6000, 6000, 6000, 6000, 6000, 0, 0, 0, 0, 0, 0, 0],
        },
        {
          name: 'Thành công',
          data: [9000, 9000, 9000, 9000, 9000, 0, 0, 0, 0, 0, 0, 0],
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
