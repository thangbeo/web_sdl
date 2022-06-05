<template>
  <div class="main_list_posts">
    <!-- // chức năng -->
    <client-only>
      <div class="d-flex w-100 actions-coordinates-1">
        <div class="flex-grow-1"></div>
        <v-btn
          v-if="choose_form === 1"
          class="text-none white--text mr-3"
          color="#4873C2"
          dark
          depressed
          width="120px"
          @click="quest_view"
        >
          <img class="mr-1" src="~/assets/icon/view.svg" />
          Xem trước
        </v-btn>
        <v-btn
          v-if="choose_form === 2"
          class="text-none white--text mr-3"
          color="#4873C2"
          dark
          depressed
          width="120px"
          @click="quest_view_print"
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
            width="120px"
            dark
            depressed
            @click="open_save = true"
            >Lưu nháp</v-btn
          >
          <!--  @click="demo" -->
          <v-btn
            class="text-none white--text mr-3"
            color="#47BBFF"
            dark
            depressed
            width="120"
            @click="open_save_print = true"
            >Lưu và xuất bản</v-btn
          >
        </div>
      </div>
      <!-- //noi dung -->
      <div class="pb-16">
        <div class="pt-12 ml-16 mr-3">
          <div class="d-flex">
            <div class="font-weight-bold fs-17 pr-7 pt-1">Hiển thị/ Ẩn</div>
            <v-switch
              ref="page_status"
              v-model="page_status"
              color="#47bbff"
              class="mt-0 mr-5"
              inset
              :true-value="1"
              :false-value="0"
              @change="chang_page_status(page_status)"
            ></v-switch>
          </div>
          <p class="ma-0 fs-14 font-weight-bold">
            Mẫu bài viết <span class="error--text ml-1">*</span>
          </p>
          <template>
            <v-row>
              <v-col cols="11" class="py-0 pr-0">
                <v-select
                  v-model="choose_form"
                  :items="form_status"
                  :error-messages="choose_form_error"
                  solo
                  dense
                  flat
                  :menu-props="{ zIndex: '1' }"
                  placeholder="Chọn mẫu bài viết"
                  class="border-1 fs-14"
                  @input="choose_form_error = []"
                  @change="status_form(choose_form)"
                >
                </v-select>
              </v-col>
            </v-row>
          </template>
        </div>
        <!-- // chọn mặc định -->
        <div v-show="choose_form === 1">
          <mac-dinh
            ref="validateDefault"
            :data="data"
            :status="status_page"
            @exits="toggle"
            @Success="success"
          ></mac-dinh>
        </div>

        <!-- // chọn khuyến mại -->
        <div v-show="choose_form === 2">
          <khuyen-mai
            ref="validatePromotion"
            :status="status_page"
            :data="data"
            @exits="toggle"
            @Success="success"
          ></khuyen-mai>
        </div>
      </div>

      <!-- <div>
      <yes-no-alert
        :open="open_reset"
        alert-msg="Bạn chắc chắn muốn đặt lại cấu hình trang?"
        @toggle="open_reset = !open_reset"
        @OK="set_again"
      >
      </yes-no-alert>
    </div> -->
      <yes-no-alert
        :open="open_save"
        alert-msg="Bạn có chắc chắn muốn thêm bài viết?"
        @toggle="open_save = !open_save"
        @OK="save"
      >
      </yes-no-alert>
      <yes-no-alert
        :open="open_save_print"
        alert-msg="Bạn có chắc chắn muốn thêm bài viết?"
        @toggle="open_save_print = !open_save_print"
        @OK="save_print"
      >
      </yes-no-alert>
      <yes-no-alert
        :open="open_cancel"
        alert-msg="Bạn có chắc chắn muốn thoát?"
        @toggle="open_cancel = !open_cancel"
        @OK="toggle"
      >
      </yes-no-alert>
    </client-only>
  </div>
</template>

