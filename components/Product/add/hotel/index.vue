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
        <v-tabs-slider color="primary" />
        <v-tab
          :class="
            (tabmenu !== 0 && 'black--text') +
            ' text-none letter-spacing-normal fs-17 font-weight-bold'
          "
          @click="clicked_tab(1)"
        >
          Thông tin cơ bản
        </v-tab>

        <v-tab
          :class="
            (tabmenu !== 1 && 'black--text') +
            ' text-none letter-spacing-normal fs-17 font-weight-bold'
          "
          @click="clicked_tab(2)"
        >
          Phòng nghỉ
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="tabmenu" style="background-color: #f5f7fe">
        <v-tab-item>
          <div class="add-product-hotel-info mt-16">
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
                  </div>
                  <h3 ref="scroll_to_one" />
                </v-col>
                <v-col class="pb-0" cols="11">
                  <p class="ma-0 fs-14 font-weight-bold">
                    Tên chỗ nghỉ <span class="error--text ml-1">*</span>
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
                        v-model="language.resort"
                        :error-messages="language.resort_msg"
                        placeholder="Nhập tiêu đề"
                        class="border-1 fs-14"
                        solo
                        flat
                        dense
                        @input="language.resort_msg = []"
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
                <v-col class="pb-0" cols="11">
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
                    <v-col cols="4">
                      <p class="my-2 fs-14 font-weight-bold">Doanh nghiệp</p>
                      <div class="pa-0">
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
                      </div>
                    </v-col>
                    <v-col cols="4">
                      <p class="my-2 fs-14 font-weight-bold">Số điện thoại</p>
                      <div class="pa-0">
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
                      </div>
                    </v-col>
                    <v-col cols="4">
                      <p class="my-2 fs-14 font-weight-bold">Email</p>
                      <div class="pa-0">
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
                      </div>
                    </v-col>
                  </v-row>
                  <h3 ref="scroll_to_four" />
                </v-col>

                <v-col class="pb-0" cols="11">
                  <v-row>
                    <v-col cols="4">
                      <p class="mb-2 fs-14 font-weight-bold">
                        Danh mục sản phẩm<span class="error--text ml-1">*</span>
                      </p>
                      <div class="pa-0">
                        <v-autocomplete
                          v-model="category"
                          :items="list_category"
                          :menu-props="{ zIndex: '1' }"
                          item-value="id"
                          item-text="name"
                          :error-messages="category_msg"
                          class="border-1 fs-14"
                          solo
                          flat
                          dense
                          multiple
                          @input="category_msg = []"
                        >
                        </v-autocomplete>
                      </div>
                    </v-col>
                    <v-col cols="4">
                      <p class="mb-2 fs-14 font-weight-bold">
                        Trạng thái <span class="error--text ml-1">*</span>
                      </p>
                      <div class="pa-0">
                        <v-select
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
                        </v-select>
                      </div>
                    </v-col>
                    <v-col cols="4">
                      <p class="mb-2 fs-14 font-weight-bold">
                        Loại hình <span class="error--text ml-1">*</span>
                      </p>
                      <div class="pa-0">
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
                      </div>
                    </v-col>
                  </v-row>
                </v-col>

                <v-col class="py-0" cols="11">
                  <Services
                    ref="product_hotel_add_services"
                    @setData="set_service"
                  />
                </v-col>

                <v-col class="py-0" cols="11">
                  <p class="ma-0 fs-14 font-weight-bold">
                    {{ `Xếp hạng:  ${rating}/5` }}
                  </p>
                  <v-rating
                    v-model="rating"
                    size="33"
                    empty-icon="mdi-star-outline"
                    color="yellow darken-3"
                    background-color="darken-1"
                    hover
                  />
                  <h3 ref="scroll_to_three" />
                </v-col>

                <v-col class="pb-0" cols="11">
                  <p class="ma-0 fs-14 font-weight-bold">
                    Ảnh bìa <span class="error--text ml-1">*</span>
                  </p>
                  <div class="pa-0">
                    <Files
                      id="product-add-img-hotel-room"
                      ref="product_add_img_hotel_room"
                      :maxrequied="30"
                      :errormsg="files_msg"
                      @set_file="set_files"
                    />
                  </div>
                </v-col>

                <v-col class="py-0" cols="11">
                  <p class="ma-0 fs-14 font-weight-bold">
                    URL thân thiện cho SEO
                  </p>
                  <v-tabs v-model="tab6" background-color="#F5F7FE">
                    <v-tab
                      v-for="(language, index) in languages"
                      :key="`${index}-${language}`"
                      class="text-none"
                    >
                      {{ language.name }}
                    </v-tab>
                  </v-tabs>
                  <v-tabs-items
                    v-model="tab6"
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
                          class="border-1 rounded-r-0 fs-14"
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

                <v-col class="py-0" cols="11">
                  <v-row>
                    <v-col cols="4">
                      <p class="ma-0 fs-14 font-weight-bold">Số tầng</p>
                      <div class="d-flex">
                        <v-btn
                          small
                          depressed
                          height="38"
                          color="#fff"
                          class="rounded-r-0"
                          style="border-right: 1px solid #ececec"
                          @click="minus"
                        >
                          <v-icon color="#47BBFF" small>mdi-minus</v-icon>
                        </v-btn>
                        <div
                          class="d-flex justify-center align-center"
                          style="min-width: 80px; background-color: #fff"
                        >
                          {{ floors }}
                        </div>
                        <v-btn
                          small
                          depressed
                          height="38"
                          color="#fff"
                          class="rounded-l-0"
                          style="border-left: 1px solid #ececec"
                          @click="plus"
                        >
                          <v-icon color="#47BBFF" small>mdi-plus</v-icon>
                        </v-btn>
                      </div>
                    </v-col>
                    <v-col cols="4">
                      <p class="ma-0 fs-14 font-weight-bold">
                        Giờ check-in <span class="error--text ml-1">*</span>
                      </p>
                      <v-text-field
                        v-model="time_checkin"
                        type="time"
                        placeholder="HH:mm:ss"
                        class="border-1"
                        style="max-width: 160px"
                        solo
                        flat
                        dense
                        hide-details
                      >
                      </v-text-field>
                    </v-col>
                    <v-col cols="4">
                      <p class="ma-0 fs-14 font-weight-bold">
                        Giờ check-out <span class="error--text ml-1">*</span>
                      </p>
                      <v-text-field
                        v-model="time_checkout"
                        type="time"
                        placeholder="HH:mm:ss"
                        class="border-1"
                        style="max-width: 160px"
                        solo
                        flat
                        dense
                        hide-details
                      >
                      </v-text-field>
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
                </v-col>

                <v-col class="py-0" cols="11">
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
                  <h3 ref="scroll_to_five" />
                </v-col>

                <suggestions
                  ref="suggestions_hotel"
                  @set_data="set_suggestions"
                >
                  <span v-if="care === 1" class="error--text ml-1">*</span>
                </suggestions>
                <v-col cols="12" class="ml-2">
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

                <v-col class="pb-0" cols="11">
                  <p class="ma-0 fs-14 font-weight-bold">
                    Chính sách hủy phòng
                  </p>
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
                      <vue-2-editor
                        id="vue-2-editor-fix-height-2"
                        @text-change="
                          set_value_editor($event, language, 'policy', 0)
                        "
                      />
                    </v-tab-item>
                  </v-tabs-items>
                </v-col>

                <v-col class="pb-16" cols="11">
                  <p class="ma-0 mt-2 fs-14 font-weight-bold">
                    Lưu ý đặt phòng
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
                        id="vue-2-editor-fix-height-3"
                        @text-change="
                          set_value_editor($event, language, 'note', 0)
                        "
                      />
                    </v-tab-item>
                  </v-tabs-items>
                </v-col>
              </v-row>
            </div>
          </div>
        </v-tab-item>

        <v-tab-item :eager="true">
          <div class="add-product-hotel-info my-16">
            <div>
              <v-row class="ml-10">
                <v-col cols="11">
                  <RoomServices
                    ref="product_hotel_add_room_services"
                    @setData="set_room_service"
                  />
                </v-col>

                <v-col cols="11">
                  <room-list
                    ref="product_hotel_add_room"
                    @save="set_room_info"
                  />
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

