<template>
  <div style="background-color: #f4f7fe">
    <v-container>
      <v-row class="pt-10">
        <v-col cols="2">
          <p class="ml-4 pt-13">Ảnh đại diện</p>
        </v-col>
        <v-col cols="9">
          <select-file
            id="input_file_img_taikhoan"
            ref="input_file_img_taikhoan"
            :fixed="false"
            :hidden="true"
            :required="required_img"
            @set_file="file_selected"
          ></select-file>
        </v-col>

        <v-col cols="2" class="pb-0 pt-0">
          <v-card-text class="pt-2"
            >Tên quản trị viên <span class="error--text">*</span></v-card-text
          >
        </v-col>
        <v-col cols="9" class="pb-0 pt-0">
          <v-text-field
            v-model="name"
            placeholder="Nhập tên quản trị viên"
            background-color="grey lighten-5"
            dense
            solo
            flat
            readonly
          ></v-text-field
        ></v-col>
        <v-col cols="2" class="pb-0 pt-0">
          <v-card-text class="pt-2"
            >Địa chỉ email <span class="error--text">*</span></v-card-text
          >
        </v-col>
        <v-col cols="9" class="pb-0 pt-0">
          <v-text-field
            v-model="email"
            placeholder="Nhập địa chỉ email"
            background-color="grey lighten-5"
            dense
            solo
            flat
            readonly
          ></v-text-field>
        </v-col>
        <v-col cols="2" class="pb-0 pt-0">
          <v-card-text class="pt-2">Số điện thoại</v-card-text>
        </v-col>
        <v-col cols="9" class="pb-0 pt-0">
          <v-text-field
            v-model="phone"
            placeholder="Nhập SĐT"
            background-color="grey lighten-5"
            dense
            solo
            flat
            readonly
          ></v-text-field>
        </v-col>
        <v-col cols="2" class="pb-0 pt-0 pr-0">
          <v-card-text class="pt-2 pr-0"
            >Chức danh công việc <span class="error--text">*</span></v-card-text
          >
        </v-col>
        <v-col cols="9" class="pb-0 pt-0">
          <v-text-field
            v-model="positionJob"
            placeholder="Nhập chức danh công việc"
            background-color="grey lighten-5"
            dense
            solo
            flat
            readonly
          ></v-text-field>
        </v-col>
        <v-col cols="2" class="pb-0 pt-0">
          <v-card-text class="pt-2"
            >Trạng thái <span class="error--text">*</span></v-card-text
          >
        </v-col>
        <v-col cols="9" class="pb-0 pt-0">
          <v-select
            v-model="status"
            background-color="grey lighten-5"
            dense
            solo
            flat
            :items="listStatus"
            readonly
          >
            <template v-slot:selection="statusdata">
              <div :style="`color: ${statusdata.item.color}`">
                {{ statusdata.item.text }}
              </div>
            </template></v-select
          >
        </v-col>
        <v-col cols="2" class="pb-0 pt-0">
          <v-card-text class="pt-2">Ghi chú</v-card-text>
        </v-col>
        <v-col cols="9" class="pb-0 pt-0">
          <v-textarea
            v-model="note"
            background-color="grey lighten-5"
            dense
            solo
            flat
            hide-details
            readonly
          ></v-textarea>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import SelectFile from '~/components/Selected/File'
export default {
  components: { SelectFile },
  props: {
    data: {
      type: Object,
      default: null,
    },
  },
  data: () => ({
    file_img: '',
    avatar: '',
    required_img: false,
    name: '',
    email: '',
    phone: '',
    positionJob: '',
    note: '',
    status: 1,
    listStatus: [
      { value: 1, text: 'Đang hoạt động', color: '#17e555' },
      { value: 2, text: 'Dừng hoạt động', color: '#ff0f59' },
    ],
  }),
  watch: {
    data(value) {
      this.avatar = this.data.avatar
      this.name = this.data.name
      this.email = this.data.email
      this.note = this.data.note
      this.positionJob = this.data.position
      this.phone = this.data.phone
      this.status = this.data.status
      this.$refs.input_file_img_taikhoan.set_img(this.data.avatar)
    },
  },
  methods: {
    file_selected(file) {
      this.file_img = file
    },
  },
}
</script>
