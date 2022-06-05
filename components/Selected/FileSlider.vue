<template>
  <div>
    <v-card
      outlined
      height="140"
      style="overflow-y: auto; background-color: #f5f7fe"
      class="d-flex align-center"
    >
      <div
        v-if="images.length < maxrequied"
        class="d-flex justify-center"
        style="margin-top: 6px"
      >
        <div class="ml-2" style="cursor: pointer" @click="select_file">
          <select-file></select-file>
        </div>
      </div>
      <slot></slot>
      <draggable
        v-if="add"
        :list="slider_id"
        class="d-flex justify-center"
        @change="move_file"
      >
        <template v-for="(image, idx) in slider_id">
          <div :key="`${idx}+${image}`">
            <v-img
              :src="image.image"
              style="cursor: move"
              class="ml-2"
              height="120"
              width="120"
            >
            </v-img>
            <v-icon
              style="
                cursor: pointer;
                position: absolute;
                top: 10px;
                margin-left: 108px;
              "
              size="20"
              color="error"
              @click="delete_img(idx)"
            >
              mdi-close-circle
            </v-icon>
          </div>
        </template>
      </draggable>
    </v-card>

    <div class="v-messages theme--light error--text mt-1 ml-2" role="alert">
      <div class="v-messages__wrapper">
        <div class="v-messages__message">{{ errormsg }} {{ error_msg }}</div>
      </div>
    </div>
    <v-file-input
      :id="id"
      :value="reset_file"
      multiple
      accept="image/png, image/jpeg, image/bmp"
      class="d-none"
      @change="inputFile"
    ></v-file-input>
  </div>
</template>

<script>
import Draggable from 'vuedraggable'
import SelectFile from '~/components/icon/SelectFile'
import Folder from '~/assets/configurations/Folder_Config'
export default {
  components: {
    Draggable,
    SelectFile,
  },

  props: {
    id: {
      type: String,
      required: true,
    },
    maxrequied: {
      type: Number,
      default: 10,
    },
    errormsg: {
      type: String,
      default: '',
    },
    add: {
      type: Boolean,
      default: true,
    },
  },
  data: () => ({
    reset_file: [],
    slider_id: [],
    images: [],
    stt: -1,
    error_msg: '',
    is_slider_id: null,
  }),
  // created() {
  //   console.log(this.all_item, '1213123')
  // },
  methods: {
    // upload_file() {
    //   const formData = new FormData()
    //   for (let i = 0; i < this.images.length; i++) {
    //     formData.append('file', this.images)
    //   }
    //   const folder = Folder.quan_tri_trang_chu
    //   const data = { formData, folder }
    //   this.$store
    //     .dispatch('uploadImg/uploadFile', data)
    //     .then((response) => {
    //       if (!response.error) {
    //         this.insert_slider(response.data.data.image_url)
    //       }
    //     })
    //     .catch((e) => {
    //       this.$log.debug(e)
    //     })
    // },
    insert_slider(slider) {
      this.$store
        .dispatch('quan_tri_trang_chu/insert_slider', {
          homeId: 1,
          image: slider,
        })
        .then((response) => {
          if (!response.error) {
            for (let i = 0; i < response.data.data.length; i++) {
              this.slider_id.push(response.data.data[i])
            }
            this.$emit('slider', {
              all_item: this.slider_id,
            })
          }
        })
    },
    select_file() {
      return window.document.getElementById(this.id).click()
    },
    inputFile(files) {
      let hasErrors = false
      if ((files || []).length === 0) {
        hasErrors = true
        this.error_msg = 'Không được để trống'
      }
      if ((files || []).length !== 0) {
        for (let i = 0; i < files.length; i++) {
          if (files[i].size > 3145728) {
            hasErrors = true
            this.error_msg = 'File được chọn không được vượt quá 3MB'
          }
        }
      }
      if (!hasErrors) {
        const formData = new FormData()
        for (let i = 0; i < files.length; i++) {
          formData.append('file', files[i])
        }
        const folder = Folder.quan_tri_trang_chu
        const data = { formData, folder }
        this.$store
          .dispatch('uploadImg/uploadFile', data)
          .then((response) => {
            if (!response.error) {
              this.insert_slider(response.data.data.image_url)
            }
          })
          .catch((e) => {
            this.$log.debug(e)
          })

        this.reset_file = []
      }

      // if ((files || []).length + this.slider_id.length > this.maxrequied) {
      //   this.error_msg = `Vui lòng chọn tối đa ${this.maxrequied} ảnh`
      //   this.$emit('slider', this.slider_id)
      // } else {
      //   this.reset_file = files
      //   this.$emit('slider', this.slider_id)
      //   this.error_msg = ''
      // }
    },
    move_file(event) {
      for (let i = 0; i < this.slider_id.length; i++) {
        if (this.slider_id[i].id === event.moved.id) {
          this.slider_id[i] = event
        }
      }
    },
    delete_img(index) {
      this.slider_id.splice(index, 1)
      this.reset_file = []
    },
    set_img(arr) {
      this.slider_id = [...arr]
    },
    reset() {
      this.reset_file = []
      this.slider_id = []
      this.stt = -1
      this.error_msg = ''
    },
  },
}
</script>

<style lang="scss" scoped>
::-webkit-scrollbar {
  width: 6px !important;
  height: 6px !important;
}
::-webkit-scrollbar-thumb {
  background: #82b1ff !important;
  border-radius: 10px !important;
}

.theme--light.v-sheet--outlined {
  border: none !important;
}
</style>
