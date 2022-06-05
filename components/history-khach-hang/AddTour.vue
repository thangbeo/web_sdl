<template>
  <div class="tour">
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
            placeholder="Chọn tên tour du lịch"
            solo
            dense
            flat
            class="border-1 fs-14"
            :error-messages="tourError"
            @input="tourError = []"
          >
          </v-select>
        </v-col>
      </v-row>
      <v-row class="pl-8">
        <v-col cols="3" class="pl-10 py-0">
          <v-card-text class="text-subtitle-2 pt-4">Giá người lớn </v-card-text>
        </v-col>
        <v-col cols="6" class="py-0">
          <v-row>
            <v-col cols="4" class="pt-0 ml-1">
              <v-card-text class="pl-0 font-weight-bold"
                >VND 2.000.000/người</v-card-text
              >
            </v-col>
            <v-col cols="3" class="pt-0">
              <v-card-text class="text-subtitle-2">Giá trẻ em</v-card-text>
            </v-col>
            <v-col cols="4" class="pt-0 pl-0">
              <v-card-text class="pl-0 font-weight-bold"
                >VND 1.500.000/người</v-card-text
              >
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row class="pl-8">
        <v-col cols="3" class="pl-10 py-0">
          <v-card-text class="text-subtitle-2 pt-2"
            >Ngày khởi hành<span class="red--text ml-1">*</span>
          </v-card-text>
        </v-col>
        <v-col cols="6" class="py-0 pl-2 dateTour">
          <v-row>
            <v-col cols="5" class="pa-0">
              <v-card-text class="pt-0">
                <v-menu
                  ref="menu"
                  v-model="menu"
                  :close-on-content-click="false"
                  :return-value.sync="date"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="dateFormatted"
                      append-icon="mdi-calendar"
                      placeholder="dd/mm/yyyy"
                      solo
                      dense
                      readonly
                      flat
                      class="border-1 fs-14"
                      :error-messages="dateError"
                      v-bind="attrs"
                      v-on="on"
                      @input="dateError = []"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="date"
                    no-title
                    scrollable
                    @input="$refs.menu.save(date)"
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
      <v-row class="pl-8 mb-8">
        <v-col cols="3" class="pl-10 py-0">
          <v-card-text class="text-subtitle-2 pt-2">Thanh toán</v-card-text>
        </v-col>
        <v-col cols="6" class="py-0">
          <v-card-text class="pl-0 font-weight-bold pt-2"
            ><span>VND 5.500.000</span></v-card-text
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
    date: new Date().toISOString().substr(0, 10),
    oldDate: new Date().toISOString().substr(0, 10),
    dateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
    menu: false,
    adults: 1,
    children: 0,
    tour: null,
    tourError: [],
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
    dateError: [],
    list_tour: [
      { value: 0, text: 'Tour Ha Long 29/10' },
      { value: 1, text: 'Tour Sapa 29/11' },
    ],
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
    validateTour() {
      let hasErrors = false
      if (this.$isNullOrEmpty(this.tour)) {
        hasErrors = true
        this.tourError = ['Không được để trống']
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
    plusAdults() {
      this.adults += 1
    },
    minusAdults() {
      if (this.adults !== 1) {
        this.adults -= 1
      }
    },
    plusChildren() {
      this.children += 1
    },
    minusChildren() {
      if (this.children !== 0) {
        this.children -= 1
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
