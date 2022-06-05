<template>
  <Dialog
    :open="open"
    :dialog-name="dialogName"
    max_width="600"
    @toggle="toggle"
    @actionsUser="save"
  >
    <v-row>
      <v-col class="pb-0" cols="12">
        <div class="ml-2">
          <p class="ma-0 fs-14 font-weight-bold">
            Giá trị <span class="error--text ml-1">*</span>
          </p>
          <v-text-field
            v-model="config"
            :error-messages="config_msg"
            placeholder="Nhập giá trị"
            class="border-1"
            solo
            flat
            dense
            @input="config_msg = []"
          >
          </v-text-field>
        </div>
      </v-col>
    </v-row>
  </Dialog>
</template>

<script>
import Dialog from '~/components/Dialog'
export default {
  components: {
    Dialog,
  },
  props: {
    open: {
      type: Boolean,
      required: true,
    },
    data: {
      type: Object,
      required: true,
    },
    dialogName: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    config: '',
    config_msg: [],
  }),
  watch: {
    open(val) {
      if (!val) {
        this.config = ''
        this.config_msg = []
      } else {
        this.config = this.data.name
      }
    },
  },
  methods: {
    toggle() {
      this.$emit('toggle')
    },
    save() {
      let hasErrors = false

      if ((this.config || '').trim().length === 0) {
        hasErrors = true
        this.config_msg = 'Không được để trống'
      }

      if (!hasErrors) {
        this.$emit('edit', this.config)
      }
    },
  },
}
</script>
