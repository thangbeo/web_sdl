<template>
  <div class="main_customs">
    <div v-if="open_add === 1">
      <v-data-table
        :headers="headers"
        :items="items"
        show-select
        :page.sync="page"
        :items-per-page="pageSize"
        hide-default-footer
        loading-text="Xin chờ..."
        no-results-text="Không có kết quả phù hợp"
        no-data-text="Không có dữ liệu"
        fixed-header
        item-key="stt"
        class="elevation-0"
      >
        <template #top>
          <div style="background-color: #f4f7fe">
            <v-menu :close-on-content-click="false" offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  class="text-none white--text mb-2"
                  height="40px"
                  color="#656565"
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
                <v-list-item v-if="i !== 0 && i !== headerscustom.length - 1">
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
          </div>

          <v-app-bar flat color="#f4f7fe">
            <v-text-field
              v-model="search"
              class="mr-3 pt-3 pb-6 fs-14"
              style="margin-left: -16px"
              prepend-inner-icon="mdi-magnify"
              placeholder="Tìm kiếm: Khách hàng, Địa chỉ email, Số điện thoại"
              height="40px"
              solo
              flat
              dense
              hide-details
              @keyup.enter="search_customs"
            >
            </v-text-field>

            <div class="pt-6 pb-9">
              <v-btn
                class="mr-1 text-none white--text"
                height="40px"
                depressed
                color="#656565"
                @click="open_search = true"
              >
                Tìm kiếm nâng cao</v-btn
              >
              <v-btn
                :disabled="loading"
                :loading="loading"
                class="mr-1 text-none border-radius: 4px;"
                color="#3F69B8"
                height="40px"
                depressed
                @click="export_customer_list"
              >
                <img src="~/assets/icon/excel.svg" width="13" height="12" />
                <span style="color: white"> Xuất Excel</span>
              </v-btn>

              <v-btn
                color="#47BBFF"
                class="text-none white--text"
                style="margin-right: -15px"
                depressed
                height="40px"
                @click="open_add = 2"
              >
                <v-icon>mdi-plus</v-icon>Thêm mới
              </v-btn>
            </div>
          </v-app-bar>
          <div class="d-flex pt-3 customer">
            <v-btn
              style="background-color: white !important"
              class="mr-1 ml-1 text-none px-3"
              width="90px"
              depressed
              :disabled="disabled"
              @click="quest_deletes"
            >
              <icon-close
                :disabled="disabled"
                class="mr-1"
                height="14"
                width="14"
              ></icon-close>
              <div :style="`${disabled ? 'color: #CFD8DC' : 'color: black'}`">
                Xóa
              </div></v-btn
            >
            <v-divider style="max-height: 20px" inset vertical></v-divider>
            <v-btn
              style="background-color: white !important"
              class="mr-1 text-none"
              depressed
              :disabled="disabled"
              @click="reset_form"
              ><icon-excap
                :disabled="disabled"
                class="mr-1"
                height="14"
                width="14"
              ></icon-excap>
              <div :style="`${disabled ? 'color: #CFD8DC' : 'color: black'}`">
                Quay lại
              </div></v-btn
            >
          </div>
        </template>

        <template v-slot:[`header.data-table-select`]>
          <div class="w-100 d-flex justify-center">
            <v-checkbox
              v-model="tick_all"
              class="ma-0"
              hide-details
              :disabled="(items || []).length === 0"
              :ripple="false"
              @change="selectall"
            >
            </v-checkbox>
          </div>
        </template>

        <template v-slot:[`item.data-table-select`]="{ item }">
          <div class="w-100 d-flex justify-center">
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

        <template v-slot:[`item.name`]="{ item }">
          <v-avatar size="30">
            <v-img :src="item.avatar"></v-img>
          </v-avatar>
          {{ item.name }}
        </template>

        <template v-slot:[`item.email`]="{ item }">
          {{ item.email }}
        </template>
        <template v-slot:[`item.phone`]="{ item }">
          {{ item.phone }}
        </template>
        <template v-slot:[`item.action`]="{ item }">
          <div class="d-flex">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  v-bind="attrs"
                  v-on="on"
                  @click="quest_delete(item)"
                >
                  <icon-delete></icon-delete>
                </v-btn>
              </template>
              <span>Xóa</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  v-bind="attrs"
                  :to="`/khach-hang/${item.id}`"
                  v-on="on"
                >
                  <!--                  @click="openEdit(item)"-->
                  <icon-edit></icon-edit>
                </v-btn>
              </template>
              <span>Cập nhật</span>
            </v-tooltip>
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
    <add
      v-show="open_add == 2"
      ref="additem"
      :open="open_add"
      @success="getlist"
      @toggle="open_add = 1"
    ></add>
    <yes-no-alert
      :alert-msg="alertdelete"
      :open="open_delete"
      @toggle="open_delete = !open_delete"
      @OK="confirm_delete"
    >
    </yes-no-alert>

    <yes-no-alert
      :open="open_deletes"
      :alert-msg="alertdelete"
      @toggle="open_deletes = !open_deletes"
      @OK="confirm_deletes"
    >
    </yes-no-alert>
    <Dialog
      :open="open_search"
      dialog-name="Tìm kiếm nâng cao"
      max_width="500"
      :is-reset="true"
      @reset="reset_data"
      @toggle="open_search = !open_search"
      @actionsUser="search_customs"
    >
      <v-row>
        <v-col cols="12">
          <v-text-field
            v-model="search1.customer"
            placeholder="Khách hàng"
            class="border-1 fs-14"
            solo
            flat
            dense
            hide-details
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="search1.email"
            placeholder="Địa chỉ email"
            class="border-1 fs-14"
            solo
            flat
            dense
            multiple
            hide-details
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="search1.phone"
            placeholder="Số điện thoại"
            class="border-1 fs-14"
            solo
            flat
            dense
            hide-details
            clearable
          ></v-text-field>
        </v-col>
      </v-row>
    </Dialog>

    <yes-no-alert
      :open="open_confirm"
      alert-msg="Bạn có chắc chắn muốn thoát không?"
      @toggle="open_confirm = !open_confirm"
      @OK="open_add = 1"
    ></yes-no-alert>
  </div>