import RoomList from '~/components/Product/add/hotel/room/list'
import Suggestions from '~/components/Product/add/hotel/suggestions/index'
import Services from '~/components/Product/add/hotel/services/index'
import RoomServices from '~/components/Product/add/hotel/roomservices/index'

export default {
  components: {
    Files,
    Suggestions,
    RoomList,
    Services,
    RoomServices,
  },
  data: () => ({
    tabmenu: null,
    check: 0,
    // thông tin cơ bản
    hidden: 1,
    sku: '',
    tab: null,
    tab1: null,
    tab2: null,
    tab3: null,
    tab4: null,
    tab5: null,
    tab6: null,
    languages: [],
    lat: 21.028511,
    lng: 105.804817,
    enterprise: null,
    list_enterprise: [],
    phone: null,
    phone_msg: [],
    email: null,
    email_msg: [],
    category: [1],
    category_msg: [],
    list_category: [],
    utilities: [],
    utilities2: [],
    status: 1,
    status_msg: [],
    list_status: [
      { value: 1, color: '#47BBFF', text: 'Đang hoạt động' },
      { value: 2, color: '#FF0F59', text: 'Dừng hoạt động' },
    ],
    type: null,
    type_msg: [],
    list_type: [],
    rating: 4,
    floors: 1,
    time_checkin: '06:30:30',
    time_checkout: '20:30:30',
    map: 1,
    map_services: [],
    evaluate: 1,
    care: 1,
    // phòng nghỉ
    listsuggestion: [],
    suggestion_msg: '',
    open_reset: false,
    room_list: [],
    list_files: [],
    files_msg: '',
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
  }),
  created() {
    this.$store.dispatch('product/hotel_gen_sku').then((res) => {
      if (!res.error) {
        this.sku = res.data.data
      }
    })

    this.$store
      .dispatch('product/hotel_convenient_services', {
        type: this.$store.state.app.product_type.hotel,
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

    this.$store.dispatch('product/hotel_rest_room_services').then((res) => {
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
          this.utilities2 = [...arr]
        }
      }
    })

    const LANGUAGE = [...this.$store.state.app.languages]

    if ((LANGUAGE || []).length !== 0) {
      for (let i = 0; i < LANGUAGE.length; i++) {
        LANGUAGE[i] = {
          ...LANGUAGE[i],
          resort: '',
          resort_msg: [],
          address: '',
          address_msg: [],
          introduce: '',
          introduce_msg: [],
          policy: '',
          note: '',
          describe: '',
          path: '',
          path_msg: [],
        }
      }
    }
    this.languages = [...LANGUAGE]

    this.$store.dispatch('product/hotel_type').then((res) => {
      if (!res.error) {
        this.list_type = res.data.data
      }
    })

    // this.$store.dispatch('product/hotel_category').then((res) => {
    //   if (!res.error) {
    //     this.list_category = res.data.data
    //   }
    // })
    this.list_category = [{ id: 1, name: 'Khách sạn' }]

    this.$store.dispatch('product/hotel_enterprise').then((res) => {
      if (!res.error) {
        this.list_enterprise = res.data.data
      }
    })
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
  methods: {
    clicked_tab(value) {
      this.check = value
    },
    toggle() {
      this.$emit('toggle')
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
    validate_url(object) {
      if ((object.path || '').trim().length !== 0) {
        if (this.$isHasVietnamese(object.path) || object.path.includes(' ')) {
          object.path_msg = 'URL không hợp lệ'
        } else {
          object.path_msg = ''
        }
      }
    },
    plus() {
      this.floors += 1
    },
    minus() {
      if (this.floors !== 1) {
        this.floors -= 1
      }
    },
    set_suggestions(items) {
      this.listsuggestion = items
      this.suggestion_msg = ''
    },
    set_room_info(arr) {
      this.room_list = [...arr]
    },
    set_files(files) {
      this.files_msg = ''
      this.list_files = files
    },
    set_service(items) {
      this.utilities = [...items]
    },
    set_room_service(items) {
      this.utilities2 = [...items]
    },
    set_again() {
      const LANGUAGE = [...this.$store.state.app.languages]

      if ((LANGUAGE || []).length !== 0) {
        for (let i = 0; i < LANGUAGE.length; i++) {
          LANGUAGE[i] = {
            ...LANGUAGE[i],
            resort: '',
            resort_msg: [],
            address: '',
            address_msg: [],
            introduce: '',
            introduce_msg: [],
            policy: '',
            note: '',
            describe: '',
            path: '',
            path_msg: [],
          }
        }
      }
      this.languages = [...LANGUAGE]

      this.hidden = 1
      this.tab = null
      this.tab1 = null
      this.tab2 = null
      this.tab3 = null
      this.tab4 = null
      this.tab5 = null
      this.tab6 = null
      this.lat = 21.028511
      this.lng = 105.804817
      this.enterprise = null
      this.phone = null
      this.phone_msg = []
      this.email = null
      this.email_msg = []
      this.category = [1]
      this.category_msg = []
      this.$refs.product_hotel_add_services.get_data()
      this.$refs.product_hotel_add_room_services.get_data()
      this.$refs.product_hotel_add_room.reset()
      this.status = 1
      this.type = null
      this.type_msg = []
      this.rating = 4
      this.floors = 1
      this.time_checkin = '06:30:30'
      this.time_checkout = '20:30:30'
      this.map = 1
      this.$refs.product_add_img_hotel_room.reset()
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
      this.evaluate = 1
      this.care = 1
      this.$refs.suggestions_hotel.reset()
      this.listsuggestion = []
      this.suggestion_msg = ''
      this.room_list = []
      this.list_files = []
      this.files_msg = ''
      this.utilities = []
      this.utilities2 = []
    },
    upload_cover_image(check) {
      const folder = 'hotel-product-cover-img'
      const formData = new FormData()
      for (let i = 0; i < this.list_files.length; i++) {
        formData.append('file', this.list_files[i].file)
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
    insert(backgroundImages) {
      const langs = []
      const aroundLocationIds = []
      const suggestions = []

      for (let i = 0; i < this.languages.length; i++) {
        langs.push({
          name: (this.languages[i].resort || '').trim(),
          address: (this.languages[i].address || '').trim(),
          sub_title: this.languages[i].describe,
          introduce: (this.languages[i].introduce || '').trim(),
          cancel_policy: this.languages[i].policy,
          note: (this.languages[i].note || '').trim(),
          lang_id: this.languages[i].id,
          url_seo: (this.languages[i].path || '').trim(),
          services:
            (this.utilities[i] || '').length !== 0
              ? [...this.utilities[i].item]
              : [],
          rest_room_services:
            (this.utilities2[i] || '').length !== 0
              ? [...this.utilities2[i].item]
              : [],
        })
      }

      for (let i = 0; i < this.map_services.length; i++) {
        if (this.map_services[i].value === 1) {
          aroundLocationIds.push(this.map_services[i].id)
        }
      }

      for (let i = 0; i < this.listsuggestion.length; i++) {
        suggestions.push({
          id: this.listsuggestion[i].id,
          type: this.listsuggestion[i].product_type,
        })
      }

      const DATA = {
        sku: this.sku,
        enable: this.hidden,
        langs,
        lon: this.lng,
        lat: this.lat,
        province: this.province,
        district: this.district,
        enterprise: this.enterprise,
        contact_phone: this.phone,
        contact_email: this.email,
        product_category_ids: this.category,
        status: this.status,
        hotel_type_id: this.type,
        ranking: this.rating,
        number_of_floor: this.floors,
        checkin_time: this.time_checkin,
        checkout_time: this.time_checkout,
        map: this.map,
        around_location_ids: aroundLocationIds,
        enable_rating: this.evaluate,
        enable_suggestion: this.care,
        restRooms: [...this.room_list],
        background_images: backgroundImages,
        suggestions,
      }

      this.$store.dispatch('product/add_hotel', DATA).then((res) => {
        if (!res.error) {
          this.$showSuccess(this, 'Thêm sản phẩm thành công')
          this.$emit('save')
        }
      })
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
        if ((this.languages[i].resort || '').trim().length === 0) {
          hasErrors = true
          this.languages[i].resort_msg = 'Không được để trống'
          this.tab = i
          count += 1
          this.check_scroll(count2, 'scroll_to_one')
          count2 += 1
        } else if (this.languages[i].resort.length > 500) {
          hasErrors = true
          this.languages[i].resort_msg = 'Không được vượt quá 500 ký tự'
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
          count += 1
          this.tab2 = i
          this.check_scroll(count2, 'scroll_to_two')
          count2 += 1
        }

        if ((this.languages[i].path || '').trim().length !== 0) {
          if (
            this.$isHasVietnamese(this.languages[i].path) ||
            this.languages[i].path.includes(' ')
          ) {
            count1 += 1
            hasErrors = true
            this.languages[i].path_msg = 'URL không hợp lệ'
            this.check_scroll(count2, 'scroll_to_three')
            count2 += 1
          }
        }
      }

      if (count1 > 0) {
        this.$showWarnNotify(this, 'Định dạng url không hợp lệ')
      }

      if (this.$isNullOrEmpty(this.category)) {
        hasErrors = true
        this.category_msg = 'Không được để trống'
        count += 1
        this.check_scroll(count2, 'scroll_to_two')
        count2 += 1
      }

      if (this.$isNullOrEmpty(this.type)) {
        hasErrors = true
        this.type_msg = 'Không được để trống'
        count += 1
        this.check_scroll(count2, 'scroll_to_four')
        count2 += 1
      }

      if ((this.list_files || []).length === 0) {
        hasErrors = true
        this.files_msg = 'Không được để trống'
        count += 1
        this.check_scroll(count2, 'scroll_to_three')
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

      if ((this.listsuggestion || []).length === 0 && this.care === 1) {
        hasErrors = true
        this.suggestion_msg = 'Không được để trống'
        count += 1
        this.check_scroll(count2, 'scroll_to_five')
        count2 += 1
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
    check_review() {
      if (this.list_files.length !== 0) {
        this.upload_cover_image(1)
      } else {
        this.get_review([])
      }
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
    get_review(backgroundImages) {
      this.loading_review = true
      const langs = []
      const aroundLocationIds = []
      const suggestions = []

      for (let i = 0; i < this.languages.length; i++) {
        langs.push({
          name: (this.languages[i].resort || '').trim(),
          address: (this.languages[i].address || '').trim(),
          sub_title: this.languages[i].describe,
          introduce: (this.languages[i].introduce || '').trim(),
          cancel_policy: this.languages[i].policy,
          note: (this.languages[i].note || '').trim(),
          lang_id: this.languages[i].id,
          url_seo: (this.languages[i].path || '').trim(),
          services:
            (this.utilities[i] || '').length !== 0
              ? [...this.utilities[i].item]
              : [],
          rest_room_services:
            (this.utilities2[i] || '').length !== 0
              ? [...this.utilities2[i].item]
              : [],
        })
      }

      for (let i = 0; i < this.map_services.length; i++) {
        if (this.map_services[i].value === 1) {
          aroundLocationIds.push(this.map_services[i].id)
        }
      }

      for (let i = 0; i < this.listsuggestion.length; i++) {
        suggestions.push({
          id: this.listsuggestion[i].id,
          type: this.listsuggestion[i].product_type,
        })
      }

      const DATA = {
        sku: this.sku,
        enable: this.hidden,
        langs,
        lon: this.lng,
        lat: this.lat,
        province: this.province,
        district: this.district,
        enterprise: this.enterprise,
        contact_phone: this.phone,
        contact_email: this.email,
        product_category_ids: this.category,
        status: this.status,
        hotel_type_id: this.type,
        ranking: this.rating,
        number_of_floor: this.floors,
        checkin_time: this.time_checkin,
        checkout_time: this.time_checkout,
        map: this.map,
        around_location_ids: aroundLocationIds,
        enable_rating: this.evaluate,
        enable_suggestion: this.care,
        restRooms: [...this.room_list],
        background_images: backgroundImages,
        suggestions,
      }
      this.$store
        .dispatch('product/review_hotel', DATA)
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

<style lang="scss" scoped>
.add-product-hotel-info {
  .fix-height {
    /* max-height: calc(100vh - 240px);
    overflow-x: hidden;
   overflow-y: auto; */
  }
}
</style>
