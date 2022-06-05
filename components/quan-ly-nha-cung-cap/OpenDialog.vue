<template>
  <div>
    <v-dialog
      :value="open"
      max-width="700px"
      @keydown="$event.key === 'Escape' && toggle()"
      @click:outside="toggle"
    >
      <v-card>
        <v-card-title class="pt-3 pb-1">
          <div class="font-weight-bold">Tìm kiếm nâng cao</div>
          <div class="flex-grow-1"></div>
          <div class="d-flex align-center">
            <v-btn depressed icon color="primary" @click="reset">
              <v-icon size="20"> mdi-autorenew</v-icon>
            </v-btn>
            <div class="primary--text cp fs-15" @click="reset">Xóa bộ lọc</div>
          </div>
        </v-card-title>
        <v-container class="py-0">
          <v-row>
            <v-col cols="6">
              <v-text-field
                v-model="producer_name"
                placeholder="Nhà cung cấp"
                dense
                flat
                solo
                class="border-1 fs-14"
                hide-details
                clearable
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="enterprise_name"
                placeholder="Doanh nghiệp"
                dense
                flat
                solo
                class="border-1 fs-14"
                hide-details
                clearable
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="email"
                placeholder="Email"
                dense
                flat
                solo
                class="border-1 fs-14"
                hide-details
                clearable
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="phone"
                placeholder="Số điện thoại"
                dense
                flat
                solo
                class="border-1 fs-14"
                hide-details
                clearable
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="business_registration_code"
                placeholder="Đăng ký kinh doanh"
                dense
                flat
                solo
                class="border-1 fs-14"
                hide-details
                clearable
              ></v-text-field>
            </v-col>

            <!-- <v-col cols="6">
              <v-autocomplete
                v-model="status"
                label="Trạng thái"
                :items="list_status"
                outlined
                solo
                dense
                flat
                hide-details
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
              </v-autocomplete>
            </v-col> -->
            <v-col cols="6">
              <v-select
                v-model="product_category_names"
                :items="ListProductType"
                placeholder="Sản phẩm"
                flat
                solo
                class="border-1 fs-14"
                dense
                multiple
                clearable
              ></v-select>
            </v-col>
          </v-row>
        </v-container>
        <v-card-actions class="pt-6">
          <div class="flex-grow-1"></div>
          <v-btn
            depressed
            color="#FF0F59"
            height="30"
            class="fs-13 text-none white--text"
            @click="back"
          >
            <div class="font_size">Hủy</div>
          </v-btn>
          <v-btn
            depressed
            color="#47BBFF"
            height="30"
            class="fs-13 text-none white--text"
            @click="Save"
          >
            <div class="font_size">Lưu</div>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    open: {
      type: Boolean,
      required: true,
    },
    isReset: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    producer_name: null,
    enterprise_name: null,
    business_registration_code: null,
    product_category_names: null,
    email: null,
    phone: null,
    ListProductType: [],
    // product_category_names: [],
    // listProduct: [
    //   { value: 1, text: 'Nhà hàng' },
    //   {
    //     value: 0,
    //     text: 'Tour du lịch',
    //   },
    //   { value: 2, text: 'Khách sạn' },
    // ],
    // status: 2,
    // list_status: [
    //   { value: 1, text: 'Đã duyệt', color: '#17e555' },
    //   {
    //     value: 2,
    //     text: 'Chưa phê duyệt',
    //     color: '#f5972d',
    //   },
    //   { value: 3, text: 'Từ chối', color: '#ff0f59' },
    // ],
  }),
  watch: {
    open(value) {
      if (value) {
        this.productType()
      }
    },
  },
  methods: {
    reset() {
      this.producer_name = null
      this.enterprise_name = null
      this.business_registration_code = null
      this.product_category_names = null
      this.email = null
      this.phone = null
      this.$emit('reset')
    },
    toggle() {
      this.$emit('toggle')
    },
    productType() {
      this.$store
        .dispatch('nha_cung_cap/productType', {
          product_type_ids: this.product_category_names,
        })
        .then((response) => {
          if (!response.error) {
            const data = []
            for (let i = 0; i < response.data.data.length; i++) {
              data.push({
                value: response.data.data[i].id,
                text: response.data.data[i].name,
              })
            }
            this.ListProductType = [...data]
          }
        })
    },
    back() {
      this.$emit('toggle')
    },
    Save() {
      const data = {
        producer_name: this.$isNullOrEmpty(this.producer_name)
          ? ''
          : this.producer_name.trim(),
        enterprise_name: this.$isNullOrEmpty(this.enterprise_name)
          ? ''
          : this.enterprise_name.trim(),
        email: this.$isNullOrEmpty(this.email) ? '' : this.email.trim(),
        phone: this.$isNullOrEmpty(this.phone) ? '' : this.phone.trim(),
        business_registration_code: this.$isNullOrEmpty(
          this.business_registration_code
        )
          ? ''
          : this.business_registration_code.trim(),
        product_category_names: this.$isNullOrEmpty(this.product_category_names)
          ? ''
          : this.product_category_names.join(),
        // status: this.status,
      }
      this.$emit('filter', data)
      this.$emit('toggle')
    },
  },
}
</script>