</template>
<script>
import Add from '~/components/khach-hang/Add'
// import OpenDialog from '~/components/khach-hang/OpenDialog'
import Dialog from '~/components/Dialog'
export default {
  components: {
    // Edit,
    Add,
    // OpenDialog,
    Dialog,
  },
  data() {
    return {
      search1: {
        customer: '',
        email: '',
        phone: '',
      },
      tab: 0,
      loading: false,
      open_confirm: false,
      open_search: false,
      pageInfo: {},
      filter_phone_number: '',
      fiter_email_address: '',
      fiter_customer: '',
      setup: false,
      disabled: true,
      data_selected: [],
      tick_all: false,

      singleSelect: false,
      dataItem: {},
      open_add: 1,
      page: 1,
      pageCount: 1,
      pageSize: 50,
      totalItem: 0,
      search: '',
      alertdelete: '',
      dataDetail: '',

      title: 'Khách hàng',
      open_delete: false,
      open_deletes: false,
      list_id_delete: [],
      data_row: {},
      items: [],
      items_custom: [
        { value: 1, text: 'Người lớn' },
        { value: 2, text: 'Học sinh - Sinh viên' },
        { value: 3, text: 'Trẻ em' },
        { value: 4, text: 'Người cao tuổi' },
        { value: 5, text: 'Người có công' },
        { value: 6, text: 'Người địa phương' },
        { value: 7, text: 'Người nước ngoài' },
      ],
      headerscustom: [
        {
          checked: 1,
          text: 'ID',
          value: 'id',
          sortable: false,
          width: 50,
        },
        {
          checked: 1,
          text: 'Khách hàng',
          value: 'name',
          sortable: false,
          width: 150,
        },
        {
          checked: 1,
          text: 'Địa chỉ email',
          value: 'email',
          sortable: false,
          width: 150,
        },
        {
          checked: 1,
          text: 'Số điện thoại',
          value: 'phone',
          sortable: false,
          width: 150,
        },
        {
          checked: 1,
          text: 'Hành động',
          value: 'action',
          sortable: false,
          width: 100,
        },
      ],
      headers: [],
    }
  },
  watch: {
    open_add(value) {
      if (value === 1) {
        this.title = 'Khách hàng'
        this.$store.commit('app/checkBack', false)
      } else if (value === 2) {
        this.title = 'Thêm mới khách hàng'
        this.$store.commit('app/setTitle', this.title)
        this.$store.commit('app/checkBack', true)
      } else if (value === 3) {
        this.$store.commit('app/setTitle', this.title)
        this.$store.commit('app/checkBack', true)
        this.title = `Thông tin khách hàng - ${this.dataItem.name}`
      }
    },
    '$store.state.app.change_back'(value) {
      if (
        this.$store.state.app.pageTitle ===
          `Lịch sử giao dịch - ${this.dataItem.name}` ||
        this.$store.state.app.pageTitle ===
          `Thông tin khách hàng - ${this.dataItem.name}` ||
        this.$store.state.app.pageTitle ===
          `Đánh giá - ${this.dataItem.name}` ||
        this.$store.state.app.pageTitle ===
          `Danh sách đã lưu - ${this.dataItem.name}`
      ) {
        this.open_confirm = true
      }
      if (this.$store.state.app.pageTitle.includes('Thêm mới khách hàng')) {
        this.open_add = 1
        this.$store.commit('app/setTitle', 'Khách hàng')
      }
    },
  },
  created() {
    if (this.$route.fullPath === '/khach-hang') {
      this.title = 'Khách hàng'
      this.$store.commit('app/setTitle', 'Khách hàng')
    }
  },
  mounted() {
    this.getlist()
    this.$store.commit('app/checkBack', false)
    const arr = []
    for (let i = 0; i < this.headerscustom.length; i++) {
      if (this.headerscustom[i].checked === 1) {
        arr.push({ ...this.headerscustom[i] })
      }
    }
    this.headers = [...arr]
  },
  methods: {
    reset_data() {
      this.search1 = {
        customer: '',
        email: '',
        phone: '',
      }
    },
    search_customs() {
      this.page = 1
      this.getlist()
      this.open_search = false
    },
    export_customer_list() {
      this.loading = true
      this.$store
        .dispatch('khach_hang/export_customer_list', {
          search: (this.search || []).length !== 0 ? this.search.trim() : null,
          name: !this.$isNullOrEmpty(this.search1.customer)
            ? this.search1.customer.trim()
            : null,
          email: !this.$isNullOrEmpty(this.search1.email)
            ? this.search1.email.trim()
            : null,
          phone: !this.$isNullOrEmpty(this.search1.phone)
            ? this.search1.phone.trim()
            : null,
          group_id: null,
        })
        .then((res) => {
          if (!res.error) {
            window.location.href = res.data.data
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    title_edit(value) {
      if (value === 10) {
        this.title = `Thông tin khách hàng - ${this.dataItem.name}`
      }

      if (value === 11) {
        this.title = `Lịch sử giao dịch - ${this.dataItem.name}`
      }
      if (value === 12) {
        this.title = `Đánh giá - ${this.dataItem.name}`
      }
      if (value === 13) {
        this.title = `Danh sách đã lưu - ${this.dataItem.name}`
      }
    },
    changePageSize(pageSizes) {
      if (pageSizes !== this.itemsPerPage) {
        this.page = 1
        this.pageSize = pageSizes
        this.getlist()
      }
    },
    changePage(value) {
      this.page = value
      this.getlist()
    },
    getlist() {
      this.$store
        .dispatch('khach_hang/customer_list', {
          page_index: this.page,
          page_size: this.pageSize,
          search: (this.search || []).length !== 0 ? this.search.trim() : null,
          customer_name: !this.$isNullOrEmpty(this.search1.customer)
            ? this.search1.customer.trim()
            : null,
          email: !this.$isNullOrEmpty(this.search1.email)
            ? this.search1.email.trim()
            : null,
          phone: !this.$isNullOrEmpty(this.search1.phone)
            ? this.search1.phone.trim()
            : null,
          group_id: null,
        })
        .then((response) => {
          if (!response.error) {
            this.items = response.data.data.items
            if ((response.data.data.items || []).length !== 0) {
              for (let i = 0; i < response.data.data.items.length; i++) {
                response.data.data.items[i] = {
                  ...response.data.data.items[i],
                  stt: i + 1,
                  checked: 0,
                }
                for (let j = 0; j < this.data_selected.length; j++) {
                  if (
                    response.data.data.items[i].id === this.data_selected[j].id
                  ) {
                    response.data.data.items[i] = {
                      ...response.data.data.items[i],
                      checked: 1,
                    }
                  }
                }
              }

              let count = 0

              for (let i = 0; i < response.data.data.items.length; i++) {
                if (response.data.data.items[i].checked === 1) {
                  count += 1
                }
              }
              if (count === response.data.data.items.length) {
                this.tick_all = true
              } else {
                this.tick_all = false
              }
            }

            this.pageInfo = response.data.data.pageable
            this.pageCount = response.data.data.pageable.total_page
          }
        })

      // this.totalItem = this.items.length
      // const arr = []

      // for (let i = 0; i < this.headerscustom.length; i++) {
      //   if (this.headerscustom[i].checked === 1) {
      //     arr.push({ ...this.headerscustom[i] })
      //   }
      // }

      // this.headers = [...arr]
    },
    quest_deletes() {
      if (!this.disabled) {
        if (this.data_selected.length === 1) {
          if (this.$isNullOrEmpty(this.data_selected[0].name)) {
            this.alertdelete =
              'Bạn chắc chắn muốn xóa khách hàng có email "' +
              this.data_selected[0].email +
              '" này?'
          } else if (!this.$isNullOrEmpty(this.data_selected[0].name)) {
            this.alertdelete =
              'Bạn chắc chắn muốn xóa khách hàng  "' +
              this.data_selected[0].name +
              '" này?'
          }
        } else if (this.data_selected.length > 1) {
          this.alertdelete = 'Bạn chắc chắn muốn xóa những khách hàng này?'
        }
        this.open_deletes = true
      }
    },
    confirm_deletes() {
      const DATA = []
      for (let i = 0; i < this.data_selected.length; i++) {
        DATA.push(this.data_selected[i].id)
      }
      this.list_id_delete = DATA.join()
      this.$store
        .dispatch('khach_hang/customer_delete', {
          customer_id: String(this.list_id_delete),
        })
        .then((res) => {
          if (!res.error) {
            this.$showSuccess(this, 'Xóa khách hàng thành công')
            this.getlist()
            this.disabled = true
          }
        })
        .finally(() => {
          this.open_deletes = false
        })
    },
    reset_form() {
      this.tick_all = false
      this.disabled = true
      this.data_selected = []

      const arr = [...this.items]

      for (let i = 0; i < arr.length; i++) {
        arr[i].checked = 0
      }
      this.items = [...arr]
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
        this.disabled = false
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
          arr2.push(arr[i])
        }
        this.data_selected = [...arr2, ...this.data_selected]
      } else {
        this.set_selected_all(0)

        this.disabled = true
      }
    },
    set_value(value, item) {
      // this.$log.debug(value, item)
      // this.$log.debug(item, '2')
      // console.log(object);
      // console.log(item.checked, '1')
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

    openEdit(item) {
      this.open_add = 3
      this.dataItem = item
    },
    quest_delete(value) {
      this.data_row = value
      if (this.$isNullOrEmpty(value.name)) {
        this.alertdelete = `Bạn chắc chắn muốn xóa khách hàng có email "${value.email}" này?`
      } else if (!this.$isNullOrEmpty(value.name)) {
        this.alertdelete = `Bạn chắc chắn muốn xóa khách hàng "${value.name}" này?`
      }
      this.open_delete = true
    },
    deletesAll(value) {
      this.dataDetail = value
      this.open_deletes = true
    },
    confirm_delete() {
      this.$store
        .dispatch('khach_hang/customer_delete', {
          customer_id: String(this.data_row.id),
        })
        .then((response) => {
          if (!response.error) {
            this.getlist()
            this.$showSuccess(this, 'Xóa khách hàng thành công')
          }
        })
    },

    // clicked_supplier(value) {
    //   this.supplier = value
    // },
    clearSelected() {
      this.selected = null
    },
  },
}
</script>
<style lang="scss">
.main_customs {
  .v-data-table--fixed-header .v-data-table__wrapper {
    max-height: calc(80vh - 220px) !important;
  }
}
</style>
