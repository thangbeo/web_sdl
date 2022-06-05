<template>
  <div class="add-tourism-prod pt-16">
    <v-row v-if="hydrated">
      <div class="d-flex w-100" style="right: 0; position: fixed; z-index: 2">
        <div class="flex-grow-1"></div>
        <v-btn
          v-if="!uncorrected"
          class="text-none white--text mr-3"
          color="#4873C2"
          dark
          depressed
          width="120px"
          @click="confirmResetDialogisOpened = true"
        >
          <img class="mr-1" src="~/assets/icon/change.png" />
          Đặt lại
        </v-btn>
        <v-btn
          class="text-none white--text mr-3"
          color="#4873C2"
          dark
          depressed
          width="120px"
        >
          <img class="mr-1" src="~/assets/icon/view.svg" />
          Xem trước
          <template v-slot:loader>
            <span><span>Xin chờ...</span></span>
          </template>
        </v-btn>
      </div>

      <v-col cols="12">
        <p class="fs-14 font-weight-bold d-flex align-center">
          SKU
          <span class="error--text ml-1"> * </span>

          <!-- Switch -->
          <span class="d-inline-block ml-6">
            <v-chip small outlined>{{ data.sku }}</v-chip>
          </span>
        </p>
      </v-col>
      <!-- System fields -->
      <v-col
        v-for="(sysField, sysFieldIdx) in systemFields"
        :key="`field-${sysField.name}-${sysFieldIdx}`"
        cols="12"
        :class="sysField.id === 17 && 'order-last'"
      >
        <p
          class="fs-14 font-weight-bold"
          :class="
            sysField.attributeTypeId ===
              $store.state.productAttrs.attrTypes.switch &&
            'd-flex align-center'
          "
        >
          {{ sysField.name }}
          <span v-if="sysField.required === 1" class="error--text ml-1">
            *
          </span>

          <!-- Switch -->
          <span class="d-inline-block ml-6">
            <v-switch
              v-if="
                sysField.attributeTypeId ===
                $store.state.productAttrs.attrTypes.switch
              "
              v-model="sysField.value"
              class="ma-0"
              color="#47bbff"
              :readonly="uncorrected"
              :true-value="1"
              :false-value="0"
              inset
              hide-details
            />
          </span>
        </p>

        <template v-if="sysField.id === 6">
          <v-autocomplete
            v-model="sysField.value"
            :items="enterpriseList"
            item-text="enterprise_name"
            item-value="id"
            :error-messages="sysField.errors"
            :placeholder="sysField.name"
            class="border-1 fs-14"
            solo
            flat
            dense
            readonly
            @input="sysField.errors = []"
          >
          </v-autocomplete>
        </template>

        <template v-else-if="sysField.id === 9">
          <v-autocomplete
            v-model="sysField.value"
            :items="productCategoryList"
            :readonly="uncorrected"
            item-text="name"
            item-value="id"
            :error-messages="sysField.errors"
            :placeholder="sysField.name"
            class="border-1 fs-14"
            solo
            flat
            dense
            multiple
            @input="sysField.errors = []"
          >
          </v-autocomplete>
        </template>

        <template v-else-if="sysField.id === 11">
          <v-text-field
            v-model="price"
            :readonly="uncorrected"
            :error-messages="priceErrors"
            :placeholder="sysField.name"
            class="border-1 fs-14"
            solo
            flat
            dense
            @input="priceErrors = []"
          >
          </v-text-field>
        </template>

        <!-- Đoạn văn bản ngắn -->
        <template
          v-else-if="
            sysField.attributeTypeId ===
            $store.state.productAttrs.attrTypes.textField
          "
        >
          <v-tabs v-model="sysField.tab" class="transparent-tabs">
            <template v-for="(tab, tabIdx) in sysField.attributeLangList">
              <v-tab
                :key="`${sysField.name}-${sysFieldIdx}-tab-${tabIdx}`"
                :class="sysField.tab !== tabIdx && 'black--text'"
                active-class="primary--text"
                class="text-none font-weight-medium letter-spacing-normal fs-14"
                >{{ tab.name }}</v-tab
              >

              <v-tab-item
                :key="`${sysField.name}-${sysFieldIdx}-tab-item-${tabIdx}`"
              >
                <v-text-field
                  v-model="tab.value"
                  :readonly="uncorrected"
                  :error-messages="tab.errors"
                  :placeholder="sysField.name"
                  class="border-1 fs-14"
                  solo
                  flat
                  dense
                  @input="tab.errors = []"
                ></v-text-field>
              </v-tab-item>
            </template>
          </v-tabs>
        </template>

        <!-- Đoạn văn bản dài -->
        <template
          v-else-if="
            sysField.attributeTypeId ===
            $store.state.productAttrs.attrTypes.textArea
          "
        >
          <v-tabs v-model="sysField.tab" class="transparent-tabs">
            <template v-for="(tab, tabIdx) in sysField.attributeLangList">
              <v-tab
                :key="`${sysField.name}-${sysFieldIdx}-tab-${tabIdx}`"
                :class="sysField.tab !== tabIdx && 'black--text'"
                active-class="primary--text"
                class="text-none font-weight-medium letter-spacing-normal fs-14"
                >{{ tab.name }}</v-tab
              >

              <v-tab-item
                :key="`${sysField.name}-${sysFieldIdx}-tab-item-${tabIdx}`"
              >
                <vue-2-editor
                  id="vue-2-editor-fix-height-1"
                  :data="tab.value"
                  :disabled="uncorrected"
                  @text-change="set_value_editor($event, tab)"
                />
                <div
                  v-if="tab.errors && tab.errors.length"
                  class="v-messages theme--light error--text mt-1"
                  role="alert"
                >
                  <div class="v-messages__wrapper">
                    <div class="v-messages__message">Không được để trống</div>
                  </div>
                </div>
              </v-tab-item>
            </template>
          </v-tabs>
        </template>

        <!-- Datepicker -->
        <template
          v-else-if="
            sysField.attributeTypeId ===
            $store.state.productAttrs.attrTypes.date
          "
        >
          <v-tabs v-model="sysField.tab" class="transparent-tabs">
            <template v-for="(tab, tabIdx) in sysField.attributeLangList">
              <v-tab
                :key="`${sysField.name}-${sysFieldIdx}-tab-${tabIdx}`"
                :class="sysField.tab !== tabIdx && 'black--text'"
                active-class="primary--text"
                class="text-none font-weight-medium letter-spacing-normal fs-14"
                >{{ tab.name }}</v-tab
              >

              <v-tab-item
                :key="`${tab.name}-${sysFieldIdx}-tab-item-${tabIdx}`"
              >
                <v-dialog
                  ref="dialog"
                  v-model="tab.modelIsOpened"
                  persistent
                  width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      :value="
                        $formatDate(
                          tab.value,
                          'YYYY-MM-DD',
                          'ddd DD/MM/YYYY',
                          true
                        )
                      "
                      :error-messages="tab.errors"
                      :placeholder="sysField.name"
                      class="border-1 fs-14"
                      solo
                      flat
                      dense
                      readonly
                      @input="tab.errors = []"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="tab.value" scrollable>
                    <v-spacer></v-spacer>
                    <v-btn
                      text
                      color="primary"
                      class="font-weight-bold"
                      @click="tab.modelIsOpened = false"
                    >
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-dialog>
              </v-tab-item>
            </template>
          </v-tabs>
        </template>

        <!-- Datetime -->
        <template
          v-else-if="
            sysField.attributeTypeId ===
            $store.state.productAttrs.attrTypes.dateTime
          "
        >
          <v-tabs v-model="sysField.tab" class="transparent-tabs">
            <template v-for="(tab, tabIdx) in sysField.attributeLangList">
              <v-tab
                :key="`${sysField.name}-${sysFieldIdx}-tab-${tabIdx}`"
                :class="sysField.tab !== tabIdx && 'black--text'"
                active-class="primary--text"
                class="text-none font-weight-medium letter-spacing-normal fs-14"
                >{{ tab.name }}</v-tab
              >

              <v-tab-item
                :key="`${sysField.name}-${sysFieldIdx}-tab-item-${tabIdx}`"
              >
                <v-dialog
                  ref="dialog"
                  v-model="tab.modelIsOpened"
                  persistent
                  width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-row no-gutters>
                      <v-col cols="1">
                        <v-select
                          v-model="tab.hour"
                          :readonly="uncorrected"
                          :items="hours"
                          :error-messages="tab.hourErrors"
                          placeholder="Giờ"
                          class="border-1 fs-14"
                          solo
                          flat
                          dense
                          @input="tab.hourErrors = []"
                        ></v-select>
                      </v-col>
                      <v-col cols="1">
                        <v-select
                          v-model="tab.minute"
                          :readonly="uncorrected"
                          :items="minutes"
                          :error-messages="tab.minuteErrors"
                          placeholder="Phút"
                          class="border-1 fs-14"
                          solo
                          flat
                          dense
                          @input="tab.minuteErrors = []"
                        ></v-select>
                      </v-col>
                      <v-col cols="10">
                        <v-text-field
                          :value="
                            $formatDate(
                              tab.value,
                              'YYYY-MM-DD',
                              'ddd DD/MM/YYYY',
                              true
                            )
                          "
                          :error-messages="tab.errors"
                          placeholder="Ngày"
                          class="border-1 fs-14 rounded-r"
                          solo
                          flat
                          dense
                          readonly
                          @input="tab.errors = []"
                          v-on="on"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </template>
                  <v-date-picker v-model="tab.value" scrollable>
                    <v-spacer></v-spacer>
                    <v-btn
                      text
                      color="primary"
                      class="font-weight-bold"
                      @click="tab.modelIsOpened = false"
                    >
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-dialog>
              </v-tab-item>
            </template>
          </v-tabs>
        </template>

        <!-- Select -->
        <template
          v-else-if="
            sysField.attributeTypeId ===
            $store.state.productAttrs.attrTypes.select
          "
        >
          <v-tabs v-model="sysField.tab" class="transparent-tabs">
            <template v-for="(tab, tabIdx) in sysField.attributeLangList">
              <v-tab
                :key="`${sysField.name}-${sysFieldIdx}-tab-${tabIdx}`"
                :class="sysField.tab !== tabIdx && 'black--text'"
                active-class="primary--text"
                class="text-none font-weight-medium letter-spacing-normal fs-14"
                >{{ tab.name }}</v-tab
              >

              <v-tab-item
                :key="`${sysField.name}-${sysFieldIdx}-tab-item-${tabIdx}`"
              >
                <v-select
                  v-model="tab.value"
                  :items="tab.optionValues"
                  :readonly="uncorrected"
                  item-text="option"
                  item-value="id"
                  :error-messages="tab.errors"
                  :placeholder="sysField.name"
                  class="border-1 fs-14"
                  solo
                  flat
                  dense
                  @input="tab.errors = []"
                >
                </v-select>
              </v-tab-item>
            </template>
          </v-tabs>
        </template>

        <!-- Multi Select -->
        <template
          v-else-if="
            sysField.attributeTypeId ===
            $store.state.productAttrs.attrTypes.multiSelect
          "
        >
          <v-tabs v-model="sysField.tab" class="transparent-tabs">
            <template v-for="(tab, tabIdx) in sysField.attributeLangList">
              <v-tab
                :key="`${sysField.name}-${sysFieldIdx}-tab-${tabIdx}`"
                :class="sysField.tab !== tabIdx && 'black--text'"
                active-class="primary--text"
                class="text-none font-weight-medium letter-spacing-normal fs-14"
                >{{ tab.name }}</v-tab
              >

              <v-tab-item
                :key="`${sysField.name}-${sysFieldIdx}-tab-item-${tabIdx}`"
              >
                <v-select
                  v-model="tab.value"
                  :items="tab.optionValues"
                  :readonly="uncorrected"
                  item-text="option"
                  item-value="id"
                  :error-messages="tab.errors"
                  :placeholder="sysField.name"
                  class="border-1 fs-14"
                  solo
                  flat
                  dense
                  multiple
                  @input="tab.errors = []"
                >
                </v-select>
              </v-tab-item>
            </template>
          </v-tabs>
        </template>

        <!-- Radio -->
        <template
          v-else-if="
            sysField.attributeTypeId ===
            $store.state.productAttrs.attrTypes.radio
          "
        >
          <v-tabs v-model="sysField.tab" class="transparent-tabs">
            <template v-for="(tab, tabIdx) in sysField.attributeLangList">
              <v-tab
                :key="`${sysField.name}-${sysFieldIdx}-tab-${tabIdx}`"
                :class="sysField.tab !== tabIdx && 'black--text'"
                active-class="primary--text"
                class="text-none font-weight-medium letter-spacing-normal fs-14"
                >{{ tab.name }}</v-tab
              >

              <v-tab-item
                :key="`${sysField.name}-${sysFieldIdx}-tab-item-${tabIdx}`"
              >
                <v-radio-group
                  v-model="tab.value"
                  :error-messages="tab.errors"
                  row
                >
                  <v-radio
                    v-for="(option, optionIdx) in tab.optionValues"
                    :key="`${sysField.name}-${option.id}-${option.option}-${optionIdx}`"
                    :label="option.option"
                    :value="option.id"
                    :readonly="uncorrected"
                  ></v-radio>
                </v-radio-group>
              </v-tab-item>
            </template>
          </v-tabs>
        </template>

        <!-- Checkbox -->
        <template
          v-else-if="
            sysField.attributeTypeId ===
            $store.state.productAttrs.attrTypes.checkbox
          "
        >
          <v-tabs v-model="sysField.tab" class="transparent-tabs">
            <template v-for="(tab, tabIdx) in sysField.attributeLangList">
              <v-tab
                :key="`${sysField.name}-${sysFieldIdx}-tab-${tabIdx}`"
                :class="sysField.tab !== tabIdx && 'black--text'"
                active-class="primary--text"
                class="text-none font-weight-medium letter-spacing-normal fs-14"
                >{{ tab.name }}</v-tab
              >

              <v-tab-item
                :key="`${sysField.name}-${sysFieldIdx}-tab-item-${tabIdx}`"
              >
                <v-radio-group
                  :value="tab.value"
                  :error-messages="tab.errors"
                  multiple
                  row
                >
                  <v-radio
                    v-for="(option, optionIdx) in tab.optionValues"
                    :key="`${sysField.name}-${option.id}-${option.option}-${optionIdx}`"
                    :label="option.option"
                    :value="option.id"
                    :readonly="uncorrected"
                    off-icon="$checkboxOff"
                    on-icon="$checkboxOn"
                    @click="toggleMultipleRadio(option.id, tab.value)"
                  ></v-radio>
                </v-radio-group>
              </v-tab-item>
            </template>
          </v-tabs>
        </template>

        <!-- Price -->
        <template
          v-else-if="
            sysField.attributeTypeId ===
            $store.state.productAttrs.attrTypes.price
          "
        >
          <v-tabs v-model="sysField.tab" class="transparent-tabs">
            <template v-for="(tab, tabIdx) in sysField.attributeLangList">
              <v-tab
                :key="`${sysField.name}-${sysFieldIdx}-tab-${tabIdx}`"
                :class="sysField.tab !== tabIdx && 'black--text'"
                active-class="primary--text"
                class="text-none font-weight-medium letter-spacing-normal fs-14"
                >{{ tab.name }}</v-tab
              >

              <v-tab-item
                :key="`${sysField.name}-${sysFieldIdx}-tab-item-${tabIdx}`"
              >
                <v-text-field
                  v-model="tab.value"
                  :readonly="uncorrected"
                  :error-messages="tab.errors"
                  :placeholder="sysField.name"
                  class="border-1 fs-14"
                  solo
                  flat
                  dense
                  type="number"
                  @input="tab.errors = []"
                ></v-text-field>
              </v-tab-item>
            </template>
          </v-tabs>
        </template>

        <!-- Number -->
        <template
          v-else-if="
            sysField.attributeTypeId ===
            $store.state.productAttrs.attrTypes.number
          "
        >
          <v-tabs v-model="sysField.tab" class="transparent-tabs">
            <template v-for="(tab, tabIdx) in sysField.attributeLangList">
              <v-tab
                :key="`${sysField.name}-${sysFieldIdx}-tab-${tabIdx}`"
                :class="sysField.tab !== tabIdx && 'black--text'"
                active-class="primary--text"
                class="text-none font-weight-medium letter-spacing-normal fs-14"
                >{{ tab.name }}</v-tab
              >

              <v-tab-item
                :key="`${sysField.name}-${sysFieldIdx}-tab-item-${tabIdx}`"
              >
                <v-text-field
                  v-model="tab.value"
                  :error-messages="tab.errors"
                  :placeholder="sysField.name"
                  :readonly="uncorrected"
                  class="border-1 fs-14"
                  solo
                  flat
                  dense
                  type="number"
                  @input="tab.errors = []"
                ></v-text-field>
              </v-tab-item>
            </template>
          </v-tabs>
        </template>

        <!-- Image -->
        <Files
          v-else-if="
            sysField.attributeTypeId ===
            $store.state.productAttrs.attrTypes.image
          "
          :id="`${sysField.name}-file-image-${sysFieldIdx}`"
          :ref="`${sysField.name}-file-image-${sysFieldIdx}`"
          :maxrequied="31"
          :init-value="sysField.value"
          :errormsg="sysField.errors"
          :fixed="!uncorrected"
          @set_file="selectImage($event, sysField, sysFieldIdx)"
        />

        <!-- Video -->
        <FilesVideo
          v-else-if="
            sysField.attributeTypeId ===
            $store.state.productAttrs.attrTypes.video
          "
          :id="`${sysField.name}-file-video-${sysFieldIdx}`"
          :ref="`${sysField.name}-file-video-${sysFieldIdx}`"
          :required="sysField.errors && sysField.errors.length ? true : false"
          :init-value="sysField.value"
          :fixed="!uncorrected"
          @set_file="selectVideo($event, sysField, sysFieldIdx)"
        />

        <!-- GG Map -->
        <template v-if="sysField.id === 3">
          <div>
            <LeafletMap :lat-lng="[lat, lng]" @set_latlng="set_latlng" />
          </div>
        </template>

        <!-- Bản đồ -->
        <template v-if="sysField.id === 15">
          <v-row class="mt-2 ml-4">
            <v-col
              v-for="(service, i) in map_services"
              :key="`${i}-${service.id}`"
              cols="auto"
            >
              <v-checkbox
                v-model="selectedServices"
                class="ma-0 mr-12"
                :readonly="uncorrected"
                :label="service.name"
                hide-details
                :ripple="false"
                :value="service.id"
                :disabled="
                  !systemFields.filter((e) => e.id === sysField.id)[0].value
                "
              >
              </v-checkbox>
            </v-col>
          </v-row>
        </template>

        <!-- Có thể bạn quan tâm -->
        <template v-if="sysField.id === 17">
          <v-fade-transition>
            <v-row>
              <suggestions
                ref="suggestions_hotel"
                class="mt-3"
                style="flex: 0 0 100%; max-width: 100%"
                :id-info="data.productId"
                :product-type="4"
                :readonly="uncorrected"
                @set_data="set_suggestions"
              />

              <v-col cols="12" class="ml-2">
                <div
                  class="v-messages theme--light error--text mt-1"
                  role="alert"
                >
                  <div class="v-messages__wrapper">
                    <div class="v-messages__message">
                      {{ suggestions_msg }}
                    </div>
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-fade-transition>
        </template>
      </v-col>

      <!-- Custom Attribute -->
      <v-col
        v-for="(customField, customFieldIdx) in customFields"
        :key="`field-${customField.name}-${customFieldIdx}`"
        cols="12"
      >
        <p
          class="fs-14 font-weight-bold"
          :class="
            customField.attributeTypeId ===
              $store.state.productAttrs.attrTypes.switch &&
            'd-flex align-center'
          "
        >
          {{ customField.name }}
          <span v-if="customField.required === 1" class="error--text ml-1">
            *
          </span>

          <!-- Switch -->
          <span class="d-inline-block ml-6">
            <v-switch
              v-if="
                customField.attributeTypeId ===
                $store.state.productAttrs.attrTypes.switch
              "
              v-model="customField.value"
              class="ma-0"
              color="#47bbff"
              :true-value="1"
              :false-value="0"
              :readonly="uncorrected"
              inset
              hide-details
            />
          </span>
        </p>

        <!-- Đoạn văn bản ngắn -->
        <template
          v-if="
            customField.attributeTypeId ===
            $store.state.productAttrs.attrTypes.textField
          "
        >
          <v-tabs v-model="customField.tab" class="transparent-tabs">
            <template v-for="(tab, tabIdx) in customField.attributeLangList">
              <v-tab
                :key="`${customField.name}-${customFieldIdx}-tab-${tabIdx}`"
                :class="customField.tab !== tabIdx && 'black--text'"
                active-class="primary--text"
                class="text-none font-weight-medium letter-spacing-normal fs-14"
                >{{ tab.name }}</v-tab
              >

              <v-tab-item
                :key="`${customField.name}-${customFieldIdx}-tab-item-${tabIdx}`"
              >
                <v-text-field
                  v-model="tab.value"
                  :error-messages="tab.errors"
                  :placeholder="customField.name"
                  :readonly="uncorrected"
                  class="border-1 fs-14"
                  solo
                  flat
                  dense
                  @input="tab.errors = []"
                ></v-text-field>
              </v-tab-item>
            </template>
          </v-tabs>
        </template>

        <!-- Đoạn văn bản dài -->
        <template
          v-if="
            customField.attributeTypeId ===
            $store.state.productAttrs.attrTypes.textArea
          "
        >
          <v-tabs v-model="customField.tab" class="transparent-tabs">
            <template v-for="(tab, tabIdx) in customField.attributeLangList">
              <v-tab
                :key="`${customField.name}-${customFieldIdx}-tab-${tabIdx}`"
                :class="customField.tab !== tabIdx && 'black--text'"
                active-class="primary--text"
                class="text-none font-weight-medium letter-spacing-normal fs-14"
                >{{ tab.name }}</v-tab
              >

              <v-tab-item
                :key="`${customField.name}-${customFieldIdx}-tab-item-${tabIdx}`"
              >
                <vue-2-editor
                  id="vue-2-editor-fix-height-1"
                  :data="tab.value"
                  use-custom-image-handler
                  :disabled="uncorrected"
                  @text-change="set_value_editor($event, tab)"
                />
                <div
                  v-if="tab.errors && tab.errors.length"
                  class="v-messages theme--light error--text mt-1"
                  role="alert"
                >
                  <div class="v-messages__wrapper">
                    <div class="v-messages__message">Không được để trống</div>
                  </div>
                </div>
              </v-tab-item>
            </template>
          </v-tabs>
        </template>

        <!-- Datepicker -->
        <template
          v-if="
            customField.attributeTypeId ===
            $store.state.productAttrs.attrTypes.date
          "
        >
          <v-tabs v-model="customField.tab" class="transparent-tabs">
            <template v-for="(tab, tabIdx) in customField.attributeLangList">
              <v-tab
                :key="`${customField.name}-${customFieldIdx}-tab-${tabIdx}`"
                :class="customField.tab !== tabIdx && 'black--text'"
                active-class="primary--text"
                class="text-none font-weight-medium letter-spacing-normal fs-14"
                >{{ tab.name }}</v-tab
              >

              <v-tab-item
                :key="`${tab.name}-${customFieldIdx}-tab-item-${tabIdx}`"
              >
                <v-dialog
                  ref="dialog"
                  v-model="tab.modelIsOpened"
                  persistent
                  width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      :value="
                        $formatDate(
                          tab.value,
                          'YYYY-MM-DD',
                          'ddd DD/MM/YYYY',
                          true
                        )
                      "
                      :error-messages="tab.errors"
                      :placeholder="customField.name"
                      class="border-1 fs-14"
                      solo
                      flat
                      dense
                      readonly
                      @input="tab.errors = []"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="tab.value" scrollable>
                    <v-spacer></v-spacer>
                    <v-btn
                      text
                      color="primary"
                      class="font-weight-bold"
                      @click="tab.modelIsOpened = false"
                    >
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-dialog>
              </v-tab-item>
            </template>
          </v-tabs>
        </template>

        <!-- Datetime -->
        <template
          v-if="
            customField.attributeTypeId ===
            $store.state.productAttrs.attrTypes.dateTime
          "
        >
          <v-tabs v-model="customField.tab" class="transparent-tabs">
            <template v-for="(tab, tabIdx) in customField.attributeLangList">
              <v-tab
                :key="`${customField.name}-${customFieldIdx}-tab-${tabIdx}`"
                :class="customField.tab !== tabIdx && 'black--text'"
                active-class="primary--text"
                class="text-none font-weight-medium letter-spacing-normal fs-14"
                >{{ tab.name }}</v-tab
              >

              <v-tab-item
                :key="`${customField.name}-${customFieldIdx}-tab-item-${tabIdx}`"
              >
                <v-dialog
                  ref="dialog"
                  v-model="tab.modelIsOpened"
                  persistent
                  width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-row no-gutters>
                      <v-col cols="1">
                        <v-select
                          v-model="tab.hour"
                          :items="hours"
                          :error-messages="tab.hourErrors"
                          :readonly="uncorrected"
                          placeholder="Giờ"
                          class="border-1 fs-14"
                          solo
                          flat
                          dense
                          @input="tab.hourErrors = []"
                        ></v-select>
                      </v-col>
                      <v-col cols="1">
                        <v-select
                          v-model="tab.minute"
                          :items="minutes"
                          :error-messages="tab.minuteErrors"
                          :readonly="uncorrected"
                          placeholder="Phút"
                          class="border-1 fs-14"
                          solo
                          flat
                          dense
                          @input="tab.minuteErrors = []"
                        ></v-select>
                      </v-col>
                      <v-col cols="10">
                        <v-text-field
                          :value="
                            $formatDate(
                              tab.value,
                              'YYYY-MM-DD',
                              'ddd DD/MM/YYYY',
                              true
                            )
                          "
                          :error-messages="tab.errors"
                          placeholder="Ngày"
                          class="border-1 fs-14 rounded-r"
                          solo
                          flat
                          dense
                          readonly
                          @input="tab.errors = []"
                          v-on="on"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </template>
                  <v-date-picker v-model="tab.value" scrollable>
                    <v-spacer></v-spacer>
                    <v-btn
                      text
                      color="primary"
                      class="font-weight-bold"
                      @click="tab.modelIsOpened = false"
                    >
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-dialog>
              </v-tab-item>
            </template>
          </v-tabs>
        </template>

        <!-- Select -->
        <template
          v-if="
            customField.attributeTypeId ===
            $store.state.productAttrs.attrTypes.select
          "
        >
          <v-tabs v-model="customField.tab" class="transparent-tabs">
            <template v-for="(tab, tabIdx) in customField.attributeLangList">
              <v-tab
                :key="`${customField.name}-${customFieldIdx}-tab-${tabIdx}`"
                :class="customField.tab !== tabIdx && 'black--text'"
                active-class="primary--text"
                class="text-none font-weight-medium letter-spacing-normal fs-14"
                >{{ tab.name }}</v-tab
              >

              <v-tab-item
                :key="`${customField.name}-${customFieldIdx}-tab-item-${tabIdx}`"
              >
                <v-select
                  v-model="tab.value"
                  :items="tab.optionValues"
                  :readonly="uncorrected"
                  item-text="option"
                  item-value="option"
                  :error-messages="tab.errors"
                  :placeholder="customField.name"
                  class="border-1 fs-14"
                  solo
                  flat
                  dense
                  @input="tab.errors = []"
                >
                </v-select>
              </v-tab-item>
            </template>
          </v-tabs>
        </template>

        <!-- Multi Select -->
        <template
          v-if="
            customField.attributeTypeId ===
            $store.state.productAttrs.attrTypes.multiSelect
          "
        >
          <v-tabs v-model="customField.tab" class="transparent-tabs">
            <template v-for="(tab, tabIdx) in customField.attributeLangList">
              <v-tab
                :key="`${customField.name}-${customFieldIdx}-tab-${tabIdx}`"
                :class="customField.tab !== tabIdx && 'black--text'"
                active-class="primary--text"
                class="text-none font-weight-medium letter-spacing-normal fs-14"
                >{{ tab.name }}</v-tab
              >

              <v-tab-item
                :key="`${customField.name}-${customFieldIdx}-tab-item-${tabIdx}`"
              >
                <v-select
                  v-model="tab.value"
                  :items="tab.optionValues"
                  :readonly="uncorrected"
                  item-text="option"
                  item-value="option"
                  :error-messages="tab.errors"
                  :placeholder="customField.name"
                  class="border-1 fs-14"
                  solo
                  flat
                  dense
                  multiple
                  @input="tab.errors = []"
                >
                </v-select>
              </v-tab-item>
            </template>
          </v-tabs>
        </template>

        <!-- Radio -->
        <template
          v-if="
            customField.attributeTypeId ===
            $store.state.productAttrs.attrTypes.radio
          "
        >
          <v-tabs v-model="customField.tab" class="transparent-tabs">
            <template v-for="(tab, tabIdx) in customField.attributeLangList">
              <v-tab
                :key="`${customField.name}-${customFieldIdx}-tab-${tabIdx}`"
                :class="customField.tab !== tabIdx && 'black--text'"
                active-class="primary--text"
                class="text-none font-weight-medium letter-spacing-normal fs-14"
                >{{ tab.name }}</v-tab
              >

              <v-tab-item
                :key="`${customField.name}-${customFieldIdx}-tab-item-${tabIdx}`"
              >
                <v-radio-group
                  v-model="tab.value"
                  :error-messages="tab.errors"
                  row
                >
                  <v-radio
                    v-for="(option, optionIdx) in tab.optionValues"
                    :key="`${customField.name}-${option.id}-${option.option}-${optionIdx}`"
                    :label="option.option"
                    :value="option.option"
                    :readonly="uncorrected"
                  ></v-radio>
                </v-radio-group>
              </v-tab-item>
            </template>
          </v-tabs>
        </template>

        <!-- Checkbox -->
        <template
          v-if="
            customField.attributeTypeId ===
            $store.state.productAttrs.attrTypes.checkbox
          "
        >
          <v-tabs v-model="customField.tab" class="transparent-tabs">
            <template v-for="(tab, tabIdx) in customField.attributeLangList">
              <v-tab
                :key="`${customField.name}-${customFieldIdx}-tab-${tabIdx}`"
                :class="customField.tab !== tabIdx && 'black--text'"
                active-class="primary--text"
                class="text-none font-weight-medium letter-spacing-normal fs-14"
                >{{ tab.name }}</v-tab
              >

              <v-tab-item
                :key="`${customField.name}-${customFieldIdx}-tab-item-${tabIdx}`"
              >
                <v-radio-group
                  :value="tab.value"
                  :error-messages="tab.errors"
                  multiple
                  row
                >
                  <v-radio
                    v-for="(option, optionIdx) in tab.optionValues"
                    :key="`${customField.name}-${option.id}-${option.option}-${optionIdx}`"
                    :label="option.option"
                    :value="option.option"
                    :readonly="uncorrected"
                    off-icon="$checkboxOff"
                    on-icon="$checkboxOn"
                    @click="toggleMultipleRadio(option.id, tab.value)"
                  ></v-radio>
                </v-radio-group>
              </v-tab-item>
            </template>
          </v-tabs>
        </template>

        <!-- Price -->
        <template
          v-if="
            customField.attributeTypeId ===
            $store.state.productAttrs.attrTypes.price
          "
        >
          <v-tabs v-model="customField.tab" class="transparent-tabs">
            <template v-for="(tab, tabIdx) in customField.attributeLangList">
              <v-tab
                :key="`${customField.name}-${customFieldIdx}-tab-${tabIdx}`"
                :class="customField.tab !== tabIdx && 'black--text'"
                active-class="primary--text"
                class="text-none font-weight-medium letter-spacing-normal fs-14"
                >{{ tab.name }}</v-tab
              >

              <v-tab-item
                :key="`${customField.name}-${customFieldIdx}-tab-item-${tabIdx}`"
              >
                <v-text-field
                  v-model="tab.value"
                  :error-messages="tab.errors"
                  :placeholder="customField.name"
                  :readonly="uncorrected"
                  class="border-1 fs-14"
                  solo
                  flat
                  dense
                  type="number"
                  @input="tab.errors = []"
                ></v-text-field>
              </v-tab-item>
            </template>
          </v-tabs>
        </template>

        <!-- Number -->
        <template
          v-if="
            customField.attributeTypeId ===
            $store.state.productAttrs.attrTypes.number
          "
        >
          <v-tabs v-model="customField.tab" class="transparent-tabs">
            <template v-for="(tab, tabIdx) in customField.attributeLangList">
              <v-tab
                :key="`${customField.name}-${customFieldIdx}-tab-${tabIdx}`"
                :class="customField.tab !== tabIdx && 'black--text'"
                active-class="primary--text"
                class="text-none font-weight-medium letter-spacing-normal fs-14"
                >{{ tab.name }}</v-tab
              >

              <v-tab-item
                :key="`${customField.name}-${customFieldIdx}-tab-item-${tabIdx}`"
              >
                <v-text-field
                  v-model="tab.value"
                  :error-messages="tab.errors"
                  :placeholder="customField.name"
                  :readonly="uncorrected"
                  class="border-1 fs-14"
                  solo
                  flat
                  dense
                  type="number"
                  @input="tab.errors = []"
                ></v-text-field>
              </v-tab-item>
            </template>
          </v-tabs>
        </template>

        <!-- Image -->
        <Files
          v-if="
            customField.attributeTypeId ===
            $store.state.productAttrs.attrTypes.image
          "
          :id="`${customField.name}-file-image-${customFieldIdx}`"
          :ref="`${customField.name}-file-image-${customFieldIdx}`"
          :maxrequied="1"
          :init-value="customField.value"
          :errormsg="customField.errors"
          :fixed="!uncorrected"
          @set_file="selectImage($event, customField, customFieldIdx)"
        />

        <!-- Video -->
        <FilesVideo
          v-if="
            customField.attributeTypeId ===
            $store.state.productAttrs.attrTypes.video
          "
          :id="`${customField.name}-file-video-${customFieldIdx}`"
          :ref="`${customField.name}-file-video-${customFieldIdx}`"
          :init-value="customField.value"
          :required="
            customField.errors && customField.errors.length ? true : false
          "
          :fixed="!uncorrected"
          @set_file="selectVideo($event, customField, customFieldIdx)"
        />
      </v-col>
      <v-footer inset app>
        <v-row>
          <v-spacer></v-spacer>
          <v-btn
            v-if="!uncorrected"
            class="text-none white--text mr-3"
            color="error"
            depressed
            width="90"
            :disabled="$wait.is('savingData')"
            @click="confirmNavigationIsOpened = true"
          >
            Hủy
          </v-btn>
          <v-btn
            v-if="!uncorrected"
            class="text-none white--text"
            color="#47BBFF"
            dark
            depressed
            width="90"
            :loading="$wait.is('savingData')"
            @click="validate"
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
        :open="confirmResetDialogisOpened"
        alert-msg="Bạn chắc chắn muốn đặt lại không?"
        @toggle="confirmResetDialogisOpened = !confirmResetDialogisOpened"
        @OK="resetData"
      />
    </v-row>
    <v-row v-else class="align-center justify-center">
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
  </div>
