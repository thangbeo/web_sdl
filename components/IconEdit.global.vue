<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="width"
    :height="height"
    viewBox="0 0 16.46 16.304"
  >
    <path
      id="Path_13069"
      data-name="Path 13069"
      d="M122.831.98a2.454,2.454,0,0,0-3.471,0l-9.73,9.73a.545.545,0,0,0-.14.24l-1.28,4.62a.545.545,0,0,0,.671.671l4.62-1.28a.545.545,0,0,0,.24-.14l9.73-9.731a2.457,2.457,0,0,0,0-3.471ZM110.818,11.065,118.782,3.1l2.568,2.568-7.964,7.964Zm-.513,1.029,2.052,2.052-2.838.786ZM122.7,4.319l-.578.578-2.569-2.569.579-.578a1.363,1.363,0,0,1,1.928,0l.64.64A1.365,1.365,0,0,1,122.7,4.319Zm0,0"
      transform="translate(-108.036 -0.111)"
      :fill="`${disabled ? '#CFD8DC' : '#3f69b8'}`"
      :stroke="`${disabled ? '#CFD8DC' : '#3f69b8'}`"
      stroke-width="0.3"
    />
  </svg>
</template>

<script>
export default {
  props: {
    width: {
      type: String,
      default: '16.46',
    },
    height: {
      type: String,
      default: '16.304',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
