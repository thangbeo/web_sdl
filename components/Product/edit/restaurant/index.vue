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
          class="text-none mr-3"
          color="#47BBFF"
          dark
          depressed
          width="120px"
          @click="open_copy = true"
        >
          <img class="mr-1" src="~/assets/icon/copy.png" />
          Nhân bản
        </v-btn>
        <v-btn
          v-if="!uncorrected"
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
        v-if="!uncorrected"
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
          @click="open_save = true"
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
          <div class="edit-product-restaurant-info mt-16">
            <div class="fix-height">
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
                      :readonly="uncorrected"
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
                        class="border-1"
                        solo
                        flat
                        dense
                        :readonly="uncorrected"
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
                        class="border-1"
                        solo
                        flat
                        dense
                        :readonly="uncorrected"
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
                        class="border-1"
                        solo
                        flat
                        dense
                        :readonly="uncorrected"
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
                        :data="language.introduce"
                        :disabled="uncorrected"
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
                        :clearable="!uncorrected"
                        :readonly="uncorrected"
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
                        solo
                        flat
                        dense
                        :readonly="uncorrected"
                        @input="validate_phone"
                      />
                    </v-col>
                    <v-col cols="4" class="py-0">
                      <p class="my-2 fs-14 font-weight-bold">Email</p>
                      <v-text-field
                        v-model="email"
                        :error-messages="email_msg"
                        placeholder="Email"
                        solo
                        flat
                        dense
                        :readonly="uncorrected"
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
                        :readonly="uncorrected"
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
                        :readonly="uncorrected"
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
                        :readonly="uncorrected"
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
                        :readonly="uncorrected"
                        @input="status_msg = []"
                      >
                        <template v-slot:selection="data_status">
                          <div :style="`color: ${data_status.item.color}`">
                            {{ data_status.item.text }}
                          </div>
                        </template>
                        <template v-slot:item="data_status">
                          <div
                            :style="`color: ${data_status.item.color} !important`"
                            class="fs-13"
                          >
                            {{ data_status.item.text }}
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
                          class="rounded-l-0"
                          solo
                          flat
                          dense
                          :readonly="uncorrected"
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
                          class="rounded-r-0 mb-7"
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
                          class="rounded-l-0"
                          solo
                          flat
                          dense
                          :readonly="uncorrected"
                          @input="validate_price('price2')"
                        />
                      </div>
                    </v-col>
                  </v-row>
                </v-col>

                <v-col class="pb-0" cols="11">
                  <Services
                    ref="product_restaurant_edit_services"
                    :set-data="languages"
                    :readonly="uncorrected"
                    @setData="set_service"
                  />
                </v-col>

                <v-col class="pb-0" cols="11">
                  <p class="mb-2 fs-14 font-weight-bold">
                    Ảnh bìa <span class="error--text ml-1">*</span>
                  </p>
                  <div>
                    <v-card
                      outlined
                      height="150"
                      style="overflow-y: auto; background-color: #f5f7fe"
                      class="d-flex align-center"
                    >
                      <div
                        v-if="images.length < maxrequied"
                        class="d-flex justify-center"
                        style="margin-top: 6px"
                      >
                        <div
                          class="ml-2"
                          style="cursor: pointer"
                          @click="select_file"
                        >
                          <select-file />
                        </div>
                      </div>
                      <slot />
                      <draggable
                        :list="images"
                        class="d-flex justify-center"
                        @change="move_file"
                      >
                        <template v-for="(image, idx) in images">
                          <div :key="`${idx}+${image}`">
                            <v-img
                              :src="image.img"
                              style="cursor: move"
                              class="ml-2"
                              height="120"
                              width="120"
                            >
                            </v-img>
                            <v-icon
                              v-if="!uncorrected"
                              style="
                                cursor: pointer;
                                position: absolute;
                                top: 14px;
                                margin-left: 109px;
                              "
                              size="20"
                              color="error"
                              @click="confirm_delete(idx)"
                            >
                              mdi-close-circle
                            </v-icon>
                          </div>
                        </template>
                      </draggable>
                    </v-card>

                    <div
                      class="v-messages theme--light error--text mt-1 ml-2"
                      role="alert"
                    >
                      <div class="v-messages__wrapper">
                        <div class="v-messages__message">
                          {{ error_msg }}
                        </div>
                      </div>
                    </div>
                    <v-file-input
                      id="product-add-restaurant-room"
                      :value="reset_file"
                      multiple
                      accept="image/png, image/jpeg, image/gif"
                      class="d-none"
                      @change="inputFile"
                    />
                  </div>
                </v-col>

                <v-col class="py-0" cols="11">
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
                          :readonly="uncorrected"
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

                <v-col class="pb-0" cols="11">
                  <p class="mb-0 mt-2 fs-14 font-weight-bold">
                    Thời gian mở cửa<span class="error--text ml-1">*</span>
                  </p>
                  <v-row>
                    <v-col
                      v-for="(time, idx) in timeSetUp"
                      :key="`${idx}-${time}`"
                      cols="11"
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
                          :readonly="uncorrected"
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
                          :readonly="uncorrected"
                        >
                          <template v-slot:thumb-label="data_time">
                            {{ set_first_time(data_time.value) }}
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
                          :readonly="uncorrected"
                        >
                          <template v-slot:thumb-label="data_time">
                            {{ set_end_time(data_time.value) }}
                          </template>
                        </v-slider>
                      </div>
                    </v-col>
                  </v-row>
                </v-col>

                <v-col class="py-0" cols="11">
                  <div class="d-flex align-center">
                    <div class="fs-14 font-weight-bold mr-10 ml-2">Bản đồ</div>
                    <v-switch
                      v-model="map"
                      class="ma-0"
                      color="#47bbff"
                      :true-value="1"
                      :false-value="0"
                      inset
                      hide-details
                      :readonly="uncorrected"
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
                        :readonly="uncorrected"
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
                        :data="language.menu"
                        :disabled="uncorrected"
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
                    <div class="fs-14 font-weight-bold mr-10 ml-2">
                      Đánh giá
                    </div>
                    <v-switch
                      v-model="evaluate"
                      class="mt-5"
                      color="#47bbff"
                      :true-value="1"
                      :false-value="0"
                      inset
                      :readonly="uncorrected"
                    />
                  </div>
                </v-col>

                <v-col class="py-0" cols="11">
                  <div class="d-flex align-center">
                    <div class="fs-14 font-weight-bold mr-10 ml-2">
                      Có thể bạn quan tâm
                    </div>
                    <v-switch
                      v-model="care"
                      class="mt-5"
                      color="#47bbff"
                      :true-value="1"
                      :false-value="0"
                      inset
                      :readonly="uncorrected"
                      @change="care === 0 ? (suggestion_msg = '') : ''"
                    />
                  </div>
                  <h3 ref="scroll_to_six" />
                </v-col>

                <suggestions
                  ref="suggestions_restaurant"
                  :id-info="data.restaurant.id"
                  :readonly="uncorrected"
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
      @OK="reset_data"
    />

    <yes-no-alert
      :open="$store.state.product.open_cancel"
      alert-msg="Bạn chắc chắn muốn hủy không?"
      @toggle="$store.commit('product/toggle_cancel')"
      @OK="toggle"
    />

    <yes-no-alert
      :open="open_save"
      alert-msg="Bạn chắc chắn muốn lưu không?"
      @toggle="open_save = !open_save"
      @OK="save"
    />

    <yes-no-alert
      :open="open_delete_img"
      alert-msg="Bạn chắc chắn muốn xóa không?"
      @toggle="open_delete_img = !open_delete_img"
      @OK="delete_img(index)"
    />

    <copy
      :open="open_copy"
      @toggle="open_copy = !open_copy"
      @OK="copy_product"
    />
  </div>
