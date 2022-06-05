<template>
  <div class="main_edit_posts">
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
      <div class="d-flex w-100 actions-coordinates-2 pb-5 pt-3">
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
      <v-row class="mt-9 mb-16">
        <div class="fs-18 font-weight-bold">Cấu hình chung</div>
        <v-col cols="12">
          <div class="d-flex">
            <div class="fs-16 pt-1 font-weight-bold mr-10">Hiển thị/ Ẩn</div>
            <v-switch
              v-model="status_general_configuration"
              inset
              :false-value="0"
              :true-value="1"
              class="ma-0"
              color="#47bbff"
            ></v-switch>
          </div>
        </v-col>
        <v-col class="py-0" cols="12">
          <div class="ml-1">
            <p class="ma-0 fs-16 font-weight-bold">
              Tiêu đề <span class="error--text ml-1">*</span>
            </p>
            <v-tabs v-model="tab" background-color="#F5F7FE">
              <!-- <v-tabs-slider color="yellow"></v-tabs-slider> -->
              <v-tab
                v-for="(language, index) in languages"
                :key="`${index}-${language}`"
                class="text-none"
              >
                <!-- active-class="white--text grey darken-2" -->

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
                    v-model="language.title_edit_posts"
                    :error-messages="language.title_edit_posts_errors"
                    placeholder="Nhập tiêu đề"
                    class="border-1 fs-14"
                    solo
                    flat
                    dense
                    @input="language.title_edit_posts_errors = []"
                  >
                  </v-text-field>
                </v-col>
              </v-tab-item>
            </v-tabs-items>
          </div>
        </v-col>

        <v-col class="py-0" cols="10">
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
        <v-col cols="12" class="pt-0">
          <p class="ma-0 pb-2 fs-16 font-weight-bold">
            Ảnh bìa <span class="error--text ml-1">*</span>
          </p>
          <select-file
            id="input_file_update_posts"
            ref="input_file_update_posts"
            :required="required_img"
            @set_file="file_selected"
          ></select-file>
        </v-col>
        <v-col cols="12" class="">
          <div class="fs-18 font-weight-bold">Bài viết</div>
          <posts
            ref="posts_category"
            :data="data"
            :posttype="post_is_type"
            :listisreset="list_is_reset"
            @post_add="set_post"
          ></posts>
        </v-col>
      </v-row>
    </v-container>
    <change-name
      :open="open_change"
      @toggle="open_change = !open_change"
      @OK="replication_post"
    />
    <yes-no-alert
      :open="open_cancel"
      alert-msg="Bạn có chắc chắn muốn thoát?"
      @toggle="open_cancel = !open_cancel"
      @OK="toggle"
    >
    </yes-no-alert>
    <yes-no-alert
      :open="open_add"
      alert-msg="Bạn có chắc chắn muốn cập nhật danh mục bài viết?"
      @toggle="open_add = !open_add"
      @OK="save"
    >
    </yes-no-alert>
    <yes-no-alert
      :open="open_reset"
      alert-msg="Bạn có chắc chắn muốn đặt lại danh mục bài viết?"
      @toggle="open_reset = !open_reset"
      @OK="reset_data"
    >
    </yes-no-alert>
  </div>
</template>

