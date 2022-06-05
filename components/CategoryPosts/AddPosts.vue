<template>
  <div>
    <dialog-right
      :open="open"
      width="900px"
      title="Thêm bài viết"
      @toggle="toggle"
    >
      <div>
        <v-row>
          <!-- <v-col cols="12">
            <v-menu :close-on-content-click="false" offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  class="mr-16 text-none"
                  color="secondary"
                  dark
                  depressed
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon>mdi-pencil-box-outline</v-icon>Trường thông tin
                </v-btn>
              </template>
              <v-list
                v-for="(header, i) in headerscustom"
                :key="`${i}-${header.text}`"
                class="pa-0"
                style="border-top: 1px solid #f0f0f0 !important"
                dense
                subheader
              >
                <v-list-item>
                  <v-checkbox
                    v-model="header.checked"
                    class="ma-0"
                    hide-details
                    :true-value="1"
                    :false-value="0"
                    :ripple="false"
                    @change="set_headers($event, header)"
                  >
                  </v-checkbox>
                  <v-list-item-title class="mt-1">
                    {{ header.text }}
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-col> -->
          <v-col>
            <v-text-field
              v-model="search"
              placeholder="Tìm kiếm"
              prepend-inner-icon="mdi-magnify"
              class="border-1 fs-14"
              solo
              flat
              dense
              hide-details
              @keyup.enter="get_list"
            >
            </v-text-field>
          </v-col>
          <v-col cols="auto">
            <v-btn
              class="mr-3 text-none white--text"
              color="#47BBFF"
              depressed
              :disabled="data_selected.length === 0"
              @click="add"
            >
              Thêm vào danh mục
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
          :page.sync="page"
          loading-text="Xin chờ..."
          no-results-text="Không có kết quả phù hợp"
          no-data-text="Không có dữ liệu"
          class="elevation-0"
        >
          <template #top>
            <div class="mt-3">
              <v-btn
                class="mr-1 text-none"
                style="background-color: white !important"
                depressed
                :disabled="data_selected.length === 0"
                @click="reset_form"
                ><icon-excap
                  class="mt-1 mr-1"
                  height="14"
                  width="14"
                  :disabled="data_selected.length === 0"
                ></icon-excap>
                <div
                  class="fs-14"
                  :style="`${
                    data_selected.length === 0
                      ? 'color: #CFD8DC'
                      : 'color: black'
                  }`"
                >
                  Quay lại
                </div></v-btn
              >
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
            <div v-if="item.hidden !== 1">
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
            </div>
          </template>

          <template v-slot:[`item.post_name`]="{ item }">
            {{ item.post_name }}
          </template>

          <template v-slot:[`item.avatar_small`]="{ item }">
            <div height="88px" width="88px">
              <v-img
                :src="item.avatar_small"
                width="88px"
                height="88px"
              ></v-img>
            </div>
          </template>
        </v-data-table>
        <pagination
          :page-info="pageInfo"
          :page="page"
          :page-size="pageSize"
          :page-count="pageCount"
          @changePage="changePage"
          @changePageSize="changePageSize"
        >
        </pagination>
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
    headers: [
      {
        checked: 1,
        text: 'Tên bài viết',
        sortable: false,
        value: 'post_name',
        width: 150,
      },
      {
        checked: 1,
        text: 'Ảnh thu nhỏ',
        sortable: false,
        value: 'avatar_small',
        width: 200,
      },
    ],
    search: '',
    page: 1,
    pageCount: 1,
    pageSize: 50,
    pageInfo: {},
    data_selected: [],
    tick_all: false,
  }),
  watch: {
    open(value) {
      if (value) {
        this.get_list()

        this.items = []
        this.search = null
        this.data_selected = []
        this.tick_all = false
        this.headers = [
          {
            checked: 1,
            text: 'Tên bài viết',
            sortable: false,
            value: 'post_name',
            width: 150,
          },
          {
            checked: 1,
            text: 'Ảnh thu nhỏ',
            sortable: false,
            value: 'avatar_small',
            width: 200,
          },
        ]
      }
    },
  },
  methods: {
    get_list() {
      this.$store
        .dispatch('bai_viet/list', {
          pageIdx: this.page,
          pageSize: this.pageSize,
          search: this.search,
          post_type: 1,
        })
        .then((res) => {
          this.items = []

          if (!res.error) {
            if ((res.data.data.items || []).length !== 0) {
              for (let i = 0; i < res.data.data.items.length; i++) {
                for (let j = 0; j < this.data_selected.length; j++) {
                  if (
                    res.data.data.items[i].post_id ===
                    this.data_selected[j].post_id
                  ) {
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
                  if (this.data[i].post_id === arr[j].post_id) {
                    arr[j] = {
                      ...arr[j],
                      hidden: 1,
                    }
                  }
                }
              }
              this.items = [...arr]
            }
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
      // this.$log.debug(this.items)
      if (value) {
        this.set_selected_all(1)
        const arr = [...this.items]

        for (let i = 0; i < arr.length; i++) {
          if (this.data_selected.length > 0) {
            const arr1 = [...this.data_selected]
            for (let j = 0; j < this.data_selected.length; j++) {
              if (arr[i].post_id === this.data_selected[j].post_id) {
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
          if (item.post_id === arrselected[i].post_id) {
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

      if (arr.length === this.items.length) {
        this.tick_all = true
      } else if (arr.length === 0) {
        this.tick_all = false
      }
    },
    // set_headers(value, item) {
    //   let arr = [...this.headers]

    //   if (value === 1) {
    //     const array = []

    //     for (let i = 0; i < this.headers.length; i++) {
    //       if (this.headers[i].checked === 1) {
    //         array.push({ ...this.headers[i] })
    //       }
    //     }
    //     arr = [...array]
    //   } else {
    //     for (let i = 0; i < arr.length; i++) {
    //       if (arr[i].value === item.value) {
    //         arr.splice(i, 1)
    //       }
    //     }
    //   }

    //   this.headers = [...arr]
    // },
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
// .v-menu__content {
//   box-shadow: none !important;
// }
</style>
