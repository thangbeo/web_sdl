<template>
  <div class="main_big_promotion">
    <div class="ml-16">
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
              v-model="language.name_posts_promotion"
              :error-messages="language.name_posts_promotion_error"
              placeholder="Tên bài viết"
              class="border-1 fs-14"
              solo
              flat
              dense
              @input="language.name_posts_promotion_error = []"
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
            <v-row class="ml-10">
              <v-col cols="auto">
                <p class="font-weight-bold fs-14">
                  Ảnh thu nhỏ <span class="error--text">*</span>
                </p>
              </v-col>

              <v-col cols="3" class="pr-0">
                <select-file
                  id="input_file_img_zoom_out_promotion"
                  ref="input_file_img_zoom_out_promotion"
                  :hidden="true"
                  :required="required_img_zoom_out"
                  @set_file="file_selected_zoom_out"
                ></select-file>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="6">
            <v-row>
              <v-col cols="3">
                <p class="font-weight-bold fs-14">
                  Ảnh bìa <span class="error--text">*</span>
                </p>
              </v-col>

              <v-col cols="3">
                <select-file
                  id="input_file_img_avatar_promotion"
                  ref="input_file_img_avatar_promotion"
                  :hidden="true"
                  :required="required_img_avatar"
                  @set_file="file_selected_avatar"
                ></select-file>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </div>
      <p class="mb-0 fs-14 font-weight-bold">
        Mã khuyến mại<span class="error--text pl-1">*</span>
      </p>
      <v-row>
        <v-col cols="11" class="py-0 pr-0">
          <v-text-field
            v-model="code_promotion"
            :error-messages="code_promotion_error"
            class="border-1 fs-14"
            solo
            flat
            placeholder="Nhập mã code khuyến mại"
            dense
            @input="code_promotion_error = []"
          >
          </v-text-field>
        </v-col>
      </v-row>
    </div>

    <div class="ml-16">
      <p class="mb-0 fs-14 font-weight-bold">Thời gian khuyến mại</p>
      <v-row>
        <v-col cols="6" class="py-0">
          <v-row>
            <v-col class="pb-0 font-weight-bold fs-14 pr-1" cols="auto"
              >Thời gian bắt đầu<span class="red--text ml-1">*</span></v-col
            >
            <v-col cols="4" class="px-0 pb-0">
              <v-text-field
                v-model="time_checkin"
                type="time"
                placeholder="HH:mm:ss"
                class="border-1 ml-2"
                style="max-width: 300px"
                solo
                flat
                dense
                :error-messages="time_checkinError"
                @input="time_checkinError = []"
              >
              </v-text-field>
            </v-col>
            <v-col cols="4">
              <v-menu
                ref="menuStart"
                v-model="menuStart"
                :return-value.sync="startDate"
                :close-on-content-click="false"
                offset-y
                z-index="3"
                transition="scale-transition"
                width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <div v-bind="attrs" v-on="on">
                    <v-text-field
                      v-model="dateTime"
                      placeholder="dd/mm/yyyy"
                      append-icon="mdi-calendar"
                      solo
                      dense
                      readonly
                      flat
                      class="border-1"
                      z-index="3"
                      :error-messages="startDateError"
                      @input="startDateError = []"
                    ></v-text-field>
                  </div>
                </template>
                <v-date-picker
                  v-model="date"
                  :allowed-dates="allowedDates"
                  @input="menuStart = false"
                >
                </v-date-picker>
              </v-menu>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="6" class="py-0">
          <v-row>
            <v-col cols="auto" class="fs-14 font-weight-bold pl-0 pr-1"
              >Thời gian kết thúc <span class="red--text ml-1">*</span></v-col
            >
            <v-col cols="4" class="px-0">
              <v-text-field
                v-model="time_checkout"
                type="time"
                placeholder="HH:mm:ss"
                class="border-1 ml-2"
                style="max-width: 300px"
                solo
                flat
                dense
                :error-messages="time_checkoutError"
                @input="time_checkoutError = []"
              >
              </v-text-field>
            </v-col>
            <v-col cols="4" class="">
              <v-menu
                ref="menuEnd"
                v-model="menuEnd"
                :close-on-content-click="false"
                :return-value.sync="endDate"
                transition="scale-transition"
                offset-y
                z-index="3"
                width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <div v-bind="attrs" v-on="on">
                    <v-text-field
                      v-model="dateTime1"
                      hide-details
                      append-icon="mdi-calendar"
                      placeholder="dd/mm/yyyy"
                      solo
                      dense
                      readonly
                      flat
                      class="border-1"
                      z-index="3"
                      :error-messages="endDateError"
                      @input="endDateError = []"
                    ></v-text-field>
                  </div>
                </template>
                <v-date-picker
                  v-model="date1"
                  :allowed-dates="allowedDates1"
                  @input="menuEnd = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </div>
    <div class="ml-16">
      <div class="d-flex">
        <div
          class="fs-14 font-weight-bold mr-5 mt-4"
          style="padding-right: 80px"
        >
          Đánh giá
        </div>
        <v-switch
          v-model="satus_evaluate"
          color="#47bbff"
          inset
          :true-value="1"
          :false-value="0"
        ></v-switch>
      </div>
      <div class="d-flex">
        <div class="fs-14 font-weight-bold mr-5 mt-4">Có thể bạn quan tâm</div>
        <v-switch
          v-model="stauts_care"
          inset
          color="#47bbff"
          :false-value="0"
          :true-value="1"
          @change="stauts_care === 0 ? (suggestion_msg = '') : ''"
        ></v-switch>
      </div>
      <v-col cols="12" class="py-0">
        <suggestions ref="suggestions_promotion" @set_data="set_suggestions">
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
  </div>
