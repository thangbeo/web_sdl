<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="width"
    :height="height"
    viewBox="0 0 16 16"
  >
    <g
      id="Group_4811"
      data-name="Group 4811"
      transform="translate(14933 -3507)"
    >
      <g
        id="Group_4810"
        data-name="Group 4810"
        transform="translate(-15372 3351)"
      >
        <g
          id="Ellipse_101"
          data-name="Ellipse 101"
          transform="translate(439 156)"
          fill="#fff"
          :stroke="`${disabled ? '#CFD8DC' : '#ff0f59'}`"
          stroke-width="1.5"
        >
          <circle cx="8" cy="8" r="8" stroke="none" />
          <circle cx="8" cy="8" r="7.25" fill="none" />
        </g>
        <g
          id="Group_4783"
          data-name="Group 4783"
          transform="translate(247.079 -267.093) rotate(45)"
        >
          <path
            id="Path_13081"
            data-name="Path 13081"
            d="M-10861,4477.95v5.926"
            transform="translate(11307.463 -4317.45)"
            fill="none"
            :stroke="`${disabled ? '#CFD8DC' : '#ff0f59'}`"
            stroke-width="1.5"
          />
          <path
            id="Path_13082"
            data-name="Path 13082"
            d="M0,0V5.926"
            transform="translate(449.426 163.463) rotate(90)"
            fill="none"
            :stroke="`${disabled ? '#CFD8DC' : '#ff0f59'}`"
            stroke-width="1.5"
          />
        </g>
      </g>
    </g>
  </svg>
</template>

<script>
export default {
  props: {
    width: {
      type: String,
      default: '16',
    },
    height: {
      type: String,
      default: '16',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
