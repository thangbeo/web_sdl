<template>
  <div>
    <client-only>
      <div
        class="d-flex w-100 mt-12"
        style="right: 0; background-color: #f5f7fe"
      >
        <div class="flex-grow-1"></div>
        <v-btn
          class="text-none mr-2"
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
          class="text-none white--text mr-2"
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
          class="text-none white--text mr-1"
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
      <div style="position: fixed; z-index: 3; right: 12px; bottom: 20px">
        <v-btn
          v-if="!uncorrected"
          color="#FF0F59"
          class="text-none white--text mr-2"
          depressed
          width="90"
          @click="backHotel"
        >
          Hủy
        </v-btn>
        <v-btn
          v-if="!uncorrected"
          class="text-none white--text mr-4"
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
        active-class="primary--text"
        background-color="#f4f7fe"
      >
        <v-tab
          :class="
            (tabmenu !== 0 && 'black--text') +
            ' text-none letter-spacing-normal fs-17 font-weight-bold'
          "
        >
          Thông tin cơ bản
        </v-tab>

        <v-tab
          :class="
            (tabmenu !== 1 && 'black--text') +
            ' text-none letter-spacing-normal fs-17 font-weight-bold'
          "
        >
          Phòng nghỉ
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="tabmenu" style="background-color: #f5f7fe">
        <v-tab-item>
          <div class="add-product-hotel-info">
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
                        :outlined="language.resort_msg.length !== 0"
                        placeholder="Nhập tiêu đề"
                        class="border-1"
                        solo
                        flat
                        dense
                        :readonly="uncorrected"
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
                        :outlined="language.address_msg.length !== 0"
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
                        :readonly="uncorrected"
                        placeholder="Nhập mô tả"
                        class="border-1"
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
                      <div class="pa-0">
                        <v-autocomplete
                          v-model="enterprise"
                          :items="list_enterprise"
                          item-value="id"
                          item-text="enterprise_name"
                          class="border-1 fs-14"
                          solo
                          flat
                          dense
                          hide-details
                          readonly
                        >
                        </v-autocomplete>
                      </div>
                    </v-col>
                    <v-col cols="4" class="py-0">
                      <p class="my-2 fs-14 font-weight-bold">Số điện thoại</p>
                      <div class="pa-0">
                        <v-text-field
                          v-model="phone"
                          :error-messages="phone_msg"
                          type="number"
                          placeholder="Số điện thoại"
                          :readonly="uncorrected"
                          solo
                          flat
                          dense
                          @input="validate_phone"
                        />
                      </div>
                    </v-col>
                    <v-col cols="4" class="py-0">
                      <p class="my-2 fs-14 font-weight-bold">Email</p>
                      <div class="pa-0">
                        <v-text-field
                          v-model="email"
                          :error-messages="email_msg"
                          :readonly="uncorrected"
                          placeholder="Email"
                          solo
                          flat
                          dense
                          @input="validate_email"
                        />
                      </div>
                    </v-col>
                  </v-row>
                </v-col>

                <v-col class="pb-0" cols="11">
                  <v-row>
                    <v-col cols="4" class="py-0">
                      <p class="mb-2 fs-14 font-weight-bold">
                        Danh mục sản phẩm<span class="error--text ml-1">*</span>
                      </p>
                      <div class="pa-0">
                        <v-autocomplete
                          v-model="category"
                          placeholder="Chọn danh mục sản phẩm"
                          :items="list_category"
                          item-value="id"
                          item-text="name"
                          :error-messages="category_msg"
                          :readonly="uncorrected"
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
                    <v-col cols="4" class="py-0">
                      <p class="mb-2 fs-14 font-weight-bold">
                        Trạng thái <span class="error--text ml-1">*</span>
                      </p>
                      <div class="pa-0">
                        <v-select
                          v-model="status"
                          placeholder="Chọn trạng thái"
                          :items="list_status"
                          :readonly="uncorrected"
                          :error-messages="status_msg"
                          class="border-1 fs-14"
                          solo
                          flat
                          dense
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
                        </v-select>
                      </div>
                    </v-col>
                    <v-col cols="4" class="py-0">
                      <p class="mb-2 fs-14 font-weight-bold">
                        Loại hình <span class="error--text ml-1">*</span>
                      </p>
                      <div class="pa-0">
                        <v-autocomplete
                          v-model="type"
                          placeholder="Chọn loại hình"
                          :readonly="uncorrected"
                          :items="list_type"
                          item-value="id"
                          item-text="name"
                          :outlined="type_msg.length !== 0"
                          :error-messages="type_msg"
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
                    :readonly="uncorrected"
                    :set-data="languages"
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
                    :readonly="uncorrected"
                  />
                  <h3 ref="scroll_to_three" />
                </v-col>

                <v-col class="pb-0" cols="11">
                  <p class="mb-2 fs-14 font-weight-bold">
                    Ảnh bìa <span class="error--text ml-1">*</span>
                  </p>
                  <div class="col-10 pa-0">
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
                        id="product-add-img-hotel-room"
                        :value="reset_file"
                        multiple
                        accept="image/png, image/jpeg, image/gif"
                        class="d-none"
                        @change="inputFile"
                      />
                    </div>
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
                          :readonly="uncorrected"
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
                        :readonly="uncorrected"
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
                        :readonly="uncorrected"
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
                      :readonly="uncorrected"
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
                        :readonly="uncorrected"
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
                      :readonly="uncorrected"
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
                      :readonly="uncorrected"
                      inset
                    />
                  </div>
                </v-col>

                <suggestions
                  ref="suggestions_hotel"
                  :id-info="data.hotel.id"
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

                <v-col cols="11">
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
                        :data="language.policy"
                        :disabled="uncorrected"
                        @text-change="
                          set_value_editor($event, language, 'policy', 0)
                        "
                      />
                    </v-tab-item>
                  </v-tabs-items>
                </v-col>

                <v-col class="pb-0" cols="11">
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
                        :data="language.note"
                        :disabled="uncorrected"
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
          <div class="add-product-hotel-info">
            <div class="mx-8 fix-height page page--table">
              <RoomServices
                ref="product_hotel_add_room_services"
                :set-data="languages"
                :readonly="uncorrected"
                @setData="set_room_service"
              />
              <room-list
                ref="product_hotel_edit_room"
                :data="room_list"
                :detail="data"
                :readonly="uncorrected"
                @delete="set_room_info"
              />
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
      :open="open_delete_img"
      alert-msg="Bạn chắc chắn muốn xóa không?"
      @toggle="open_delete_img = !open_delete_img"
      @OK="delete_img(index)"
    />

    <yes-no-alert
      :open="$store.state.nha_cung_cap_san_pham.open_cancel"
      alert-msg="Bạn chắc chắn muốn hủy không?"
      @toggle="$store.commit('nha_cung_cap_san_pham/toggle_cancel')"
      @OK="toggle"
    />

    <yes-no-alert
      :open="open_save"
      alert-msg="Bạn chắc chắn muốn lưu không?"
      @toggle="open_save = !open_save"
      @OK="save"
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
import Suggestions from '~/components/product-nha-cung-cap/edit/hotel/suggestions/index'
import RoomList from '~/components/product-nha-cung-cap/edit/hotel/room/list'
import Services from '~/components/product-nha-cung-cap/edit/hotel/services/index'
import RoomServices from '~/components/product-nha-cung-cap/edit/hotel/roomservices/index'
import Copy from '~/components/Product/copy'

