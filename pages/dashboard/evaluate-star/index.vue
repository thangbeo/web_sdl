<template>
  <div>
    <client-only>
      <v-row>
        <v-col cols="12">
          <div class="pa-4 h-100" style="overflow-x: hidden">
            <div class="fs-16 font-weight-black d-flex align-center">
              Thống kê đánh giá sao
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
              />
            </div>
            <div>
              <apexchart
                type="donut"
                height="620"
                width="100%"
                :options="chartOptions"
                :series="series"
              />
            </div>
          </div>
        </v-col>
      </v-row>
    </client-only>

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
      title: 'Tỷ lệ số lượt đánh giá sao',
      open_confirm: false,
      time: 1,
      list_time: [{ value: 1, text: 'Hiện tại' }],
      chartOptions: {
        chart: {
          type: 'donut',
        },
        plotOptions: {
          pie: {
            donut: {
              labels: {
                show: true,
                total: {
                  showAlways: true,
                  show: true,
                  label: 'Tổng',
                },
                value: {
                  show: true,
                  fontSize: '36px',
                  color: '#00000',
                  fontWeight: 600,
                },
                name: {
                  show: true,
                  color: '#000',
                  formatter(val) {
                    return 'Tổng'
                  },
                },
              },
            },
          },
        },
        labels: ['1 sao', '2 sao', '3 sao', '4 sao', '5 sao'],
        colors: ['#FF0F59', '#F5972D', '#47BBFF', '#17E555', '#4873C2'],
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200,
              },
            },
          },
        ],
        legend: {
          position: 'top',
          horizontalAlign: 'left',
        },
      },
      series: [],
    }
  },
  watch: {
    '$store.state.app.change_back'(value) {
      this.open_confirm = true
    },
  },
  mounted() {
    this.$store.commit('app/checkBack', true)
  },
  created() {
    this.series = [2000, 2000, 2000, 2000, 0]
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
