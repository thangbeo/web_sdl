<template>
  <!-- Check phân quyền -->
  <v-row v-if="checkRole()" class="prod-attr-page">
    <v-col cols="12" class="pb-0">
      <v-tabs v-model="currentAttrTab" class="transparent-tabs">
        <v-tab
          class="text-none font-weight-bold letter-spacing-normal fs-17"
          :class="currentAttrTab !== 0 && 'black--text'"
          active-class="primary--text"
        >
          {{ $vuetify.lang.t('$vuetify.productAttrs.attrTabs.attrList') }}
        </v-tab>
        <v-tab
          class="text-none font-weight-bold letter-spacing-normal fs-17"
          :class="currentAttrTab !== 1 && 'black--text'"
          active-class="primary--text"
        >
          {{
            $vuetify.lang.t('$vuetify.productAttrs.attrTabs.providerAttrList')
          }}
        </v-tab>
      </v-tabs>
    </v-col>
    <v-col cols="12" class="pt-0 px-0">
      <v-tabs-items v-model="currentAttrTab" class="transparent">
        <!-- Danh sách thuộc tính -->
        <v-tab-item>
          <!-- Text field tìm kiếm -->
          <v-col cols="12">
            <v-row>
              <v-col>
                <!-- Textfield tìm kiếm -->
                <v-form @submit.prevent="getProductAttrList">
                  <v-text-field
                    v-model="keyword"
                    placeholder="Tìm kiếm tên thuộc tính"
                    prepend-inner-icon="mdi-magnify"
                    class="border-1 fs-14"
                    solo
                    flat
                    dense
                    hide-details
                  >
                  </v-text-field>
                </v-form>
              </v-col>
              <v-col cols="auto">
                <v-btn
                  color="#47BBFF"
                  class="text-none white--text"
                  depressed
                  @click="openAddNewProductAttrs"
                >
                  <v-icon>mdi-plus</v-icon>
                  Thêm mới
                </v-btn>
              </v-col>
            </v-row>
          </v-col>

          <!-- Bảng dữ liệu -->
          <v-col cols="12" class="pt-0">
            <v-data-table
              :headers="headers"
              :items="filteredItems"
              :items-per-page="pageSize"
              :header-props="{ sortIcon: 'mdi-menu-swap' }"
              item-key="id"
              fixed-header
              hide-default-footer
              :loading="$wait.is('loadingAttr')"
              loading-text="Xin chờ..."
              no-results-text="Không có kết quả phù hợp"
              no-data-text="Không có dữ liệu"
              class="elevation-0"
            >
              <template v-slot:item.ofSystem="{ item }">
                <div>
                  {{ item.ofSystem === 1 ? 'Có' : 'Không' }}
                </div>
              </template>
              <template v-slot:item.actions="{ item }">
                <div>
                  <v-tooltip v-if="item.ofSystem === 1" bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        small
                        icon
                        v-bind="attrs"
                        @click="
                          $router.push(
                            `/thuoc-tinh-san-pham/chi-tiet/${item.id}`
                          )
                        "
                        v-on="on"
                      >
                        <v-icon size="20">mdi-eye</v-icon>
                      </v-btn>
                    </template>
                    <span>Chi tiết</span>
                  </v-tooltip>
                  <template v-else>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          icon
                          v-bind="attrs"
                          @click="
                            $router.push(
                              `/thuoc-tinh-san-pham/cap-nhat/${item.id}`
                            )
                          "
                          v-on="on"
                        >
                          <icon-edit />
                        </v-btn>
                      </template>
                      <span>Cập nhật</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          icon
                          v-bind="attrs"
                          @click="openConfirmDeleteAttr(item)"
                          v-on="on"
                        >
                          <icon-delete />
                        </v-btn>
                      </template>
                      <span>Xóa</span>
                    </v-tooltip>
                  </template>
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
          </v-col>
        </v-tab-item>

        <!-- Thuộc tính do NCC tạo -->
        <v-tab-item>
          <!-- Text field tìm kiếm -->
          <v-col cols="12">
            <v-row>
              <v-col>
                <!-- Textfield tìm kiếm -->
                <v-form @submit.prevent="getProductAttrList">
                  <v-text-field
                    v-model="keyword"
                    placeholder="Tìm kiếm tên thuộc tính"
                    prepend-inner-icon="mdi-magnify"
                    class="border-1 fs-14"
                    solo
                    flat
                    dense
                    hide-details
                  >
                  </v-text-field>
                </v-form>
              </v-col>
            </v-row>
          </v-col>

          <!-- Bảng dữ liệu -->
          <v-col cols="12" class="pt-0">
            <v-data-table
              :headers="headers"
              :items="filteredItems"
              :items-per-page="pageSize"
              :header-props="{ sortIcon: 'mdi-menu-swap' }"
              item-key="id"
              fixed-header
              hide-default-footer
              loading-text="Xin chờ..."
              no-results-text="Không có kết quả phù hợp"
              no-data-text="Không có dữ liệu"
              class="elevation-0"
            >
              <template v-slot:item.ofSystem="{ item }">
                <div>
                  {{ item.ofSystem === 1 ? 'Có' : 'Không' }}
                </div>
              </template>
              <template v-slot:item.actions="{ item }">
                <div>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        small
                        icon
                        v-bind="attrs"
                        @click="
                          $router.push(
                            `/thuoc-tinh-san-pham/chi-tiet/${item.id}`
                          )
                        "
                        v-on="on"
                      >
                        <v-icon size="20">mdi-eye</v-icon>
                      </v-btn>
                    </template>
                    <span>Chi tiết</span>
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
          </v-col>
        </v-tab-item>
      </v-tabs-items>
    </v-col>

    <!-- Dialog confirm xóa thuộc tính -->
    <yes-no-alert
      :open="confirmDeleteAttrIsOpened"
      :alert-msg="deleteMsg"
      @toggle="confirmDeleteAttrIsOpened = !confirmDeleteAttrIsOpened"
      @OK="deleteProdAttr"
    />
  </v-row>
