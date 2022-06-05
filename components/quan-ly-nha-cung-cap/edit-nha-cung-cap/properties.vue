<template>
  <v-row v-if="currentPage === pages.home" class="mt-12 prod-attr-comp">
    <!-- Text field tìm kiếm -->
    <v-col cols="12">
      <v-row>
        <v-col class="pt-0">
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
        :items="items"
        :items-per-page="items.length"
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
            <v-tooltip v-if="item.ofSystem === 1" bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  small
                  icon
                  v-bind="attrs"
                  @click="
                    selectedItem = item
                    currentPage = pages.detail
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
                      selectedItem = item
                      currentPage = pages.update
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
      <div class="fs-14 pt-1">
        <div>
          Hiển thị {{ items.length ? 1 : 0 }} đến {{ items.length }} của
          {{ items.length }} mục.
        </div>
      </div>
    </v-col>

    <!-- Dialog confirm xóa thuộc tính -->
    <yes-no-alert
      :open="confirmDeleteAttrIsOpened"
      :alert-msg="`Bạn chắc chắn muốn xóa thuộc tính ${selectedItem.name} không?`"
      @toggle="confirmDeleteAttrIsOpened = !confirmDeleteAttrIsOpened"
      @OK="deleteProdAttr"
    />
  </v-row>
  <ProdAttrDetail
    v-else-if="currentPage === pages.detail"
    embed
    :prod-attr="selectedItem"
    @close="currentPage = pages.home"
  />
  <ProdAttrUpdate
    v-else-if="currentPage === pages.update"
    embed
    :prod-attr="selectedItem"
    @close="currentPage = pages.home"
  />
</template>
<script>
import Rules from '~/assets/configurations/Rules'
import ProdAttrDetail from '~/pages/thuoc-tinh-san-pham/chi-tiet/_id.vue'
import ProdAttrUpdate from '~/pages/thuoc-tinh-san-pham/cap-nhat/_id.vue'
export default {
  components: {
    ProdAttrDetail,
    ProdAttrUpdate,
  },
  props: {
    providerId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      keyword: null,
      items: [],
      currentAttrTab: 0,
      selectedItem: {},
      confirmDeleteAttrIsOpened: false,
      currentPage: 'home',
      pages: {
        home: 'home',
        detail: 'detail',
        update: 'update',
      },
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
  },
  mounted() {
    this.getProductAttrList()
  },
  methods: {
    // Hàm check phân quyền
    checkRole() {
      const roles = this.$isAccessAction(
        this.$store.state.app.roles,
        Rules.System.Supplier.id
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
          type: 2,
          provider_id: this.providerId,
        })
        .then((response) => {
          if (!response.error) {
            this.$log.debug('[getProductAttrList]', response.data)
            this.items = response.data.data
          }
        })
        .catch((e) => {})
        .finally(() => {
          this.$wait.end('loadingAttr')
        })
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
}
</script>

<style lang="scss">
.prod-attr-comp {
  .v-data-table--fixed-header {
    .v-data-table__wrapper {
      max-height: calc(100vh - 245px) !important;
    }
  }

  .transparent-tabs {
    .v-tabs-bar {
      background: transparent !important;
    }
  }
}
</style>
