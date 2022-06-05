<template>
  <div v-if="checkRole()">
    <div style="margin-top: -35px">
      <div v-if="open_add === 1" class="nha-cung-cap">
        <v-data-table
          :headers="headers"
          :items="items"
          :items-per-page="pageSize"
          :header-props="{ sortIcon: 'mdi-menu-swap' }"
          show-select
          hide-default-footer
          loading-text="Xin chờ..."
          no-results-text="Không có kết quả phù hợp"
          no-data-text="Không có dữ liệu"
          fixed-header
          class="elevation-0"
          @update:options="onSortedChange($event)"
        >
          <template #top>
            <div style="background-color: #f4f7fe">
              <v-menu :close-on-content-click="false" offset-y>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    class="text-none white--text mt-12 mb-2"
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
                placeholder="Tìm kiếm: Nhà cung cấp, Doanh nghiệp, Email, SĐT, Đăng ký kinh doanh, Sản phẩm"
                height="40px"
                solo
                flat
                dense
                hide-details
                @keyup.enter="searchNCC"
              >
              </v-text-field>

              <div class="pt-6 pb-9">
                <v-btn
                  class="mr-1 text-none white--text"
                  height="40px"
                  depressed
                  color="#656565"
                  @click="open_dialog = true"
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
                  @click="export_file"
                >
                  <img src="~/assets/icon/excel.svg" width="13" height="12" />
                  <span style="color: white"> Xuất Excel</span>
                  <template v-slot:loader>
                    <span>Xin chờ...</span>
                  </template>
                </v-btn>

                <v-btn
                  color="#47BBFF"
                  class="text-none white--text"
                  style="margin-right: -15px"
                  depressed
                  height="40px"
                  @click="Add"
                >
                  <v-icon>mdi-plus</v-icon>Thêm mới
                </v-btn>
              </div>
            </v-app-bar>
            <div class="d-flex align-center pt-3 pl-6">
              <v-btn
                class="fs-14 text-none"
                color="white"
                depressed
                :disabled="disabled"
                @click="quest_deletes"
              >
                <icon-close :disabled="disabled" class="mr-2"></icon-close>
                <div :style="`${disabled ? 'color: #CFD8DC' : 'color: black'}`">
                  Xóa
                </div>
              </v-btn>
              <v-divider
                style="max-height: 16px"
                class="mx-2 mt-3"
                inset
                vertical
              ></v-divider>
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
              <v-spacer></v-spacer>
            </div>
          </template>

          <template v-slot:[`header.data-table-select`]>
            <div class="w-100 d-flex justify-center">
              <v-checkbox
                v-model="tick_all"
                class="ma-1 pb-1"
                hide-details
                :indeterminate="indeterminate"
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
                class="ma-1 pb-1"
                hide-details
                :true-value="1"
                :false-value="0"
                :ripple="false"
                @change="set_value($event, item)"
              >
              </v-checkbox>
            </div>
          </template>

          <template v-slot:[`item.producer_name`]="{ item }">
            <v-avatar size="30">
              <v-img :src="item.image_url"></v-img>
            </v-avatar>
            {{ item.producer_name }}
          </template>

          <template v-slot:[`item.action`]="{ item }">
            <div>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn icon @click="quest_delete(item)" v-on="on">
                    <icon-delete></icon-delete>
                  </v-btn>
                </template>
                <span>Xóa</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn icon v-on="on" @click="openEdit(item)">
                    <icon-edit></icon-edit>
                  </v-btn>
                </template>
                <span>Cập nhật</span>
              </v-tooltip>
            </div>
          </template>

          <template v-slot:[`item.business_registration_code`]="{ item }">
            <v-chip outlined small style="border: 1px solid #dfe2e9">{{
              item.business_registration_code
            }}</v-chip>
          </template>
          <template v-slot:[`item.product_category_names`]="{ item }">
            <v-chip
              v-for="(product, index) in item.product_category_names.split(',')"
              :key="index"
              small
              class="my-1 mr-1"
              outlined
              style="border: 1px solid #dfe2e9"
              >{{ product }}</v-chip
            >
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
      <Add
        v-show="open_add == 2"
        :open="open_add == 2"
        :data="items"
        @exit="back"
      ></Add>
      <edit
        v-show="open_add == 3"
        :open="open_add"
        :data="dataItem"
        @title_edit="title_edit_ncc($event)"
        @exit="back"
        @backproductncc="title = 'Sản phẩm nhà cung cấp tạo - ' + nameDetail"
        @addproductncc="title = 'Thêm mới sản phẩm'"
        @updateproductncc="
          title = `Cập nhật sản phẩm nhà cung cấp tạo - #${$event.sku}`
        "
        @backproduct="title = 'Sản phẩm admin tạo - ' + nameDetail"
        @addproduct="title = 'Thêm mới sản phẩm'"
        @updateproduct="title = `Cập nhật sản phẩm admin tạo - #${$event.sku}`"
        @backhistory="title = 'Lịch sử giao dịch - ' + nameDetail"
        @addhistory="title = 'Thêm mới giao dịch'"
        @previewhistory="
          title = `Chi tiết giao dịch - #${$event.order_id_mask}`
        "
        @backreview="title = 'Đánh giá - ' + nameDetail"
        @updatereview="title = 'Cập nhật đánh giá'"
      ></edit>
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
      <updateStatus
        :open="update_status"
        @toggle="update_status = !update_status"
      ></updateStatus>
      <!-- @OK="changes_status" -->

      <OpenDialog
        :is-reset="true"
        :open="open_dialog"
        @reset="reset_filter"
        @toggle="open_dialog = !open_dialog"
        @filter="getlist($event)"
      >
      </OpenDialog>

      <yes-no-alert
        :open="open_confirm"
        alert-msg="Bạn chắc chắn muốn thoát không?"
        @toggle="open_confirm = !open_confirm"
        @OK="back"
      />
    </div>
  </div>
