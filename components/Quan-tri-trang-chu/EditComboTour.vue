<template>
  <div class="main_edit_combo">
    <div
      class="pt-2 mt-n2"
      style="
        position: fixed;
        display: flex;
        z-index: 3;
        right: 12px;
        padding-bottom: 20px;
        bottom: 0;
        width: 100%;
        background-color: #f5f7fe;
      "
    >
      <v-spacer></v-spacer>

      <v-btn
        class="text-none ml-2 mr-5 white--text"
        large
        depressed
        color="#FF0F59"
        width="105px"
        @click="open_cancel = true"
      >
        Hủy</v-btn
      >
      <v-btn
        class="text-none mr-2 white--text"
        large
        depressed
        color="#47BBFF"
        width="105px"
        @click="open_edit = true"
        >Lưu</v-btn
      >
    </div>
    <div class="pb-12">
      <v-row justify="center">
        <v-col cols="9" class="pa-0">
          <v-container>
            <v-row>
              <v-col cols="12" class="pb-0">
                <div class="font-weight-bold fs-16">
                  Tiêu đề <span class="red--text pl-1">*</span>
                </div>
                <v-text-field
                  v-model="page_title"
                  :error-messages="page_title_error"
                  solo
                  flat
                  dense
                  class="border-1 fs-14"
                  placeholder="Nhập tiêu đề"
                  @input="page_title_error = []"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" class="pb-0">
                <div class="font-weight-bold fs-16">Link liên kết</div>
                <v-text-field
                  v-model="link"
                  :error-messages="link_error"
                  class="border-1 fs-14"
                  solo
                  flat
                  dense
                  hide-detail
                  placeholder="Nhập link liên kết Combo du lịch"
                  @input="link_error = []"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" class="pt-0">
                <div class="font-weight-bold fs-16">
                  Upload ảnh thu nhỏ <span class="red--text pl-1">*</span>
                </div>
                <v-row>
                  <v-col cols="12" class="pt-2">
                    <select-file
                      id="input_file_img_edit_combo"
                      ref="input_file_img_edit_combo"
                      :required="required_img"
                      @set_file="file_selected"
                    ></select-file>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" class="pt-0">
                <div class="font-weight-bold fs-16">Mô tả combo du lịch</div>
                <v-textarea
                  v-model="Description_combo"
                  class="border-1 fs-14"
                  hide-details
                  flat
                  solo
                  placeholder="Mô tả sẽ hiển thị khi người dùng hover vào hình ảnh Combo du lịch."
                ></v-textarea>
                <div class="d-flex pt-4">
                  <div class="font-weight-bold fs-16 pt-1 pr-7">
                    Hiển thị/Ẩn
                  </div>

                  <v-switch
                    v-model="status_edit_combo"
                    inset
                    class="ma-0"
                    color="#47bbff"
                    :false-value="0"
                    :true-value="1"
                  ></v-switch>
                </div>
              </v-col>
            </v-row>
          </v-container>
        </v-col>
      </v-row>
    </div>
    <yes-no-alert
      :open="open_cancel"
      alert-msg="Bạn có chắc chắn muốn thoát?"
      @toggle="open_cancel = !open_cancel"
      @OK="set_cancel"
    >
    </yes-no-alert>
    <yes-no-alert
      :open="open_edit"
      alert-msg="Bạn có chắc chắn muốn cập nhật combo du lịch?"
      @toggle="open_edit = !open_edit"
      @OK="set_edit"
    >
    </yes-no-alert>
  </div>
</template>

