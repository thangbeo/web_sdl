<template>
  <v-dialog :value="open" :max-width="max_width" @click:outside="toggle">
    <v-card>
      <v-card-title class="pt-3 pb-1">
        <div class="font-weight-bold">{{ dialogName }}</div>
        <div class="flex-grow-1"></div>
        <div v-if="isReset" class="d-flex align-center">
          <v-btn depressed icon color="primary" @click="reset">
            <v-icon size="20"> mdi-autorenew</v-icon>
          </v-btn>
          <div class="primary--text cp fs-15" @click="reset">Xóa bộ lọc</div>
        </div>
      </v-card-title>
      <v-card-text>
        <slot></slot>
      </v-card-text>
      <v-card-actions>
        <div class="flex-grow-1"></div>
        <v-btn
          depressed
          color="#FF0F59"
          height="30"
          class="fs-13 text-none white--text"
          @click="toggle"
        >
          {{ textCancel }}
        </v-btn>
        <v-btn
          depressed
          color="#47BBFF"
          height="30"
          class="fs-13 text-none white--text"
          @click="actionsUser"
        >
          {{ textSave }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'Dialog',
  props: {
    dialogName: {
      type: String,
      required: true,
    },
    open: {
      type: Boolean,
      required: true,
    },
    // eslint-disable-next-line vue/prop-name-casing
    max_width: {
      type: [String, Number],
      default: 800,
    },
    textSave: {
      type: String,
      default: 'Lưu',
    },
    textCancel: {
      type: String,
      default: 'Hủy',
    },
    isReset: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    toggle() {
      this.$emit('toggle')
    },
    actionsUser() {
      this.$emit('actionsUser')
    },
    reset() {
      this.$emit('reset')
    },
  },
}
</script>
