<template>
  <div v-if="checkRole()">
    <div v-if="action === 1" class="language">
      <div class="fs-17 font-weight-bold mb-3">Danh sách ngôn ngữ</div>
      <v-data-table
        :headers="headers"
        :items="listNgonNgu"
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
              v-model="search"
              placeholder="Tìm kiếm: Mã ngôn ngữ, Ngôn ngữ, Tên hiển thị, Menu, Loại tiền tệ"
              prepend-inner-icon="mdi-magnify"
              background-color="white"
              class="mr-3 fs-14"
              style="margin-left: -16px"
              height="40"
              solo
              flat
              dense
              hide-details
              @keyup.enter="get_search"
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
            <v-tooltip v-if="item.is_system !== 1" bottom>
              <template v-slot:activator="{ on }">
                <v-btn icon v-on="on" @click="askForDeleteItem(item)">
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

        <template v-slot:[`item.menu`]="{ item }">{{
          (item.menus || []).length !== 0 ? item.menus[0].menu_name : ''
        }}</template>

        <template v-slot:[`item.status`]="{ item }">
          <v-select
            v-model="item.status"
            :items="list_status"
            background-color="#F9F9F9"
            solo
            dense
            flat
            hide-details
            style="width: 180px"
            class="pb-3 pt-3 fs-14"
            @change="confirm_change_status(item)"
          >
            <template v-slot:selection="data_status">
              <div class="fs-14" :style="`color: ${data_status.item.color}`">
                {{ data_status.item.text }}
              </div>
            </template>
            <template v-slot:item="data_status">
              <div
                :style="`color: ${data_status.item.color} !important`"
                class="fs-14"
              >
                {{ data_status.item.text }}
              </div>
            </template>
          </v-select>
        </template>

        <template v-slot:[`item.is_default`]="{ item }">
          <v-btn v-if="item.is_default === 1" icon color="primary">
            <v-icon>mdi-circle-slice-8</v-icon>
          </v-btn>
          <v-btn v-else icon @click="confirm_change(item)">
            <v-icon>mdi-checkbox-blank-circle-outline</v-icon>
          </v-btn>
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
      v-show="action === 2"
      :open="action"
      @toggle="action = 1"
      @OK="languageStatus"
    />

    <Edit
      v-show="action === 3"
      :open="action"
      :data="data"
      @toggle="action = 1"
      @OK="languageStatus"
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

    <yes-no-alert
      :open="open_change"
      alert-msg="Bạn có muốn thay đổi trạng thái không?"
      @toggle="toggle_change_status"
      @OK="change_status"
    >
    </yes-no-alert>

    <yes-no-alert
      :open="open_changes"
      alert-msg="Bạn có muốn thay đổi ngôn ngữ mặc định không?"
      @toggle="open_changes = !open_changes"
      @OK="set_language_default"
    >
    </yes-no-alert>
  </div>
</template>