</template>

<script>
// import { gmapApi } from 'vue2-google-maps'
import Files from '~/components/Selected/Files.vue'
import FilesVideo from '~/components/Selected/FileVideo.vue'
import Suggestions from '~/components/product-nha-cung-cap/edit/hotel/suggestions/index.vue'
export default {
  components: {
    Files,
    FilesVideo,
    Suggestions,
  },
  props: {
    prodAttrSet: {
      type: Number,
      required: true,
    },
    data: {
      type: Object,
      required: true,
    },
  },

  data() {
    const hours = []
    for (let index = 0; index < 24; index++) {
      hours.push(index < 10 ? `0${index}` : `${index}`)
    }

    const minutes = []
    for (let index = 0; index < 60; index++) {
      minutes.push(index < 10 ? `0${index}` : `${index}`)
    }
    return {
      systemFields: [],
      customFields: [],
      attributeLangList: [],
      hours,
      minutes,
      hydrated: false,
      confirmNavigationIsOpened: false,
      confirmResetDialogisOpened: false,
      enterpriseList: [],
      productCategoryList: [],
      lat: 21.028511,
      lng: 105.804817,
      address: '',
      map_services: [],
      selectedServices: [],
      listsuggestions: [],
      suggestions_msg: '',
      price: 0,
      priceErrors: [],
      uncorrected: false,
    }
  },
  // computed: {
  //   google: gmapApi,
  // },
  watch: {
    price(value) {
      setTimeout(() => {
        const endDot = /\.$/
        if (endDot.test(this.price)) {
          this.price = `${this.$formatNumber(this.price, '0,0')}.`
        } else {
          this.price = this.$formatNumber(this.price, '0,0[.][0000000000000]')
        }
      }, 0)
    },
    // '$store.state.app.change_back'(value) {
    //   this.confirmNavigationIsOpened = true
    // },
  },
  async mounted() {
    // status = 1 sản phẩm do nhà cung cấp tạo
    if (this.data.ofStatus === 1) {
      this.uncorrected = true
    }
    this.$log.debug('[Props prodAttrSet]', this.prodAttrSet)
    await this.getEnterpriseList()
    await this.getProductCategoryList()
    await this.getLocationAround()
    this.generateTabs()
    this.lat = this.data.lat
    this.lng = this.data.lon
    this.center = this.markerLatLng = [this.lat, this.lng]
  },
  methods: {
    set_value_editor(value, item) {
      item.value = value
      item.errors = []
    },
    set_suggestions(items) {
      // this.$log.debug(items)
      this.listsuggestions = items
      this.suggestions_msg = ''
    },
    set_latlng(obj) {
      this.lat = obj.lat
      this.lng = obj.lng
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
        })
      }

      this.getProdAttrSetFields()
    },

    getProdAttrSetFields() {
      this.hydrated = false
      this.$store
        .dispatch('tourismProduct/getProdAttrSetFields', {
          attributeSetId: this.prodAttrSet,
        })
        .then((response) => {
          if (!response.error) {
            this.hydrateData(response.data.data)
          }
        })
    },

    hydrateData(rawApiData) {
      const attrTypes = { ...this.$store.state.productAttrs.attrTypes }
      this.systemFields = rawApiData.sysAttribute.reduce((acc, cur, idx) => {
        const data = this.data.attributes.filter(
          (e) =>
            e.attributeTypeId === cur.attributeTypeId &&
            cur.id === e.attributeId
        )
        if (cur.attributeTypeId === attrTypes.switch) {
          cur.value = Number(data.length ? data[0].values[0].value[0] : 1)
        } else if (cur.attributeTypeId === attrTypes.video) {
          cur.value = data.length ? data[0].values[0].value[0] : null
        } else if (cur.attributeTypeId === attrTypes.image) {
          cur.value = data.length ? data[0].values[0].value : null
        } else {
          // Là field doanh nghiệp
          // eslint-disable-next-line no-lonely-if
          if (cur.id === 6) {
            cur.value = data.length ? Number(data[0].values[0].value[0]) : null
          } else if (cur.id === 9) {
            cur.value = data.length
              ? data[0].values[0].value.reduce((dataAcc, curData, dataIdx) => {
                  dataAcc.push(Number(curData))
                  return dataAcc
                }, [])
              : []
          } else if (cur.id === 11) {
            this.price = this.$formatNumber(
              data.length ? data[0].values[0].value[0] : 0,
              '0,0[.][0000000000000]'
            )
          } else {
            const attributeLangList = []
            for (
              let index = 0;
              index < this.attributeLangList.length;
              index++
            ) {
              const lang = this.attributeLangList[index]
              const attributeLang = {
                ...lang,
                errors: [],
              }
              if (
                cur.attributeTypeId === attrTypes.textField ||
                cur.attributeTypeId === attrTypes.textArea
              ) {
                attributeLang.value = data.length
                  ? data[0].values.filter((e) => e.langId === lang.id)[0]
                      .value[0]
                  : null
              } else if (cur.attributeTypeId === attrTypes.date) {
                attributeLang.value = data.length
                  ? this.$formatDate(
                      data[0].values.filter((e) => e.langId === lang.id)[0]
                        .value[0],
                      'DD/MM/YYYY',
                      'YYYY-MM-DD',
                      true
                    )
                  : null
              } else if (cur.attributeTypeId === attrTypes.dateTime) {
                const tempDate = data.length
                  ? data[0].values.filter((e) => e.langId === lang.id)[0]
                      .value[0]
                  : null
                attributeLang.hour = tempDate
                  ? this.$formatDate(
                      tempDate,
                      'DD/MM/YYYY HH:mm:ss',
                      'HH',
                      true
                    )
                  : null
                attributeLang.minute = tempDate
                  ? this.$formatDate(
                      tempDate,
                      'DD/MM/YYYY HH:mm:ss',
                      'mm',
                      true
                    )
                  : null
                attributeLang.value = tempDate
                  ? this.$formatDate(
                      tempDate,
                      'DD/MM/YYYY HH:mm:ss',
                      'YYYY-MM-DD',
                      true
                    )
                  : null
              } else if (cur.attributeTypeId === attrTypes.select) {
                attributeLang.value = data.length
                  ? isNaN(
                      data[0].values.filter((e) => e.langId === lang.id)[0]
                        .value[0]
                    )
                    ? data[0].values.filter((e) => e.langId === lang.id)[0]
                        .value[0]
                    : Number(
                        data[0].values.filter((e) => e.langId === lang.id)[0]
                          .value[0]
                      )
                  : null
                attributeLang.optionValues = cur.optionValues.filter(
                  (e) => e.langId === lang.id
                )
              } else if (
                cur.attributeTypeId === attrTypes.multiSelect ||
                cur.attributeTypeId === attrTypes.checkbox
              ) {
                attributeLang.value = data.length
                  ? data[0].values
                      .filter((e) => e.langId === lang.id)[0]
                      .value.reduce((dataAcc, curData, dataIdx) => {
                        dataAcc.push(isNaN(curData) ? curData : Number(curData))
                        return dataAcc
                      }, [])
                  : []
                attributeLang.optionValues = cur.optionValues.filter(
                  (e) => e.langId === lang.id
                )
              } else if (cur.attributeTypeId === attrTypes.radio) {
                attributeLang.value = data.length
                  ? isNaN(
                      data[0].values.filter((e) => e.langId === lang.id)[0]
                        .value[0]
                    )
                    ? data[0].values.filter((e) => e.langId === lang.id)[0]
                        .value[0]
                    : Number(
                        data[0].values.filter((e) => e.langId === lang.id)[0]
                          .value[0]
                      )
                  : null
                attributeLang.optionValues = cur.optionValues.filter(
                  (e) => e.langId === lang.id
                )
              } else if (
                cur.attributeTypeId === attrTypes.price ||
                cur.attributeTypeId === attrTypes.number
              ) {
                attributeLang.value = data.length
                  ? data[0].values.filter((e) => e.langId === lang.id)[0]
                      .value[0]
                  : null
              }

              attributeLangList.push(attributeLang)
            }
            cur.attributeLangList = attributeLangList
            cur.tab = 0
          }
        }

        this.selectedServices = this.data.productsAroundLocations.reduce(
          (acc, cur, idx) => {
            acc.push(cur.aroundLocationId)
            return acc
          },
          []
        )

        acc.push(cur)
        return acc
      }, [])

      this.customFields = rawApiData.customAttribute.reduce((acc, cur, idx) => {
        const data = this.data.attributes.filter(
          (e) =>
            e.attributeTypeId === cur.attributeTypeId &&
            cur.id === e.attributeId
        )
        if (cur.attributeTypeId === attrTypes.switch) {
          cur.value = Number(data.length ? data[0].values[0].value[0] : 1)
        } else if (cur.attributeTypeId === attrTypes.video) {
          cur.value = data.length ? data[0].values[0].value[0] : null
        } else if (cur.attributeTypeId === attrTypes.image) {
          cur.value = data.length ? data[0].values[0].value : null
        } else {
          // Là field doanh nghiệp
          // eslint-disable-next-line no-lonely-if
          if (cur.id === 6) {
            cur.value = data.length ? Number(data[0].values[0].value[0]) : null
          } else if (cur.id === 9) {
            cur.value = data.length
              ? data[0].values[0].value.reduce((dataAcc, curData, dataIdx) => {
                  dataAcc.push(Number(curData))
                  return dataAcc
                }, [])
              : []
          } else if (cur.id === 11) {
            this.price = this.$formatNumber(
              data.length ? data[0].values[0].value[0] : 0,
              '0,0[.][0000000000000]'
            )
          } else {
            const attributeLangList = []
            for (
              let index = 0;
              index < this.attributeLangList.length;
              index++
            ) {
              const lang = this.attributeLangList[index]
              const attributeLang = {
                ...lang,
                errors: [],
              }
              if (
                cur.attributeTypeId === attrTypes.textField ||
                cur.attributeTypeId === attrTypes.textArea
              ) {
                attributeLang.value = data.length
                  ? data[0].values.filter((e) => e.langId === lang.id)[0]
                      .value[0]
                  : null
              } else if (cur.attributeTypeId === attrTypes.date) {
                attributeLang.value = data.length
                  ? this.$formatDate(
                      data[0].values.filter((e) => e.langId === lang.id)[0]
                        .value[0],
                      'DD/MM/YYYY',
                      'YYYY-MM-DD',
                      true
                    )
                  : null
              } else if (cur.attributeTypeId === attrTypes.dateTime) {
                const tempDate = data.length
                  ? data[0].values.filter((e) => e.langId === lang.id)[0]
                      .value[0]
                  : null
                attributeLang.hour = tempDate
                  ? this.$formatDate(
                      tempDate,
                      'DD/MM/YYYY HH:mm:ss',
                      'HH',
                      true
                    )
                  : null
                attributeLang.minute = tempDate
                  ? this.$formatDate(
                      tempDate,
                      'DD/MM/YYYY HH:mm:ss',
                      'mm',
                      true
                    )
                  : null
                attributeLang.value = tempDate
                  ? this.$formatDate(
                      tempDate,
                      'DD/MM/YYYY HH:mm:ss',
                      'YYYY-MM-DD',
                      true
                    )
                  : null
              } else if (cur.attributeTypeId === attrTypes.select) {
                attributeLang.value = data.length
                  ? isNaN(
                      data[0].values.filter((e) => e.langId === lang.id)[0]
                        .value[0]
                    )
                    ? data[0].values.filter((e) => e.langId === lang.id)[0]
                        .value[0]
                    : Number(
                        data[0].values.filter((e) => e.langId === lang.id)[0]
                          .value[0]
                      )
                  : null
                attributeLang.optionValues = cur.optionValues.filter(
                  (e) => e.langId === lang.id
                )
              } else if (
                cur.attributeTypeId === attrTypes.multiSelect ||
                cur.attributeTypeId === attrTypes.checkbox
              ) {
                attributeLang.value = data.length
                  ? data[0].values
                      .filter((e) => e.langId === lang.id)[0]
                      .value.reduce((dataAcc, curData, dataIdx) => {
                        dataAcc.push(isNaN(curData) ? curData : Number(curData))
                        return dataAcc
                      }, [])
                  : []
                attributeLang.optionValues = cur.optionValues.filter(
                  (e) => e.langId === lang.id
                )
              } else if (cur.attributeTypeId === attrTypes.radio) {
                attributeLang.value = data.length
                  ? isNaN(
                      data[0].values.filter((e) => e.langId === lang.id)[0]
                        .value[0]
                    )
                    ? data[0].values.filter((e) => e.langId === lang.id)[0]
                        .value[0]
                    : Number(
                        data[0].values.filter((e) => e.langId === lang.id)[0]
                          .value[0]
                      )
                  : null
                attributeLang.optionValues = cur.optionValues.filter(
                  (e) => e.langId === lang.id
                )
              } else if (
                cur.attributeTypeId === attrTypes.price ||
                cur.attributeTypeId === attrTypes.number
              ) {
                attributeLang.value = data.length
                  ? data[0].values.filter((e) => e.langId === lang.id)[0]
                      .value[0]
                  : null
              }

              attributeLangList.push(attributeLang)
            }
            cur.attributeLangList = attributeLangList
            cur.tab = 0
          }
        }

        this.selectedServices = this.data.productsAroundLocations.reduce(
          (acc, cur, idx) => {
            acc.push(cur.aroundLocationId)
            return acc
          },
          []
        )

        acc.push(cur)
        return acc
      }, [])

      this.hydrated = true
    },

    async getEnterpriseList() {
      const response = await this.$store.dispatch('product/hotel_enterprise')
      if (!response.error) {
        this.enterpriseList = response.data.data
      }
      return response
    },

    async getProductCategoryList() {
      const response = await this.$store.dispatch('product/hotel_category')
      if (!response.error) {
        this.productCategoryList = response.data.data
      }
      return response
    },

    async getLocationAround() {
      const res = await this.$store.dispatch(
        'category-product/list_around_location'
      )
      if (!res.error) {
        this.map_services = res.data.data
      }

      return res
    },

    navigationConfirmed() {
      this.$emit('toggle')
      this.$emit('set_title')
      this.$emit('backproduct')
    },

    toggleMultipleRadio(id, array) {
      if (!array) {
        array = [id]
      } else if (array.includes(id)) {
        const index = array.findIndex((e) => e === id)
        if (index > -1) {
          array.splice(index, 1)
        }
      } else {
        array = array.push(id)
      }
    },

    selectImage(event, customField, customFieldIdx) {
      this.$log.debug(event, customField, customFieldIdx)
      customField.value = event
      customField.errors = ''
    },

    selectVideo(event, customField, customFieldIdx) {
      this.$log.debug(event, customField, customFieldIdx)
      customField.value = event
      customField.errors = ''
    },

    validate() {
      let hasErrors = false
      const attrTypes = { ...this.$store.state.productAttrs.attrTypes }
      const systemFields = [...this.systemFields]
      const customFields = [...this.customFields]

      for (let index = 0; index < systemFields.length; index++) {
        const dataField = systemFields[index]
        const isRequired = dataField.required === 1
        const fieldType = dataField.attributeTypeId
        if (
          fieldType !== attrTypes.switch &&
          fieldType !== attrTypes.image &&
          fieldType !== attrTypes.video
        ) {
          let lastInvalidTab = null
          if (dataField.id === 6) {
            if (isRequired) {
              if (dataField.value !== 0 && !dataField.value) {
                dataField.errors = ['Không được để trống']
              }
            }
          } else if (dataField.id === 9) {
            if (isRequired) {
              if (!dataField.value || !dataField.value.length) {
                dataField.errors = ['Không được để trống']
              }
            }
          } else if (dataField.id === 11) {
            const price = Number(
              this.$formatNumber(this.price, '0[.][0000000000000]')
            )
            if (isRequired) {
              if (!price) {
                dataField.errors = ['Vui lòng nhập số tiền lớn hơn 0']
              }
            } else if (isNaN(price)) {
              dataField.errors = ['Vui lòng nhập số tiền lớn hợp lệ']
            }
          } else if (dataField.attributeLangList) {
            for (
              let langIdx = 0;
              langIdx < dataField.attributeLangList.length;
              langIdx++
            ) {
              const lang = dataField.attributeLangList[langIdx]
              if (
                fieldType === attrTypes.textField ||
                fieldType === attrTypes.textArea ||
                fieldType === attrTypes.date
              ) {
                if (isRequired) {
                  if (!lang.value || (lang.value && !lang.value.trim())) {
                    hasErrors = true
                    lang.errors = ['Không được để trống']
                    if (lastInvalidTab === null) {
                      lastInvalidTab = langIdx
                    }
                  }
                }
              }

              if (fieldType === attrTypes.dateTime) {
                if (isRequired) {
                  if (!lang.value || (lang.value && !lang.value.trim())) {
                    lang.errors = ['Không được để trống']
                    hasErrors = true
                    if (lastInvalidTab === null) {
                      lastInvalidTab = langIdx
                    }
                  }

                  if (!lang.hour || (lang.hour && !lang.hour.trim())) {
                    hasErrors = true
                    lang.hourErrors = ['Không được để trống']
                    if (lastInvalidTab === null) {
                      lastInvalidTab = langIdx
                    }
                  }

                  if (!lang.minute || (lang.minute && !lang.minute.trim())) {
                    hasErrors = true
                    lang.minuteErrors = ['Không được để trống']
                    if (lastInvalidTab === null) {
                      lastInvalidTab = langIdx
                    }
                  }
                }
              }

              if (
                fieldType === attrTypes.select ||
                fieldType === attrTypes.radio
              ) {
                if (isRequired) {
                  if (lang.value !== 0 && !lang.value) {
                    lang.errors = ['Không được để trống']
                    hasErrors = true
                    if (lastInvalidTab === null) {
                      lastInvalidTab = langIdx
                    }
                  }
                }
              }

              if (
                fieldType === attrTypes.multiSelect ||
                fieldType === attrTypes.checkbox
              ) {
                if (isRequired) {
                  if (!lang.value.length) {
                    lang.errors = ['Không được để trống']
                    hasErrors = true
                    if (lastInvalidTab === null) {
                      lastInvalidTab = langIdx
                    }
                  }
                }
              }

              if (
                fieldType === attrTypes.price ||
                fieldType === attrTypes.number
              ) {
                if (isRequired) {
                  if (!lang.value || (lang.value && !lang.value.trim())) {
                    lang.errors = ['Không được để trống']
                    hasErrors = true
                    if (lastInvalidTab === null) {
                      lastInvalidTab = langIdx
                    }
                  }
                }

                if (lang.value) {
                  if (isNaN(lang.value)) {
                    lang.errors = ['Vui lòng nhập số']
                    hasErrors = true
                    if (lastInvalidTab === null) {
                      lastInvalidTab = langIdx
                    }
                  } else if (
                    Number(lang.value) < 0 &&
                    fieldType !== attrTypes.number
                  ) {
                    lang.errors = ['Vui lòng nhập số lớn hơn 0']
                    hasErrors = true
                    if (lastInvalidTab === null) {
                      lastInvalidTab = langIdx
                    }
                  }
                }
              }
            }
          }

          if (lastInvalidTab) {
            dataField.tab = lastInvalidTab
          }
        }

        if (dataField.id === 17) {
          if (dataField.value) {
            if (!this.listsuggestions.length) {
              hasErrors = true
              this.suggestions_msg = 'Không được để trống'
            }
          }
        }

        if (fieldType === attrTypes.image || fieldType === attrTypes.video) {
          if (isRequired) {
            if (!dataField.value) {
              dataField.errors = 'Không được để trống'
              hasErrors = true
            }
          }
        }
      }

      for (let index = 0; index < customFields.length; index++) {
        const dataField = customFields[index]
        const isRequired = dataField.required === 1
        const fieldType = dataField.attributeTypeId
        if (
          fieldType !== attrTypes.switch &&
          fieldType !== attrTypes.image &&
          fieldType !== attrTypes.video
        ) {
          let lastInvalidTab = null
          for (
            let langIdx = 0;
            langIdx < dataField.attributeLangList.length;
            langIdx++
          ) {
            const lang = dataField.attributeLangList[langIdx]
            if (
              fieldType === attrTypes.textField ||
              fieldType === attrTypes.textArea ||
              fieldType === attrTypes.date
            ) {
              if (isRequired) {
                if (!lang.value || (lang.value && !lang.value.trim())) {
                  hasErrors = true
                  lang.errors = ['Không được để trống']
                  if (lastInvalidTab === null) {
                    lastInvalidTab = langIdx
                  }
                }
              }
            }

            if (fieldType === attrTypes.dateTime) {
              if (isRequired) {
                if (!lang.value || (lang.value && !lang.value.trim())) {
                  lang.errors = ['Không được để trống']
                  hasErrors = true
                  if (lastInvalidTab === null) {
                    lastInvalidTab = langIdx
                  }
                }

                if (!lang.hour || (lang.hour && !lang.hour.trim())) {
                  hasErrors = true
                  lang.hourErrors = ['Không được để trống']
                  if (lastInvalidTab === null) {
                    lastInvalidTab = langIdx
                  }
                }

                if (!lang.minute || (lang.minute && !lang.minute.trim())) {
                  hasErrors = true
                  lang.minuteErrors = ['Không được để trống']
                  if (lastInvalidTab === null) {
                    lastInvalidTab = langIdx
                  }
                }
              }
            }

            if (
              fieldType === attrTypes.select ||
              fieldType === attrTypes.radio
            ) {
              if (isRequired) {
                if (lang.value !== 0 && !lang.value) {
                  lang.errors = ['Không được để trống']
                  hasErrors = true
                  if (lastInvalidTab === null) {
                    lastInvalidTab = langIdx
                  }
                }
              }
            }

            if (
              fieldType === attrTypes.multiSelect ||
              fieldType === attrTypes.checkbox
            ) {
              if (isRequired) {
                if (!lang.value.length) {
                  lang.errors = ['Không được để trống']
                  hasErrors = true
                  if (lastInvalidTab === null) {
                    lastInvalidTab = langIdx
                  }
                }
              }
            }

            if (
              fieldType === attrTypes.price ||
              fieldType === attrTypes.number
            ) {
              if (isRequired) {
                if (!lang.value || (lang.value && !lang.value.trim())) {
                  lang.errors = ['Không được để trống']
                  hasErrors = true
                  if (lastInvalidTab === null) {
                    lastInvalidTab = langIdx
                  }
                }
              }

              if (lang.value) {
                if (isNaN(lang.value)) {
                  lang.errors = ['Vui lòng nhập số']
                  hasErrors = true
                  if (lastInvalidTab === null) {
                    lastInvalidTab = langIdx
                  }
                } else if (
                  Number(lang.value) < 0 &&
                  fieldType !== attrTypes.number
                ) {
                  lang.errors = ['Vui lòng nhập số lớn hơn 0']
                  hasErrors = true
                  if (lastInvalidTab === null) {
                    lastInvalidTab = langIdx
                  }
                }
              }
            }
          }

          if (lastInvalidTab) {
            dataField.tab = lastInvalidTab
          }
        }

        if (fieldType === attrTypes.image || fieldType === attrTypes.video) {
          if (isRequired) {
            if (!dataField.value) {
              dataField.errors = 'Không được để trống'
              hasErrors = true
            }
          }
        }
      }

      this.systemFields = systemFields
      this.customFields = customFields

      if (!hasErrors) {
        // ... call API
        this.updateTourismProduct()
      }
    },

    uploadFile(fileInfo) {
      this.$log.debug('[fileInfo]', fileInfo)
      const formData = new FormData()
      formData.append('file', fileInfo)
      const response = this.$store.dispatch('uploadImg/uploadFile', {
        folder: 'spdl',
        formData,
      })
      return response
    },

    async updateTourismProduct() {
      this.$wait.start('savingData')
      const attrTypes = { ...this.$store.state.productAttrs.attrTypes }
      const filesToUpload = [
        ...this.systemFields
          .filter(
            (e) =>
              e.attributeTypeId === attrTypes.image ||
              e.attributeTypeId === attrTypes.video
          )
          .reduce((acc, cur, idx) => {
            this.$log.debug('[File]: ', cur)
            if (cur.value && typeof cur.value !== 'string') {
              if (cur.attributeTypeId === attrTypes.image) {
                for (let index = 0; index < cur.value.length; index++) {
                  const element = cur.value[index]
                  this.$log.debug('[Image]', element)
                  if (element.file) {
                    acc.push(element.file)
                  }
                }
              } else if (typeof cur.value !== 'string') {
                acc.push(cur.value)
              }
            }
            return acc
          }, []),

        ...this.customFields
          .filter(
            (e) =>
              e.attributeTypeId === attrTypes.image ||
              e.attributeTypeId === attrTypes.video
          )
          .reduce((acc, cur, idx) => {
            this.$log.debug('[File]: ', cur)
            if (cur.value && typeof cur.value !== 'string') {
              if (cur.attributeTypeId === attrTypes.image) {
                for (let index = 0; index < cur.value.length; index++) {
                  const element = cur.value[index]
                  this.$log.debug('[Image]', element)
                  if (element.file) {
                    acc.push(element.file)
                  }
                }
              } else if (typeof cur.value !== 'string') {
                acc.push(cur.value)
              }
            }
            return acc
          }, []),
      ]

      this.$log.debug('[filesToUpload]', filesToUpload)

      let success = 0

      for (let index = 0; index < filesToUpload.length; index++) {
        const element = filesToUpload[index]
        if (typeof element === 'string') {
          success++
        } else {
          try {
            const uploadResult = await this.uploadFile(element)
            if (!uploadResult.error) {
              this.$log.debug('[Upload Result]', uploadResult, element)
              element.value = uploadResult.data.data.image_url
              success++
            }
          } catch (error) {
            this.$log.error('[Upload Error]', error)
          }
        }
      }

      if (success === filesToUpload.length) {
        const enterpriseId = this.systemFields.filter((e) => e.id === 6)[0]
          .value
        const productSuggestions = this.listsuggestions.reduce(
          (acc, cur, idx) => {
            acc.push({
              relatedId: cur.id,
              relatedType: cur.product_type,
            })
            return acc
          },
          []
        )

        const attributes = this.attributeLangList.reduce((acc, cur, idx) => {
          const curLangId = cur.id
          // hệ thống
          const sysAttrs = this.systemFields.reduce(
            (fieldAcc, curField, fieldIdx) => {
              if (
                curField.id !== 6 &&
                curField.id !== 9 &&
                curField.id !== 11
              ) {
                const attributeLangList = []
                if (curField.attributeLangList) {
                  attributeLangList.push(
                    ...curField.attributeLangList
                      .filter((e) => e.id === curLangId)
                      .reduce((attrAcc, curAttr, attrIdx) => {
                        if (curField.attributeTypeId === attrTypes.dateTime) {
                          attrAcc.push({
                            attributeId: curField.id,
                            value: this.$formatDate(
                              `${curAttr.hour}:${curAttr.minute}:00 ${curAttr.value}`,
                              'HH:mm:ss YYYY-MM-DD',
                              'DD/MM/YYYY HH:mm:ss',
                              true
                            ),
                            langId: curLangId,
                          })
                        } else if (
                          curField.attributeTypeId === attrTypes.date
                        ) {
                          attrAcc.push({
                            attributeId: curField.id,
                            value: this.$formatDate(
                              curAttr.value,
                              'YYYY-MM-DD',
                              'DD/MM/YYYY',
                              true
                            ),
                            langId: curLangId,
                          })
                        } else if (
                          curAttr.value &&
                          typeof curAttr.value === 'object' &&
                          curAttr.value.length
                        ) {
                          for (
                            let index = 0;
                            index < curAttr.value.length;
                            index++
                          ) {
                            const curAttrValue = curAttr.value[index]
                            attrAcc.push({
                              attributeId: curField.id,
                              value: curAttrValue,
                              langId: curLangId,
                            })
                          }
                        } else {
                          attrAcc.push({
                            attributeId: curField.id,
                            value: curAttr.value,
                            langId: curLangId,
                          })
                        }
                        return attrAcc
                      }, [])
                  )
                  this.$log.debug('[Has Lang]', attributeLangList)
                } else {
                  this.$log.debug('[No Lang]', curField, cur)
                  if (
                    curField.value &&
                    typeof curField.value === 'object' &&
                    curField.value.length
                  ) {
                    for (
                      let index = 0;
                      index < curField.value.length;
                      index++
                    ) {
                      const curFieldValue = curField.value[index]
                      if (curField.attributeTypeId === attrTypes.image) {
                        fieldAcc.push({
                          attributeId: curField.id,
                          value:
                            curFieldValue.file?.value || curFieldValue.file,
                          langId: curLangId,
                        })
                      } else {
                        fieldAcc.push({
                          attributeId: curField.id,
                          value: curFieldValue,
                          langId: curLangId,
                        })
                      }
                    }
                  } else if (curField.attributeTypeId === attrTypes.video) {
                    this.$log.debug('[Video Field]', curField)
                    fieldAcc.push({
                      attributeId: curField.id,
                      value:
                        typeof curField.value === 'string'
                          ? curField.value
                          : curField.value.value,
                      langId: curLangId,
                    })
                  } else {
                    fieldAcc.push({
                      attributeId: curField.id,
                      value: curField.value || '',
                      langId: curLangId,
                    })
                  }
                }
                fieldAcc.push(...attributeLangList)
              } else {
                this.$log.debug('[curField]', curField)
                if (curField.id !== 11) {
                  if (
                    curField.value &&
                    typeof curField.value === 'object' &&
                    curField.value.length
                  ) {
                    for (
                      let index = 0;
                      index < curField.value.length;
                      index++
                    ) {
                      const curAttrValue = curField.value[index]
                      fieldAcc.push({
                        attributeId: curField.id,
                        value: curAttrValue,
                        langId: curLangId,
                      })
                    }
                  } else {
                    fieldAcc.push({
                      attributeId: curField.id,
                      value: curField.value || '',
                      langId: curLangId,
                    })
                  }
                } else {
                  fieldAcc.push({
                    attributeId: curField.id,
                    value: Number(
                      this.$formatNumber(this.price, '0[.][0000000000000]')
                    ),
                    langId: curLangId,
                  })
                }
              }

              return fieldAcc
            },
            []
          )

          // Custom
          const cusAttrs = this.customFields.reduce(
            (fieldAcc, curField, fieldIdx) => {
              if (
                curField.id !== 6 &&
                curField.id !== 9 &&
                curField.id !== 11
              ) {
                const attributeLangList = []
                if (curField.attributeLangList) {
                  attributeLangList.push(
                    ...curField.attributeLangList
                      .filter((e) => e.id === curLangId)
                      .reduce((attrAcc, curAttr, attrIdx) => {
                        if (curField.attributeTypeId === attrTypes.dateTime) {
                          attrAcc.push({
                            attributeId: curField.id,
                            value: this.$formatDate(
                              `${curAttr.hour}:${curAttr.minute}:00 ${curAttr.value}`,
                              'HH:mm:ss YYYY-MM-DD',
                              'DD/MM/YYYY HH:mm:ss',
                              true
                            ),
                            langId: curLangId,
                          })
                        } else if (
                          curField.attributeTypeId === attrTypes.date
                        ) {
                          attrAcc.push({
                            attributeId: curField.id,
                            value: this.$formatDate(
                              curAttr.value,
                              'YYYY-MM-DD',
                              'DD/MM/YYYY',
                              true
                            ),
                            langId: curLangId,
                          })
                        } else if (
                          curAttr.value &&
                          typeof curAttr.value === 'object' &&
                          curAttr.value.length
                        ) {
                          for (
                            let index = 0;
                            index < curAttr.value.length;
                            index++
                          ) {
                            const curAttrValue = curAttr.value[index]
                            attrAcc.push({
                              attributeId: curField.id,
                              value: curAttrValue,
                              langId: curLangId,
                            })
                          }
                        } else {
                          attrAcc.push({
                            attributeId: curField.id,
                            value: curAttr.value,
                            langId: curLangId,
                          })
                        }
                        return attrAcc
                      }, [])
                  )
                  this.$log.debug('[Has Lang]', attributeLangList)
                } else {
                  this.$log.debug('[No Lang]', curField, cur)
                  if (
                    curField.value &&
                    typeof curField.value === 'object' &&
                    curField.value.length
                  ) {
                    for (
                      let index = 0;
                      index < curField.value.length;
                      index++
                    ) {
                      const curFieldValue = curField.value[index]
                      if (curField.attributeTypeId === attrTypes.image) {
                        fieldAcc.push({
                          attributeId: curField.id,
                          value:
                            curFieldValue.file?.value || curFieldValue.file,
                          langId: curLangId,
                        })
                      } else {
                        fieldAcc.push({
                          attributeId: curField.id,
                          value: curFieldValue,
                          langId: curLangId,
                        })
                      }
                    }
                  } else if (curField.attributeTypeId === attrTypes.video) {
                    this.$log.debug('[Video Field]', curField)
                    fieldAcc.push({
                      attributeId: curField.id,
                      value:
                        typeof curField.value === 'string'
                          ? curField.value
                          : curField.value.value,
                      langId: curLangId,
                    })
                  } else {
                    fieldAcc.push({
                      attributeId: curField.id,
                      value: curField.value || '',
                      langId: curLangId,
                    })
                  }
                }
                fieldAcc.push(...attributeLangList)
              } else {
                this.$log.debug('[curField]', curField)
                if (curField.id !== 11) {
                  if (
                    curField.value &&
                    typeof curField.value === 'object' &&
                    curField.value.length
                  ) {
                    for (
                      let index = 0;
                      index < curField.value.length;
                      index++
                    ) {
                      const curAttrValue = curField.value[index]
                      fieldAcc.push({
                        attributeId: curField.id,
                        value: curAttrValue,
                        langId: curLangId,
                      })
                    }
                  } else {
                    fieldAcc.push({
                      attributeId: curField.id,
                      value: curField.value || '',
                      langId: curLangId,
                    })
                  }
                } else {
                  fieldAcc.push({
                    attributeId: curField.id,
                    value: Number(
                      this.$formatNumber(this.price, '0[.][0000000000000]')
                    ),
                    langId: curLangId,
                  })
                }
              }

              return fieldAcc
            },
            []
          )

          acc.push(...sysAttrs, ...cusAttrs)
          return acc
        }, [])

        this.$log.debug('[Processed attributes]', attributes)
        const data = {
          productId: this.data.productId,
          approvalStatus: this.data.approvalStatus,
          attributeSetId: this.prodAttrSet,
          price: Number(this.$formatNumber(this.price, '0[.][0000000000000]')),
          enterpriseId,
          lon: this.lng,
          lat: this.lat,
          currencyId: 1,
          productCategoryIds: this.systemFields.filter((e) => e.id === 9)[0]
            .value,
          attributes,
          productSuggestions,
          productsAroundLocations: this.selectedServices,
        }

        this.$log.debug('[Request Data]', data)
        this.$store
          .dispatch('tourismProduct/updateTourismProduct', data)
          .then((response) => {
            this.$log.debug('[Response Data]', response)
            if (!response.error) {
              this.$showSuccess(this, 'Cập nhật sản phẩm du lịch thành công')
              this.$emit('success')
              this.$emit('toggle')
            }
          })
          .finally(() => {
            this.$wait.end('savingData')
          })
      }
    },

    resetData() {
      this.center = [21.028511, 105.804817]
      this.markerLatLng = [21.028511, 105.804817]
      this.lat = 21.028511
      this.lng = 105.804817
      this.zoom = 15
      this.address = ''
      this.selectedServices = []
      this.listsuggestions = []
      this.getProdAttrSetFields()
    },
  },
}
</script>

<style lang="scss">
.add-tourism-prod {
  .transparent-tabs {
    .v-tabs-bar,
    .v-tabs-items {
      background: transparent !important;
    }
  }
  p {
    margin: 0 !important;
  }
}
</style>
