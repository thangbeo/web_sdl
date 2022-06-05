<template>
  <div class="d-flex align-center">
    <div
      v-if="(img || []).length === 0"
      style="cursor: pointer; display: contents"
      @click="select_file"
    >
      <v-row>
        <v-col cols="11" class="pt-0">
          <v-text-field
            id="input_file"
            hide-details
            solo
            dense
            class="border-1 fs-14"
            flat
            prepend-icon
            readonly
            placeholder="Chưa có tệp nào được chọn"
          >
          </v-text-field>
          <div
            v-if="required"
            class="v-messages theme--light error--text"
            role="alert"
          >
            <div class="v-messages__wrapper">
              <div class="v-messages__message pt-1">Không được để trống</div>
            </div>
          </div>
        </v-col>
        <v-col cols="1" class="pl-0 pt-0 ml-n14"
          ><v-btn
            large
            depressed
            color="#525252"
            class="text-none body-2 white--text border-1"
            width="111px"
            height="38px"
            >Chọn tệp</v-btn
          ></v-col
        >
        <div class="v-messages theme--light error--text mt-1 ml-5" role="alert">
          <div class="v-messages__wrapper">
            <div class="v-messages__message">{{ limited_msg }}</div>
          </div>
        </div>
      </v-row>
    </div>
    <div v-else>
      <!-- style="position: relative" -->
      <v-img
        class="rounded"
        :src="img"
        width="120"
        height="120"
        @click="select_file"
      >
      </v-img>
      <!-- <div class="d-flex" style="position: absolute; top: 0">
        <v-icon color="primary" @click="select_file">mdi-pencil-circle</v-icon>
        <v-icon color="error" style="margin-left: 70px" @click="delete_img"
          >mdi-close-circle</v-icon
        >
      </div> -->
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
    <v-file-input
      :id="id"
      accept="image/png, image/jpeg, image/gif"
      class="d-none"
      :value="reset_file"
      @change="inputFile($event)"
    ></v-file-input>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    id: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: '',
    },
    hidden: {
      type: Boolean,
      default: false,
    },
    required: {
      type: Boolean,
      default: false,
    },
    fixed: {
      type: Boolean,
      default: true,
    },
  },
  data: () => ({
    reset_file: null,
    img: '',
    limited_msg: '',
  }),
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

        if ((file.size || 0) > 3145728) {
          hasErrors = true
          this.limited_msg = 'File được chọn không được vượt quá 3MB'
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
    set_img() {
      this.img = this.image
    },
  },
}
</script>
