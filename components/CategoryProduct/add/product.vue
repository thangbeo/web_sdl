<template>
  <div class="product-in-category">
    <v-row>
      <v-col>
        <v-text-field
          v-model="search"
          placeholder="Tìm kiếm sku, tên sản phẩm, nhà cung cấp"
          prepend-inner-icon="mdi-magnify"
          class="border-1 fs-14"
          solo
          flat
          dense
          hide-details
          @keydown.enter="search_list"
        >
        </v-text-field>
      </v-col>
      <v-col cols="auto" class="pl-0 pr-6">
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
      hide-default-footer
      loading-text="Xin chờ..."
      no-results-text="Không có kết quả phù hợp"
      no-data-text="Không có dữ liệu"
      class="elevation-0"
      :page.sync="page"
      @page-count="pageCount = $event"
    >
      <template #top>
        <v-row class="ml-4 py-2">
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
          :disabled="(items || []).length === 0"
          :ripple="false"
          @change="select_all"
        >
        </v-checkbox>
      </template>

      <template v-slot:[`item.data-table-select`]="{ item }">
        <v-checkbox
          v-model="item.checked"
          class="ma-0"
          hide-details
          :true-value="1"
          :false-value="0"
          :ripple="false"
          @change="set_value($event, item)"
        >
        </v-checkbox>
      </template>

      <template v-slot:[`item.sku`]="{ item }">
        <v-chip outlined small>
          {{ item.sku }}
        </v-chip>
      </template>

      <template v-slot:[`item.name`]="{ item }">
        <div class="d-flex align-center">
          <v-img
            class="mr-2"
            :src="item.product_thumbnail_url"
            max-width="42"
            max-height="42"
          />
          {{ item.product_name }}
        </div>
      </template>

      <template v-slot:[`item.status`]="{ item }">
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
      </template>

      <template v-slot:[`item.price`]="{ item }">
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
      </template>

      <template v-slot:[`item.supplier`]="{ item }">
        <div class="d-flex align-center">
          <v-avatar class="mr-2" size="24">
            <v-img :src="item.enterprise_image" />
          </v-avatar>
          {{ item.enterprise_name }}
        </div>
      </template>

      <template v-slot:[`item.actions`]="{ item }">
        <div>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                depressed
                v-bind="attrs"
                v-on="on"
                @click="quest_delete(item)"
              >
                <icon-delete />
              </v-btn>
            </template>
            <span>Xóa</span>
          </v-tooltip>
        </div>
      </template>
    </v-data-table>

    <pagination
      :server="false"
      :items="items"
      :page="page"
      :page-size="pageSize"
      :page-count="pageCount"
      @changePage="changePage"
      @changePageSize="changePageSize"
    />

    <yes-no-alert
      :open="open_delete"
      :alert-msg="alertdelete"
      @toggle="open_delete = !open_delete"
      @OK="confirm_delete"
    />

    <add-product
      :open="open_add"
      :data="items"
      @toggle="open_add = !open_add"
      @add="add"
    />

    <yes-no-alert
      :open="open_deletes"
      :alert-msg="alertdelete"
      @toggle="open_deletes = !open_deletes"
      @OK="confirm_deletes"
    />
  </div>
</template>

<script>
import AddProduct from '~/components/CategoryProduct/add/addproduct'

