<template>
  <div class="product-in-category" @mousewheel="checked_scroll">
    <v-row>
      <v-col>
        <v-text-field
          v-model="search"
          type="text"
          placeholder="Tìm kiếm sku, tên sản phẩm, nhà cung cấp"
          prepend-inner-icon="mdi-magnify"
          class="border-1 fs-14"
          solo
          flat
          dense
          hide-details
          @keydown.enter="get_list"
        >
        </v-text-field>
      </v-col>
      <v-col cols="auto" class="pl-0 pr-6">
        <v-btn
          color="#47BBFF"
          class="text-none white--text mr-2"
          depressed
          @click="get_list"
        >
          Tìm kiếm
        </v-btn>
        <v-btn
          color="#47BBFF"
          class="text-none white--text"
          depressed
          @click="open_add = true"
        >
          <v-icon>mdi-plus</v-icon>
          Thêm mới
        </v-btn>
      </v-col>
    </v-row>
    <v-data-table
      :headers="headers"
      :items="items"
      :items-per-page="pageSize"
      show-select
      fixed-header
      disable-pagination
      hide-default-footer
      loading-text="Xin chờ..."
      no-results-text="Không có kết quả phù hợp"
      no-data-text="Không có dữ liệu"
      class="elevation-0"
    >
      <template #top>
        <div
          v-if="items.length + items_add.length !== 0"
          class="fs-14 pt-1 pl-1"
          style="color: #47bbff"
        >
          {{ items.length + items_add.length }} sản phẩm
        </div>
        <v-row class="ml-4 py-1">
          <v-btn
            class="fs-14 text-none"
            color="white"
            depressed
            :disabled="disabled"
            @click="quest_deletes"
          >
            <icon-close :disabled="disabled" class="mr-2" />
            <div :style="`${disabled ? 'color: #CFD8DC' : 'color: black'}`">
              Xóa
            </div>
          </v-btn>
          <v-divider style="max-height: 16px" class="mx-2" inset vertical />
          <v-btn
            class="fs-14 text-none"
            color="white"
            depressed
            :disabled="disabled"
            @click="reset_form"
          >
            <icon-excap :disabled="disabled" class="mr-2" />
            <div :style="`${disabled ? 'color: #CFD8DC' : 'color: black'}`">
              Quay lại
            </div>
          </v-btn>
        </v-row>
      </template>

      <template v-slot:[`header.data-table-select`]>
        <v-checkbox
          v-model="tick_all"
          class="ma-0"
          hide-details
          :ripple="false"
          :disabled="
            (items || []).length === 0 && (items_add || []).length === 0
          "
          @change="select_all"
        >
        </v-checkbox>
      </template>

      <template v-slot:body>
        <tbody>
          <tr v-for="(item, index) in items_add" :key="`${item.id}-${index}`">
            <td>
              <v-checkbox
                v-model="item.checked"
                class="ma-0"
                hide-details
                :true-value="1"
                :false-value="0"
                :ripple="false"
                @change="check_actions"
              >
              </v-checkbox>
            </td>
            <td>
              <v-chip outlined small>
                {{ item.sku }}
              </v-chip>
            </td>
            <td>
              <div class="d-flex align-center">
                <v-img
                  class="mr-2"
                  :src="item.product_thumbnail_url"
                  max-width="42"
                  max-height="42"
                />
                {{ item.product_name }}
              </div>
            </td>
            <td>
              <template v-for="(status, i) in list_status">
                <v-chip
                  v-if="status.value === item.status"
                  :key="`${i}-${status}`"
                  :color="status.color"
                  small
                  label
                  outlined
                >
                  {{ status.text }}
                </v-chip>
              </template>
            </td>
            <td>
              {{
                `${
                  item.from_price === 0
                    ? ''
                    : $formatMoney({ amount: item.from_price })
                }${item.from_price !== 0 && item.to_price !== 0 ? ' - ' : ''}${
                  item.to_price === 0
                    ? ''
                    : $formatMoney({
                        amount: item.to_price,
                      })
                }`
              }}
            </td>
            <td>
              <div class="d-flex align-center">
                <v-avatar class="mr-2" size="24">
                  <v-img :src="item.enterprise_image" />
                </v-avatar>
                {{ item.enterprise_name }}
              </div>
            </td>
            <td>
              <div>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      icon
                      depressed
                      v-bind="attrs"
                      v-on="on"
                      @click="quest_delete(item, 1)"
                    >
                      <icon-delete />
                    </v-btn>
                  </template>
                  <span>Xóa</span>
                </v-tooltip>
              </div>
            </td>
          </tr>

          <tr v-for="(item, index) in items" :key="`${item.id}-${index}`">
            <td>
              <v-checkbox
                v-model="item.checked"
                class="ma-0"
                hide-details
                :true-value="1"
                :false-value="0"
                :ripple="false"
                @change="check_actions"
              >
              </v-checkbox>
            </td>
            <td>
              <v-chip outlined small>
                {{ item.sku }}
              </v-chip>
            </td>
            <td>
              <div class="d-flex align-center">
                <v-img
                  class="mr-2"
                  :src="item.product_thumbnail_url"
                  max-width="42"
                  max-height="42"
                />
                {{ item.product_name }}
              </div>
            </td>
            <td>
              <template v-for="(status, i) in list_status">
                <v-chip
                  v-if="status.value === item.status"
                  :key="`${i}-${status}`"
                  :color="status.color"
                  small
                  label
                  outlined
                >
                  {{ status.text }}
                </v-chip>
              </template>
            </td>
            <td>
              {{
                `${
                  item.from_price === 0
                    ? ''
                    : $formatMoney({ amount: item.from_price })
                }${item.from_price !== 0 && item.to_price !== 0 ? ' - ' : ''}${
                  item.to_price === 0
                    ? ''
                    : $formatMoney({
                        amount: item.to_price,
                      })
                }`
              }}
            </td>
            <td>
              <div class="d-flex align-center">
                <v-avatar class="mr-2" size="24">
                  <v-img :src="item.enterprise_image" />
                </v-avatar>
                {{ item.enterprise_name }}
              </div>
            </td>
            <td>
              <div>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      icon
                      depressed
                      v-bind="attrs"
                      v-on="on"
                      @click="quest_delete(item, 2)"
                    >
                      <icon-delete />
                    </v-btn>
                  </template>
                  <span>Xóa</span>
                </v-tooltip>
              </div>
            </td>
          </tr>
        </tbody>
      </template>
    </v-data-table>

    <yes-no-alert
      :open="open_delete"
      :alert-msg="alertdelete"
      @toggle="open_delete = !open_delete"
      @OK="confirm_delete"
    />

    <add-product
      :open="open_add"
      :data="items_add"
      :info="data"
      @toggle="open_add = !open_add"
      @add="add"
    />

    <yes-no-alert
      :open="open_deletes"
      :alert-msg="alertdelete"
      @toggle="open_deletes = !open_deletes"
      @OK="confirm_deletes"
    />

    <v-overlay :value="loading">
      <div id="product-edit-loading">
        <span class="sk-cube sk-cube1" />
        <span class="sk-cube sk-cube2" />
        <span class="sk-cube sk-cube3" />
        <span class="sk-cube sk-cube4" />
        <span class="sk-cube sk-cube5" />
        <span class="sk-cube sk-cube6" />
        <span class="sk-cube sk-cube7" />
        <span class="sk-cube sk-cube8" />
        <span class="sk-cube sk-cube9" />
      </div>
    </v-overlay>
  </div>
