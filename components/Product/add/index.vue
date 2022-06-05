<template>
  <div>
    <v-row v-if="actions === 0" class="px-6">
      <v-col cols="12">
        <p class="fs-14 pt-4">
          Loại sản phẩm <span class="error--text ml-1">*</span>
        </p>
        <v-autocomplete
          v-model="type"
          :items="list_type"
          :error-messages="type_msg"
          placeholder="Chọn"
          class="border-1 fs-14"
          solo
          flat
          dense
          @change="set_properties"
          @input="type_msg = []"
        >
        </v-autocomplete>
        <p class="fs-14 pt-4">
          Bộ thuộc tính sản phẩm <span class="error--text ml-1">*</span>
        </p>
        <v-autocomplete
          v-model="properties"
          :items="list_properties"
          item-text="name"
          item-value="id"
          :error-messages="properties_msg"
          placeholder="Chọn"
          class="border-1 fs-14"
          solo
          flat
          dense
          @input="properties_msg = []"
        >
        </v-autocomplete>
        <div class="d-flex" style="position: fixed; right: 36px; bottom: 40px">
          <div class="flex-grow-1"></div>
          <v-btn
            class="text-none white--text mr-3"
            color="#656565"
            depressed
            width="90"
            @click="toggle"
          >
            Hủy
          </v-btn>
          <v-btn
            class="text-none white--text"
            color="#47BBFF"
            dark
            depressed
            width="90"
            @click="save"
          >
            Tiếp tục
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <hotel v-else-if="actions === 1" @toggle="back_selected" @save="add" />

    <restaurant v-else-if="actions === 2" @toggle="back_selected" @save="add" />

    <tour v-else-if="actions === 3" @toggle="back_selected" @save="add" />

    <AddTourismProduct
      v-else-if="actions === 4"
      :prod-attr-set="properties"
      @toggle="back_selected"
      @success="add"
    />

    <yes-no-alert
      :open="open_confirm"
      alert-msg="Bạn chắc chắn muốn thoát không?"
      @toggle="open_confirm = !open_confirm"
      @OK="access_confirm"
    />
  </div>
</template>

<script>
import Hotel from './hotel/index'
import Restaurant from './restaurant/index'
import Tour from './tour/index'
import AddTourismProduct from './tourism-product/addTourismProduct.vue'

export default {
  components: {
    Hotel,
    Restaurant,
    Tour,
    AddTourismProduct,
  },
  data: () => ({
    actions: 0,
    type: null,
    list_type: [],
    type_msg: [],
    properties: null,
    list_properties: [],
    properties_msg: '',
    open_confirm: false,
  }),
  watch: {
    '$store.state.app.change_back'(value) {
      // this.actions = 1
      // this.$store.commit('app/setTitle', 'Thêm mới sản phẩm')
      if (this.$store.state.app.pageTitle !== 'Thêm mới sản phẩm') {
        this.open_confirm = true
      }
    },
  },
  created() {
    this.$store.dispatch('product/product_type').then((res) => {
      if (!res.error) {
        const arr = []

        if ((res.data.data || []).length !== 0) {
          for (let i = 0; i < res.data.data.length; i++) {
            arr.push({
              value: res.data.data[i].id,
              text: res.data.data[i].name,
            })
          }
        }
        this.list_type = [...arr]
      }
    })
  },
  methods: {
    toggle() {
      this.$emit('toggle')
    },
    set_properties(value) {
      this.type_msg = []
      this.properties_msg = ''
      if (!this.$isNullOrEmpty(value)) {
        this.set_attribute(value)
      }
    },
    set_attribute(id) {
      this.list_properties = []
      this.properties = null
      this.$store.dispatch('product/product_attribute', id).then((res) => {
        if (!res.error) {
          this.list_properties = res.data.data
        }
      })
    },
    back_selected() {
      this.actions = 0
      this.$store.commit('app/setTitle', 'Thêm mới sản phẩm')
    },
    save() {
      let hasErrors = false

      if ((this.type || []).length === 0) {
        hasErrors = true
        this.type_msg = 'Vui lòng chọn Loại sản phẩm để cấu hình Bộ thuộc tính'
      }

      if ((this.properties || []).length === 0) {
        hasErrors = true
        this.properties_msg =
          'Vui lòng chọn Bộ thuộc tính tương ứng với Loại sản phẩm'
      }

      if (!hasErrors) {
        this.check_add()
      }
    },
    check_add(value) {
      if (this.type === 1) {
        this.actions = 1
        this.$store.commit('app/setTitle', 'Thêm mới sản phẩm - Khách sạn')
      } else if (this.type === 2) {
        this.actions = 2
        this.$store.commit('app/setTitle', 'Thêm mới sản phẩm - Nhà hàng')
      } else if (this.type === 3) {
        this.actions = 3
        this.$store.commit('app/setTitle', 'Thêm mới sản phẩm - Tour du lịch')
      } else if (this.type === 4) {
        this.actions = 4
        this.$store.commit('app/setTitle', 'Thêm mới sản phẩm du lịch')
      }
    },
    add() {
      this.$emit('OK')
    },
    access_confirm() {
      this.actions = 0
      this.$store.commit('app/setTitle', 'Thêm mới sản phẩm')
    },
  },
}
</script>
