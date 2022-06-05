<template>
  <div class="ml-16 main_big_defaul">
    <p class="ma-0 fs-14 font-weight-bold">
      Tên bài viết <span class="error--text ml-1">*</span>
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
        <v-col class="pa-0" cols="11">
          <v-text-field
            v-model="language.name_posts_default"
            :error-messages="language.name_posts_default_error"
            placeholder="Tên bài viết"
            class="border-1 fs-14"
            solo
            flat
            dense
            @input="language.name_posts_default_error = []"
          >
          </v-text-field>
        </v-col>
      </v-tab-item>
    </v-tabs-items>
    <p class="ma-0 fs-14 font-weight-bold">
      Danh mục bài viết <span class="error--text ml-1">*</span>
    </p>
    <v-col class="pa-0" cols="11">
      <v-autocomplete
        v-model="category_posts"
        :error-messages="category_posts_error"
        :items="choose_status_category"
        multiple
        solo
        dense
        flat
        clearable
        :menu-props="{ zIndex: '1' }"
        class="border-1 fs-14"
        placeholder="Chọn danh mục bài viết"
        @input="category_posts_error = []"
      ></v-autocomplete>
    </v-col>

    <v-col class="py-0 px-0" cols="11">
      <p class="ma-0 fs-14 font-weight-bold">URL thân thiện cho SEO</p>

      <v-col class="py-0 d-flex" cols="12"> </v-col>

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
              class="border-1 rounded-r-0 fs-14"
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
    <div>
      <v-row>
        <v-col cols="6">
          <v-row class="ml-10 pr-0">
            <v-col cols="auto">
              <p class="font-weight-bold fs-14">
                Ảnh thu nhỏ <span class="error--text pl-1">*</span>
              </p>
            </v-col>

            <v-col cols="3" class="pr-0">
              <select-file
                id="input_file_img_zoom_out"
                ref="input_file_img_zoom_out"
                :hidden="true"
                :required="required_img_zoom_out"
                @set_file="file_selected_zoom_out"
              ></select-file>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="6">
          <v-row>
            <v-col cols="auto" class="pr-1">
              <p class="font-weight-bold fs-14">
                Ảnh bìa <span class="error--text pl-1">*</span>
              </p>
            </v-col>

            <v-col cols="3">
              <select-file
                id="input_file_img_avatar"
                ref="input_file_img_avatar"
                :hidden="true"
                :required="required_img_avatar"
                @set_file="file_selected_avatar"
              ></select-file>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </div>
    <div class="d-flex">
      <div class="fs-14 mt-4 font-weight-bold" style="margin-right: 100px">
        Đánh giá
      </div>
      <v-switch
        v-model="status_evaluate"
        class="mt-3"
        color="#47bbff"
        :true-value="1"
        :false-value="0"
        inset
      ></v-switch>
    </div>
    <div class="d-flex">
      <div class="fs-14 mr-5 mt-4 font-weight-bold">Có thể bạn quan tâm</div>
      <v-switch
        v-model="stauts_care"
        class="mt-3"
        color="#47bbff"
        :false-value="0"
        :true-value="1"
        inset
        @change="stauts_care === 0 ? (suggestion_msg = '') : ''"
      ></v-switch>
    </div>
    <v-col cols="12" class="py-0">
      <suggestions ref="suggestions_default" @set_data="set_suggestions">
        <span v-if="stauts_care === 1" class="error--text ml-1">*</span>
      </suggestions>
      <v-col cols="12" class="ml-2">
        <div class="v-messages theme--light error--text mt-1" role="alert">
          <div class="v-messages__wrapper">
            <div class="v-messages__message">
              {{ suggestion_msg }}
            </div>
          </div>
        </div>
      </v-col>
    </v-col>

    <div>
      <p class="ma-0 fs-14 font-weight-bold">
        Nội dung <span class="error--text">*</span>
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
              v-model="language.category_posts_content"
              use-custom-image-handler
              :editor-toolbar="customToolbar"
              @image-added="handleImageAdded"
              @text-change="language.category_posts_content_error = []"
            ></vue-editor>
            <div class="caption red--text">
              {{
                language.category_posts_content_error[
                  language.category_posts_content_error.length - 1
                ]
              }}
            </div>
          </v-col>
        </v-tab-item>
      </v-tabs-items>
    </div>
  </div>
</template>

