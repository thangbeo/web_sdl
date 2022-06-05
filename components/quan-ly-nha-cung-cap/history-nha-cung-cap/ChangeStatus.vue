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
                v-model="description"
                outlined
                dense
                :error-messages="status_msg"
                @input="status_msg = []"
              ></v-textarea>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" class="py-0" style="text-align: center">
              <v-btn
                class="text-none mr-4 info"
                depressed
                width="90"
                @click="save"
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
    description: null,
    status_msg: [],
  }),
  methods: {
    toggle() {
      this.$emit('toggle')
    },
    save() {
      let hasErrors = false

      if (this.$isNullOrEmpty(this.description)) {
        hasErrors = true
        this.status_msg = 'Không được để trống'
      }
      if (!hasErrors) {
        this.$emit('toggle')
        this.$emit('OK', this.description)
      }
    },
  },
}
</script>
