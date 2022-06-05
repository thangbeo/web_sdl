<template>
  <div v-if="checkRole()">
    <div v-if="action === 1" class="menu">
      <div class="fs-17 font-weight-bold mb-3">Danh sách menu</div>
      <v-data-table
        :headers="headers"
        :items="items"
        :items-per-page="pageSize"
        :page.sync="page"
        hide-default-footer
        loading-text="Xin chờ..."
        no-results-text="Không có kết quả phù hợp"
        no-data-text="Không có dữ liệu"
        fixed-header
        multi-sort
        class="elevation-0"
        @page-count="pageCount = $event"
      >
        <template #top>
          <v-app-bar flat color="#f4f7fe">
            <v-text-field
              v-model="search"
              placeholder="Tìm kiếm: ID, Tên menu, Sites"
              prepend-inner-icon="mdi-magnify"
              background-color="white"
              class="mr-3 fs-14"
              style="margin-left: -16px"
              height="40"
              solo
              flat
              dense
              hide-details
              @keydown.enter="set_fitter"
            >
            </v-text-field>

            <div>
              <v-btn
                color="#47BBFF"
                class="text-none white--text"
                style="margin-right: -15px"
                depressed
                height="40"
                @click="action = 2"
              >
                <v-icon>mdi-plus</v-icon>
                Thêm mới
              </v-btn>
            </div>
          </v-app-bar>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <div>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn icon v-on="on" @click="askForDeleteItem(item)">
                  <icon-delete></icon-delete>
                </v-btn>
              </template>
              <span>Xóa</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on" @click="quest_copy(item)">
                  <icon-copy />
                </v-btn>
              </template>
              <span>Copy</span>
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
      </v-data-table>
      <pagination
        :server="false"
        :items="items"
        :page="page"
        :page-size="pageSize"
        :page-count="pageCount"
        @changePage="changePage"
        @changePageSize="changePageSize"
      >
      </pagination>
    </div>

    <Add
      v-show="action === 2"
      :open="action"
      @toggle="dongMenuAdd"
      @OK="getlist"
    />

    <Edit
      v-show="action === 3"
      :open="action"
      :data="data"
      @toggle="dongMenuAdd"
      @OK="getlist"
    />

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
      @OK="action = 1"
    />

    <copy :open="open_copy" @toggle="open_copy = !open_copy" @OK="copy" />
  </div>
</template>

<script>
import Rules from '~/assets/configurations/Rules'
import Add from '~/components/menu/Add'
import Edit from '~/components/menu/Edit'
import Copy from '~/components/menu/Copy'
export default {
  components: {
    Add,
    Edit,
    Copy,
  },
  data() {
    return {
      Rules,
      data: {},
      title: 'Menu',
      action: 1,
      open_copy: false,
      alertdelete: '',
      open_delete: false,
      open_confirm: false,
      dataDetail: null,
      search: '',
      page: 1,
      pageCount: 1,
      pageSize: 50,
      items: [],
      data_row: {},
      items_default: [],
    }
  },
  computed: {
    headers() {
      return [
        {
          text: 'ID',
          value: 'id',
          sortable: false,
          width: 80,
        },
        {
          text: 'Tên menu',
          value: 'name',
          sortable: false,
          width: 300,
        },
        {
          text: 'Sites',
          value: 'sites_name',
          sortable: false,
          width: 300,
        },
        {
          text: 'Hành động',
          value: 'actions',
          sortable: false,
          width: 130,
        },
      ]
    },
  },
  watch: {
    action(value) {
      if (value === 1) {
        this.title = 'Menu'
        this.$store.commit('app/checkBack', false)
      } else if (value === 2) {
        this.title = 'Thêm menu'
      } else if (value === 3) {
        this.title = 'Cập nhật menu'
      }
    },
    '$store.state.app.change_back'(value) {
      this.open_confirm = true
    },
  },
  created() {
    if (this.$route.fullPath === '/danh-sach-menu') {
      this.title = 'Menu'
      this.$store.commit('app/setTitle', 'Menu')
    }
  },
  mounted() {
    this.getlist()
    this.$store.commit('app/checkBack', false)
  },
  methods: {
    set_fitter() {
      this.page = 1
      const arr = []
      if ((this.search || '').trim().length !== 0) {
        for (let i = 0; i < this.items_default.length; i++) {
          const str = `${this.$removeAccents(
            String(this.items_default[i].id)
          )} ${this.$removeAccents(
            this.items_default[i].name
          )} ${this.$removeAccents(
            (this.items_default[i].sites_name || '').length !== 0
              ? this.items_default[i].sites_name
              : ''
          )}`
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
    dongMenuAdd() {
      this.action = 1
      this.$store.commit('danh_sach_menu/setMenuID', null)
    },
    checkRole() {
      const roles = this.$isAccessAction(
        this.$store.state.app.roles,
        Rules.System.menu.id
      )
      return roles
    },
    getlist() {
      this.$store.dispatch('danh_sach_menu/getlist', {}).then((response) => {
        if (!response.error) {
          this.items = response.data.data
          this.items_default = response.data.data
        }
      })
    },

    openEdit(item) {
      this.$store.commit('danh_sach_menu/setMenuID', item.id)
      this.$store
        .dispatch('danh_sach_menu/detail', { menu_id: item.id })
        .then((res) => {
          if (!res.error) {
            this.action = 3
            this.data = { ...res.data.data, name: item.name, id: item.id }
          }
        })
    },
    askForDeleteItem(item) {
      this.dataDetail = item
      this.alertdelete =
        'Bạn chắc chắn muốn xóa Menu "' + item.name + '" này không?'
      this.open_delete = true
    },
    confirm_delete() {
      this.$store
        .dispatch('danh_sach_menu/delete', {
          menu_id: this.dataDetail.id,
        })
        .then((res) => {
          if (!res.error) {
            this.$showSuccess(this, 'Xóa menu thành công')
            this.getlist()
          }
        })
    },
    quest_copy(item) {
      this.data_row = item
      this.open_copy = true
    },
    copy(name) {
      const DATA = {
        menu_id: this.data_row.id,
        menu_name: name,
      }
      this.$store
        .dispatch('danh_sach_menu/copy', DATA)
        .then((res) => {
          if (!res.error) {
            this.$showSuccess(this, 'Nhân bản menu thành công')
            this.getlist()
          }
        })
        .finally(() => {
          this.open_copy = false
        })
    },

    // get_search() {
    //   this.page = 1
    //   this.getlist()
    // },
    changePageSize(pageSizes) {
      if (pageSizes !== this.itemsPerPage) {
        this.page = 1
        this.pageSize = pageSizes
      }
    },
    changePage(value) {
      this.page = value
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
.menu {
  .v-data-table--fixed-header .v-data-table__wrapper {
    max-height: calc(100vh - 230px);
  }
}
</style>
