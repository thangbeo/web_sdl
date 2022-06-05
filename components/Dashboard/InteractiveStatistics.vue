<template>
  <div>
    <div class="font-weight-bold fs-18 py-2">
      Thống kê tương tác của khách hàng
    </div>
    <div>
      <v-row>
        <v-col cols="6">
          <v-row>
            <v-col cols="12" class="pt-0">
              <v-hover>
                <template v-slot:default="{ hover }">
                  <div
                    :class="`white cp transition-swing border-radius-3 elevation-${
                      hover ? 20 : 0
                    }`"
                  >
                    <div class="pa-4">
                      <div class="fs-16 d-flex align-center">
                        Lượt đánh giá
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
                        @click="redirectPageEvaluate"
                      >
                        <img src="~/assets/icon/dashboard/evaluate.svg" />
                        <div class="pl-4">
                          <div class="fs-14">Tổng lượt đánh giá</div>
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
            <v-col cols="12" class="pb-0">
              <v-hover>
                <template v-slot:default="{ hover }">
                  <div
                    :class="`white cp transition-swing border-radius-3 elevation-${
                      hover ? 20 : 0
                    }`"
                  >
                    <div class="pa-4">
                      <div class="fs-16 d-flex align-center">
                        Lượt nhận xét
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
                        @click="redirectPageComment"
                      >
                        <img src="~/assets/icon/dashboard/comment.svg" />
                        <div class="pl-4">
                          <div class="fs-14">Tổng lượt nhận xét</div>
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
          </v-row>
        </v-col>
        <v-col cols="6">
          <v-hover>
            <template v-slot:default="{ hover }">
              <div
                :class="`white cp h-100 transition-swing border-radius-3 elevation-${
                  hover ? 20 : 0
                }`"
              >
                <div class="pa-4 h-100" style="overflow-x: hidden">
                  <div class="fs-16 d-flex align-center">
                    Lượt đánh giá sao
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
                  <div @click="redirectPageEvaluateStart">
                    <apexchart
                      type="donut"
                      height="320"
                      width="100%"
                      :options="chartOptions"
                      :series="series"
                    />
                  </div>
                </div>
              </div>
            </template>
          </v-hover>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
// import moment from 'moment'

export default {
  name: 'InteractiveStatistics',
  data() {
    return {
      time: 1,
      list_time: [{ value: 1, text: 'Hiện tại' }],
      chartOptions: {
        chart: {
          type: 'donut',
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
        },
      },
      series: [50, 50, 50, 50, 0],
      toEvaluate: '/dashboard/evaluate',
      toEvaluateStart: '/dashboard/evaluate-star',
      toComment: '/dashboard/comment',
    }
  },
  created() {},
  methods: {
    redirectPageEvaluate() {
      this.$router.push(this.toEvaluate)
    },
    redirectPageEvaluateStart() {
      this.$router.push(this.toEvaluateStart)
    },
    redirectPageComment() {
      this.$router.push(this.toComment)
    },
  },
}
</script>
