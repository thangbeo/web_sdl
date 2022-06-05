<template>
  <div>
    <div class="d-flex align-center">
      <div
        v-if="$isNullOrEmpty(img)"
        style="cursor: pointer; width: fit-content"
        @click="select_file"
      >
        <no-file class="rounded"></no-file>
        <div
          v-if="required"
          class="v-messages theme--light error--text mt-1"
          role="alert"
        >
          <div class="v-messages theme--light error--text mt-1" role="alert">
            <div class="v-messages__wrapper">
              <div class="v-messages__message">không được để trống</div>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <video
          preload="none"
          style="cursor: pointer"
          width="200"
          height="120"
          :src="img"
          @click="open_cancel = true"
        ></video>
      </div>

      <v-btn
        v-if="!hidden"
        class="text-none text-body-2 rounded ml-4"
        color="white"
        height="32"
        style="color: #47bbff"
        depressed
        @click="select_file"
      >
        Chỉnh sửa
      </v-btn>
    </div>

    <div
      v-if="limited_msg.length !== 0"
      class="v-messages theme--light error--text mt-1"
      role="alert"
    >
      <div class="v-messages__wrapper">
        <div class="v-messages__message">{{ limited_msg }}</div>
      </div>
    </div>
    <v-file-input
      :id="id"
      accept="video/mp4,video/x-m4v"
      class="d-none"
      :value="reset_file"
      @change="inputFile($event)"
    ></v-file-input>

    <DialogVideo
      :open="open_cancel"
      :data="img"
      :persistent="true"
      @toggle="open_cancel = !open_cancel"
    >
    </DialogVideo>
  </div>
</template>

<script>
import DialogVideo from '~/components/Quan-tri-trang-chu/DialogVideo'
import NoFile from '~/components/icon/NoFile'

export default {
  components: {
    NoFile,
    DialogVideo,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
    required: {
      type: Boolean,
      default: false,
    },
    hidden: {
      type: Boolean,
      default: false,
    },
    fixed: {
      type: Boolean,
      default: true,
    },
    initValue: {
      type: [String, Object],
      default: '',
    },
  },
  data: () => ({
    reset_file: null,
    img: '',
    limited_msg: '',
    open_cancel: false,
  }),
  created() {
    if (this.initValue) {
      this.img = this.initValue
      this.$emit('set_file', this.img)
    }
  },
  methods: {
    select_file() {
      if (this.fixed) {
        return window.document.getElementById(this.id).click()
      } else {
        return false
      }
    },
    inputFile(file) {
      if (!this.$isNullOrEmpty(file)) {
        this.hidden = false
        let hasErrors = false
        if ((file.size || 0) > 209715200) {
          hasErrors = true
          this.limited_msg = 'File được chọn không được vượt quá 200MB'
        }
        if (!hasErrors) {
          this.limited_msg = ''
          this.reset_file = file
          if ((file || []).length !== 0) {
            this.img = URL.createObjectURL(file)
          }

          this.$emit('set_file', file)
        }
      }
    },
    delete_img() {
      this.reset_file = null
      this.img = ''
      this.$emit('set_file', '')
    },
    reset() {
      this.reset_file = null
      this.img = ''
    },

    set_img(value) {
      this.img = value
    },
  },
}
</script>
