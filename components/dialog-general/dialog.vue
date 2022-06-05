<template>
  <div class="background-dialog">
    <v-dialog
      :value="open"
      :persistent="persistent"
      no-click-animation
      :title="title"
      max-width="700px"
      content-class="elevation-0"
      overlay-color="#306CFF"
      overlay-opacity="0.2"
      :hide-overlay="true"
      @keydown="$event.key === 'Escape' && !persistent && toggle()"
      @click:outside="!persistent && toggle()"
    >
      <v-card min-height="180px" flat class="h-100">
        <v-btn v-if="!persistent" icon min-width="0" @click="toggle"> </v-btn>
        <div
          v-if="!title"
          class="
            min-h-20px
            w-100
            white--text
            text-center
            py-2
            caption
            font-weight-bold
            text-uppercase
            color-grey
          "
        >
          {{ dialogName }}
        </div>
        <v-card-text class="pa-3 min-h-240px d-flex align-center">
          <div class="w-100 custom-center-tag">
            <slot></slot>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  props: {
    dialogName: {
      type: String,
      required: true,
    },
    open: {
      type: Boolean,
      default: false,
    },
    persistent: {
      type: Boolean,
      default: false,
    },
    title: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {}
  },
  methods: {
    toggle() {
      this.$emit('toggle')
    },
  },
}
</script>
<style lang="scss" scoped>
.min-h-240px {
  min-height: 200px !important;

  .custom-center-tag {
    text-align: center;
  }
}
.color-grey {
  background-color: #656565;
}
</style>
