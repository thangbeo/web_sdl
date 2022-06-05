<template>
  <client-only>
    <div>
      <label class="switch">
        <input
          v-if="setup"
          :id="id"
          :disabled="change"
          type="checkbox"
          checked
          @click="clicked"
        />
        <input
          v-else
          :id="id"
          :disabled="change"
          type="checkbox"
          @click="clicked"
        />
        <span class="slider round"></span>
      </label>
    </div>
  </client-only>
</template>

<script>
export default {
  props: {
    setup: {
      type: Boolean,
      default: true,
    },
    id: {
      type: String,
      required: true,
    },
    change: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    clicked() {
      const CHECK_BOX = document.getElementById(this.id)
      this.$emit('clicked', CHECK_BOX.checked)
    },
    set_true() {
      const CHECK_BOX = document.getElementById(this.id)
      CHECK_BOX.checked = true
      this.$emit('clicked', CHECK_BOX.checked)
    },
    set_false() {
      const CHECK_BOX = document.getElementById(this.id)
      CHECK_BOX.checked = false
      this.$emit('clicked', CHECK_BOX.checked)
    },
  },
}
</script>

<style lang="scss" scoped>
.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 28px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.slider::before {
  position: absolute;
  content: '';
  height: 20px;
  width: 20px;
  top: 4px;
  right: 24px;
  background-color: white;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

input:checked + .slider {
  background-color: #47bbff;
}

input:focus + .slider {
  box-shadow: 0 0 1px #47bbff;
}

input:checked + .slider::before {
  -webkit-transform: translateX(20px);
  -ms-transform: translateX(20px);
  transform: translateX(20px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 14px;
}

.slider.round::before {
  border-radius: 14px;
}
</style>
