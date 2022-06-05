<template>
  <div v-if="checkRole()" class="main_category_post">
    <div v-if="action === 1" class="page page--table">
      <div class="mr-4">
        <div class="fs-17 font-weight-bold">Danh sách danh mục</div>
        <v-row>
          <v-col>
            <v-text-field
              v-model="search"
              placeholder="Tìm kiếm"
              prepend-inner-icon="mdi-magnify"
              class="border-1"
              solo
              flat
              dense
              hide-details
              @keyup.enter="search_category_post"
            >
            </v-text-field>
          </v-col>
          <v-col cols="auto" class="px-0">
            <v-btn
              color="#47BBFF"
              class="text-none white--text mr-2"
              depressed
              @click="search_category_post"
            >
              Tìm kiếm
            </v-btn>
            <v-btn
              color="#47BBFF"
              class="text-none white--text"
              depressed
              @click="action = 2"
            >
              <v-icon>mdi-plus</v-icon>Thêm mới
            </v-btn>
          </v-col>
        </v-row>
      </div>
      <v-data-table
        :headers="headers"
        :items="list_category_posts"
        :page.sync="page"
        :items-per-page="pageSize"
        hide-default-footer
        loading-text="Xin chờ..."
        no-results-text="Không có kết quả phù hợp"
        no-data-text="Không có dữ liệu"
        fixed-header
        multi-sort
        :sort-desc="true"
        class="elevation-0 page__table"
      >
        <template v-slot:[`item.avatar`]="{ item }">
          <v-img :src="item.avatar" width="80px" height="80px"> </v-img>
        </template>
        <template v-slot:[`item.status`]="{ item }">
          <div class="d-flex justify-start align-center" style="width: 120px">
            <v-select
              v-model="item.status"
              :items="status_on_off"
              dense
              solo
              flat
              background-color="#f9f9f9"
              class="mt-5 border-1"
              @change="confirm_change_status(item)"
            >
              <!-- <template v-slot:selection="data">
                <div
                  class="fs-14"
                  :selected="data.selected"
                  @input="clearSelected"
                >
                  <div v-if="data.item.status === 0" style="color: #ff0f59">
                    <span>{{ data.item.text }}</span>
                  </div>
                  <div
                    v-else-if="data.item.status === 1"
                    style="color: #17e555"
                  >
                    {{ data.item.text }}
                  </div>
                </div>
              </template> -->
              <template v-slot:selection="data">
                <div :style="`color: ${data.item.color}`">
                  {{ data.item.text }}
                </div>
              </template>
              <template v-slot:item="data">
                <div
                  :style="`color: ${data.item.color} !important`"
                  class="fs-13"
                >
                  {{ data.item.text }}
                </div>
              </template>
            </v-select>
          </div>
        </template>

        <!-- //chức năng -->
        <template v-slot:[`item.actions`]="{ item }">
          <div class="d-flex">
            <!-- @click="openDetail(item)" -->
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  v-bind="attrs"
                  v-on="on"
                  @click="quest_detail(item)"
                >
                  <img class="mr-1" src="~/assets/icon/change_color_view.svg" />
                </v-btn>
              </template>
              <span>Xem trước</span>
            </v-tooltip>
            <v-tooltip v-if="item.of_system !== 1" bottom>
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
                <v-btn icon v-bind="attrs" v-on="on" @click="quest_edit(item)">
                  <icon-edit></icon-edit>
                </v-btn>
              </template>
              <span>Cập nhật</span>
            </v-tooltip>
            <!-- <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  v-bind="attrs"
                  v-on="on"
                  @click="quest_privew(item)"
                >
                  <img src="~/assets/icon/change_color_view.svg" />
                </v-btn>
              </template>
              <span>Xem trước</span>
            </v-tooltip> -->
            <!-- @click="openEdit(item)" -->
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
      v-show="action === 2"
      :open="action"
      @success="get_list"
      @toggle="action = 1"
    ></add>
    <edit
      v-show="action === 3"
      :data="item_data"
      :open="action"
      @success="get_list"
      @toggle="action = 1"
    ></edit>
    <preview
      v-show="action === 4"
      :open="action"
      :data="item_detail"
      @toggle="action = 1"
    ></preview>
    <!-- <yes-no-alert
      alert-msg="Bạn có chắc chắn muốn xóa "
      :open="open_delete"
      @toggle="open_delete = !open_delete"
      @OK="confirm_delete"
    ></yes-no-alert> -->
    <yes-no-alert
      :open="open_delete"
      :alert-msg="alertdelete"
      @toggle="open_delete = !open_delete"
      @OK="confirm_delete"
    >
    </yes-no-alert>
    <yes-no-alert
      :open="open_change"
      alert-msg="Bạn có muốn thay đổi trạng thái không?"
      @toggle="toggle_change_status"
      @OK="change_status"
    >
    </yes-no-alert>
    <yes-no-alert
      :open="open_confirm"
      alert-msg="Bạn có chắc chắn muốn thoát không?"
      @toggle="open_confirm = !open_confirm"
      @OK="action = 1"
    ></yes-no-alert>
  </div>