</template>

<script>
import moment from 'moment'
import suggestions from '~/components/bai-viet/Add/suggestions/index'
import Folder from '~/assets/configurations/Folder_Config'
import SelectFile from '~/components/Selected/File'
import BASE from '~/assets/configurations/BASE_URL'
// const today = new Date()

export default {
  components: {
    SelectFile,
    suggestions,
  },
  props: {
    data: {
      type: Number,
      required: true,
    },
    status: {
      type: Number,
      required: true,
    },
  },
  data: (vm) => ({
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
    listsuggestion: [],
    date: new Date().toISOString().substr(0, 10),
    date1: new Date().toISOString().substr(0, 10),
    menuStart: false,
    startDate: new Date().toISOString().substr(0, 10),
    endDate: new Date().toISOString().substr(0, 10),
    startDateError: [],
    endDateError: [],
    time_checkoutError: [],
    time_checkinError: [],
    time_checkin: '08:30:59',
    time_checkout: '17:30:59',
    menuEnd: false,
    time_start: null,
    time_end: null,
    stauts_care: 1,
    satus_evaluate: 1,
    path: null,
    code_promotion: null,
    url_web: BASE,
    tab: null,
    tab1: null,
    tab2: null,
    count: 0,
    category_posts: '',
    category_posts_error: [],
    languages: [],
    code_promotion_error: [],
    file_img_zoom_out: null,
    file_img_avatar: null,
    required_img_zoom_out: false,
    required_img_avatar: false,
    image_zoom_out_url: '',
    image_avatar_url: '',
    choose_status_category: [],
    name_posts_: '',
    page_status_promotion: 1,
    suggestion_msg: '',
  }),
  computed: {
    dateTime() {
      const strDate = this.date
      if (!strDate) return ''
      return moment(strDate).format('DD/MM/YYYY')
    },
    dateTime1() {
      const strDate1 = this.date1
      if (!strDate1) return ''
      return moment(strDate1).format('DD/MM/YYYY')
    },
  },

  watch: {
    status(value) {
      // console.log(value, '1')
      this.page_status_promotion = value
    },

    date(val) {
      if (this.date > this.date1) {
        this.startDateError = ['Thời gian bắt đầu lớn hơn thời gian kết thúc']
      } else if (this.date === this.date1) {
        this.startDateError = []
      } else {
        this.startDateError = []
      }
    },
    date1(val) {
      if (this.date > this.date1) {
        this.startDateError = ['Thời gian bắt đầu lớn hơn thời gian kết thúc']
      } else if (this.date === this.date1) {
        this.startDateError = []
      } else {
        this.startDateError = []
      }
    },
    time_checkin(value) {
      if (this.date === this.date1) {
        if (value > this.time_checkout) {
          this.time_checkinError = [
            'Thời gian bắt đầu lớn hơn thời gian kết thúc',
          ]
        } else {
          this.time_checkinError = []
        }
      }
    },
    time_checkout(value) {
      if (this.date === this.date1) {
        if (this.time_checkin > value) {
          this.time_checkinError = [
            'Thời gian bắt đầu lớn hơn thời gian kết thúc',
          ]
        } else {
          this.time_checkinError = []
        }
      }
    },
  },
  created() {},
  methods: {
    // setTime() {
    //   // const today = new Date()
    //   this.time_checkin = '08:30:59'
    //   this.time_checkout = '18:30:59'
    // },
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
    // validate_date() {
    //   // const today = moment(new Date()).format('DD/MM/YYYY')
    //   // console.log(date, '1')
    //   // console.log(today, '2')
    //   // console.log(moment(today).isSameOrBefore(date), '4')
    //   // if (moment(today).isSameOrBefore(date)) {
    //   //   this.dateError = []
    //   // } else {
    //   //   this.dateError = ['không hợ lệ nhé']
    //   // }
    //   // this.menuStart = false
    // },
    allowedDates(value) {
      const today = moment(new Date()).format('YYYY-MM-DD')
      if (today <= value) {
        return true
      } else {
        return false
      }
    },
    allowedDates1(value) {
      const today = moment(new Date()).format('YYYY-MM-DD')
      if (today <= value) {
        return true
      } else {
        return false
      }
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
    resetPromotion() {
      const LANGUAGE = [...this.$store.state.app.languages]

      if ((LANGUAGE || []).length !== 0) {
        for (let i = 0; i < LANGUAGE.length; i++) {
          LANGUAGE[i] = {
            ...LANGUAGE[i],
            name_posts_promotion: '',

            name_posts_promotion_error: [],
            category_posts_content: '',
            category_posts_content_error: [],
            path: null,
            path_error: [],
          }
        }
      }
      // const today = new Date()
      this.time_checkin = '08:30:59'
      this.time_checkout = '18:30:59'
      // today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds()
      this.tab = null
      this.tab1 = null
      this.tab2 = null
      this.category_posts = null
      this.category_posts_error = []
      this.languages = [...LANGUAGE]
      this.file_img_zoom_out = ''
      this.file_img_avatar = ''
      this.image_zoom_out_url = null
      this.image_avatar_url = null
      this.required_img_zoom_out = false
      this.required_img_avatar = false
      this.stauts_care = 1
      this.listsuggestion = []
      this.$refs.suggestions_promotion.reset()
      this.page_status_promotion = 1
      this.satus_evaluate = 1
      this.code_promotion = ''
      this.code_promotion_error = []
      this.$refs.input_file_img_zoom_out_promotion.reset()
      this.$refs.input_file_img_avatar_promotion.reset()
      this.date = new Date().toISOString().substr(0, 10)
      this.date1 = new Date().toISOString().substr(0, 10)
      this.startDate = new Date().toISOString().substr(0, 10)
      this.endDate = new Date().toISOString().substr(0, 10)
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
    validata_view() {
      let hasErors = false
      let count = 0
      for (let i = 0; i < this.languages.length; i++) {
        if ((this.languages[i].name_posts_promotion || []).length === 0) {
          hasErors = true
          this.languages[i].name_posts_promotion_error = ['Không được để trống']
          count += 1
          this.tab = i
        } else if (this.languages[i].name_posts_promotion.length > 200) {
          hasErors = true
          this.languages[i].name_posts_promotion_error = [
            'Nhập không quá 200 kí tự cho phép',
          ]
          count += 1
          this.tab = i
        }
        if ((this.languages[i].category_posts_content || '').length === 0) {
          hasErors = true
          this.languages[i].category_posts_content_error = [
            'Không được để trống',
          ]
          count += 1
          this.tab2 = i
        }
      }
      if ((this.code_promotion || []).length === 0) {
        hasErors = true
        this.code_promotion_error = ['Không được để trống']
        count += 1
      } else if (this.$isHasVietnamese(this.code_promotion)) {
        hasErors = true
        this.code_promotion_error = ['Mã khuyến mại không hợp lệ']
        count += 1
      }
      if ((this.category_posts || []).length === 0) {
        hasErors = true
        this.category_posts_error = ['Không được để trống']
      } else if (this.category_posts.length > 200) {
        hasErors = true
        this.category_posts_error = ['Nhập không quá 200 kí tự cho phép']
      }
      if ((this.file_img_zoom_out || []).length === 0) {
        hasErors = true
        this.required_img_zoom_out = true
      }
      if ((this.file_img_avatar || []).length === 0) {
        hasErors = true
        this.required_img_avatar = true
      }

      if (this.date > this.date1) {
        hasErors = true
        this.startDateError = ['Thời gian bắt đầu lớn hơn thời gian kết thúc']
      }
      if (this.date === this.date1) {
        if (this.time_checkin > this.time_checkout) {
          hasErors = true
          this.time_checkinError = [
            'Thời gian bắt đầu lớn hơn thời gian kết thúc',
          ]
        } else {
          this.time_checkinError = []
        }
      } else {
        this.time_checkinError = []
      }
      if (count > 0) {
        this.$showWarnNotify(this, 'Bạn nhập thiếu thông tin bắt buộc')
      }
      if (!hasErors) {
        this.view_print_promotion_Print()
      }
    },
    view_print_promotion_Print() {
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
          post_name: this.languages[i].name_posts_promotion,
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
      // console.log(this.page_status_promotion, '3')
      this.$store
        .dispatch('bai_viet/preview_post', {
          save_status: 1,
          status: this.page_status_promotion,
          post_type: 2,
          avatar_small: this.image_zoom_out_url,
          avatar: this.image_avatar_url,
          vote_status: this.satus_evaluate,
          interested_status: this.stauts_care,
          promotions_start: `${moment(this.date, 'YYYY/MM/DD').format(
            'DD/MM/YYYY'
          )} ${this.time_checkin}`,
          // ${this.time_start}
          promotions_end: `${moment(this.date1, 'YYYY/MM/DD').format(
            'DD/MM/YYYY'
          )} ${this.time_checkout}`,
          // ${this.time_end}
          promotions_code: this.code_promotion,
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
    validatePromotionSave() {
      let hasErors = false
      let count = 0
      for (let i = 0; i < this.languages.length; i++) {
        if ((this.languages[i].name_posts_promotion || []).length === 0) {
          hasErors = true
          this.languages[i].name_posts_promotion_error = ['Không được để trống']
          count += 1
          this.tab = i
        } else if (this.languages[i].name_posts_promotion.length > 200) {
          hasErors = true
          this.languages[i].name_posts_promotion_error = [
            'Nhập không quá 200 kí tự cho phép',
          ]
          count += 1
          this.tab = i
        }
        if ((this.languages[i].category_posts_content || '').length === 0) {
          hasErors = true
          this.languages[i].category_posts_content_error = [
            'Không được để trống',
          ]
          count += 1
          this.tab2 = i
        }
      }
      if ((this.category_posts || []).length === 0) {
        hasErors = true
        this.category_posts_error = ['Không được để trống']
      } else if (this.category_posts.length > 200) {
        hasErors = true
        this.category_posts_error = ['Nhập không quá 200 kí tự cho phép']
      }
      if ((this.file_img_zoom_out || []).length === 0) {
        hasErors = true
        this.required_img_zoom_out = true
      }
      if ((this.file_img_avatar || []).length === 0) {
        hasErors = true
        this.required_img_avatar = true
      }
      if (this.date > this.date1) {
        hasErors = true
        this.startDateError = ['Thời gian bắt đầu lớn hơn thời gian kết thúc']
      }
      if (this.date === this.date1) {
        if (this.time_checkin > this.time_checkout) {
          hasErors = true
          this.time_checkinError = [
            'Thời gian bắt đầu lớn hơn thời gian kết thúc',
          ]
        } else {
          this.time_checkinError = []
        }
      } else {
        this.time_checkinError = []
      }
      if ((this.code_promotion || []).length === 0) {
        hasErors = true
        this.code_promotion_error = ['Không được để trống']
        count += 1
      } else if (this.$isHasVietnamese(this.code_promotion)) {
        hasErors = true
        this.code_promotion_error = ['Mã khuyến mại không hợp lệ']
        count += 1
      }

      if ((this.listsuggestion || []).length === 0 && this.stauts_care === 1) {
        hasErors = true
        this.suggestion_msg = 'Không được để trống'
      }
      if (count > 0) {
        this.$showWarnNotify(this, 'Bạn nhập thiếu thông tin bắt buộc')
      }
      if (!hasErors) {
        this.insert_promotions_save()
      }
    },
    validatePromotionSavePrint() {
      let hasErors = false
      let count = 0
      for (let i = 0; i < this.languages.length; i++) {
        if ((this.languages[i].name_posts_promotion || []).length === 0) {
          hasErors = true
          this.languages[i].name_posts_promotion_error = ['Không được để trống']
          this.tab = i
          count += 1
        } else if (this.languages[i].name_posts_promotion.length > 200) {
          hasErors = true
          this.languages[i].name_posts_promotion_error = [
            'Nhập không quá 200 kí tự cho phép',
          ]
          count += 1
          this.tab = i
        }
        if ((this.languages[i].category_posts_content || '').length === 0) {
          hasErors = true
          this.languages[i].category_posts_content_error = [
            'Không được để trống',
          ]
          count += 1
          this.tab2 = i
        }
      }

      if ((this.category_posts || []).length === 0) {
        hasErors = true
        this.category_posts_error = ['Không được để trống']
      } else if (this.category_posts.length > 200) {
        hasErors = true
        this.category_posts_error = ['Nhập không quá 200 kí tự cho phép']
      }
      if ((this.file_img_zoom_out || []).length === 0) {
        hasErors = true
        this.required_img_zoom_out = true
      }
      if ((this.file_img_avatar || []).length === 0) {
        hasErors = true
        this.required_img_avatar = true
      }
      if (this.date > this.date1) {
        hasErors = true
        this.startDateError = ['Thời gian bắt đầu lớn hơn thời gian kết thúc']
      }
      if (this.date === this.date1) {
        if (this.time_checkin > this.time_checkout) {
          hasErors = true
          this.time_checkinError = [
            'Thời gian bắt đầu lớn hơn thời gian kết thúc',
          ]
        } else {
          this.time_checkinError = []
        }
      } else {
        this.time_checkinError = []
      }

      if ((this.code_promotion || []).length === 0) {
        hasErors = true
        this.code_promotion_error = ['Không được để trống']
        count += 1
      } else if (this.$isHasVietnamese(this.code_promotion)) {
        hasErors = true
        this.code_promotion_error = ['Mã khuyến mại không hợp lệ']
        count += 1
      }
      if ((this.listsuggestion || []).length === 0 && this.stauts_care === 1) {
        hasErors = true
        this.suggestion_msg = 'Không được để trống'
      }
      if (count > 0) {
        this.$showWarnNotify(this, 'Bạn nhập thiếu thông tin bắt buộc')
      }
      if (!hasErors) {
        this.insert_promotions_save_print()
      }
    },
    langs() {
      const LANGUAGE = [...this.$store.state.app.languages]

      if ((LANGUAGE || []).length !== 0) {
        for (let i = 0; i < LANGUAGE.length; i++) {
          LANGUAGE[i] = {
            ...LANGUAGE[i],
            name_posts_promotion: '',
            name_posts_promotion_error: [],
            category_posts_content: '',
            category_posts_content_error: [],
            path: null,
            path_error: [],
          }
        }
      }
      this.languages = [...LANGUAGE]
    },
    insert_promotions_save() {
      const postLangs = []
      const arr = []
      const suggestions = []
      // console.log(this.data, 'asdadas')
      for (let i = 0; i < this.category_posts.length; i++) {
        arr.push({ category_id: this.category_posts[i] })
      }
      for (let i = 0; i < this.languages.length; i++) {
        postLangs.push({
          lang_id: this.languages[i].id,
          post_name: this.languages[i].name_posts_promotion,
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
      // console.log(this.page_status_promotion, '2')
      this.$store
        .dispatch('bai_viet/insert_promotions', {
          save_status: 0,
          status: this.page_status_promotion,
          post_type: 2,
          avatar_small: this.image_zoom_out_url,
          avatar: this.image_avatar_url,
          vote_status: this.satus_evaluate,
          interested_status: this.stauts_care,
          // ${this.time_start}
          promotions_start: `${moment(this.date, 'YYYY/MM/DD').format(
            'DD/MM/YYYY'
          )} ${this.time_checkin}`,
          promotions_end: `${moment(this.date1, 'YYYY/MM/DD').format(
            'DD/MM/YYYY'
          )} ${this.time_checkout}`,
          // ${this.time_end}
          promotions_code: this.code_promotion,
          postLangs,
          categoryPosts: arr,
          listProduct: suggestions.join(),
        })
        .then((response) => {
          if (!response.error) {
            this.$emit('exits')
            this.$emit('Success')
            this.$showSuccess(this, 'Thêm bài viết khuyến mại thành công')
          }
        })
    },
    insert_promotions_save_print() {
      const postLangs = []
      const arr = []
      const suggestions = []
      // console.log(this.data, 'asdadas')
      for (let i = 0; i < this.category_posts.length; i++) {
        arr.push({ category_id: this.category_posts[i] })
      }
      for (let i = 0; i < this.languages.length; i++) {
        postLangs.push({
          lang_id: this.languages[i].id,
          post_name: this.languages[i].name_posts_promotion,
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
      // console.log(this.page_status_promotion, '3')
      this.$store
        .dispatch('bai_viet/insert_promotions', {
          save_status: 1,
          status: this.page_status_promotion,
          post_type: 2,
          avatar_small: this.image_zoom_out_url,
          avatar: this.image_avatar_url,
          vote_status: this.satus_evaluate,
          interested_status: this.stauts_care,
          promotions_start: `${moment(this.date, 'YYYY/MM/DD').format(
            'DD/MM/YYYY'
          )} ${this.time_checkin}`,
          // ${this.time_start}
          promotions_end: `${moment(this.date1, 'YYYY/MM/DD').format(
            'DD/MM/YYYY'
          )} ${this.time_checkout}`,
          // ${this.time_end}
          promotions_code: this.code_promotion,
          postLangs,
          categoryPosts: arr,
          listProduct: suggestions.join(),
        })
        .then((response) => {
          if (!response.error) {
            this.$emit('exits')
            this.$emit('Success')
            this.$showSuccess(this, 'Thêm bài viết khuyến mại thành công')
          }
        })
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
  },
}
</script>
<style lang="scss">
.main_big_promotion {
  .v-input__prepend-inner {
    padding-right: 0 !important;
  }
}
</style>
