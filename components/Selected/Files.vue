<template>
  <div>
    <v-card
      outlined
      height="150"
      style="overflow-y: auto; background-color: #f5f7fe"
      class="d-flex align-center"
    >
      <div
        v-if="images.length < maxrequied"
        class="d-flex justify-center"
        style="margin-top: 6px"
      >
        <div class="ml-2" style="cursor: pointer" @click="select_file">
          <select-file />
        </div>
      </div>
      <slot />
      <draggable
        v-if="add"
        :list="images"
        class="d-flex justify-center"
        @change="move_file"
      >
        <template v-for="(image, idx) in images">
          <div :key="`${idx}+${image}`">
            <v-img
              :src="image.img"
              style="cursor: move"
              class="ml-2"
              height="120"
              width="120"
            >
            </v-img>
            <v-icon
              v-if="fixed"
              style="
                cursor: pointer;
                position: absolute;
                top: 14px;
                margin-left: 109px;
              "
              size="20"
              color="error"
              @click="confirm_delete(idx)"
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
      accept="image/png, image/jpeg, image/gif"
      class="d-none"
      @change="inputFile"
    />

    <yes-no-alert
      :open="open_delete"
      alert-msg="Bạn chắc chắn muốn xóa không?"
      @toggle="open_delete = !open_delete"
      @OK="delete_img(index)"
    />
  </div>
</template>

<script>
import Draggable from 'vuedraggable'
import SelectFile from '~/components/icon/SelectFile'

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
    initValue: {
      type: Array,
      default: () => [],
    },
    fixed: {
      type: Boolean,
      default: true,
    },
  },
  data: () => ({
    reset_file: [],
    images: [],
    error_msg: '',
    open_delete: false,
    index: -1,
  }),
  created() {
    if (this.initValue) {
      this.images = this.initValue.reduce((acc, cur, idx) => {
        acc.push({
          img: cur,
          file: cur,
          id: idx,
        })
        return acc
      }, [])

      this.$emit('set_file', this.images)
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
    inputFile(files) {
      let hasErrors = false

      if ((files || []).length !== 0) {
        for (let i = 0; i < files.length; i++) {
          if (files[i].size > 3145728) {
            hasErrors = true
            this.error_msg = 'File được chọn không được vượt quá 3MB'
            this.errormsg = ''
          }
        }
      }

      if (!hasErrors) {
        this.reset_file = []
        if ((files || []).length + this.images.length > this.maxrequied) {
          this.error_msg = `Vui lòng chọn tối đa ${this.maxrequied} ảnh`
          this.$emit('set_file', this.images)
        } else {
          this.reset_file = files

          if ((files || []).length !== 0) {
            const arr = [...this.images]
            for (let i = 0; i < files.length; i++) {
              arr.push({
                id: i + 1,
                img: URL.createObjectURL(files[i]),
                file: files[i],
              })
            }
            this.images = [...arr]
          }
          this.$emit('set_file', this.images)
          this.error_msg = ''
        }
      }
    },
    move_file(event) {
      this.$emit('set_file', this.images)
    },
    confirm_delete(idx) {
      this.index = idx
      this.open_delete = true
    },
    delete_img(index) {
      this.images.splice(index, 1)
      this.$emit('set_file', this.images)
      this.reset_file = []
    },
    set_img(arr) {
      this.images = [...arr]
    },
    reset() {
      this.reset_file = []
      this.images = []
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
  background: #ccc !important;
  border-radius: 10px !important;
}

.theme--light.v-sheet--outlined {
  border: none !important;
}
</style>