<script>
import Rules from '~/assets/configurations/Rules'
import Add from '~/components/ngon-ngu/Add'
import Edit from '~/components/ngon-ngu/Edit'
export default {
  components: {
    Add,
    Edit,
  },
  data() {
    return {
      Rules,
      open_change: false,
      open_changes: false,
      data: {},
      title: 'Ngôn ngữ',
      action: 1,
      alertdelete: '',
      open_delete: false,
      open_confirm: false,
      defaults_data: {},
      dataDetail: null,
      search: null,
      page: 1,
      pageCount: 1,
      pageSize: 50,
      pageInfo: {},
      listNgonNgu: [],
      list_status: [
        { value: 1, text: 'Hoạt động', color: '#47BBFF' },
        {
          value: 0,
          text: 'Dừng hoạt động',
          color: '#FF0F59',
        },
      ],
    }
  },
  computed: {
    headers() {
      return [
        {
          text: 'Mã ngôn ngữ',
          value: 'code',
          sortable: false,
          width: 100,
        },
        {
          text: 'Ngôn ngữ',
          value: 'name',
          sortable: false,
          width: 100,
        },
        {
          text: 'Tên hiển thị',
          value: 'display_name',
          sortable: false,
          width: 150,
        },
        {
          text: 'Loại tiền tệ',
          value: 'currency_type',
          sortable: false,
          width: 100,
        },
        {
          text: 'Menu',
          value: 'menu',
          sortable: false,
          width: 150,
        },
        {
          text: 'Trạng thái',
          value: 'status',
          sortable: false,
          width: 200,
        },
        {
          text: 'Mặc định',
          value: 'is_default',
          sortable: false,
          width: 130,
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
        this.title = 'Ngôn ngữ'
        this.$store.commit('app/checkBack', false)
      } else if (value === 2) {
        this.title = 'Thêm ngôn ngữ'
      } else if (value === 3) {
        this.title = 'Cập nhật ngôn ngữ'
      }
    },
    '$store.state.app.change_back'(value) {
      this.open_confirm = true
    },
  },
  created() {
    if (this.$route.fullPath === '/quan-ly-ngon-ngu') {
      this.title = 'Ngôn ngữ'
      this.$store.commit('app/setTitle', 'Ngôn ngữ')
    }
  },
  mounted() {
    this.getlist()
    this.$store.commit('app/checkBack', false)
  },
  methods: {
    languageStatus() {
      this.getlist()
      this.$store.dispatch('app/list_languages')
    },
    checkRole() {
      const roles = this.$isAccessAction(
        this.$store.state.app.roles,
        Rules.System.language.id
      )
      return roles
    },
    getlist() {
      this.$store
        .dispatch('language/getlist', {
          search: (this.search || []).length !== 0 ? this.search.trim() : '',
          pageIdx: this.page,
          pageSize: this.pageSize,
        })
        .then((response) => {
          if (!response.error) {
            this.listNgonNgu = response.data.data.items
            this.pageInfo = response.data.data.pageable
            this.pageCount = response.data.data.pageable.total_page
          }
        })
    },
    confirm_change(item) {
      this.defaults_data = item
      this.open_changes = true
    },
    set_language_default() {
      const data = {
        lang_id: this.defaults_data.id,
        defaults: 1,
      }
      this.$store
        .dispatch('language/changes_default', data)
        .then((response) => {
          if (!response.error) {
            this.$showSuccess(this, 'Thay đổi ngôn ngữ mặc định thành công')
            this.getlist()
          }
        })
    },

    confirm_change_status(item) {
      this.status_data = item
      this.open_change = true
    },
    toggle_change_status() {
      this.open_change = !this.open_change
      this.getlist()
    },
    change_status() {
      const data = {
        lang_id: this.status_data.id,
        status: this.status_data.status,
      }
      this.$store
        .dispatch('language/change_status', data)
        .then((response) => {
          if (!response.error) {
            this.$showSuccess(this, 'Thay đổi trạng thái ngôn ngữ thành công')
            this.$store.dispatch('app/list_languages')
          }
        })
        .finally(() => {
          this.getlist()
        })
    },
    openEdit(item) {
      this.data = item
      this.$store
        .dispatch('language/detail', { lang_id: item.id })
        .then((res) => {
          if (!res.error) {
            this.data = res.data.data
            this.action = 3
          }
        })
    },
    askForDeleteItem(item) {
      this.dataDetail = item
      this.alertdelete =
        'Bạn chắc chắn muốn xóa ngôn ngữ "' + item.name + '" này không?'
      this.open_delete = true
    },
    confirm_delete() {
      this.$store
        .dispatch('language/delete', {
          lang_id: this.dataDetail.id,
        })
        .then((res) => {
          if (!res.error) {
            this.$showSuccess(this, 'Xóa ngôn ngữ thành công')
            this.$store.dispatch('app/list_languages')
            this.getlist()
          }
        })
    },
    get_search() {
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
.language {
  .v-data-table--fixed-header .v-data-table__wrapper {
    max-height: calc(100vh - 230px);
  }
}
</style>
