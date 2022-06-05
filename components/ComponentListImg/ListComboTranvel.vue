<template>
  <div>
    <v-card
      outlined
      height="150px"
      style="overflow-y: auto"
      class="d-flex align-center"
    >
      <div v-if="images.length === 0" class="d-flex justify-center">
        <div class="ml-2" style="cursor: pointer" @click="select_file">
          <select-file></select-file>
        </div>
        <template v-for="(item, index) in maxrequied - 2">
          <div :key="`${index}-${item}`" class="ml-2">
            <no-file></no-file>
          </div>
        </template>
        <div class="ml-2">
          <no-seen></no-seen>
        </div>
      </div>

      <draggable v-else class="d-flex justify-center" @change="move_file">
        <div
          v-if="images.length < maxrequied"
          class="ml-2"
          style="cursor: pointer"
          @click="select_add_file"
        >
          <select-file></select-file>
        </div>

        <template v-for="(image, idx) in images">
          <div :key="`${idx}+${image}`">
            <v-img :src="image.img" class="ml-2" height="120" width="120">
            </v-img>
            <div class="ml-2 d-flex" style="position: absolute; top: 12px">
              <v-icon size="22" style="cursor: move" color="secondary"
                >mdi-cursor-move</v-icon
              >
              <v-icon
                style="cursor: pointer"
                color="primary"
                class="ml-6"
                @click="select_file_update(image, idx)"
                >mdi-pencil-circle</v-icon
              >
              <v-icon
                style="cursor: pointer"
                color="error"
                class="ml-6"
                @click="delete_img(idx)"
                >mdi-close-circle</v-icon
              >
            </div>
            <v-file-input
              :id="`${id}-${image.id}`"
              class="d-none"
              accept="image/png, image/jpeg, image/bmp"
              @change="selected_file"
            ></v-file-input>
          </div>
        </template>

        <!-- <div
          v-if="images.length < maxrequied"
          class="ml-2"
          style="cursor: pointer"
          @click="select_add_file"
        >
          <select-file></select-file>
        </div> -->
      </draggable>
    </v-card>

    <div class="v-messages theme--light error--text mt-1 ml-2" role="alert">
      <div class="v-messages__wrapper">
        <div class="v-messages__message">{{ errormsg }}</div>
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

    <v-file-input
      :id="`${id}+add+file`"
      class="d-none"
      accept="image/png, image/jpeg, image/bmp"
      multiple
      @change="add_file"
    ></v-file-input>
  </div>
</template>

<script>
import Draggable from 'vuedraggable'
import NoFile from '~/components/icon/NoFile'
import SelectFile from '~/components/icon/SelectFile'
import NoSeen from '~/components/icon/NoSeen'

export default {
  components: {
    Draggable,
    NoFile,
    SelectFile,
    NoSeen,
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
    images: {
      type: Array,
      default: Array,
    },
    errormsg: {
      type: String,
      default: '',
    },
  },
  data: () => ({
    reset_file: [],
    stt: -1,
  }),
  methods: {
    select_file() {
      // return window.document.getElementById(this.id).click()
      // this.$router.push('/quan-tri-trang-chu/add-combo-du-lich')
    },
    inputFile(files) {
      this.reset_file = []
      this.images = []
      if ((files || []).length > this.maxrequied) {
        this.errormsg = `Vui lòng chọn tối đa ${this.maxrequied} ảnh`
        this.$emit('set_file', [])
      } else {
        this.reset_file = files

        if ((files || []).length !== 0) {
          const arr = []
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
        this.errormsg = ''
      }
    },
    select_add_file() {
      return window.document.getElementById(`${this.id}+add+file`).click()
    },
    move_file(event) {
      const arr = [...this.images]
      arr[event.moved.oldIndex] = arr[event.moved.newIndex]
      arr[event.moved.newIndex] = event.moved.element
      this.images = [...arr]
      this.$emit('set_file', this.images)
    },
    selected_file(file) {
      if ((file || []).length !== 0) {
        const arr = [...this.images]

        arr[this.stt] = {
          id: arr[this.stt].id,
          img: URL.createObjectURL(file),
          file,
        }

        this.images = [...arr]
        this.$emit('set_file', this.images)
      }
    },
    select_file_update(item, index) {
      this.stt = index
      return window.document.getElementById(`${this.id}-${item.id}`).click()
    },
    delete_img(index) {
      this.images.splice(index, 1)
      this.$emit('set_file', this.images)
    },
    add_file(files) {
      const array = []
      if ((files || []).length !== 0) {
        for (let i = 0; i < files.length; i++) {
          array.push({
            id: i + 1,
            img: URL.createObjectURL(files[i]),
            file: files[i],
          })
        }
      }

      let arr = [...this.images]

      if (arr.length + array.length <= this.maxrequied) {
        arr = [...arr, ...array]
        this.images = [...arr]
        this.$emit('set_file', this.images)
        this.errormsg = ''
      } else {
        this.errormsg = `Vui lòng chọn tối đa ${this.maxrequied} ảnh`
      }
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
  background: #c4c4c4 !important;
  border-radius: 10px !important;
}
</style>
