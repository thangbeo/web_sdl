<template>
  <div>
    <div class="d-flex w-100 actions-coordinates-1">
      <div class="flex-grow-1"></div>
      <v-btn
        class="text-none white--text mr-3"
        color="#4873C2"
        dark
        depressed
        width="120px"
        @click="open_reset = true"
      >
        <img class="mr-1" src="~/assets/icon/change.png" />
        Đặt lại
      </v-btn>
      <v-btn
        class="text-none white--text mr-3"
        color="#4873C2"
        dark
        depressed
        width="120px"
        :loading="loading_review"
        :disabled="loading_review"
        @click="check_review"
      >
        <img class="mr-1" src="~/assets/icon/view.svg" />
        Xem trước
        <template v-slot:loader>
          <span><span>Xin chờ...</span></span>
        </template>
      </v-btn>
    </div>
    <div class="d-flex w-100 actions-coordinates-2">
      <div class="flex-grow-1"></div>
      <v-btn
        color="#FF0F59"
        class="text-none white--text mr-3"
        depressed
        width="90"
        @click="$store.commit('product/toggle_cancel')"
      >
        Hủy
      </v-btn>
      <v-btn
        class="text-none white--text mr-3 mb-5"
        color="#47BBFF"
        dark
        depressed
        width="90"
        @click="open_save = true"
      >
        Lưu
      </v-btn>
    </div>
    <v-container class="ml-6">
      <v-row class="my-10">
        <v-col cols="12">
          <div class="d-flex align-center">
            <div class="fs-17 font-weight-bold mr-10">Hiển thị/ Ẩn</div>
            <v-switch
              v-model="hidden"
              color="#47bbff"
              class="ma-0"
              :true-value="1"
              :false-value="0"
              inset
              hide-details
            />
          </div>
        </v-col>
        <v-col class="pb-0" cols="12">
          <p class="ma-0 fs-14 font-weight-bold">
            Tên danh mục <span class="error--text ml-1">*</span>
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
              <v-text-field
                v-model="language.category"
                :error-messages="language.category_msg"
                placeholder="Tên danh mục"
                class="border-1 fs-14"
                solo
                flat
                dense
                @input="language.category_msg = []"
              >
              </v-text-field>
            </v-tab-item>
          </v-tabs-items>
        </v-col>
        <v-col class="py-0" cols="12">
          <p class="ma-0 fs-14 font-weight-bold">Mô tả ngắn</p>
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
              <v-textarea
                v-model="language.description"
                placeholder="Mô tả ngắn"
                rows="2"
                class="border-1 fs-14"
                solo
                flat
              >
              </v-textarea>
            </v-tab-item>
          </v-tabs-items>
        </v-col>
        <v-col class="py-0" cols="12">
          <p class="ma-0 fs-14 font-weight-bold">URL thân thiện cho SEO</p>

          <v-col class="pa-0 d-flex" cols="10"> </v-col>

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
              <div class="d-flex">
                <v-text-field
                  v-model="language.path"
                  :error-messages="language.path_msg"
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
                      style="width: 36px; min-width: 36px"
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
        <v-col cols="12" class="my-0">
          <div class="d-flex align-center">
            <div class="fs-17 font-weight-bold mr-10">Thêm vào Menu</div>
            <v-switch
              v-model="menu_add"
              color="#47bbff"
              class="ma-0"
              :true-value="1"
              :false-value="0"
              inset
              hide-details
            />
          </div>
        </v-col>
        <v-col cols="12">
          <p class="ma-0 mb-1 fs-14 font-weight-bold">
            Ảnh bìa <span class="error--text ml-1">*</span>
          </p>
          <select-file
            id="input_file"
            ref="input_file"
            :required="required_img"
            :hidden="true"
            @set_file="file_selected"
          />
        </v-col>
        <v-col cols="12" class="pb-0">
          <div class="d-flex align-center">
            <div class="fs-17 font-weight-bold mr-10">Bản đồ</div>
            <v-switch
              v-model="map"
              class="ma-0"
              color="#47bbff"
              inset
              hide-details
            />
          </div>
          <v-row class="mt-2 ml-4">
            <v-col
              v-for="(service, i) in map_services"
              :key="`${i}-${service.id}`"
              cols="auto"
            >
              <v-checkbox
                v-model="service.value"
                class="ma-0 mr-12"
                :label="service.name"
                hide-details
                :true-value="1"
                :false-value="0"
                :ripple="false"
                :disabled="!map"
              >
              </v-checkbox>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" class="mt-6">
          <div class="fs-17 font-weight-bold">Sản phẩm</div>
          <product ref="product_category" @set_product="set_product" />
        </v-col>
      </v-row>
    </v-container>

    <yes-no-alert
      :open="open_reset"
      alert-msg="Bạn chắc chắn muốn đặt lại cấu hình trang?"
      @toggle="open_reset = !open_reset"
      @OK="set_again"
    />

    <yes-no-alert
      :open="$store.state.product.open_cancel"
      alert-msg="Bạn chắc chắn muốn hủy không?"
      @toggle="$store.commit('product/toggle_cancel')"
      @OK="toggle"
    />

    <yes-no-alert
      :open="open_save"
      alert-msg="Bạn chắc chắn muốn lưu không?"
      @toggle="open_save = !open_save"
      @OK="add"
    />
  </div>
