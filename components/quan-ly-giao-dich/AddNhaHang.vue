<template>
  <div class="restaurant pb-12">
    <div>
      <v-row class="pl-8">
        <v-col cols="12" class="py-0">
          <v-card-text class="text-subtitle-2 pt-0 font-weight-bold"
            >Thông tin đặt bàn
          </v-card-text></v-col
        >
      </v-row>
      <v-row class="pl-8">
        <v-col cols="3" class="pl-10 py-0">
          <v-card-text class="text-subtitle-2 pt-2"
            >Tên nhà hàng<span class="red--text ml-1">*</span>
          </v-card-text>
        </v-col>
        <v-col cols="8" class="py-0">
          <v-autocomplete
            v-model="restaurant"
            :items="list_restaurant"
            :menu-props="{ zIndex: '1' }"
            placeholder="Chọn tên nhà hàng"
            solo
            dense
            flat
            class="border-1 fs-14"
            :error-messages="restaurantError"
            @input="restaurantError = []"
          >
          </v-autocomplete>
        </v-col>
      </v-row>
      <v-row class="pl-8">
        <v-col cols="3" class="pl-10 py-0">
          <v-card-text class="text-subtitle-2 pt-2"
            >Thời gian đặt bàn<span class="red--text ml-1">*</span>
          </v-card-text>
        </v-col>
        <v-col cols="6" class="py-0 dateRes">
          <v-row>
            <v-col cols="5" class="pa-0">
              <v-card-text class="pt-0">
                <v-menu
                  ref="menu1"
                  v-model="menuDate"
                  :close-on-content-click="false"
                  :return-value.sync="date"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <div v-bind="attrs" v-on="on">
                      <v-text-field
                        v-model="dateFormatted"
                        append-icon="mdi-calendar"
                        solo
                        dense
                        readonly
                        flat
                        class="border-1 fs-14"
                        :error-messages="dateError"
                        @input="dateError = []"
                      ></v-text-field>
                    </div>
                  </template>
                  <v-date-picker
                    v-model="date"
                    no-title
                    scrollable
                    @input="$refs.menu1.save(date)"
                  >
                  </v-date-picker> </v-menu
              ></v-card-text>
            </v-col>
            <v-col cols="5" class="pa-0">
              <v-card-text class="pt-0">
                <v-menu
                  ref="menu2"
                  v-model="modal2"
                  :return-value.sync="time"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <div v-bind="attrs" v-on="on">
                      <v-text-field
                        v-model="time"
                        label="hh/mm/ss"
                        append-icon="mdi-clock-time-four-outline"
                        solo
                        dense
                        readonly
                        flat
                        class="border-1 fs-14"
                        :error-messages="timeError"
                        @input="timeError = []"
                      ></v-text-field>
                    </div>
                  </template>
                  <v-time-picker
                    v-if="modal2"
                    v-model="time"
                    @click:minute="$refs.menu2.save(time)"
                  >
                  </v-time-picker> </v-menu
              ></v-card-text>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row class="pl-8 mb-8">
        <v-col cols="3" class="pl-10 py-0">
          <v-card-text class="text-subtitle-2 pt-2"
            >Số lượng khách<span class="red--text ml-1">*</span>
          </v-card-text>
        </v-col>
        <v-col cols="6" class="py-0">
          <div
            class="room d-flex"
            style="
              border: 1px solid #ececec;
              border-radius: 3px;
              max-width: 40%;
            "
          >
            <v-btn
              small
              depressed
              style="
                height: 40px;
                border-right: 1px solid #ececec;
                background: #fff;
              "
              @click="minus"
            >
              <v-icon small>mdi-minus</v-icon>
            </v-btn>
            <v-text-field
              v-model="guest"
              hide-details
              solo
              dense
              readonly
            ></v-text-field>
            <v-btn
              small
              depressed
              style="
                height: 40px;
                border-left: 1px solid #ececec;
                background: #fff;
              "
              @click="plus"
            >
              <v-icon small>mdi-plus</v-icon>
            </v-btn>
          </div>
        </v-col>
      </v-row>

      <v-row class="pl-8">
        <v-col cols="12" class="py-0">
          <v-card-text class="text-subtitle-2 pt-0 font-weight-bold"
            >Thông tin khách hàng
          </v-card-text></v-col
        >
      </v-row>
      <v-row class="pl-8">
        <v-col cols="3" class="pl-10 py-0">
          <v-card-text class="text-subtitle-2 pt-2"
            >Tên người liên hệ<span class="red--text ml-1">*</span>
          </v-card-text>
        </v-col>
        <v-col cols="8" class="py-0">
          <v-text-field
            v-model="nameContact"
            class="border-1 fs-14"
            placeholder="Nhập tên người liên hệ"
            dense
            solo
            flat
            :error-messages="nameContactError"
            @input="nameContactError = []"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row class="pl-8">
        <v-col cols="3" class="pl-10 py-0">
          <v-card-text class="text-subtitle-2 pt-2"
            >Số điện thoại<span class="red--text ml-1">*</span>
          </v-card-text>
        </v-col>
        <v-col cols="8" class="py-0">
          <v-text-field
            v-model="phone"
            class="border-1 fs-14"
            placeholder="Nhập số điện thoại"
            dense
            solo
            flat
            :error-messages="phoneError"
            @input="phoneError = []"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row class="pl-8">
        <v-col cols="3" class="pl-10 py-0">
          <v-card-text class="text-subtitle-2 pt-2">Quốc tịch </v-card-text>
        </v-col>
        <v-col cols="8" class="py-0">
          <v-select
            v-model="nationDetail"
            class="border-1 fs-14"
            :items="nation"
            placeholder="Chọn quốc tịch"
            solo
            dense
            flat
          >
          </v-select>
        </v-col>
      </v-row>
      <v-row class="pl-8">
        <v-col cols="3" class="pl-10 py-0">
          <v-card-text class="text-subtitle-2 pt-2"
            >Email<span class="red--text ml-1">*</span>
          </v-card-text>
        </v-col>
        <v-col cols="8" class="py-0">
          <v-text-field
            v-model="email"
            class="border-1 fs-14"
            placeholder="Nhập email"
            dense
            solo
            flat
            :error-messages="emailError"
            @input="emailError = []"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row class="pl-8">
        <v-col cols="3" class="pl-10 py-0">
          <v-card-text class="text-subtitle-2 pt-2">Ghi chú </v-card-text>
        </v-col>
        <v-col cols="8" class="py-0">
          <v-text-field
            v-model="note"
            class="border-1 fs-14"
            placeholder="Nhập ghi chú"
            dense
            solo
            flat
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row class="pl-8">
        <v-col cols="3" class="py-0">
          <v-card-text class="text-subtitle-2 pt-2 font-weight-bold"
            >Trạng thái<span class="red--text ml-1">*</span>
          </v-card-text></v-col
        >
        <v-col cols="3" class="py-0">
          <v-select
            v-model="status"
            :items="list_status"
            class="border-1 fs-14"
            placeholder="Chọn trạng thái"
            solo
            dense
            flat
            :error-messages="statusError"
            @input="statusError = []"
          >
            <template v-slot:selection="data">
              <div :style="`color: ${data.item.color}`">
                {{ data.item.text }}
              </div>
            </template>
            <template v-slot:item="data">
              <div
                :style="`color: ${data.item.color} !important`"
                class="fs-13"
              >
                {{ data.item.text }}
              </div>
            </template>
          </v-select>
        </v-col>
      </v-row>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
