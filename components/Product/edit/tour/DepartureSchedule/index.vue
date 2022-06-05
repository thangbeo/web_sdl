<template>
  <v-col class="py-0" cols="11">
    <div class="fs-14 font-weight-bold d-flex align-center mb-2">
      Lịch khởi hành<span class="error--text mx-1">*</span>
    </div>
    <div>
      <v-radio-group
        v-model="type"
        :readonly="readonly"
        row
        @change="set_data_change"
      >
        <v-radio label="Hàng ngày" :value="1" />
        <v-radio class="ml-5" label="Hàng tuần" :value="2" />
        <v-radio class="ml-5" label="Kế hoạch" :value="3" />
      </v-radio-group>
    </div>

    <div v-if="type === 1" class="ml-6 fs-14">
      Giá người lớn<span class="error--text ml-1">*</span>
      <div class="d-flex">
        <v-btn color="primary" class="rounded-r-0" depressed>VND</v-btn>
        <v-text-field
          v-model="price"
          type="number"
          class="border-1 rounded-l-0"
          solo
          flat
          dense
          :readonly="readonly"
          @input="set_data_day"
        >
        </v-text-field>
      </div>
      Giá trẻ em<span class="error--text ml-1">*</span>
      <div class="d-flex">
        <v-btn color="primary" class="rounded-r-0" depressed>VND</v-btn>
        <v-text-field
          v-model="price2"
          type="number"
          class="border-1 rounded-l-0"
          solo
          flat
          dense
          :readonly="readonly"
          @input="set_data_day"
        >
        </v-text-field>
      </div>
    </div>

    <div v-if="type === 2" class="ml-6 fs-14">
      <div class="d-flex mb-4">
        <div class="col-1">Thứ <span class="error--text ml-1">*</span></div>
        <v-row class="mb-4">
          <v-col v-for="(item, i) in days" :key="`${item.text}-${i}`" cols="3">
            <v-checkbox
              v-model="item.value"
              :label="item.text"
              color="primary"
              :true-value="1"
              :false-value="0"
              :ripple="false"
              class="ma-0 pa-0 col-3"
              hide-details
              :readonly="readonly"
              @click="set_data_week"
            >
            </v-checkbox>
          </v-col>
        </v-row>
      </div>
      <div class="d-flex">
        <div class="mt-2 mr-2">
          Giá người lớn<span class="error--text ml-1">*</span>
        </div>
        <div class="d-flex">
          <v-btn color="primary" class="rounded-r-0" depressed>VND</v-btn>
          <v-text-field
            v-model="price3"
            type="number"
            class="border-1 rounded-l-0 mr-4"
            solo
            flat
            dense
            :readonly="readonly"
            @input="set_data_week"
          >
          </v-text-field>
        </div>

        <div class="mt-2 mr-2">
          Giá trẻ em<span class="error--text ml-1">*</span>
        </div>
        <div class="d-flex">
          <v-btn color="primary" class="rounded-r-0" depressed>VND</v-btn>
          <v-text-field
            v-model="price4"
            type="number"
            class="border-1 rounded-l-0"
            solo
            flat
            dense
            :readonly="readonly"
            @input="set_data_week"
          >
          </v-text-field>
        </div>
      </div>
    </div>

    <div v-if="type === 3">
      <div class="d-flex justify-end mb-2">
        <v-btn
          v-if="!readonly"
          color="#47BBFF"
          class="text-none white--text"
          small
          depressed
          @click="open_add = true"
        >
          Thêm lịch khởi hành
        </v-btn>
      </div>
      <v-data-table
        :headers="headers"
        :items="items"
        fixed-header
        disable-pagination
        hide-default-footer
        loading-text="Xin chờ..."
        no-results-text="Không có kết quả phù hợp"
        no-data-text="Không có dữ liệu"
        class="elevation-0"
      >
        <template v-slot:[`body.prepend`]>
          <Add
            :open="open_add"
            :check="check"
            @toggle="open_add = !open_add"
            @add="set_data_add"
          />
        </template>
        <template v-slot:item="data_edit">
          <tr v-if="open_edit !== data_edit.item.id">
            <td>
              {{ set_day_value(data_edit.item.time[0]) }}
            </td>
            <td>
              {{ set_day_value(data_edit.item.time[1]) }}
            </td>
            <td>
              {{
                `${$formatMoney({ amount: data_edit.item.adult_price })} ${
                  data_edit.item.currency.text
                }`
              }}
            </td>
            <td>
              {{
                `${$formatMoney({ amount: data_edit.item.chil_price })} ${
                  data_edit.item.currency.text
                }`
              }}
            </td>

            <td>
              <div v-if="!readonly" class="d-flex">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      icon
                      v-bind="attrs"
                      v-on="on"
                      @click="quest_delete(data_edit.item)"
                    >
                      <icon-delete />
                    </v-btn>
                  </template>
                  <span>Xóa</span>
                </v-tooltip>

                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      icon
                      v-bind="attrs"
                      v-on="on"
                      @click="quest_edit(data_edit.item)"
                    >
                      <icon-edit />
                    </v-btn>
                  </template>
                  <span>Cập nhật</span>
                </v-tooltip>
              </div>
            </td>
          </tr>
          <tr v-else>
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
                    :value="set_day_value(data_edit.item.time[0])"
                    class="border-1"
                    hide-details
                    dense
                    flat
                    solo
                    readonly
                    v-on="on"
                  />
                </template>
                <v-date-picker
                  v-model="data_edit.item.time[0]"
                  @input="onChange($event)"
                />
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
                    :value="set_day_value(data_edit.item.time[1])"
                    class="border-1"
                    hide-details
                    dense
                    flat
                    solo
                    readonly
                    v-on="on"
                  />
                </template>
                <v-date-picker
                  v-model="data_edit.item.time[1]"
                  @input="onChange($event)"
                />
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
                      {{ data_edit.item.currency.text }}
                      <!--                    <v-icon>mdi-menu-down</v-icon>-->
                    </v-btn>
                  </template>
                  <v-list dense>
                    <v-list-item
                      v-for="(money, i) in moneys"
                      :key="`${i}-${money.value}`"
                      @click="set_currency(money, data_edit.item)"
                    >
                      <v-list-item-title>{{ money.text }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
                <v-text-field
                  v-model="data_edit.item.adult_price"
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
                      {{ data_edit.item.currency.text }}
                      <!--                    <v-icon>mdi-menu-down</v-icon>-->
                    </v-btn>
                  </template>
                  <v-list dense>
                    <v-list-item
                      v-for="(money, i) in moneys"
                      :key="`${i}-${money.value}`"
                      @click="set_currency(money, data_edit.item)"
                    >
                      <v-list-item-title>{{ money.text }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
                <v-text-field
                  v-model="data_edit.item.chil_price"
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
                    <v-btn icon v-bind="attrs" v-on="on" @click="open_edit = 0">
                      <icon-close />
                    </v-btn>
                  </template>
                  <span>Hủy</span>
                </v-tooltip>

                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on" @click="confirm_edit">
                      <v-icon size="20" color="primary">mdi-check</v-icon>
                    </v-btn>
                  </template>
                  <span>Cập nhật</span>
                </v-tooltip>
              </div>
            </td>
          </tr>
        </template>
      </v-data-table>
    </div>

    <yes-no-alert
      :open="open_delete"
      alert-msg="Bạn chắc chắn muốn xóa lịch khởi hành này?"
      @toggle="open_delete = !open_delete"
      @OK="confirm_delete"
    />
  </v-col>
</template>

<script>
import Vue from 'vue'
import moment from 'moment'

import Add from '~/components/Product/add/tour/DepartureSchedule/add'

Vue.prototype.moment = moment

export default {
  components: {
    Add,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
    check: {
      type: Object,
      default: Object,
    },
    readonly: {
      type: Boolean,
      required: true,
    },
  },
  data: () => ({
    items: [],
    data_row: {},
    open_add: false,
    open_edit: 0,
    open_delete: false,
    // edit
    menu: false,
    menu1: false,
    moneys: [],
    type: 3,
    price: null,
    price2: null,
    price3: null,
    price4: null,
    days: [
      { value: 1, text: 'Thứ hai' },
      { value: 1, text: 'Thứ ba' },
      { value: 1, text: 'Thứ tư' },
      { value: 1, text: 'Thứ năm' },
      { value: 1, text: 'Thứ sáu' },
      { value: 1, text: 'Thứ bảy' },
      { value: 1, text: 'Chủ nhật' },
    ],
  }),
  computed: {
    headers() {
      return [
        {
          text: 'Ngày khởi hành',
          sortable: false,
          value: 'time_start',
          width: 150,
        },
        { text: 'Ngày về', sortable: false, value: 'time_end', width: 150 },
        {
          text: 'Giá người lớn',
          sortable: false,
          value: 'price_adults',
          width: 150,
        },
        {
          text: 'Giá trẻ em',
          sortable: false,
          value: 'price_child',
          width: 150,
        },
        { text: 'Hành động', sortable: false, value: 'actions', width: 60 },
      ]
    },
  },
  created() {
    this.type = this.data.type
    if (this.type === 1) {
      this.price = this.data.items[0]
      this.price2 = this.data.items[1]
    } else if (this.type === 2) {
      this.price3 = this.data.items[7]
      this.price4 = this.data.items[8]
      const array = [
        { value: 0, text: 'Thứ hai' },
        { value: 0, text: 'Thứ ba' },
        { value: 0, text: 'Thứ tư' },
        { value: 0, text: 'Thứ năm' },
        { value: 0, text: 'Thứ sáu' },
        { value: 0, text: 'Thứ bảy' },
        { value: 0, text: 'Chủ nhật' },
      ]

      if (!this.$isNullOrEmpty(this.data.items)) {
        array[0].value = this.set_value(0)
        array[1].value = this.set_value(1)
        array[2].value = this.set_value(2)
        array[3].value = this.set_value(3)
        array[4].value = this.set_value(4)
        array[5].value = this.set_value(5)
        array[6].value = this.set_value(6)
      }
      this.days = [...array]
    } else if (this.type === 3) {
      this.items = [...this.data.items]
    }
    const currencies = [...this.$store.state.app.currencies]
    const arr = []
    for (let i = 0; i < currencies.length; i++) {
      arr.push({
        value: currencies[i].id,
        text: currencies[i].code,
      })
    }
    this.moneys = [...arr]
  },
  methods: {
    set_value(value) {
      switch (value) {
        case 0:
          return this.data.items[0].value
        case 1:
          return this.data.items[1].value
        case 2:
          return this.data.items[2].value
        case 3:
          return this.data.items[3].value
        case 4:
          return this.data.items[4].value
        case 5:
          return this.data.items[5].value
        case 6:
          return this.data.items[6].value
      }
    },
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
    quest_delete(item) {
      this.data_row = item
      this.open_delete = true
    },
    confirm_delete() {
      const arr = [...this.items]
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].id === this.data_row.id) {
          arr.splice(i, 1)
        }
      }
      this.items = [...arr]
      this.$emit('set_data', { type: this.type, items: this.items })
    },
    quest_edit(item) {
      this.data_row = item
      this.open_edit = item.id
    },
    reset() {
      this.items = []
      this.data_row = {}
    },
    set_data_add(data) {
      let hasError = false
      let count = 0

      for (let i = 0; i < this.items.length; i++) {
        if (data.time[0] === this.items[i].time[0]) {
          hasError = true
          count += 1
        }
      }

      if (count > 0) {
        this.$showWarnNotify(this, 'Ngày khởi hành không được trùng nhau')
      }

      if (!hasError) {
        this.open_add = false
        const arr = [
          ...this.items,
          {
            id: data.id,
            time: data.time,
            adult_price: data.adult_price,
            chil_price: data.chil_price,
            currency: data.currency_id,
          },
        ]
        this.items = [...arr]
        this.$emit('set_data', { type: this.type, items: this.items })
      }
    },
    // edit
    change() {
      let change = ''
      change = this.data_row.time[1]
      this.data_row.time[1] = this.data_row.time[0]
      this.data_row.time[0] = change
    },
    datePicker() {
      const [year, month, day] = this.data_row.time[0].split('-')
      const [year1, month1, day1] = this.data_row.time[1].split('-')
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
    set_currency(value, item) {
      item.currency = value
    },
    confirm_edit() {
      let hasErrors = false
      let count = 0
      let count1 = 0

      if (this.data_row.adult_price <= 0) {
        hasErrors = true
        count += 1
      }
      if (this.data_row.chil_price <= 0) {
        hasErrors = true
        count += 1
      }

      const stage =
        (new Date(this.data_row.time[1]) - new Date(this.data_row.time[0])) /
        (1000 * 60 * 60 * 24)

      if (stage !== this.setValue(this.check)) {
        hasErrors = true
        this.$showWarnNotify(this, 'Khoảng thời gian không chính xác')
      }

      for (let i = 0; i < this.items.length; i++) {
        if (
          this.data_row.time[0] === this.items[i].time[0] &&
          this.data_row.id !== this.items[i].id
        ) {
          hasErrors = true
          count1 += 1
        }
      }

      if (count > 0) {
        this.$showWarnNotify(this, 'Vui lòng điền thông tin chính xác')
      }
      if (count1 > 0) {
        this.$showWarnNotify(this, 'Ngày khởi hành không được trùng nhau')
      }

      if (!hasErrors) {
        this.open_edit = 0
        const arr = [...this.items]
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].id === this.data_row.id) {
            arr[i] = { ...this.data_row }
          }
        }
        this.items = [...arr]
        this.$emit('set_data', { type: this.type, items: this.items })
      }
    },
    set_data_day() {
      this.$emit('set_data', {
        type: this.type,
        items: [this.price, this.price2],
      })
    },
    set_data_week() {
      this.$emit('set_data', {
        type: this.type,
        items: [...this.days, this.price3, this.price4],
      })
    },
    set_data_change() {
      if (this.type === 1) {
        this.$emit('set_data', {
          type: this.type,
          items: [this.price, this.price2],
        })
      } else if (this.type === 2) {
        this.$emit('set_data', {
          type: this.type,
          items: [...this.days, this.price3, this.price4],
        })
      } else if (this.type === 3) {
        this.$emit('set_data', { type: this.type, items: this.items })
      }
    },
  },
}
</script>
