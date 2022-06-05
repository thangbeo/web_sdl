<template>
  <div v-if="checkRole()">
    <div v-if="action === 1">
      <v-data-table
        :headers="headers"
        :items="items"
        :page.sync="page"
        :items-per-page="pageSize"
        hide-default-footer
        loading-text="Xin chờ..."
        no-results-text="Không có kết quả phù hợp"
        no-data-text="Không có dữ liệu"
        fixed-header
        multi-sort
        :sort-desc="true"
        class="elevation-0"
      >
        <template #top>
          <v-app-bar flat color="#f4f7fe">
            <v-text-field
              v-model="search1"
              class="mr-3 pt-3 pb-6"
              style="margin-left: -16px"
              prepend-inner-icon="mdi-magnify"
              placeholder="Tìm kiếm tên bài viết"
              height="40px"
              solo
              flat
              dense
              hide-details
              @keyup.enter="search_post"
            >
            </v-text-field>

            <div class="pt-6 pb-9">
              <v-btn
                class="mr-1 text-none white--text"
                depressed
                height="40px"
                color="secondary"
                @click="open_search = true"
              >
                Tìm kiếm nâng cao</v-btn
              >
              <v-menu :close-on-content-click="false" offset-y>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    class="text-none white--text"
                    color="#47BBFF"
                    depressed
                    v-bind="attrs"
                    height="40px"
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
              <v-btn
                color="#47BBFF"
                class="ml-1 text-none white--text"
                depressed
                height="40px"
                @click="action = 2"
              >
                <v-icon>mdi-plus</v-icon>Thêm mới
              </v-btn>
            </div>
          </v-app-bar>
        </template>

        <template v-slot:[`item.avatar_small`]="{ item }">
          <v-img
            :src="item.avatar_small"
            width="80px"
            class="my-1"
            height="80px"
          >
          </v-img>
        </template>

        <template v-slot:[`item.category_post_title`]="{ item }">
          {{ item.category_post_title }}
        </template>
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
              <!-- @click="quest_edit(item)" -->
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  v-bind="attrs"
                  :to="`/bai-viet/${item.post_id}`"
                  v-on="on"
                >
                  <icon-edit></icon-edit>
                </v-btn>
              </template>
              <span>Cập nhật</span>
            </v-tooltip>
            <!-- <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on" @click="quest_view(item)">
                  <img src="~/assets/icon/change_color_view.svg" />
                </v-btn>
              </template>
              <span>Xem trước</span>
            </v-tooltip> -->

            <!-- @click="openEdit(item)" -->
          </div>
        </template>
        <template v-slot:[`item.post_type`]="{ item }">
          <v-chip v-if="item.post_type === 2" outlined>Khuyến mại</v-chip>
          <v-chip v-if="item.post_type === 1" outlined>Mặc định</v-chip>
        </template>
        <template v-slot:[`item.status`]="{ item }">
          <v-select
            v-model="item.status"
            :items="list_status"
            solo
            dense
            flat
            background-color="#F9F9F9"
            hide-details
            style="width: 120px"
            class="pb-2 border-1 fs-14"
            @change="confirm_change_status(item)"
          >
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

    <!-- @success="getlist" -->
    <add
      v-show="action === 2"
      :open="action"
      @success="getlist"
      @toggle="action = 1"
    ></add>
    <!-- <edit
      v-show="action === 3"
      :data="item_data"
      :open="action"
      @success="getlist"
      @toggle="action = 1"
    ></edit> -->
    <preview
      v-show="action === 4"
      :open="action"
      :data="item_data_view"
      @toggle="action = 1"
    ></preview>
    <Dialog
      :open="open_search"
      dialog-name="Tìm kiếm nâng cao"
      max_width="600"
      :is-reset="true"
      @reset="reset_data"
      @toggle="open_search = !open_search"
      @actionsUser="search_post"
    >
      <v-row>
        <v-col cols="6">
          <v-text-field
            v-model="search.name"
            placeholder="Nhập tên bài viết"
            class="border-1 fs-14"
            solo
            flat
            dense
            hide-details
            clearable
          >
          </v-text-field>
        </v-col>
        <v-col cols="6">
          <v-select
            v-model="search.status"
            :items="list_status"
            placeholder="Chọn trạng thái"
            item-color="white"
            class="border-1 fs-14"
            solo
            flat
            dense
            hide-details
            clearable
          >
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
        </v-col>

        <v-col cols="6">
          <v-select
            v-model="search.choose_form"
            :items="search_list_form"
            placeholder="Loại bài viết"
            class="border-1 fs-14"
            solo
            flat
            dense
            hide-details
            clearable
          >
          </v-select>
        </v-col>

        <v-col cols="6">
          <v-autocomplete
            v-model="search.category"
            :items="list_category"
            placeholder="Chọn danh mục bài viết"
            class="border-1 fs-14"
            solo
            flat
            dense
            multiple
            hide-details
            clearable
          >
          </v-autocomplete>
        </v-col>
      </v-row>
    </Dialog>
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
import preview from '~/components/bai-viet/view.vue'
// import Edit from '~/components/bai-viet/Edit/Edit.vue'
import Add from '~/components/bai-viet/Add/Add.vue'
// import Dialog from '~/components/bai-viet/Dialog'
import Dialog from '~/components/Dialog'
import Rules from '~/assets/configurations/Rules'
export default {
  components: {
    // Edit,
    Add,
    Dialog,
    preview,
  },
  data() {
    return {
      open_confirm: false,
      search1: null,
      search: {
        name: null,
        status: null,
        category: null,
        choose_form: null,
      },
      list_category: [],
      open_search: false,
      statusDefault: 1,
      open_dialog: false,
      title: 'Danh sách bài viết',
      data_row: {},
      alertdelete: '',
      filter_category_posts: '',
      filter_name: '',
      filter_status: '',
      setup: false,
      disabled: true,
      data_selected: [],
      tick_all: false,
      indeterminate: false,
      singleSelect: false,
      supplier: true,
      dataItem: null,
      action: 1,
      page: 1,
      pageSize: 50,
      pageCount: 1,
      pageInfo: {},
      open_delete: false,
      open_change: false,
      status_data: {},
      item_data: {},
      item_data_view: {},
      is_category_post: [],
      arr: [],
      search_list_form: [
        {
          value: 1,
          text: 'Mặc định',
        },
        {
          value: 2,
          text: 'Khuyến mại',
        },
      ],
      list_form: [
        {
          value: 1,
          text: 'Mặc định',
        },
        {
          value: 2,
          text: 'Khuyến mại',
        },
      ],
      list_status: [
        { value: 1, text: 'Hiển thị', status: 1, color: '#47BBFF' },
        {
          value: 0,
          color: '#ff0f59',
          text: 'Ẩn',
          status: 0,
        },
      ],
      items: [],
      headerscustom: [
        {
          checked: 1,
          text: 'Tên bài viết',
          value: 'post_name',
          sortable: false,
          width: 200,
        },
        {
          checked: 1,
          text: 'Ảnh thu nhỏ',
          value: 'avatar_small',
          sortable: false,
          width: 150,
        },
        {
          checked: 1,
          text: 'Loại bài viết',
          value: 'post_type',
          sortable: false,
          width: 150,
        },
        {
          checked: 1,
          text: 'Danh mục bài viết',
          value: 'category_post_title',
          sortable: false,
          width: 150,
        },
        {
          checked: 1,
          text: 'Hiển thị/ Ẩn',
          value: 'status',
          sortable: false,
          width: 100,
        },
        {
          checked: 1,
          text: 'Hành động',
          value: 'actions',
          sortable: false,
          width: 100,
        },
      ],
      headers: [],
    }
  },
  watch: {
    action(value) {
      if (value === 1) {
        this.title = 'Danh sách bài viết'
        this.$store.commit('app/checkBack', false)
      } else if (value === 2) {
        this.title = 'Thêm bài viết'
      } else if (value === 3) {
        this.title = `Cập nhật bài viết`
      } else if (value === 4) {
        this.title = `Bài viết - ${this.data_row.post_name}`
      }
    },
    '$store.state.app.change_back'(value) {
      if (this.$store.state.app.pageTitle === 'Thêm bài viết') {
        this.action = 1
      } else {
        this.open_confirm = true
      }
    },
  },
  mounted() {
    this.getlist()
    this.get_list_category_post()
    this.$store.commit('app/checkBack', false)
  },
  methods: {
    quest_detail(item) {
      this.$store
        .dispatch('bai_viet/detail', { post_id: item.post_id })
        .then((res) => {
          if (!res.error) {
            this.post_view(res.data.data)
          }
        })
    },
    post_view(data) {
      // console.log(data)
      const postLangs = []
      const arr = []
      const suggestions = []
      this.is_category_post = data.post.category_post_ids.split(',')

      for (let i = 0; i < this.is_category_post.length; i++) {
        arr.push({ category_id: this.is_category_post[i] })
      }
      for (let i = 0; i < data.postLangs.length; i++) {
        postLangs.push({
          lang_id: data.postLangs[i].lang_id,
          post_name: data.postLangs[i].post_name,
          url_seo: data.postLangs[i].url_seo,
          content: data.postLangs[i].content,
        })
      }
      for (let i = 0; i < data.productSuggests.length; i++) {
        suggestions.push(
          String(
            `${data.productSuggests[i].id}-${data.productSuggests[i].product_type}`
          )
        )
      }
      this.$store
        .dispatch('bai_viet/preview_post', {
          post_id: String(data.post.id),
          save_status: data.post.save_status,
          status: data.post.status,
          post_type: data.post.post_type,
          avatar_small: data.post.avatar_small,
          avatar: data.post.avatar,
          vote_status: data.post.vote_status,
          interested_status: data.post.interested_status,
          promotions_start: data.post.promotions_start,
          promotions_end: data.post.promotions_end,
          promotions_code: data.post.promotions_code,
          postLangs,
          categoryPosts: arr,
          listProduct: suggestions.join(),
        })
        .then((response) => {
          if (!response.error) {
            window.open(response.data.data)
          }
        })
    },
    reset_data() {
      this.search = {
        name: null,
        status: null,
        category: null,
        choose_form: null,
      }
    },
    checkRole() {
      const roles = this.$isAccessAction(
        this.$store.state.app.roles,
        Rules.System.Posts.id
      )
      return roles
    },
    search_post() {
      this.page = 1
      this.getlist()
      this.open_search = false
    },
    get_list_category_post() {
      this.$store.dispatch('bai_viet/category_post', {}).then((response) => {
        if (!response.error) {
          response.data.data.map((item) => {
            this.list_category.push({
              text: item.tilte,
              value: item.category_post_id,
            })
          })
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
        post_id: this.status_data.post_id,
        status: this.status_data.status,
      }
      this.$store
        .dispatch('bai_viet/update_status_post', data)
        .then((response) => {
          if (!response.error) {
            this.$showSuccess(
              this,
              // `Thay đổi trạng thái danh mục "${this.update_status.tilte}" thành công`
              'Thay đổi trạng thái danh mục thành công'
            )
          }
        })
        .finally(() => {
          this.getlist()
        })
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
      // this.arr = event.category_posts
      this.$store
        .dispatch('bai_viet/list', {
          search: (this.search1 || []).length !== 0 ? this.search1 : null,
          status: !this.$isNullOrEmpty(this.search.status)
            ? this.search.status
            : null,
          // status: null,
          post_type: !this.$isNullOrEmpty(this.search.choose_form)
            ? this.search.choose_form
            : null,
          name:
            (this.search.name || '').length !== 0
              ? this.search.name.trim()
              : null,
          category: !this.$isNullOrEmpty(this.search.category)
            ? this.search.category.join()
            : null,
          pageIdx: this.page,
          pageSize: this.pageSize,
          order: '',
        })
        .then((response) => {
          if (!response.error) {
            this.items = response.data.data.items
            for (let i = 0; i < this.items.length; i++) {
              Object.assign(this.items[i], {
                checked: 0,
              })
            }
            const arr = []
            for (let i = 0; i < this.headerscustom.length; i++) {
              if (this.headerscustom[i].checked === 1) {
                arr.push({ ...this.headerscustom[i] })
              }
            }
            this.headers = [...arr]

            this.pageInfo = response.data.data.pageable
            this.pageCount = response.data.data.pageable.total_page
          }
        })
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
      }
      this.items = [...arr]
    },
    selectall(value) {
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
        this.indeterminate = true
        this.disabled = false
      } else if (arr.length === this.items.length) {
        this.indeterminate = false
        this.tick_all = true
        this.disabled = false
      } else if (arr.length === 0) {
        this.tick_all = false
        this.indeterminate = false
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
    quest_delete(item) {
      // console.log(item, '12312')
      this.data_row = item
      this.alertdelete = `Bạn chắc chắn muốn xóa bài viết "${item.post_name}" này?`
      this.open_delete = true
    },
    confirm_delete() {
      this.$store
        .dispatch('bai_viet/delete', this.data_row.post_id)
        .then((response) => {
          if (!response.error) {
            this.getlist()
            this.$showSuccess(this, 'Xóa bài viết thành công')
          }
        })
    },

    // clicked_supplier(value) {
    //   this.supplier = value
    // },
    clearSelected() {
      this.selected = null
    },
    quest_edit(item) {
      this.data_row = item

      this.$store
        .dispatch('bai_viet/detail', { post_id: item.post_id })
        .then((res) => {
          if (!res.error) {
            this.item_data = res.data.data
            this.action = 3
          }
        })
    },
    // quest_view(item) {
    //   this.data_row = item
    //   this.$store.dispatch('bai_viet/preview_post', {}).then((res) => {
    //     if (!res.error) {
    //       window.open(res.data.data)
    //     }
    //   })
    // },
  },
  head() {
    this.$store.commit('app/setTitle', this.title)
    return {
      title: this.title,
    }
  },
  // head() {
  //   this.$store.commit('app/setTitle', 'Danh sách bài viết')
  //   return {
  //     title: 'Danh sách bài viết',
  //   }
  // },
}
</script>
