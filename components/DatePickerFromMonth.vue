<template>
  <v-row>
    <v-col>
      <v-menu
        v-model="menu"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        min-width="290px"
      >
        <template v-slot:activator="{ on }">
          <v-text-field
            :value="moment(date[0]).format('MM/YYYY')"
            :label="label[0]"
            class="pt-3"
            hide-details
            dense
            outlined
            readonly
            v-on="on"
          />
        </template>
        <v-date-picker
          v-model="date[0]"
          type="month"
          @input="onChange($event)"
        />
      </v-menu>
    </v-col>
    <v-col class="pl-0">
      <v-menu
        v-model="menu1"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        min-width="290px"
      >
        <template v-slot:activator="{ on }">
          <v-text-field
            :value="moment(date[1]).format('MM/YYYY')"
            :label="label[1]"
            hide-details
            class="pt-3"
            dense
            outlined
            readonly
            v-on="on"
          />
        </template>
        <v-date-picker
          v-model="date[1]"
          type="month"
          @input="onChange($event)"
        />
      </v-menu>
    </v-col>
  </v-row>
</template>

<script>
import moment from 'moment'
import Vue from 'vue'

Vue.prototype.moment = moment

export default {
  props: {
    label: {
      type: Array,
      required: true,
    },
    date: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
    menu: false,
    menu1: false,
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
      const [year, month] = this.date[0].split('-')
      const [year1, month1] = this.date[1].split('-')
      if (year > year1) {
        this.change()
      }
      if (year === year1) {
        if (month > month1) {
          this.change()
        } else if (month === month1) {
          this.change()
        }
      }
    },
    onChange() {
      this.menu = false
      this.menu1 = false
      this.datePicker()
    },
  },
}
</script>