</template>

<script>
import Add from '~/components/CategoryPosts/Add'
import Edit from '~/components/CategoryPosts/edit/Edit'
import Preview from '~/components/CategoryPosts/View'
import Rules from '~/assets/configurations/Rules'
export default {
  components: {
    Add,
    Edit,
    Preview,
    // Draggable,
  },
  data: () => ({
    open_delete: false,
    open_confirm: false,
    title: 'Danh mục bài viết',
    status_on_off: [
      { value: 1, text: 'Hiển thị', color: '#47BBFF', status: 1 },
      { value: 0, text: 'Ẩn', color: '#FF0F59', status: 0 },
    ],
    open_change: false,
    list_category_posts: [],
    page: 1,
    pageSize: 50,
    pageCount: 1,
    pageInfo: {},
    action: 1,
    // itemPerPage: 0,
    alertdelete: '',
    data_row: {},
    status_data: {},
    search: '',
    item_data: {},
    item_detail: {},
  }),
  computed: {
    headers() {
      return [
        {
          text: 'Tên danh mục bài viết',
          sortable: false,
          value: 'tilte',
          width: 200,
        },
        {
          text: 'Ảnh bìa',
          sortable: false,
          value: 'avatar',
          width: 150,
        },
        {
          text: 'URL thân thiện cho SEO',
          sortable: false,
          value: 'url_seo',
          width: 150,
        },
        { text: 'Hiển thị/Ẩn', sortable: false, value: 'status', width: 100 },
        { text: 'Hành động', sortable: false, value: 'actions', width: 100 },
      ]
    },
  },

  watch: {
    action(value) {
      if (value === 1) {
        this.title = 'Danh mục bài viết'
        this.$store.commit('app/checkBack', false)
      } else if (value === 2) {
        this.title = 'Thêm danh mục bài viết'
      } else if (value === 3) {
        this.title = `Cập nhật danh mục bài viết `
      } else if (value === 4) {
        this.title = `Danh mục bài viết - ${this.data_row.tilte}`
      }
    },
    '$store.state.app.change_back'(value) {
      if (this.$store.state.app.pageTitle === 'Thêm danh mục bài viết') {
        this.action = 1
      } else {
        this.open_confirm = true
      }
    },
  },
  created() {
    if (this.$route.fullPath === '/danh-muc-bai-viet') {
      this.title = 'Danh mục bài viết'
      this.$store.commit('app/setTitle', 'Danh mục bài viết')
    }
  },
  mounted() {
    if (!this.$isServer) {
      this.get_list()
      this.$store.commit('app/checkBack', false)
    }
  },
  methods: {
    quest_detail(item) {
      this.$store
        .dispatch('danh_muc_bai_viet/detail_post', item.id)
        .then((res) => {
          if (!res.error) {
            this.category_post_view(res.data.data)
          }
        })
    },
    category_post_view(data) {
      const categoryLangUpdates = []
      for (let i = 0; i < data.categoryPostLang.length; i++) {
        categoryLangUpdates.push({
          lang_id: data.categoryPostLang[i].lang_id,
          title: data.categoryPostLang[i].tilte,
          url_seo: data.categoryPostLang[i].url_seo,
        })
      }
      const listPost = []
      for (let i = 0; i < data.postInCategory.length; i++) {
        listPost.push(
          String(
            `${data.postInCategory[i].post_id}-${data.postInCategory[i].status}`
          )
        )
      }
      this.$store
        .dispatch('danh_muc_bai_viet/preview_post_category', {
          update_by: 'sadjasd',
          status: data.status,
          avatar: data.avatar,
          list_post: listPost.join(),
          categoryLangUpdates,
          id: data.id,
          category_type: data.category_type,
        })
        .then((res) => {
          if (!res.error) {
            window.open(res.data.data)
          }
        })
    },
    checkRole() {
      const roles = this.$isAccessAction(
        this.$store.state.app.roles,
        Rules.System.CategoryPosts.id
      )
      return roles
    },
    search_category_post() {
      this.page = 1
      this.get_list()
    },
    confirm_change_status(item) {
      this.status_data = item
      this.open_change = true
    },
    toggle_change_status(value) {
      this.open_change = !this.open_change
      this.get_list()
    },
    change_status() {
      this.$store
        .dispatch('danh_muc_bai_viet/update_status_post', {
          id: this.status_data.id,
          status: this.status_data.status,
        })
        .then((response) => {
          if (!response.error) {
            this.get_list()
            this.$showSuccess(
              this,
              // `Thay đổi trạng thái danh mục "${this.update_status.tilte}" thành công`
              'Thay đổi trạng thái danh mục thành công'
            )
          }
        })
    },

    changePageSize(pageSizes) {
      if (pageSizes !== this.itemsPerPage) {
        this.page = 1
        this.pageSize = pageSizes
        this.get_list()
      }
    },
    changePage(value) {
      this.page = value
      this.get_list()
    },

    get_list() {
      this.$store
        .dispatch('danh_muc_bai_viet/list_post', {
          search: (this.search || []).length !== 0 ? this.search.trim() : '',
          pageIdx: this.page,
          pageSize: this.pageSize,
          orderBy: 'id',
          category_type: null,
        })
        .then((response) => {
          if (!response.error) {
            this.list_category_posts = response.data.data.items

            this.pageCount = response.data.data.pageable.total_page
            const arr = {
              begin_idx: response.data.data.pageable.begin_idx,
              end_idx: response.data.data.pageable.end_idx,
              total_page: response.data.data.pageable.total_page,
              total_record: response.data.data.pageable.total_record,
            }
            this.pageInfo = arr
          }
        })
    },
    quest_delete(item) {
      // this.$log.debug(item)

      this.data_row = item

      this.alertdelete = `Bạn chắc chắn muốn xóa danh mục bài viết " ${item.tilte} " này?`
      this.open_delete = true
    },
    confirm_delete() {
      this.$store
        .dispatch('danh_muc_bai_viet/delete_post', this.data_row.id)
        .then((response) => {
          if (!response.error) {
            this.get_list()
            this.$showSuccess(this, 'Xóa danh mục thành công')
          }
        })
    },
    quest_edit(item) {
      this.data_row = item
      this.$store
        .dispatch('danh_muc_bai_viet/detail_post', this.data_row.id)
        .then((res) => {
          if (!res.error) {
            this.item_data = res.data.data
            this.action = 3
          }
        })
    },
    // quest_privew(item) {
    //   this.data_row = item
    //   this.$store
    //     .dispatch('danh_muc_bai_viet/preview_post_category')
    //     .then((res) => {
    //       if (!res.error) {
    //         window.open(res.data.data)
    //       }
    //     })
    // },
    // askForDeleteItem(value) {
    //   this.dataDetail = value
    //   this.open_delete = true
    // },
    clearSelected() {
      this.selected = null
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
.page--table {
  .page {
    &__table {
      margin-top: 20px;
    }

    &__grab-icon {
      cursor: move;
    }
  }
}
.main_category_post {
  .v-data-table--fixed-header .v-data-table__wrapper {
    max-height: calc(94vh - 220px) !important;
  }
}
</style>