</template>

<script>
import AddProduct from '~/components/CategoryProduct/edit/addproduct'

export default {
  components: {
    AddProduct,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    items: [],
    items_add: [],
    items_add_default: [],
    deleted_products: [],
    list_status: [
      { value: 1, color: '#47BBFF', text: 'Hiển thị' },
      { value: 2, color: '#FF0F59', text: 'Ẩn' },
      { value: 3, color: '#FF0F59', text: 'Ẩn' },
    ],
    search: '',
    tick_all: false,
    open_delete: false,
    data_row: {},
    alertdelete: '',
    disabled: true,
    open_add: false,
    open_deletes: false,
    page: 1,
    pageSize: 50,
    total_page: 0,
    loading: false,
    check: 0,
  }),
  computed: {
    headers() {
      return [
        { text: 'SKU', sortable: false, value: 'sku', width: 50 },
        {
          text: 'Tên sản phẩm',
          sortable: false,
          value: 'name',
          width: 200,
        },
        { text: 'Hiển thị/ Ẩn', sortable: false, value: 'status', width: 80 },
        { text: 'Mức giá VND', sortable: false, value: 'price', width: 120 },
        {
          text: 'Nhà cung cấp',
          sortable: false,
          value: 'supplier',
          width: 150,
        },
        { text: 'Hành động', sortable: false, value: 'actions', width: 50 },
      ]
    },
  },
  methods: {
    get_list() {
      this.page = 1
      const DATA = {
        product_category_id: this.data.id,
        page_index: this.page,
        page_size: this.pageSize,
        search: (this.search || []).length !== 0 ? this.search.trim() : '',
      }
      this.$store
        .dispatch('category-product/list_product_in_category', DATA)
        .then((res) => {
          if (!res.error) {
            this.items = []
            if ((res.data.data.items || []).length !== 0) {
              for (let i = 0; i < res.data.data.items.length; i++) {
                if (this.deleted_products.length !== 0) {
                  for (let j = 0; j < this.deleted_products.length; j++) {
                    if (
                      res.data.data.items[i].id ===
                        this.deleted_products[j].id &&
                      res.data.data.items[i].product_type ===
                        this.deleted_products[j].product_type
                    ) {
                      res.data.data.items.splice(i, 1)
                    }
                  }
                } else {
                  res.data.data.items[i] = {
                    ...res.data.data.items[i],
                    checked: 0,
                  }
                }
              }
            }
            this.items = res.data.data.items
            this.total_page = res.data.data.pageable.total_page
          }
        })

      const arr = []
      if (
        (this.items_add_default || []).length !== 0 &&
        (this.search || '').trim().length !== 0
      ) {
        for (let i = 0; i < this.items_add_default.length; i++) {
          const str = `${this.$removeAccents(
            String(this.items_add_default[i].sku)
          )} ${this.$removeAccents(
            this.items_add_default[i].product_name
          )} ${this.$removeAccents(
            this.items_add_default[i].product_category_name
          )} ${this.$removeAccents(
            this.items_add_default[i].enterprise_name
          )} ${this.items_add_default[i].status === 1 ? 'hien thi' : 'an'}`

          if (this.$isNumber(this.search)) {
            if (
              Number(this.search) >= Number(this.items_default[i].from_price) &&
              Number(this.search) <= Number(this.items_default[i].to_price)
            ) {
              arr.push({
                ...this.items_default[i],
              })
            }
          }

          if (str.includes(this.$removeAccents(this.search.trim()))) {
            arr.push({
              ...this.items_add_default[i],
            })
          }
        }
        this.items_add = [...arr]
      }
      if ((this.search || '').trim().length === 0) {
        this.items_add = [...this.items_add_default]
      }
    },
    reset(id) {
      this.items_add = []
      this.items_add_default = []
      this.deleted_products = []
      this.search = ''
      this.data_row = {}
      this.pageSize = 20
      this.total_page = 0
      this.loading = false
      this.tick_all = false

      this.page = 1
      if (id !== -1) {
        const DATA = {
          product_category_id: id,
          page_index: this.page,
          page_size: this.pageSize,
          search: (this.search || []).length !== 0 ? this.search.trim() : '',
        }
        this.$store
          .dispatch('category-product/list_product_in_category', DATA)
          .then((res) => {
            if (!res.error) {
              this.items = []
              if ((res.data.data.items || []).length !== 0) {
                for (let i = 0; i < res.data.data.items.length; i++) {
                  res.data.data.items[i] = {
                    ...res.data.data.items[i],
                    checked: 0,
                  }
                }
              }
              this.items = res.data.data.items
              this.total_page = res.data.data.pageable.total_page
            }
          })
      } else {
        const deletedProduct = []

        for (let i = 0; i < this.items.length; i++) {
          deletedProduct.push(this.items[i].id)
        }
        this.$emit('deleted_product', deletedProduct)
        this.items = []
      }
    },
    set_selected_all(checked) {
      const arr = [...this.items]
      const arr1 = [...this.items_add]

      for (let i = 0; i < arr.length; i++) {
        arr[i] = {
          ...arr[i],
          checked,
        }
      }

      for (let i = 0; i < arr1.length; i++) {
        arr1[i] = {
          ...arr1[i],
          checked,
        }
      }
      this.items = [...arr]
      this.items_add = [...arr1]
      this.items_add_default = [...arr1]
    },
    select_all(value) {
      if (value) {
        this.set_selected_all(1)
        this.disabled = false
      } else {
        this.set_selected_all(0)
        this.disabled = true
      }
    },
    check_actions() {
      let count = 0
      for (let i = 0; i < this.items_add.length; i++) {
        if (this.items_add[i].checked === 1) {
          count += 1
        }
      }
      for (let i = 0; i < this.items.length; i++) {
        if (this.items[i].checked === 1) {
          count += 1
        }
      }
      if (count > 0) {
        this.disabled = false
      } else {
        this.disabled = true
      }
    },
    quest_delete(item, check) {
      this.data_row = item
      this.check = check
      this.alertdelete =
        'Bạn chắc chắn muốn xóa sản phẩm "' + item.product_name + '" này?'
      this.open_delete = true
    },
    confirm_delete() {
      let arr = []
      let arr1 = []
      if (this.check === 1) {
        arr = [...this.items_add]
        for (let i = 0; i < arr.length; i++) {
          if (
            this.data_row.id === arr[i].id &&
            this.data_row.product_type === arr[i].product_type
          ) {
            arr.splice(i, 1)
          }
        }
        arr1 = [...this.items_add_default]
        for (let i = 0; i < arr1.length; i++) {
          if (
            this.data_row.id === arr1[i].id &&
            this.data_row.product_type === arr1[i].product_type
          ) {
            arr1.splice(i, 1)
          }
        }
        this.items_add = [...arr]
        this.items_add_default = [...arr1]
        this.$emit('product_add', this.items_add_default)
      } else if (this.check === 2) {
        const deletedProducts = [...this.deleted_products]

        arr = [...this.items]
        for (let i = 0; i < arr.length; i++) {
          if (this.data_row.id === arr[i].id) {
            deletedProducts.push({ ...arr[i] })
            arr.splice(i, 1)
          }
        }
        this.items = [...arr]
        this.deleted_products = [...deletedProducts]

        const deletedProduct = []

        for (let i = 0; i < this.deleted_products.length; i++) {
          deletedProduct.push(this.deleted_products[i].id)
        }
        this.$emit('deleted_product', deletedProduct)
        this.disabled = true
      }
    },
    quest_deletes() {
      let count = 0
      let name = ''

      for (let i = 0; i < this.items.length; i++) {
        if (this.items[i].checked === 1) {
          count += 1
          name = this.items[i].product_name
        }
      }
      for (let i = 0; i < this.items_add.length; i++) {
        if (this.items_add[i].checked === 1) {
          count += 1
          name = this.items_add[i].product_name
        }
      }
      if (count === 1) {
        this.alertdelete = 'Bạn chắc chắn muốn xóa sản phẩm "' + name + '" này?'
        this.open_deletes = true
      } else if (count > 1) {
        this.alertdelete = 'Bạn chắc chắn muốn xóa những sản phẩm này?'
        this.open_deletes = true
      }
    },
    confirm_deletes() {
      this.tick_all = false
      const arrDelete = []
      const deletedProducts = []
      const arr = []

      for (let i = 0; i < this.items.length; i++) {
        if (this.items[i].checked === 1) {
          arrDelete.push(this.items[i].id)
          deletedProducts.push({ ...this.items[i] })
        } else {
          arr.push({ ...this.items[i] })
        }
      }
      this.deleted_products = [...deletedProducts]
      this.$emit('deleted_product', arrDelete)

      this.items = [...arr]

      const arr1 = []
      const arr3 = []

      for (let i = 0; i < this.items_add.length; i++) {
        if (this.items_add[i].checked === 0) {
          arr1.push({ ...this.items_add[i] })
        } else {
          arr3.push({ ...this.items_add[i] })
        }
      }

      const arr2 = [...this.items_add_default]
      for (let i = 0; i < arr2.length; i++) {
        for (let j = 0; j < arr3.length; j++) {
          if (
            arr2[i].id === arr3[j].id &&
            arr2[i].product_type === arr3[j].product_type
          ) {
            arr2.splice(i, 1)
          }
        }
      }
      this.items_add = [...arr1]
      this.items_add_default = [...arr2]
      this.$emit('product_add', this.items_add_default)
      this.disabled = true
    },
    reset_form() {
      this.disabled = true
      this.tick_all = false
      const arr = [...this.items]
      const arr1 = [...this.items_add]

      for (let i = 0; i < arr.length; i++) {
        arr[i].checked = 0
      }

      for (let i = 0; i < arr1.length; i++) {
        arr1[i].checked = 0
      }
      this.items = [...arr]
      this.items_add = [...arr1]
      this.items_add_default = [...arr1]
    },
    add(items) {
      const arr = [...items]

      for (let i = 0; i < arr.length; i++) {
        arr[i].checked = 0
      }

      this.items_add = [...arr, ...this.items_add]
      this.items_add_default = [...this.items_add]
      this.$emit('product_add', this.items_add)
    },
    checked_scroll() {
      if (this.page < this.total_page) {
        const attributeTable = document.getElementsByClassName(
          'v-data-table__wrapper'
        )
        const attributeTableContent = document.getElementsByTagName('table')

        if (
          attributeTable[1].scrollTop + attributeTable[1].clientHeight >
          attributeTableContent[1].clientHeight - 1
        ) {
          this.page += 1
          const DATA = {
            product_category_id: this.data.id,
            page_index: this.page,
            page_size: this.pageSize,
            search: (this.search || []).length !== 0 ? this.search.trim() : '',
          }
          this.loading = true
          this.$store
            .dispatch('category-product/list_product_in_category', DATA)
            .then((res) => {
              if (!res.error) {
                let arr = [...this.items]
                if ((res.data.data.items || []).length !== 0) {
                  for (let i = 0; i < res.data.data.items.length; i++) {
                    res.data.data.items[i] = {
                      ...res.data.data.items[i],
                      checked: 0,
                    }
                  }
                }
                arr = [...arr, ...res.data.data.items]
                this.items = [...arr]
              }
            })
            .finally(() => {
              this.loading = false
            })
        }
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.cp {
  cursor: pointer;
}

.theme--light.v-btn.v-btn--disabled:not(.v-btn--flat):not(.v-btn--text):not(.v-btn--outlined) {
  background-color: white !important;
  color: black !important;
}

#product-edit-loading {
  width: 40px;
  height: 40px;
}
#product-edit-loading .sk-cube {
  width: 33%;
  height: 33%;
  background-color: #333;
  float: left;
  -webkit-animation: sk-cubegridscaledelay 1.3s infinite ease-in-out;
  animation: sk-cubegridscaledelay 1.3s infinite ease-in-out;
}
#product-edit-loading .sk-cube1 {
  -webkit-animation-delay: 0.2s;
  animation-delay: 0.2s;
}
#product-edit-loading .sk-cube2 {
  -webkit-animation-delay: 0.3s;
  animation-delay: 0.3s;
}
#product-edit-loading .sk-cube3 {
  -webkit-animation-delay: 0.4s;
  animation-delay: 0.4s;
}
#product-edit-loading .sk-cube4 {
  -webkit-animation-delay: 0.1s;
  animation-delay: 0.1s;
}
#product-edit-loading .sk-cube5 {
  -webkit-animation-delay: 0.2s;
  animation-delay: 0.2s;
}
#product-edit-loading .sk-cube6 {
  -webkit-animation-delay: 0.3s;
  animation-delay: 0.3s;
}
#product-edit-loading .sk-cube7 {
  -webkit-animation-delay: 0s;
  animation-delay: 0s;
}
#product-edit-loading .sk-cube8 {
  -webkit-animation-delay: 0.1s;
  animation-delay: 0.1s;
}
#product-edit-loading .sk-cube9 {
  -webkit-animation-delay: 0.2s;
  animation-delay: 0.2s;
}

@-webkit-keyframes sk-cubegridscaledelay {
  0%,
  70%,
  100% {
    -webkit-transform: scale3d(1, 1, 1);
    transform: scale3d(1, 1, 1);
  }
  35% {
    -webkit-transform: scale3d(0, 0, 1);
    transform: scale3d(0, 0, 1);
  }
}
@keyframes sk-cubegridscaledelay {
  0%,
  70%,
  100% {
    -webkit-transform: scale3d(1, 1, 1);
    transform: scale3d(1, 1, 1);
  }
  35% {
    -webkit-transform: scale3d(0, 0, 1);
    transform: scale3d(0, 0, 1);
  }
}
</style>