</template>

<script>
import Draggable from 'vuedraggable'

import SelectFile from '~/components/icon/SelectFile'

import Suggestions from '~/components/Product/edit/restaurant/suggestions/index'
import Services from '~/components/Product/edit/restaurant/services/index'
import Copy from '~/components/Product/copy'

export default {
  components: {
    Suggestions,
    Services,
    Draggable,
    SelectFile,
    Copy,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
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
    list_category: [{ id: 2, name: 'Nhà hàng' }],
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
    listsuggestion: [],
    suggestion_msg: '',
    open_reset: false,
    // xử lý files img
    list_files: [],
    reset_file: [],
    images: [],
    error_msg: '',
    maxrequied: 30,
    open_save: false,
    address: '',
    open_copy: false,
    uncorrected: false,
    target: null,
    options: {
      duration: 500,
      offset: 100,
      easing: 'easeInOutCubic',
    },
    loading_review: false,
    open_delete_img: false,
    use_ggmap: false,
    index: -1,
  }),
  created() {
    this.set_data()
  },
  methods: {
    reset_data() {
      const LANGUAGE = [...this.$store.state.app.languages]
      if ((LANGUAGE || []).length !== 0) {
        for (let i = 0; i < LANGUAGE.length; i++) {
          LANGUAGE[i] = {
            ...LANGUAGE[i],
            restaurant: '',
            address: '',
            introduce: '',
            describe: '',
            menu: '',
            path: '',
            restaurant_msg: [],
            address_msg: [],
            introduce_msg: [],
            menu_msg: [],
            path_msg: [],
            restaurantServices: [],
          }
        }
      }
      this.languages = [...LANGUAGE]
      this.hidden = 1
      this.lat = 21.028511
      this.lng = 105.804817
      this.zoom = 15
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
      this.reset()
      this.list_files = []
      // this.backgroundImages = []
      this.price1 = null
      this.price1_msg = []
      this.price2 = null
      this.price2_msg = []
      this.currency = this.moneys[0]
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
      this.map = 1
      const arr = []
      if ((this.map_services || []).length !== 0) {
        for (let i = 0; i < this.map_services.length; i++) {
          arr[i] = { ...this.map_services[i], value: 0 }
        }
      }
      this.map_services = [...arr]
      this.evaluate = 1
      this.care = 1
      this.$refs.suggestions_restaurant.reset()
      this.listsuggestion = []
      // this.suggestions = []
      this.suggestion_msg = ''
      this.utilities = []
      this.$refs.product_restaurant_edit_services.get_data()
      this.address = ''
    },
    set_data() {
      // status = 1 sản phẩm do nhà cung cấp tạo
      if (this.data.restaurant.of_status === 1) {
        this.uncorrected = true
      }
      this.hidden = this.data.restaurant.enable
      this.sku = this.data.restaurant.sku
      this.lat = this.data.restaurant.lat
      this.lng = this.data.restaurant.lon

      this.set_restaurant_enterprise()
      this.phone = this.data.restaurant.phone
      this.email = this.data.restaurant.email
      // this.set_restaurant_category()
      this.status = this.data.restaurant.status
      const arrImg = []
      // const backgroundImages = []
      for (let i = 0; i < this.data.restaurantImages.length; i++) {
        arrImg.push({
          id: this.data.restaurantImages[i].id,
          img: this.data.restaurantImages[i].url,
          file: '',
        })
        // backgroundImages.push({
        //   url: this.data.restaurantImages[i].url,
        //   type: 1,
        // })
      }
      this.list_files = [...arrImg]
      this.images = [...arrImg]
      // this.backgroundImages = [...backgroundImages]
      this.set_restaurant_type()
      this.map = this.data.restaurant.enable_map
      this.evaluate = this.data.restaurant.enable_rating
      this.care = this.data.restaurant.enable_suggestion
      this.set_languages()
      this.set_map_services()
      this.set_restaurant_dish_type()
      this.set_currencies()
      this.set_time_default()
    },
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
          this.enterprise = this.data.restaurant.enterprise_id
        }
      })
    },
    set_restaurant_dish_type() {
      this.$store.dispatch('product/restaurant_dish_type').then((res) => {
        if (!res.error) {
          this.list_type_dish = res.data.data
          this.type_dish = this.data.restaurant.dish_type
        }
      })
    },
    set_restaurant_type() {
      this.$store.dispatch('product/restaurant_type').then((res) => {
        if (!res.error) {
          this.list_type = res.data.data
          this.type = this.data.restaurant.type_id
        }
      })
    },
    set_languages() {
      const LANGUAGE = [...this.$store.state.app.languages]

      if ((LANGUAGE || []).length !== 0) {
        for (let i = 0; i < LANGUAGE.length; i++) {
          LANGUAGE[i] = {
            ...LANGUAGE[i],
            restaurant: !this.$isNullOrEmpty(this.data.restaurantLangs[i])
              ? this.data.restaurantLangs[i].name
              : '',
            address: !this.$isNullOrEmpty(this.data.restaurantLangs[i])
              ? this.data.restaurantLangs[i].address
              : '',
            introduce: !this.$isNullOrEmpty(this.data.restaurantLangs[i])
              ? this.data.restaurantLangs[i].general_introduce
              : '',
            describe: !this.$isNullOrEmpty(this.data.restaurantLangs[i])
              ? this.data.restaurantLangs[i].sub_title
              : '',
            menu: !this.$isNullOrEmpty(this.data.restaurantLangs[i])
              ? this.data.restaurantLangs[i].menu
              : '',
            path: !this.$isNullOrEmpty(this.data.restaurantLangs[i])
              ? this.data.restaurantLangs[i].url_seo
              : '',
            restaurantServices: !this.$isNullOrEmpty(
              this.data.restaurantLangs[i]
            )
              ? this.data_processing_services(
                  this.data.restaurantLangs[i].restaurantServices
                )
              : [],
            restaurant_msg: [],
            address_msg: [],
            introduce_msg: [],
            menu_msg: [],
            path_msg: [],
          }
        }
      }
      this.languages = [...LANGUAGE]

      const utilities = [...LANGUAGE]
      for (let i = 0; i < LANGUAGE.length; i++) {
        utilities[i] = {
          item: [...LANGUAGE[i].restaurantServices],
        }
      }
      this.utilities = [...utilities]
    },
    data_processing_services(array) {
      const arr = []
      if ((array || []).length !== 0) {
        for (let i = 0; i < array.length; i++) {
          arr.push({
            id: i + 1,
            name: array[i].name,
            enable: array[i].enable,
            type: array[i].type,
          })
        }
      }
      return arr
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
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].value === this.data.restaurant.currency_id) {
          this.currency = {
            value: this.data.restaurant.currency_id,
            text: arr[i].text,
          }
        }
      }
      this.price1 = this.data.restaurant.from_price
      this.price2 = this.data.restaurant.to_price
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

                for (let j = 0; j < this.data.aroundLocations.length; j++) {
                  if (this.data.aroundLocations[j].id === arr[i].id) {
                    arr[i] = { ...res.data.data[i], value: 1 }
                  }
                }
              }
            }
            this.map_services = [...arr]
          }
        })
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
    validate_price(field) {
      if (this.$isNullOrEmpty(this[field])) {
        this[`${field}_msg`] = 'Đơn vị không hợp lệ'
      } else if (this[field] < 0) {
        this[`${field}_msg`] = 'Đơn vị không hợp lệ'
      } else {
        this[`${field}_msg`] = ''
      }
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

          let count = 0
          for (let i = 0; i < this.list_files.length; i++) {
            if (!this.$isNullOrEmpty(this.list_files[i].file)) {
              count += 1
            }
          }
          if (count > 0) {
            this.upload_cover_image()
          } else {
            this.insert()
          }
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

          let count = 0
          for (let i = 0; i < this.list_files.length; i++) {
            if (!this.$isNullOrEmpty(this.list_files[i].file)) {
              count += 1
            }
          }
          if (count > 0) {
            this.upload_cover_image()
          } else {
            this.insert()
          }
        })
      }
    },
    set_value_editor(value, item, field, check) {
      item[field] = value
      if (check === 1) {
        item[`${field}_msg`] = []
      }
    },
    set_service(items) {
      this.utilities = [...items]
    },
    get_value_time(str) {
      let arr = []
      let time = {}
      arr = str.split('|')
      time = {
        start:
          parseInt(arr[0].slice(0, 2)) * 4 + parseInt(arr[0].slice(3, 5)) / 15,
        end:
          (parseInt(arr[1].slice(0, 2)) - 12) * 4 +
          parseInt(arr[1].slice(3, 5)) / 15,
      }
      return time
    },
    change_value_time(str, name, shortName) {
      if ((str || '').length !== 0) {
        // "10:15|23:00"
        return {
          value: 1,
          label: name,
          time: shortName,
          timestart: this.get_value_time(str).start,
          timeend: this.get_value_time(str).end,
        }
      } else {
        return {
          value: 0,
          label: name,
          time: shortName,
          timestart: 28,
          timeend: 44,
        }
      }
    },
    set_time_default() {
      this.timeSetUp = [
        {
          ...this.change_value_time(
            this.data.restaurantOpeningSchedule.mon,
            'Thứ hai',
            'mo'
          ),
        },
        {
          ...this.change_value_time(
            this.data.restaurantOpeningSchedule.tu,
            'Thứ ba',
            'tu'
          ),
        },
        {
          ...this.change_value_time(
            this.data.restaurantOpeningSchedule.we,
            'Thứ tư',
            'we'
          ),
        },
        {
          ...this.change_value_time(
            this.data.restaurantOpeningSchedule.th,
            'Thứ năm',
            'th'
          ),
        },
        {
          ...this.change_value_time(
            this.data.restaurantOpeningSchedule.fr,
            'Thứ sáu',
            'fr'
          ),
        },
        {
          ...this.change_value_time(
            this.data.restaurantOpeningSchedule.sa,
            'Thứ bảy',
            'sa'
          ),
        },
        {
          ...this.change_value_time(
            this.data.restaurantOpeningSchedule.su,
            'Chủ nhật',
            'su'
          ),
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
    set_suggestions(items) {
      // this.$log.debug(items)
      this.listsuggestion = [...items]
      this.suggestion_msg = ''
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

      if ((this.list_files || []).length === 0) {
        hasErrors = true
        this.error_msg = 'Không được để trống'
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

      if (count > 0) {
        this.$showWarnNotify(this, 'Bạn nhập thiếu thông tin bắt buộc')
      }

      if (count2 > 0) {
        this.$vuetify.goTo(this.target, this.options)
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

      if (!hasErrors) {
        this.set_address_to_map()
      }
    },
    upload_cover_image(check) {
      const folder = 'restaurant-product-cover-img'
      const formData = new FormData()
      const index = []
      for (let i = 0; i < this.list_files.length; i++) {
        if (!this.$isNullOrEmpty(this.list_files[i].file)) {
          formData.append('file', this.list_files[i].file)
          index.push(i)
        }
      }
      this.$store
        .dispatch('uploadImg/uploadFile', { folder, formData })
        .then((res) => {
          if (!res.error) {
            if ((res.data.data.image_url || '').length !== 0) {
              const arrImg = res.data.data.image_url.split(';')

              for (let i = 0; i < index.length; i++) {
                this.list_files[index[i]].img = arrImg[i]
              }

              const arr = []
              for (let i = 0; i < this.list_files.length; i++) {
                arr.push({
                  id: i + 1,
                  img: this.list_files[i].img,
                  file: '',
                })
              }
              this.list_files = [...arr]
              if (check !== 1) {
                this.insert()
              } else {
                this.get_review()
              }
            }
          }
        })
    },
    insert() {
      const langs = []
      const aroundLocations = []
      const suggestionList = []
      const images = []
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

      for (let i = 0; i < this.list_files.length; i++) {
        images.push({
          url: this.list_files[i].img,
          type: 1, // ảnh
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
        id: this.data.restaurant.id,
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

      this.$store.dispatch('product/restaurant_edit', DATA).then((res) => {
        if (!res.error) {
          this.$showSuccess(this, 'Cập nhật sản phẩm thành công')
          this.$emit('OK')
        }
      })
    },
    check_review() {
      let count = 0
      for (let i = 0; i < this.list_files.length; i++) {
        if (!this.$isNullOrEmpty(this.list_files[i].file)) {
          count += 1
        }
      }
      if (count > 0) {
        this.upload_cover_image(1)
      } else {
        this.get_review()
      }
    },
    get_review() {
      this.loading_review = true

      const langs = []
      const aroundLocations = []
      const suggestionList = []
      const images = []
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
          url_seo: null,
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

      for (let i = 0; i < this.list_files.length; i++) {
        images.push({
          url: this.list_files[i].img,
          type: 1, // ảnh
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

      this.$log.debug(this.currency)

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
    copy_product(name) {
      const DATA = {
        product_id: this.data.restaurant.id,
        product_type: this.$store.state.app.product_type.restaurant,
        product_name: name,
      }
      this.$store
        .dispatch('product/copy_product', DATA)
        .then((res) => {
          if (!res.error) {
            this.$showSuccess(this, 'Nhân bản sản phẩm thành công')
            this.$emit('OK')
          }
        })
        .finally(() => {
          this.open_copy = false
        })
    },
    // xử lý files img
    select_file() {
      if (!this.uncorrected) {
        return window.document
          .getElementById('product-add-restaurant-room')
          .click()
      }
    },
    inputFile(files) {
      let hasErrors = false

      if ((files || []).length !== 0) {
        for (let i = 0; i < files.length; i++) {
          if (files[i].size > 3145728) {
            hasErrors = true
            this.error_msg = 'File được chọn không được vượt quá 3MB'
          }
        }
      }

      if (!hasErrors) {
        this.reset_file = []
        if ((files || []).length + this.images.length > this.maxrequied) {
          this.error_msg = `Vui lòng chọn tối đa ${this.maxrequied} ảnh`
          this.list_files = [...this.images]
        } else {
          this.reset_file = files

          if ((files || []).length !== 0) {
            const arr = [...this.images]
            for (let i = 0; i < files.length; i++) {
              arr.push({
                id: i + 1,
                img: URL.createObjectURL(files[i]),
                file: files[i],
              })
            }
            this.images = [...arr]
          }
          this.list_files = [...this.images]
          this.error_msg = ''
        }
      }
    },
    move_file(event) {
      this.list_files = [...this.images]
    },
    confirm_delete(idx) {
      this.index = idx
      this.open_delete_img = true
    },
    delete_img(index) {
      this.images.splice(index, 1)
      this.list_files = [...this.images]
      this.reset_file = []
    },
    reset() {
      this.reset_file = []
      this.images = []
      this.error_msg = ''
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
  },
}
</script>

<style lang="scss">
.edit-product-restaurant-info {
  /* .fix-height {
    max-height: calc(100vh - 240px);
    overflow-x: hidden;
    overflow-y: auto;
  } */

  .v-slider--horizontal {
    margin: 0 !important;
  }
}

.theme--light.v-sheet--outlined {
  border: none !important;
}
</style>
