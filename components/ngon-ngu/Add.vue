<template>
  <div style="background-color: #f4f7fe">
    <v-container>
      <v-row class="pt-3">
        <v-col cols="2">
          <v-card-text class="pt-0 pb-0"
            >Ngôn ngữ <span class="error--text">*</span></v-card-text
          >
        </v-col>
        <v-col cols="9" class="pt-0 pb-0">
          <v-text-field
            v-model="name"
            placeholder="Nhập Ngôn ngữ"
            dense
            solo
            flat
            class="fs-14"
            :outlined="nameError.length !== 0"
            :error-messages="nameError"
            @input="nameError = []"
          ></v-text-field
        ></v-col>

        <v-col cols="2">
          <v-card-text class="pt-0 pb-0"
            >Tên hiển thị <span class="error--text">*</span></v-card-text
          >
        </v-col>
        <v-col cols="9" class="pt-0 pb-0">
          <v-text-field
            v-model="display_name"
            placeholder="Nhập Tên hiển thị"
            dense
            solo
            flat
            class="fs-14"
            :outlined="display_nameError.length !== 0"
            :error-messages="display_nameError"
            @input="display_nameError = []"
          ></v-text-field
        ></v-col>

        <v-col cols="2">
          <v-card-text class="pt-0 pb-0"
            >Mã ngôn ngữ <span class="error--text">*</span></v-card-text
          >
        </v-col>
        <v-col cols="9" class="pt-0 pb-0">
          <v-autocomplete
            v-model="code"
            placeholder="Chọn Mã ngôn ngữ"
            class="fs-14"
            :items="list_codeLanguage"
            dense
            solo
            flat
            :outlined="codeError.length !== 0"
            :error-messages="codeError"
            @input="codeError = []"
          ></v-autocomplete
        ></v-col>

        <v-col cols="2">
          <v-card-text class="pt-0 pb-0"
            >Loại tiền tệ <span class="error--text">*</span></v-card-text
          >
        </v-col>
        <v-col cols="9" class="pt-0 pb-0">
          <v-autocomplete
            v-model="currency_type"
            placeholder="Chọn Loại tiền tệ"
            :items="list_commonCurrency"
            item-value="id"
            item-text="code"
            dense
            class="fs-14"
            solo
            flat
            :outlined="currency_typeError.length !== 0"
            :error-messages="currency_typeError"
            @input="currency_typeError = []"
          ></v-autocomplete
        ></v-col>

        <v-col cols="2">
          <v-card-text class="pt-0 pb-0"
            >Menu <span class="error--text">*</span></v-card-text
          >
        </v-col>
        <v-col cols="9" class="pt-0 pb-0">
          <v-autocomplete
            v-model="menu"
            placeholder="Chọn Menu"
            :items="list_menu"
            item-value="id"
            item-text="name"
            dense
            class="fs-14"
            solo
            flat
            :outlined="menuError.length !== 0"
            :error-messages="menuError"
            @input="menuError = []"
          ></v-autocomplete
        ></v-col>

        <v-col cols="2">
          <v-card-text class="pt-0 pb-0"
            >Trạng thái <span class="error--text">*</span></v-card-text
          >
        </v-col>
        <v-col cols="9" class="pt-0 pb-0">
          <v-select
            v-model="status"
            :items="list_status"
            dense
            solo
            flat
            class="fs-14"
            hide-details
          >
            <template v-slot:selection="data">
              <div class="fs-14" :style="`color: ${data.item.color}`">
                {{ data.item.text }}
              </div>
            </template>
            <template v-slot:item="data">
              <div
                :style="`color: ${data.item.color} !important`"
                class="fs-14"
              >
                {{ data.item.text }}
              </div>
            </template>
          </v-select>
        </v-col>
        <v-col cols="11" class="pt-12 d-flex justify-end">
          <v-btn
            color="#FF0F59"
            width="90px"
            class="text-none white--text mr-3"
            depressed
            @click="open_cancel = true"
            >Hủy</v-btn
          >
          <v-btn
            class="white--text text-none"
            width="90px"
            color="#47BBFF"
            depressed
            @click="open_update = true"
            >Lưu</v-btn
          >
        </v-col>
      </v-row>
    </v-container>
    <yes-no-alert
      :open="open_cancel"
      alert-msg="Bạn chắc chắn muốn hủy không?"
      @toggle="open_cancel = !open_cancel"
      @OK="toggle"
    >
    </yes-no-alert>
    <yes-no-alert
      :open="open_update"
      alert-msg="Bạn chắc chắn muốn lưu thông tin ngôn ngữ không?"
      @toggle="open_update = !open_update"
      @OK="save"
    >
    </yes-no-alert>
  </div>