<script>
import Folder from '~/assets/configurations/Folder_Config'
import SelectFile from '~/components/Selected/File'
export default {
  components: {
    SelectFile,
  },
  props: {
    data: {
      type: Object,
      default: Object,
    },
    open: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      open_cancel: false,
      open_edit: false,
      required_img: false,
      file_img: '',
      link: null,
      link_error: [],
      page_title: null,
      page_title_error: [],
      Description_combo: null,
      status_edit_combo: null,
    }
  },
  watch: {
    open(value) {
      if (value === 4) {
        this.$store.commit('app/checkBack', true)
        this.page_title = this.data.tilte
        this.link = this.data.link
        this.status_edit_combo = this.data.status
        this.Description_combo = this.data.description
        this.page_title_error = []
        if (!this.$isNullOrEmpty(this.data.image)) {
          this.$refs.input_file_img_edit_combo.set_img(this.data.image)
        }
      }
    },
  },
  // mounted() {
  //   // console.log(this.data, '123')
  //   this.page_title = this.data.tilte
  //   this.link = this.data.link
  //   this.Description_combo = this.data.description
  //   if (!this.$isNullOrEmpty(this.data.image)) {
  //     this.$refs.input_file_img_edit_combo.set_img(this.data.image)
  //   }
  //   this.status_edit_combo = this.data.status
  // },
  methods: {
    file_selected(file) {
      this.file_img = file
      this.required_img = false
    },
    upload_file() {
      if (!this.$isNullOrEmpty(this.file_img)) {
        const formData = new FormData()
        formData.append('file', this.file_img)
        const folder = Folder.combo_lu_lich
        const data = { formData, folder }
        this.$store
          .dispatch('uploadImg/uploadFile', data)
          .then((response) => {
            if (!response.error) {
              this.update_combo(response.data.data.image_url)
            } else {
              this.$showError(this, 'Cập nhật combo du lịch thất bại')
              // this.$emit('exit')
              // this.$store.commit('app/setTitle', 'TRANG CHỦ')
            }
          })
          .catch((e) => {
            this.$log.debug(e)
          })
      } else {
        this.update_combo(this.data.image)
      }
    },
    update_combo(avatar) {
      this.$store
        .dispatch('quan_tri_trang_chu/update_combo', {
          homeId: this.$store.state.quan_tri_trang_chu.page_is_id.home_id,
          comboId: this.data.id,
          tilte: this.page_title,
          link: this.link,
          description: this.Description_combo,
          status: this.status_edit_combo,
          image: avatar,
        })
        .then((response) => {
          if (!response.error) {
            this.$emit('edit', {
              image: avatar,
              id: this.data.id,
              tilte: this.page_title,
              link: this.link,
              description: this.Description_combo,
              status: this.status_edit_combo,
            })
            this.$showSuccess(
              this.$router.app,
              'Cập nhật combo du lịch thành công'
            )
          }
          this.$emit('exit')
          this.$store.commit(
            'app/setTitle',
            `${this.$store.state.quan_tri_trang_chu.page_is_id.page_tilte}`
          )
        })
    },

    set_edit() {
      let hasErrors = false
      let count = 0
      if (!this.$isNullOrEmpty(this.link)) {
        if (this.$isHasVietnamese(this.link) || /\s/g.test(this.link)) {
          hasErrors = true
          this.link_error = ['Không đúng định dạng link website']
          count += 1
        }
      }
      if ((this.page_title || []).length === 0) {
        hasErrors = true
        this.page_title_error = ['Không được để trống']
        count += 1
      } else if (this.page_title.length > 200) {
        hasErrors = true
        this.page_title_error = ['Nhập không quá 200 kí tự cho phép']
        count += 1
      } // oke
      if (count > 0) {
        this.$showWarnNotify(this, 'Bạn nhập thiếu thông tin bắt buộc')
      }
      if (!hasErrors) {
        this.upload_file()
      }
    },

    set_cancel() {
      this.$emit('exit')
      this.$store.commit(
        'app/setTitle',
        `${this.$store.state.quan_tri_trang_chu.page_is_id.page_tilte}`
      )
      this.page_title_error = []
    },
  },
  // head() {
  //   this.$store.commit('app/setTitle', 'Sửa combo du lịch')
  //   return {
  //     title: 'Sàn du lịch',
  //   }
  // },
}
</script>