<script>
import MacDinh from '~/components/bai-viet/Add/MacDinh'
import KhuyenMai from '~/components/bai-viet/Add/KhuyenMai'
import BASE from '~/assets/configurations/BASE_URL'
export default {
  components: { KhuyenMai, MacDinh },
  props: {
    open: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      data: 0,
      open_save: false,
      open_reset: false,
      open_save_print: false,
      open_cancel: false,
      choose_form_error: [],
      choose_form: 1,
      status: null,
      code_promotion: '',
      path: null,
      category_posts_content: '',
      required_img: false,
      file_img: '',
      url_web: BASE,
      page_status: 1,
      status_page: 1,
      zIndex: 0,

      form_status: [
        {
          value: 1,
          text: 'Mặc định',
        },
        {
          value: 2,
          text: 'Khuyến mại',
        },
      ],
    }
  },
  watch: {
    open(value) {
      if (value === 2) {
        this.$store.commit('app/checkBack', true)
        this.set_again()
        // this.toggle()
      }
    },
  },
  methods: {
    chang_page_status(value) {
      this.status_page = value
    },
    quest_view() {
      this.$refs.validateDefault.validate_view()
    },
    quest_view_print() {
      this.$refs.validatePromotion.validata_view()
    },

    save() {
      let hasErrors = false
      if (this.$isNullOrEmpty(this.choose_form)) {
        hasErrors = false
        this.choose_form_error = ['không được để trống']
      }
      if (!hasErrors) {
        if (this.choose_form === 1) {
          this.$refs.validateDefault.validateDefaultSave()
        }
        if (this.choose_form === 2) {
          this.$refs.validatePromotion.validatePromotionSave()
        }
      }
    },
    save_print() {
      let hasErrors = false
      if (this.$isNullOrEmpty(this.choose_form)) {
        hasErrors = false
        this.choose_form_error = ['không được để trống']
      }
      if (!hasErrors) {
        if (this.choose_form === 1) {
          this.$refs.validateDefault.validateDefaultSavePrint()
        }
        if (this.choose_form === 2) {
          this.$refs.validatePromotion.validatePromotionSavePrint()
        }
      }
    },
    status_form(value) {
      this.status = value

      if ((this.status || '').length !== 0) {
        if (this.status === 1) {
          this.$refs.validateDefault.langs()
          this.$refs.validateDefault.getlist()
        }
        if (this.status === 2) {
          this.$refs.validatePromotion.getlist()
          this.$refs.validatePromotion.langs()
        }
      }
    },
    set_again() {
      // // this.choose_form = 1
      // if (this.status === 1) {
      //   console.log('1')
      // } else {
      //   console.log('2')
      // }
      this.page_status = 1
      this.choose_form = 1
      this.$refs.validateDefault.resetDefault()
      this.$refs.validatePromotion.resetPromotion()
      this.$refs.validateDefault.getlist()

      // this.$refs.validatePromotion.resetPromotion()
      // this.$refs.validatePromotion.getlist()
    },
    success() {
      this.$emit('success')
    },
    toggle() {
      this.page_status = 1
      this.choose_form = 1
      if (this.status === 1) {
        this.$refs.validateDefault.resetDefault()
      }
      if (this.status === 2) {
        this.$refs.validatePromotion.resetPromotion()
      }
      this.$emit('toggle')
    },

    file_selected(file) {
      this.file_img = file
      this.required_img = false
    },
  },
}
</script>

<style lang="scss">
.main_list_posts {
  .actions-coordinates-1 {
    position: fixed;
    z-index: 5;
    right: 0;
    top: 75px;
    background-color: #f5f7fe;
  }
  .actions-coordinates-2 {
    position: fixed;
    padding-bottom: 20px;
    padding-top: 10px;
    z-index: 5;
    right: 0;
    bottom: 0;
    background-color: #f5f7fe;
  }
}
</style>
