<template>
  <div class="main_edit_page">
    <div class="d-flex w-100 actions-coordinates-1">
      <div class="flex-grow-1"></div>
      <v-btn
        class="text-none white--text mr-3"
        color="#47BBFF"
        width="120px"
        dark
        depressed
        @click="open_change = true"
      >
        <img class="mr-1" src="~/assets/icon/copy.png" />
        Nhân bản</v-btn
      >
      <v-btn
        class="text-none white--text mr-3"
        color="#4873C2"
        width="120px"
        dark
        depressed
        @click="open_reset = true"
      >
        <img class="mr-1" src="~/assets/icon/change.png" />
        Đặt lại</v-btn
      >
      <v-btn
        class="text-none white--text mr-3"
        color="#4873C2"
        dark
        depressed
        width="120px"
        @click="save_view"
      >
        <img class="mr-1" src="~/assets/icon/view.svg" />
        Xem trước
      </v-btn>
      <div class="d-flex w-100 actions-coordinates-2">
        <div class="flex-grow-1"></div>
        <v-btn
          color="error"
          class="text-none white--text mr-3"
          depressed
          width="90"
          @click="open_cancel = true"
          >Hủy</v-btn
        >
        <v-btn
          class="text-none white--text mr-3"
          color="#47BBFF"
          dark
          depressed
          width="90"
          @click="open_add = true"
          >Lưu</v-btn
        >
      </div>
    </div>

    <v-container class="ml-6">
      <v-row class="mt-9 mb-12">
        <v-col cols="12" class="py-0">
          <div class="d-flex">
            <div class="fs-16 font-weight-bold mr-10">Hiển thị/ Ẩn</div>
            <v-switch
              v-model="status_general_configuration"
              inset
              class="ma-0"
              color="#47bbff"
              :true-value="1"
              :false-value="0"
            ></v-switch>
          </div>
        </v-col>
        <v-col class="py-0" cols="12">
          <div>
            <p class="ma-0 fs-16 font-weight-bold">
              Tiêu đề <span class="error--text ml-1">*</span>
            </p>
            <v-tabs v-model="tab" background-color="#F5F7FE">
              <v-tab
                v-for="(language, index) in languages"
                :key="`${index}-${language}`"
                class="text-none"
              >
                {{ language.name }}
              </v-tab>
            </v-tabs>
            <v-tabs-items v-model="tab" style="background-color: #f5f7fe">
              <v-tab-item
                v-for="(language, index) in languages"
                :key="`${index}-${language}`"
              >
                <v-col class="pa-0" cols="10">
                  <v-text-field
                    v-model="language.page_title"
                    :error-messages="language.page_title_error"
                    placeholder="Tên danh mục"
                    class="border-1 fs-14"
                    solo
                    flat
                    dense
                    @input="language.page_title_error = []"
                  >
                  </v-text-field>
                </v-col>
              </v-tab-item>
            </v-tabs-items>
          </div>
        </v-col>

        <v-col cols="12" class="pt-0">
          <p class="ma-0 pb-2 fs-16 font-weight-bold">Ảnh bìa</p>
          <select-file
            id="input_image_edit_page"
            ref="input_image_edit_page"
            :required="required_img"
            @set_file="file_selected"
            @delete_file="delete_file"
          ></select-file>
        </v-col>
        <v-col class="py-0" cols="10">
          <p class="ma-0 fs-16 font-weight-bold">URL thân thiện cho SEO</p>

          <v-tabs v-model="tab1" background-color="#F5F7FE">
            <v-tab
              v-for="(language, index) in languages"
              :key="`${index}-${language}`"
              class="text-none"
            >
              {{ language.name }}
            </v-tab>
          </v-tabs>
          <v-tabs-items v-model="tab1" style="background-color: #f5f7fe">
            <v-tab-item
              v-for="(language, index) in languages"
              :key="`${index}-${language}`"
            >
              <div class="d-flex">
                <v-text-field
                  v-model="language.path"
                  :error-messages="language.path_error"
                  class="border-1 rounded-r-0"
                  solo
                  flat
                  dense
                  @input="validate_url(language)"
                >
                  <template v-slot:prepend-inner>
                    {{ $store.state.app.domain_name }}
                  </template>
                </v-text-field>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      class="rounded-l-0"
                      style="height: 38px; width: 38px; min-width: 38px"
                      color="primary"
                      depressed
                      v-bind="attrs"
                      v-on="on"
                      @click="copy_text(`copy-text-${index}`)"
                    >
                      <v-icon> mdi-content-copy </v-icon>
                    </v-btn>
                  </template>
                  <span>Copy</span>
                </v-tooltip>
              </div>
              <div :id="`copy-text-${index}`" class="d-none">
                {{ `${$store.state.app.domain_name}${language.path}` }}
              </div>
            </v-tab-item>
          </v-tabs-items>
        </v-col>
        <v-col cols="11">
          <p class="font-weight-bold fs-16 pb-0">
            Nội dung <span class="pl-1 red--text">*</span>
          </p>
          <v-tabs v-model="tab2" background-color="#F5F7FE">
            <v-tab
              v-for="(language, index) in languages"
              :key="`${index}-${language}`"
              class="text-none"
            >
              {{ language.name }}
            </v-tab>
          </v-tabs>
          <v-tabs-items v-model="tab2" style="background-color: #f5f7fe">
            <v-tab-item
              v-for="(language, index) in languages"
              :key="`${index}-${language}`"
            >
              <v-col class="pa-0" cols="11">
                <vue-editor
                  v-model="language.page_content"
                  use-custom-image-handler
                  :editor-toolbar="customToolbar"
                  @image-added="handleImageAdded"
                  @text-change="language.page_content_error = []"
                ></vue-editor>
                <div class="caption red--text">
                  {{
                    language.page_content_error[
                      language.page_content_error.length - 1
                    ]
                  }}
                </div>
              </v-col>
            </v-tab-item>
          </v-tabs-items>
        </v-col>
      </v-row>
    </v-container>
    <yes-no-alert
      :open="open_reset"
      alert-msg="Bạn có chắc chắn muốn đặt lại trang?"
      @toggle="open_reset = !open_reset"
      @OK="reset_data"
    >
    </yes-no-alert>
    <change-page
      :open="open_change"
      @toggle="open_change = !open_change"
      @OK="page_clone"
    />
    <yes-no-alert
      :open="open_add"
      alert-msg="Bạn có chắc chắn muốn cập nhật trang?"
      @toggle="open_add = !open_add"
      @OK="save"
    >
    </yes-no-alert>
    <yes-no-alert
      :open="open_cancel"
      alert-msg="Bạn có chắc chắn muốn thoát?"
      @toggle="open_cancel = !open_cancel"
      @OK="toggle"
    >
    </yes-no-alert>
  </div>
