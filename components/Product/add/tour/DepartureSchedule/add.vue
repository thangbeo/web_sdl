<template>
  <tr v-if="open">
    <td>
      <v-menu
        v-model="menu"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        min-width="290px"
      >
        <template v-slot:activator="{ on }">
          <v-text-field
            :value="set_day_value(date[0])"
            class="border-1"
            hide-details
            dense
            flat
            solo
            readonly
            v-on="on"
          />
        </template>
        <v-date-picker v-model="date[0]" @input="onChange($event)" />
      </v-menu>
    </td>

    <td>
      <v-menu
        v-model="menu1"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        min-width="290px"
      >
        <template v-slot:activator="{ on }">
          <v-text-field
            :value="set_day_value(date[1])"
            class="border-1"
            hide-details
            dense
            flat
            solo
            readonly
            v-on="on"
          />
        </template>
        <v-date-picker v-model="date[1]" @input="onChange($event)" />
      </v-menu>
    </td>

    <td>
      <div class="d-flex align-center">
        <v-menu top disabled>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              class="rounded-r-0"
              color="#2F5EB5"
              dark
              depressed
              v-bind="attrs"
              v-on="on"
            >
              {{ currency.text }}
              <!--              <v-icon>mdi-menu-down</v-icon>-->
            </v-btn>
          </template>
          <v-list dense>
            <v-list-item
              v-for="(money, i) in moneys"
              :key="`${i}-${money.value}`"
              @click="set_currency(money)"
            >
              <v-list-item-title>{{ money.text }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-text-field
          v-model="price1"
          type="number"
          class="border-1 rounded-l-0"
          solo
          flat
          dense
          hide-details
        />
      </div>
    </td>

    <td>
      <div class="d-flex align-center">
        <v-menu top disabled>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              class="rounded-r-0"
              color="#2F5EB5"
              dark
              depressed
              v-bind="attrs"
              v-on="on"
            >
              {{ currency.text }}
              <!--              <v-icon>mdi-menu-down</v-icon>-->
            </v-btn>
          </template>
          <v-list dense>
            <v-list-item
              v-for="(money, i) in moneys"
              :key="`${i}-${money.value}`"
              @click="set_currency(money)"
            >
              <v-list-item-title>{{ money.text }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-text-field
          v-model="price2"
          type="number"
          class="border-1 rounded-l-0"
          solo
          flat
          dense
          hide-details
        />
      </div>
    </td>
    <td>
      <div class="d-flex">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on" @click="toggle">
              <icon-close />
            </v-btn>
          </template>
          <span>Xóa</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on" @click="save">
              <v-icon size="20" color="primary">mdi-check</v-icon>
            </v-btn>
          </template>
          <span>Lưu</span>
        </v-tooltip>
      </div>
    </td>
  </tr>
</template>

<script>
import Vue from 'vue'
import moment from 'moment'
import uniqid from 'uniqid'

Vue.prototype.moment = moment

const now = moment(new Date()).format('YYYY-MM-DD')

export default {
  props: {
    open: {
      type: Boolean,
      required: true,
    },
    check: {
      type: Object,
      default: Object,
    },
  },
  data: () => ({
    moneys: [],
    currency: null,
    price1: null,
    price2: null,
    menu: false,
    menu1: false,
    date: [now, now],
  }),
  watch: {
    open(val) {
      if (!val) {
        this.price1 = null
        this.price2 = null
      } else {
        this.date = [now, now]
        const currencies = [...this.$store.state.app.currencies]
        const arr = []
        for (let i = 0; i < currencies.length; i++) {
          arr.push({
            value: currencies[i].id,
            text: currencies[i].code,
          })
        }
        this.moneys = [...arr]
        this.currency = arr[0]
      }
    },
  },
  methods: {
    setValue(object) {
      if (object.times === 1) {
        return 0
      } else if (object.times === 2) {
        return 1
      } else if (object.times === 3) {
        if (parseInt(object.daytime) - parseInt(object.night) > 0) {
          return parseInt(object.daytime) - 1
        } else {
          return parseInt(object.night) - 1
        }
      } else return 0
    },
    toggle() {
      this.$emit('toggle')
    },
    setDay(value) {
      switch (value) {
        case 0:
          return 'CN '
        case 1:
          return 'T2 '
        case 2:
          return 'T3 '
        case 3:
          return 'T4 '
        case 4:
          return 'T5 '
        case 5:
          return 'T6 '
        case 6:
          return 'T7 '
      }
    },
    set_day_value(value) {
      return (
        this.setDay(moment(value, 'YYYY-MM-DD').toDate().getDay()) +
        moment(value, 'YYYY-MM-DD').format('DD/MM/YYYY')
      )
    },
    change() {
      let change = ''
      change = this.date[1]
      this.date[1] = this.date[0]
      this.date[0] = change
    },
    datePicker() {
      const [year, month, day] = this.date[0].split('-')
      const [year1, month1, day1] = this.date[1].split('-')
      if (year > year1) {
        this.change()
      }
      if (year === year1) {
        if (month > month1) {
          this.change()
        } else if (month === month1) {
          if (day > day1) {
            this.change()
          }
        }
      }
    },
    onChange() {
      this.menu = false
      this.menu1 = false
      this.datePicker()
    },
    set_currency(value) {
      this.currency = value
    },
    save() {
      let hasErrors = false
      let count = 0

      if (this.price1 <= 0) {
        hasErrors = true
        count += 1
      }
      if (this.price2 <= 0) {
        hasErrors = true
        count += 1
      }

      const stage =
        (new Date(this.date[1]) - new Date(this.date[0])) /
        (1000 * 60 * 60 * 24)

      if (stage !== this.setValue(this.check)) {
        hasErrors = true
        this.$showWarnNotify(this, 'Khoảng thời gian không chính xác')
      }

      this.$log.debug(this.date)

      if (count > 0) {
        this.$showWarnNotify(this, 'Vui lòng điền thông tin chính xác')
      }

      if (!hasErrors) {
        this.$emit('add', {
          id: uniqid(),
          adult_price: this.price1,
          chil_price: this.price2,
          time: this.date,
          currency_id: this.currency,
        })
      }
    },
  },
}
</script>
