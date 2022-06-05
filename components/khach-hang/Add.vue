<template>
  <div class="main_customer_add">
    <div class="d-flex w-100 actions-coordinates-1">
      <div class="flex-grow-1"></div>
      <div class="d-flex w-100 actions-coordinates-2 pb-5 pt-3">
        <div class="flex-grow-1"></div>
        <v-btn
          large
          depressed
          width="114px"
          height="39px"
          color="error"
          class="mr-5 text-none white--text"
          @click="open_cancel = true"
        >
          <v-icon></v-icon> Hủy
        </v-btn>
        <v-btn
          large
          depressed
          width="114px"
          height="39px"
          color="#47BBFF"
          class="mr-5 text-none white--text"
          @click="open_add = true"
        >
          Thêm
        </v-btn>
      </div>
    </div>
    <div class="pb-12">
      <v-container>
        <v-row>
          <v-col cols="3">
            <p class="ml-4 pt-12 fs-14">
              Ảnh đại diện <span class="pl-1s red--text">*</span>
            </p>
          </v-col>

          <v-col cols="8">
            <select-file
              id="input_customer_file_img"
              ref="input_customer_file_img"
              :hidden="true"
              :required="required_img"
              @set_file="file_selected"
            ></select-file>
          </v-col>
          <v-col cols="3" class="pb-0 pt-4"
            ><div class="fs-14 ml-4">
              Tên khách hàng <span class="red--text">*</span>
            </div></v-col
          >
          <v-col cols="9" class="pb-0 pt-2"
            ><v-text-field
              v-model="name_customer"
              :error-messages="name_customer_errors"
              solo
              flat
              dense
              placeholder="Nhập tên khách hàng"
              class="border-1 fs-14"
              @input="name_customer_errors = []"
            ></v-text-field
          ></v-col>
          <v-col cols="3" class="pb-0 pt-2"
            ><div class="fs-14 ml-4">
              Địa chỉ email <span class="red--text">*</span>
            </div></v-col
          >
          <v-col cols="9" class="py-0"
            ><v-text-field
              v-model="email"
              :error-messages="email_errors"
              placeholder="Nhập địa chỉ email"
              solo
              flat
              dense
              class="border-1 fs-14"
              @input="validateEmail($event, 'email_errors')"
            ></v-text-field
          ></v-col>
          <v-col cols="3" class="pb-0 pt-2"
            ><div class="fs-14 ml-4">Số điện thoại</div></v-col
          >
          <v-col cols="9" class="py-0"
            ><v-text-field
              v-model="phone"
              :error-messages="phoneError"
              placeholder="Nhập số điện thoại"
              solo
              flat
              dense
              class="border-1 fs-14"
              @input="validatePhone($event, 'phoneError')"
            ></v-text-field
          ></v-col>
          <v-col cols="3" class="pb-0 pt-2"
            ><div class="fs-14 ml-4">
              Mật khẩu <span class="red--text">*</span>
            </div></v-col
          >
          <v-col cols="9" class="py-0"
            ><v-text-field
              id="password"
              v-model="password"
              placeholder="Nhập mật khẩu"
              name="password"
              :type="show_pass ? 'text' : 'password'"
              :error-messages="password_errors"
              class="border-1 fs-14"
              solo
              flat
              dense
              :append-icon="show_pass ? 'mdi-eye' : 'mdi-eye-off'"
              @input="password_errors = []"
              @click:append="show_pass = !show_pass"
            ></v-text-field
          ></v-col> </v-row
      ></v-container>
    </div>
    <yes-no-alert
      :open="open_cancel"
      alert-msg="Bạn có chắc chắn muốn thoát?"
      @toggle="open_cancel = !open_cancel"
      @OK="toggle"
    >
    </yes-no-alert>
    <yes-no-alert
      :open="open_add"
      alert-msg="Bạn có chắc chắn muốn thêm khách hàng?"
      @toggle="open_add = !open_add"
      @OK="validate"
    >
    </yes-no-alert>
  </div>
  <!-- com_back -->
  <!-- validate -->
</template>