export default {
  components: {
    Suggestions,
    RoomList,
    Services,
    RoomServices,
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
    open_copy: false,
    tabmenu: null,
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
    list_category: [{ id: 1, name: 'Khách sạn' }],
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
    rating: 4.5,
    floors: 1,
    time_checkin: '06:30:30',
    time_checkout: '20:30:30',
    map: 1,
    map_services: [],
    evaluate: 1,
    care: 1,
    // phòng nghỉ
    listsuggestions: [],
    suggestions_msg: '',
    open_reset: false,
    room_list: [],
    room_list_delete: [],
    // xử lý files img
    list_files: [],
    reset_file: [],
    images: [],
    error_msg: '',
    maxrequied: 30,
    backgroundImages: [],
    // suggestions: [],
    open_save: false,
    address: '',
    uncorrected: false,
    target: null,
    options: {
      duration: 500,
      offset: 100,
      easing: 'easeInOutCubic',
    },
    loading_review: false,
    open_delete_img: false,
    index: -1,
  }),
  created() {
    this.set_data()
  },
  methods: {
    backHotel() {
      this.$store.commit('nha_cung_cap_san_pham/toggle_cancel')
    },
    reset_data() {
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
            convenientServices: [],
            restRoomServices: [],
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
      // this.enterprise = null
      this.phone = null
      this.phone_msg = []
      this.email = null
      this.email_msg = []
      this.category = [1]
      this.category_msg = []
      this.$refs.product_hotel_add_services.get_data()
      this.$refs.product_hotel_add_room_services.get_data()
      this.$refs.product_hotel_edit_room.reset()
      this.status = 1
      this.type = null
      this.type_msg = []
      this.rating = 4
      this.floors = 1
      this.time_checkin = '06:30:30'
      this.time_checkout = '20:30:30'
      this.map = 1
      this.reset()
      const arr = []
      if ((this.map_services || []).length !== 0) {
        for (let i = 0; i < this.map_services.length; i++) {
          arr[i] = { ...this.map_services[i], value: 0 }
        }
      }
      this.map_services = [...arr]
      this.evaluate = 1
      this.care = 1
      this.$refs.suggestions_hotel.reset()
      this.listsuggestions = []
      // this.suggestions = []
      this.suggestions_msg = ''
      this.room_list = []
      this.room_list_delete = []
      this.list_files = []
      this.images = []
      this.backgroundImages = []
      this.utilities = []
      this.utilities2 = []
      this.address = ''
    },
    set_data() {
      // status = 1 sản phẩm do nhà cung cấp tạo
      if (this.data.hotel.of_status === 1) {
        this.uncorrected = true
      }
      this.hidden = this.data.hotel.enable
      this.sku = this.data.hotel.sku
      this.lat = this.data.hotel.lat
      this.lng = this.data.hotel.lon

      this.$store
        .dispatch('nha_cung_cap_san_pham/hotel_enterprise')
        .then((res) => {
          if (!res.error) {
            this.list_enterprise = res.data.data
            this.enterprise = this.data.hotel.enterprise_id
          }
        })

      this.phone = this.data.hotel.phone
      this.email = this.data.hotel.email

      // this.$store
      //   .dispatch('nha_cung_cap_san_pham/hotel_category')
      //   .then((res) => {
      //     if (!res.error) {
      //       this.list_category = res.data.data

      //       let category = []
      //       if ((this.data.product_category_ids || '').length !== 0) {
      //         category = this.data.product_category_ids.split(',')
      //         for (let i = 0; i < category.length; i++) {
      //           category[i] = Number(category[i])
      //         }
      //       }
      //       this.category = category
      //     }
      //   })

      this.status = this.data.hotel.status

      const arrImg = []
      const backgroundImages = []
      for (let i = 0; i < this.data.hotelThumbnails.length; i++) {
        arrImg.push({
          id: this.data.hotelThumbnails[i].id,
          img: this.data.hotelThumbnails[i].url,
          file: '',
        })
        backgroundImages.push({
          url: this.data.hotelThumbnails[i].url,
          type: 1,
        })
      }
      this.list_files = [...arrImg]
      this.images = [...arrImg]
      this.backgroundImages = [...backgroundImages]

      this.$store.dispatch('nha_cung_cap_san_pham/hotel_type').then((res) => {
        if (!res.error) {
          this.list_type = res.data.data
          this.type = this.data.hotel.type_id
        }
      })

      this.rating = this.data.hotel.rating_level_id
      this.floors = this.data.hotel.floor_number
      this.time_checkin = this.data.hotel.checkin_hour
      this.time_checkout = this.data.hotel.checkout_hour

      this.map = this.data.hotel.enable_map
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

      this.evaluate = this.data.hotel.enable_rating
      this.care = this.data.hotel.enable_interested

      const LANGUAGE = [...this.$store.state.app.languages]

      if ((LANGUAGE || []).length !== 0) {
        for (let i = 0; i < LANGUAGE.length; i++) {
          LANGUAGE[i] = {
            ...LANGUAGE[i],
            resort: !this.$isNullOrEmpty(this.data.hotelLangs[i])
              ? this.data.hotelLangs[i].name
              : '',
            resort_msg: [],
            address: !this.$isNullOrEmpty(this.data.hotelLangs[i])
              ? this.data.hotelLangs[i].address
              : '',
            address_msg: [],
            introduce: !this.$isNullOrEmpty(this.data.hotelLangs[i])
              ? this.data.hotelLangs[i].general_introduce
              : '',
            introduce_msg: [],
            policy: !this.$isNullOrEmpty(this.data.hotelLangs[i])
              ? this.data.hotelLangs[i].policy
              : '',
            note: !this.$isNullOrEmpty(this.data.hotelLangs[i])
              ? this.data.hotelLangs[i].note
              : '',
            describe: !this.$isNullOrEmpty(this.data.hotelLangs[i])
              ? this.data.hotelLangs[i].sub_title
              : '',
            path: !this.$isNullOrEmpty(this.data.hotelLangs[i])
              ? this.data.hotelLangs[i].url_seo
              : '',
            path_msg: [],
            convenientServices: !this.$isNullOrEmpty(this.data.hotelLangs[i])
              ? this.data_processing_services(
                  this.data.hotelLangs[i].convenientServices
                )
              : [],
            restRoomServices: !this.$isNullOrEmpty(this.data.hotelLangs[i])
              ? this.data_processing_services(
                  this.data.hotelLangs[i].restRoomServices
                )
              : [],
          }
        }
      }
      this.languages = [...LANGUAGE]

      const utilities = [...LANGUAGE]
      const utilities2 = [...LANGUAGE]
      for (let i = 0; i < LANGUAGE.length; i++) {
        utilities[i] = {
          item: [...LANGUAGE[i].convenientServices],
        }
        utilities2[i] = {
          item: [...LANGUAGE[i].restRoomServices],
        }
      }
      this.utilities = [...utilities]
      this.utilities2 = [...utilities2]

      // const listsuggestions = []
      const roomList = []
      for (let i = 0; i < this.data.restRooms.length; i++) {
        roomList.push({
          hotel_id: this.data.restRooms[i].hotel_id,
          id: this.data.restRooms[i].id,
          enable: this.data.restRooms[i].enable,
          room_type_id: this.data.restRooms[i].type_id,
          room_type_name: this.data.restRooms[i].type_name,
          bed_type: this.data.restRooms[i].bed_type,
          status: this.data.restRooms[i].status,
          acreage: this.data.restRooms[i].acreage,
          number_adults: this.data.restRooms[i].number_adults,
          number_children: this.data.restRooms[i].number_children,
          number_rooms: this.data.restRooms[i].room_number,
          currency_id: this.data.restRooms[i].currency_id,
          // currency_name: this.data.restRooms[i].currency_name,
          price_value: this.data.restRooms[i].price,
        })
      }
      this.room_list = [...roomList]
    },
    toggle() {
      this.$emit('backproduct')
      this.$emit('toggle')
      this.$emit('set_title')
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
    // thông tin cơ bản
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
        if (!this.$isMobilePhone(this.phone)) {
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
      if (!this.uncorrected) {
        this.floors += 1
      }
    },
    minus() {
      if (!this.uncorrected) {
        if (this.floors !== 1) {
          this.floors -= 1
        }
      }
    },
    set_suggestions(items) {
      // this.$log.debug(items)
      this.listsuggestions = [...items]
      this.suggestions_msg = ''
    },
    set_room_info(arr) {
      this.room_list_delete = [...arr]
    },
    set_service(items) {
      this.utilities = [...items]
    },
    set_room_service(items) {
      for (let i = 0; i < items.length; i++) {
        items[i] = {
          ...items[i],
          item: [...items[i].restRoomServices],
        }
      }
      this.utilities2 = [...items]
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
          this.tab2 = i
          count += 1
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
        this.check_scroll(count2, 'scroll_to_two')
        count2 += 1
      }

      if ((this.list_files || []).length === 0) {
        hasErrors = true
        this.error_msg = 'Không được để trống'
        count += 1
        this.check_scroll(count2, 'scroll_to_three')
        count2 += 1
      }

      // if ((this.listsuggestions || []).length === 0) {
      //   hasErrors = true
      //   this.suggestions_msg = 'Không được để trống'
      //   count += 1
      // }

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
      const folder = 'hotel-product-cover-img'
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
                  // url: this.list_files[i].img,
                  // type: 1,
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
    // check_upload() {
    //   let count1 = 0
    //   for (let i = 0; i < this.listsuggestions.length; i++) {
    //     if (!this.$isNullOrEmpty(this.listsuggestions[i].file)) {
    //       count1 += 1
    //     }
    //   }

    //   if (count1 > 0) {
    //     this.upload_suggestions_image()
    //   } else {
    //     this.insert()
    //   }
    // },
    // upload_suggestions_image() {
    //   const folder = 'hotel-product-suggestions-img'
    //   const formData = new FormData()
    //   const index = []
    //   for (let i = 0; i < this.listsuggestions.length; i++) {
    //     if (!this.$isNullOrEmpty(this.listsuggestions[i].file)) {
    //       formData.append('file', this.listsuggestions[i].file)
    //       index.push(i)
    //     }
    //   }
    //   this.$store
    //     .dispatch('uploadImg/uploadFile', { folder, formData })
    //     .then((res) => {
    //       if (!res.error) {
    //         if ((res.data.data.image_url || '').length !== 0) {
    //           const arrImg = res.data.data.image_url.split(';')

    //           for (let i = 0; i < index.length; i++) {
    //             this.listsuggestions[index[i]].img = arrImg[i]
    //           }

    //           const arr = []
    //           for (let i = 0; i < this.listsuggestions.length; i++) {
    //             arr.push({
    //               name: this.listsuggestions[i].name,
    //               image_url: this.listsuggestions[i].img,
    //               target_url: this.listsuggestions[i].url,
    //               status: this.listsuggestions[i].status,
    //             })
    //           }
    //           this.suggestions = [...arr]
    //           this.insert()
    //         }
    //       }
    //     })
    // },
    insert() {
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
            (this.utilities[i].item || '').length !== 0
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

      for (let i = 0; i < this.listsuggestions.length; i++) {
        suggestions.push({
          id: this.listsuggestions[i].id,
          type: this.listsuggestions[i].product_type,
        })
      }

      const DATA = {
        id: this.data.hotel.id,
        sku: this.sku,
        enable: this.hidden,
        langs,
        lon: this.lng,
        lat: this.lat,
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
        // restRooms: [...this.room_list],
        deleted_rest_room_ids: [...this.room_list_delete].join(),
        background_images: this.backgroundImages,
        suggestions,
      }

      this.$store
        .dispatch('nha_cung_cap_san_pham/edit_hotel', DATA)
        .then((res) => {
          if (!res.error) {
            this.$showSuccess(this, 'Cập nhật sản phẩm khách sạn thành công')
            this.$emit('toggle')
            this.$emit('success')
          }
        })
    },
    copy_product(name) {
      const DATA = {
        product_id: this.data.hotel.id,
        product_type: this.$store.state.app.product_type.hotel,
        product_name: name,
      }
      this.$store
        .dispatch('nha_cung_cap_san_pham/copy_product', DATA)
        .then((res) => {
          if (!res.error) {
            this.$showSuccess(this, 'Nhân bản sản phẩm thành công')
            this.$emit('toggle')
            this.$emit('success')
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
          .getElementById('product-add-img-hotel-room')
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
    check_scroll(count, location) {
      if (count === 0) {
        this.target = this.$refs[location]
      }
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
      const aroundLocationIds = []
      const suggestions = []
      const backgroundImages = []

      for (let i = 0; i < this.languages.length; i++) {
        langs.push({
          name: (this.languages[i].resort || '').trim(),
          address: (this.languages[i].address || '').trim(),
          sub_title: this.languages[i].describe,
          introduce: (this.languages[i].introduce || '').trim(),
          cancel_policy: this.languages[i].policy,
          note: (this.languages[i].note || '').trim(),
          lang_id: this.languages[i].id,
          url_seo: null,
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

      for (let i = 0; i < this.listsuggestions.length; i++) {
        suggestions.push({
          id: this.listsuggestions[i].id,
          type: this.listsuggestions[i].product_type,
        })
      }

      for (let i = 0; i < this.list_files.length; i++) {
        backgroundImages.push({
          url: this.list_files[i].img,
          type: 1, // ảnh
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
        // restRooms: [...this.room_list],
        // deleted_rest_room_ids: [...this.room_list_delete].join(),
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

<style lang="scss" scoped>
.add-product-hotel-info {
  .fix-height {
    max-height: calc(100vh - 240px);
    overflow-x: hidden;
    overflow-y: auto;
  }
}

.page--table {
  .page {
    &__grab-icon {
      cursor: move;
    }
  }
}

.theme--light.v-sheet--outlined {
  border: none !important;
}
</style>
