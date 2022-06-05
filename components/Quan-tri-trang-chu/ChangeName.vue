<template>
  <div>
    <v-dialog
      :value="open"
      max-width="600"
      @keydown="$event.key === 'Escape' && toggle()"
      @click:outside="toggle"
    >
      <v-card>
        <v-card-text class="pb-0">
          <div style="min-height: 150px" class="px-6 pt-6 pb-0">
            <p class="fs-16 pt-4 font-weight-bold">
              Tên trang <span class="error--text ml-1">*</span>
            </p>
            <v-text-field
              v-model="status"
              :error-messages="status_msg"
              placeholder="Nhập tên trang"
              class="border-1 fs-14"
              solo
              flat
              dense
              @input="status_msg = []"
            >
            </v-text-field>
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
