<template>
  <!-- Check phân quyền -->
  <div v-if="checkRole() && hydrated" :class="embed && 'mt-12'">
    <v-form @submit.prevent>
      <v-row class="px-6">
        <v-col v-if="embed" cols="12">
          <div
            class="text-body-1 fs-24 d-flex align-center font-weight-bold primary--text"
          >
            {{ $vuetify.lang.t('$vuetify.productAttrs.detailPage.title') }}:
            {{ prodAttr.name }}
          </div>
        </v-col>
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
              v-for="language in attributeLangList"
              :key="`${language.id}-${language.name}`"
            >
              <v-row>
                <!-- Textfield Tên thuộc tính sản phẩm -->
                <v-col cols="12" class="py-0">
                  <p class="fs-16 pt-4">
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
                    readonly
                    @input="language.attrNameErrors = []"
                  >
                  </v-text-field>
                </v-col>

                <!-- Switch field Hiển thị ở Frontend, hiển thị ở portal NCC và Bắt buộc -->
                <v-col cols="12" class="pb-0">
                  <v-row>
                    <v-col cols="auto" class="py-0">
                      <div class="fs-16">
                        {{
                          $vuetify.lang.t(
                            '$vuetify.productAttrs.addPage.fields.required'
                          )
                        }}
                        <span class="error--text ml-1">*</span>
                      </div>
                      <div class="fs-16 mt-6">
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
                        readonly
                        color="#47bbff"
                        :true-value="1"
                        :false-value="2"
                        inset
                        class="ma-0 pa-0"
                      />
                      <v-switch
                        v-model="showOnFrontend"
                        readonly
                        color="#47bbff"
                        :true-value="1"
                        :false-value="2"
                        inset
                        class="ma-0 pa-0 mt-1"
                      />
                      <v-switch
                        v-model="showOnProviderPortal"
                        readonly
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
                  <p class="fs-16 pt-4">
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
                    readonly
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
                  <p class="fs-16">
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
                          </v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                      <v-divider
                        :key="`${attrOption}-divider-${attrOptionIdx}`"
                      ></v-divider>
                    </template>
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
              color="#656565"
              depressed
              width="90"
              @click="!embed ? $router.go(-1) : $emit('close')"
            >
              Quay lại
            </v-btn>
          </v-row>
        </v-footer>
      </v-row>
    </v-form>
  </div>
  <v-row v-else class="align-center justify-center" :class="embed && 'mt-12'">
    <v-col cols="12" align="center">
      <v-progress-circular
        :indeterminate="!$isServer"
        :value="100"
        size="120"
        color="primary"
      >
        Xin chờ...
      </v-progress-circular>
    </v-col>
  </v-row>
</template>

<script>
import Rules from '~/assets/configurations/Rules'
export default {
  props: {
    embed: {
      type: Boolean,
      default: false,
    },
    prodAttr: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      attributeLangList: [],
      isRequired: 1,
      showOnFrontend: 1,
      showOnProviderPortal: 1,
      attrType: null,
      attrTypes: [],
      attrTypeErrors: [],
      confirmNavigationIsOpened: false,
      isTextField: false,
      currentLangTab: 0,
      rawData: {},
      hydrated: false,
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
      if (!this.embed) {
        this.$router.go(-1)
      }
    },
  },
  created() {
    if (!this.$isServer && !this.embed) {
      this.$store.commit('app/checkBack', true)
    }
    this.getProductAttrTypes()
  },
  methods: {
    // Hàm generate tab đa ngôn ngữ
    generateTabs() {
      if (!this.attributeLangList.length) {
        const attributeLangList = []
        for (
          let index = 0;
          index < this.$store.state.app.languages.length;
          index++
        ) {
          const language = this.$store.state.app.languages[index]
          attributeLangList.push({
            ...language,
            attrName: '',
            attrNameErrors: [],
            attrOptions: [],
            attrOptionsErrors: '',
            attrOptionName: '',
          })
        }

        this.attributeLangList = attributeLangList
      }
      this.getProdAttrInfo()
    },

    // Hàm check phân quyền
    checkRole() {
      const roles = this.$isAccessAction(
        this.$store.state.app.roles,
        Rules.System.ProductAttrs.id
      )
      if (this.embed) {
        return this.$isAccessAction(
          this.$store.state.app.roles,
          Rules.System.Supplier.id
        )
      }

      return roles
    },

    // Hàm lấy danh sách loại thuộc tính
    getProductAttrTypes() {
      this.$store
        .dispatch('productAttrs/getProductAttrTypes')
        .then((response) => {
          if (!response.error) {
            this.attrTypes = response.data.data
            this.generateTabs()
          }
        })
    },

    // Hàm lấy thông tin chi tiết của thuộc tính
    getProdAttrInfo() {
      this.$store
        .dispatch('productAttrs/getProdAttrInfo', {
          attributeId: !this.embed ? this.$route.params.id : this.prodAttr.id,
        })
        .then((response) => {
          this.rawData = {
            ...response.data.data,
          }
          this.changeCurrentData()
        })
    },

    // Hàm đổ thông tin raw từ API vào state
    changeCurrentData() {
      if (Object.keys(this.rawData).length) {
        this.isRequired = this.rawData.attribute.required
        this.showOnFrontend = this.rawData.attribute.frontendDisplay
        this.showOnProviderPortal = this.rawData.attribute.portalDisplay
        this.attrType = this.attrTypes.filter(
          (e) => e.id === this.rawData.attribute.attributeTypeId
        )[0]
        this.attributeLangList = this.attributeLangList.reduce(
          (acc, cur, idx) => {
            for (
              let index = 0;
              index < this.rawData.attributeLangList.length;
              index++
            ) {
              const language = this.rawData.attributeLangList[index]
              if (language.langId === cur.id) {
                cur.attrName = language.name
              }
            }

            for (
              let index = 0;
              index < this.rawData.attributeOptionList.length;
              index++
            ) {
              const language = this.rawData.attributeOptionList[index]
              if (language.langId === cur.id) {
                cur.attrOptions.push(language.option)
              }
            }

            acc.push(cur)
            return acc
          },
          []
        )
        this.hydrated = true
      }
    },
  },
  head() {
    if (!this.embed) {
      this.$store.commit(
        'app/setTitle',
        this.$vuetify.lang.t('$vuetify.productAttrs.detailPage.title')
      )
      return {
        title: this.$vuetify.lang.t('$vuetify.productAttrs.detailPage.title'),
      }
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
