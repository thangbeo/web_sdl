<template>
  <div style="background-color: #f4f7fe" class="pt-16">
    <v-row v-if="actions === 1">
      <v-col cols="2">
        <v-card-text class="fs-16 pt-2 font-weight-bold">
          Loại sản phẩm <span class="error--text">*</span>
        </v-card-text>
      </v-col>
      <v-col cols="9">
        <v-autocomplete
          v-model="type"
          :items="list_type"
          :error-messages="type_msg"
          placeholder="Chọn Loại sản phẩm"
          class="border-1 fs-14"
          dense
          solo
          flat
          :outlined="type_msg.length !== 0"
          @change="set_properties"
          @input="status_msg = []"
        >
        </v-autocomplete>
      </v-col>
      <v-col cols="2">
        <v-card-text class="fs-16 pt-2 pr-0 font-weight-bold">
          Bộ thuộc tính sản phẩm <span class="error--text">*</span>
        </v-card-text>
      </v-col>
      <v-col cols="9">
        <v-autocomplete
          v-model="properties"
          :items="list_properties"
          item-text="name"
          item-value="id"
          :error-messages="properties_msg"
          placeholder="Chọn Bộ thuộc tính"
          class="border-1 fs-14"
          :outlined="properties_msg.length !== 0"
          solo
          flat
          dense
          @input="properties_msg = []"
        >
        </v-autocomplete>
      </v-col>

      <v-col cols="11" class="pt-12 d-flex justify-end">
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
      </v-col>
    </v-row>

    <hotel
      v-else-if="actions === 2"
      :data="data"
      @toggle="back_selected"
      @toggle1="$emit('toggle')"
      @success="$emit('success')"
      @save="add"
    />
    <restaurant
      v-else-if="actions === 3"
      :data="data"
      @toggle1="$emit('toggle')"
      @success="$emit('success')"
      @toggle="back_selected"
      @save="add"
    />
    <tour
      v-else-if="actions === 4"
      :data="data"
      @toggle1="$emit('toggle')"
      @success="$emit('success')"
      @toggle="back_selected"
      @save="add"
    />

    <AddTourismProduct
      v-else-if="actions === 5"
      :data="data"
      :prod-attr-set="properties"
      :selected-provider="data.id"
      @toggle1="$emit('toggle')"
      @success="$emit('success')"
      @toggle="back_selected"
      @save="add"
    />
  </div>
</template>

<script>
import Hotel from '~/components/product-nha-cung-cap/hotel/hotel'
import Restaurant from '~/components/product-nha-cung-cap/restaurant/restaurant'
import Tour from '~/components/product-nha-cung-cap/tour/tour'
import AddTourismProduct from '~/components/product-nha-cung-cap/tourism-product/addTourismProduct.vue'

export default {
  components: {
    Hotel,
    Restaurant,
    Tour,
    AddTourismProduct,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },

  data: () => ({
    actions: 1,
    type: null,
    list_type: [],
    type_msg: [],
    properties: null,
    list_properties: [],
    properties_msg: '',
  }),

  watch: {
    '$store.state.app.change_back'(value) {
      if (
        this.$store.state.app.pageTitle === 'Thêm mới sản phẩm - Khách sạn' ||
        this.$store.state.app.pageTitle === 'Thêm mới sản phẩm - Nhà hàng' ||
        this.$store.state.app.pageTitle ===
          'Thêm mới sản phẩm - Tour du lịch' ||
        this.$store.state.app.pageTitle ===
          'Thêm mới sản phẩm - Sản phẩm du lịch'
      ) {
        this.actions = 1
        this.$store.commit('app/setTitle', 'Thêm mới sản phẩm')
      }
    },
  },
  created() {
    this.$store.dispatch('nha_cung_cap_san_pham/product_type').then((res) => {
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
      this.$emit('backproduct')
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
      this.$store
        .dispatch('nha_cung_cap_san_pham/product_attribute', id)
        .then((res) => {
          if (!res.error) {
            this.list_properties = res.data.data
          }
        })
    },
    back_selected() {
      this.actions = 1
      this.$store.commit('app/setTitle', 'Thêm mới sản phẩm')
    },
    save() {
      let hasErrors = false
      let count = 0
      if ((this.type || []).length === 0) {
        hasErrors = true
        this.type_msg = 'Vui lòng chọn Loại sản phẩm để cấu hình Bộ thuộc tính'
        count += 1
      }

      if ((this.properties || []).length === 0) {
        hasErrors = true
        this.properties_msg =
          'Vui lòng chọn Bộ thuộc tính tương ứng với Loại sản phẩm'
        count += 1
      }
      if (count > 0) {
        this.$showWarnNotify(this, 'Bạn nhập thiếu thông tin bắt buộc')
      }

      if (!hasErrors) {
        this.check_add()
      }
    },
    check_add(value) {
      if (this.type === 1) {
        this.actions = 2
        this.$store.commit('app/setTitle', 'Thêm mới sản phẩm - Khách sạn')
      } else if (this.type === 2) {
        this.actions = 3
        this.$store.commit('app/setTitle', 'Thêm mới sản phẩm - Nhà hàng')
      } else if (this.type === 3) {
        this.actions = 4
        this.$store.commit('app/setTitle', 'Thêm mới sản phẩm - Tour du lịch')
      } else if (this.type === 4) {
        this.actions = 5
        this.$store.commit(
          'app/setTitle',
          'Thêm mới sản phẩm - Sản phẩm du lịch'
        )
      }
    },
    add() {
      this.$emit('OK')
    },
  },
}
</script>
