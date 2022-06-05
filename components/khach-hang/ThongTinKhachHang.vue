<template>
  <div class="main_customer">
    <div
      class="mt-n2"
      style="
        position: fixed;
        display: flex;
        z-index: 3;
        right: 12px;
        padding-bottom: 20px;
        padding-top: 10px;
        bottom: 0;
        width: 100%;
        background-color: #f5f7fe;
      "
    >
      <v-spacer></v-spacer>

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
        Lưu
      </v-btn>
    </div>
    <div class="pb-12">
      <v-container>
        <v-row>
          <v-col cols="3">
            <p class="ml-4 pt-12 fs-14">
              Ảnh đại diện<span class="pl-1 red--text">*</span>
            </p>
          </v-col>

          <v-col cols="8">
            <!--            <select-file-->
            <!--              id="input_customer_information_file"-->
            <!--              ref="input_customer_information_file"-->
            <!--              :required="required_img"-->
            <!--              @set_file="file_selected"-->
            <!--            ></select-file>-->
            <div>
              <div class="d-flex align-center">
                <div
                  v-if="(img || []).length === 0"
                  style="cursor: pointer; width: fit-content"
                  @click="select_file"
                >
                  <SelectFile class="rounded" />
                </div>
                <div v-else>
                  <v-img
                    class="rounded"
                    style="cursor: pointer"
                    :src="img"
                    width="120"
                    height="120"
                    @click="select_file"
                  />
                </div>
                <v-btn
                  v-if="!hidden"
                  class="text-none text-body-2 rounded ml-4"
                  color="white"
                  height="32"
                  style="color: #47bbff"
                  depressed
                  @click="select_file"
                >
                  Chỉnh sửa
                </v-btn>
              </div>
              <div
                v-if="required_img"
                class="v-messages theme--light error--text mt-1"
                role="alert"
              >
                <div class="v-messages__wrapper">
                  <div class="v-messages__message">Không được để trống</div>
                </div>
              </div>
              <div
                v-if="limited_msg.length !== 0"
                class="v-messages theme--light error--text mt-1"
                role="alert"
              >
                <div class="v-messages__wrapper">
                  <div class="v-messages__message">{{ limited_msg }}</div>
                </div>
              </div>
              <v-file-input
                id="input_customer_information_file"
                accept="image/png, image/jpeg, image/gif"
                class="d-none"
                :value="reset_file"
                @change="inputFile($event)"
              />
            </div>
          </v-col>
          <v-col cols="3" class="pb-0 pt-4"
            ><div class="ml-4 fs-14">
              Tên khách hàng <span class="red--text">*</span>
            </div></v-col
          >
          <v-col cols="9" class="pb-0 pt-2"
            ><v-text-field
              v-model="name_customer"
              :error-messages="name_customer_errors"
              placeholder="Nhập tên khách hàng"
              solo
              flat
              dense
              class="border-1 fs-14"
              @input="name_customer_errors = []"
            ></v-text-field
          ></v-col>
          <v-col cols="3" class="pb-0 pt-2"
            ><div class="ml-4 fs-14">
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
              disabled
              @input="validateEmail($event, 'email_errors')"
            ></v-text-field
          ></v-col>
          <v-col cols="3" class="pb-0 pt-2"
            ><div class="ml-4 fs-14">Số điện thoại</div></v-col
          >
          <v-col cols="9" class="py-0"
            ><v-text-field
              v-model="phone_Number"
              :error-messages="phoneError"
              solo
              flat
              dense
              class="border-1 fs-14"
              placeholder="Nhập số điện thoại"
              @input="validatePhone($event, 'phoneError')"
            ></v-text-field
          ></v-col>
          <!-- <v-col cols="3" class="pb-0 pt-2"
            ><div class="ml-4 fs-14">
              Mật khẩu <span class="red--text">*</span>
            </div></v-col
          > -->
          <!-- <v-col cols="9" class="py-0"
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
          ></v-col> -->
        </v-row></v-container
      >
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
      alert-msg="Bạn có chắc chắn muốn sửa khách hàng?"
      @toggle="open_add = !open_add"
      @OK="validate"
    >
    </yes-no-alert>
  </div>
  <!-- validate -->
  <!-- com_back -->