<script>
import ChangeName from '~/components/CategoryPosts/ChangeName'
import Folder from '~/assets/configurations/Folder_Config'
import BASE from '~/assets/configurations/BASE_URL'
import SelectFile from '~/components/Selected/File'
import Posts from '~/components/CategoryPosts/edit/Post.vue'
export default {
  components: {
    SelectFile,
    Posts,
    ChangeName,
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
      list_is_reset: false,
      open_cancel: false,
      open_reset: false,
      open_change: false,
      open_add: false,
      status_general_configuration: 1,
      tab: null,
      tab1: null,
      title_edit_posts: null,
      required_img: false,
      hidden: true,
      reset_file: null,
      file_img: '',
      file_img1: '',
      path: null,
      url_web: BASE,
      languages: [],
      arr: [],
      url_avatar: '',
      title: null,
      list_post_edit: [],

      listPost: [],
      post_is_type: {},
      listPostNumberIndex: [],
      check_required: 0,
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
    validate_url(object) {
      if ((object.path || '').trim().length !== 0) {
        if (this.$isHasVietnamese(object.path) || object.path.includes(' ')) {
          object.path_error = 'Không đúng định dạng link website'
        } else {
          object.path_error = ''
        }
      }
    },
    reset_data() {
      const lang = [...this.$store.state.app.languages]
      this.list_is_reset = true
      if ((lang || []).length !== 0) {
        this.url_avatar = ''

        this.$refs.input_file_update_posts.reset()

        this.status_general_configuration = 1
        this.check_required = 0
        this.id = this.data.categoryPost.id

        this.arr = this.data.categoryPostLang
        for (let i = 0; i < lang.length; i++) {
          lang[i] = {
            ...lang[i],
            title_edit_posts: '',
            title_edit_posts_errors: [],
            path: '',
            path_error: [],
          }
        }
      }
      this.list_post_edit_id = []
      this.languages = [...lang]
      this.list_post_edit = []
      this.$refs.posts_category.reset_id(this.data.categoryPost.id)
    },
    replication_post(name) {
      this.$store
        .dispatch('danh_muc_bai_viet/replication_post', {
          cat_post_id: this.id,
          title: name,
        })
        .then((response) => {
          if (!response.error) {
            this.$emit('success')
            this.$emit('toggle')
            this.$showSuccess(this, 'Nhân bản danh mục bài viết thành công')
          }
        })
      this.open_change = false
    },

    set_post(items) {
      this.list_is_reset = false
      this.list_post_edit = [...items]
    },

    set_again() {
      const lang = [...this.$store.state.app.languages]
      this.$refs.input_file_update_posts.reset('')
      if ((lang || []).length !== 0) {
        this.url_avatar = this.data.categoryPost.avatar
        if (!this.$isNullOrEmpty(this.url_avatar)) {
          this.$refs.input_file_update_posts.set_img(this.url_avatar)
        }
        this.status_general_configuration = this.data.categoryPost.status
        this.id = this.data.categoryPost.id
        this.check_required = 1
        this.arr = this.data.categoryPostLang
        this.post_is_type = this.data.categoryPost
        for (let i = 0; i < lang.length; i++) {
          lang[i] = {
            ...lang[i],
            title_edit_posts:
              (this.arr[i] || '').length !== 0 ? this.arr[i].tilte : '',
            title_edit_posts_errors: [],
            path: (this.arr[i] || '').length !== 0 ? this.arr[i].url_seo : '',
            path_error: [],
          }
        }
      }
      this.languages = [...lang]
      this.list_post_edit = []
      this.$refs.posts_category.reset(this.data.categoryPost)
    },
    file_selected(file) {
      this.check_required = 1
      this.file_img = file
      this.file_img1 = file
      this.required_img = false
    },

    upload_file_view() {
      if (!this.$isNullOrEmpty(this.file_img1)) {
        const formData = new FormData()
        formData.append('file', this.file_img1)
        const folder = Folder.danh_muc_bai_viet
        const data = { formData, folder }
        this.$store
          .dispatch('uploadImg/uploadFile', data)
          .then((response) => {
            if (!response.error) {
              // this.update_post(response.data.data.image_url)
              this.quest_privew(response.data.data.image_url)
            }
          })
          .catch((e) => {
            this.$log.debug(e)
          })
      } else {
        this.quest_privew(this.url_avatar)
      }
    },
    upload_file() {
      if (!this.$isNullOrEmpty(this.file_img)) {
        const formData = new FormData()
        formData.append('file', this.file_img)
        const folder = Folder.danh_muc_bai_viet
        const data = { formData, folder }
        this.$store
          .dispatch('uploadImg/uploadFile', data)
          .then((response) => {
            if (!response.error) {
              this.update_post(response.data.data.image_url)
              // this.quest_privew(response.data.data.image_url)
            }
          })
          .catch((e) => {
            this.$log.debug(e)
          })
      } else {
        this.update_post(this.url_avatar)
        // this.quest_privew(this.url_avatar)
      }
    },
    quest_privew(urlImg) {
      const categoryLangUpdates = []
      for (let i = 0; i < this.languages.length; i++) {
        categoryLangUpdates.push({
          lang_id: this.languages[i].id,
          title: this.languages[i].title_edit_posts,
          url_seo: this.languages[i].path,
        })
      }
      const listPost = []
      for (let i = 0; i < this.list_post_edit.length; i++) {
        listPost.push(
          String(
            `${this.list_post_edit[i].post_id}-${this.list_post_edit[i].status}`
          )
        )
      }
      this.$store
        .dispatch('danh_muc_bai_viet/preview_post_category', {
          update_by: 'sadjasd',
          status: this.status_general_configuration,
          avatar: this.file_img1 === 0 ? '' : urlImg,
          list_post: listPost.join(),
          categoryLangUpdates,
          id: this.id,
          category_type: this.data.categoryPost.category_type,
        })
        .then((res) => {
          if (!res.error) {
            window.open(res.data.data)
          }
        })
    },
    update_post(urlImg) {
      const categoryLangUpdates = []
      for (let i = 0; i < this.languages.length; i++) {
        categoryLangUpdates.push({
          lang_id: this.languages[i].id,
          title: this.languages[i].title_edit_posts,
          url_seo: this.languages[i].path,
        })
      }
      const listPost = []
      for (let i = 0; i < this.list_post_edit.length; i++) {
        listPost.push(
          String(
            `${this.list_post_edit[i].post_id}-${this.list_post_edit[i].status}`
          )
        )
      }

      this.$store
        .dispatch('danh_muc_bai_viet/update_post', {
          update_by: 'sadjasd',
          status: this.status_general_configuration,
          avatar: urlImg,
          list_post: listPost.join(),
          categoryLangUpdates,
          id: this.id,
        })
        .then((response) => {
          if (!response.error) {
            this.$emit('toggle')
            this.$emit('success')
            this.$showSuccess(this, 'Cập nhật danh mục bài viết thành công')
          }
        })
    },
    save_view() {
      let hasErrors = false
      let count = 0
      for (let i = 0; i < this.languages.length; i++) {
        if ((this.languages[i].title_edit_posts || '').length === 0) {
          hasErrors = true

          this.languages[i].title_edit_posts_errors = ['Không được để trống']
          count += 1
          this.tab = i
        }
        if ((this.languages[i].path || '').length !== 0) {
          if (
            this.$isHasVietnamese(this.languages[i].path) ||
            this.languages[i].path.includes(' ')
          ) {
            hasErrors = true
            this.languages[i].path_error = 'Không đúng định dạng link website'
            count += 1
            this.tab1 = i
          }
        }
      }

      if (count > 0) {
        this.$showWarnNotify(this, 'Bạn nhập thiếu thông tin bắt buộc')
      }
      if (this.check_required === 0) {
        hasErrors = true
        this.required_img = true
      }
      if (!hasErrors) {
        this.upload_file_view()
        // this.update_number_index_post()
      }
    },
    save() {
      let hasErrors = false
      let count = 0
      for (let i = 0; i < this.languages.length; i++) {
        if ((this.languages[i].title_edit_posts || '').length === 0) {
          hasErrors = true

          this.languages[i].title_edit_posts_errors = ['Không được để trống']
          count += 1
          this.tab = i
        }
        if ((this.languages[i].path || '').length !== 0) {
          if (
            this.$isHasVietnamese(this.languages[i].path) ||
            this.languages[i].path.includes(' ')
          ) {
            hasErrors = true
            this.languages[i].path_error = 'Không đúng định dạng link website'
            count += 1
            this.tab1 = i
          }
        }
      }

      if (count > 0) {
        this.$showWarnNotify(this, 'Bạn nhập thiếu thông tin bắt buộc')
      }
      if (this.check_required === 0) {
        hasErrors = true
        this.required_img = true
      }
      if (!hasErrors) {
        this.upload_file()
        // this.update_number_index_post()
      }
    },

    toggle() {
      this.$emit('toggle')
    },
  },
}
</script>
<style lang="scss">
.main_edit_posts {
  .v-input__prepend-inner {
    padding-right: 0 !important;
  }

  .actions-coordinates-1 {
    position: fixed;
    z-index: 3 !important;
    right: 0;
    top: 75px;
    background-color: #f5f7fe;
  }
  .actions-coordinates-2 {
    position: fixed;
    z-index: 3 !important;
    right: 0;
    bottom: 0;
    background-color: #f5f7fe;
  }
}
</style>