<script>
import suggestions from '~/components/bai-viet/Add/suggestions/index'
import Folder from '~/assets/configurations/Folder_Config'
import SelectFile from '~/components/Selected/File'
import BASE from '~/assets/configurations/BASE_URL'
export default {
  components: {
    SelectFile,
    suggestions,
  },
  props: {
    status: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      listsuggestion: [],
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
      suggestion_msg: '',
      tab: null,
      tab1: null,
      tab2: null,
      stauts_care: 1,
      status_evaluate: 1,
      required_img_zoom_out: false,
      required_img_avatar: false,
      file_img_avatar: '',
      file_img_zoom_out: '',
      image_zoom_out_url: null,
      image_avatar_url: null,
      category_posts: null,
      category_posts_error: [],
      languages: [],
      page_status_default: 1,
      url_web: BASE,
      choose_status_category: [],
    }
  },
  watch: {
    status(value) {
      this.page_status_default = value
    },
  },

  methods: {
    set_suggestions(items) {
      this.listsuggestion = items
      this.suggestion_msg = ''
    },
    handleImageAdded(file, Editor, cursorLocation, resetUploader) {
      const formData = new FormData()
      formData.append('file', file)
      const folder = Folder.bai_viet
      const data = { formData, folder }
      this.$store.dispatch('uploadImg/uploadFile', data).then((result) => {
        if (!result.error) {
          const url = result.data.data.image_url
          Editor.insertEmbed(cursorLocation, 'image', url)
          resetUploader()
        }
      })
    },
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
    file_selected_zoom_out(file) {
      this.file_img_zoom_out = file
      this.required_img_zoom_out = false
      const formData = new FormData()
      formData.append('file', this.file_img_zoom_out)
      const folder = Folder.bai_viet
      const data = { formData, folder }
      this.$store.dispatch('uploadImg/uploadFile', data).then((response) => {
        if (!response.error) {
          this.image_zoom_out_url = response.data.data.image_url
        }
      })
    },
    file_selected_avatar(file) {
      this.file_img_avatar = file
      this.required_img_avatar = false
      const formData = new FormData()
      formData.append('file', this.file_img_avatar)
      const folder = Folder.bai_viet
      const data = { formData, folder }
      this.$store.dispatch('uploadImg/uploadFile', data).then((response) => {
        if (!response.error) {
          this.image_avatar_url = response.data.data.image_url
        }
      })
    },
    resetDefault() {
      const LANGUAGE = [...this.$store.state.app.languages]

      if ((LANGUAGE || []).length !== 0) {
        for (let i = 0; i < LANGUAGE.length; i++) {
          LANGUAGE[i] = {
            ...LANGUAGE[i],
            name_posts_default: '',
            name_posts_default_error: [],
            category_posts_content: '',
            category_posts_content_error: [],
            path: null,
            path_error: [],
          }
        }
      }
      this.tab = null
      this.tab1 = null
      this.tab2 = null
      this.languages = [...LANGUAGE]
      this.file_img_avatar = ''
      this.file_img_zoom_out = ''
      this.suggestion_msg = ''
      this.image_zoom_out_url = null
      this.image_avatar_url = null
      this.required_img_zoom_out = false
      this.required_img_avatar = false
      this.stauts_care = 1
      this.listsuggestion = []
      this.$refs.suggestions_default.reset()
      this.status_evaluate = 1
      this.page_status_default = 1
      this.category_posts = null
      this.category_posts_error = []
      this.$refs.input_file_img_zoom_out.reset()
      this.$refs.input_file_img_avatar.reset()
    },
    getlist() {
      this.$store.dispatch('bai_viet/category_post', {}).then((response) => {
        if (!response.error) {
          response.data.data.map((item) => {
            this.choose_status_category.push({
              text: item.tilte,
              value: item.category_post_id,
            })
          })
        }
      })
    },
    langs() {
      const LANGUAGE = [...this.$store.state.app.languages]

      if ((LANGUAGE || []).length !== 0) {
        for (let i = 0; i < LANGUAGE.length; i++) {
          LANGUAGE[i] = {
            ...LANGUAGE[i],
            name_posts_default: '',
            name_posts_default_error: [],
            category_posts_content: '',
            category_posts_content_error: [],
            path: null,
            path_error: [],
          }
        }
      }
      this.languages = [...LANGUAGE]
    },
    validate_url(object) {
      if ((object.path || '').trim().length !== 0) {
        if (this.$isHasVietnamese(object.path) || object.path.includes(' ')) {
          object.path_error = 'Không đúng định dạng link website'
        } else {
          object.path_error = ''
        }
      }
    },
    view_Promotion() {
      const postLangs = []
      const arr = []
      const suggestions = []
      if (this.category_posts === 0) {
        for (let i = 0; i < this.category_posts.length; i++) {
          arr.push({ category_id: this.category_posts[i] })
        }
      }

      for (let i = 0; i < this.languages.length; i++) {
        postLangs.push({
          lang_id: this.languages[i].id,
          post_name: this.languages[i].name_posts_default,
          url_seo: this.languages[i].path,
          content: this.languages[i].category_posts_content,
        })
      }

      for (let i = 0; i < this.listsuggestion.length; i++) {
        suggestions.push(
          String(
            `${this.listsuggestion[i].id}-${this.listsuggestion[i].product_type}`
          )
        )
      }
      this.$store
        .dispatch('bai_viet/preview_post', {
          save_status: 1,
          status: this.page_status_default,
          post_type: 1,
          avatar_small: this.image_zoom_out_url,
          avatar: this.image_avatar_url,
          vote_status: this.status_evaluate,
          interested_status: this.stauts_care,
          promotions_start: null,
          promotions_end: null,
          promotions_code: null,
          postLangs,
          categoryPosts: arr,
          listProduct: suggestions.join(),
        })
        .then((response) => {
          if (!response.error) {
            window.open(response.data.data)
          }
        })
    },
    validate_view() {
      let hasErrors = false
      let count = 0
      for (let i = 0; i < this.languages.length; i++) {
        if ((this.languages[i].name_posts_default || '').length === 0) {
          hasErrors = true
          this.languages[i].name_posts_default_error = ['Không được để trống']
          count += 1
          this.tab = i
        } else if ((this.languages[i].name_posts_default || '').length > 200) {
          hasErrors = true
          this.languages[i].name_posts_default_error = [
            'Nhập không quá 200 kí tự cho phép',
          ]
          this.tab = i
          count += 1
        }
        if ((this.languages[i].category_posts_content || '').length === 0) {
          hasErrors = true
          this.languages[i].category_posts_content_error = [
            'Không được để trống',
          ]
          this.tab2 = i
          count += 1
        }
      }
      if ((this.category_posts || '').length === 0) {
        hasErrors = true
        this.category_posts_error = ['Không được để trống']
      }
      if ((this.file_img_zoom_out || []).length === 0) {
        hasErrors = true
        this.required_img_zoom_out = true
      }
      if ((this.file_img_avatar || []).length === 0) {
        hasErrors = true
        this.required_img_avatar = true
      }
      if ((this.listsuggestion || []).length === 0 && this.stauts_care === 1) {
        hasErrors = true
        this.suggestion_msg = 'Không được để trống'
      }

      if (count > 0) {
        this.$showWarnNotify(this, 'Bạn nhập thiếu thông tin bắt buộc')
      }
      if (!hasErrors) {
        this.view_Promotion()
      }
    },
    validateDefaultSave() {
      let hasErrors = false
      let count = 0
      for (let i = 0; i < this.languages.length; i++) {
        if ((this.languages[i].name_posts_default || '').length === 0) {
          hasErrors = true
          this.languages[i].name_posts_default_error = ['Không được để trống']
          count += 1
          this.tab = i
        } else if ((this.languages[i].name_posts_default || '').length > 200) {
          hasErrors = true
          this.languages[i].name_posts_default_error = [
            'Nhập không quá 200 kí tự cho phép',
          ]
          this.tab = i
          count += 1
        }
        if ((this.languages[i].category_posts_content || '').length === 0) {
          hasErrors = true
          this.languages[i].category_posts_content_error = [
            'Không được để trống',
          ]
          this.tab2 = i
          count += 1
        }
      }
      if ((this.category_posts || '').length === 0) {
        hasErrors = true
        this.category_posts_error = ['Không được để trống']
      }
      if ((this.file_img_zoom_out || []).length === 0) {
        hasErrors = true
        this.required_img_zoom_out = true
      }
      if ((this.file_img_avatar || []).length === 0) {
        hasErrors = true
        this.required_img_avatar = true
      }
      if ((this.listsuggestion || []).length === 0 && this.stauts_care === 1) {
        hasErrors = true
        this.suggestion_msg = 'Không được để trống'
      }

      if (count > 0) {
        this.$showWarnNotify(this, 'Bạn nhập thiếu thông tin bắt buộc')
      }
      if (!hasErrors) {
        this.insert_Default_save()
      }
    },
    validateDefaultSavePrint() {
      let hasErrors = false
      let count = 0
      for (let i = 0; i < this.languages.length; i++) {
        if ((this.languages[i].name_posts_default || '').length === 0) {
          hasErrors = true
          this.languages[i].name_posts_default_error = ['Không được để trống']
          this.tab = i
          count += 1
        } else if ((this.languages[i].name_posts_default || '').length > 200) {
          hasErrors = true
          this.languages[i].name_posts_default_error = [
            'Nhập không quá 200 kí tự cho phép',
          ]
          count += 1
          this.tab = i
        }
        if ((this.languages[i].category_posts_content || '').length === 0) {
          hasErrors = true
          this.languages[i].category_posts_content_error = [
            'Không được để trống',
          ]
          count += 1
          this.tab2 = i
        }
      }
      if ((this.category_posts || '').length === 0) {
        hasErrors = true
        this.category_posts_error = ['Không được để trống']
      }
      if ((this.file_img_zoom_out || []).length === 0) {
        hasErrors = true
        this.required_img_zoom_out = true
      }
      if ((this.file_img_avatar || []).length === 0) {
        hasErrors = true
        this.required_img_avatar = true
      }
      if ((this.listsuggestion || []).length === 0 && this.stauts_care === 1) {
        hasErrors = true
        this.suggestion_msg = 'Không được để trống'
      }

      if (count > 0) {
        this.$showWarnNotify(this, 'Bạn nhập thiếu thông tin bắt buộc')
      }
      if (!hasErrors) {
        this.insert_Default_save_print()
      }
    },
    insert_Default_save() {
      const postLangs = []
      const arr = []
      const suggestions = []
      for (let i = 0; i < this.category_posts.length; i++) {
        arr.push({ category_id: this.category_posts[i] })
      }

      for (let i = 0; i < this.languages.length; i++) {
        postLangs.push({
          lang_id: this.languages[i].id,
          post_name: this.languages[i].name_posts_default,
          url_seo: this.languages[i].path,
          content: this.languages[i].category_posts_content,
        })
      }
      for (let i = 0; i < this.listsuggestion.length; i++) {
        suggestions.push(
          String(
            `${this.listsuggestion[i].id}-${this.listsuggestion[i].product_type}`
          )
        )
      }
      this.$store
        .dispatch('bai_viet/insert_Default', {
          save_status: 0,
          status: this.page_status_default,
          post_type: 1,
          avatar_small: this.image_zoom_out_url,
          avatar: this.image_avatar_url,
          vote_status: this.status_evaluate,
          interested_status: this.stauts_care,
          promotions_start: null,
          promotions_end: null,
          promotions_code: null,
          postLangs,
          categoryPosts: arr,
          listProduct: suggestions.join(),
        })
        .then((response) => {
          if (!response.error) {
            this.$emit('exits')
            this.$emit('Success')
            this.$showSuccess(this, 'Thêm bài viết thành công')
          }
        })
    },
    insert_Default_save_print() {
      const postLangs = []
      const arr = []
      const suggestions = []
      for (let i = 0; i < this.category_posts.length; i++) {
        arr.push({ category_id: this.category_posts[i] })
      }

      for (let i = 0; i < this.languages.length; i++) {
        postLangs.push({
          lang_id: this.languages[i].id,
          post_name: this.languages[i].name_posts_default,
          url_seo: this.languages[i].path,
          content: this.languages[i].category_posts_content,
        })
      }
      for (let i = 0; i < this.listsuggestion.length; i++) {
        suggestions.push(
          String(
            `${this.listsuggestion[i].id}-${this.listsuggestion[i].product_type}`
          )
        )
      }
      this.$store
        .dispatch('bai_viet/insert_Default', {
          save_status: 1,
          status: this.page_status_default,
          post_type: 1,
          avatar_small: this.image_zoom_out_url,
          avatar: this.image_avatar_url,
          vote_status: this.status_evaluate,
          interested_status: this.stauts_care,
          promotions_start: null,
          promotions_end: null,
          promotions_code: null,
          postLangs,
          categoryPosts: arr,
          listProduct: suggestions.join(),
        })
        .then((response) => {
          if (!response.error) {
            this.$emit('exits')
            this.$emit('Success')
            this.$showSuccess(this, 'Thêm bài viết thành công')
          }
        })
    },
    // detailDefault() {
    //   console.log(this.data, '2312312')
    // },
  },
}
</script>
<style lang="scss">
.main_big_defaul {
  .v-input__prepend-inner {
    padding-right: 0 !important;
  }
}
</style>
