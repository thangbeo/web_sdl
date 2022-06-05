<template>
  <div style="background-color: #f4f7fe" class="quan-tri-vien-add">
    <v-container>
      <v-row class="pt-10">
        <v-col cols="2">
          <p class="ml-4 fs-14 pt-12">Ảnh đại diện</p>
        </v-col>

        <v-col cols="9">
          <select-file
            id="input_file_img_addquantrivien"
            ref="input_file_img_addquantrivien"
            :image="avatar"
            :required="required_img"
            :hidden-icon="true"
            @set_file="file_selected"
            @delete_file="delete_file"
          ></select-file>
        </v-col>

        <v-col cols="2" class="pb-0">
          <v-card-text class="pt-2 fs-14"
            >Tên quản trị viên <span class="error--text">*</span></v-card-text
          >
        </v-col>
        <v-col cols="9" class="pb-0">
          <v-text-field
            v-model="name"
            placeholder="Nhập tên quản trị viên"
            dense
            solo
            class="fs-14"
            flat
            :outlined="nameError.length !== 0"
            :error-messages="nameError"
            @input="nameError = []"
          ></v-text-field
        ></v-col>
        <v-col cols="2" class="pb-0">
          <v-card-text class="pt-2 fs-14"
            >Địa chỉ email <span class="error--text">*</span></v-card-text
          >
        </v-col>
        <v-col cols="9" class="pb-0">
          <v-text-field
            v-model="email"
            placeholder="Nhập địa chỉ email"
            dense
            class="fs-14"
            solo
            flat
            :outlined="emailError.length !== 0"
            :error-messages="emailError"
            @input="emailError = []"
          ></v-text-field>
        </v-col>
        <v-col cols="2" class="pb-0">
          <v-card-text class="pt-2 fs-14">Số điện thoại</v-card-text>
        </v-col>
        <v-col cols="9" class="pb-0">
          <v-text-field
            v-model="phone"
            placeholder="Nhập SĐT"
            type="number"
            dense
            class="fs-14"
            solo
            flat
            :outlined="phoneError.length !== 0"
            :error-messages="phoneError"
            @input="check_phone"
          ></v-text-field>
        </v-col>
        <v-col cols="2" class="pb-0 pr-0">
          <v-card-text class="pt-2 pr-0 fs-14"
            >Chức danh công việc <span class="error--text">*</span></v-card-text
          >
        </v-col>
        <v-col cols="9" class="pb-0">
          <v-text-field
            v-model="positionJob"
            placeholder="Nhập chức danh công việc"
            dense
            solo
            class="fs-14"
            flat
            :outlined="positionJobError.length !== 0"
            :error-messages="positionJobError"
            @input="positionJobError = []"
          ></v-text-field>
        </v-col>
        <v-col cols="2" class="pb-0">
          <v-card-text class="pt-2"
            >Trạng thái <span class="error--text">*</span></v-card-text
          >
        </v-col>
        <v-col cols="9" class="pb-0">
          <v-autocomplete
            v-model="status"
            dense
            solo
            flat
            :items="listStatus"
            :error-messages="statusError"
            @input="statusError = []"
            class="fs-14"
          >
            <template v-slot:selection="data_selected">
              <div class="fs-14" :style="`color: ${data_selected.item.color}`">
                {{ data_selected.item.text }}
              </div>
            </template>
            <template v-slot:item="data_selected">
              <div
                :style="`color: ${data_selected.item.color} !important`"
                class="fs-14"
              >
                {{ data_selected.item.text }}
              </div>
            </template></v-autocomplete
          >
        </v-col>
        <v-col cols="2">
          <v-card-text class="pt-2 fs-14">Ghi chú</v-card-text>
        </v-col>
        <v-col cols="9">
          <v-textarea
            v-model="note"
            placeholder="Nhập ghi chú"
            dense
            class="fs-14"
            solo
            flat
            hide-details
          ></v-textarea>
        </v-col>
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
            class="text-none"
            width="90px"
            color="#47BBFF"
            dark
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
      alert-msg="Bạn chắc chắn muốn lưu thông tin quản trị viên không?"
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
  components: {
    SelectFile,
  },
  props: {
    open: {
      type: Boolean,
      default: true,
    },
  },
  data: () => ({
    open_update: false,
    open_cancel: false,
    dataAdd: null,
    file_img: '',
    avatar: '',
    required_img: false,
    phone: null,
    positionJob: null,
    positionJobError: [],
    note: null,
    name: null,
    nameError: [],
    email: null,
    emailError: [],
    phoneError: [],
    status: 1,
    statusError: [],
    listStatus: [
      { value: 1, text: 'Đang hoạt động', color: '#17e555' },
      { value: 2, text: 'Dừng hoạt động', color: '#ff0f59' },
    ],
  }),
  watch: {
    open(value) {
      if (value) {
        // console.log(this.$store.state.quan_tri_vien.list_notify)
      } else {
        this.dataAdd = {
          avatar: this.avatar,
          name: this.name,
          email: this.email,
          phone: this.phone,
          position: this.positionJob,
          status: this.status,
          note: this.note,
        }
        this.$store.commit('quan_tri_vien/data_add_QTV', this.dataAdd)
      }
    },
  },
  methods: {
    toggle() {
      this.$emit('exit')
      this.resets()
    },
    Add() {
      const data = {
        avatar: this.avatar,
        name: this.name,
        email: this.email,
        phone: this.phone,
        position: this.positionJob,
        status: this.status,
        note: this.note,
        list_notify: this.$store.state.quan_tri_vien.list_notify,
        list_page: this.$store.state.quan_tri_vien.listPhanQuyen,
        is_owner: this.$store.state.quan_tri_vien.is_owner,
      }
      this.$store
        .dispatch('quan_tri_vien/add', data)
        .then((response) => {
          if (!response.error) {
            this.$emit('exit')
            this.$emit('success')
            this.$showSuccess(this, 'Thêm mới quản trị viên thành công')
          }
        })
        .catch((e) => {
          this.$log.debug(e)
        })
        .finally(() => {})
    },
    resets() {
      this.avatar = null
      this.name = null
      this.nameError = []
      this.email = null
      this.emailError = []
      this.phone = null
      this.phoneError = []
      this.positionJob = null
      this.positionJobError = []
      this.status = 1
      this.note = null
      this.$refs.input_file_img_addquantrivien.reset()
      this.$refs.input_file_img_addquantrivien.set_img((this.avatar = ''))
      this.$store.commit('quan_tri_vien/data_add_QTV', {
        avatar: null,
        name: null,
        email: null,
        phone: null,
        positionJob: null,
        status: 1,
        note: null,
      })
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
    save() {
      let hasErrors = false
      let count = 0
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
      if (this.$isNullOrEmpty(this.positionJob)) {
        hasErrors = true
        this.positionJobError = ['Không được để trống']
        count += 1
      }
      if (count > 0) {
        this.$showWarnNotify(this, 'Bạn nhập thiếu thông tin bắt buộc')
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
      const folder = Folder.quan_tri_vien
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
  },
}
</script>
<style lang="scss">
.quan-tri-vien-add {
  .v-input__control {
    margin-bottom: -10px;
  }
}
</style>
