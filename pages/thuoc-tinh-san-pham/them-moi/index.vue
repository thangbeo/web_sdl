<template>
  <!-- Check phân quyền -->
  <div v-if="checkRole()">
    <v-form @submit.prevent="validate">
      <v-row class="px-6">
        <v-tabs v-model="currentLangTab" class="transparent-tabs">
          <v-tab
            v-for="(language, langIdx) in attributeLangList"
            :key="`${language.id}-${language.name}`"
            :class="currentLangTab !== langIdx && 'black--text'"
            class="font-weight-bold fs-17 text-none letter-spacing-normal"
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
              v-for="(language, langIdx) in attributeLangList"
              :key="`${language.id}-${language.name}`"
            >
              <v-row>
                <!-- Textfield Tên thuộc tính sản phẩm -->
                <v-col cols="12" class="py-0">
                  <p class="fs-14 pt-4">
                    {{
                      $vuetify.lang.t(
                        '$vuetify.productAttrs.addPage.fields.attrName'
                      )
                    }}
                    <span class="error--text ml-1">*</span>
                  </p>
                  <v-text-field
                    v-model="language.attrName"
                    :error-messages="language.attrNameErrors"
                    :placeholder="
                      $vuetify.lang.t(
                        '$vuetify.productAttrs.addPage.fields.attrName'
                      )
                    "
                    class="border-1 fs-14"
                    solo
                    flat
                    dense
                    @input="language.attrNameErrors = []"
                  >
                  </v-text-field>
                </v-col>

                <!-- Switch field Hiển thị ở Frontend, hiển thị ở portal NCC và Bắt buộc -->
                <v-col cols="12" class="pb-0">
                  <v-row>
                    <v-col cols="auto" class="py-0">
                      <div class="fs-14">
                        {{
                          $vuetify.lang.t(
                            '$vuetify.productAttrs.addPage.fields.required'
                          )
                        }}
                        <span class="error--text ml-1">*</span>
                      </div>
                      <div class="fs-14 mt-6">
                        {{
                          $vuetify.lang.t(
                            '$vuetify.productAttrs.addPage.fields.showOnFE'
                          )
                        }}
                        <span class="error--text ml-1">*</span>
                      </div>
                      <div class="fs-16 mt-6">
                        {{
                          $vuetify.lang.t(
                            '$vuetify.productAttrs.addPage.fields.showOnProviderPortal'
                          )
                        }}
                        <span class="error--text ml-1">*</span>
                      </div>
                    </v-col>
                    <v-col class="py-0" cols="auto">
                      <v-switch
                        v-model="isRequired"
                        color="#47bbff"
                        :true-value="1"
                        :false-value="2"
                        inset
                        class="ma-0 pa-0"
                      />
                      <v-switch
                        v-model="showOnFrontend"
                        color="#47bbff"
                        :true-value="1"
                        :false-value="2"
                        inset
                        class="ma-0 pa-0 mt-1"
                      />
                      <v-switch
                        v-model="showOnProviderPortal"
                        color="#47bbff"
                        :true-value="1"
                        :false-value="2"
                        inset
                        class="ma-0 pa-0 mt-1"
                        hide-details=""
                      />
                    </v-col>
                  </v-row>
                </v-col>

                <!-- Select field Loại thuộc tính -->
                <v-col cols="12" class="py-0 pt-1">
                  <p class="fs-14 pt-4">
                    {{
                      $vuetify.lang.t(
                        '$vuetify.productAttrs.addPage.fields.attrType'
                      )
                    }}
                    <span class="error--text ml-1">*</span>
                  </p>
                  <v-autocomplete
                    v-model="attrType"
                    :items="attrTypes"
                    :error-messages="attrTypeErrors"
                    :placeholder="
                      $vuetify.lang.t(
                        '$vuetify.productAttrs.addPage.fields.attrType'
                      )
                    "
                    class="border-1 fs-14"
                    solo
                    flat
                    dense
                    item-text="name"
                    item-value="id"
                    return-object
                    @input="attrTypeErrors = []"
                  >
                  </v-autocomplete>
                </v-col>

                <!-- List view options cho Loại thuộc tính type selections -->
                <v-col v-if="showOptionsField" cols="12" class="pt-1">
                  <p class="fs-14">
                    {{
                      $vuetify.lang.t(
                        '$vuetify.productAttrs.addPage.fields.options'
                      )
                    }}
                    <span class="error--text ml-1">*</span>
                  </p>
                  <v-list
                    class="py-0 rounded overflow-x-hidden"
                    elevation="4"
                    max-height="calc(100vh - 610px)"
                    :class="
                      language.attrOptionsErrors
                        ? 'error-list-attr-options'
                        : ''
                    "
                  >
                    <template
                      v-for="(
                        attrOption, attrOptionIdx
                      ) in language.attrOptions"
                    >
                      <v-list-item
                        :key="`${attrOption}-${attrOptionIdx}`"
                        class="white ma-0"
                      >
                        <v-list-item-content>
                          <v-list-item-title class="d-flex align-center">
                            <div>{{ attrOption }}</div>
                            <v-spacer></v-spacer>
                            <v-btn
                              color="black"
                              icon
                              small
                              @click="
                                openDeleteAttrOptions(
                                  language.attrOptions,
                                  attrOptionIdx
                                )
                              "
                            >
                              <!-- language.attrOptions.splice(attrOptionIdx, 1) -->
                              <v-icon>mdi-close-circle</v-icon>
                            </v-btn>
                          </v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                      <v-divider
                        :key="`${attrOption}-divider-${attrOptionIdx}`"
                      ></v-divider>
                    </template>
                    <v-list-item
                      class="white ma-0 sticky-bottom"
                      :link="!isTextField"
                      style="
                        margin: 0 !important;
                        border-top: thin solid #0000001f !important;
                      "
                      @click.native="isTextField = true"
                    >
                      <v-list-item-content>
                        <v-list-item-title
                          v-if="!isTextField"
                          class="primary--text"
                        >
                          Thêm lựa chọn
                        </v-list-item-title>
                        <v-form
                          v-else
                          @submit.prevent="addAttrOptions(langIdx)"
                        >
                          <v-text-field
                            v-model="language.attrOptionName"
                            autofocus
                            :placeholder="
                              $vuetify.lang.t(
                                '$vuetify.productAttrs.addPage.fields.optionName'
                              )
                            "
                            class="border-1 fs-14"
                            solo
                            flat
                            dense
                            hide-details
                            @blur="isTextField = false"
                            @input="language.attrOptionsErrors = ''"
                          >
                            <template v-slot:append>
                              <div>
                                <v-btn type="submit" color="#47BBFF" icon>
                                  <v-icon>mdi-check</v-icon>
                                </v-btn>
                                <v-btn
                                  color="black"
                                  icon
                                  type="submit"
                                  @click.native="language.attrOptionName = ''"
                                >
                                  <v-icon>mdi-close</v-icon>
                                </v-btn>
                              </div>
                            </template>
                          </v-text-field>
                        </v-form>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                  <v-slide-y-transition>
                    <small
                      v-if="language.attrOptionsErrors"
                      class="error--text fs-12"
                    >
                      {{ language.attrOptionsErrors }}
                    </small>
                  </v-slide-y-transition>
                </v-col>
              </v-row>
            </v-tab-item>
          </v-tabs-items>
        </v-col>

        <!-- Button Hủy và Lưu -->
        <v-footer app inset>
          <v-row>
            <v-spacer></v-spacer>
            <v-btn
              class="text-none white--text mr-3"
              color="error"
              depressed
              width="90"
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
            >
              Lưu
            </v-btn>
          </v-row>
        </v-footer>

        <yes-no-alert
          :open="confirmNavigationIsOpened"
          alert-msg="Bạn chắc chắn muốn thoát không?"
          @toggle="confirmNavigationIsOpened = !confirmNavigationIsOpened"
          @OK="navigationConfirmed"
        />

        <yes-no-alert
          :open="confirmDeleteAttrOptionsIsOpened"
          :alert-msg="deleteAttrOptionsMsg"
          @toggle="
            confirmDeleteAttrOptionsIsOpened = !confirmDeleteAttrOptionsIsOpened
          "
          @OK="deleteAttrOption"
        />
      </v-row>
    </v-form>
  </div>
