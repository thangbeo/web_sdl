<template>
  <div class="hotel">
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
        <v-col cols="6" class="pt-0">
          <v-select
            v-model="hotel"
            :items="list_hotel"
            class="border-1 fs-14"
            placeholder="Chọn khách sạn"
            solo
            dense
            flat
            :error-messages="hotelError"
            @input="hotelError = []"
          >
          </v-select>
        </v-col>
      </v-row>
      <v-row class="pl-8">
        <v-col cols="3" class="pl-10 py-0">
          <v-card-text class="text-subtitle-2 pt-2"
            >Phòng nghỉ<span class="red--text ml-1">*</span>
          </v-card-text>
        </v-col>
        <v-col cols="6" class="py-0">
          <v-select
            v-model="room"
            :items="list_room"
            class="border-1 fs-14"
            placeholder="Chọn phòng nghỉ"
            solo
            dense
            flat
            :error-messages="roomError"
            @input="roomError = []"
          >
          </v-select>
        </v-col>
      </v-row>
      <v-row class="pl-8">
        <v-col cols="3" class="pl-10 py-0">
          <v-card-text class="text-subtitle-2 pt-0">Giá </v-card-text>
        </v-col>
        <v-col cols="6" class="py-0 ml-1">
          <v-card-text class="pl-0 pt-0 font-weight-bold"
            >VND 300.000/phòng/đêm</v-card-text
          >
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
                      v-bind="attrs"
                      v-on="on"
                      @input="startDateError = []"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="startDate"
                    no-title
                    scrollable
                    @input="$refs.menuStart.save(startDate)"
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
                      v-bind="attrs"
                      v-on="on"
                      @input="endDateError = []"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="endDate"
                    no-title
                    scrollable
                    @input="$refs.menuEnd.save(endDate)"
                  >
                  </v-date-picker> </v-menu
              ></v-card-text>
            </v-col>
          </v-row>
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
      <v-row class="pl-8 mb-8">
        <v-col cols="3" class="pl-10 py-0">
          <v-card-text class="text-subtitle-2 pt-2">Thanh toán </v-card-text>
        </v-col>
        <v-col cols="6" class="py-0">
          <v-card-text class="pl-0 pt-2 font-weight-bold"
            ><span>VND 600.000</span></v-card-text
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
            @input="phoneError = []"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row class="pl-8">
        <v-col cols="3" class="pl-10 py-0">
          <v-card-text class="text-subtitle-2 pt-2">Quốc tịch </v-card-text>
        </v-col>
        <v-col cols="6" class="py-0">
          <v-select
            class="border-1 fs-14"
            :items="quocTich"
            :value="0"
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
        <v-col cols="6" class="py-0">
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
        <v-col cols="6" class="py-0">
          <v-text-field
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
export default {
  data: (vm) => ({
    startDate: new Date().toISOString().substr(0, 10),
    endDate: new Date().toISOString().substr(0, 10),
    oldDate: new Date().toISOString().substr(0, 10),
    dateFormattedStart: vm.formatDate(new Date().toISOString().substr(0, 10)),
    dateFormattedEnd: vm.formatDate(new Date().toISOString().substr(0, 10)),
    menuStart: false,
    menuEnd: false,
    rooms: 1,
    hotel: null,
    room: null,
    nameContact: null,
    nameContactError: [],
    phone: null,
    phoneError: [],
    email: null,
    emailError: [],
    payment: null,
    paymentError: [],
    status: null,
    statusError: [],
    startDateError: [],
    endDateError: [],
    list_hotel: [
      { value: 0, text: 'VuLinh Family Homestay' },
      { value: 1, text: 'Dragonfly Hotel Nghia Lo' },
      { value: 2, text: 'Lapantan Paradise' },
    ],
    hotelError: [],
    list_room: [
      { value: 0, text: 'Superior room' },
      { value: 1, text: 'Standard room' },
      { value: 2, text: 'Deluxe room' },
    ],
    roomError: [],
    quocTich: [
      { value: 0, text: 'Viet Nam' },
      { value: 1, text: 'United States' },
      { value: 2, text: 'Germany' },
    ],
    list_payment: [
      { value: 0, text: 'Thanh toán trực tiếp' },
      { value: 1, text: 'Visa, Mastercard' },
    ],
    list_status: [
      { value: 1, text: 'Chờ xác nhận', color: '#F5972D', status: 1 },
      { value: 2, text: 'Từ chối xác nhận', color: '#FF0F59', status: 2 },
      { value: 3, text: 'Chưa thanh toán', color: '#3F69B8', status: 3 },
      { value: 4, text: 'Đã thanh toán', color: '#17E555', status: 4 },
      { value: 5, text: 'Đang hủy', color: '#F5972D', status: 5 },
      { value: 6, text: 'Đã hủy', color: '#FF0F59', status: 6 },
      { value: 7, text: 'Thành công', color: '#17E555', status: 7 },
      { value: 8, text: 'Đã đóng', color: '#FF0F59', status: 8 },
    ],
  }),
  watch: {
    startDate(val) {
      let hasErrors = false
      if (this.oldDate > this.startDate) {
        hasErrors = true
        this.startDateError = ['Ngày bạn chọn nhỏ hơn ngày hiện tại']
      } else if (this.startDate > this.endDate) {
        hasErrors = true
        this.startDateError = null
        this.startDateError = ['Thời gian đặt nhỏ hơn thời gian đến']
      }
      if (!hasErrors) {
        this.startDateError = null
        this.dateFormattedStart = this.formatDate(this.startDate)
      }
    },
    endDate(val) {
      let hasErrors = false
      if (this.oldDate > this.endDate) {
        hasErrors = true
        this.endDateError = ['Ngày bạn chọn nhỏ hơn ngày hiện tại']
      }
      if (!hasErrors) {
        this.endDateError = null
        this.dateFormattedEnd = this.formatDate(this.endDate)
      }
    },
  },

  methods: {
    Add() {},
    validateHotel() {
      let hasErrors = false
      if (this.$isNullOrEmpty(this.hotel)) {
        hasErrors = true
        this.hotelError = ['Không được để trống']
      }
      if (this.$isNullOrEmpty(this.room)) {
        hasErrors = true
        this.roomError = ['Không được để trống']
      }
      if (this.$isNullOrEmpty(this.nameContact)) {
        hasErrors = true
        this.nameContactError = ['Không được để trống']
      }

      if (this.$isNullOrEmpty(this.phone)) {
        hasErrors = true
        this.phoneError = ['Không được để trống']
      } else if (!this.$isMobilePhone(this.phone)) {
        hasErrors = true
        this.phoneError = ['Số điện thoại không hợp lệ']
      } else if (!this.$isNumber(this.phone)) {
        hasErrors = true
        this.phoneError = ['Số điện thoại không hợp lệ']
      } else if (
        (this.phone + '').length < 10 ||
        (this.phone + '').length > 12
      ) {
        if (!this.$isNullOrEmpty(this.phone)) {
          hasErrors = true
          this.phoneError = 'Số điện thoại không hợp lệ'
        }
      }

      if (this.$isNullOrEmpty(this.email)) {
        hasErrors = true
        this.emailError = ['Không được để trống']
      } else if (!this.$isEmail(this.email)) {
        hasErrors = true
        this.emailError = ['Email không hợp lệ']
      }
      if (this.$isNullOrEmpty(this.payment)) {
        hasErrors = true
        this.paymentError = ['Không được để trống']
      }
      if (this.$isNullOrEmpty(this.status)) {
        hasErrors = true
        this.statusError = ['Không được để trống']
      }
      if (!hasErrors) {
      }
    },
    clearSelected() {
      this.selected = null
    },
    formatDate(date) {
      if (!date) {
        return null
      }
      const [year, month, day] = date.split('-')
      return `${day}/${month}/${year}`
    },
    plus() {
      this.rooms += 1
    },
    minus() {
      if (this.rooms !== 1) {
        this.rooms -= 1
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
