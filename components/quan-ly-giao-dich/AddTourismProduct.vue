<template>
  <div class="tourism_product pb-12">
    <div>
      <v-row class="pl-8">
        <v-col cols="12" class="py-0">
          <v-card-text class="text-subtitle-2 pt-0 font-weight-bold"
            >Thông tin sản phẩm
          </v-card-text></v-col
        >
      </v-row>
      <v-row class="pl-8">
        <v-col cols="3" class="pl-10 py-0">
          <v-card-text class="text-subtitle-2 pt-2"
            >Tên sản phẩm<span class="red--text ml-1">*</span>
          </v-card-text>
        </v-col>
        <v-col cols="8" class="py-0">
          <v-autocomplete
            v-model="product"
            :items="list_product"
            placeholder="Chọn tên sản phẩm"
            solo
            dense
            flat
            return-object
            class="border-1 fs-14"
            :error-messages="productError"
            @input="productError = []"
            @change="change_products"
          >
          </v-autocomplete>
        </v-col>
      </v-row>
      <v-row class="pl-8 mb-2">
        <v-col cols="3" class="pl-10 py-0">
          <v-card-text class="text-subtitle-2 pt-0">Giá </v-card-text>
        </v-col>
        <v-col cols="8" class="py-0 ml-1">
          <v-card-text class="pl-0 pt-0 font-weight-bold">
            {{
              $formatMoney({
                amount: $isNullOrEmpty(product) ? 0 : product.price,
              })
            }}
            VND/1sp
          </v-card-text>
        </v-col>
      </v-row>
      <v-row class="pl-8 mb-4">
        <v-col cols="3" class="pl-10 py-0">
          <v-card-text class="text-subtitle-2 pt-2"
            >Số lượng<span class="red--text ml-1">*</span>
          </v-card-text>
        </v-col>
        <v-col cols="6" class="py-0">
          <div
            class="product d-flex"
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
              v-model="total_product"
              hide-details
              solo
              dense
              @input="validateTotalProduct($event)"
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
              <div class="v-messages__message">{{ totalProductError }}</div>
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
      <v-row class="pl-8 mb-4">
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
            >Tên người nhận hàng<span class="red--text ml-1">*</span>
          </v-card-text>
        </v-col>
        <v-col cols="8" class="py-0">
          <v-text-field
            v-model="nameContact"
            class="border-1 fs-14"
            placeholder="Nhập tên người nhập hàng"
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
          <v-card-text class="text-subtitle-2 pt-2"
            >Địa chỉ nhận hàng<span class="red--text ml-1">*</span></v-card-text
          >
        </v-col>
        <v-col cols="9" class="py-0">
          <div class="d-flex align-start">
            <v-checkbox
              v-model="checkbox"
              color="#47BBFF"
              class="ma-0 pa-0"
              hide-details
            >
            </v-checkbox>
            <div class="pt-0 fs-14">Nhận tại nơi bán</div>
          </div>
        </v-col>
      </v-row>
      <v-row class="pl-8">
        <v-col cols="3" class="py-0"> </v-col>
        <v-col cols="2" class="py-0">
          <v-autocomplete
            v-model="city"
            class="border-1 fs-14"
            :items="list_city"
            :disabled="checkbox"
            label="Tỉnh/Thành phố"
            solo
            dense
            flat
            return-object
            :error-messages="cityError"
            @input="cityError = []"
            @change="district_list"
          >
          </v-autocomplete>
        </v-col>
        <v-col cols="2" class="py-0">
          <v-autocomplete
            v-model="district"
            class="border-1 fs-14"
            :items="list_district"
            :disabled="checkbox"
            label="Quận/Huyện"
            solo
            dense
            flat
            return-object
            :error-messages="districtError"
            @input="districtError = []"
            @change="town_list"
          >
          </v-autocomplete>
        </v-col>
        <v-col cols="2" class="py-0">
          <v-autocomplete
            v-model="town"
            class="border-1 fs-14"
            :items="list_town"
            :disabled="checkbox"
            label="Xã/Phường/Thị trấn"
            solo
            dense
            flat
            :error-messages="townError"
            @input="townError = []"
          >
          </v-autocomplete>
        </v-col>
      </v-row>
      <v-row class="pl-8">
        <v-col cols="3" class="py-0"> </v-col>
        <v-col cols="8" class="py-0">
          <v-textarea
            v-model="description"
            class="border-1 fs-14"
            dense
            label="Địa chỉ chi tiết"
            solo
            flat
            rows="2"
            :error-messages="descriptionError"
            @input="descriptionError = []"
          ></v-textarea>
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
export default {
  props: {
    open: {
      type: Boolean,
      default: true,
    },
  },
  data: (vm) => ({
    checkbox: false,
    required: false,
    totalProductError: null,
    total_product: 1,
    total_price: 0,
    product: null,
    productError: [],
    list_product: [],
    nameContact: null,
    nameContactError: [],
    phone: null,
    phoneError: [],
    email: null,
    emailError: [],
    status: 0,
    statusError: [],
    note: null,
    description: null,
    descriptionError: [],
    town: null,
    currency: null,
    list_currencies: [],
    payment: 1,
    paymentError: [],
    pricePayment: {},
    list_payment: [{ value: 1, text: 'Thanh toán trực tiếp' }],
    list_town: [],
    townError: [],
    district: null,
    list_district: [],
    districtError: [],
    city: null,
    list_city: [],
    cityError: [],
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
        this.$store.dispatch('giao_dich/tourism_product').then((res) => {
          if (!res.error) {
            const arr = []

            if ((res.data.data || []).length !== 0) {
              for (let i = 0; i < res.data.data.length; i++) {
                arr.push({
                  value: res.data.data[i].id,
                  text: res.data.data[i].name,
                  price: res.data.data[i].price,
                })
              }
            }
            this.list_product = [...arr]
          }
        })
        this.$store.dispatch('giao_dich/province_list').then((response) => {
          if (!response.error) {
            const arr = []
            if ((response.data.data || []).length !== 0) {
              for (let i = 0; i < response.data.data.length; i++) {
                arr.push({
                  value: response.data.data[i].id,
                  text: response.data.data[i].name,
                  code: response.data.data[i].code,
                })
              }
            }
            this.list_city = [...arr]
          }
        })
        this.get_currency()
      } else {
      }
    },
  },
  methods: {
    validateTotalProduct(value) {
      if (Number(value) > 0) {
        this.total_product = Number(value)
        this.required = false
        this.totalProductError = ''
        this.total_price_products()
        this.products_price_calculate()
      }
      if (Number(value) === 0) {
        this.required = true
        this.totalProductError = 'Định dạng không hợp lệ'
      }
      if (!this.$isNumberTransition(value)) {
        this.required = true
        this.totalProductError = 'Bạn phải nhập số'
        if (Number(value) < 0) {
          this.total_product = Number(value)
          this.required = true
          this.totalProductError = 'Định dạng không hợp lệ'
        }
      }
    },
    change_get_currency() {
      this.products_price_calculate()
    },
    total_price_products() {
      if (!this.$isNullOrEmpty(this.product.value)) {
        this.total_price = this.product.price * this.total_product
      }
    },
    change_products() {
      this.total_product = 1
      this.required = false
      this.totalProductError = ''
      this.total_price_products()
    },
    products_price_calculate() {
      if (!this.$isNullOrEmpty(this.currency)) {
        const data = {
          currencyId: !this.$isNullOrEmpty(this.currency.value)
            ? this.currency.value
            : '',
          quantity: !this.$isNullOrEmpty(this.total_product)
            ? this.total_product
            : '',
          productId: !this.$isNullOrEmpty(this.product.value)
            ? this.product.value
            : '',
        }
        this.$store
          .dispatch('giao_dich/price_tourism_product', data)
          .then((res) => {
            if (!res.error) {
              this.pricePayment = res.data.data
            }
          })
      }
    },
    district_list() {
      const data = {
        code: this.city.code,
      }
      this.$store.dispatch('giao_dich/district_list', data).then((response) => {
        if (!response.error) {
          const arr = []
          if ((response.data.data || []).length !== 0) {
            for (let i = 0; i < response.data.data.length; i++) {
              arr.push({
                value: response.data.data[i].id,
                text: response.data.data[i].name,
                code: response.data.data[i].code,
              })
            }
          }
          this.list_district = [...arr]
        }
      })
    },
    town_list() {
      const data = {
        code: this.district.code,
      }
      this.$store.dispatch('giao_dich/ward_list', data).then((response) => {
        if (!response.error) {
          const arr = []
          if ((response.data.data || []).length !== 0) {
            for (let i = 0; i < response.data.data.length; i++) {
              arr.push({
                value: response.data.data[i].id,
                text: response.data.data[i].name,
              })
            }
          }
          this.list_town = [...arr]
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
    Add() {
      let province = null
      let district = null
      let ward = null
      if (this.checkbox === false) {
        province = this.city.value
        district = this.district.value
        ward = this.town
      }
      const data = {
        paymentType: this.payment,
        orderType: 1,
        orderStatus: this.status,
        productType: 4,
        productId: this.product.value,
        customerId: null,
        customerName: this.nameContact,
        customerPhone: this.phone,
        nationalId: null,
        customerEmail: this.email,
        note: this.note,
        currencyId: this.currency.value,
        quantity: this.total_product,
        provinceId: province,
        districtId: district,
        wardId: ward,
        address: this.description,
        receiveType: 1,
      }
      this.$store
        .dispatch('giao_dich/add_tourism_product', data)
        .then((response) => {
          if (!response.error) {
            this.$showSuccess(
              this,
              'Thêm mới giao dịch sản phẩm du lịch thành công'
            )
            this.$emit('exit')
          }
        })
        .catch((e) => {
          this.$log.debug(e)
        })
        .finally(() => {})
    },
    validateTourismProduct() {
      let hasErrors = false
      let count = 0
      if (this.$isNullOrEmpty(this.product)) {
        hasErrors = true
        this.productError = ['Không được để trống']
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
      if (this.$isNullOrEmpty(this.description)) {
        hasErrors = true
        this.descriptionError = ['Không được để trống']
        count += 1
      }
      if (!this.$isNullOrEmpty(this.product)) {
        if (!this.$isNumberTransition(this.total_product)) {
          hasErrors = true
          this.totalProductError = 'Bạn phải nhập số'
          count += 1
        } else if (Number(this.total_product) < 0) {
          hasErrors = true
          this.totalProductError = 'Định dạng không hợp lệ'
          count += 1
        }
      }
      if (this.checkbox === false) {
        if (this.$isNullOrEmpty(this.town)) {
          hasErrors = true
          this.townError = ['Không được để trống']
          count += 1
        }
        if (this.$isNullOrEmpty(this.district)) {
          hasErrors = true
          this.districtError = ['Không được để trống']
          count += 1
        }
        if (this.$isNullOrEmpty(this.city)) {
          hasErrors = true
          this.cityError = ['Không được để trống']
          count += 1
        }
      }
      if (this.$isNullOrEmpty(this.payment)) {
        hasErrors = true
        this.paymentError = ['Không được để trống']
        count += 1
      }
      if (count > 0) {
        this.$showWarnNotify(this, 'Bạn nhập thiếu thông tin bắt buộc')
      }
      if (!hasErrors) {
        this.Add()
      }
    },
    resetTourismProduct() {
      this.product = null
      this.productError = []
      this.nameContact = null
      this.nameContactError = []
      this.phone = null
      this.phoneError = []
      this.email = null
      this.emailError = []
      this.status = null
      this.statusError = []
      this.note = null
      this.city = null
      this.district = null
      this.town = null
    },
    plus() {
      if (!this.$isNullOrEmpty(this.product) && this.total_product >= 0) {
        this.total_product += 1
        this.total_price_products()
        this.products_price_calculate()
      }
    },
    minus() {
      if (!this.$isNullOrEmpty(this.product) && this.total_product >= 0) {
        if (this.total_product !== 1) {
          this.total_product -= 1
          this.total_price_products()
          this.products_price_calculate()
        }
      }
    },
  },
}
</script>

<style lang="scss">
.tourism_product {
  .product {
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
}
</style>
