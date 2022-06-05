<template>
  <v-row>
    <v-col>
      <v-menu
        ref="menu"
        v-model="menu"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        min-width="290px"
      >
        <template v-slot:activator="{ on }">
          <v-text-field
            :value="moment(date[0]).format('YYYY')"
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
          ref="picker"
          v-model="date[0]"
          no-title
          reactive
          scrollable
          @input="saveYear(date[0])"
        />
      </v-menu>
    </v-col>
    <v-col class="pl-0">
      <v-menu
        ref="menu1"
        v-model="menu1"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        min-width="290px"
      >
        <template v-slot:activator="{ on }">
          <v-text-field
            :value="moment(date[1]).format('YYYY')"
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
          ref="picker1"
          v-model="date[1]"
          scrollable
          no-title
          reactive
          @input="saveYear1(date[1])"
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
    // offset_partner: 50,
  }),
  watch: {
    menu(val) {
      val && this.$nextTick(() => (this.$refs.picker.activePicker = 'YEAR'))
      // setTimeout(() => {
      //   const attribute = document.getElementsByTagName('li')[97]
      //   attribute.scrollIntoView()
      // }, 1000)
    },
    menu1(val) {
      val && this.$nextTick(() => (this.$refs.picker1.activePicker = 'YEAR'))
      // setTimeout(() => {
      //   const attribute = document.getElementsByTagName('li')[97]
      //   attribute.scrollIntoView()
      // }, 1000)
    },
  },
  created() {
    // this.change()
  },
  methods: {
    // change() {
    //   this.$vuetify.goTo(this.offset_partner)
    // },
    saveYear(date) {
      this.$refs.menu.save(date[0])
      this.date[0] = date.substr(0, 4)
      // Reset activePicker to type YEAR
      this.$refs.picker.activePicker = 'YEAR'
      this.menu = false
      this.$emit('from_year', this.date[0])
    },
    saveYear1(date1) {
      this.$refs.menu1.save(this.date[1])
      this.date[1] = date1.substr(0, 4)

      // Reset activePicker to type YEAR
      this.$refs.picker1.activePicker = 'YEAR'
      this.menu1 = false
      this.$emit('come_year', this.date[1])
    },
    // change() {
    //   let change = ''
    //   change = this.date1
    //   this.date = this.date1
    //   this.date = change
    // },
    // datePicker() {
    //   const [year] = this.date.substr(0,4)
    //   const [year1] = this.date1.substr(0,4)
    //   if (year > year1) {
    //     this.change()
    //   }
    //   if (year === year1) {
    //       this.change()
    //   }
    // },
    // onChange(date) {
    //   this.menu = false
    //   this.menu1 = false
    //   this.datePicker()
    // },
  },
}
</script>
