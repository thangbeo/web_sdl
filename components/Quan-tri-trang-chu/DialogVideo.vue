<template>
  <!-- 
  Cách dùng:
  - prop 'open' là giá trị đóng mở dialog (Boolean)
  - prop 'alertMsg' dùng để hiển thị câu hỏi của dialog (Number/String)
  - Event 'toggle' dùng để đóng hoặc mở dialog
  - Khi bấm OK sẽ emit event 'OK' và event 'toggle'
  - Khi bấm 'Hủy' sẽ emit event toggle
  -->
  <div>
    <v-overlay
      :value="open"
      max-width="800px"
      :persistent="persistent"
      content-class="elevation-4"
      overlay-color="#306CFF"
      overlay-opacity="0.2"
      @keydown="$event.key === 'Escape' && !persistent && toggle()"
      @click:outside="!persistent && toggle()"
    >
      <!--    content-class="elevation-4"
      overlay-color="#306CFF"
      overlay-opacity="0.2" -->

      <v-card min-height="240px" class="white h-100">
        <div align="end">
          <v-btn small icon color="black" @click="toggle">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
        <v-card-text class="pt-3 px-10 pb-10 min-h-240px d-flex align-center">
          <video
            id="videoElement"
            controls
            autoplay
            width="700"
            @pause="updatePaused"
          >
            <source :src="url_img" type="video/mp4" />
          </video>
        </v-card-text>
      </v-card>
    </v-overlay>
  </div>
</template>
<script>
export default {
  props: {
    open: {
      type: Boolean,
      required: true,
    },
    data: {
      type: String,
      required: true,
    },
    persistent: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      url_img: '',
      videoElement: null,
      paused: null,
      isSeeking: false,
      seekStart: 0,
    }
  },

  computed: {
    playing() {
      return !this.paused
    },
  },
  watch: {
    data(value) {
      this.url_img = value
    },
  },
  created() {
    this.url_img = this.data
  },
  mounted() {
    this.url_img = this.data
  },
  methods: {
    updatePaused(event) {
      this.videoElement = event.target
      // this.videoElement.currentTime = event
    },

    toggle() {
      this.$emit('toggle')
    },
    OK() {
      this.$emit('OK')
      this.$emit('toggle')
    },
  },
}
</script>
<style lang="scss" scoped>
.min-h-240px {
  min-height: 240px !important;

  .custom-center-tag {
    text-align: center;
  }
}
</style>
