<template>
  <div class="main_conbo">
    <div
      class="py-2 mt-n2"
      style="
        position: fixed;
        display: flex;
        z-index: 3;
        right: 12px;
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
        @click="open_add = true"
        >Thêm</v-btn
      >
    </div>
    <div class="pb-12">
      <v-row justify="center">
        <v-col cols="9" class="pa-0">
          <v-container>
            <v-row>
              <v-col cols="12" class="pb-0">
                <div class="font-weight-bold fs-16">
                  Tiêu đề<span class="red--text pl-1">*</span>
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
                  <v-col cols="12" class="pb-0 pt-2">
                    <file-img
                      id="selected_files_combo"
                      ref="selected_files_combo"
                      :hidden="true"
                      :required="required_img"
                      @set_file="file_selected"
                    ></file-img
                  ></v-col>
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
                <div class="pt-4 d-flex">
                  <div class="font-weight-bold fs-16 pt-1 pr-7">
                    Hiển thị/Ẩn
                  </div>
                  <v-switch
                    v-model="status_combo"
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
      :open="open_add"
      alert-msg="Bạn có chắc chắn muốn thêm combo du lịch?"
      @toggle="open_add = !open_add"
      @OK="set_add"
    >
    </yes-no-alert>
  </div>
</template>

<script>
import Folder from '~/assets/configurations/Folder_Config'
import FileImg from '~/components/ComponentListImg/FileImgCombo'
export default {
  components: {
    FileImg,
  },
  props: {
    open: {
      type: Number,
      required: true,
    },
  },
  // focus() {
  //   console.log('object')
  // },
  data() {
    return {
      link_error: [],
      open_add: false,
      open_cancel: false,
      required_img: false,
      file_img: '',
      link: null,
      status_combo: 1,
      page_title: null,
      page_title_error: [],
      Description_combo: null,
    }
  },
  watch: {
    open(value) {
      if (value === 2) {
        this.set_again()
        this.required_img = false
        this.$store.commit('app/checkBack', true)
      }
    },
  },
  methods: {
    file_selected(file) {
      this.file_img = file
      this.required_img = false
    },
    upload_file() {
      const formData = new FormData()
      formData.append('file', this.file_img)
      const folder = Folder.combo_lu_lich
      const data = { formData, folder }
      this.$store
        .dispatch('uploadImg/uploadFile', data)
        .then((response) => {
          if (!response.error) {
            // this.avatar = response.data.data.image_url
            this.insert_combo(response.data.data.image_url)
          } else {
            this.$showError(this, 'Thêm mới combo du lịch thất bại')
            // this.$store.commit('app/setTitle', 'Sàn du lịch')
          }
        })
        .catch((e) => {
          this.$log.debug(e)
        })
    },

    insert_combo(avatar) {
      this.$store
        .dispatch('quan_tri_trang_chu/insert_combo', {
          homeId: this.$store.state.quan_tri_trang_chu.page_is_id.home_id,
          tilte: this.page_title,
          link: this.link,
          description: this.Description_combo,
          status: this.status_combo,
          image: avatar,
        })
        .then((response) => {
          if (!response.error) {
            this.$emit('add', {
              image: avatar,
              id: response.data.data,
              tilte: this.page_title,
              link: this.link,
              description: this.Description_combo,
              status: this.status_combo,
            })
            this.$showSuccess(this, 'Thêm mới combo du lịch thành công')
          }
          this.$emit('exit')
          this.$store.commit(
            'app/setTitle',
            `${this.$store.state.quan_tri_trang_chu.page_is_id.page_tilte}`
          )
          this.set_again()
        })
    },
    set_again() {
      this.status_combo = 1
      this.page_title = null
      this.page_title_error = []
      this.link = null
      this.Description_combo = null
      this.file_img = ''
      this.$refs.selected_files_combo.reset()
    },
    validate() {
      let hasErrors = false
      let count = 0
      if ((this.file_img || []).length === 0) {
        hasErrors = true
        this.required_img = true
        count += 1
      }
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
    set_add() {
      this.validate()
    },
    set_cancel() {
      this.$emit('exit')
      this.$store.commit(
        'app/setTitle',
        `${this.$store.state.quan_tri_trang_chu.page_is_id.page_tilte}`
      )
      this.set_again()
      this.required_img = false
    },
  },
  // head() {
  //   this.$store.commit('app/setTitle', 'Thêm combo du lịch')
  //   return {
  //     title: 'Sàn du lịch',
  //   }
  // },
}
</script>