export default {
  components: {
    AddProduct,
  },
  data: () => ({
    items: [],
    items_default: [],
    list_status: [
      { value: 1, color: '#47BBFF', text: 'Hiển thị' },
      { value: 2, color: '#FF0F59', text: 'Ẩn' },
      { value: 3, color: '#FF0F59', text: 'Ẩn' },
    ],
    search: '',
    data_selected: [],
    tick_all: false,
    open_delete: false,
    data_row: {},
    alertdelete: '',
    disabled: true,
    open_add: false,
    open_deletes: false,
    page: 1,
    pageCount: 1,
    pageSize: 50,
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
    search_list() {
      this.page = 1
      this.get_search()
    },
    get_search() {
      const arr = []
      if (
        (this.items_default || []).length !== 0 &&
        (this.search || '').trim().length !== 0
      ) {
        for (let i = 0; i < this.items_default.length; i++) {
          let enterpriseName = ''

          if (
            (this.items_default[i].enterprise_name || '').trim().length !== 0
          ) {
            enterpriseName = this.items_default[i].enterprise_name
          }

          const str = `${this.$removeAccents(
            String(this.items_default[i].sku)
          )} ${this.$removeAccents(
            this.items_default[i].product_name
          )} ${this.$removeAccents(enterpriseName)}`

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
              ...this.items_default[i],
            })
          }
        }
        this.items = [...arr]
      }
      if ((this.search || '').trim().length === 0) {
        this.items = [...this.items_default]
      }
    },
    changePage(value) {
      this.page = value
    },
    changePageSize(pageSizes) {
      if (pageSizes !== this.itemsPerPage) {
        this.page = 1
        this.pageSize = pageSizes
      }
    },
    set_selected_all(checked) {
      const arr = [...this.items]

      for (let i = 0; i < arr.length; i++) {
        arr[i] = {
          ...arr[i],
          checked,
        }
      }
      this.items = [...arr]
    },
    select_all(value) {
      // this.$log.debug(this.items)
      if (value) {
        this.set_selected_all(1)
        this.data_selected = this.items
        this.disabled = false
      } else {
        this.set_selected_all(0)
        this.data_selected = []
        this.disabled = true
      }
    },
    set_value(value, item) {
      // this.$log.debug(value, item)
      item.checked = value
      const arrselected = [...this.data_selected]

      if (value === 1) {
        arrselected.push(item)
      } else {
        for (let i = 0; i < arrselected.length; i++) {
          if (item.id === arrselected[i].id) {
            arrselected.splice(i, 1)
          }
        }
      }
      this.data_selected = [...arrselected]

      const arr = []

      for (let i = 0; i < this.items.length; i++) {
        if (this.items[i].checked === 1) {
          arr.push(this.items[i].checked)
        }
      }

      if (arr.length > 0 && arr.length < this.items.length) {
        this.disabled = false
      } else if (arr.length === this.items.length) {
        this.tick_all = true
        this.disabled = false
      } else if (arr.length === 0) {
        this.tick_all = false
        this.disabled = true
      }
    },
    quest_delete(item) {
      this.data_row = item
      this.alertdelete =
        'Bạn chắc chắn muốn xóa sản phẩm "' + item.product_name + '" này?'
      this.open_delete = true
    },
    confirm_delete() {
      const arr = [...this.items]
      const arr2 = [...this.items_default]

      for (let i = 0; i < arr.length; i++) {
        if (
          arr[i].id === this.data_row.id &&
          arr[i].product_type === this.data_row.product_type
        ) {
          arr.splice(i, 1)
        }
      }

      for (let i = 0; i < arr2.length; i++) {
        if (
          arr2[i].id === this.data_row.id &&
          arr2[i].product_type === this.data_row.product_type
        ) {
          arr2.splice(i, 1)
        }
      }
      this.items = [...arr]
      this.items_default = [...arr2]
      this.$emit('set_data', this.items_default)
      this.disabled = true
    },
    reset_form() {
      this.tick_all = false
      this.disabled = true
      const arr = [...this.items]

      for (let i = 0; i < arr.length; i++) {
        arr[i].checked = 0
      }
      this.items = [...arr]
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
      if (count === 1) {
        this.alertdelete = 'Bạn chắc chắn muốn xóa sản phẩm "' + name + '" này?'
      } else {
        this.alertdelete = 'Bạn chắc chắn muốn xóa những sản phẩm này?'
      }
      this.open_deletes = true
    },
    confirm_deletes() {
      this.tick_all = false
      const arr = []
      const arr2 = [...this.items_default]
      const arrDelete = []

      for (let i = 0; i < this.items.length; i++) {
        if (this.items[i].checked === 0) {
          arr.push(this.items[i])
        } else {
          arrDelete.push(this.items[i])
        }
      }

      for (let i = 0; i < arr2.length; i++) {
        for (let j = 0; j < arrDelete.length; j++) {
          if (arr2[i].id === arrDelete[j].id) {
            arr2.splice(i, 1)
          }
        }
      }
      this.items = [...arr]
      this.items_default = [...arr2]
      this.$emit('set_data', this.items_default)
      this.disabled = true
    },
    reset() {
      this.items = []
    },
    add(items) {
      const arr = [...items]

      for (let i = 0; i < arr.length; i++) {
        arr[i].checked = 0
      }

      this.items = [...arr, ...this.items]
      this.items_default = [...this.items]
      this.$emit('set_product', this.items)
    },
  },
}
</script>

<style lang="scss" scoped>
.cp {
  cursor: pointer;
}

.v-data-table--fixed-header .v-data-table__wrapper {
  max-height: calc(100vh - 310px);
}

.theme--light.v-btn.v-btn--disabled:not(.v-btn--flat):not(.v-btn--text):not(.v-btn--outlined) {
  background-color: white !important;
  color: black !important;
}
</style>
