<template>
  <div class="hotel pb-12">
    <div>
      <v-row class="pl-8">
        <v-col cols="12" class="py-0">
          <v-card-text class="text-subtitle-2 pt-0 font-weight-bold"
            >Thông tin đặt phòng
          </v-card-text></v-col
        >
      </v-row>
      <v-row class="pl-8">
        <v-col cols="3" class="pl-10 py-0">
          <v-card-text class="text-subtitle-2 pt-2"
            >Tên khách sạn<span class="red--text ml-1">*</span>
          </v-card-text>
        </v-col>
        <v-col cols="8" class="pt-0">
          <v-autocomplete
            v-model="hotel"
            :items="list_hotel"
            :menu-props="{ zIndex: '1' }"
            class="border-1 fs-14"
            placeholder="Chọn khách sạn"
            solo
            dense
            flat
            :error-messages="hotelError"
            @input="hotelError = []"
            @change="change_hotel"
          >
          </v-autocomplete>
        </v-col>
      </v-row>
      <v-row class="pl-8">
        <v-col cols="3" class="pl-10 py-0">
          <v-card-text class="text-subtitle-2 pt-2"
            >Phòng nghỉ<span class="red--text ml-1">*</span>
          </v-card-text>
        </v-col>
        <v-col cols="8" class="py-0">
          <v-autocomplete
            v-model="room"
            :items="list_room"
            class="border-1 fs-14"
            placeholder="Chọn phòng nghỉ"
            solo
            dense
            flat
            return-object
            :error-messages="roomError"
            @input="roomError = []"
            @change="change_room"
          >
          </v-autocomplete>
        </v-col>
      </v-row>
      <v-row class="pl-8">
        <v-col cols="3" class="pl-10 py-0">
          <v-card-text class="text-subtitle-2 pt-0">Giá </v-card-text>
        </v-col>
        <v-col cols="8" class="py-0 ml-1">
          <v-card-text class="pl-0 pt-0 font-weight-bold"
            >{{
              $formatMoney({
                amount: $isNullOrEmpty(priceRoom.price) ? 0 : priceRoom.price,
              })
            }}
            VND
          </v-card-text>
        </v-col>
      </v-row>
      <v-row class="pl-8">
        <v-col cols="3" class="pl-10 py-0">
          <v-card-text class="text-subtitle-2 pt-2"
            >Thời gian đặt phòng<span class="red--text ml-1">*</span>
          </v-card-text>
        </v-col>
        <v-col cols="6" class="py-0">
          <v-row class="dateHotel">
            <v-col cols="1" class="pa-0">
              <v-card-text class="pl-0 pt-2">Từ</v-card-text>
            </v-col>
            <v-col cols="5" class="pa-0">
              <v-card-text class="pl-0 pt-0">
                <v-menu
                  ref="menuStart"
                  v-model="menuStart"
                  :close-on-content-click="false"
                  :return-value.sync="startDate"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <div v-bind="attrs" v-on="on">
                      <v-text-field
                        v-model="dateFormattedStart"
                        append-icon="mdi-calendar"
                        placeholder="dd/mm/yyyy"
                        solo
                        dense
                        readonly
                        flat
                        class="border-1 fs-14"
                        :error-messages="startDateError"
                        @input="startDateError = []"
                      ></v-text-field>
                    </div>
                  </template>
                  <v-date-picker
                    v-model="startDate"
                    no-title
                    scrollable
                    @input="change_start_date_payment(startDate)"
                  >
                  </v-date-picker> </v-menu
              ></v-card-text>
            </v-col>
            <v-col cols="1" class="pa-0">
              <v-card-text class="pl-0 pt-2">Đến</v-card-text>
            </v-col>
            <v-col cols="5" class="pa-0">
              <v-card-text class="pl-0 pt-0">
                <v-menu
                  ref="menuEnd"
                  v-model="menuEnd"
                  :close-on-content-click="false"
                  :return-value.sync="endDate"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <div v-bind="attrs" v-on="on">
                      <v-text-field
                        v-model="dateFormattedEnd"
                        append-icon="mdi-calendar"
                        placeholder="dd/mm/yyyy"
                        solo
                        dense
                        readonly
                        flat
                        class="border-1 fs-14"
                        :error-messages="endDateError"
                        @input="endDateError = []"
                      ></v-text-field>
                    </div>
                  </template>
                  <v-date-picker
                    v-model="endDate"
                    no-title
                    scrollable
                    @input="change_end_date_payment(endDate)"
                  >
                  </v-date-picker> </v-menu
              ></v-card-text>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row class="pl-8">
        <v-col cols="3" class="pl-10 pt-0">
          <v-card-text class="text-subtitle-2 pt-2"
            >Số lượng khách<span class="red--text ml-1">*</span>
          </v-card-text>
        </v-col>
        <v-col cols="6" class="pt-0">
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
              @click="minusPerson"
            >
              <v-icon small>mdi-minus</v-icon>
            </v-btn>
            <v-text-field
              v-model="person"
              hide-details
              solo
              dense
              @input="validateNumber($event)"
            ></v-text-field>
            <v-btn
              small
              depressed
              style="
                height: 40px;
                border-left: 1px solid #ececec;
                background: #fff;
              "
              @click="plusPerson"
            >
              <v-icon small>mdi-plus</v-icon>
            </v-btn>
          </div>
          <div class="v-messages theme--light error--text mt-1" role="alert">
            <div class="v-messages__wrapper">
              <div class="v-messages__message">{{ personError }}</div>
            </div>
          </div>
        </v-col>
      </v-row>
      <v-row class="pl-8">
        <v-col cols="3" class="pl-10 py-0">
          <v-card-text class="text-subtitle-2 pt-2"
            >Số lượng phòng<span class="red--text ml-1">*</span>
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
              v-model="rooms"
              hide-details
              solo
              dense
              @input="validateRoom($event)"
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
          <div class="v-messages theme--light error--text mt-1" role="alert">
            <div class="v-messages__wrapper">
              <div class="v-messages__message">
                {{ totalRoomError }}
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
      <v-row class="pl-8 mt-6">
        <v-col cols="3" class="pl-10 py-0">
          <v-card-text class="text-subtitle-2 pt-0">Tổng số </v-card-text>
        </v-col>
        <v-col cols="8" class="py-0 ml-1">
          <v-card-text class="pl-0 pt-0 font-weight-bold"
            >{{
              $isNullOrEmpty(total_price)
                ? ''
                : `${$formatMoney({ amount: total_price })}`
            }}
            VND</v-card-text
          >
        </v-col>
      </v-row>
      <v-row class="pl-8 mt-3">
        <v-col cols="3" class="pl-10 py-0">
          <v-card-text class="text-subtitle-2 pt-2"
            >Đơn vị thanh toán</v-card-text
          >
        </v-col>
        <v-col cols="8" class="py-0">
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
        <v-col cols="8" class="py-0">
          <v-card-text
            v-if="currency === list_currencies[0]"
            class="pl-0 pt-2 font-weight-bold"
            ><span
              >{{
                $isNullOrEmpty(total_price)
                  ? ''
                  : `${$formatMoney({ amount: total_price })}`
              }}
              VND
            </span></v-card-text
          >
          <v-card-text
            v-if="currency !== list_currencies[0] && pricePayment > 0"
            class="pl-0 pt-2 font-weight-bold"
            ><span
              >{{
                $formatMoney({
                  amount: $isNullOrEmpty(pricePayment) ? 0 : pricePayment,
                })
              }}
              {{ $isNullOrEmpty(currency) ? '' : currency.text }}
            </span></v-card-text
          >
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
            :items="nation"
            placeholder="Chọn quốc tịch"
            class="border-1 fs-14"
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
        <v-col cols="8" class="py-0">
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
    required: false,
    required1: false,
    personError: null,
    totalRoomError: null,
    startDate: new Date().toISOString().substr(0, 10),
    endDate: new Date().toISOString().substr(0, 10),
    oldDate: new Date().toISOString().substr(0, 10),
    dateFormattedStart: vm.formatDate(new Date().toISOString().substr(0, 10)),
    dateFormattedEnd: vm.formatDate(new Date().toISOString().substr(0, 10)),
    date_time: null,
    menuStart: false,
    menuEnd: false,
    currency: null,
    list_currencies: [],
    rooms: 1,
    person: 1,
    hotel: null,
    room: null,
    nameContact: null,
    nameContactError: [],
    phone: null,
    phoneError: [],
    email: null,
    total_price: 0,
    emailError: [],
    payment: 1,
    paymentError: [],
    status: 0,
    statusError: [],
    startDateError: [],
    endDateError: [],
    search: null,
    note: null,
    list_hotel: [],
    hotelError: [],
    list_room: [],
    roomError: [],
    priceRoom: {},
    pricePayment: {},
    day_end_time: null,
    day_start_time: null,
    nationDetail: null,
    roomNumber: null,
    roomNumberUsed: null,
    roomRest: null,
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
        this.$store.dispatch('giao_dich/name_hotel').then((res) => {
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
            this.list_hotel = [...arr]
          }
        })
        this.get_currency()
      } else {
      }
    },
    startDate(val) {
      if (this.oldDate > this.startDate) {
        this.startDateError = ['Ngày bạn chọn nhỏ hơn ngày hiện tại']
      } else if (this.startDate > this.endDate) {
        this.startDateError = ['Thời gian đặt nhỏ hơn thời gian đến']
      } else if (this.startDate === this.endDate) {
        this.startDateError = []
      } else {
        this.startDateError = []
        this.dateFormattedStart = this.formatDate(this.startDate)
      }
    },
    endDate(val) {
      if (this.oldDate > this.endDate) {
        this.endDateError = ['Ngày bạn chọn nhỏ hơn ngày hiện tại']
      } else if (this.startDate === this.endDate) {
        this.startDateError = []
      } else {
        this.startDateError = []
        this.dateFormattedEnd = this.formatDate(this.endDate)
      }
    },
  },
  methods: {
    validateNumber(value) {
      if (Number(value) > 0) {
        this.person = Number(value)
        this.required = false
        this.personError = ''
      }
      if (Number(value) === 0) {
        this.required = true
        this.personError = 'Định dạng không hợp lệ'
      }
      if (!this.$isNumberTransition(value)) {
        this.required = true
        this.personError = 'Bạn phải nhập số'
        if (Number(value) < 0) {
          this.person = Number(value)
          this.required = true
          this.personError = 'Định dạng không hợp lệ'
        }
      }
    },
    validateRoom(value) {
      if (Number(value) > 0) {
        this.rooms = Number(value)
        this.required1 = false
        this.totalRoomError = ''
        this.total_hotel_price()
        this.payment_price()
      }
      if (Number(value) === 0) {
        this.required1 = true
        this.totalRoomError = 'Định dạng không hợp lệ'
      }
      if (!this.$isNumberTransition(value)) {
        this.required1 = true
        this.totalRoomError = 'Bạn phải nhập số'
        if (Number(value) < 0) {
          this.rooms = Number(value)
          this.required1 = true
          this.totalRoomError = 'Định dạng không hợp lệ'
        }
      }
    },
    total_hotel_price() {
      if (
        !this.$isNullOrEmpty(this.hotel) &&
        !this.$isNullOrEmpty(this.room.value)
      ) {
        if (this.startDate >= this.oldDate && this.startDate <= this.endDate) {
          let dayTime = moment
            .duration(
              moment(this.endDate, 'YYYY-MM-DD').diff(
                moment(this.startDate, 'YYYY-MM-DD')
              )
            )
            .asDays()
          if (dayTime === 0) {
            dayTime += 1
            this.total_price = this.rooms * this.priceRoom.price * dayTime
          } else if (dayTime > 0) {
            this.total_price = this.rooms * this.priceRoom.price * dayTime
          } else if (dayTime < 0) {
            this.total_price = 0
          }
        }
      }
    },
    Add() {
      const data = {
        payment_type: this.payment,
        order_type: 1,
        order_status: this.status,
        product_type: 1,
        product_id: this.hotel,
        person_quantity: this.person,
        customer_id: null,
        customer_name: this.nameContact,
        customer_phone: this.phone,
        nation_id: this.nationDetail,
        customer_email: this.email,
        note: this.note,
        currency_id: this.currency.value,
        room_id: this.room.value,
        quantity: this.rooms,
        checkin: this.dateFormattedStart + ' 00:00:00',
        checkout: this.dateFormattedEnd + ' 00:00:00',
        guest_stay: null,
        guest_name: null,
      }
      this.$store
        .dispatch('giao_dich/add_hotel', data)
        .then((response) => {
          if (!response.error) {
            this.$showSuccess(this, 'Thêm mới giao dịch khách sạn thành công')
            this.$emit('exit')
          }
        })
        .catch((e) => {
          this.$log.debug(e)
        })
        .finally(() => {})
    },
    change_hotel() {
      this.room_hotel()
    },
    room_hotel() {
      const data = {
        hotel_id: !this.$isNullOrEmpty(this.hotel) ? this.hotel : '',
      }
      this.$store.dispatch('giao_dich/room_type', data).then((res) => {
        if (!res.error) {
          const arr = []
          if ((res.data.data || []).length !== 0) {
            for (let i = 0; i < res.data.data.length; i++) {
              const totalPeople =
                res.data.data[i].number_adults +
                res.data.data[i].number_children
              arr.push({
                value: res.data.data[i].id,
                text:
                  res.data.data[i].room_type_name +
                  ', ' +
                  res.data.data[i].bed_type_name +
                  ', ' +
                  res.data.data[i].acreage +
                  'm2' +
                  ', Sức chứa: ' +
                  totalPeople +
                  ' người',
                total: totalPeople,
              })
            }
          }
          this.list_room = [...arr]
        }
      })
    },
    change_start_date_payment(startDate) {
      this.dateFormattedStart = moment(startDate, 'YYYY-MM-DD').format(
        'DD/MM/YYYY'
      )
      this.$refs.menuStart.save(this.startDate)
      if (this.currency === this.list_currencies[0]) {
        this.total_hotel_price()
      } else if (this.currency !== this.list_currencies[0]) {
        this.total_hotel_price()
        this.payment_price()
      }
      if (
        !this.$isNullOrEmpty(this.hotel) &&
        !this.$isNullOrEmpty(this.room.value)
      ) {
        if (this.startDate >= this.oldDate && this.startDate <= this.endDate) {
          this.check_rest_room()
        }
      }
    },
    change_end_date_payment(endDate) {
      this.dateFormattedEnd = moment(endDate, 'YYYY-MM-DD').format('DD/MM/YYYY')
      this.$refs.menuEnd.save(this.endDate)
      if (this.currency === this.list_currencies[0]) {
        this.total_hotel_price()
      } else if (this.currency !== this.list_currencies[0]) {
        this.total_hotel_price()
        this.payment_price()
      }
      if (
        !this.$isNullOrEmpty(this.hotel) &&
        !this.$isNullOrEmpty(this.room.value)
      ) {
        if (this.endDate >= this.oldDate && this.endDate >= this.startDate) {
          this.check_rest_room()
        }
      }
    },
    change_room() {
      this.person = 1
      this.rooms = 1
      this.required = false
      this.required1 = false
      this.personError = ''
      this.totalRoomError = ''
      this.get_price()
      this.check_rest_room()
    },
    change_get_currency() {
      this.payment_price()
    },
    get_price() {
      const data = {
        rest_room_id: !this.$isNullOrEmpty(this.room) ? this.room.value : '',
      }
      this.$store.dispatch('giao_dich/get_room_price', data).then((res) => {
        if (!res.error) {
          this.priceRoom = res.data.data
          this.total_hotel_price()
        }
      })
    },
    check_rest_room() {
      const data = {
        rest_room_id: !this.$isNullOrEmpty(this.room) ? this.room.value : '',
        person_quantity: !this.$isNullOrEmpty(this.person) ? this.person : '',
        check_in:
          (this.dateFormattedStart + ' 00:00:00' || []).length !== 0
            ? this.dateFormattedStart + ' 00:00:00'
            : '',
        check_out:
          (this.dateFormattedEnd + ' 23:59:59' || []).length !== 0
            ? this.dateFormattedEnd + ' 23:59:59'
            : '',
      }
      this.$store.dispatch('giao_dich/check_rest_room', data).then((res) => {
        if (!res.error) {
          this.roomNumber = res.data.data.roomNumber
          this.roomNumberUsed = res.data.data.roomNumberUsed
          this.roomRest = this.roomNumber - this.roomNumberUsed
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
    payment_price() {
      if (!this.$isNullOrEmpty(this.currency)) {
        const data = {
          currency_id: !this.$isNullOrEmpty(this.currency.value)
            ? this.currency.value
            : '',
          room_id: !this.$isNullOrEmpty(this.room) ? this.room.value : '',
          quantity: !this.$isNullOrEmpty(this.rooms) ? this.rooms : '',
          start_time:
            (this.dateFormattedStart + ' 00:00:00' || []).length !== 0
              ? this.dateFormattedStart + ' 00:00:00'
              : '',
          end_time:
            (this.dateFormattedEnd + ' 23:59:59' || []).length !== 0
              ? this.dateFormattedEnd + ' 23:59:59'
              : '',
        }

        this.$store.dispatch('giao_dich/hotel_price', data).then((res) => {
          if (!res.error) {
            this.pricePayment = res.data.data
          }
        })
      }
    },
    validateHotel() {
      let hasErrors = false
      let count = 0
      if (this.$isNullOrEmpty(this.hotel)) {
        hasErrors = true
        this.hotelError = ['Không được để trống']
        count += 1
      }
      if (this.$isNullOrEmpty(this.room)) {
        hasErrors = true
        this.roomError = ['Không được để trống']
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
      if (
        !this.$isNullOrEmpty(this.hotel) &&
        !this.$isNullOrEmpty(this.room.value)
      ) {
        if (!this.$isNumberTransition(this.rooms)) {
          hasErrors = true
          this.totalRoomError = 'Bạn phải nhập số'
          count += 1
        } else if (Number(this.rooms) < 0) {
          hasErrors = true
          this.totalRoomError = 'Định dạng không hợp lệ'
          count += 1
        } else if (Number(this.rooms) > this.roomRest) {
          hasErrors = true
          this.totalRoomError =
            'Số lượng phòng bạn chọn lớn hơn số phòng đang có'
          count += 1
        }
      }
      if (this.$isNullOrEmpty(this.rooms)) {
        hasErrors = true
        this.totalRoomError = 'Không được để trống'
        count += 1
      }
      if (this.$isNullOrEmpty(this.person)) {
        hasErrors = true
        this.personError = 'Không được để trống'
        count += 1
      }
      if (
        !this.$isNullOrEmpty(this.hotel) &&
        !this.$isNullOrEmpty(this.room.value)
      ) {
        if (!this.$isNumberTransition(this.person)) {
          hasErrors = true
          this.personError = 'Bạn phải nhập số'
          count += 1
        } else if (Number(this.person) < 0) {
          hasErrors = true
          this.personError = 'Định dạng không hợp lệ'
          count += 1
        } else if (Number(this.person) > this.room.total * this.rooms) {
          hasErrors = true
          this.personError = 'Số lượng khách lớn hơn sức chứa của phòng'
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
    resetHotel() {
      this.hotel = null
      this.hotelError = []
      this.room = null
      this.roomError = []
      this.nameContact = null
      this.nameContactError = []
      this.phone = null
      this.phoneError = []
      this.email = null
      this.emailError = []
      this.payment = null
      this.paymentError = []
      this.status = null
      this.statusError = []
      this.startDateError = []
      this.endDateError = []
      this.note = null
      this.required = false
    },
    formatDate(date) {
      if (!date) {
        return null
      }
      const [year, month, day] = date.split('-')
      return `${day}/${month}/${year}`
    },
    plus() {
      if (!this.$isNullOrEmpty(this.roomRest) && this.rooms >= 0) {
        if (this.rooms < this.roomRest) {
          this.rooms += 1
          this.required = false
          this.required1 = false
          this.personError = ''
          this.totalRoomError = ''
          this.total_hotel_price()
          this.payment_price()
        } else if ((this.rooms = this.roomRest)) {
          this.required1 = true
          this.required = false
          this.personError = ''
          this.totalRoomError =
            'Số lượng phòng bạn chọn lớn hơn số phòng đang có'
          return this.rooms
        }
      }
    },
    minus() {
      if (this.rooms >= 0) {
        this.required1 = false
        this.totalRoomError = ''
        if (!this.$isNullOrEmpty(this.room)) {
          if (this.rooms > 1) {
            this.rooms -= 1
            if (this.person > this.room.total * this.rooms) {
              this.required = true
              this.personError = 'Số lượng khách lớn hơn sức chứa của phòng'
            }
            this.total_hotel_price()
            this.payment_price()
          }
        }
      }
    },
    plusPerson() {
      if (
        !this.$isNullOrEmpty(this.room) &&
        this.rooms >= 0 &&
        this.person >= 0
      ) {
        const totalPerson = this.room.total * this.rooms
        if (this.person < totalPerson) {
          this.person += 1
          this.required = false
          this.personError = ''
        } else if ((this.person = totalPerson)) {
          this.required = true
          this.personError = 'Số lượng khách lớn hơn sức chứa của phòng'
          return this.person
        }
      }
    },
    minusPerson() {
      if (!this.$isNullOrEmpty(this.room)) {
        if (this.person > 1) {
          this.person -= 1
          this.required = false
          this.personError = ''
        }
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
.dateHotel {
  .v-text-field__details {
    padding: 0 0 0 5px !important;
  }
}
</style>
