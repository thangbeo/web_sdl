<template>
  <v-row v-if="currentPage === pages.home" class="prod-attr-comp mt-12">
    <!-- Text field tìm kiếm -->
    <v-col cols="12">
      <v-row>
        <v-col class="pt-0">
          <!-- Textfield tìm kiếm -->
          <v-form @submit.prevent="getProductAttrSetList">
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
        v-model="bulkSelectedItems"
        show-select
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
        <template v-slot:top>
          <div class="d-flex align-center pt-3 px-3">
            <v-btn
              class="fs-14 text-none"
              color="white"
              depressed
              :text="!bulkSelectedItems.length"
              :disabled="!bulkSelectedItems.length"
              @click="confirmBulkDeleteDialogIsOpened = true"
            >
              <icon-close :disabled="!bulkSelectedItems.length" class="mr-2" />
              <div
                :style="`${
                  !bulkSelectedItems.length ? 'color: #CFD8DC' : 'color: black'
                }`"
              >
                Xóa
              </div>
            </v-btn>
            <v-divider
              style="max-height: 16px"
              class="mx-2 mt-3"
              inset
              vertical
            />
            <v-btn
              class="fs-14 text-none"
              color="white"
              depressed
              :text="!bulkSelectedItems.length"
              :disabled="!bulkSelectedItems.length"
              @click="bulkSelectedItems = []"
            >
              <icon-excap :disabled="!bulkSelectedItems.length" class="mr-2" />
              <div
                :style="`${
                  !bulkSelectedItems.length ? 'color: #CFD8DC' : 'color: black'
                }`"
              >
                Quay lại
              </div>
            </v-btn>
          </div>
        </template>
        <template v-slot:header.id="{ header }">
          <div align="center">
            {{ header.text }}
          </div>
        </template>
        <template v-slot:header.data-table-select="{ props, on }">
          <v-simple-checkbox
            v-bind="props"
            color="primary"
            v-on="on"
          ></v-simple-checkbox>
        </template>
        <template v-slot:item.data-table-select="props">
          <v-simple-checkbox
            :value="props.isSelected"
            color="primary"
            @input="props.select"
          ></v-simple-checkbox>
        </template>
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
                  icon
                  v-bind="attrs"
                  @click="openCloneProdAttrSetDialog(item)"
                  v-on="on"
                >
                  <icon-copy />
                </v-btn>
              </template>
              <span>Nhân bản</span>
            </v-tooltip>
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
            <v-tooltip v-if="item.ofSystem !== 1" bottom>
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
      :alert-msg="`Bạn chắc chắn muốn xóa bộ thuộc tính ${selectedItem.name} không?`"
      @toggle="confirmDeleteAttrIsOpened = !confirmDeleteAttrIsOpened"
      @OK="deleteProdAttrSet"
    />

    <!-- Dialog confirm xóa nhiều thuộc tính -->
    <yes-no-alert
      :open="confirmBulkDeleteDialogIsOpened"
      :alert-msg="`Bạn chắc chắn muốn xóa ${bulkSelectedItems.length}  bộ thuộc tính không?`"
      @toggle="
        confirmBulkDeleteDialogIsOpened = !confirmBulkDeleteDialogIsOpened
      "
      @OK="bulkDeleteProdAttrSet"
    />

    <!-- Dialog nhân bản bộ thuộc tính -->
    <CloneProdAttrSetDialog
      v-model="cloneProdAttrSetDialogIsOpen"
      :item="selectedItem"
      @clone-prod-attr-set="cloneProdAttrSet"
    />
  </v-row>
  <ProdAttrSetUpdate
    v-else-if="currentPage === pages.update"
    embed
    :prod-attr="selectedItem"
    @close="currentPage = pages.home"
  />
</template>

<script>
import Rules from '~/assets/configurations/Rules'
import CloneProdAttrSetDialog from '~/components/product-attr-set/CloneProdAttrSetDialog.vue'
import ProdAttrSetUpdate from '~/pages/bo-thuoc-tinh-san-pham/cap-nhat/_id.vue'
export default {
  components: {
    CloneProdAttrSetDialog,
    ProdAttrSetUpdate,
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
      bulkSelectedItems: [],
      cloneProdAttrSetDialogIsOpen: false,
      confirmBulkDeleteDialogIsOpened: false,
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
            '$vuetify.productAttrSet.dataTable.headers.id'
          ),
          value: 'id',
          sortable: false,
          class: 'text-center',
          align: 'center',
          width: 70,
        },
        {
          text: this.$vuetify.lang.t(
            '$vuetify.productAttrSet.dataTable.headers.attrSetName'
          ),
          value: 'name',
        },
        {
          text: this.$vuetify.lang.t(
            '$vuetify.productAttrSet.dataTable.headers.isOfSystem'
          ),
          value: 'ofSystem',
        },
        {
          text: this.$vuetify.lang.t(
            '$vuetify.productAttrSet.dataTable.headers.actions'
          ),
          value: 'actions',
          width: 150,
          sortable: false,
        },
      ]
    },
  },
  mounted() {
    this.getProductAttrSetList()
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

    // Hàm gọi API lấy danh sách bộ thuộc tính
    getProductAttrSetList() {
      // `productAttrSet/getProviderProductAttrSetList`
      this.$wait.start('loadingAttrSet')
      this.bulkSelectedItems = []
      this.$store
        .dispatch(`productAttrSet/getProviderProductAttrSetList`, {
          keyword: this.keyword,
          provider_id: this.providerId,
        })
        .then((response) => {
          if (!response.error) {
            this.$log.debug('[getProductAttrSetList]', response.data)
            this.items = response.data.data
          }
        })
        .catch((e) => {})
        .finally(() => {
          this.$wait.end('loadingAttrSet')
        })
    },

    // Hàm mở dialog confirm xóa thuộc tính
    openConfirmDeleteAttr(item) {
      this.selectedItem = item
      this.confirmDeleteAttrIsOpened = true
    },

    // Hàm xóa bộ thuộc tính
    deleteProdAttrSet() {
      this.$store
        .dispatch('productAttrSet/deleteProdAttrSet', {
          attributeSetIds: [this.selectedItem.id],
        })
        .then((response) => {
          if (!response.error) {
            this.$showSuccess(this, 'Xóa bộ thuộc tính thành công')
            this.getProductAttrSetList()
          }
        })
    },

    // Hàm nhân bản bộ thuộc tính
    cloneProdAttrSet(item) {
      this.$store
        .dispatch('productAttrSet/cloneProdAttrSet', {
          attributeSetId: item.id,
          name: item.name,
        })
        .then((response) => {
          if (!response.error) {
            this.$showSuccess(this, 'Nhân bản bộ thuộc tính thành công')
            this.getProductAttrSetList()
          }
        })
    },

    // Hàm mở dialog nhân bản bộ thuộc tính
    openCloneProdAttrSetDialog(item) {
      this.selectedItem = item
      this.cloneProdAttrSetDialogIsOpen = true
    },

    // Hàm xóa nhiều bộ thuộc tính
    bulkDeleteProdAttrSet() {
      const items = this.bulkSelectedItems.reduce((acc, cur, idx) => {
        if (cur.ofSystem === 2) {
          acc.push(cur.id)
        }
        return acc
      }, [])
      let message = `Đã xóa ${items.length} bộ thuộc tính thành công.`
      if (items.length < this.bulkSelectedItems.length) {
        message += ` Không thể xóa ${
          this.bulkSelectedItems.length - items.length
        } bộ thuộc tính hệ thống.`
      }
      this.$store
        .dispatch('productAttrSet/deleteProdAttrSet', {
          attributeSetIds: [...items],
        })
        .then((response) => {
          if (!response.error) {
            this.$showSuccess(this, message)
            this.getProductAttrSetList()
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