<script>
import Folder from '~/assets/configurations/Folder_Config'
// import Folder from '~/assets/configurations/Folder_Config'
import SelectFile from '~/components/Selected/File'
export default {
  components: {
    SelectFile,
  },
  props: {
    open: {
      type: Number,
      required: true,
    },
  },

  data() {
    return {
      open_add: false,
      open_cancel: false,
      show_pass: false,
      email: null,
      email_errors: [],
      name_customer: null,
      name_customer_errors: [],
      password: '',
      password_errors: [],
      phone: null,
      phoneError: [],
      avatar: '',
      required_img: false,
      file_img: '',
    }
  },
  watch: {
    open(value) {
      if (value === 2) {
        this.$store.commit('app/checkBack', true)
        this.reset()
      }
    },
  },
  methods: {
    validateEmail(value, error) {
      if (this.$isNullOrEmpty(value)) {
        this[error] = ['Không được để trống']
      } else if (!this.$isEmail(value.trim())) {
        this[error] = ['Email không hợp lệ']
      } else {
        this[error] = []
      }
    },
    validatePhone(value, error) {
      // if (!this.$isMobilePhone(value.trim())) {
      //   this[error] = ['Số điện thoại không hợp lệ']
      // } else {
      //   this[error] = []
      // }
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
    validate() {
      let hasErrors = false
      if ((this.name_customer || []).length === 0) {
        hasErrors = true
        this.name_customer_errors = ['Không được để trống']
      } else if (!this.$isRegex(this.name_customer)) {
        hasErrors = true
        this.name_customer_errors = ['Nhập trường tên không hợp lệ']
      }
      if ((this.email || []).length === 0) {
        hasErrors = true
        this.email_errors = ['Không được để trống']
      } else if (!this.$isEmail(this.email)) {
        hasErrors = true
        this.email_errors = ['Nhập email không hợp lệ']
      }
      if ((this.password || []).length === 0) {
        hasErrors = true
        this.password_errors = ['Không được để trống']
      } else if (this.password.length < 8) {
        hasErrors = true
        this.password_errors = 'Mật khẩu ít nhất 8 ký tự'
      } else if (this.password.length >= 32) {
        hasErrors = true
        this.password_errors = 'Mật khẩu tối đa 32 ký tự'
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
      }
      if ((this.file_img || []).length === 0) {
        hasErrors = true
        this.required_img = true
      }
      if (!hasErrors) {
        this.upload_file()
      }
    },

    file_selected(file) {
      this.file_img = file
      this.required_img = false
    },
    upload_file() {
      const formData = new FormData()
      formData.append('file', this.file_img)
      const folder = Folder.khach_hang
      const data = { formData, folder }
      this.$store
        .dispatch('uploadImg/uploadFile', data)
        .then((response) => {
          if (!response.error) {
            // this.avatar = response.data.data.image_url
            this.customer_add(response.data.data.image_url)
          }
        })
        .catch((e) => {
          this.$log.debug(e)
        })
    },
    customer_add(image) {
      this.$store
        .dispatch('khach_hang/customer_add', {
          name: this.name_customer,
          email: this.email,
          phone: this.phone,
          password: this.password,
          avatar: image,
          group_id: 1,
        })
        .then((response) => {
          if (!response.error) {
            this.$emit('toggle')
            this.$emit('success')
            this.$showSuccess(this, 'Thêm mới khách hàng thành công')
            this.reset()
          }
          this.$store.commit('app/setTitle', 'Khách hàng')
        })
    },
    reset() {
      this.email = null
      this.email_errors = []
      this.name_customer = null
      this.name_customer_errors = []
      this.password = ''
      this.password_errors = []
      this.phone = null
      this.phoneError = []
      this.avatar = ''
      this.required_img = false
      this.file_img = ''
      this.$refs.input_customer_file_img.reset('')
    },

    toggle() {
      this.$emit('toggle')
      this.reset()
      this.$store.commit('app/setTitle', 'Khách hàng')
    },
  },
}
</script>
<style lang="scss">
.main_customer_add {
  .actions-coordinates-1 {
    position: fixed;
    z-index: 3 !important;
    right: 0;
    top: 75px;
    height: 50px;
    background-color: #f5f7fe;
  }
  .actions-coordinates-2 {
    position: fixed;
    z-index: 3 !important;
    right: 0;
    bottom: 0;
    background-color: #f5f7fe;
  }
}
</style>
