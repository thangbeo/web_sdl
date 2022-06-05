<template>
  <div>
    <v-dialog
      :value="open"
      max-width="641"
      @keydown="$event.key === 'Escape' && toggle()"
      @click:outside="toggle"
    >
      <v-card>
        <v-card-text>
          <div style="min-height: 150px" class="pa-6">
            <p class="fs-16 pt-4 font-weight-bold">
              Cập nhật trạng thái <span class="error--text ml-1">*</span>
            </p>
            <v-select
              v-model="status"
              :items="list_status"
              :error-messages="status_msg"
              placeholder="Chọn trạng thái"
              class="border-1 fs-14"
              solo
              flat
              dense
              @input="status_msg = []"
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
          </div>
        </v-card-text>
        <v-card-actions class="justify-center pt-0 pb-6">
          <v-btn
            min-width="120"
            class="text-none white--text mr-12"
            color="#FF0F59"
            depressed
            height="42"
            @click="OK"
          >
            {{ confirm }}
          </v-btn>

          <v-btn
            min-width="120"
            class="text-none white--text"
            color="primary"
            depressed
            height="42"
            @click="toggle"
          >
            {{ close }}
          </v-btn>
        </v-card-actions>
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
      { value: 0, text: 'Chưa duyệt', color: '#F5972D' },
      { value: 2, text: 'Từ chối với phần bình luận', color: '#FF0F59' },
      { value: 1, text: 'Đã duyệt', color: '#47BBFF' },
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