</template>
<script>
import edit from '../../components/quan-ly-nha-cung-cap/edit'
import Add from '../../components/quan-ly-nha-cung-cap/Add'
import updateStatus from '../../components/quan-ly-nha-cung-cap/updateStatus'
import OpenDialog from '~/components/quan-ly-nha-cung-cap/OpenDialog'
import Rules from '~/assets/configurations/Rules'
export default {
  components: {
    edit,
    Add,
    updateStatus,
    OpenDialog,
  },
  data() {
    return {
      Rules,
      open_confirm: false,
      nameDetail: null,
      loading: false,
      alertdelete: '',
      title: 'Nhà cung cấp',
      open_dialog: false,
      search: null,
      setup: false,
      disabled: true,
      data_selected: [],
      tick_all: false,
      indeterminate: false,
      singleSelect: false,
      auto: 0,
      dataItem: {},
      open_add: 1,
      dataDetail: [],
      page: 1,
      pageCount: 1,
      pageSize: 50,
      pageInfo: {},
      open_delete: false,
      open_deletes: false,
      update_status: false,
      listProduct: [],
      order_by: null,
      supplier: null,
      list_status: [
        { value: 1, text: 'Đã duyệt', color: '#17e555' },
        {
          value: 2,
          text: 'Chưa phê duyệt',
          color: '#f5972d',
        },
        { value: 3, text: 'Từ chối', color: '#ff0f59' },
      ],
      items: [],
      headerscustom: [
        {
          checked: 1,
          text: 'ID',
          value: 'id',
          width: 80,
        },
        {
          checked: 1,
          text: 'Nhà cung cấp',
          value: 'producer_name',
          sortable: false,
          width: 250,
        },
        {
          checked: 1,
          text: 'Doanh nghiệp',
          value: 'enterprise_name',
          sortable: false,
          width: 200,
        },
        {
          checked: 0,
          text: 'Email',
          value: 'email',
          sortable: false,
          width: 200,
        },
        {
          checked: 0,
          text: 'Số điện thoại',
          value: 'phone',
          sortable: false,
          width: 200,
        },
        {
          checked: 1,
          text: 'Đăng ký kinh doanh',
          value: 'business_registration_code',
          sortable: false,
          width: 180,
        },
        {
          checked: 0,
          text: 'Link website doanh nghiệp',
          value: 'enterprise_link_website',
          sortable: false,
          width: 250,
        },
        {
          checked: 1,
          text: 'Sản phẩm',
          value: 'product_category_names',
          sortable: false,
          width: 180,
        },
        {
          checked: 1,
          text: 'Hành động',
          value: 'action',
          sortable: false,
          width: 150,
        },
      ],
      headers: [],
    }
  },
  watch: {
    open_add(value) {
      if (value === 1) {
        this.title = 'Nhà cung cấp'
        this.$store.commit('app/checkBack', false)
      } else if (value === 2) {
        this.$store.commit('app/checkBack', true)
      } else if (value === 3) {
        this.$store.commit('app/checkBack', true)
      }
    },
    '$store.state.app.change_back'(value) {
      if (
        this.$store.state.app.pageTitle.includes('Thêm nhà cung cấp') ||
        this.$store.state.app.pageTitle.includes('Thông tin nhà cung cấp') ||
        this.$store.state.app.pageTitle.includes('Sản phẩm admin tạo') ||
        this.$store.state.app.pageTitle.includes('Sản phẩm nhà cung cấp tạo') ||
        this.$store.state.app.pageTitle.includes('Thuộc tính sản phẩm') ||
        this.$store.state.app.pageTitle.includes('Bộ thuộc tính sản phẩm') ||
        this.$store.state.app.pageTitle.includes('Lịch sử giao dịch') ||
        this.$store.state.app.pageTitle.includes('Đánh giá')
      ) {
        this.open_confirm = true
      }
    },
  },
  mounted() {
    // this.getlist()
    // this.get_status_auto()
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
    reset_filter() {
      this.searchNCC = {
        sku: null,
        name: null,
        status: null,
        price: null,
        price_msg: [],
        category: null,
        // enterprise: null,
        type: null,
        type_detail: null,
        display: null,
        dish_type: null,
        tour_time: null,
        departure_schedule: null,
      }
    },
    checkRole() {
      const roles = this.$isAccessAction(
        this.$store.state.app.roles,
        Rules.System.Supplier.id
      )
      return roles
    },
    title_edit_ncc(value) {
      if (value === 0) {
        this.title = 'Thông tin nhà cung cấp - ' + this.nameDetail
      }
      if (value === 1) {
        this.title = 'Sản phẩm admin tạo - ' + this.nameDetail
      }
      if (value === 2) {
        this.title = 'Sản phẩm nhà cung cấp tạo - ' + this.nameDetail
      }
      if (value === 3) {
        this.title = 'Thuộc tính sản phẩm - ' + this.nameDetail
      }
      if (value === 4) {
        this.title = 'Bộ thuộc tính sản phẩm - ' + this.nameDetail
      }
      if (value === 5) {
        this.title = 'Lịch sử giao dịch - ' + this.nameDetail
      }
      if (value === 6) {
        this.title = 'Đánh giá - ' + this.nameDetail
      }
      // if (value === 5) {
      //   this.title = 'Danh sách đã lưu - ' + this.nameDetail
      // }
    },
    getlist(event) {
      this.supplier = event
      this.$store
        .dispatch('nha_cung_cap/getlist', {
          search: (this.search || []).length !== 0 ? this.search.trim() : '',
          page_index: this.page,
          page_size: this.pageSize,
          email: this.$isNullOrEmpty(event) ? '' : event.email,
          phone: this.$isNullOrEmpty(event) ? '' : event.phone,
          producer_name: this.$isNullOrEmpty(event) ? '' : event.producer_name,
          enterprise_name: this.$isNullOrEmpty(event)
            ? ''
            : event.enterprise_name,
          registration_code: this.$isNullOrEmpty(event)
            ? ''
            : event.business_registration_code,
          status: this.$isNullOrEmpty(event) ? '' : event.status,
          product_type: this.$isNullOrEmpty(event)
            ? ''
            : event.product_category_names,
          order_by: this.order_by,
        })
        .then((response) => {
          if (!response.error) {
            const arr = []
            for (let i = 0; i < response.data.data.items.length; i++) {
              arr.push({
                ...response.data.data.items[i],
                checked: 0,
              })
            }
            this.items = [...arr]
            this.pageInfo = response.data.data.pageable
            this.pageCount = response.data.data.pageable.total_page
          }
        })
    },

    onSortedChange(value) {
      if (value.sortBy.length > 0) {
        this.order_by =
          value.sortBy[0] + ' ' + (value.sortDesc[0] ? 'desc' : 'asc')
      } else {
        this.order_by = null
      }
      this.getlist()
    },
    reset_form() {
      this.tick_all = false
      this.indeterminate = false
      this.disabled = true
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
          arr2.push(arr[i])
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

    Add() {
      this.open_add = 2
      this.title = 'Thêm nhà cung cấp'
    },
    back() {
      this.open_add = 1
      this.title = 'Nhà cung cấp'
    },
    openEdit(item) {
      this.$store.commit('nha_cung_cap/change_enterprise', item.id)
      this.open_add = 3
      this.dataItem = item
      this.title = 'Thông tin nhà cung cấp - ' + item.producer_name
      this.nameDetail = item.producer_name
      // console.log(item, 'item')
    },

    quest_deletes() {
      if (!this.disabled) {
        if (this.data_selected.length === 1) {
          this.alertdelete =
            'Bạn chắc chắn muốn xóa nhà cung cấp "' +
            this.data_selected[0].producer_name +
            '" này không?'
        } else if (this.data_selected.length > 1) {
          this.alertdelete =
            'Bạn chắc chắn muốn xóa những nhà cung cấp này không?'
        }
        this.open_deletes = true
      }
    },
    confirm_deletes() {
      const DATA = []
      for (let i = 0; i < this.data_selected.length; i++) {
        DATA.push(this.data_selected[i].id)
      }
      this.dataDetail = DATA.join()
      this.$store
        .dispatch('nha_cung_cap/delete', {
          enterprise_id: String(this.dataDetail),
        })
        .then((res) => {
          if (!res.error) {
            this.$showSuccess(this, 'Xóa nhà cung cấp thành công')
            this.getlist()
            this.disabled = true
          }
        })
        .finally(() => {
          this.open_deletes = false
        })
    },
    quest_delete(value) {
      this.data_row = value
      this.alertdelete = `Bạn chắc chắn muốn xóa nhà cung cấp "${value.producer_name}" này không?`
      this.open_delete = true
    },
    confirm_delete() {
      this.$store
        .dispatch('nha_cung_cap/delete', {
          enterprise_id: String(this.data_row.id),
        })
        .then((response) => {
          if (!response.error) {
            this.getlist()
            this.$showSuccess(this, 'Xóa nhà cung cấp thành công')
            this.disabled = true
          }
        })
    },

    export_file() {
      this.loading = true
      let DATA = {}
      if (!this.$isNullOrEmpty(this.supplier)) {
        DATA = {
          producer_name: this.supplier.producer_name,
          enterprise_name: this.supplier.enterprise_name,
          email: this.supplier.email,
          phone: this.supplier.phone,
          registration_code: this.supplier.business_registration_code,
          status: this.supplier.status,
          product_type: this.supplier.product_category_names,
        }
      }
      this.$store
        .dispatch('nha_cung_cap/export_excel', {
          enterprise_ids: 0,
          search: this.search,
          ...DATA,
        })
        .then((response) => {
          if (!response.error) {
            window.location.href = response.data.data
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    searchNCC() {
      this.page = 1
      this.getlist()
    },
    changePage(value) {
      this.page = value
      this.getlist()
    },
    changePageSize(pageSizes) {
      if (pageSizes !== this.itemsPerPage) {
        this.page = 1
        this.pageSize = pageSizes
        this.getlist()
      }
    },
  },
  head() {
    this.$store.commit('app/setTitle', this.title)
    return {
      title: this.title,
    }
  },
}
</script>
<style lang="scss">
.nha-cung-cap {
  .v-data-table--fixed-header .v-data-table__wrapper {
    max-height: calc(100vh - 310px);
  }
  .theme--light.v-btn.v-btn--disabled:not(.v-btn--flat):not(.v-btn--text):not(.v-btn--outlined) {
    background-color: white !important;
    color: black !important;
  }
}
</style>
