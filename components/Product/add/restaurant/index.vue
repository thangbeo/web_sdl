<template>
  <div>
    <client-only>
      <div
        class="d-flex w-100"
        style="
          position: fixed;
          z-index: 5;
          right: 0;
          top: 75px;
          background-color: #f5f7fe;
        "
      >
        <div class="flex-grow-1"></div>
        <v-btn
          class="text-none white--text mr-3"
          color="#4873C2"
          dark
          depressed
          width="120px"
          @click="open_reset = true"
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
          :loading="loading_review"
          :disabled="loading_review"
          @click="check_review"
        >
          <img class="mr-1" src="~/assets/icon/view.svg" />
          Xem trước
          <template v-slot:loader>
            <span><span>Xin chờ...</span></span>
          </template>
        </v-btn>
      </div>
      <div
        class="d-flex w-100"
        style="
          position: fixed;
          z-index: 3;
          right: 12px;
          bottom: 0;
          background-color: #f5f7fe;
        "
      >
        <div class="flex-grow-1"></div>
        <v-btn
          color="#FF0F59"
          class="text-none white--text mr-3 mb-2"
          depressed
          width="90"
          @click="$store.commit('product/toggle_cancel')"
        >
          Hủy
        </v-btn>
        <v-btn
          class="text-none white--text"
          color="#47BBFF"
          dark
          depressed
          width="90"
          @click="$store.commit('product/toggle_save')"
        >
          Lưu
        </v-btn>
      </div>
      <v-tabs
        v-model="tabmenu"
        color="primary"
        class="mt-9"
        active-class="primary--text"
        background-color="#f4f7fe"
        style="position: fixed; z-index: 5"
      >
        <v-tab
          :class="
            (tabmenu !== 0 && 'black--text') +
            ' text-none letter-spacing-normal fs-17 font-weight-bold'
          "
          @click="clicked_tab(1)"
        >
          Thông tin cơ bản
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="tabmenu" style="background-color: #f5f7fe">
        <v-tab-item>
          <div class="add-product-restaurant-info mt-16">
            <!--            <div class="fix-height">-->
            <div>
              <v-row class="mt-2 ml-10">
                <v-col cols="11">
                  <div class="d-flex align-center">
                    <div class="fs-14 font-weight-bold mr-10">Hiển thị/ Ẩn</div>
                    <v-switch
                      v-model="hidden"
                      color="#47bbff"
                      :true-value="1"
                      :false-value="0"
                      inset
                    />
                    <div
                      class="fs-14 font-weight-bold mr-3"
                      style="margin-left: 200px"
                    >
                      SKU <span class="error--text ml-1">*</span>
                    </div>
                    <v-chip small outlined>{{ sku }}</v-chip>
                    <h3 ref="scroll_to_one" />
                  </div>
                </v-col>

                <v-col class="pb-0" cols="11">
                  <p class="ma-0 fs-14 font-weight-bold">
                    Tên quán ăn <span class="error--text ml-1">*</span>
                  </p>
                  <v-tabs v-model="tab" background-color="#F5F7FE">
                    <v-tab
                      v-for="(language, index) in languages"
                      :key="`${index}-${language}`"
                      class="text-none"
                    >
                      {{ language.name }}
                    </v-tab>
                  </v-tabs>
                  <v-tabs-items v-model="tab" style="background-color: #f5f7fe">
                    <v-tab-item
                      v-for="(language, index) in languages"
                      :key="`${index}-${language}`"
                    >
                      <v-text-field
                        v-model="language.restaurant"
                        :error-messages="language.restaurant_msg"
                        placeholder="Nhập tiêu đề"
                        class="border-1 fs-14"
                        solo
                        flat
                        dense
                        @input="language.restaurant_msg = []"
                      >
                      </v-text-field>
                    </v-tab-item>
                  </v-tabs-items>
                </v-col>

                <v-col cols="11">
                  <p class="ma-0 fs-14 font-weight-bold">
                    Địa chỉ <span class="error--text ml-1">*</span>
                  </p>
                  <v-tabs v-model="tab1" background-color="#F5F7FE">
                    <v-tab
                      v-for="(language, index) in languages"
                      :key="`${index}-${language}`"
                      class="text-none"
                    >
                      {{ language.name }}
                    </v-tab>
                  </v-tabs>
                  <v-tabs-items
                    v-model="tab1"
                    style="background-color: #f5f7fe"
                  >
                    <v-tab-item
                      v-for="(language, index) in languages"
                      :key="`${index}-${language}`"
                    >
                      <v-text-field
                        v-model="language.address"
                        :error-messages="language.address_msg"
                        placeholder="Nhập địa chỉ"
                        class="border-1 fs-14"
                        solo
                        flat
                        dense
                        @input="language.address_msg = []"
                      >
                      </v-text-field>
                    </v-tab-item>
                  </v-tabs-items>

                  <LeafletMap :lat-lng="[lat, lng]" @set_latlng="set_latlng" />
                </v-col>

                <v-col class="pb-0" cols="11">
                  <p class="ma-0 fs-14 font-weight-bold">Mô tả ngắn</p>
                  <v-tabs v-model="tab3" background-color="#F5F7FE">
                    <v-tab
                      v-for="(language, index) in languages"
                      :key="`${index}-${language}`"
                      class="text-none"
                    >
                      {{ language.name }}
                    </v-tab>
                  </v-tabs>
                  <v-tabs-items
                    v-model="tab3"
                    style="background-color: #f5f7fe"
                  >
                    <v-tab-item
                      v-for="(language, index) in languages"
                      :key="`${index}-${language}`"
                    >
                      <v-text-field
                        v-model="language.describe"
                        placeholder="Nhập mô tả"
                        class="border-1 fs-14"
                        solo
                        flat
                        dense
                      >
                      </v-text-field>
                    </v-tab-item>
                  </v-tabs-items>
                  <h3 ref="scroll_to_two" />
                </v-col>

                <v-col cols="11">
                  <p class="ma-0 fs-14 font-weight-bold">
                    Giới thiệu <span class="error--text ml-1">*</span>
                  </p>
                  <v-tabs v-model="tab2" background-color="#F5F7FE">
                    <v-tab
                      v-for="(language, index) in languages"
                      :key="`${index}-${language}`"
                      class="text-none"
                    >
                      {{ language.name }}
                    </v-tab>
                  </v-tabs>
                  <v-tabs-items
                    v-model="tab2"
                    style="background-color: #f5f7fe"
                  >
                    <v-tab-item
                      v-for="(language, index) in languages"
                      :key="`${index}-${language}`"
                    >
                      <vue-2-editor
                        id="vue-2-editor-fix-height-1"
                        @text-change="
                          set_value_editor($event, language, 'introduce', 1)
                        "
                      />
                      <div
                        v-if="language.introduce_msg.length !== 0"
                        class="v-messages theme--light error--text mt-1"
                        role="alert"
                      >
                        <div class="v-messages__wrapper">
                          <div class="v-messages__message">
                            Không được để trống
                          </div>
                        </div>
                      </div>
                    </v-tab-item>
                  </v-tabs-items>
                </v-col>

                <v-col class="pb-0" cols="11">
                  <v-row>
                    <v-col cols="4" class="py-0">
                      <p class="my-2 fs-14 font-weight-bold">Doanh nghiệp</p>
                      <v-autocomplete
                        v-model="enterprise"
                        :items="list_enterprise"
                        :menu-props="{ zIndex: '1' }"
                        item-value="id"
                        item-text="enterprise_name"
                        class="border-1 fs-14"
                        solo
                        flat
                        dense
                        hide-details
                        clearable
                      >
                      </v-autocomplete>
                    </v-col>
                    <v-col cols="4" class="py-0">
                      <p class="my-2 fs-14 font-weight-bold">Số điện thoại</p>
                      <v-text-field
                        v-model="phone"
                        :error-messages="phone_msg"
                        type="text"
                        placeholder="Số điện thoại"
                        class="fs-14"
                        solo
                        flat
                        dense
                        @input="validate_phone"
                      />
                    </v-col>
                    <v-col cols="4" class="py-0">
                      <p class="my-2 fs-14 font-weight-bold">Email</p>
                      <v-text-field
                        v-model="email"
                        :error-messages="email_msg"
                        placeholder="Email"
                        class="fs-14"
                        solo
                        flat
                        dense
                        @input="validate_email"
                      />
                    </v-col>
                  </v-row>
                  <h3 ref="scroll_to_three" />
                </v-col>

                <v-col class="pb-0" cols="11">
                  <v-row>
                    <v-col cols="4" class="py-0">
                      <p class="mb-2 fs-14 font-weight-bold">
                        Danh mục sản phẩm<span class="error--text ml-1">*</span>
                      </p>
                      <v-autocomplete
                        v-model="category"
                        :items="list_category"
                        item-value="id"
                        item-text="name"
                        :error-messages="category_msg"
                        :menu-props="{ zIndex: '1' }"
                        class="border-1 fs-14"
                        solo
                        flat
                        dense
                        multiple
                        @input="category_msg = []"
                      >
                      </v-autocomplete>
                    </v-col>
                    <v-col cols="4" class="py-0">
                      <p class="mb-2 fs-14 font-weight-bold">
                        Loại món ăn <span class="error--text ml-1">*</span>
                      </p>
                      <v-autocomplete
                        v-model="type_dish"
                        :items="list_type_dish"
                        item-value="id"
                        item-text="name"
                        :error-messages="type_dish_msg"
                        :menu-props="{ zIndex: '1' }"
                        class="border-1 fs-14"
                        solo
                        flat
                        dense
                        @input="type_dish_msg = []"
                      >
                      </v-autocomplete>
                    </v-col>
                    <v-col cols="4" class="py-0">
                      <p class="mb-2 fs-14 font-weight-bold">
                        Loại hình <span class="error--text ml-1">*</span>
                      </p>
                      <v-autocomplete
                        v-model="type"
                        :items="list_type"
                        item-value="id"
                        item-text="name"
                        :error-messages="type_msg"
                        :menu-props="{ zIndex: '1' }"
                        class="border-1 fs-14"
                        solo
                        flat
                        dense
                        @input="type_msg = []"
                      >
                      </v-autocomplete>
                    </v-col>
                  </v-row>
                </v-col>

                <v-col class="pb-0" cols="11">
                  <v-row>
                    <v-col cols="4" class="py-0">
                      <p class="mb-2 fs-14 font-weight-bold">
                        Trạng thái <span class="error--text ml-1">*</span>
                      </p>
                      <v-autocomplete
                        v-model="status"
                        :items="list_status"
                        :error-messages="status_msg"
                        :menu-props="{ zIndex: '1' }"
                        class="border-1 fs-14"
                        solo
                        flat
                        dense
                        @input="status_msg = []"
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
                      </v-autocomplete>
                    </v-col>
                    <v-col cols="4" class="py-0">
                      <p class="mb-2 fs-14 font-weight-bold">
                        Mức giá<span class="error--text ml-1 mr-3">*</span>
                        Từ<span class="error--text ml-1">*</span>
                      </p>

                      <div class="d-flex">
                        <v-btn
                          class="rounded-r-0 mb-7"
                          color="#2F5EB5"
                          dark
                          depressed
                        >
                          VND
                        </v-btn>
                        <v-text-field
                          v-model="price1"
                          :error-messages="price1_msg"
                          :persistent-hint="true"
                          type="number"
                          class="rounded-l-0 fs-14"
                          solo
                          flat
                          dense
                          @input="validate_price('price1')"
                        />
                      </div>
                    </v-col>
                    <v-col cols="4" class="py-0">
                      <p class="mb-2 fs-14 font-weight-bold">
                        Đến<span class="error--text ml-1">*</span>
                      </p>
                      <div class="d-flex">
                        <v-btn
                          class="rounded-r-0 mb-7 fs-14"
                          color="#2F5EB5"
                          dark
                          depressed
                        >
                          VND
                        </v-btn>
                        <v-text-field
                          v-model="price2"
                          :error-messages="price2_msg"
                          :persistent-hint="true"
                          type="number"
                          class="rounded-l-0 fs-14"
                          solo
                          flat
                          dense
                          @input="validate_price('price2')"
                        />
                      </div>
                    </v-col>
                  </v-row>
                </v-col>

                <v-col class="pb-0" cols="11">
                  <Services
                    ref="product_restaurant_add_services"
                    :data="utilities"
                    @setData="set_service"
                  />
                </v-col>

                <v-col class="pb-0" cols="11">
                  <p class="mb-2 fs-14 font-weight-bold">
                    Ảnh bìa <span class="error--text ml-1">*</span>
                  </p>
                  <Files
                    id="product-add-restaurant-room"
                    ref="product_add_img_restaurant_room"
                    :maxrequied="30"
                    :errormsg="files_msg"
                    @set_file="set_files"
                  />
                </v-col>

                <v-col class="pt-0" cols="11">
                  <p class="ma-0 fs-14 font-weight-bold">
                    URL thân thiện cho SEO
                  </p>
                  <v-tabs v-model="tab5" background-color="#F5F7FE">
                    <v-tab
                      v-for="(language, index) in languages"
                      :key="`${index}-${language}`"
                      class="text-none"
                    >
                      {{ language.name }}
                    </v-tab>
                  </v-tabs>
                  <v-tabs-items
                    v-model="tab5"
                    style="background-color: #f5f7fe"
                  >
                    <v-tab-item
                      v-for="(language, index) in languages"
                      :key="`${index}-${language}`"
                    >
                      <div class="d-flex">
                        <v-text-field
                          v-model="language.path"
                          :error-messages="language.path_msg"
                          class="border-1 rounded-r-0"
                          solo
                          flat
                          dense
                          @input="validate_url(language)"
                        >
                          <template v-slot:prepend-inner>
                            {{ $store.state.app.domain_name }}
                          </template>
                        </v-text-field>
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn
                              class="rounded-l-0"
                              style="width: 36px; min-width: 36px"
                              color="primary"
                              depressed
                              v-bind="attrs"
                              v-on="on"
                              @click="copy_text(`copy-text-${index}`)"
                            >
                              <v-icon> mdi-content-copy </v-icon>
                            </v-btn>
                          </template>
                          <span>Copy</span>
                        </v-tooltip>
                      </div>
                      <div :id="`copy-text-${index}`" class="d-none">
                        {{ `${$store.state.app.domain_name}${language.path}` }}
                      </div>
                    </v-tab-item>
                  </v-tabs-items>
                </v-col>

                <v-col class="pt-0" cols="11">
                  <p class="mb-0 mt-2 fs-14 font-weight-bold">
                    Thời gian mở cửa<span class="error--text ml-1">*</span>
                  </p>
                  <v-row>
                    <v-col
                      v-for="(time, idx) in timeSetUp"
                      :key="`${idx}-${time}`"
                      cols="12"
                      :class="timeSetUp.length - 1 !== idx && 'mb-4'"
                    >
                      <div class="d-flex align-center">
                        <v-checkbox
                          v-model="time.value"
                          style="min-width: 90px"
                          class="ma-0 mr-12"
                          :label="time.label"
                          hide-details
                          :true-value="1"
                          :false-value="0"
                          :ripple="false"
                        >
                        </v-checkbox>
                        <v-slider
                          v-model="time.timestart"
                          class="ml-4"
                          max="48"
                          min="0"
                          color="gray"
                          track-color="primary"
                          :thumb-color="time.value === 0 ? 'gray' : 'primary'"
                          thumb-label="always"
                          :thumb-size="36"
                          hide-details
                          :disabled="time.value === 0"
                        >
                          <template v-slot:thumb-label="data">
                            {{ set_first_time(data.value) }}
                          </template>
                        </v-slider>
                        <v-slider
                          v-model="time.timeend"
                          max="48"
                          min="0"
                          color="primary"
                          track-color="gray"
                          thumb-label="always"
                          :thumb-size="36"
                          hide-details
                          :disabled="time.value === 0"
                        >
                          <template v-slot:thumb-label="data">
                            {{ set_end_time(data.value) }}
                          </template>
                        </v-slider>
                      </div>
                    </v-col>
                  </v-row>
                </v-col>

                <v-col class="py-0" cols="11">
                  <div class="d-flex align-center">
                    <div class="fs-14 font-weight-bold mr-10">Bản đồ</div>
                    <v-switch
                      v-model="map"
                      class="ma-0"
                      color="#47bbff"
                      :true-value="1"
                      :false-value="0"
                      inset
                      hide-details
                    />
                  </div>
                  <v-row class="mt-2 ml-4">
                    <v-col
                      v-for="(service, i) in map_services"
                      :key="`${i}-${service.id}`"
                      cols="auto"
                    >
                      <v-checkbox
                        v-model="service.value"
                        class="ma-0 mr-12"
                        :label="service.name"
                        hide-details
                        :true-value="1"
                        :false-value="0"
                        :ripple="false"
                        :disabled="map === 0"
                      >
                      </v-checkbox>
                    </v-col>
                  </v-row>
                  <h3 ref="scroll_to_four" />
                </v-col>

                <v-col class="pb-0" cols="11">
                  <p class="ma-0 fs-14 font-weight-bold">
                    Thực đơn <span class="error--text ml-1">*</span>
                  </p>
                  <v-tabs v-model="tab4" background-color="#F5F7FE">
                    <v-tab
                      v-for="(language, index) in languages"
                      :key="`${index}-${language}`"
                      class="text-none"
                    >
                      {{ language.name }}
                    </v-tab>
                  </v-tabs>
                  <v-tabs-items
                    v-model="tab4"
                    style="background-color: #f5f7fe"
                  >
                    <v-tab-item
                      v-for="(language, index) in languages"
                      :key="`${index}-${language}`"
                    >
                      <vue-2-editor
                        id="vue-2-editor-fix-height-2"
                        @text-change="
                          set_value_editor($event, language, 'menu', 1)
                        "
                      />
                      <div
                        v-if="language.menu_msg.length !== 0"
                        class="v-messages theme--light error--text mt-1"
                        role="alert"
                      >
                        <div class="v-messages__wrapper">
                          <div class="v-messages__message">
                            Không được để trống
                          </div>
                        </div>
                      </div>
                    </v-tab-item>
                  </v-tabs-items>
                </v-col>

                <v-col class="pb-0" cols="11">
                  <div class="d-flex align-center">
                    <div class="fs-14 font-weight-bold mr-10">Đánh giá</div>
                    <v-switch
                      v-model="evaluate"
                      class="mt-5"
                      color="#47bbff"
                      :true-value="1"
                      :false-value="0"
                      inset
                    />
                  </div>
                </v-col>

                <v-col class="py-0" cols="11">
                  <div class="d-flex align-center">
                    <div class="fs-14 font-weight-bold mr-10">
                      Có thể bạn quan tâm
                    </div>
                    <v-switch
                      v-model="care"
                      class="mt-5"
                      color="#47bbff"
                      :true-value="1"
                      :false-value="0"
                      inset
                      @change="care === 0 ? (suggestion_msg = '') : ''"
                    />
                  </div>
                  <h3 ref="scroll_to_six" />
                </v-col>

                <suggestions
                  ref="suggestions_restaurant"
                  @set_data="set_suggestions"
                >
                  <span v-if="care === 1" class="error--text ml-1">*</span>
                </suggestions>
                <v-col cols="12" class="ml-2 mb-12">
                  <div
                    class="v-messages theme--light error--text mt-1"
                    role="alert"
                  >
                    <div class="v-messages__wrapper">
                      <div class="v-messages__message">
                        {{ suggestion_msg }}
                      </div>
                    </div>
                  </div>
                </v-col>
              </v-row>
            </div>
          </div>
        </v-tab-item>
      </v-tabs-items>
    </client-only>

    <yes-no-alert
      :open="open_reset"
      alert-msg="Bạn chắc chắn muốn đặt lại cấu hình trang?"
      @toggle="open_reset = !open_reset"
      @OK="set_again"
    />

    <yes-no-alert
      :open="$store.state.product.open_cancel"
      alert-msg="Bạn chắc chắn muốn hủy không?"
      @toggle="$store.commit('product/toggle_cancel')"
      @OK="toggle"
    />

    <yes-no-alert
      :open="$store.state.product.open_save"
      alert-msg="Bạn chắc chắn muốn lưu không?"
      @toggle="$store.commit('product/toggle_save')"
      @OK="save"
    />
  </div>
