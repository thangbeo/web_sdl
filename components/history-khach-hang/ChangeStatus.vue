<template>
  <div>
    <v-dialog
      :value="open"
      max-width="600px"
      @keydown="$event.key === 'Escape' && toggle()"
      @click:outside="toggle"
    >
      <v-card>
        <v-card-title
          class="d-flex justify-center"
          style="color: #000; background-color: #e5e5e5"
        >
          Thay đổi trạng thái
          <v-btn
            v-ripple
            color="secondary"
            icon
            class="position-absolute-top-right"
            @click="toggle"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="4" class="pb-0">
              <v-card-text style="color: #000" class="font-weight-bold"
                >Lý do <span class="error--text">*</span></v-card-text
              >
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" class="py-0">
              <v-textarea
                outlined
                dense
                :error-messages="status_msg"
                @input="status_msg = []"
              ></v-textarea>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" class="py-0" style="text-align: center">
              <v-btn class="text-none mr-4 info" depressed @click="OK">
                Xác Nhận
              </v-btn>
              <v-btn
                color="error"
                class="text-none white--text"
                depressed
                @click="toggle"
              >
                Hủy
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider></v-divider>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  props: {
    open: {
      type: Boolean,
      required: true,
    },
    confirm: {
      type: String,
      default: 'Có',
    },
    close: {
      type: String,
      default: 'Không',
    },
  },
  data: () => ({
    status: null,
    status_msg: [],
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
    open(value) {
      if (!value) {
        this.status = null
        this.status_msg = []
      }
    },
  },
  methods: {
    clearSelected() {
      this.selected = null
    },
    toggle() {
      this.$emit('toggle')
    },
    OK() {
      let hasErrors = false

      if (this.$isNullOrEmpty(this.status)) {
        hasErrors = true
        this.status_msg = 'Không được để trống'
      }
      if (!hasErrors) {
        this.$emit('OK', this.status)
      }
    },
  },
}
</script>
