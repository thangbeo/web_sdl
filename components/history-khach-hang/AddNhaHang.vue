<template>
  <div class="hotel">
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
        <v-col cols="6" class="py-0">
          <v-select
            v-model="restaurant"
            :items="list_restaurant"
            placeholder="Chọn tên nhà hàng"
            solo
            dense
            flat
            class="border-1 fs-14"
            :error-messages="restaurantError"
            @input="restaurantError = []"
          >
          </v-select>
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
            <v-col cols="5" class="pa-0">
              <v-card-text class="pt-0">
                <v-dialog
                  ref="dialog"
                  v-model="modal2"
                  :return-value.sync="time"
                  persistent
                  width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="time"
                      hide-details
                      label="hh/mm/ss"
                      append-icon="mdi-clock-time-four-outline"
                      solo
                      dense
                      readonly
                      flat
                      class="border-1 fs-14"
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-time-picker v-if="modal2" v-model="time" full-width>
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="modal2 = false">
                      Cancel
                    </v-btn>
                    <v-btn
                      text
                      color="primary"
                      @click="$refs.dialog.save(time)"
                    >
                      OK
                    </v-btn>
                  </v-time-picker>
                </v-dialog></v-card-text
              >
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
    dateError: [],
    menu: false,
    guest: 1,
    time: null,
    modal2: false,
    restaurant: null,
    restaurantError: [],
    nameContact: null,
    nameContactError: [],
    phone: null,
    phoneError: [],
    email: null,
    emailError: [],
    status: null,
    statusError: [],
    list_restaurant: [
      { value: 0, text: 'Nhà hàng Hạ Long Bay' },
      { value: 1, text: 'Nhà hàng quán Nhớ' },
    ],
    quocTich: [
      { value: 0, text: 'Viet Nam' },
      { value: 1, text: 'United States' },
      { value: 2, text: 'Germany' },
    ],
    list_status: [
      { value: 5, text: 'Đã hủy', status: 6, color: '#FF0F59' },
      { value: 6, text: 'Thành công', status: 7, color: '#17E555' },
      { value: 7, text: 'Đã đóng', status: 8, color: '#FF0F59' },
      { value: 8, text: 'Xác nhận', status: 9, color: '#17E555' },
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
    validateRestaurant() {
      let hasErrors = false
      if (this.$isNullOrEmpty(this.restaurant)) {
        hasErrors = true
        this.restaurantError = ['Không được để trống']
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
