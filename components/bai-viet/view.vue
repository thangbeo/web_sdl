<template>
  <div class="main_list_posts">
    <!-- // chức năng -->
    <div class="d-flex w-100 actions-coordinates-1 mr-5">
      <div class="flex-grow-1"></div>

      <div
        v-if="text_save_publication === 0"
        style="position: fixed; z-index: 3; right: 12px; bottom: 20px"
      >
        <v-btn
          color="error"
          class="text-none white--text mr-3"
          depressed
          width="90"
          @click="toggle"
          >Quay lại</v-btn
        >
      </div>
      <div
        v-if="text_save_publication === 1"
        class="d-flex w-100 actions-coordinates-2"
      >
        <div class="flex-grow-1"></div>
        <div>
          <v-btn
            color="error"
            class="text-none white--text mr-3"
            depressed
            width="90"
            @click="toggle"
            >Quay lại</v-btn
          >
        </div>
      </div>
    </div>
    <!-- //noi dung -->
    <div class="pb-16">
      <div class="pt-12 ml-16 mr-3">
        <div class="d-flex">
          <div class="font-weight-bold fs-16 pr-7 pt-1">Hiển thị/ Ẩn</div>
          <v-switch
            v-model="page_status"
            color="#47bbff"
            class="mt-0 mr-5"
            inset
            :true-value="1"
            :false-value="0"
          ></v-switch>
          <div v-if="text_save_publication === 0" class="pt-1 error--text">
            Lưu nháp
          </div>
          <div v-if="text_save_publication === 1" class="pt-1 primary--text">
            Đã xuất bản
          </div>
        </div>
        <p class="ma-0 fs-16 font-weight-bold">
          Mẫu bài viết <span class="error--text ml-1">*</span>
        </p>
        <div>
          <v-row>
            <v-col cols="11" class="py-0 pr-0">
              <v-select
                v-model="choose_form"
                :items="form_status"
                :error-messages="choose_form_error"
                solo
                dense
                flat
                readonly
                placeholder="chọn mẫu bài viết"
                class="border-1 fs-14"
                @input="choose_form_error = []"
              ></v-select>
            </v-col>
          </v-row>
        </div>
      </div>
      <!-- // chọn mặc định -->
      <!-- <mac-dinh v-if="choose_form == 1" ref="validateDefault"></mac-dinh> -->

      <div v-if="choose_form === 1" class="ml-16">
        <p class="ma-0 fs-16 font-weight-bold">
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
                placeholder="Nhập địa chỉ"
                class="border-1 fs-14"
                solo
                flat
                readonly
                dense
                @input="language.name_posts_default_error = []"
              >
              </v-text-field>
            </v-col>
          </v-tab-item>
        </v-tabs-items>
        <p class="ma-0 fs-16 font-weight-bold">
          Danh mục bài viết <span class="error--text ml-1">*</span>
        </p>
        <v-col class="pa-0" cols="11">
          <v-autocomplete
            v-model="category_posts_default"
            :error-messages="category_posts_default_error"
            :items="choose_status_category"
            multiple
            solo
            dense
            flat
            readonly
            class="border-1 fs-14"
            placeholder="chọn danh mục bài viết"
            @input="category_posts_default_error = []"
          ></v-autocomplete>
        </v-col>

        <div class="ml-1">
          <p class="ma-0 fs-16 font-weight-bold">URL thân thiện cho SEO</p>
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
              <div
                class="mt-2 ml-2 fs-14 grey--text"
                style="position: absolute; z-index: 1"
              >
                {{ url_web.URL_WEB }}
              </div>
              <v-col class="pa-0" cols="11">
                <v-text-field
                  v-model="language.path_default"
                  :error-messages="language.path_default_error"
                  class="border-1 style-css-domain-input fs-14"
                  solo
                  flat
                  readonly
                  dense
                  @input="validate_url(language)"
                >
                </v-text-field>
              </v-col>
            </v-tab-item>
          </v-tabs-items>
        </div>
        <div>
          <v-row>
            <v-col cols="6">
              <v-row class="ml-10">
                <v-col cols="auto">
                  <p class="font-weight-bold fs-16">
                    Ảnh thu nhỏ <span class="error--text pl-1">*</span>
                  </p>
                </v-col>

                <v-col cols="2">
                  <SelectFile
                    id="input_file_img_zoom_out_default"
                    ref="input_file_img_zoom_out_default"
                    :fixed="false"
                    :hidden="true"
                    :required="required_img_zoom_out_default"
                    @set_file="file_selected_zoom_out_default"
                  ></SelectFile>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="6">
              <v-row>
                <v-col cols="2" class="pr-1">
                  <p class="font-weight-bold fs-16">
                    Ảnh bìa <span class="error--text pl-1">*</span>
                  </p>
                </v-col>

                <v-col cols="2">
                  <SelectFile
                    id="input_file_img_avatar_default"
                    ref="input_file_img_avatar_default"
                    :fixed="false"
                    :hidden="true"
                    :required="required_img_avatar_default"
                    @set_file="file_selected_avatar_default"
                  ></SelectFile>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </div>
        <div class="d-flex">
          <div class="fs-16 mt-4 font-weight-bold" style="margin-right: 100px">
            Đánh giá
          </div>
          <v-switch
            v-model="status_evaluate_default"
            class="mt-3"
            disabled
            color="#47bbff"
            :true-value="1"
            :false-value="0"
            inset
          ></v-switch>
        </div>
        <div class="d-flex">
          <div class="fs-16 mr-5 mt-4 font-weight-bold">
            Có thể bạn quan tâm
          </div>
          <v-switch
            v-model="stauts_care_default"
            class="mt-3"
            disabled
            color="#47bbff"
            :false-value="0"
            :true-value="1"
            inset
          ></v-switch>
        </div>
        <div class="pt-5">
          <p class="ma-0 fs-16 font-weight-bold">
            Nội dung <span class="error--text">*</span>
          </p>
          <v-tabs v-model="tab3" background-color="#F5F7FE">
            <v-tab
              v-for="(language, index) in languages"
              :key="`${index}-${language}`"
              class="text-none"
            >
              {{ language.name }}
            </v-tab>
          </v-tabs>
          <v-tabs-items v-model="tab3" style="background-color: #f5f7fe">
            <v-tab-item
              v-for="(language, index) in languages"
              :key="`${index}-${language}`"
            >
              <v-col class="pa-0" cols="11">
                <vue-editor
                  v-model="language.category_posts_content_default"
                  disabled
                  use-custom-image-handler
                  @text-change="
                    language.category_posts_content_default_error = []
                  "
                ></vue-editor>
                <!-- <div class="caption red--text">
                {{
                  language.category_posts_content_default_error[
                    language.category_posts_content_default_error.length - 1
                  ]
                }}
              </div> -->
              </v-col>
            </v-tab-item>
          </v-tabs-items>
        </div>
      </div>
      <!-- end mặc định -->
      <!-- // chọn khuyến mại -->
      <!-- <khuyen-mai v-if="choose_form == 2" ref="validatePromotion"></khuyen-mai> -->
      <div v-if="choose_form === 2">
        <div class="ml-16">
          <p class="ma-0 fs-16 font-weight-bold">
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
                  placeholder="Nhập địa chỉ"
                  class="border-1 fs-14"
                  solo
                  readonly
                  flat
                  dense
                  @input="language.name_posts_promotion_error = []"
                >
                </v-text-field>
              </v-col>
            </v-tab-item>
          </v-tabs-items>
          <p class="ma-0 fs-16 font-weight-bold">
            Danh mục bài viết <span class="error--text ml-1">*</span>
          </p>

          <v-col class="pa-0" cols="11">
            <v-autocomplete
              v-model="category_posts_promotion"
              :error-messages="category_posts_promotion_error"
              :items="choose_status_category"
              multiple
              solo
              dense
              readonly
              flat
              class="border-1 fs-14"
              placeholder="chọn danh mục bài viết"
              @input="category_posts_promotion_error = []"
            ></v-autocomplete>
          </v-col>

          <div class="ml-1">
            <p class="ma-0 fs-16 font-weight-bold">URL thân thiện cho SEO</p>
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
                <div
                  class="mt-2 ml-2 fs-14 grey--text"
                  style="position: absolute; z-index: 1"
                >
                  {{ url_web.URL_WEB }}
                </div>
                <v-col class="pa-0" cols="11">
                  <v-text-field
                    v-model="language.path_promotion"
                    class="border-1 style-css-domain-input fs-14"
                    solo
                    flat
                    dense
                    readonly
                  >
                  </v-text-field>
                </v-col>
              </v-tab-item>
            </v-tabs-items>
          </div>
          <div>
            <v-row>
              <v-col cols="6">
                <v-row class="ml-10">
                  <v-col cols="auto">
                    <p class="font-weight-bold fs-16">
                      Ảnh thu nhỏ <span class="error--text">*</span>
                    </p>
                  </v-col>

                  <v-col cols="2">
                    <SelectFile
                      id="input_file_img_zoom_out_promotion_edit"
                      ref="input_file_img_zoom_out_promotion_edit"
                      :fixed="false"
                      :hidden="true"
                      :required="required_img_zoom_out_promotion"
                      @set_file="file_selected_zoom_out_promotion"
                    ></SelectFile>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="6">
                <v-row>
                  <v-col cols="2">
                    <p class="font-weight-bold fs-16">
                      Ảnh bìa <span class="error--text">*</span>
                    </p>
                  </v-col>

                  <v-col cols="2">
                    <SelectFile
                      id="input_file_img_avatar_promotion_edit"
                      ref="input_file_img_avatar_promotion_edit"
                      :fixed="false"
                      :hidden="true"
                      :required="required_img_avatar_promotion"
                      @set_file="file_selected_avatar_promotion"
                    ></SelectFile>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </div>
          <p class="mb-0 fs-16 font-weight-bold">Mã khuyến mại</p>
          <v-row>
            <v-col cols="11" class="py-0 pr-0">
              <v-text-field
                v-model="code_promotion"
                class="border-1 fs-14"
                solo
                flat
                readonly
                placeholder="Nhập mã code khuyến mại"
                dense
              >
              </v-text-field>
            </v-col>
          </v-row>
        </div>

        <div class="ml-16">
          <p class="mb-0 fs-16 font-weight-bold">Thời gian khuyến mại</p>
          <v-row>
            <v-col cols="6" class="py-0">
              <v-row>
                <v-col class="pb-0 font-weight-bold fs-16 pr-1" cols="auto"
                  >Thời gian bắt đầu<span class="red--text ml-1">*</span></v-col
                >
                <v-col cols="4" class="px-0 pb-0">
                  <v-text-field
                    v-model="time_checkin"
                    type="time"
                    readonly
                    placeholder="HH:mm:ss"
                    class="border-1 ml-2"
                    style="max-width: 300px"
                    solo
                    flat
                    dense
                    hide-details
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-dialog
                    ref="menuStart"
                    v-model="menuStart"
                    :return-value.sync="startDate"
                    offset-y
                    disabled
                    transition="scale-transition"
                    width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="dateTime"
                        placeholder="dd/mm/yyyy"
                        append-icon="mdi-calendar"
                        solo
                        dense
                        readonly
                        flat
                        class="border-1"
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="date"
                      disabled
                      @input="menuStart = false"
                    ></v-date-picker>
                  </v-dialog>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="6" class="py-0">
              <v-row>
                <v-col cols="auto" class="fs-16 font-weight-bold pl-0 pr-1"
                  >Thời gian kết thúc
                  <span class="red--text ml-1">*</span></v-col
                >
                <v-col cols="4" class="px-0">
                  <v-text-field
                    v-model="time_checkout"
                    type="time"
                    readonly
                    placeholder="HH:mm:ss"
                    class="border-1 ml-2"
                    style="max-width: 160px"
                    solo
                    flat
                    dense
                    hide-details
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="4" class="">
                  <v-menu
                    ref="menuEnd"
                    v-model="menuEnd"
                    disabled
                    :close-on-content-click="false"
                    :return-value.sync="endDate"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
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
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="date1"
                      disabled
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
              class="fs-16 font-weight-bold mr-5 mt-4"
              style="padding-right: 80px"
            >
              Đánh giá
            </div>
            <v-switch
              v-model="status_evaluate_promotion"
              color="#47bbff"
              inset
              disabled
              :true-value="1"
              :false-value="0"
            ></v-switch>
          </div>
          <div class="d-flex">
            <div class="fs-16 font-weight-bold mr-5 mt-4">
              Có thể bạn quan tâm
            </div>
            <v-switch
              v-model="status_care_promotion"
              inset
              disabled
              color="#47bbff"
              :false-value="0"
              :true-value="1"
            ></v-switch>
          </div>
          <div>
            <p class="ma-0 fs-16 font-weight-bold">
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
                    v-model="language.category_posts_content_promotion"
                    disabled
                    use-custom-image-handler
                    @text-change="
                      language.category_posts_content_promotion_error = []
                    "
                  ></vue-editor>
                </v-col>
              </v-tab-item>
            </v-tabs-items>
          </div>
        </div>
      </div>
    </div>
    <!-- end khuyến mại -->
  </div>
