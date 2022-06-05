<template>
  <div class="main_add_posts">
    <div class="d-flex w-100 actions-coordinates-1">
      <div class="flex-grow-1"></div>

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
          >Thêm</v-btn
        >
      </div>
    </div>

    <v-container class="ml-6">
      <v-row class="mt-9">
        <div class="fs-16 font-weight-bold">Cấu hình chung</div>
        <v-col cols="12" class="pb-0">
          <div class="d-flex">
            <div class="fs-16 font-weight-bold mr-10">Hiển thị/ Ẩn</div>
            <v-switch
              v-model="status_general_configuration"
              inset
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
                    v-model="language.title_add_posts"
                    :error-messages="language.posts_msg"
                    placeholder="Tên danh mục"
                    class="border-1 fs-14"
                    solo
                    flat
                    dense
                    @input="language.posts_msg = []"
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
            id="input_file"
            ref="input_file"
            :hidden="true"
            :required="required_img"
            @set_file="file_selected"
          ></select-file>
        </v-col>
        <v-col cols="12" class="pb-12">
          <div class="fs-16 font-weight-bold">Bài viết</div>
          <posts ref="posts_category" @set_posts="set_posts"></posts>
        </v-col>
      </v-row>
    </v-container>
    <yes-no-alert
      :open="open_reset"
      alert-msg="Bạn có chắc chắn muốn đặt lại danh mục bài viết?"
      @toggle="open_reset = !open_reset"
      @OK="set_again"
    >
    </yes-no-alert>
    <yes-no-alert
      :open="open_add"
      alert-msg="Bạn có chắc chắn muốn thêm danh mục bài viết?"
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
import Folder from '~/assets/configurations/Folder_Config'
import BASE from '~/assets/configurations/BASE_URL'
import SelectFile from '~/components/Selected/File'
import Posts from '~/components/CategoryPosts/Posts'
export default {
  components: {
    SelectFile,
    Posts,
  },
  props: {
    open: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      open_cancel: false,
      open_reset: false,
      open_add: false,
      path: null,
      tab: null,
      tab1: null,
      tab_des: null,
      required_img: false,
      status_general_configuration: 1,
      reset_file: null,
      file_img: '',
      image_url: '',
      title_add_posts: null,
      url_web: BASE,
      list_item_post: [],
      languages: [],
      demo: [],
      listPost: [],
    }
  },
  watch: {
    open(value) {
      if (value === 2) {
        this.$store.commit('app/checkBack', true)
        this.set_again()
      }
    },
  },
  methods: {
    save_view() {
      let hasErrors = false
      let count = 0

      for (let i = 0; i < this.languages.length; i++) {
        if ((this.languages[i].title_add_posts || '').trim().length === 0) {
          hasErrors = true
          this.languages[i].posts_msg = ['Không được để trống']
          count += 1
          this.tab = i
        } else if (
          (this.languages[i].title_add_posts || '').trim().length > 200
        ) {
          hasErrors = true
          this.languages[i].posts_msg = ['Nhập không quá 200 kí tự cho phép']
          count += 1
          this.tab1 = i
        }
        if ((this.languages[i].path || '').trim().length !== 0) {
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
      if ((this.file_img || []).length === 0) {
        hasErrors = true
        this.required_img = true
      }

      if (count > 0) {
        this.$showWarnNotify(this, 'Bạn nhập thiếu thông tin bắt buộc')
      }
      if (!hasErrors) {
        this.quest_privew()
      }
    },
    quest_privew() {
      const categoryPostLangs = []

      for (let i = 0; i < this.languages.length; i++) {
        categoryPostLangs.push({
          lang_id: this.languages[i].id,
          title: this.languages[i].title_add_posts,
          url_seo: this.languages[i].path,
        })
      }
      this.listPost = []
      for (let i = 0; i < this.list_item_post.length; i++) {
        // console.log(this.list_item_post[i], 'this.list_item_post[i]')
        this.listPost.push(
          String(
            `${this.list_item_post[i].post_id}-${this.list_item_post[i].status}`
          )
        )
      }
      this.$store
        .dispatch('danh_muc_bai_viet/preview_post_category', {
          create_by: 'id',
          status: this.status_general_configuration,
          avatar: this.image_url,
          list_post: this.listPost.join(),
          categoryPostLangs,
        })
        .then((res) => {
          if (!res.error) {
            window.open(res.data.data)
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
    validate_url(object) {
      if ((object.path || '').trim().length !== 0) {
        if (this.$isHasVietnamese(object.path) || object.path.includes(' ')) {
          object.path_error = 'Không đúng định dạng link website'
        } else {
          object.path_error = ''
        }
      }
    },
    set_posts(items) {
      this.list_item_post = [...items]
    },
    file_selected(file) {
      this.file_img = file
      this.required_img = false
      const formData = new FormData()
      formData.append('file', file)
      const folder = Folder.quan_tri_trang_chu
      const data = { formData, folder }
      this.$store
        .dispatch('uploadImg/uploadFile', data)
        .then((response) => {
          if (!response.error) {
            this.image_url = response.data.data.image_url
          }
        })
        .catch((e) => {
          this.$log.debug(e)
        })
    },
    insert_post() {
      const categoryPostLangs = []

      for (let i = 0; i < this.languages.length; i++) {
        categoryPostLangs.push({
          lang_id: this.languages[i].id,
          title: this.languages[i].title_add_posts,
          url_seo: this.languages[i].path,
        })
      }
      this.listPost = []
      for (let i = 0; i < this.list_item_post.length; i++) {
        // console.log(this.list_item_post[i], 'this.list_item_post[i]')
        this.listPost.push(
          String(
            `${this.list_item_post[i].post_id}-${this.list_item_post[i].status}`
          )
        )
      }

      this.$store
        .dispatch('danh_muc_bai_viet/insert_post', {
          create_by: 'id',
          status: this.status_general_configuration,
          avatar: this.image_url,
          list_post: this.listPost.join(),
          categoryPostLangs,
        })
        .then((response) => {
          if (!response.error) {
            this.$emit('toggle')
            this.$emit('success')
            this.$showSuccess(this, 'Thêm danh mục bài viết thành công')
          }
        })
    },
    save() {
      let hasErrors = false
      let count = 0

      for (let i = 0; i < this.languages.length; i++) {
        if ((this.languages[i].title_add_posts || '').trim().length === 0) {
          hasErrors = true
          this.languages[i].posts_msg = ['Không được để trống']
          count += 1
          this.tab = i
        } else if (
          (this.languages[i].title_add_posts || '').trim().length > 200
        ) {
          hasErrors = true
          this.languages[i].posts_msg = ['Nhập không quá 200 kí tự cho phép']
          count += 1
          this.tab1 = i
        }
        if ((this.languages[i].path || '').trim().length !== 0) {
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
      if ((this.file_img || []).length === 0) {
        hasErrors = true
        this.required_img = true
      }

      if (count > 0) {
        this.$showWarnNotify(this, 'Bạn nhập thiếu thông tin bắt buộc')
      }
      if (!hasErrors) {
        this.insert_post()
      }
    },
    set_again() {
      const lang = [...this.$store.state.app.languages]
      if ((lang || []).length !== 0) {
        for (let i = 0; i < lang.length; i++) {
          lang[i] = {
            ...lang[i],
            title_add_posts: '',
            posts_msg: [],
            path: null,
            path_error: [],
          }
        }
      }
      this.tab = null
      this.tab1 = null
      this.languages = [...lang]
      this.path = null
      this.reset_file = null
      this.status_general_configuration = 1
      this.title_add_posts = null
      this.file_img = ''
      this.list_item_post = []
      this.required_img = false
      this.$refs.input_file.reset()
      this.$refs.posts_category.reset()
    },
    clicked_hidden(value) {
      this.hidden = value
    },
    toggle() {
      this.$emit('toggle')
      this.set_again()
    },
  },
}
</script>
<style lang="scss">
.main_add_posts {
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
    z-index: 4;
    right: 0;
    bottom: 0;
    background-color: #f5f7fe;
  }
}
</style>
