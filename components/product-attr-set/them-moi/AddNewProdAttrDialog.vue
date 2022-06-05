<template>
  <v-dialog
    :value="value"
    content-class="add-prod-attr-dialog ma-0 ml-auto rounded-0"
    transition="slideRight"
    max-width="50%"
    width="50%"
    :hide-overlay="false"
    @input="toggle"
  >
    <v-card tile height="100%" max-height="100%">
      <v-card-title class="font-weight-bold"> THÊM THUỘC TÍNH </v-card-title>
      <v-card-text>
        <v-row no-gutters>
          <v-col cols="12" class="pb-3">
            <!-- Textfield tìm kiếm -->
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
          </v-col>

          <v-col>
            <!-- 180px -->
            <v-data-table
              v-model="selectedItems"
              :headers="prodAttrHeaders"
              :items="filterredProdAttrs"
              :items-per-page="filterredProdAttrs.length"
              :header-props="{ sortIcon: 'mdi-menu-swap' }"
              item-key="id"
              fixed-header
              show-select
              :loading="$wait.is('loadingAttr')"
              hide-default-footer
              loading-text="Xin chờ..."
              no-results-text="Không có kết quả phù hợp"
              :no-data-text="`Không có dữ liệu`"
              class="elevation-1"
            >
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
            </v-data-table>
            <div class="fs-14 pt-1">
              <div>
                Hiển thị {{ filterredProdAttrs.length ? 1 : 0 }} đến
                {{ filterredProdAttrs.length }} của {{ prodAttrs.length }} mục.
              </div>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="sticky" style="top: 100%">
        <v-spacer></v-spacer>
        <v-btn
          class="text-none white--text mr-3"
          color="error"
          depressed
          width="90"
          @click="toggle(false)"
        >
          Hủy
        </v-btn>
        <v-btn
          class="text-none white--text"
          color="#47BBFF"
          dark
          depressed
          width="90"
          @click="addProdAttrs"
        >
          Lưu
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      required: true,
    },
    defaultProdAttrList: {
      type: Array,
      required: true,
    },
    prevSelectedItems: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      keyword: '',
      prodAttrs: [],
      selectedItems: [],
    }
  },
  computed: {
    prodAttrHeaders() {
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
      ]
    },
    filterredProdAttrs() {
      return this.prodAttrs.filter((e) =>
        e.name.toLowerCase().includes(this.keyword.toLowerCase())
      )
    },
  },
  watch: {
    value(newValue, oldValue) {
      if (newValue) {
        this.selectedItems = [...this.prevSelectedItems]
        this.getProductAttrList()
        this.$log.debug(
          '[Prev Selected Product Attributes]:',
          this.prevSelectedItems
        )
      }
    },
  },

  methods: {
    // Hàm đóng mở dialog
    toggle(value) {
      this.$emit('input', value)
    },

    // Hàm gọi API lấy danh sách thuộc tính
    getProductAttrList() {
      this.$wait.start('loadingAttr')
      this.$store
        .dispatch('productAttrs/getProductAttrList', {
          keyword: this.keyword,
          type: 1,
        })
        .then((response) => {
          if (!response.error) {
            this.$log.debug('[getProductAttrList]', response.data)
            this.prodAttrs = response.data.data
            for (
              let index = 0;
              index < this.defaultProdAttrList.length;
              index++
            ) {
              const defaultProdAttr = this.defaultProdAttrList[index]
              const idx = this.prodAttrs.findIndex(
                (e) => e.id === defaultProdAttr.id
              )
              if (idx !== -1) {
                this.prodAttrs.splice(idx, 1)
              }
            }
          }
        })
        .catch((e) => {})
        .finally(() => {
          this.$wait.end('loadingAttr')
        })
    },

    // Hàm emit event thêm mới thuộc tính kèm theo list thuộc tính đã chọn
    addProdAttrs() {
      const items = this.prevSelectedItems.reduce((acc, cur, idx) => {
        const existing = this.selectedItems.findIndex((e) => e.id === cur.id)
        if (existing > -1) {
          acc.push(cur)
          this.selectedItems.splice(existing, 1)
        }
        return acc
      }, [])
      items.push(...this.selectedItems)
      this.$emit('add-prod-attr', items)
      this.toggle(false)
    },
  },
}
</script>

<style lang="scss">
.add-prod-attr-dialog {
  max-width: 50% !important;
  height: 100%;
  max-height: 100% !important;
  animation-duration: 0.2s;
}
</style>
