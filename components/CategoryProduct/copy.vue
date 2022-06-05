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
              Nhân bản danh mục sản phẩm <span class="error--text ml-1">*</span>
            </p>
            <v-text-field
              v-model="name"
              :error-messages="name_msg"
              placeholder="Nhập tên danh mục sản phẩm"
              class="border-1 fs-14"
              solo
              flat
              dense
              @input="name_msg = []"
            >
            </v-text-field>
          </div>
        </v-card-text>
        <v-card-actions class="justify-center pt-0 pb-6">
          <v-btn
            min-width="120"
            class="text-none white--text mr-12"
            color="primary"
            depressed
            height="42"
            @click="OK"
          >
            {{ confirm }}
          </v-btn>

          <v-btn
            min-width="120"
            class="text-none white--text"
            color="#FF0F59"
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
    name: null,
    name_msg: [],
  }),
  watch: {
    open(value) {
      if (!value) {
        this.name = null
        this.name_msg = []
      }
    },
  },
  methods: {
    toggle() {
      this.$emit('toggle')
    },
    OK() {
      let hasErrors = false

      if ((this.name || '').trim().length === 0) {
        hasErrors = true
        this.name_msg = 'Không được để trống'
      }
      if (!hasErrors) {
        this.$emit('OK', this.name)
      }
    },
  },
}
</script>