</template>

<script>
import Rules from '~/assets/configurations/Rules'
export default {
  data() {
    return {
      attributeLangList: [],
      attrName: '',
      attrNameErrors: [],
      isRequired: 1,
      showOnFrontend: 1,
      showOnProviderPortal: 1,
      attrType: null,
      attrTypes: [],
      attrTypeErrors: [],
      confirmNavigationIsOpened: false,
      attrOptions: [],
      attrOptionsErrors: '',
      isTextField: false,
      attrOptionName: '',
      currentLangTab: 0,
      confirmDeleteAttrOptionsIsOpened: false,
      deleteAttrOption: null,
      deleteAttrOptionsMsg: 'Bạn chắc chắn muốn xóa lựa chọn không?',
    }
  },
  computed: {
    showOptionsField() {
      return (
        this.attrType?.optionType ===
        this.$store.state.productAttrs.fieldTypes.selections
      )
    },
  },
  watch: {
    '$store.state.app.change_back'(value) {
      this.confirmNavigationIsOpened = true
    },
    // '$store.state.app.languages'(value) {
    //   this.generateTabs()
    // },
  },
  created() {
    if (!this.$isServer) {
      this.$store.commit('app/checkBack', true)
    }
    this.generateTabs()
    this.getProductAttrTypes()
  },
  methods: {
    // Hàm mở dialog xác nhận xóa option
    openDeleteAttrOptions(listOption, index) {
      this.confirmDeleteAttrOptionsIsOpened = true
      this.deleteAttrOption = () => {
        listOption.splice(index, 1)
      }

      this.deleteAttrOptionsMsg = `Bạn chắc chắn muốn xóa lựa chọn "${listOption[index]}" không?`
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
          attrName: '',
          attrNameErrors: [],
          attrOptions: [],
          attrOptionsErrors: '',
          attrOptionName: '',
        })
      }
    },

    // Hàm check phân quyền
    checkRole() {
      const roles = this.$isAccessAction(
        this.$store.state.app.roles,
        Rules.System.ProductAttrs.id
      )
      return roles
    },

    // Hàm điều hướng khi đã xác nhận
    navigationConfirmed() {
      this.$router.push('/thuoc-tinh-san-pham')
    },

    // Hàm lấy danh sách loại thuộc tính
    getProductAttrTypes() {
      this.$store
        .dispatch('productAttrs/getProductAttrTypes')
        .then((response) => {
          if (!response.error) {
            this.attrTypes = response.data.data
          }
        })
    },

    // Hàm thêm các lựa chọn
    addAttrOptions(langIdx) {
      if (
        this.attributeLangList[langIdx].attrOptionName?.trim() &&
        !this.attributeLangList[langIdx].attrOptions.includes(
          this.attributeLangList[langIdx].attrOptionName?.trim()
        )
      ) {
        this.attributeLangList[langIdx].attrOptions.push(
          this.attributeLangList[langIdx].attrOptionName?.trim()
        )
      }
      this.attributeLangList[langIdx].attrOptionName = ''
      this.isTextField = false
    },

    // Hàm validate dữ liệu form
    validate() {
      let hasErrors = false
      let invalidTab = null
      const optionsLengths = []
      for (let index = 0; index < this.attributeLangList.length; index++) {
        const language = this.attributeLangList[index]
        if (!language.attrName?.trim()) {
          hasErrors = true
          language.attrNameErrors = ['Không được để trống']
        } else if (language.attrName.trim().length > 200) {
          hasErrors = true
          language.attrNameErrors = ['Không được vượt quá 200 ký tự.']
        }

        if (this.showOptionsField) {
          if (!language.attrOptions.length) {
            hasErrors = true
            language.attrOptionsErrors = 'Không được để trống'
          } else {
            optionsLengths.push(language.attrOptions.length)
          }
        }

        if (hasErrors && invalidTab === null) {
          invalidTab = index
        }
      }

      if (optionsLengths.length) {
        const matchedLength =
          optionsLengths.filter((e) => e === optionsLengths[0]).length ===
          optionsLengths.length
        if (!matchedLength) {
          const lowest = optionsLengths.reduce((acc, cur, idx) => {
            return cur < optionsLengths[0] ? idx : acc
          }, 0)
          hasErrors = true
          invalidTab = lowest
          this.attributeLangList[lowest].attrOptionsErrors =
            'Vui lòng nhập đủ các lựa chọn như ngôn ngữ khác'
        }
      }

      if (!this.attrType || !Object.keys(this.attrType).length) {
        hasErrors = true
        this.attrTypeErrors = ['Không được để trống']
      }

      if (!hasErrors) {
        this.saveProductAttr()
      } else {
        this.currentLangTab = invalidTab
      }
    },

    // Hàm lưu thuộc tính sản phẩm
    saveProductAttr() {
      const attributeLangList = this.attributeLangList.reduce(
        (acc, cur, idx) => {
          acc.push({
            langId: cur.id,
            name: cur.attrName,
          })
          return acc
        },
        []
      )
      const options = this.attributeLangList.reduce((acc, cur, idx) => {
        for (let index = 0; index < cur.attrOptions.length; index++) {
          const option = cur.attrOptions[index]
          acc.push({
            langId: cur.id,
            option,
          })
        }
        return acc
      }, [])
      const data = {
        attributeLangList,
        attributeTypeId: this.attrType.id,
        required: this.isRequired,
        frontendDisplay: this.showOnFrontend,
        portalDisplay: this.showOnProviderPortal,
        options: this.showOptionsField ? options : null,
      }

      this.$store
        .dispatch('productAttrs/saveProductAttr', data)
        .then((response) => {
          if (!response.error) {
            this.$showSuccess(this, 'Thêm mới thuộc tính thành công')
            this.$router.push('/thuoc-tinh-san-pham')
          }
        })
    },
  },
  head() {
    this.$store.commit(
      'app/setTitle',
      this.$vuetify.lang.t('$vuetify.productAttrs.addPage.title')
    )
    return {
      title: this.$vuetify.lang.t('$vuetify.productAttrs.addPage.title'),
    }
  },
}
</script>

<style lang="scss">
.error-list-attr-options {
  border: red 1px solid !important;
}

.transparent-tabs {
  .v-tabs-bar {
    background: transparent !important;
  }
}
</style>
