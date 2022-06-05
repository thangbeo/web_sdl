<template>
  <div v-if="open" class="popup-full-content">
    <slot></slot>
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
}
</script>

<style lang="scss" scoped>
.popup-full-content {
  background-color: #f5f7fe;
  overflow: auto;
  z-index: 10;
  position: fixed;
  top: 75px;
  right: 0;
  bottom: 0;
  left: 250px;
}
</style>
