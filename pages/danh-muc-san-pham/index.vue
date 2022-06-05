<template>
  <div v-if="checkRole()" class="category-product">
    <div v-if="actions === 1" class="page page--table">
      <div class="mr-4">
        <div class="fs-17 font-weight-bold">Danh sách danh mục</div>
        <v-row>
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
              @keydown.enter="search_list"
            >
            </v-text-field>
          </v-col>
          <v-col cols="auto">
            <v-btn
              color="#47BBFF"
              class="text-none white--text mr-2"
              depressed
              @click="search_list"
            >
              Tìm kiếm
            </v-btn>
            <v-btn
              color="#47BBFF"
              class="text-none white--text"
              depressed
              @click="actions = 2"
            >
              <v-icon>mdi-plus</v-icon>
              Thêm mới
            </v-btn>
          </v-col>
        </v-row>
      </div>
      <v-data-table
        :headers="headers"
        :items="list_category_product"
        :loading="$wait.is('loadingProductCategory')"
        hide-default-footer
        loading-text="Xin chờ..."
        no-results-text="Không có kết quả phù hợp"
        no-data-text="Không có dữ liệu"
        fixed-header
        multi-sort
        disable-pagination
        class="elevation-0 page__table"
      >
        <!--        :items-per-page="pageSize"-->
        <!--        :page.sync="page"-->
        <!--        @page-count="pageCount = $event"-->
        <template v-slot:body="props">
          <draggable
            :list="props.items"
            tag="tbody"
            handle=".handle"
            @change="change_sort"
          >
            <tr v-for="(item, index) in props.items" :key="`${item}-${index}`">
              <td>
                {{ item.id }}
              </td>
              <td>
                {{ item.name }}
              </td>
              <td>
                {{ item.add_to_menu === 1 ? 'Có' : 'Không' }}
              </td>
              <td>
                <v-icon color="#3F69B8" small class="page__grab-icon handle">
                  mdi-arrow-all
                </v-icon>
              </td>
              <td>
                <div class="d-flex">
                  <v-tooltip v-if="item.of_system !== 1" bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        icon
                        v-bind="attrs"
                        v-on="on"
                        @click="quest_delete(item)"
                      >
                        <icon-delete />
                      </v-btn>
                    </template>
                    <span>Xóa</span>
                  </v-tooltip>

                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        icon
                        v-bind="attrs"
                        v-on="on"
                        @click="quest_copy(item)"
                      >
                        <icon-copy />
                      </v-btn>
                    </template>
                    <span>Copy</span>
                  </v-tooltip>

                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        icon
                        v-bind="attrs"
                        v-on="on"
                        @click="quest_edit(item)"
                      >
                        <icon-edit />
                      </v-btn>
                    </template>
                    <span>Cập nhật</span>
                  </v-tooltip>
                </div>
              </td>
            </tr>
          </draggable>
        </template>
      </v-data-table>

      <!--      <pagination-->
      <!--        :items="list_category_product"-->
      <!--        :server="false"-->
      <!--        :page="page"-->
      <!--        :page-size="pageSize"-->
      <!--        :page-count="pageCount"-->
      <!--        @changePage="changePage"-->
      <!--        @changePageSize="changePageSize"-->
      <!--      />-->
    </div>

    <add
      v-show="actions === 2"
      :open="actions"
      @toggle="actions = 1"
      @OK="get_list"
    />

    <edit
      v-show="actions === 3"
      :open="actions"
      :data="data"
      @copy="open_copy = true"
      @toggle="actions = 1"
      @OK="get_list"
    />

    <yes-no-alert
      :open="open_delete"
      :alert-msg="alertdelete"
      @toggle="open_delete = !open_delete"
      @OK="confirm_delete"
    />

    <copy :open="open_copy" @toggle="open_copy = !open_copy" @OK="copy" />

    <yes-no-alert
      :open="open_confirm"
      alert-msg="Bạn chắc chắn muốn thoát không?"
      @toggle="open_confirm = !open_confirm"
      @OK="actions = 1"
    />
  </div>
</template>

<script>
import Draggable from 'vuedraggable'
import Add from '../../components/CategoryProduct/add/add'
import Edit from '../../components/CategoryProduct/edit/edit'
import Copy from '../../components/CategoryProduct/copy'
import Rules from '~/assets/configurations/Rules'