export default {
  props: {
    nation: {
      type: Array,
      default: Array,
    },
    open: {
      type: Boolean,
      default: true,
    },
  },
  data: (vm) => ({
    date: new Date().toISOString().substr(0, 10),
    oldDate: new Date().toISOString().substr(0, 10),
    dateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
    newDate: null,
    dateError: [],
    nationDetail: null,
    menuDate: false,
    guest: 1,
    time: null,
    time_now: moment().format('HH:mm'),
    timeError: null,
    modal2: false,
    restaurant: null,
    restaurantError: [],
    nameContact: null,
    nameContactError: [],
    phone: null,
    phoneError: [],
    email: null,
    emailError: [],
    status: 0,
    statusError: [],
    note: null,
    list_restaurant: [],
    list_status: [
      { value: 0, text: 'Chờ xác nhận', color: '#F5972D', status: 1 },
      {
        value: 2,
        text: 'Đã xác nhận - Chưa thanh toán',
        color: '#3F69B8',
        status: 3,
      },
      { value: 3, text: 'Đã thanh toán', color: '#17E555', status: 4 },
    ],
  }),
  watch: {
    open(value) {
      if (value) {
        this.$store.dispatch('giao_dich/name_restaurant').then((res) => {
          if (!res.error) {
            const arr = []

            if ((res.data.data || []).length !== 0) {
              for (let i = 0; i < res.data.data.length; i++) {
                arr.push({
                  value: res.data.data[i].id,
                  text: res.data.data[i].name,
                })
              }
            }
            this.list_restaurant = [...arr]
          }
        })
      } else {
      }
    },
    date(val) {
      let hasErrors = false
      if (this.oldDate > this.date) {
        hasErrors = true
        this.dateError = ['Ngày bạn chọn nhỏ hơn ngày hiện tại']
      }
      if (!hasErrors) {
        this.dateError = null
        this.dateFormatted = this.formatDate(this.date)
        this.time = null
        this.timeError = null
      }
    },
    time() {
      let hasErrors = false
      if (this.time < moment().format('HH:mm') && this.oldDate === this.date) {
        hasErrors = true
        this.timeError = ['Thời gian bạn chọn nhỏ hơn thời gian hiện tại']
      }
      if (!hasErrors) {
        this.timeError = null
      }
    },
  },
  methods: {
    Add() {
      const data = {
        payment_type: 1,
        order_type: 1,
        order_status: this.status,
        product_type: 2,
        product_id: this.restaurant,
        customer_id: null,
        customer_name: this.nameContact,
        customer_phone: this.phone,
        nation_id: this.nationDetail,
        customer_email: this.email,
        note: this.note,
        booking_date: this.dateFormatted + ' 00:00:00',
        booking_hour: this.time,
        person_quantity: this.guest,
      }
      this.$store
        .dispatch('giao_dich/add_restaurant', data)
        .then((response) => {
          if (!response.error) {
            this.$showSuccess(this, 'Thêm mới giao dịch nhà hàng thành công')
            this.$emit('exit')
          }
        })
        .catch((e) => {
          this.$log.debug(e)
        })
        .finally(() => {})
    },
    validateRestaurant() {
      let hasErrors = false
      let count = 0
      if (this.$isNullOrEmpty(this.time)) {
        hasErrors = true
        this.timeError = ['Không được để trống']
        count += 1
      }

      if (this.$isNullOrEmpty(this.restaurant)) {
        hasErrors = true
        this.restaurantError = ['Không được để trống']
        count += 1
      }
      if (this.$isNullOrEmpty(this.nameContact)) {
        hasErrors = true
        this.nameContactError = ['Không được để trống']
        count += 1
      }
      if (this.$isNullOrEmpty(this.phone)) {
        hasErrors = true
        this.phoneError = ['Không được để trống']
        count += 1
      } else if (!this.$isMobilePhone(this.phone)) {
        hasErrors = true
        this.phoneError = ['Số điện thoại không hợp lệ']
        count += 1
      } else if (!this.$isNumber(this.phone)) {
        hasErrors = true
        this.phoneError = ['Số điện thoại không hợp lệ']
        count += 1
      } else if (
        (this.phone + '').length < 10 ||
        (this.phone + '').length > 12
      ) {
        if (!this.$isNullOrEmpty(this.phone)) {
          hasErrors = true
          this.phoneError = 'Số điện thoại không hợp lệ'
          count += 1
        }
      }
      if (this.$isNullOrEmpty(this.email)) {
        hasErrors = true
        this.emailError = ['Không được để trống']
        count += 1
      } else if (!this.$isEmail(this.email)) {
        hasErrors = true
        this.emailError = ['Email không hợp lệ']
        count += 1
      }
      if (this.$isNullOrEmpty(this.status)) {
        hasErrors = true
        this.statusError = ['Không được để trống']
        count += 1
      }
      if (count > 0) {
        this.$showWarnNotify(this, 'Bạn nhập thiếu thông tin bắt buộc')
      }
      if (!hasErrors) {
        this.Add()
      }
    },
    resetRestaurant() {
      this.restaurant = null
      this.restaurantError = []
      this.nameContact = null
      this.nameContactError = []
      this.phone = null
      this.phoneError = []
      this.email = null
      this.emailError = []
      this.status = null
      this.statusError = []
      this.note = null
      this.dateError = []
      this.time = null
      this.timeError = []
    },
    formatDate(date) {
      if (!date) {
        return null
      }
      const [year, month, day] = date.split('-')
      return `${day}/${month}/${year}`
    },
    plus() {
      this.guest += 1
    },
    minus() {
      if (this.guest !== 1) {
        this.guest -= 1
      }
    },
  },
}
</script>

<style lang="scss">
.room {
  .v-btn {
    border-radius: 0 0 0 0;
  }
  .v-input__slot {
    box-shadow: 0 0 black !important;
    height: 40px;
    border-radius: 0 0 0 0;
  }
  .v-text-field__slot {
    input {
      text-align: center;
    }
  }
}
.dateRes {
  .v-text-field__details {
    padding: 0 0 0 5px !important;
  }
}
</style>