</template>

<script>
import changePage from '~/components/quan-tri-trang/changePage'
import Folder from '~/assets/configurations/Folder_Config'
import SelectFile from '~/components/quan-tri-trang/File'

export default {
  components: {
    SelectFile,
    changePage,
  },
  props: {
    open: {
      type: Number,
      required: true,
    },
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      customToolbar: [
        // font size
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        // text direction
        [
          {
            size: [
              '6px',
              '8px',
              '10px',
              '12px',
              '14px',
              '16px',
              '18px',
              '20px',
              '24px',
              '30px',
              '32px',
              '36px',
            ],
          },
        ],
        ['bold', 'italic', 'underline', 'strike'],
        // Bold, italic, underline, strikethrough
        ['blockquote', 'code-block'],
        // Reference, code block
        [{ header: 1 }, { header: 2 }],
        // Title, the form of key-value pairs; 1, 2 represents the font size
        [{ list: 'ordered' }, { list: 'bullet' }],
        // list
        [{ script: 'sub' }, { script: 'super' }],
        // superscript and subscript
        [{ indent: '-1' }, { indent: '+1' }],
        // indent
        [{ direction: 'rtl' }],
        // Several levels of title
        [{ color: [] }, { background: [] }],
        // font color, font background color
        [{ font: [] }],
        // font
        [{ align: [] }],
        // alignment
        ['clean'],
        // Clear font style
        ['image', 'video'],
        // Upload pictures, upload videos
      ],
      editorSettings: {
        modules: {
          Size: true,
        },
      },
      tab: null,
      tab1: null,
      tab2: null,
      open_change: false,
      open_cancel: false,
      open_reset: false,
      open_add: false,
      path: null,
      required_img: false,
      status_general_configuration: 1,
      reset_file: null,
      file_img: '',
      image_url: '',
      file_img_view: '',

      page_title: null,
      page_content: null,
      page_content_error: [],

      path_error: [],
      page_title_error: [],
      check_required: 0,
      languages: [],

      listPost: [],
    }
  },
  watch: {
    open(value) {
      if (value === 3) {
        this.$store.commit('app/checkBack', true)
        this.set_again()
      }
    },
  },
  methods: {
    copy_text(elementId) {
      // Create a "hidden" input
      const aux = document.createElement('input')

      // Assign it the value of the specified element
      const str = document.getElementById(elementId).innerHTML
      aux.setAttribute('value', (str || '').trim())

      // Append it to the body
      document.body.appendChild(aux)

      // Highlight its content
      aux.select()

      // Copy the highlighted text
      document.execCommand('copy')

      // Remove it from the body
      document.body.removeChild(aux)
    },
    handleImageAdded(file, Editor, cursorLocation, resetUploader) {
      const formData = new FormData()
      formData.append('file', file)
      const folder = Folder.quan_tri_trang_chu
      const data = { formData, folder }
      this.$store.dispatch('uploadImg/uploadFile', data).then((result) => {
        if (!result.error) {
          const url = result.data.data.image_url
          Editor.insertEmbed(cursorLocation, 'image', url)
          resetUploader()
        }
      })
    },
    reset_data() {
      const lang = [...this.$store.state.app.languages]
      this.status_general_configuration = 1
      this.$refs.input_image_edit_page.reset()
      this.check_required = 0

      for (let i = 0; i < lang.length; i++) {
        lang[i] = {
          ...lang[i],
          page_title: null,
          page_title_error: [],
          path: null,
          path_error: [],
          page_content: null,
          page_content_error: [],
        }
      }
      this.languages = [...lang]
    },
    page_clone(name) {
      this.$store
        .dispatch('quan_tri_trang/page_clone', {
          page_id: this.data.pages.id,
          page_name: name,
        })
        .then((response) => {
          if (!response.error) {
            this.$emit('success')
            this.$emit('toggle')
            this.$showSuccess(this, 'Nhân bản trang thành công')
          }
        })
      this.open_change = false
    },
    validate_url(object) {
      if ((object.path || '').trim().length !== 0) {
        if (this.$isHasVietnamese(object.path) || object.path.includes(' ')) {
          object.path_error = ['Không đúng định dạng link website']
        } else {
          object.path_error = []
        }
      }
    },
    delete_file(img) {
      this.image_url = img
      this.file_img = img
    },
    file_selected(file) {
      this.check_required = 1
      this.file_img = file
      this.file_img_view = file
      this.required_img = false
    },
    upload_file_view() {
      if (!this.$isNullOrEmpty(this.file_img_view)) {
        const formData = new FormData()
        formData.append('file', this.file_img_view)
        const folder = Folder.quan_tri_trang_chu
        const data = { formData, folder }
        this.$store
          .dispatch('uploadImg/uploadFile', data)
          .then((response) => {
            if (!response.error) {
              this.preview_page_basic(response.data.data.image_url)
            } else {
              this.$emit('toggle')
            }
          })
          .catch((e) => {
            this.$log.debug(e)
          })
      } else {
        this.preview_page_basic(this.image_url)
      }
    },
    upload_file() {
      if (!this.$isNullOrEmpty(this.file_img)) {
        const formData = new FormData()
        formData.append('file', this.file_img)
        const folder = Folder.quan_tri_trang_chu
        const data = { formData, folder }
        this.$store
          .dispatch('uploadImg/uploadFile', data)
          .then((response) => {
            if (!response.error) {
              this.page_update(response.data.data.image_url)
            } else {
              this.$emit('toggle')
            }
          })
          .catch((e) => {
            this.$log.debug(e)
          })
      } else {
        this.page_update(this.image_url)
      }
    },
    page_update(urlImg) {
      const data = []
      this.image_url = urlImg
      for (let i = 0; i < this.languages.length; i++) {
        data.push({
          lang_id: this.languages[i].id,
          title: this.languages[i].page_title,
          url_seo: this.languages[i].path,
          content: this.languages[i].page_content,
        })
      }
      this.$store
        .dispatch('quan_tri_trang/page_update', {
          page_id: this.data.pages.id,
          enable_status: this.status_general_configuration,
          avatar: urlImg,
          data,
        })
        .then((response) => {
          if (!response.error) {
            this.$emit('toggle')
            this.$emit('success')
            this.$showSuccess(this, 'Cập nhật trang thành công')
          }
        })
        .finally(() => {})
    },
    preview_page_basic(image) {
      const data = []
      for (let i = 0; i < this.languages.length; i++) {
        data.push({
          lang_id: this.languages[i].id,
          title: this.languages[i].page_title,
          url_seo: this.languages[i].path,
          content: this.languages[i].page_content,
        })
      }
      this.$store
        .dispatch('quan_tri_trang/preview_page_basic', {
          page_id: this.data.pages.id,
          enable_status: this.status_general_configuration,
          avatar: image,
          data,
        })
        .then((response) => {
          if (!response.error) {
            window.open(response.data.data)
          }
        })
    },
    save_view() {
      let hasErrors = false
      let count = 0

      for (let i = 0; i < this.languages.length; i++) {
        if ((this.languages[i].page_title || '').trim().length === 0) {
          hasErrors = true
          this.languages[i].page_title_error = ['Không được để trống']
          count += 1
          this.tab = i
        } else if ((this.languages[i].page_title || '').trim().length > 200) {
          hasErrors = true
          this.languages[i].page_title_error = [
            'Nhập không quá 200 kí tự cho phép',
          ]
          count += 1
          this.tab1 = i
        }
        if ((this.languages[i].path || '').trim().length !== 0) {
          if (
            this.$isHasVietnamese(this.languages[i].path) ||
            this.languages[i].path.includes(' ')
          ) {
            hasErrors = true
            this.languages[i].path_error = ['Không đúng định dạng link website']
            count += 1
            this.tab1 = i
          }
        }
        if ((this.languages[i].page_content || '').trim().length === 0) {
          hasErrors = true
          this.languages[i].page_content_error = ['Không được để trống']
          count += 1
          this.tab2 = i
        }
      }
      if (count > 0) {
        this.$showWarnNotify(this, 'Bạn nhập thiếu thông tin bắt buộc')
      }
      if (!hasErrors) {
        this.upload_file_view()
      }
    },
    save() {
      let hasErrors = false
      let count = 0

      for (let i = 0; i < this.languages.length; i++) {
        if ((this.languages[i].page_title || '').trim().length === 0) {
          hasErrors = true
          this.languages[i].page_title_error = ['Không được để trống']
          count += 1
          this.tab = i
        } else if ((this.languages[i].page_title || '').trim().length > 200) {
          hasErrors = true
          this.languages[i].page_title_error = [
            'Nhập không quá 200 kí tự cho phép',
          ]
          count += 1
          this.tab1 = i
        }
        if ((this.languages[i].path || '').trim().length !== 0) {
          if (
            this.$isHasVietnamese(this.languages[i].path) ||
            this.languages[i].path.includes(' ')
          ) {
            hasErrors = true
            this.languages[i].path_error = ['Không đúng định dạng link website']
            count += 1
            this.tab1 = i
          }
        }
        if ((this.languages[i].page_content || '').trim().length === 0) {
          hasErrors = true
          this.languages[i].page_content_error = ['Không được để trống']
          count += 1
          this.tab2 = i
        }
      }
      if (count > 0) {
        this.$showWarnNotify(this, 'Bạn nhập thiếu thông tin bắt buộc')
      }
      if (!hasErrors) {
        this.upload_file()
      }
    },
    set_again() {
      const lang = [...this.$store.state.app.languages]
      if ((lang || []).length !== 0) {
        this.image_url = this.data.pages.avatar
        if (!this.$isNullOrEmpty(this.image_url)) {
          this.$refs.input_image_edit_page.set_img(this.image_url)
        }
        this.arr = this.data.pageBasic
        for (let i = 0; i < lang.length; i++) {
          lang[i] = {
            ...lang[i],
            page_title:
              (this.arr[i] || '').length !== 0 ? this.arr[i].tilte : '',
            page_title_error: [],
            path: (this.arr[i] || '').length !== 0 ? this.arr[i].url_seo : '',
            path_error: [],
            page_content:
              (this.arr[i] || '').length !== 0 ? this.arr[i].content : '',
            page_content_error: [],
          }
        }
      }
      this.tab = null
      this.tab1 = null
      this.tab2 = null
      this.languages = [...lang]
      this.reset_file = null
      this.check_required = 1
      this.status_general_configuration = this.data.pages.enable_status
      this.file_img = ''
      this.required_img = false
    },
    clicked_hidden(value) {
      this.hidden = value
    },
    toggle() {
      this.$emit('toggle')
    },
  },
}
</script>
<style lang="scss">
.main_edit_page {
  .v-input__prepend-inner {
    padding-right: 0 !important;
  }
  .actions-coordinates-1 {
    position: fixed;
    z-index: 3;
    right: 0;
    top: 75px;
    background-color: #f5f7fe;
  }
  .actions-coordinates-2 {
    position: fixed;
    padding-bottom: 20px;
    padding-top: 10px;
    z-index: 3;
    right: 0;
    bottom: 0;
    background-color: #f5f7fe;
  }
}
</style>