export default {
  components: {
    Add,
    Edit,
    Copy,
    Draggable,
  },
  data: () => ({
    Rules,
    title: 'Danh mục sản phẩm',
    list_category_product: [],
    // page: 1,
    // pageCount: 1,
    pageSize: 50,
    // totalItem: 0,
    search: '',
    actions: 1,
    open_delete: false,
    data_row: {},
    alertdelete: '',
    open_copy: false,
    data: {},
    open_confirm: false,
  }),
  computed: {
    headers() {
      return [
        { text: 'ID', sortable: false, value: 'id', width: 50 },
        {
          text: 'Danh mục sản phẩm',
          sortable: false,
          value: 'name',
          width: 300,
        },
        {
          text: 'Thêm vào Menu',
          sortable: false,
          value: 'add_to_menu',
          width: 150,
        },
        { text: 'Sắp xếp', sortable: false, value: 'sort', width: 100 },
        { text: 'Hành động', sortable: false, value: 'actions', width: 50 },
      ]
    },
  },
  watch: {
    actions(value) {
      if (value === 1) {
        this.title = 'Danh mục sản phẩm'
        this.$store.commit('app/checkBack', false)
      } else if (value === 2) {
        this.title = 'Thêm danh mục sản phẩm'
      } else if (value === 3) {
        this.title = `Cập nhật danh mục sản phẩm - #${this.data_row.name}`
      }
    },
    '$store.state.app.change_back'(value) {
      if (this.$store.state.app.pageTitle === 'Thêm danh mục sản phẩm') {
        this.actions = 1
      } else {
        this.open_confirm = true
      }
    },
  },
  created() {
    if (this.$route.fullPath === '/danh-muc-san-pham') {
      this.title = 'Danh mục sản phẩm'
      this.$store.commit('app/setTitle', 'Danh mục sản phẩm')
    }
  },
  mounted() {
    this.get_list()
    this.$store.commit('app/checkBack', false)
  },
  methods: {
    checkRole() {
      const roles = this.$isAccessAction(
        this.$store.state.app.roles,
        Rules.System.CategoryProduct.id
      )
      return roles
    },
    changePage(value) {
      this.page = value
      // this.get_list()
    },
    changePageSize(pageSizes) {
      if (pageSizes !== this.itemsPerPage) {
        this.page = 1
        this.pageSize = pageSizes
        // this.get_list()
      }
    },
    search_list() {
      this.page = 1
      this.get_list()
    },
    get_list() {
      this.$wait.start('loadingProductCategory')

      const DATA = {
        // page_index: this.page,
        // page_size: this.pageSize,
        search: (this.search || []).length !== 0 ? this.search.trim() : '',
      }

      this.$store
        .dispatch('category-product/get_list', DATA)
        .then((res) => {
          this.list_category_product = []
          if (!res.error) {
            this.list_category_product = res.data.data
            // this.totalItem = res.data.data.pageable.total_record
            // this.pageCount = res.data.data.pageable.total_page
          }
        })
        .finally(() => {
          this.$wait.end('loadingProductCategory')
        })
    },
    quest_delete(item) {
      // this.$log.debug(item)
      this.data_row = item
      this.alertdelete =
        'Bạn chắc chắn muốn xóa danh mục sản phẩm "' + item.name + '" này?'
      this.open_delete = true
    },
    confirm_delete() {
      this.$store
        .dispatch('category-product/delete_category', this.data_row.id)
        .then((res) => {
          if (!res.error) {
            this.get_list()
            this.$showSuccess(this, 'Xóa danh mục sản phẩm thành công')
          }
        })
    },
    quest_edit(item) {
      this.data_row = item
      this.$store
        .dispatch('category-product/detail_category', item.id)
        .then((res) => {
          if (!res.error) {
            this.data = res.data.data
            this.actions = 3
          }
        })
    },
    quest_copy(item) {
      this.data_row = item
      this.open_copy = true
    },
    copy(name) {
      const DATA = { product_category_id: this.data_row.id, name }
      this.$store
        .dispatch('category-product/copy_category', DATA)
        .then((res) => {
          if (!res.error) {
            this.open_copy = false
            this.$showSuccess(this, 'Nhân bản danh mục sản phẩm thành công')
            this.get_list()
          }
        })
    },
    change_sort(object) {
      const arr = [...this.list_category_product]
      const DATA = []

      arr.splice(object.moved.oldIndex, 1)
      arr.splice(object.moved.newIndex, 0, object.moved.element)

      for (let i = 0; i < arr.length; i++) {
        DATA.push(arr[i].id)
      }

      this.$store
        .dispatch('category-product/sort_category', DATA)
        .then((res) => {
          // if (!res.error) {
          //   this.$showSuccess(
          //     this,
          //     'Thay đổi vị trí danh mục sản phẩm thành công'
          //   )
          // }
        })
        .finally(() => {
          this.get_list()
        })
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
.category-product {
  .v-data-table--fixed-header .v-data-table__wrapper {
    max-height: calc(90vh - 170px) !important;
  }

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
}
</style>
