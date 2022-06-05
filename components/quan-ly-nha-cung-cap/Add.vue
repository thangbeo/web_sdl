<template>
  <div style="background-color: #f4f7fe">
    <v-container>
      <v-row class="pt-3">
        <v-col cols="2">
          <p class="ml-4 fs-14 pt-13">Ảnh đại diện</p>
        </v-col>
        <v-col cols="9">
          <select-file
            id="input_file_img_addnhacungcap"
            ref="input_file_img_addnhacungcap"
            :image="avatar"
            :hidden-icon="true"
            :required="required_img"
            @set_file="file_selected"
            @delete_file="delete_file"
          ></select-file>
        </v-col>

        <v-col cols="2">
          <v-card-text class="pt-0 pb-0"
            >Tên nhà cung cấp <span class="error--text">*</span></v-card-text
          >
        </v-col>
        <v-col cols="9" class="pt-0 pb-0">
          <v-text-field
            v-model="name"
            placeholder="Nhập Tên nhà cung cấp"
            dense
            class="fs-14"
            solo
            flat
            :outlined="nameError.length !== 0"
            :error-messages="nameError"
            @input="nameError = []"
          ></v-text-field
        ></v-col>
        <v-col cols="2">
          <v-card-text class="pt-0 pb-0"
            >Địa chỉ email <span class="error--text">*</span></v-card-text
          >
        </v-col>
        <v-col cols="9" class="pt-0 pb-0">
          <v-text-field
            v-model="email"
            placeholder="Nhập Địa chỉ email"
            dense
            solo
            class="fs-14"
            flat
            :outlined="emailError.length !== 0"
            :error-messages="emailError"
            @input="emailError = []"
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-card-text class="pt-0 pb-0">Số điện thoại</v-card-text>
        </v-col>
        <v-col cols="9" class="pt-0 pb-0">
          <v-text-field
            v-model="phone"
            type="number"
            placeholder="Nhập SĐT"
            dense
            solo
            flat
            class="fs-14"
            :outlined="phoneError.length !== 0"
            :error-messages="phoneError"
            @input="check_phone"
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-card-text class="pt-0 pb-0"
            >Tên doanh nghiệp <span class="error--text">*</span></v-card-text
          >
        </v-col>
        <v-col cols="9" class="pt-0 pb-0">
          <v-text-field
            v-model="enterprise_name"
            placeholder="Nhập Tên doanh nghiệp"
            dense
            solo
            flat
            class="fs-14"
            :outlined="enterprise_nameError.length !== 0"
            :error-messages="enterprise_nameError"
            @input="enterprise_nameError = []"
          ></v-text-field>
        </v-col>
        <v-col cols="2" class="pr-0">
          <v-card-text class="pr-0 pt-0 pb-0"
            >Link website doanh nghiệp</v-card-text
          >
        </v-col>
        <v-col cols="9" class="pt-0 pb-0">
          <v-text-field
            v-model="enterprise_link_website"
            placeholder="Nhập Link website doanh nghiệp"
            dense
            solo
            flat
            class="fs-14"
            :outlined="enterprise_link_websiteError.length !== 0"
            :error-messages="enterprise_link_websiteError"
            @input="check_url"
          >
          </v-text-field>
        </v-col>
        <v-col cols="2" class="pr-0">
          <v-card-text class="pr-0 pt-0 pb-0"
            >Mã số đăng ký kinh doanh
            <span class="error--text">*</span></v-card-text
          >
        </v-col>
        <v-col cols="9" class="pt-0 pb-0">
          <v-text-field
            v-model="business_registration_code"
            placeholder="Nhập Mã số đăng ký kinh doanh"
            type="number"
            dense
            solo
            flat
            class="fs-14"
            :outlined="codeError.length !== 0"
            :error-messages="codeError"
            @input="codeError = []"
          ></v-text-field>
        </v-col>

        <v-col cols="2">
          <v-card-text class="pt-0 pb-0"
            >Sản phẩm dịch vụ <span class="error--text">*</span></v-card-text
          >
        </v-col>
        <v-col cols="9" class="pt-0 pb-0">
          <v-select
            v-model="product_type_ids"
            placeholder="Chọn Sản phẩm dịch vụ"
            dense
            multiple
            solo
            flat
            class="fs-14"
            :items="ListProductType"
            :outlined="product_type_idsError.length !== 0"
            :error-messages="product_type_idsError"
            @input="product_type_idsError = []"
          ></v-select>
        </v-col>

        <!-- <v-col cols="2">
          <v-card-text class="pt-0 pb-0"
            >Trạng thái <span class="error--text">*</span></v-card-text
          >
        </v-col>
        <v-col cols="9" class="pt-0 pb-0">
          <v-select
            v-model="status"
            :items="list_status"
            dense
            solo
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
          </v-select>
        </v-col> -->
        <v-col cols="11" class="pt-12 d-flex justify-end">
          <v-btn
            color="#FF0F59"
            width="90px"
            class="text-none white--text mr-3"
            depressed
            @click="open_cancel = true"
            >Hủy</v-btn
          >
          <v-btn
            class="white--text text-none"
            width="90px"
            color="#47BBFF"
            depressed
            @click="open_update = true"
            >Lưu</v-btn
          >
        </v-col>
      </v-row>
    </v-container>
    <yes-no-alert
      :open="open_cancel"
      alert-msg="Bạn chắc chắn muốn hủy không?"
      @toggle="open_cancel = !open_cancel"
      @OK="toggle"
    >
    </yes-no-alert>
    <yes-no-alert
      :open="open_update"
      alert-msg="Bạn chắc chắn muốn lưu thông tin nhà cung cấp không?"
      @toggle="open_update = !open_update"
      @OK="save"
    >
    </yes-no-alert>
  </div>
