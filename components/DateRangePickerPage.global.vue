<template>
  <!-- 
  Cách dùng:
  - prop label là label của 2 input. Kiểu dữ liệu mảng: ['label 1', 'label 2']
  - prop date là giá trị của 2 input. Kiểu dữ liệu mảng: ['2020-01-30', '2020-02-20'] (Năm-Tháng-Ngày)
  -->
  <div class="d-flex align-center">
    <div class="black--text">Từ ngày</div>
    <v-col class="py-0">
      <v-menu
        v-model="menu"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        min-width="290px"
      >
        <template v-slot:activator="{ on }">
          <div v-on="on">
            <v-text-field
              :value="moment(date[0]).format('DD/MM/YYYY')"
              placeholder="dd/mm/yyyy"
              style="border: 1px solid #e5e5e5"
              append-icon="mdi-calendar-month-outline"
              hide-details
              dense
              solo
              readonly
              flat
            >
            </v-text-field>
          </div>
        </template>
        <v-date-picker v-model="date[0]" locale="vn" @input="onChange($event)">
        </v-date-picker>
      </v-menu>
    </v-col>
    <div class="black--text">Đến ngày</div>
    <v-col class="py-0">
      <v-menu
        v-model="open_pick_menu"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        min-width="290px"
      >
        <template v-slot:activator="{ on }">
          <div v-on="on">
            <v-text-field
              :value="moment(date[1]).format('DD/MM/YYYY')"
              placeholder="dd/mm/yyyy"
              style="border: 1px solid #e5e5e5"
              append-icon="mdi-calendar-month-outline"
              hide-details
              dense
              solo
              flat
            >
            </v-text-field>
          </div>
        </template>
        <v-date-picker v-model="date[1]" locale="vn" @input="onChange($event)">
        </v-date-picker>
      </v-menu>
    </v-col>
  </div>
</template>

<script>
import moment from 'moment'
import Vue from 'vue'

Vue.prototype.moment = moment

export default {
  props: {
    date: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
    menu: false,
    open_pick_menu: false,
  }),
  created() {},
  methods: {
    change() {
      let change = ''
      change = this.date[1]
      this.date[1] = this.date[0]
      this.date[0] = change
    },
    datePicker() {
      const [year, month, day] = this.date[0].split('-')
      const [lastYear, lastMonth, lastDay] = this.date[1].split('-')
      if (year > lastYear) {
        this.change()
      }
      if (year === lastYear) {
        if (month > lastMonth) {
          this.change()
        } else if (month === lastMonth) {
          if (day > lastDay) {
            this.change()
          }
        }
      }
    },
    onChange() {
      this.menu = false
      this.open_pick_menu = false
      this.datePicker()
    },
  },
}
</script>
