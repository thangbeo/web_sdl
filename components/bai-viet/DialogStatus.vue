<template>
  <div>
    <v-dialog
      :value="open"
      max-width="700px"
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
          <div class="fs-16 font-weight-bold mt-10" align="center">
            Các cấu hình đã lưu sẽ bị mất nếu thay đổi Mẫu bài viết
          </div>
          <div class="fs-16 font-weight-bold mt-1 mb-10" align="center">
            Bạn có chắc chắn muốn thay đổi Mẫu bài viết?
          </div>
          <v-row>
            <v-col cols="12" class="py-0" style="text-align: center">
              <v-btn
                class="text-none mr-4 info"
                width="90"
                depressed
                @click="OK"
              >
                Xác Nhận
              </v-btn>
              <v-btn
                color="error"
                class="text-none white--text"
                depressed
                width="90"
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
  },
  data: () => ({}),
  form_status: [
    {
      value: 1,
      text: 'mặc định',
      status: 1,
    },
    {
      value: 2,
      text: 'khuyến mại',
      status: 2,
    },
  ],
  methods: {
    toggle() {
      this.$emit('toggle')
    },
    OK() {
      this.$emit('OK', this.status)
    },
  },
}
</script>