</template>

<script>
export default {
  props: {
    open: {
      type: Number,
      required: true,
    },
  },
  data: () => ({
    open_update: false,
    open_cancel: false,
    code: null,
    codeError: [],
    name: null,
    nameError: [],
    display_name: null,
    display_nameError: [],
    currency_type: null,
    currency_typeError: [],
    menu: null,
    menuError: [],
    list_commonCurrency: [],
    list_menu: [],
    list_codeLanguage: [],
    status: 1,
    list_status: [
      { value: 1, text: 'Hoạt động', color: '#47BBFF' },
      {
        value: 0,
        text: 'Dừng hoạt động',
        color: '#FF0F59',
      },
    ],
  }),
  watch: {
    open(value) {
      if (value === 2) {
        this.$store.commit('app/checkBack', true)
        this.set_commonCurrency()
        this.listMenu()
        this.listCodeLanguage()
        this.reset()
      }
    },
  },
  methods: {
    set_commonCurrency() {
      this.$store.dispatch('language/commonCurrency').then((res) => {
        if (!res.error) {
          this.list_commonCurrency = res.data.data
        }
      })
    },
    listCodeLanguage() {
      this.$store.dispatch('language/listCodeLanguage').then((res) => {
        if (!res.error) {
          const arr = []
          for (let i = 0; i < res.data.data.length; i++) {
            arr.push({
              text:
                res.data.data[i].code_name +
                ' ' +
                '(' +
                res.data.data[i].name +
                ')',
              value: res.data.data[i].code_name,
            })
          }
          this.list_codeLanguage = [...arr]
        }
      })
    },
    listMenu() {
      this.$store.dispatch('language/listMenu').then((res) => {
        if (!res.error) {
          this.list_menu = res.data.data
        }
      })
    },
    Add() {
      const data = {
        code: this.code,
        name: this.name,
        display_name: this.display_name,
        status: this.status,
        default_current: this.currency_type,
        menu_id: this.menu,
      }
      this.$store
        .dispatch('language/add', data)
        .then((response) => {
          if (!response.error) {
            this.$showSuccess(this, 'Thêm mới ngôn ngữ thành công')
            this.$emit('toggle')
            this.$emit('OK')
            this.$store.dispatch('app/list_languages')
          }
        })
        .catch((e) => {
          this.$log.debug(e)
        })
        .finally(() => {})
    },
    toggle() {
      this.$emit('toggle')
    },
    reset() {
      this.name = null
      this.nameError = []
      this.display_name = null
      this.display_nameError = []
      this.currency_type = null
      this.currency_typeError = []
      this.menu = null
      this.menuError = []
      this.code = null
      this.codeError = []
    },
    save() {
      let hasErrors = false
      let count = 0
      if (this.$isNullOrEmpty(this.code)) {
        hasErrors = true
        this.codeError = ['Không được để trống']
        count += 1
      }
      if (this.$isNullOrEmpty(this.name)) {
        hasErrors = true
        this.nameError = ['Không được để trống']
        count += 1
      }
      if (this.$isNullOrEmpty(this.display_name)) {
        hasErrors = true
        this.display_nameError = ['Không được để trống']
        count += 1
      }
      if (this.$isNullOrEmpty(this.currency_type)) {
        hasErrors = true
        this.currency_typeError = ['Không được để trống']
        count += 1
      }
      if (this.$isNullOrEmpty(this.menu)) {
        hasErrors = true
        this.menuError = ['Không được để trống']
        count += 1
      }
      if (count > 0) {
        this.$showWarnNotify(this, 'Bạn nhập thiếu thông tin bắt buộc')
      }
      if (!hasErrors) {
        this.Add()
      }
    },
  },
}
</script>
