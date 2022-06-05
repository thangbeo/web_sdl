<template>
  <div class="tour pb-12">
    <div>
      <v-row class="pl-8">
        <v-col cols="12" class="py-0">
          <v-card-text class="text-subtitle-2 pt-0 font-weight-bold"
            >Thông tin đặt Tour du lịch
          </v-card-text></v-col
        >
      </v-row>
      <v-row class="pl-8">
        <v-col cols="3" class="pl-10 py-0">
          <v-card-text class="text-subtitle-2 pt-2"
            >Tên tour du lịch<span class="red--text ml-1">*</span>
          </v-card-text>
        </v-col>
        <v-col cols="6" class="py-0">
          <v-select
            v-model="tour"
            :items="list_tour"
            :menu-props="{ zIndex: '1' }"
            placeholder="Chọn tên tour du lịch"
            solo
            dense
            flat
            class="border-1 fs-14"
            :error-messages="tourError"
            @input="tourError = []"
            @change="change_tour_price"
          >
          </v-select>
        </v-col>
      </v-row>
      <v-row class="pl-8">
        <v-col cols="3" class="pl-10 py-0">
          <v-card-text class="text-subtitle-2 pt-2"
            >Ngày khởi hành<span class="red--text ml-1">*</span>
          </v-card-text>
        </v-col>
        <v-col v-if="day_type === 1" cols="3" class="py-0 dateTour">
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
            </v-date-picker>
          </v-menu>
        </v-col>
        <v-col v-if="day_type === 2" cols="3" class="py-0 dateTour">
          <v-menu
            ref="menu2"
            v-model="menuDate2"
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
              :allowed-dates="allowedDates"
              @input="$refs.menu2.save(date)"
            >
            </v-date-picker>
          </v-menu>
        </v-col>
        <v-col v-if="day_type === 3" cols="6" class="py-0 dateTour">
          <v-select
            v-model="startDay"
            :items="list_startDay"
            placeholder="Chọn ngày khởi hành"
            solo
            dense
            flat
            class="border-1 fs-14"
            :error-messages="dateError"
            @input="dateError = []"
            @change="change_get_price"
          >
          </v-select>
        </v-col>
      </v-row>
      <v-row v-if="day_type === 1" class="pl-8">
        <v-col cols="3" class="pl-10 py-0">
          <v-card-text class="text-subtitle-2 pt-4">Giá người lớn </v-card-text>
        </v-col>
        <v-col cols="6" class="py-0">
          <v-row>
            <v-col cols="4" class="pt-0 ml-1">
              <v-card-text class="pl-0 font-weight-bold">
                {{
                  $formatMoney({
                    amount: $isNullOrEmpty(tour_daily.adult_price)
                      ? 0
                      : tour_daily.adult_price,
                  })
                }}
                VND
              </v-card-text>
            </v-col>
            <v-col cols="3" class="pt-0">
              <v-card-text class="text-subtitle-2">Giá trẻ em</v-card-text>
            </v-col>
            <v-col cols="4" class="pt-0 pl-0">
              <v-card-text class="pl-0 font-weight-bold"
                >{{
                  $formatMoney({
                    amount: $isNullOrEmpty(tour_daily.child_price)
                      ? 0
                      : tour_daily.child_price,
                  })
                }}
                VND</v-card-text
              >
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row v-if="day_type === 2" class="pl-8">
        <v-col cols="3" class="pl-10 py-0">
          <v-card-text class="text-subtitle-2 pt-4">Giá người lớn </v-card-text>
        </v-col>
        <v-col cols="6" class="py-0">
          <v-row>
            <v-col cols="4" class="pt-0 ml-1">
              <v-card-text class="pl-0 font-weight-bold">
                {{
                  $formatMoney({
                    amount: $isNullOrEmpty(tour_weekly.adult_price)
                      ? 0
                      : tour_weekly.adult_price,
                  })
                }}
                VND
              </v-card-text>
            </v-col>
            <v-col cols="3" class="pt-0">
              <v-card-text class="text-subtitle-2">Giá trẻ em</v-card-text>
            </v-col>
            <v-col cols="4" class="pt-0 pl-0">
              <v-card-text class="pl-0 font-weight-bold">
                {{
                  $formatMoney({
                    amount: $isNullOrEmpty(tour_weekly.child_price)
                      ? 0
                      : tour_weekly.child_price,
                  })
                }}
                VND</v-card-text
              >
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row v-if="day_type === 3" class="pl-8">
        <v-col cols="3" class="pl-10 py-0">
          <v-card-text class="text-subtitle-2 pt-4">Giá người lớn </v-card-text>
        </v-col>
        <v-col cols="6" class="py-0">
          <v-row>
            <v-col cols="4" class="pt-0 ml-1">
              <v-card-text class="pl-0 font-weight-bold">
                {{
                  $formatMoney({
                    amount: $isNullOrEmpty(getPrice.adult_price)
                      ? 0
                      : getPrice.adult_price,
                  })
                }}
                VND
              </v-card-text>
            </v-col>
            <v-col cols="3" class="pt-0">
              <v-card-text class="text-subtitle-2">Giá trẻ em</v-card-text>
            </v-col>
            <v-col cols="4" class="pt-0 pl-0">
              <v-card-text class="pl-0 font-weight-bold"
                >{{
                  $formatMoney({
                    amount: $isNullOrEmpty(getPrice.chil_price)
                      ? 0
                      : getPrice.chil_price,
                  })
                }}
                VND</v-card-text
              >
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row class="pl-8">
        <v-col cols="3" class="pl-10 py-0">
          <v-card-text class="text-subtitle-2 pt-2"
            >Số lượng người lớn<span class="red--text ml-1">*</span>
          </v-card-text>
        </v-col>
        <v-col cols="6" class="py-0">
          <v-row class="pl-3">
            <v-col cols="4" class="pa-0">
              <div
                class="room d-flex"
                style="border: 1px solid #ececec; border-radius: 3px"
              >
                <v-btn
                  small
                  depressed
                  style="
                    height: 40px;
                    border-right: 1px solid #ececec;
                    background: #fff;
                  "
                  @click="minusAdults"
                >
                  <v-icon small>mdi-minus</v-icon>
                </v-btn>
                <v-text-field
                  v-model="adults"
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
                  @click="plusAdults"
                >
                  <v-icon small>mdi-plus</v-icon>
                </v-btn>
              </div>
            </v-col>
            <v-col cols="4" class="pa-0">
              <v-card-text class="text-subtitle-2 pt-2"
                >Số lượng trẻ em<span class="red--text ml-1"
                  >*</span
                ></v-card-text
              >
            </v-col>
            <v-col cols="4" class="pa-0">
              <div
                class="room d-flex"
                style="border: 1px solid #ececec; border-radius: 3px"
              >
                <v-btn
                  small
                  depressed
                  style="
                    height: 40px;
                    border-right: 1px solid #ececec;
                    background: #fff;
                  "
                  @click="minusChildren"
                >
                  <v-icon small>mdi-minus</v-icon>
                </v-btn>
                <v-text-field
                  v-model="children"
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
                  @click="plusChildren"
                >
                  <v-icon small>mdi-plus</v-icon>
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row class="pl-8 mt-6">
        <v-col cols="3" class="pl-10 py-0">
          <v-card-text class="text-subtitle-2 pt-0">Tổng số </v-card-text>
        </v-col>
        <v-col cols="6" class="py-0 ml-1">
          <v-card-text class="pl-0 pt-0 font-weight-bold"
            >{{ `${$formatMoney({ amount: total_price })}` }} VND</v-card-text
          >
        </v-col>
      </v-row>
      <v-row class="pl-8 pt-3">
        <v-col cols="3" class="pl-10 py-0">
          <v-card-text class="text-subtitle-2 pt-2"
            >Đơn vị thanh toán</v-card-text
          >
        </v-col>
        <v-col cols="6" class="py-0">
          <v-select
            v-model="currency"
            :items="list_currencies"
            placeholder="Chọn đơn vị thanh toán"
            solo
            dense
            flat
            hide-details
            return-object
            class="border-1 fs-14"
            @change="change_get_currency"
          >
          </v-select>
        </v-col>
      </v-row>
      <v-row class="pl-8 mb-8">
        <v-col cols="3" class="pl-10 py-0">
          <v-card-text class="text-subtitle-2 pt-2">Thanh toán</v-card-text>
        </v-col>
        <v-col cols="6" class="py-0">
          <v-card-text
            v-if="currency !== list_currencies[0]"
            class="pl-0 font-weight-bold pt-2"
            ><span
              >{{
                $formatMoney({
                  amount: $isNullOrEmpty(paymentPrice) ? 0 : paymentPrice,
                })
              }}
              {{ $isNullOrEmpty(currency) ? '' : currency.text }}
            </span>
          </v-card-text>
          <v-card-text
            v-if="currency === list_currencies[0]"
            class="pl-0 font-weight-bold pt-2"
            ><span
              >{{
                $isNullOrEmpty(total_price)
                  ? ''
                  : `${$formatMoney({ amount: total_price })}`
              }}
              VND
            </span>
          </v-card-text>
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
        <v-col cols="6" class="py-0">
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
        <v-col cols="6" class="py-0">
          <v-text-field
            v-model="phone"
            class="border-1 fs-14"
            placeholder="Nhập số điện thoại"
            dense
            solo
            flat
            :error-messages="phoneError"
            @input="validatePhone($event, phoneError)"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row class="pl-8">
        <v-col cols="3" class="pl-10 py-0">
          <v-card-text class="text-subtitle-2 pt-2">Quốc tịch </v-card-text>
        </v-col>
        <v-col cols="6" class="py-0">
          <v-autocomplete
            v-model="nationDetail"
            class="border-1 fs-14"
            :items="nation"
            solo
            dense
            flat
            placeholder="Chọn quốc tịch"
          >
          </v-autocomplete>
        </v-col>
      </v-row>
      <v-row class="pl-8">
        <v-col cols="3" class="pl-10 py-0">
          <v-card-text class="text-subtitle-2 pt-2"
            >Email<span class="red--text ml-1">*</span>
          </v-card-text>
        </v-col>
        <v-col cols="6" class="py-0">
          <v-text-field
            v-model="email"
            class="border-1 fs-14"
            placeholder="Nhập email"
            dense
            solo
            flat
            :error-messages="emailError"
            @input="validateEmail($event, 'emailError')"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row class="pl-8">
        <v-col cols="3" class="pl-10 py-0">
          <v-card-text class="text-subtitle-2 pt-2">Ghi chú </v-card-text>
        </v-col>
        <v-col cols="6" class="py-0">
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
        <v-col cols="12" class="py-0">
          <v-card-text class="text-subtitle-2 pt-0 font-weight-bold"
            >Thanh toán
          </v-card-text></v-col
        >
      </v-row>
      <v-row class="pl-8">
        <v-col cols="3" class="pl-10 py-0">
          <v-card-text class="text-subtitle-2 pt-2"
            >Phương thức thanh toán<span class="red--text ml-1">*</span>
          </v-card-text>
        </v-col>
        <v-col cols="6" class="py-0">
          <v-select
            v-model="payment"
            :items="list_payment"
            solo
            dense
            class="border-1 fs-14"
            placeholder="Chọn phương thức thanh toán"
            flat
            :error-messages="paymentError"
            @input="paymentError = []"
          >
          </v-select>
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
    day_type: 1,
    menuDate: false,
    menuDate2: false,
    startDay: null,
    list_startDay: [],
    currency: null,
    list_currencies: [],
    nationDetail: null,
    adults: 1,
    children: 0,
    tour: null,
    tour_weekly: {},
    tour_daily: {},
    tourError: [],
    nameContact: null,
    nameContactError: [],
    phone: null,
    total_price: 0,
    phoneError: [],
    email: null,
    emailError: [],
    payment: 1,
    paymentError: [],
    status: 0,
    note: null,
    statusError: [],
    tour_day_type: [],
    dateError: [],
    list_tour: [],
    getPrice: {},
    paymentPrice: {},
    list_payment: [{ value: 1, text: 'Thanh toán trực tiếp' }],
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
        this.$store.dispatch('giao_dich/name_tour').then((res) => {
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
            this.list_tour = [...arr]
          }
        })
        this.get_currency()
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
      }
    },
  },
  methods: {
    validatePhone(value, error) {
      if (isNaN(value) && !this.$isNullOrEmpty(value)) {
        this[error] = ['Vui lòng nhập số']
      } else if ((value + '').length < 10 || (value + '').length > 12) {
        if (!this.$isNullOrEmpty(value)) {
          this[error] = ['Số điện thoại không hợp lệ']
        }
      } else {
        this[error] = []
      }
    },
    validateEmail(value, error) {
      if (this.$isNullOrEmpty(value)) {
        this[error] = ['Không được để trống']
      } else if (!this.$isEmail(value.trim())) {
        this[error] = ['Email không hợp lệ']
      } else {
        this[error] = []
      }
    },
    allowedDates(value) {
      for (let i = 0; i < this.tour_day_type.length; i++) {
        if (
          this.setDay(moment(value, 'YYYY-MM-DD').toDate().getDay()) ===
          this.tour_day_type[i]
        ) {
          return true
        }
      }
    },
    setDay(value) {
      switch (value) {
        case 0:
          return 'CN'
        case 1:
          return 'T2'
        case 2:
          return 'T3'
        case 3:
          return 'T4'
        case 4:
          return 'T5'
        case 5:
          return 'T6'
        case 6:
          return 'T7'
      }
    },
    total_tour_price() {
      if (this.day_type === 3) {
        this.total_price =
          this.getPrice.adult_price * this.adults +
          this.getPrice.chil_price * this.children
      } else if (this.day_type === 2) {
        this.total_price =
          this.tour_weekly.adult_price * this.adults +
          this.tour_weekly.child_price * this.children
      } else if (this.day_type === 1) {
        this.total_price =
          this.tour_daily.adult_price * this.adults +
          this.tour_daily.child_price * this.children
      }
    },
    Add() {
      let departureDate = null
      if (this.day_type === 1 || this.day_type === 2) {
        departureDate = this.dateFormatted + ' 00:00:00'
      } else if (this.day_type === 3) {
        departureDate = this.startDay + ' 00:00:00'
      }
      const data = {
        payment_type: this.payment,
        order_type: 1,
        order_status: this.status,
        product_type: 3,
        product_id: this.tour,
        customer_id: this.$store.state.khach_hang.customerId.id,
        customer_name: this.nameContact,
        customer_phone: this.phone,
        nation_id: this.nationDetail,
        customer_email: this.email,
        note: this.note,
        currency_id: this.currency.value,
        departure_date: departureDate,
        adults_quantity: this.adults,
        children_quantity: this.children,
      }
      this.$store
        .dispatch('giao_dich/add_tour', data)
        .then((response) => {
          if (!response.error) {
            this.$emit('success')
            this.$showSuccess(this, 'Thêm mới giao dịch tour thành công')
            this.$emit('exit')
          }
        })
        .catch((e) => {
          this.$log.debug(e)
        })
        .finally(() => {})
    },
    change_tour_price() {
      this.list_shedule_tour()
    },
    list_shedule_tour() {
      const data = {
        tour_id: !this.$isNullOrEmpty(this.tour) ? this.tour : '',
      }
      this.$store.dispatch('giao_dich/list_shedule_tour', data).then((res) => {
        if (!res.error) {
          this.day_type = res.data.data.departure_type
          this.tour_weekly = res.data.data.tourDepartureScheduleWeekly
          this.tour_daily = res.data.data.tourDepartureScheduleDaily
          this.total_tour_price()
          const tourDayType = []
          if (
            !this.$isNullOrEmpty(res.data.data.tourDepartureScheduleWeekly)
              ? res.data.data.tourDepartureScheduleWeekly
              : ''
          ) {
            if (res.data.data.tourDepartureScheduleWeekly.mo === 1) {
              tourDayType.push('T2')
            }
            if (res.data.data.tourDepartureScheduleWeekly.tu === 1) {
              tourDayType.push('T3')
            }
            if (res.data.data.tourDepartureScheduleWeekly.we === 1) {
              tourDayType.push('T4')
            }
            if (res.data.data.tourDepartureScheduleWeekly.th === 1) {
              tourDayType.push('T5')
            }
            if (res.data.data.tourDepartureScheduleWeekly.fr === 1) {
              tourDayType.push('T6')
            }
            if (res.data.data.tourDepartureScheduleWeekly.sa === 1) {
              tourDayType.push('T7')
            }
            if (res.data.data.tourDepartureScheduleWeekly.su === 1) {
              tourDayType.push('CN')
            }
          }
          this.tour_day_type = [...tourDayType]
          const arr = []
          if ((res.data.data.tourDepartureScheduleCustoms || []).length !== 0) {
            for (
              let i = 0;
              i < res.data.data.tourDepartureScheduleCustoms.length;
              i++
            ) {
              if (
                res.data.data.tourDepartureScheduleCustoms[i].start_time >=
                moment(new Date()).format('DD/MM/YYYY hh:mm:ss')
              ) {
                arr.push({
                  text: moment(
                    res.data.data.tourDepartureScheduleCustoms[i].start_time,
                    'DD/MM/YYYY hh:mm:ss'
                  ).format('DD/MM/YYYY'),
                })
              }
            }
          }
          this.list_startDay = [...arr]
        }
      })
    },
    change_get_price() {
      this.get_price()
    },
    change_get_currency() {
      this.tour_price()
    },
    get_price() {
      const data = {
        tour_id: !this.$isNullOrEmpty(this.tour) ? this.tour : '',
        start_time:
          (this.startDay + ' 00:00:00' || []).length !== 0
            ? this.startDay + ' 00:00:00'
            : '',
      }
      this.$store.dispatch('giao_dich/price_tour', data).then((res) => {
        if (!res.error) {
          if (!this.$isNullOrEmpty(res.data.data)) {
            this.getPrice = res.data.data
            this.total_tour_price()
          }
        }
      })
    },
    get_currency() {
      this.$store.dispatch('giao_dich/currency').then((res) => {
        if (!res.error) {
          const arr = []
          if ((res.data.data || []).length !== 0) {
            for (let i = 0; i < res.data.data.length; i++) {
              arr.push({
                value: res.data.data[i].id,
                text: res.data.data[i].code,
              })
            }
          }
          this.list_currencies = [...arr]
          this.currency =
            (this.list_currencies[0] || '').length !== 0
              ? this.list_currencies[0]
              : ''
        }
      })
    },
    tour_price() {
      if (!this.$isNullOrEmpty(this.currency)) {
        let departureDate = null
        if (this.day_type === 1 || this.day_type === 2) {
          departureDate = this.dateFormatted + ' 00:00:00'
        } else if (this.day_type === 3) {
          departureDate = this.startDay + ' 00:00:00'
        }
        const data = {
          currency_id: !this.$isNullOrEmpty(this.currency.value)
            ? this.currency.value
            : '',
          product_id: !this.$isNullOrEmpty(this.tour) ? this.tour : '',
          departure_date: departureDate,
          adult_quantity: !this.$isNullOrEmpty(this.adults) ? this.adults : '',
          children_quantity: !this.$isNullOrEmpty(this.children)
            ? this.children
            : '',
        }
        this.$store.dispatch('giao_dich/tour_price', data).then((res) => {
          if (!res.error) {
            if (!this.$isNullOrEmpty(res.data.data)) {
              this.paymentPrice = res.data.data
            }
          }
        })
      }
    },
    validateTour() {
      let hasErrors = false
      let count = 0
      if (this.$isNullOrEmpty(this.tour)) {
        hasErrors = true
        this.tourError = ['Không được để trống']
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
      if (this.$isNullOrEmpty(this.payment)) {
        hasErrors = true
        this.paymentError = ['Không được để trống']
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
    resetTour() {
      this.status = 0
      this.payment = 1
      this.tour = null
      this.tourError = []
      this.nameContact = null
      this.nameContactError = []
      this.phone = null
      this.phoneError = []
      this.email = null
      this.emailError = []

      this.paymentError = []

      this.note = null
      this.statusError = []
      this.dateError = []
    },
    formatDate(date) {
      if (!date) {
        return null
      }
      const [year, month, day] = date.split('-')
      return `${day}/${month}/${year}`
    },
    plusAdults() {
      this.adults += 1
      this.total_tour_price()
      this.tour_price()
    },
    minusAdults() {
      if (this.adults > 1 || (this.adults > 1 && this.children > 0)) {
        this.adults -= 1
        this.total_tour_price()
        this.tour_price()
      }
    },
    plusChildren() {
      this.children += 1
      this.total_tour_price()
      this.tour_price()
    },
    minusChildren() {
      if (this.children > 1 || (this.adults > 0 && this.children > 0)) {
        this.children -= 1
        this.total_tour_price()
        this.tour_price()
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
.dateTour {
  .v-text-field__details {
    padding: 0 0 0 5px !important;
  }
}
</style>
