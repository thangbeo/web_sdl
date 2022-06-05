<template>
  <div v-if="checkRole()">
    <div v-if="open_add === 1" class="page page--table quan-tri">
      <div class="fs-17 font-weight-bold">Danh sách quản trị viên</div>
      <v-data-table
        :headers="headers"
        :items="listQuanTriVien"
        :items-per-page="pageSize"
        hide-default-footer
        loading-text="Xin chờ..."
        no-results-text="Không có kết quả phù hợp"
        no-data-text="Không có dữ liệu"
        fixed-header
        multi-sort
        class="elevation-0"
      >
        <template #top>
          <v-app-bar flat color="#f4f7fe">
            <v-text-field
              v-model="searchAdmin"
              placeholder="Tìm kiếm: Tên, Email"
              prepend-inner-icon="mdi-magnify"
              background-color="white"
              class="mr-3 fs-14"
              style="margin-left: -16px"
              height="40"
              solo
              flat
              dense
              hide-details
              @keyup.enter="search"
            >
            </v-text-field>

            <div>
              <!-- <v-btn
                color="#47BBFF"
                class="text-none white--text mr-1"
                depressed
                height="40"
                @click="getlist"
              >
                Tìm kiếm
              </v-btn> -->

              <v-btn
                color="#47BBFF"
                class="text-none white--text"
                style="margin-right: -15px"
                depressed
                height="40"
                @click="add"
              >
                <v-icon>mdi-plus</v-icon>
                Thêm mới
              </v-btn>
            </div>
          </v-app-bar>
        </template>
        <template v-slot:[`item.action`]="{ item }">
          <div>
            <v-tooltip v-if="item.account_type !== 1" bottom>
              <template v-slot:activator="{ on }">
                <v-btn icon @click="askForDeleteItem(item)" v-on="on">
                  <icon-delete></icon-delete>
                </v-btn>
              </template>
              <span>Xóa</span>
            </v-tooltip>
            <v-tooltip v-if="item.account_type !== 1" bottom>
              <template v-slot:activator="{ on }">
                <v-btn icon v-on="on" @click="openEdit(item)">
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
      :open="open_add == 2"
      :data="listQuanTriVien"
      :listnotification="dataNotification"
      :listpermissions="dataList"
      @exit="back"
      @success="getlist"
    ></add>
    <edit
      v-show="open_add == 3"
      :open="open_add == 3"
      :data="dataItem"
      :listnotification="dataNotification"
      :listpermissions="dataList"
      @exit="back"
      @success="getlist"
    ></edit>

    <yes-no-alert
      :alert-msg="alertdelete"
      :open="open_delete"
      @toggle="open_delete = !open_delete"
      @OK="confirm_delete"
    >
    </yes-no-alert>

    <yes-no-alert
      :open="open_confirm"
      alert-msg="Bạn chắc chắn muốn thoát không?"
      @toggle="open_confirm = !open_confirm"
      @OK="back"
    />
  </div>
</template>
<script>
import add from '../../components/quan-tri-vien/add'
import edit from '../../components/quan-tri-vien/edit'
import Rules from '~/assets/configurations/Rules'
export default {
  components: {
    add,
    edit,
  },
  data() {
    return {
      Rules,
      open_confirm: false,
      alertdelete: '',
      dataItem: null,
      open_add: 1,
      dataDetail: null,
      open_delete: false,
      page: 1,
      pageCount: 1,
      pageSize: 50,
      pageInfo: {},
      searchAdmin: '',
      listQuanTriVien: [],
      dataNotification: [],
      dataList: [],
    }
  },
  computed: {
    headers() {
      return [
        {
          text: 'Tên',
          value: 'name',
          sortable: false,
          width: 130,
        },
        {
          text: 'Email',
          value: 'email',
          sortable: false,
          width: 130,
        },
        {
          text: 'Chức danh công việc',
          value: 'position',
          sortable: false,
          width: 200,
        },
        // {
        //   text: 'Sites',
        //   value: 'sites_name',
        //   sortable: false,
        //   width: 150,
        // },
        {
          text: 'Hành động',
          value: 'action',
          sortable: false,
          width: 80,
        },
      ]
    },
  },
  watch: {
    open_add(value) {
      if (value === 1) {
        this.title = 'Quản trị viên'
        this.$store.commit('app/checkBack', false)
      } else if (value === 2) {
        this.$store.commit('app/checkBack', true)
      } else if (value === 3) {
        this.$store.commit('app/checkBack', true)
      }
    },
    '$store.state.app.change_back'(value) {
      this.open_confirm = true
    },
  },
  mounted() {
    this.getlist()
    this.ListNotify()
    this.ListPermissions()
    this.$store.commit('app/checkBack', false)
  },
  methods: {
    checkRole() {
      const roles = this.$isAccessAction(
        this.$store.state.app.roles,
        Rules.System.Manager.id
      )
      return roles
    },
    search() {
      this.page = 1
      this.getlist()
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
        .dispatch('quan_tri_vien/getlist', {
          search:
            (this.searchAdmin || []).length !== 0
              ? this.searchAdmin.trim()
              : '',
          pageIdx: this.page,
          pageSize: this.pageSize,
          order_by: 'id',
        })
        .then((response) => {
          if (!response.error) {
            this.listQuanTriVien = response.data.data.items
            this.pageInfo = response.data.data.pageable
            this.pageCount = response.data.data.pageable.total_page
          }
        })
    },
    ListPermissions() {
      this.$store
        .dispatch('quan_tri_vien/getlistPermissions')
        .then((response) => {
          if (!response.error) {
            this.dataList = response.data.data
          }
        })
    },
    ListNotify() {
      this.$store
        .dispatch('quan_tri_vien/getListNotify', {})
        .then((response) => {
          if (!response.error) {
            this.dataNotification = response.data.data
          }
        })
    },
    add() {
      this.open_add = 2
      this.$store.commit('app/setTitle', 'Thêm quản trị viên')
    },
    back() {
      this.open_add = 1
      this.$store.commit('app/setTitle', 'Quản trị viên')
    },
    openEdit(item) {
      this.open_add = 3
      this.dataItem = item
      this.$store.commit('app/setTitle', 'Cập nhật quản trị viên')
    },
    askForDeleteItem(item) {
      this.dataDetail = item
      this.alertdelete =
        'Bạn chắc chắn muốn xóa Quản trị viên "' + item.name + '" này?'
      this.open_delete = true
    },
    confirm_delete() {
      if (this.dataDetail.status !== 1) {
        this.$store
          .dispatch('quan_tri_vien/delete', {
            account_id: this.dataDetail.id,
          })
          .then((res) => {
            if (!res.error) {
              this.$showSuccess(this, 'Xóa quản trị viên thành công')
              this.getlist()
            }
          })
      } else {
        this.$showWarnNotify(this, 'Quản trị viên đang hoạt động không thể xóa')
      }
    },
  },
  head() {
    this.$store.commit('app/setTitle', 'Quản trị viên')
    return {
      title: 'Quản trị viên',
    }
  },
}
</script>
<style lang="scss">
.quan-tri {
  .v-data-table--fixed-header .v-data-table__wrapper {
    max-height: calc(100vh - 247px);
  }
}
</style>