</template>

<script>
import Folder from '~/assets/configurations/Folder_Config'
// import SelectFile from '~/components/Selected/File'
import SelectFile from '~/components/icon/SelectFile'
export default {
  components: {
    SelectFile,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      open_cancel: false,
      open_add: false,

      show_pass: false,
      email: null,
      email_errors: [],
      name_customer: null,
      name_customer_errors: [],
      password: null,
      password_errors: [],
      phone_Number: null,
      phoneError: [],
      avatar: '',
      file_img: '',
      required_img: false,

      // xử lý files img
      hidden: false,
      reset_file: null,
      img: '',
      limited_msg: '',
    }
  },
  created() {
    this.name_customer = this.data.info.name
    this.email = this.data.info.email
    this.phone_Number = this.data.info.phone
    // this.password = this.data.info.password
    this.avatar = this.data.info.avatar

    this.img = this.data.info.avatar
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
      } else if (!isNaN(this.name_customer)) {
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
      // if ((this.password || []).length === 0) {
      //   hasErrors = true
      //   this.password_errors = ['Không được để trống']
      // }
      if (isNaN(this.phone_Number) && !this.$isNullOrEmpty(this.phone_Number)) {
        hasErrors = true
        this.phoneError = ['Vui lòng nhập số']
      } else if (
        (this.phone_Number + '').length < 10 ||
        (this.phone_Number + '').length > 12
      ) {
        if (!this.$isNullOrEmpty(this.phone_Number)) {
          hasErrors = true
          this.phoneError = 'Số điện thoại không hợp lệ'
        }
      }

      if (!hasErrors) {
        this.customer_update()
      }
    },

    file_selected(file) {
      if (!this.$isNullOrEmpty(file)) {
        this.file_img = file
        this.required_img = false
        const formData = new FormData()
        formData.append('file', this.file_img)
        const folder = Folder.khach_hang
        const data = { formData, folder }
        this.$store.dispatch('uploadImg/uploadFile', data).then((response) => {
          if (!response.error) {
            this.avatar = response.data.data.image_url
          }
        })
      }
    },
    customer_update() {
      this.$store
        .dispatch('khach_hang/customer_update', {
          id: this.data.id,
          avatar: this.avatar,
          name: this.name_customer,
          email: this.email,
          phone: this.phone_Number,
          group_id: null,
        })
        .then((response) => {
          if (!response.error) {
            this.$router.push('/khach-hang')
            this.$showSuccess(this, 'Cập nhật khách hàng thành công')
          }
        })
    },

    toggle() {
      this.$router.push('/khach-hang')

      // this.$refs.input_customer_information_file.reset('')
    },
    // xử lý files img
    select_file() {
      return window.document
        .getElementById('input_customer_information_file')
        .click()
    },
    inputFile(file) {
      if (!this.$isNullOrEmpty(file)) {
        this.hidden = false
        let hasErrors = false

        if ((file.size || 0) > 3145728) {
          hasErrors = true
          this.limited_msg = 'File được chọn không được vượt quá 3MB'
        }

        if (!hasErrors) {
          this.limited_msg = ''
          this.reset_file = file

          if ((file || []).length !== 0) {
            this.img = URL.createObjectURL(file)
          }

          // this.$emit('set_file', file)
          this.file_selected(file)
        }
      }
    },
    delete_img() {
      this.reset_file = null
      this.img = ''
      this.file_selected('')
    },
    reset() {
      this.reset_file = null
      this.img = ''
    },
    set_img(value) {
      this.img = value
    },
  },
}
</script>
<style lang="scss">
.main_customer {
  background-color: #f5f7fe;
}
</style>