</template>

<script>
import moment from 'moment'

import SelectFile from '~/components/Selected/File'
import BASE from '~/assets/configurations/BASE_URL'
export default {
  components: {
    SelectFile,
  },
  props: {
    open: {
      type: Number,
      required: true,
    },
    data: {
      type: Object,
      default: null,
    },
  },
  data: (vm) => ({
    date: new Date().toISOString().substr(0, 10),
    date1: new Date().toISOString().substr(0, 10),
    endDate: new Date().toISOString().substr(0, 10),
    startDate: new Date().toISOString().substr(0, 10),
    statusDefault: 1,
    time_checkin: '07:30:59',
    time_checkout: '17:30:59',
    menuStart: false,
    menuEnd: false,
    menu: false,
    page_status: null,
    text_save_publication: null,
    choose_form_error: [],
    choose_status_category: [],
    open_cancel: false,
    // mặc định
    tab: null,
    tab1: null,
    tab2: null,
    tab3: null,
    name_posts_default: null,
    name_posts_default_error: [],
    category_posts_default: [],
    category_posts_default_error: [],
    path_default: null,
    path_default_error: [],
    required_img_zoom_out_default: false,
    required_img_avatar_default: false,
    status_evaluate_default: 1,
    stauts_care_default: 1,
    category_posts_content_default: null,
    category_posts_content_default_error: [],
    languages: [],
    image_zoom_out_url_default: '',
    image_avatar_url_default: '',
    avatar_default: '',
    zoom_out_default: '',

    // end mặc định
    // khuyến mại
    zoom_out_promotion: '',
    avatar_promotion: '',
    name_posts_promotion: '',
    name_posts_promotion_error: [],
    path_promotion: '',
    path_promotion_error: [],
    required_img_zoom_out_promotion: false,
    required_img_avatar_promotion: false,
    code_promotion: '',
    category_posts_promotion: '',
    category_posts_promotion_error: [],
    time_start: null,
    time_end: null,
    dialog_time_end: false,
    dialog_time_start: false,
    status_care_promotion: 1,
    status_evaluate_promotion: 1,
    category_posts_content_promotion: null,
    category_posts_content_promotion_error: [],
    image_avatar_url_promotion: '',
    image_zoom_out_url_promotion: '',

    // end khuyến mại

    choose_form: 1,
    url_web: BASE,
    form_status: [
      {
        value: 1,
        text: 'mặc định',
        status: 1,
      },
      {
        value: 2,
        text: 'khuyến mại',
        status: 2,
      },
    ],
  }),
  computed: {
    dateTime() {
      const strDate = this.date
      if (!strDate) return ''
      return moment(strDate).format('DD/MM/YYYY')
    },
    dateTime1() {
      const strDate = this.date1
      if (!strDate) return ''
      return moment(strDate).format('DD/MM/YYYY')
    },
  },
  watch: {
    open(value) {
      if (value === 4) {
        this.$store.commit('app/checkBack', true)
        this.text_save_publication = this.data.post.save_status
        this.getlist()
        if (this.data.post.post_type === 1) {
          this.getdetail()
          // console.log('1')
        }
        if (this.data.post.post_type === 2) {
          // console.log('2')
          this.get_detail()
        }
      }
    },
    data(value) {
      this.choose_form = this.data.post.post_type
      if (this.choose_form === 1) {
        this.set_again_default()
      }
      if (this.choose_form === 2) {
        this.set_again_promotion()
      }
    },
  },

  methods: {
    file_selected_avatar_default(file) {
      this.avatar_default = file
      this.required_img_zoom_out_default = false
    },
    file_selected_avatar_promotion(file) {
      this.avatar_promotion = file
      this.required_img_avatar_promotion = false
    },
    file_selected_zoom_out_default(file) {
      this.zoom_out_default = file
      this.required_img_zoom_out_default = false
    },
    file_selected_zoom_out_promotion(file) {
      this.zoom_out_promotion = file
      this.required_img_zoom_out_promotion = false
    },
    get_detail() {
      this.$store
        .dispatch('bai_viet/detail', {
          post_id: this.data.post.id,
        })
        .then((res) => {
          if (!res.error) {
            this.image_avatar_url_promotion = this.data.post.avatar
            if (!this.$isNullOrEmpty(this.image_avatar_url_promotion)) {
              this.$refs.input_file_img_avatar_promotion_edit.set_img(
                this.image_avatar_url_promotion
              )
            }
            this.image_zoom_out_url_promotion = this.data.post.avatar_small
            if (!this.$isNullOrEmpty(this.image_zoom_out_url_promotion)) {
              this.$refs.input_file_img_zoom_out_promotion_edit.set_img(
                this.image_zoom_out_url_promotion
              )
            }
          }
        })
    },
    getdetail() {
      this.$store
        .dispatch('bai_viet/detail', {
          post_id: this.data.post.id,
        })
        .then((res) => {
          if (!res.error) {
            this.image_avatar_url_default = this.data.post.avatar
            if (!this.$isNullOrEmpty(this.image_avatar_url_default)) {
              this.$refs.input_file_img_avatar_default.set_img(
                this.image_avatar_url_default
              )
            }
            this.image_zoom_out_url_default = this.data.post.avatar_small
            if (!this.$isNullOrEmpty(this.image_zoom_out_url_default)) {
              this.$refs.input_file_img_zoom_out_default.set_img(
                this.image_zoom_out_url_default
              )
            }
          }
        })
    },
    getlist() {
      this.$store.dispatch('bai_viet/category_post', {}).then((response) => {
        if (!response.error) {
          response.data.data.map((item) => {
            this.choose_status_category.push({
              text: item.tilte,
              value: String(item.category_post_id),
            })
          })
        }
      })
    },

    // lấy dữ liệu khuyến mại
    set_again_promotion() {
      const LANGUAGE = [...this.$store.state.app.languages]
      if ((LANGUAGE || []).length !== 0) {
        for (let i = 0; i < LANGUAGE.length; i++) {
          LANGUAGE[i] = {
            ...LANGUAGE[i],
            name_posts_promotion: this.data.postLangs[i].post_name,
            name_posts_promotion_error: [],
            path_promotion: this.data.postLangs[i].url_seo,
            path_promotion_error_error: [],
            category_posts_content_promotion: this.data.postLangs[i].content,
            category_posts_content_promotion_error: [],
          }
        }
      }
      this.languages = [...LANGUAGE]
      this.tab = null
      this.tab1 = null
      this.tab2 = null
      this.time_checkin = moment(
        this.data.post.promotions_start,
        'DD/MM/YYYY HH:mm:ss'
      ).format('HH:mm:ss')
      this.time_checkout = moment(
        this.data.post.promotions_end,
        'DD/MM/YYYY HH:mm:ss'
      ).format('HH:mm:ss')

      this.date = moment(
        this.data.post.promotions_start,
        'DD/MM/YYYY HH:mm:ss'
      ).format('YYYY-MM-DD')

      this.date1 = moment(
        this.data.post.promotions_end,
        'DD/MM/YYYY HH:mm:ss'
      ).format('YYYY-MM-DD')
      this.status_evaluate_promotion = this.data.post.interested_status
      this.status_care_promotion = this.data.post.vote_status
      this.category_posts_promotion = this.data.post.category_post_ids.split(
        ','
      )
      this.code_promotion = this.data.post.promotions_code
      this.page_status = this.data.post.status
    },
    // lấy dữ liệu mặc định
    set_again_default() {
      const LANGUAGE = [...this.$store.state.app.languages]
      if ((LANGUAGE || []).length !== 0) {
        for (let i = 0; i < LANGUAGE.length; i++) {
          LANGUAGE[i] = {
            ...LANGUAGE[i],
            name_posts_default: this.data.postLangs[i].post_name,
            name_posts_default_error: [],
            path_default: this.data.postLangs[i].url_seo,
            path_default_error: [],
            category_posts_content_default: this.data.postLangs[i].content,
            category_posts_content_default_error: [],
          }
        }
      }
      this.languages = [...LANGUAGE]
      this.tab = null
      this.tab1 = null
      this.tab2 = null
      this.status_evaluate_default = this.data.post.interested_status
      this.stauts_care_default = this.data.post.vote_status
      this.category_posts_default = this.data.post.category_post_ids.split(',')
      this.page_status = this.data.post.status
    },

    toggle() {
      this.$emit('toggle')
    },
  },
}
</script>
<style lang="scss">
.main_list_posts {
  .style-css-domain-input {
    .v-text-field__slot {
      margin-left: 45px;
    }
  }
  .actions-coordinates-1 {
    position: fixed;
    z-index: 1;
    right: 0;
    top: 92px;
    background-color: #f5f7fe;
  }
  .actions-coordinates-2 {
    position: fixed;
    padding-bottom: 20px;
    z-index: 3;
    right: 0;
    bottom: 0;
    background-color: #f5f7fe;
  }
}
</style>