</template>

<script>
import Files from '~/components/Selected/Files'
import Suggestions from '~/components/Product/add/restaurant/suggestions/index'
import Services from '~/components/Product/add/restaurant/services/index'

export default {
  components: {
    Files,
    Suggestions,
    Services,
  },
  data: () => ({
    tabmenu: null,
    check: 0,
    hidden: 1,
    sku: '',
    tab: null,
    tab1: null,
    tab2: null,
    tab3: null,
    tab4: null,
    tab5: null,
    languages: [],
    lat: 21.028511,
    lng: 105.804817,
    enterprise: null,
    list_enterprise: [],
    phone: null,
    phone_msg: [],
    email: null,
    email_msg: [],
    category: [2],
    category_msg: [],
    list_category: [],
    status: 1,
    status_msg: [],
    list_status: [
      { value: 1, color: '#47BBFF', text: 'Đang hoạt động' },
      { value: 2, color: '#FF0F59', text: 'Dừng hoạt động' },
      { value: 3, color: '#F5972D', text: 'Hết bàn' },
    ],
    type: null,
    type_msg: [],
    list_type: [],
    type_dish: null,
    list_type_dish: [],
    type_dish_msg: [],
    map: 1,
    map_services: [],
    evaluate: 1,
    care: 1,
    price1: null,
    price1_msg: [],
    price2: null,
    price2_msg: [],
    currency: null,
    moneys: [],
    utilities: [],
    timeSetUp: [],
    files: [],
    files_msg: '',
    listsuggestion: [],
    suggestion_msg: '',
    open_reset: false,
    province: '',
    district: '',
    address: '',
    target: null,
    options: {
      duration: 500,
      offset: 100,
      easing: 'easeInOutCubic',
    },
    loading_review: false,
    use_ggmap: false,
  }),
  created() {
    this.$store.dispatch('product/restaurant_gen_sku').then((res) => {
      if (!res.error) {
        this.sku = res.data.data
      }
    })

    this.set_languages()
    this.set_currencies()
    this.set_map_services()
    this.get_service()
    this.set_time_default()
    this.set_restaurant_enterprise()
    this.set_restaurant_category()
    this.set_restaurant_dish_type()
    this.set_restaurant_type()
  },
  methods: {
    clicked_tab(value) {
      this.check = value
    },
    toggle() {
      this.$emit('toggle')
    },
    set_restaurant_enterprise() {
      this.$store.dispatch('product/hotel_enterprise').then((res) => {
        if (!res.error) {
          this.list_enterprise = res.data.data
        }
      })
    },
    set_restaurant_category() {
      // this.$store.dispatch('product/hotel_category').then((res) => {
      //   if (!res.error) {
      //     this.list_category = res.data.data
      //   }
      // })
      this.list_category = [{ id: 2, name: 'Nhà hàng' }]
    },
    set_restaurant_dish_type() {
      this.$store.dispatch('product/restaurant_dish_type').then((res) => {
        if (!res.error) {
          this.list_type_dish = res.data.data
        }
      })
    },
    set_restaurant_type() {
      this.$store.dispatch('product/restaurant_type').then((res) => {
        if (!res.error) {
          this.list_type = res.data.data
        }
      })
    },
    set_latlng(obj) {
      this.lat = obj.lat
      this.lng = obj.lng
    },
    set_address_to_map() {
      if (this.$store.state.app.use_ggmap) {
        const DATA = {
          latlng: `${this.lat},${this.lng}`,
          address: this.address,
        }
        this.$store.dispatch('app/get_address_to_ggmap', DATA).then((res) => {
          this.province = res.province
          this.district = res.district
          this.upload_cover_image()
        })
      } else {
        const DATA = {
          lat: this.lat,
          lon: this.lng,
          zoom: 18,
          format: 'jsonv2',
        }
        this.$store.dispatch('app/get_address_to_map', DATA).then((res) => {
          this.province = res.data.address.city
          this.district = res.data.address.city_district
          this.upload_cover_image()
        })
      }
    },
    set_value_editor(value, item, field, check) {
      item[field] = value
      if (check === 1) {
        item[`${field}_msg`] = []
      }
    },
    validate_email() {
      if ((this.email || '').trim().length !== 0) {
        if (!this.$isEmail(this.email)) {
          this.email_msg = 'Email không hợp lệ'
        } else {
          this.email_msg = ''
        }
      } else {
        this.email_msg = ''
      }
    },
    validate_phone() {
      if ((this.phone || '').trim().length !== 0) {
        const regex = /[0-9]/
        let count = 0

        for (let i = 0; i < this.phone.length; i++) {
          if (!regex.test(this.phone[i])) {
            count += 1
          }
        }

        if (count > 0) {
          this.phone_msg = 'Số điện thoại không hợp lệ'
        } else if (
          (this.phone || '').trim().length > 12 ||
          (this.phone || '').trim().length < 10
        ) {
          this.phone_msg = 'Số điện thoại không hợp lệ'
        } else {
          this.phone_msg = ''
        }
      } else {
        this.phone_msg = ''
      }
    },
    validate_price(field) {
      if (this.$isNullOrEmpty(this[field])) {
        this[`${field}_msg`] = 'Đơn vị không hợp lệ'
      } else if (this[field] < 0) {
        this[`${field}_msg`] = 'Đơn vị không hợp lệ'
      } else {
        this[`${field}_msg`] = ''
      }
    },
    validate_url(object) {
      if ((object.path || '').trim().length !== 0) {
        if (this.$isHasVietnamese(object.path) || object.path.includes(' ')) {
          object.path_msg = 'URL không hợp lệ'
        } else {
          object.path_msg = ''
        }
      }
    },
    set_languages() {
      const LANGUAGE = [...this.$store.state.app.languages]

      if ((LANGUAGE || []).length !== 0) {
        for (let i = 0; i < LANGUAGE.length; i++) {
          LANGUAGE[i] = {
            ...LANGUAGE[i],
            restaurant: '',
            restaurant_msg: [],
            address: '',
            address_msg: [],
            introduce: '',
            introduce_msg: [],
            describe: '',
            menu: '',
            menu_msg: [],
            path: '',
            path_msg: [],
          }
        }
      }
      this.languages = [...LANGUAGE]
    },
    set_currencies() {
      const currencies = [...this.$store.state.app.currencies]
      const arr = []
      for (let i = 0; i < currencies.length; i++) {
        arr.push({
          value: currencies[i].id,
          text: currencies[i].code,
        })
      }
      this.moneys = [...arr]
      this.currency = arr[0]
    },
    set_map_services() {
      this.$store
        .dispatch('category-product/list_around_location')
        .then((res) => {
          if (!res.error) {
            const arr = []
            if ((res.data.data || []).length !== 0) {
              for (let i = 0; i < res.data.data.length; i++) {
                arr[i] = { ...res.data.data[i], value: 0 }
              }
            }
            this.map_services = [...arr]
          }
        })
    },
    get_service() {
      this.$store
        .dispatch('product/hotel_convenient_services', {
          type: this.$store.state.app.product_type.restaurant,
        })
        .then((res) => {
          if (!res.error) {
            let arr = []
            if ((res.data.data || []).length !== 0) {
              arr = [...res.data.data]
              for (let i = 0; i < arr.length; i++) {
                for (let j = 0; j < arr[i].item.length; j++) {
                  arr[i].item[j] = {
                    id: arr[i].item[j].id,
                    name: arr[i].item[j].name,
                    enable: 1,
                    type: 1,
                  }
                }
              }
              this.utilities = [...arr]
            }
          }
        })
    },
    set_service(items) {
      this.utilities = [...items]
    },
    set_time_default() {
      this.timeSetUp = [
        {
          value: 1,
          label: 'Thứ hai',
          time: 'mo',
          timestart: 28,
          timeend: 44,
        },
        {
          value: 1,
          label: 'Thứ ba',
          time: 'tu',
          timestart: 28,
          timeend: 44,
        },
        {
          value: 1,
          label: 'Thứ tư',
          time: 'we',
          timestart: 28,
          timeend: 44,
        },
        {
          value: 1,
          label: 'Thứ năm',
          time: 'th',
          timestart: 28,
          timeend: 44,
        },
        {
          value: 1,
          label: 'Thứ sáu',
          time: 'fr',
          timestart: 28,
          timeend: 44,
        },
        {
          value: 0,
          label: 'Thứ bảy',
          time: 'sa',
          timestart: 28,
          timeend: 44,
        },
        {
          value: 0,
          label: 'Chủ nhật',
          time: 'su',
          timestart: 28,
          timeend: 44,
        },
      ]
    },
    set_first_time(value) {
      if (Math.floor(value / 4) < 1) {
        return value > 0 ? `00:${value * 15}` : '00:00'
      } else if (Math.floor(value / 4) < 10 && Math.floor(value / 4) >= 1) {
        return `0${Math.floor(value / 4)}:${
          Math.floor(value / 4) - Number(value / 4) < 0
            ? Math.floor(value / 4) < 1
              ? (value - 4) * 15
              : (value - Math.floor(value / 4) * 4) * 15
            : '00'
        }`
      } else {
        return `${Math.floor(value / 4)}:${
          Math.floor(value / 4) - Number(value / 4) < 0
            ? Math.floor(value / 4) < 1
              ? (value - 4) * 15
              : (value - Math.floor(value / 4) * 4) * 15
            : '00'
        }`
      }
    },
    set_end_time(value) {
      if (Math.floor(value / 4) < 1) {
        return value > 0 ? `12:${value * 15}` : '12:00'
      } else if (Math.floor(value / 4) < 10 && Math.floor(value / 4) >= 1) {
        return `${12 + Math.floor(value / 4)}:${
          Math.floor(value / 4) - Number(value / 4) < 0
            ? Math.floor(value / 4) < 1
              ? (value - 4) * 15
              : (value - Math.floor(value / 4) * 4) * 15
            : '00'
        }`
      } else {
        return `${12 + Math.floor(value / 4)}:${
          Math.floor(value / 4) - Number(value / 4) < 0
            ? Math.floor(value / 4) < 1
              ? (value - 4) * 15
              : (value - Math.floor(value / 4) * 4) * 15
            : '00'
        }`
      }
    },
    set_files(files) {
      this.files = files
      this.files_msg = ''
    },
    set_suggestions(items) {
      this.listsuggestion = items
      this.suggestion_msg = ''
    },
    set_again() {
      this.hidden = 1
      this.set_languages()
      this.lat = 21.028511
      this.lng = 105.804817
      this.category = [2]
      this.category_msg = []
      this.phone = null
      this.phone_msg = []
      this.email = null
      this.email_msg = []
      this.enterprise = null
      this.status = 1
      this.status_msg = []
      this.type = null
      this.type_msg = []
      this.type_dish = null
      this.type_dish_msg = []
      this.$refs.product_add_img_restaurant_room.reset()
      this.price1 = null
      this.price1_msg = []
      this.price2 = null
      this.price2_msg = []
      this.set_currencies()
      this.set_time_default()
      this.map = 1
      this.set_map_services()
      this.evaluate = 1
      this.care = 1
      this.$refs.suggestions_restaurant.reset()
      this.listsuggestion = []
      this.suggestion_msg = ''
      this.files = []
      this.files_msg = ''
      this.utilities = []
      this.currency = this.moneys[0]
      this.$refs.product_restaurant_add_services.get_data()
    },
    check_scroll(count, location) {
      if (count === 0) {
        this.target = this.$refs[location]
      }
    },
    save() {
      let hasErrors = false
      let count = 0
      let count1 = 0
      let count2 = 0

      for (let i = 0; i < this.languages.length; i++) {
        if ((this.languages[i].restaurant || '').trim().length === 0) {
          hasErrors = true
          this.languages[i].restaurant_msg = 'Không được để trống'
          this.tab = i
          count += 1
          this.check_scroll(count2, 'scroll_to_one')
          count2 += 1
        } else if (this.languages[i].restaurant.length > 500) {
          hasErrors = true
          this.languages[i].restaurant_msg = 'Không được vượt quá 500 ký tự'
          this.tab = i
          count += 1
          this.check_scroll(count2, 'scroll_to_one')
          count2 += 1
        }
        if ((this.languages[i].address || '').trim().length === 0) {
          hasErrors = true
          this.languages[i].address_msg = 'Không được để trống'
          this.tab1 = i
          count += 1
          this.check_scroll(count2, 'scroll_to_one')
          count2 += 1
        } else if (this.languages[i].address.length > 500) {
          hasErrors = true
          this.languages[i].address_msg = 'Không được vượt quá 500 ký tự'
          this.tab1 = i
          count += 1
          this.check_scroll(count2, 'scroll_to_one')
          count2 += 1
        }
        if ((this.languages[i].introduce || '').trim().length === 0) {
          hasErrors = true
          this.languages[i].introduce_msg = 'Không được để trống'
          this.tab2 = i
          count += 1
          this.check_scroll(count2, 'scroll_to_two')
          count2 += 1
        }
        if ((this.languages[i].menu || '').trim().length === 0) {
          hasErrors = true
          this.languages[i].menu_msg = 'Không được để trống'
          this.tab4 = i
          count += 1
          this.check_scroll(count2, 'scroll_to_four')
          count2 += 1
        }

        if ((this.languages[i].path || '').trim().length !== 0) {
          if (
            this.$isHasVietnamese(this.languages[i].path) ||
            this.languages[i].path.includes(' ')
          ) {
            hasErrors = true
            this.languages[i].path_msg = 'URL không hợp lệ'
            count1 += 1
          }
        }
      }

      if (count1 > 0) {
        this.$showWarnNotify(this, 'Định dạng url không hợp lệ')
      }

      if ((this.category || []).length === 0) {
        hasErrors = true
        this.category_msg = 'Không được để trống'
        count += 1
        this.check_scroll(count2, 'scroll_to_three')
        count2 += 1
      }

      if ((this.type || []).length === 0) {
        hasErrors = true
        this.type_msg = 'Không được để trống'
        count += 1
        this.check_scroll(count2, 'scroll_to_three')
        count2 += 1
      }

      if ((this.type_dish || []).length === 0) {
        hasErrors = true
        this.type_dish_msg = 'Không được để trống'
        count += 1
        this.check_scroll(count2, 'scroll_to_three')
        count2 += 1
      }

      if ((this.files || []).length === 0) {
        hasErrors = true
        this.files_msg = 'Không được để trống'
        count += 1
        this.check_scroll(count2, 'scroll_to_three')
        count2 += 1
      }

      if ((this.price1 || []).length === 0) {
        hasErrors = true
        this.price1_msg = 'Không được để trống'
        count += 1
        this.check_scroll(count2, 'scroll_to_three')
        count2 += 1
      } else if (this.price1 < 0) {
        hasErrors = true
        this.price1_msg = 'Đơn vị không hợp lệ'
        count += 1
        this.check_scroll(count2, 'scroll_to_three')
        count2 += 1
      }

      if ((this.price2 || []).length === 0) {
        hasErrors = true
        this.price2_msg = 'Không được để trống'
        count += 1
        this.check_scroll(count2, 'scroll_to_three')
        count2 += 1
      } else if (this.price2 < this.price1) {
        hasErrors = true
        this.price2_msg = 'Giá tiền không hợp lệ'
        count += 1
        this.check_scroll(count2, 'scroll_to_three')
        count2 += 1
      } else if (this.price2 < 0) {
        hasErrors = true
        this.price2_msg = 'Đơn vị không hợp lệ'
        count += 1
        this.check_scroll(count2, 'scroll_to_three')
        count2 += 1
      }

      if ((this.listsuggestion || []).length === 0 && this.care === 1) {
        hasErrors = true
        this.suggestion_msg = 'Không được để trống'
        count += 1
        this.check_scroll(count2, 'scroll_to_six')
        count2 += 1
      }

      if ((this.phone || '').trim().length !== 0) {
        const regex = /[0-9]/
        let count3 = 0

        for (let i = 0; i < this.phone.length; i++) {
          if (!regex.test(this.phone[i])) {
            count3 += 1
          }
        }

        if (count3 > 0) {
          hasErrors = true
          this.phone_msg = 'Số điện thoại không hợp lệ'
        } else if (
          (this.phone || '').trim().length > 12 ||
          (this.phone || '').trim().length < 10
        ) {
          hasErrors = true
          this.phone_msg = 'Số điện thoại không hợp lệ'
        }
      }

      if (count > 0) {
        this.$showWarnNotify(this, 'Bạn nhập thiếu thông tin bắt buộc')
      }

      if (count2 > 0) {
        this.$vuetify.goTo(this.target, this.options)
      }

      if (!hasErrors) {
        this.set_address_to_map()
      }
    },
    upload_cover_image(check) {
      const folder = 'restaurant-product-cover-img'
      const formData = new FormData()
      for (let i = 0; i < this.files.length; i++) {
        formData.append('file', this.files[i].file)
      }
      this.$store
        .dispatch('uploadImg/uploadFile', { folder, formData })
        .then((res) => {
          if (!res.error) {
            if ((res.data.data.image_url || '').length !== 0) {
              const arrImg = res.data.data.image_url.split(';')
              const arr = []
              for (let i = 0; i < arrImg.length; i++) {
                arr.push({
                  url: arrImg[i],
                  type: 1,
                })
              }
              if (check !== 1) {
                this.insert(arr)
              } else {
                this.get_review(arr)
              }
            }
          }
        })
    },
    insert(images) {
      const langs = []
      const aroundLocations = []
      const suggestionList = []
      let openingTime = {}

      for (let i = 0; i < this.map_services.length; i++) {
        if (this.map_services[i].value === 1) {
          aroundLocations.push(this.map_services[i].id)
        }
      }

      for (let i = 0; i < this.languages.length; i++) {
        langs.push({
          name: (this.languages[i].restaurant || '').trim(),
          address: (this.languages[i].address || '').trim(),
          sub_title: this.languages[i].describe,
          introduce: (this.languages[i].introduce || '').trim(),
          lang_id: this.languages[i].id,
          url_seo: (this.languages[i].path || '').trim(),
          menu: (this.languages[i].menu || '').trim(),
          services:
            (this.utilities[i] || '').length !== 0
              ? [...this.utilities[i].item]
              : [],
        })
      }

      for (let i = 0; i < this.listsuggestion.length; i++) {
        suggestionList.push({
          id: this.listsuggestion[i].id,
          type: this.listsuggestion[i].product_type,
        })
      }

      openingTime = {
        [this.timeSetUp[0].time]: `${this.set_first_time(
          this.timeSetUp[0].timestart
        )}|${this.set_end_time(this.timeSetUp[0].timeend)}`,
        [this.timeSetUp[1].time]: `${this.set_first_time(
          this.timeSetUp[1].timestart
        )}|${this.set_end_time(this.timeSetUp[1].timeend)}`,
        [this.timeSetUp[2].time]: `${this.set_first_time(
          this.timeSetUp[2].timestart
        )}|${this.set_end_time(this.timeSetUp[2].timeend)}`,
        [this.timeSetUp[3].time]: `${this.set_first_time(
          this.timeSetUp[3].timestart
        )}|${this.set_end_time(this.timeSetUp[3].timeend)}`,
        [this.timeSetUp[4].time]: `${this.set_first_time(
          this.timeSetUp[4].timestart
        )}|${this.set_end_time(this.timeSetUp[4].timeend)}`,
        [this.timeSetUp[5].time]: `${this.set_first_time(
          this.timeSetUp[5].timestart
        )}|${this.set_end_time(this.timeSetUp[5].timeend)}`,
        [this.timeSetUp[6].time]: `${this.set_first_time(
          this.timeSetUp[6].timestart
        )}|${this.set_end_time(this.timeSetUp[6].timeend)}`,
      }

      const DATA = {
        sku: this.sku,
        enable: this.hidden,
        lon: this.lng,
        lat: this.lat,
        province: this.province,
        district: this.district,
        enterprise_id: this.enterprise,
        phone: this.phone,
        email: this.email,
        product_category_ids: this.category,
        status: this.status,
        dish_type: this.type_dish,
        type: this.type,
        from_price: parseInt(this.price1),
        to_price: parseInt(this.price2),
        currency_id: this.currency.value,
        map: this.map,
        aroundLocations,
        ranking: this.evaluate,
        rating: 1,
        suggest: this.care,
        images,
        suggestionList,
        langs,
        openingTime,
      }

      this.$store.dispatch('product/restaurant_add', DATA).then((res) => {
        if (!res.error) {
          this.$showSuccess(this, 'Thêm sản phẩm thành công')
          this.$emit('save')
        }
      })
    },
    copy_text(elementId) {
      // Create a "hidden" input
      const aux = document.createElement('input')

      // Assign it the value of the specified element
      const str = document.getElementById(elementId).innerHTML
      aux.setAttribute('value', (str || '').trim())

      // Append it to the body
      document.body.appendChild(aux)

      // Highlight its content
      aux.select()

      // Copy the highlighted text
      document.execCommand('copy')

      // Remove it from the body
      document.body.removeChild(aux)
    },
    check_review() {
      if (this.files.length !== 0) {
        this.upload_cover_image(1)
      } else {
        this.get_review([])
      }
    },
    get_review(images) {
      this.loading_review = true

      const langs = []
      const aroundLocations = []
      const suggestionList = []
      let openingTime = {}

      for (let i = 0; i < this.map_services.length; i++) {
        if (this.map_services[i].value === 1) {
          aroundLocations.push(this.map_services[i].id)
        }
      }

      for (let i = 0; i < this.languages.length; i++) {
        langs.push({
          name: (this.languages[i].restaurant || '').trim(),
          address: (this.languages[i].address || '').trim(),
          sub_title: this.languages[i].describe,
          introduce: (this.languages[i].introduce || '').trim(),
          lang_id: this.languages[i].id,
          url_seo: (this.languages[i].path || '').trim(),
          menu: (this.languages[i].menu || '').trim(),
          services:
            (this.utilities[i] || '').length !== 0
              ? [...this.utilities[i].item]
              : [],
        })
      }

      for (let i = 0; i < this.listsuggestion.length; i++) {
        suggestionList.push({
          id: this.listsuggestion[i].id,
          type: this.listsuggestion[i].product_type,
        })
      }

      openingTime = {
        [this.timeSetUp[0].time]: `${this.set_first_time(
          this.timeSetUp[0].timestart
        )}|${this.set_end_time(this.timeSetUp[0].timeend)}`,
        [this.timeSetUp[1].time]: `${this.set_first_time(
          this.timeSetUp[1].timestart
        )}|${this.set_end_time(this.timeSetUp[1].timeend)}`,
        [this.timeSetUp[2].time]: `${this.set_first_time(
          this.timeSetUp[2].timestart
        )}|${this.set_end_time(this.timeSetUp[2].timeend)}`,
        [this.timeSetUp[3].time]: `${this.set_first_time(
          this.timeSetUp[3].timestart
        )}|${this.set_end_time(this.timeSetUp[3].timeend)}`,
        [this.timeSetUp[4].time]: `${this.set_first_time(
          this.timeSetUp[4].timestart
        )}|${this.set_end_time(this.timeSetUp[4].timeend)}`,
        [this.timeSetUp[5].time]: `${this.set_first_time(
          this.timeSetUp[5].timestart
        )}|${this.set_end_time(this.timeSetUp[5].timeend)}`,
        [this.timeSetUp[6].time]: `${this.set_first_time(
          this.timeSetUp[6].timestart
        )}|${this.set_end_time(this.timeSetUp[6].timeend)}`,
      }

      const DATA = {
        sku: this.sku,
        enable: this.hidden,
        lon: this.lng,
        lat: this.lat,
        province: this.province,
        district: this.district,
        enterprise_id: this.enterprise,
        phone: this.phone,
        email: this.email,
        product_category_ids: this.category,
        status: this.status,
        dish_type: this.type_dish,
        type: this.type,
        from_price: parseInt(this.price1),
        to_price: parseInt(this.price2),
        currency_id: this.currency.value,
        map: this.map,
        aroundLocations,
        ranking: this.evaluate,
        rating: 1,
        suggest: this.care,
        images,
        suggestionList,
        langs,
        openingTime,
      }

      this.$store
        .dispatch('product/review_restaurant', DATA)
        .then((res) => {
          if (!res.error) {
            // this.$log.debug(res.data.data)
            window.open(res.data.data)
          }
        })
        .finally(() => {
          this.loading_review = false
        })
    },
  },
}
</script>

<style lang="scss">
.add-product-restaurant-info {
  /* .fix-height {
  max-height: calc(100vh - 240px);
  overflow-x: hidden;
  overflow-y: auto;
} */

  .v-slider--horizontal {
    margin: 0 !important;
  }
}
</style>
