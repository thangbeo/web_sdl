<template>
  <div v-if="checkRole()">
    <v-form @submit.prevent="validate">
      <v-row class="px-6">
        <v-tabs v-model="currentLangTab" class="transparent-tabs">
          <v-tab
            v-for="(language, langIdx) in attributeLangList"
            :key="`${language.id}-${language.name}`"
            :class="currentLangTab !== langIdx && 'black--text'"
            class="font-weight-bold fs-17 text-none letter-spacing-normal"
            active-class="primary--text"
          >
            {{ language.name }}
          </v-tab>
        </v-tabs>
        <v-col cols="12" class="pa-0">
          <v-tabs-items
            v-model="currentLangTab"
            :continuous="false"
            class="transparent overflow-visible"
          >
            <v-tab-item
              v-for="language in attributeLangList"
              :key="`${language.id}-${language.name}`"
            >
              <v-row>
                <!-- Textfield Tên bộ thuộc tính sản phẩm -->
                <v-col cols="12" class="py-0">
                  <p class="fs-16 pt-4">
                    {{
                      $vuetify.lang.t(
                        '$vuetify.productAttrSet.addPage.fields.attrSetName'
                      )
                    }}
                    <span class="error--text ml-1">*</span>
                  </p>
                  <v-text-field
                    v-model="language.attrSetName"
                    :error-messages="language.attrSetNameErrors"
                    :placeholder="
                      $vuetify.lang.t(
                        '$vuetify.productAttrSet.addPage.fields.attrSetName'
                      )
                    "
                    class="border-1 fs-14"
                    solo
                    flat
                    dense
                    @input="language.attrSetNameErrors = []"
                  >
                  </v-text-field>
                </v-col>

                <!-- Textarea mô tả bộ thuộc tính sản phẩm -->
                <v-col cols="12" class="py-0">
                  <p class="fs-16">
                    {{
                      $vuetify.lang.t(
                        '$vuetify.productAttrSet.addPage.fields.attrSetDes'
                      )
                    }}
                  </p>
                  <v-textarea
                    v-model="language.attrSetDes"
                    :error-messages="language.attrSetDesErrors"
                    :placeholder="
                      $vuetify.lang.t(
                        '$vuetify.productAttrSet.addPage.fields.attrSetDes'
                      )
                    "
                    class="border-1 fs-14"
                    solo
                    flat
                    dense
                    :rows="2"
                    @input="language.attrSetDesErrors = []"
                  >
                  </v-textarea>
                </v-col>

                <!-- Bảng dữ liệu thuộc tính mặc định -->
                <v-col cols="12" class="py-0">
                  <p class="fs-16">
                    {{
                      $vuetify.lang.t(
                        '$vuetify.productAttrSet.addPage.fields.defaultAttrs'
                      )
                    }}
                  </p>
                  <v-data-table
                    :headers="prodAttrHeaders"
                    :items="defaultProdAttrList"
                    :items-per-page="defaultProdAttrList.length"
                    :header-props="{ sortIcon: 'mdi-menu-swap' }"
                    item-key="id"
                    fixed-header
                    hide-default-footer
                    loading-text="Xin chờ..."
                    no-results-text="Không có kết quả phù hợp"
                    :no-data-text="`Không có dữ liệu`"
                    class="elevation-0 default-table"
                  >
                  </v-data-table>
                </v-col>

                <!-- Bảng dữ liệu thuộc tính tùy chọn -->
                <v-col cols="12" class="py-0 pt-6">
                  <p class="fs-16">
                    {{
                      $vuetify.lang.t(
                        '$vuetify.productAttrSet.addPage.fields.customAttrs'
                      )
                    }}
                    <span class="error--text ml-1">*</span>
                  </p>
                  <v-col cols="12" class="px-0 pt-0">
                    <v-row>
                      <v-col class="py-0">
                        <!-- Textfield tìm kiếm -->
                        <v-form @submit.prevent>
                          <v-text-field
                            v-model="keyword"
                            placeholder="Tìm kiếm tên thuộc tính"
                            prepend-inner-icon="mdi-magnify"
                            class="border-1"
                            solo
                            flat
                            dense
                            hide-details
                          >
                          </v-text-field>
                        </v-form>
                      </v-col>
                      <v-col cols="auto" class="py-0">
                        <v-btn
                          color="#47BBFF"
                          class="text-none white--text"
                          depressed
                          @click="openAddNewProductAttr"
                        >
                          <v-icon>mdi-plus</v-icon>
                          Thêm mới
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-data-table
                    :headers="customAttrsGridHeaders"
                    :items="filteredCustomAttrs"
                    :items-per-page="filteredCustomAttrs.length"
                    :header-props="{ sortIcon: 'mdi-menu-swap' }"
                    item-key="id"
                    fixed-header
                    hide-default-footer
                    loading-text="Xin chờ..."
                    no-results-text="Không có kết quả phù hợp"
                    :no-data-text="`Chưa chọn thuộc tính`"
                    class="elevation-0 custom-attr-table"
                    :class="customAttrsErrors && 'error-table'"
                  >
                    <template v-slot:body>
                      <draggable
                        v-model="filteredCustomAttrs"
                        tag="tbody"
                        ghost-class="dragging-item"
                        handle=".drag-handler"
                      >
                        <template v-if="filteredCustomAttrs.length">
                          <tr
                            v-for="(
                              prodAttr, prodAttrIdx
                            ) in filteredCustomAttrs"
                            :key="`attr-${prodAttr.name}-${prodAttrIdx}`"
                          >
                            <td>{{ prodAttr.id }}</td>
                            <td>{{ prodAttr.name }}</td>
                            <td>{{ prodAttr.attribute_type }}</td>
                            <td class="text-center">
                              <v-btn small icon class="drag-handler">
                                <v-icon> mdi-arrow-all </v-icon>
                              </v-btn>
                            </td>
                            <td class="text-center">
                              <v-btn
                                small
                                icon
                                @click="
                                  openConfirmRemoveProdAttrDialog(prodAttrIdx)
                                "
                              >
                                <v-icon>mdi-close-circle</v-icon>
                              </v-btn>
                            </td>
                          </tr>
                        </template>
                        <tr
                          v-else
                          key="no-data-row"
                          @click="openAddNewProductAttr"
                        >
                          <td colspan="5" class="text-center">
                            <v-btn
                              block
                              class="text-none letter-spacing-normal"
                              text
                            >
                              <v-icon>mdi-plus</v-icon> Thêm thuộc tính
                            </v-btn>
                          </td>
                        </tr>
                      </draggable>
                    </template>
                  </v-data-table>
                  <v-slide-y-transition>
                    <small v-if="customAttrsErrors" class="error--text fs-12">
                      {{ customAttrsErrors }}
                    </small>
                  </v-slide-y-transition>
                </v-col>
              </v-row>
            </v-tab-item>
          </v-tabs-items>
        </v-col>

        <!-- Button Hủy và Lưu -->
        <v-footer app inset class="py-0">
          <v-row>
            <v-spacer></v-spacer>
            <v-col cols="auto" class="d-flex">
              <v-btn
                class="text-none white--text mr-3"
                color="error"
                depressed
                width="90"
                :disable="$wait.is('addingAttrSet')"
                @click="confirmNavigationIsOpened = true"
              >
                Hủy
              </v-btn>
              <v-btn
                class="text-none white--text"
                color="#47BBFF"
                dark
                depressed
                width="90"
                type="submit"
                :loading="$wait.is('addingAttrSet')"
              >
                Lưu
              </v-btn>
            </v-col>
          </v-row>
        </v-footer>
      </v-row>
    </v-form>

    <!-- Dialog thêm mới thuộc tính tùy chọn -->
    <AddNewProdAttrDialog
      v-model="addNewProdAttrDialogIsOpened"
      :default-prod-attr-list="defaultProdAttrList"
      :prev-selected-items="customAttrs"
      @add-prod-attr="
        customAttrs = $event
        customAttrsErrors = ''
      "
    />
    <!-- Dialog xác nhận chuyển trang -->
    <yes-no-alert
      :open="confirmNavigationIsOpened"
      alert-msg="Bạn chắc chắn muốn thoát không?"
      @toggle="confirmNavigationIsOpened = !confirmNavigationIsOpened"
      @OK="navigationConfirmed"
    />

    <!-- Dialog xác nhận bỏ thuộc tính sản phẩm -->
    <yes-no-alert
      :open="confirmRemoveProdAttrDialogIsOpened"
      :alert-msg="`Bạn chắc chắn muốn xoá bỏ thuộc tính ${
        customAttrs[selectedItem] && customAttrs[selectedItem].name
      } không?`"
      @toggle="
        confirmRemoveProdAttrDialogIsOpened = !confirmRemoveProdAttrDialogIsOpened
      "
      @OK="removeProdAttr"
    />
  </div>
</template>

<script>
import Draggable from 'vuedraggable'
import Rules from '~/assets/configurations/Rules'
import AddNewProdAttrDialog from '~/components/product-attr-set/them-moi/AddNewProdAttrDialog.vue'
export default {
  components: {
    Draggable,
    AddNewProdAttrDialog,
  },
  data() {
    return {
      attributeLangList: [],
      currentLangTab: 0,
      customAttrs: [],
      customAttrsErrors: '',
      keyword: null,
      confirmNavigationIsOpened: false,
      addNewProdAttrDialogIsOpened: false,
      defaultProdAttrList: [],
      confirmRemoveProdAttrDialogIsOpened: false,
      selectedItem: null,
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
    customAttrsGridHeaders() {
      return [
        {
          text: this.$vuetify.lang.t(
            '$vuetify.productAttrs.dataTable.headers.id'
          ),
          value: 'id',
          width: 100,
          sortable: false,
        },
        {
          text: this.$vuetify.lang.t(
            '$vuetify.productAttrs.dataTable.headers.attrName'
          ),
          value: 'name',
          sortable: false,
        },
        {
          text: this.$vuetify.lang.t(
            '$vuetify.productAttrs.dataTable.headers.attrType'
          ),
          value: 'attribute_type',
          sortable: false,
        },
        {
          text: this.$vuetify.lang.t(
            '$vuetify.productAttrs.dataTable.headers.sort'
          ),
          value: 'dragdrop',
          width: 100,
          align: 'center',
          sortable: false,
        },
        {
          text: this.$vuetify.lang.t(
            '$vuetify.productAttrs.dataTable.headers.actions'
          ),
          width: 100,
          value: 'actions',
          align: 'center',
          sortable: false,
        },
      ]
    },
    filteredCustomAttrs: {
      get() {
        return this.customAttrs.filter((e) =>
          this.keyword && this.keyword.trim()
            ? e.name.includes(this.keyword.trim())
            : true
        )
      },
      set(value) {
        this.customAttrs = value
      },
    },
  },
  watch: {
    '$store.state.app.change_back'(value) {
      this.confirmNavigationIsOpened = true
    },
    currentLangTab(value) {
      this.keyword = ''
    },
  },
  created() {
    if (!this.$isServer) {
      this.$store.commit('app/checkBack', true)
    }
    this.generateTabs()
    this.getDefaultProdAttrList()
  },
  methods: {
    // Hàm check phân quyền
    checkRole() {
      const roles = this.$isAccessAction(
        this.$store.state.app.roles,
        Rules.System.ProductAttrsSet.id
      )
      return roles
    },

    // Hàm generate tab đa ngôn ngữ
    generateTabs() {
      for (
        let index = 0;
        index < this.$store.state.app.languages.length;
        index++
      ) {
        const language = this.$store.state.app.languages[index]
        this.attributeLangList.push({
          ...language,
          attrSetName: '',
          attrSetNameErrors: [],
          attrSetDes: '',
          attrSetDesErrors: [],
        })
      }
    },

    // Hàm validate dữ liệu
    validate() {
      let hasErrors = false
      let invalidTab = null
      for (let index = 0; index < this.attributeLangList.length; index++) {
        const language = this.attributeLangList[index]
        if (!language.attrSetName || !language.attrSetName.trim()) {
          hasErrors = true
          language.attrSetNameErrors = ['Không được để trống']
          if (invalidTab === null) {
            invalidTab = index
          }
        }
      }

      if (!this.customAttrs.length) {
        hasErrors = true
        this.customAttrsErrors = 'Không được để trống'
      }

      if (!hasErrors) {
        this.addProdAttrSet()
      } else {
        this.currentLangTab = invalidTab
      }
    },

    // Hàm mở dialog thêm thuộc tích tùy chọn
    openAddNewProductAttr() {
      this.addNewProdAttrDialogIsOpened = true
    },

    // Hàm điều hướng khi đã xác nhận
    navigationConfirmed() {
      this.$router.push('/bo-thuoc-tinh-san-pham')
    },

    // Hàm lấy danh sách thuộc tính mặc định
    getDefaultProdAttrList() {
      this.$store
        .dispatch('productAttrs/getDefaultProdAttr')
        .then((response) => {
          if (!response.error) {
            this.$log.debug('[getDefaultProductAttrList]', response.data)
            this.defaultProdAttrList = response.data.data
          }
        })
    },

    // Hàm lưu thông tin bộ thuộc tính mới
    addProdAttrSet() {
      this.$wait.start('addingAttrSet')
      const attributeSetLangList = this.attributeLangList.reduce(
        (acc, cur, idx) => {
          acc.push({
            langId: cur.id,
            name: cur.attrSetName,
            subIntroduce: cur.attrSetDes,
          })
          return acc
        },
        []
      )

      const defaultAttrs = this.defaultProdAttrList.reduce((acc, cur, idx) => {
        acc.push({
          attributeId: cur.id,
          numberIndex: idx,
          type: cur.attributeTypeId,
        })
        return acc
      }, [])

      const attributes = this.customAttrs.reduce(
        (acc, cur, idx) => {
          acc.push({
            attributeId: cur.id,
            numberIndex: idx + defaultAttrs.length,
            type: cur.attributeTypeId,
          })
          return acc
        },
        [...defaultAttrs]
      )
      const data = {
        attributeSet: {
          productCategoryId: 4,
          ofSystem: 2,
        },
        attributeSetLangList,
        attributes,
      }

      this.$store
        .dispatch('productAttrSet/saveProductAttrSet', data)
        .then((response) => {
          if (!response.error) {
            this.$showSuccess(
              this,
              'Thêm mới bộ thuộc tính sản phẩm thành công'
            )
            this.$router.push('/bo-thuoc-tinh-san-pham')
          }
        })
        .finally(() => {
          this.$wait.end('addingAttrSet')
        })
    },

    // Hàm mở dialog xác nhận bỏ prod attr khỏi thuộc tính tùy chọn
    openConfirmRemoveProdAttrDialog(prodAttrIdx) {
      this.confirmRemoveProdAttrDialogIsOpened = true
      this.selectedItem = prodAttrIdx
    },

    // Hàm remove prod attr khỏi thuộc tính tùy chọn
    removeProdAttr() {
      // const idx = this.customAttrs.findIndex(
      //   (e) => e.id === this.selectedItem.id
      // )
      // if (idx > -1) {
      this.customAttrs.splice(this.selectedItem, 1)
      this.$showSuccess(this, 'Đã bỏ thuộc tính sản phẩm thành công')
      // }
    },
  },
  head() {
    this.$store.commit(
      'app/setTitle',
      this.$vuetify.lang.t('$vuetify.productAttrSet.addPage.title')
    )
    return {
      title: this.$vuetify.lang.t('$vuetify.productAttrSet.addPage.title'),
    }
  },
}
</script>

<style lang="scss">
.transparent-tabs {
  .v-tabs-bar {
    background: transparent !important;
  }
}

.drag-handler {
  transition: transform 0.5s;
}

.dragging-item {
  background: rgb(177, 177, 177);
}

.default-table,
.custom-attr-table {
  .v-data-table__wrapper {
    // max-height: calc(100vh - 780px);
  }
}

.error-table {
  border: 1px solid red !important;
}
</style>
