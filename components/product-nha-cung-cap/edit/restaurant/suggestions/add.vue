<template>
  <div>
    <dialog-right
      :open="open"
      width="900px"
      title="Thêm gợi ý"
      @toggle="toggle"
    >
      <div>
        <v-row>
          <v-col>
            <v-text-field
              v-model="search_all"
              placeholder="Tìm kiếm"
              class="border-1 fs-14"
              solo
              flat
              dense
              @keydown.enter="search_list"
            >
            </v-text-field>
          </v-col>
          <v-col>
            <v-autocomplete
              v-model="search"
              :items="list_product_type"
              item-value="id"
              item-text="name"
              placeholder="Loại sản phẩm"
              class="border-1 fs-14"
              solo
              flat
              dense
              clearable
              @change="search_list"
            >
            </v-autocomplete>
          </v-col>
          <v-col cols="auto">
            <v-btn
              class="mr-3 text-none white--text"
              color="#47BBFF"
              depressed
              :disabled="data_selected.length === 0"
              @click="add"
            >
              <div
                :style="`${
                  data_selected.length === 0 ? 'color: #CFD8DC' : 'color: white'
                }`"
              >
                Thêm vào danh sách gợi ý
              </div>
            </v-btn>
          </v-col>
        </v-row>
        <v-data-table
          :headers="headers"
          :items="items"
          :items-per-page="pageSize"
          item-key="stt"
          show-select
          fixed-header
          hide-default-footer
          loading-text="Xin chờ..."
          no-results-text="Không có kết quả phù hợp"
          no-data-text="Không có dữ liệu"
          class="elevation-0"
        >
          <template #top>
            <div class="mt-3">
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
            </div>
          </template>

          <template v-slot:[`header.data-table-select`]>
            <v-checkbox
              v-model="tick_all"
              class="ma-0"
              hide-details
              :disabled="(items || []).length === 0"
              :ripple="false"
              @change="selectall"
            >
            </v-checkbox>
          </template>

          <template v-slot:[`item.data-table-select`]="{ item }">
            <v-checkbox
              v-if="item.hidden === 1"
              v-model="set_true"
              class="ma-0"
              hide-details
              :ripple="false"
              :disabled="true"
            >
            </v-checkbox>
            <v-checkbox
              v-else
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

          <template v-slot:[`item.product_thumbnail_url`]="{ item }">
            <div class="d-flex align-center">
              <v-img
                class="mr-2"
                :src="item.product_thumbnail_url"
                max-width="42"
                max-height="42"
              />
            </div>
          </template>

          <template v-slot:[`item.url_seo`]="{ item }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <div
                  class="d-inline-block text-truncate text-decoration-underline"
                  style="max-width: 200px"
                  v-bind="attrs"
                  v-on="on"
                >
                  <a>{{ item.url_seo }}</a>
                </div>
              </template>
              <span>{{ item.url_seo }}</span>
            </v-tooltip>
          </template>
        </v-data-table>

        <pagination
          :page-info="pageInfo"
          :page="page"
          :page-size="pageSize"
          :page-count="pageCount"
          @changePage="changePage"
          @changePageSize="changePageSize"
        />
      </div>
    </dialog-right>
  </div>
</template>

<script>
import DialogRight from '~/components/Dialog/Right'

export default {
  components: {
    DialogRight,
  },
  props: {
    idInfo: {
      type: Number,
      required: true,
    },
    open: {
      type: Boolean,
      required: true,
    },
    data: {
      type: Array,
      default: Array,
    },
  },
  data: () => ({
    items: [],
    headerscustom: [
      { checked: 1, text: 'SKU', sortable: false, value: 'sku', width: 50 },
      {
        checked: 1,
        text: 'Tên sản phẩm',
        sortable: false,
        value: 'product_name',
        width: 150,
      },
      {
        checked: 1,
        text: 'Hình ảnh',
        sortable: false,
        value: 'product_thumbnail_url',
        width: 100,
      },
      {
        checked: 1,
        text: 'URL',
        sortable: false,
        value: 'url_seo',
        width: 180,
      },
    ],
    headers: [],
    search: null,
    search_all: null,
    page: 1,
    pageCount: 1,
    pageSize: 50,
    pageInfo: {},
    data_selected: [],
    tick_all: false,
    list_product_type: [],
    disabled: true,
    set_true: true,
  }),
  watch: {
    open(value) {
      if (value) {
        this.get_list()
        this.get_product_type()

        const arr = []

        for (let i = 0; i < this.headerscustom.length; i++) {
          if (this.headerscustom[i].checked === 1) {
            arr.push({ ...this.headerscustom[i] })
          }
        }

        this.headers = [...arr]
      } else {
        this.items = []
        this.search = null
        this.data_selected = []
        this.tick_all = false
        this.disabled = true
      }
    },
  },
  methods: {
    search_list() {
      this.page = 1
      this.get_list()
    },
    get_list() {
      const DATA = {
        page_index: this.page,
        page_size: this.pageSize,
        product_type: this.$store.state.app.product_type.hotel,
        search:
          (this.search_all || []).length !== 0 ? this.search_all.trim() : '',
        type: this.search,
        product_id: this.idInfo,
      }

      this.$store
        .dispatch('nha_cung_cap_san_pham/get_list_suggestion_out', DATA)
        .then((res) => {
          this.items = []

          if (!res.error) {
            if ((res.data.data.items || []).length !== 0) {
              for (let i = 0; i < res.data.data.items.length; i++) {
                for (let j = 0; j < this.data_selected.length; j++) {
                  if (res.data.data.items[i].id === this.data_selected[j].id) {
                    res.data.data.items[i] = {
                      ...res.data.data.items[i],
                      checked: 1,
                    }
                  }
                }
              }

              let count = 0

              for (let i = 0; i < res.data.data.items.length; i++) {
                if (res.data.data.items[i].checked === 1) {
                  count += 1
                }
              }

              if (count === res.data.data.items.length) {
                this.tick_all = true
              } else {
                this.tick_all = false
              }
            }
            this.items = [...res.data.data.items]
            this.pageInfo = res.data.data.pageable
            this.pageCount = res.data.data.pageable.total_page

            if (this.data.length !== 0) {
              const arr = [...this.items]
              for (let i = 0; i < this.data.length; i++) {
                for (let j = 0; j < arr.length; j++) {
                  if (
                    this.data[i].id === arr[j].id &&
                    this.data[i].product_type === arr[j].product_type
                  ) {
                    arr[j] = {
                      ...arr[j],
                      hidden: 1,
                      checked: 1,
                    }
                  }
                }
              }
              this.items = [...arr]
            }
          }
        })
    },
    get_product_type() {
      this.$store.dispatch('nha_cung_cap_san_pham/product_type').then((res) => {
        if (!res.error) {
          this.list_product_type = res.data.data
        }
      })
    },
    changePage(value) {
      this.page = value
      this.get_list()
    },
    changePageSize(pageSizes) {
      if (pageSizes !== this.itemsPerPage) {
        this.page = 1
        this.pageSize = pageSizes
        this.get_list()
      }
    },
    toggle() {
      this.$emit('toggle')
    },
    reset_form() {
      this.disabled = true
      if (this.data_selected.length !== 0) {
        this.tick_all = false
        const arr = [...this.items]

        for (let i = 0; i < arr.length; i++) {
          arr[i].checked = 0
        }
        this.items = [...arr]
        this.data_selected = []
      }
    },
    set_selected_all(checked) {
      const arr = [...this.items]

      for (let i = 0; i < arr.length; i++) {
        arr[i] = {
          ...arr[i],
          checked,
        }

        if (checked === 0 && this.data_selected.length > 0) {
          const arr1 = [...this.data_selected]
          for (let j = 0; j < this.data_selected.length; j++) {
            if (arr[i].id === this.data_selected[j].id) {
              arr1.splice(j, 1)
            }
          }
          this.data_selected = [...arr1]
        }
      }
      this.items = [...arr]
    },
    selectall(value) {
      if (value) {
        this.set_selected_all(1)
        this.disabled = false

        const arr = [...this.items]

        for (let i = 0; i < arr.length; i++) {
          if (this.data_selected.length > 0) {
            const arr1 = [...this.data_selected]
            for (let j = 0; j < this.data_selected.length; j++) {
              if (arr[i].id === this.data_selected[j].id) {
                arr1.splice(j, 1)
              }
            }
            this.data_selected = [...arr1]
          }
        }

        const arr2 = []

        for (let i = 0; i < arr.length; i++) {
          if (arr[i].hidden !== 1) {
            arr2.push(arr[i])
          }
        }
        this.data_selected = [...arr2, ...this.data_selected]
      } else {
        this.set_selected_all(0)
        this.disabled = true
      }
    },
    set_value(value, item) {
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
    set_headers(value, item) {
      let arr = [...this.headers]

      if (value === 1) {
        const array = []

        for (let i = 0; i < this.headerscustom.length; i++) {
          if (this.headerscustom[i].checked === 1) {
            array.push({ ...this.headerscustom[i] })
          }
        }
        arr = [...array]
      } else {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].value === item.value) {
            arr.splice(i, 1)
          }
        }
      }

      this.headers = [...arr]
    },
    add() {
      const arr = []

      for (let i = 0; i < this.data_selected.length; i++) {
        arr.push(this.data_selected[i])
      }

      this.$emit('add', arr)
      this.toggle()
    },
  },
}
</script>

<style lang="scss" scoped>
.theme--light.v-btn.v-btn--disabled:not(.v-btn--flat):not(.v-btn--text):not(.v-btn--outlined) {
  background-color: white !important;
  color: black !important;
}
</style>