</template>

<script>
import SelectFile from '~/components/Selected/File'
import product from '~/components/CategoryProduct/add/product'

export default {
  components: {
    SelectFile,
    product,
  },
  props: {
    open: {
      type: Number,
      required: true,
    },
  },
  data: () => ({
    tab: null,
    tab1: null,
    tab2: null,
    hidden: 1,
    languages: [],
    menu_add: 1,
    file_img: '',
    required_img: false,
    open_reset: false,
    list_product: [],
    map: true,
    map_services: [],
    open_save: false,
    loading_review: false,
  }),
  watch: {
    open(value) {
      if (value === 2) {
        this.$store.commit('app/checkBack', true)
        this.set_again()
      }
    },
  },
  methods: {
    toggle() {
      this.$emit('toggle')
    },
    file_selected(file) {
      this.file_img = file
      this.required_img = false
    },
    validate_url(object) {
      if ((object.path || '').trim().length !== 0) {
        if (this.$isHasVietnamese(object.path) || object.path.includes(' ')) {
          object.path_msg = 'URL không hợp lệ'
        } else {
          object.path_msg = ''
        }
      }
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
    set_again() {
      const LANGUAGE = [...this.$store.state.app.languages]

      if ((LANGUAGE || []).length !== 0) {
        for (let i = 0; i < LANGUAGE.length; i++) {
          LANGUAGE[i] = {
            ...LANGUAGE[i],
            category: '',
            category_msg: [],
            description: '',
            path: '',
            path_msg: [],
          }
        }
      }
      this.languages = [...LANGUAGE]

      this.tab = null
      this.tab1 = null
      this.tab2 = null
      this.hidden = 1
      this.menu_add = 1
      this.file_img = ''
      this.required_img = false
      this.list_product = []
      this.map = true
      this.map_services = []
      this.$store
        .dispatch('category-product/list_around_location')
        .then((res) => {
          if (!res.error) {
            const arr = []
            if ((res.data.data || []).length !== 0) {
              for (let i = 0; i < res.data.data.length; i++) {
                arr[i] = { ...res.data.data[i], value: 0 }
              }
            }
            this.map_services = [...arr]
          }
        })
      this.$refs.product_category.reset()
      this.$refs.input_file.reset()
    },
    set_product(items) {
      this.list_product = [...items]
    },
    add() {
      let hasErrors = false
      let count = 0
      let count1 = 0

      for (let i = 0; i < this.languages.length; i++) {
        if ((this.languages[i].category || '').trim().length === 0) {
          hasErrors = true
          this.languages[i].category_msg = 'Không được để trống'
          count += 1
          this.tab = i
        } else if (this.languages[i].category.length > 500) {
          hasErrors = true
          this.languages[i].category_msg = 'Không được vượt quá 500 ký tự'
          count += 1
          this.tab = i
        }

        if ((this.languages[i].path || '').trim().length !== 0) {
          if (
            this.$isHasVietnamese(this.languages[i].path) ||
            this.languages[i].path.includes(' ')
          ) {
            hasErrors = true
            this.languages[i].path_msg = 'URL không hợp lệ'
            count1 += 1
            this.tab1 = i
          }
        }
      }

      if (count > 0) {
        this.$showWarnNotify(this, 'Bạn nhập thiếu thông tin bắt buộc')
      }
      if (count1 > 0) {
        this.$showWarnNotify(this, 'Định dạng url không hợp lệ')
      }

      if ((this.file_img || []).length === 0) {
        hasErrors = true
        this.required_img = true
      }

      if (!hasErrors) {
        const folder = this.$store.state['category-product'].folder_upload
        const formData = new FormData()
        formData.append('file', this.file_img)
        this.$store
          .dispatch('uploadImg/uploadFile', { folder, formData })
          .then((res) => {
            if (!res.error) {
              const langs = []
              const aroundLocations = []
              const products = []

              for (let i = 0; i < this.languages.length; i++) {
                langs.push({
                  lang_id: this.languages[i].id,
                  name: this.languages[i].category,
                  introduce: this.languages[i].description,
                  url_seo: this.languages[i].path,
                })
              }

              for (let i = 0; i < this.map_services.length; i++) {
                if (this.map_services[i].value === 1) {
                  aroundLocations.push({
                    around_location_id: this.map_services[i].id,
                  })
                }
              }

              for (let i = 0; i < this.list_product.length; i++) {
                products.push({
                  product_id: this.list_product[i].id,
                  product_type: this.list_product[i].product_type,
                  enable: this.list_product[i].status,
                })
              }

              const DATA = {
                status: 1,
                enable: this.hidden,
                langs,
                add_to_menu: this.menu_add,
                thumbnail: res.data.data.image_url,
                map: this.map ? 1 : 0,
                aroundLocations,
                product_ids: products,
              }

              this.$store
                .dispatch('category-product/add_category', DATA)
                .then((res) => {
                  if (!res.error) {
                    this.toggle()
                    this.$showSuccess(this, 'Thêm danh mục sản phẩm thành công')
                    this.$emit('OK')
                  }
                })
            }
          })
      }
    },
    upload_file() {
      const folder = this.$store.state['category-product'].folder_upload
      const formData = new FormData()
      formData.append('file', this.file_img)
      this.$store
        .dispatch('uploadImg/uploadFile', { folder, formData })
        .then((res) => {
          if (!res.error) {
            this.save_req(res.data.data.image_url)
          }
        })
    },
    save_req(img) {
      const langs = []
      const aroundLocations = []
      const products = []

      for (let i = 0; i < this.languages.length; i++) {
        langs.push({
          lang_id: this.languages[i].id,
          name: this.languages[i].category,
          introduce: this.languages[i].description,
          url_seo: this.languages[i].path,
        })
      }

      for (let i = 0; i < this.map_services.length; i++) {
        if (this.map_services[i].value === 1) {
          aroundLocations.push({
            around_location_id: this.map_services[i].id,
          })
        }
      }

      for (let i = 0; i < this.list_product.length; i++) {
        products.push({
          product_id: this.list_product[i].id,
          product_type: this.list_product[i].product_type,
          enable: this.list_product[i].status,
        })
      }

      const DATA = {
        status: 1,
        enable: this.hidden,
        langs,
        add_to_menu: this.menu_add,
        thumbnail: (img || '').length !== 0 ? img : '',
        map: this.map ? 1 : 0,
        aroundLocations,
        product_ids: products,
      }

      this.$store
        .dispatch('category-product/get_review', DATA)
        .then((res) => {
          if (!res.error) {
            if ((res.data.data || '').length !== 0) {
              window.open(res.data.data)
            }
          }
        })
        .finally(() => {
          this.loading_review = false
        })
    },
    check_review() {
      this.loading_review = true

      if ((this.file_img || '').length !== 0) {
        this.upload_file()
      } else {
        this.save_req()
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.actions-coordinates-1 {
  position: fixed;
  z-index: 1;
  right: 0;
  top: 75px;
  background-color: #f5f7fe;
}

.actions-coordinates-2 {
  position: fixed;
  z-index: 3;
  right: 0;
  bottom: 0;
  background-color: #f5f7fe;
}
</style>