</template>

<script>
import Rules from '~/assets/configurations/Rules'
export default {
  data() {
    return {
      keyword: null,
      items: [],
      currentAttrTab: 0,
      selectedItem: {},
      confirmDeleteAttrIsOpened: false,
      pageInfo: {},
      page: 1,
      pageSize: 10,
      pageCount: 0,
    }
  },
  computed: {
    headers() {
      return [
        {
          text: this.$vuetify.lang.t(
            '$vuetify.productAttrs.dataTable.headers.id'
          ),
          value: 'id',
          width: 100,
        },
        {
          text: this.$vuetify.lang.t(
            '$vuetify.productAttrs.dataTable.headers.attrName'
          ),
          value: 'name',
        },
        {
          text: this.$vuetify.lang.t(
            '$vuetify.productAttrs.dataTable.headers.attrType'
          ),
          value: 'attribute_type',
        },
        {
          text: this.$vuetify.lang.t(
            '$vuetify.productAttrs.dataTable.headers.isOfSystem'
          ),
          value: 'ofSystem',
        },
        {
          text: this.$vuetify.lang.t(
            '$vuetify.productAttrs.dataTable.headers.actions'
          ),
          value: 'actions',
          width: 150,
          sortable: false,
        },
      ]
    },
    deleteMsg() {
      return `Bạn chắc chắn muốn xóa thuộc tính "${this.selectedItem.name}" không?`
    },
    filteredItems() {
      return this.items.filter(
        (item, index) =>
          index >= this.page * this.pageSize - this.pageSize &&
          index <= this.page * this.pageSize
      )
    },
  },
  watch: {
    currentAttrTab(newValue) {
      this.items = []
      this.getProductAttrList()
    },
  },
  created() {
    this.$store.commit('app/checkBack', false)
  },
  mounted() {
    this.getProductAttrList()
  },
  methods: {
    // Hàm check phân quyền
    checkRole() {
      const roles = this.$isAccessAction(
        this.$store.state.app.roles,
        Rules.System.ProductAttrs.id
      )
      return roles
    },

    // Hàm mở dialog thêm mới thuộc tính sản phẩm
    openAddNewProductAttrs() {
      this.$router.push('/thuoc-tinh-san-pham/them-moi')
    },

    // Hàm gọi API lấy danh sách thuộc tính
    getProductAttrList() {
      this.$wait.start('loadingAttr')
      this.$store
        .dispatch('productAttrs/getProductAttrList', {
          keyword: this.keyword,
          type: this.currentAttrTab + 1,
        })
        .then((response) => {
          if (!response.error) {
            this.$log.debug('[getProductAttrList]', response.data)
            this.items = response.data.data
            this.page = 1
            this.pageCount = Math.ceil(
              response.data.data.length / this.pageSize
            )
            this.pageInfo = {
              begin_idx: this.page * this.pageSize - this.pageSize + 1,
              end_idx: this.page * this.pageSize,
              total_page: this.pageCount,
              total_record: response.data.data.length,
            }
          }
        })
        .catch((e) => {})
        .finally(() => {
          this.$wait.end('loadingAttr')
        })
    },

    changePageSize(pageSizes) {
      // if (pageSizes !== this.itemsPerPage) {
      this.page = 1
      this.pageSize = pageSizes
      this.pageCount = Math.ceil(this.items.length / pageSizes)
      this.pageInfo = {
        begin_idx: this.page * this.pageSize - this.pageSize + 1,
        end_idx: this.page * this.pageSize,
        total_page: this.pageCount,
        total_record: this.items.length,
      }
      // }
    },
    changePage(value) {
      this.page = value
      this.pageInfo = {
        begin_idx: this.page * this.pageSize - this.pageSize + 1,
        end_idx: this.page * this.pageSize,
        total_page: this.pageCount,
        total_record: this.items.length,
      }
    },

    // Hàm mở dialog confirm xóa thuộc tính
    openConfirmDeleteAttr(item) {
      this.selectedItem = item
      this.confirmDeleteAttrIsOpened = true
    },

    // Hàm call API xóa thuộc tính
    deleteProdAttr() {
      this.$store
        .dispatch('productAttrs/deleteProdAttr', {
          attributeIds: [this.selectedItem.id],
        })
        .then((response) => {
          if (!response.error) {
            this.$showSuccess(this, 'Xóa thuộc tính thành công')
            this.getProductAttrList()
          }
        })
    },
  },
  head() {
    this.$store.commit(
      'app/setTitle',
      this.$vuetify.lang.t('$vuetify.productAttrs.title')
    )
    return {
      title: this.$vuetify.lang.t('$vuetify.productAttrs.title'),
    }
  },
}
</script>

<style lang="scss">
.prod-attr-page {
  .v-data-table--fixed-header {
    .v-data-table__wrapper {
      max-height: calc(100vh - 282px) !important;
    }
  }

  .transparent-tabs {
    .v-tabs-bar {
      background: transparent !important;
    }
  }
}
</style>
