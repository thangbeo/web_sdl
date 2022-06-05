<template>
  <div class="main_view_posts">
    <div class="d-flex w-100 actions-coordinates-1">
      <div class="flex-grow-1"></div>

      <div class="d-flex w-100 actions-coordinates-2">
        <div class="flex-grow-1"></div>
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

    <v-container class="ml-6 mb-12">
      <v-row>
        <div class="fs-18 font-weight-bold">Cấu hình chung</div>
        <v-col cols="12">
          <div class="d-flex">
            <div class="fs-16 pt-1 font-weight-bold mr-10">Hiển thị/ Ẩn</div>
            <v-switch
              v-model="status_general_configuration"
              inset
              disabled
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
                    readonly
                    dense
                    @input="language.title_edit_posts_errors = []"
                  >
                  </v-text-field>
                </v-col>
              </v-tab-item>
            </v-tabs-items>
          </div>
        </v-col>

        <v-col class="py-0" cols="12">
          <div class="ml-1">
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
                <div
                  class="mt-2 ml-2 fs-14 grey--text"
                  style="position: absolute; z-index: 1"
                >
                  {{ url_web.URL_WEB }}
                </div>
                <v-col class="pa-0" cols="10">
                  <v-text-field
                    v-model="language.path"
                    :error-messages="language.path_error"
                    class="border-1 style-css-domain-input fs-14"
                    solo
                    flat
                    dense
                    readonly
                    @input="language.path_error = []"
                  >
                  </v-text-field>
                </v-col>
              </v-tab-item>
            </v-tabs-items>
          </div>
        </v-col>
        <v-col cols="12" class="pt-0">
          <p class="ma-0 pb-2 fs-16 font-weight-bold">
            Ảnh bìa <span class="error--text ml-1">*</span>
          </p>
          <select-file
            id="input_file_update_posts"
            ref="input_file_update_posts"
            :fixed="false"
            :hidden="true"
            :required="required_img"
            @set_file="file_selected"
          ></select-file>
        </v-col>
        <v-col cols="12" class="">
          <div class="fs-18 font-weight-bold">Bài viết</div>
          <posts ref="posts_category" :data="data"></posts>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import Folder from '~/assets/configurations/Folder_Config'
import BASE from '~/assets/configurations/BASE_URL'
import SelectFile from '~/components/Selected/File'
import Posts from '~/components/CategoryPosts/ViewPost.vue'
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
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      open_cancel: false,
      open_change: false,
      status_general_configuration: 1,
      tab: null,
      tab1: null,
      title_edit_posts: null,
      required_img: false,
      hidden: true,
      reset_file: null,
      file_img: '',
      path: null,
      url_web: BASE,
      languages: [],
      arr: [],
      url_avatar: '',
      title: null,
      list_post_edit: [],
      listPost: [],
    }
  },

  watch: {
    open(value) {
      if (value === 4) {
        this.$store.commit('app/checkBack', true)
        this.set_again()
      }
    },
  },
  methods: {
    // set_post(items) {
    //   this.list_post_edit = [...items]
    // },
    // deleted_post(ids) {
    //   this.list_deleted_post = [...ids]
    // },

    set_again() {
      const lang = [...this.$store.state.app.languages]

      if ((lang || []).length !== 0) {
        this.url_avatar = this.data.categoryPost.avatar
        if (!this.$isNullOrEmpty(this.url_avatar)) {
          this.$refs.input_file_update_posts.set_img(this.url_avatar)
        }
        this.status_general_configuration = this.data.categoryPost.status

        this.id = this.data.categoryPost.id

        this.arr = this.data.categoryPostLang

        for (let i = 0; i < lang.length; i++) {
          lang[i] = {
            ...lang[i],
            title_edit_posts: this.arr[i].tilte,
            title_edit_posts_errors: [],
            path: this.arr[i].url_seo,
            path_error: [],
          }
        }
      }
      this.languages = [...lang]
      this.$refs.posts_category.reset(this.data.categoryPost.id)
    },
    file_selected(file) {
      this.file_img = file
      this.required_img = false
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
            } else {
              this.$emit('toggle')
            }
          })
          .catch((e) => {
            this.$log.debug(e)
          })
      } else {
        this.update_post(this.url_avatar)
      }
    },

    toggle() {
      this.$emit('toggle')
    },
  },
}
</script>
<style lang="scss">
.main_view_posts {
  .style-css-domain-input {
    .v-text-field__slot {
      margin-left: 45px;
    }
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
    z-index: 3;
    padding-bottom: 20px;
    padding-top: 10px;
    right: 0;
    bottom: 0;
    background-color: #f5f7fe;
  }
}
</style>