</template>

<script>
import Folder from '~/assets/configurations/Folder_Config'
import SelectFile from '~/components/quan-tri-vien/File'
export default {
  components: { SelectFile },
  props: {
    open: {
      type: Boolean,
      default: true,
    },
  },
  data: () => ({
    open_update: false,
    open_cancel: false,
    file_img: '',
    avatar: '',
    required_img: false,
    name: null,
    nameError: [],
    phone: null,
    phoneError: [],
    email: null,
    emailError: [],
    enterprise_name: null,
    enterprise_nameError: [],
    enterprise_link_website: null,
    enterprise_link_websiteError: [],
    business_registration_code: null,
    codeError: [],
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
    product_type_ids: [],
    product_type_idsError: [],
    ListProductType: [],
  }),
  watch: {
    open(value) {
      if (value) {
        this.productType()
      } else {
        this.reset()
      }
    },
  },
  methods: {
    productType() {
      this.$store
        .dispatch('nha_cung_cap/productType', {
          product_type_ids: this.product_type_ids,
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

    toggle() {
      this.$emit('toggle')
      this.$emit('exit')
    },
    reset() {
      // this.status = 2
      this.product_type_ids = null
      this.avatar = null
      this.name = null
      this.nameError = []
      this.email = null
      this.emailError = []
      this.phone = null
      this.phoneError = []
      this.enterprise_name = null
      this.enterprise_nameError = []
      this.business_registration_code = null
      this.codeError = []
      this.enterprise_link_website = null
      this.enterprise_link_websiteError = []
      this.product_type_idsError = []
      this.$refs.input_file_img_addnhacungcap.reset()
      this.$refs.input_file_img_addnhacungcap.set_img((this.avatar = ''))
    },
    check_phone() {
      this.phoneError = []
      if (isNaN(this.phone) && !this.$isNullOrEmpty(this.phone)) {
        this.phoneError = ['Vui lòng nhập số']
      } else if (
        (this.phone + '').length < 10 ||
        (this.phone + '').length > 12
      ) {
        if (!this.$isNullOrEmpty(this.phone)) {
          this.phoneError = 'Số điện thoại không hợp lệ'
        }
      }
    },
    check_url() {
      this.enterprise_link_websiteError = []
      if (!this.$isNullOrEmpty(this.enterprise_link_website)) {
        if (
          this.$isHasVietnamese(this.enterprise_link_website) ||
          /\s/g.test(this.enterprise_link_website)
        ) {
          this.enterprise_link_websiteError = ['Không đúng định dạng url']
        }
      }
    },
    save() {
      let hasErrors = false
      let count = 0
      if (!this.$isNullOrEmpty(this.enterprise_link_website)) {
        if (
          this.$isHasVietnamese(this.enterprise_link_website) ||
          /\s/g.test(this.enterprise_link_website)
        ) {
          hasErrors = true
          this.enterprise_link_websiteError = ['Không đúng định dạng url']
        }
      }
      if (this.$isNullOrEmpty(this.name)) {
        hasErrors = true
        this.nameError = ['Không được để trống']
        count += 1
      }
      if (this.$isNullOrEmpty(this.email)) {
        hasErrors = true
        this.emailError = ['Không được để trống']
        count += 1
      } else if (!this.$isEmail(this.email)) {
        hasErrors = true
        this.emailError = ['Email không hợp lệ']
      }
      if (this.$isNullOrEmpty(this.enterprise_name)) {
        hasErrors = true
        this.enterprise_nameError = ['Không được để trống']
        count += 1
      }
      if (this.$isNullOrEmpty(this.product_type_ids)) {
        hasErrors = true
        this.product_type_idsError = ['Không được để trống']
        count += 1
      }
      if (this.$isNullOrEmpty(this.business_registration_code)) {
        hasErrors = true
        this.codeError = ['Không được để trống']
        count += 1
      } else if (this.business_registration_code.length !== 10) {
        hasErrors = true
        this.codeError = 'Mã số đăng ký không hợp lệ'
      }

      if (isNaN(this.phone) && !this.$isNullOrEmpty(this.phone)) {
        hasErrors = true
        this.phoneError = ['Vui lòng nhập số']
      } else if (
        (this.phone + '').length < 10 ||
        (this.phone + '').length > 12
      ) {
        if (!this.$isNullOrEmpty(this.phone)) {
          hasErrors = true
          this.phoneError = 'Số điện thoại không hợp lệ'
        }
        if (count > 0) {
          this.$showWarnNotify(this, 'Bạn nhập thiếu thông tin bắt buộc')
        }
      }
      if (!hasErrors) {
        this.Add()
      }
    },
    delete_file(img) {
      this.avatar = img
    },
    file_selected(file) {
      this.file_img = file
      this.required_img = false
      const formData = new FormData()
      formData.append('file', file)
      const folder = Folder.nha_cung_cap
      const data = { formData, folder }
      this.$store
        .dispatch('uploadImg/uploadFile', data)
        .then((response) => {
          if (!response.error) {
            this.avatar = response.data.data.image_url
          }
        })
        .catch((e) => {
          this.$log.debug(e)
        })
    },
    Add() {
      const data = {
        image_url: this.avatar,
        name: this.name,
        email: this.email,
        phone: this.phone,
        enterprise_name: this.enterprise_name,
        business_registration_code: this.business_registration_code,
        enterprise_link_website: this.enterprise_link_website,
        product_type_ids: this.product_type_ids,
        status: 1,
      }
      this.$store
        .dispatch('nha_cung_cap/add', data)
        .then((response) => {
          if (!response.error) {
            this.$emit('exit')
            this.$showSuccess(this, 'Thêm mới nhà cung cấp thành công')
          }
        })
        .catch((e) => {
          this.$log.debug(e)
        })
        .finally(() => {})
    },
  },
}
</script>
