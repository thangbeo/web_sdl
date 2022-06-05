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
        >
          Thông tin cơ bản
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="tabmenu" style="background-color: #f5f7fe">
        <v-tab-item>
          <div class="add-product-tour-info mt-16">
            <div class="fix-height">
              <v-row class="mt-2 ml-10 mb-10">
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
                  </div>
                  <h3 ref="scroll_to_one" />
                </v-col>

                <v-col cols="11" class="pb-0">
                  <p class="ma-0 fs-14 font-weight-bold">
                    Tên Tour du lịch <span class="error--text ml-1">*</span>
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
                        v-model="language.tour"
                        :error-messages="language.tour_msg"
                        placeholder="Nhập tiêu đề"
                        class="border-1"
                        solo
                        flat
                        dense
                        :readonly="uncorrected"
                        @input="language.tour_msg = []"
                      >
                      </v-text-field>
                    </v-tab-item>
                  </v-tabs-items>
                </v-col>

                <v-col cols="11" class="pb-0">
                  <p class="ma-0 fs-14 font-weight-bold">
                    Hành trình <span class="error--text ml-1">*</span>
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
                      <v-textarea
                        v-model="language.journeys"
                        :error-messages="language.journeys_msg"
                        placeholder="Nhập các địa điểm tour đi qua"
                        class="border-1"
                        solo
                        flat
                        :readonly="uncorrected"
                        @input="language.journeys_msg = []"
                      >
                      </v-textarea>
                    </v-tab-item>
                  </v-tabs-items>
                </v-col>

                <v-col class="py-0 d-flex" cols="11">
                  <p
                    class="ma-0 fs-14 font-weight-bold"
                    style="min-width: 400px"
                  >
                    Nơi khởi hành <span class="error--text ml-1">*</span>
                  </p>
                  <v-autocomplete
                    v-model="departure"
                    :items="list_location"
                    item-value="id"
                    item-text="name"
                    :error-messages="departure_msg"
                    :menu-props="{ zIndex: '1' }"
                    style="max-width: 300px"
                    class="border-1 fs-14"
                    solo
                    flat
                    dense
                    :readonly="uncorrected"
                    @input="departure_msg = []"
                  >
                  </v-autocomplete>
                </v-col>

                <v-col class="py-0" cols="11">
                  <div class="d-flex">
                    <div style="min-width: 400px">
                      <p class="ma-0 fs-14 font-weight-bold">
                        Khu vực <span class="error--text ml-1">*</span>
                      </p>
                      <p class="ma-0 fs-12">Tour được tổ chức ở khu vực nào?</p>
                    </div>
                    <v-autocomplete
                      v-model="place"
                      :items="list_district"
                      item-value="id"
                      item-text="full_name"
                      :error-messages="place_msg"
                      :menu-props="{ zIndex: '1' }"
                      style="max-width: 300px"
                      class="border-1 fs-14"
                      solo
                      flat
                      dense
                      :readonly="uncorrected"
                      @input="place_msg = []"
                    >
                    </v-autocomplete>
                  </div>
                </v-col>

                <v-col class="pb-0" cols="11">
                  <p class="ma-0 fs-14 font-weight-bold">
                    Thời gian <span class="error--text ml-1">*</span>
                  </p>
                  <v-col class="pa-0 ml-4">
                    <v-radio-group
                      v-model="times"
                      mandatory
                      :readonly="uncorrected"
                    >
                      <v-radio label="Trong ngày" :value="1" :ripple="false" />
                      <v-radio
                        label="2 ngày 1 đêm"
                        :value="2"
                        :ripple="false"
                      />
                      <div class="d-flex">
                        <v-radio label="Khác" :value="3" :ripple="false" />
                        <v-text-field
                          v-model="daytime"
                          type="number"
                          style="max-width: 100px"
                          class="border-1 ml-3"
                          solo
                          flat
                          dense
                          hint="Ngày"
                          :persistent-hint="true"
                          :disabled="times !== 3"
                          :readonly="uncorrected"
                          @change="set_value($event, 'daytime')"
                        >
                        </v-text-field>
                        <v-text-field
                          v-model="night"
                          type="number"
                          style="max-width: 100px"
                          class="border-1 ml-3"
                          solo
                          flat
                          dense
                          hint="Đêm"
                          :autofocus="night_focus"
                          :persistent-hint="true"
                          :disabled="times !== 3"
                          :readonly="uncorrected"
                          @change="set_value($event, 'night')"
                        >
                        </v-text-field>
                      </div>
                    </v-radio-group>
                  </v-col>
                </v-col>

                <v-col class="py-0" cols="11">
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
                        Phương tiện<span class="error--text ml-1">*</span>
                      </p>
                      <v-autocomplete
                        v-model="vehicle"
                        :items="list_vehicle"
                        item-value="id"
                        item-text="name"
                        :error-messages="vehicle_msg"
                        :menu-props="{ zIndex: '1' }"
                        class="border-1 fs-14"
                        solo
                        flat
                        dense
                        :readonly="uncorrected"
                        @input="vehicle_msg = []"
                      >
                      </v-autocomplete>
                    </v-col>
                    <v-col cols="4" class="py-0">
                      <p class="mb-2 fs-14 font-weight-bold">
                        Loại hình du lịch
                        <span class="error--text ml-1">*</span>
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

                <v-col class="py-0" cols="11">
                  <p class="mb-2 fs-14 font-weight-bold">
                    Trạng thái <span class="error--text ml-1">*</span>
                  </p>
                  <v-autocomplete
                    v-model="status"
                    :items="list_status"
                    :error-messages="status_msg"
                    :menu-props="{ zIndex: '1' }"
                    item-color="white"
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
                      id="product-img-tour-room"
                      :value="reset_file"
                      multiple
                      accept="image/png, image/jpeg, image/gif"
                      class="d-none"
                      @change="inputFile"
                    />
                  </div>
                </v-col>

                <v-col class="pt-0" cols="11">
                  <p class="ma-0 fs-14 font-weight-bold">
                    URL thân thiện cho SEO
                  </p>
                  <v-tabs v-model="tab11" background-color="#F5F7FE">
                    <v-tab
                      v-for="(language, index) in languages"
                      :key="`${index}-${language}`"
                      class="text-none"
                    >
                      {{ language.name }}
                    </v-tab>
                  </v-tabs>
                  <v-tabs-items
                    v-model="tab11"
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
                  <h3 ref="scroll_to_four" />
                </v-col>

                <Schedule
                  ref="suggestions_schedule"
                  :data="listschedule"
                  :readonly="uncorrected"
                  @set_data="set_schedules"
                />
                <v-col cols="12" class="ml-2">
                  <div
                    class="v-messages theme--light error--text mt-1"
                    role="alert"
                  >
                    <div class="v-messages__wrapper">
                      <div class="v-messages__message">
                        {{ schedules_msg }}
                      </div>
                    </div>
                  </div>
                  <h3 ref="scroll_to_five" />
                </v-col>

                <DepartureSchedule
                  ref="suggestions_departure"
                  :data="{ type: departure_type, items: listdeparture }"
                  :check="{ times, daytime, night }"
                  :readonly="uncorrected"
                  @set_data="set_departure"
                />
                <v-col cols="12" class="ml-2">
                  <div
                    class="v-messages theme--light error--text mt-1"
                    role="alert"
                  >
                    <div class="v-messages__wrapper">
                      <div class="v-messages__message">
                        {{ departuremsg }}
                      </div>
                    </div>
                  </div>
                  <h3 ref="scroll_to_six" />
                </v-col>

                <v-col cols="11">
                  <p class="ma-0 fs-14 font-weight-bold">
                    Dịch vụ <span class="error--text ml-1">*</span>
                  </p>
                  <v-tabs v-model="tab6" background-color="#F5F7FE">
                    <v-tab
                      v-for="(language, index) in languages"
                      :key="`${index}-${language}`"
                      class="text-none"
                      @click="tab7 = null"
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
                      <v-tabs
                        v-model="tab7"
                        hide-slider
                        background-color="#F5F7FE"
                      >
                        <v-tab class="text-none fs-13"> Dịch vụ bao gồm </v-tab>
                        <v-tab class="text-none fs-13">
                          Dịch vụ không bao gồm
                        </v-tab>
                      </v-tabs>
                      <v-tabs-items
                        v-model="tab7"
                        style="background-color: #f5f7fe"
                      >
                        <v-tab-item>
                          <vue-2-editor
                            id="vue-2-editor-fix-height-2"
                            :data="language.service"
                            :disabled="uncorrected"
                            @text-change="
                              set_value_editor($event, language, 'service', 1)
                            "
                          />
                          <div
                            v-if="language.service_msg.length !== 0"
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
                        <v-tab-item>
                          <vue-2-editor
                            id="vue-2-editor-fix-height-3"
                            :data="language.service_no"
                            :disabled="uncorrected"
                            @text-change="
                              set_value_editor(
                                $event,
                                language,
                                'service_no',
                                1
                              )
                            "
                          />
                          <div
                            v-if="language.service_no_msg.length !== 0"
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
                    </v-tab-item>
                  </v-tabs-items>
                  <h3 ref="scroll_to_seven" />
                </v-col>

                <v-col class="mt-2" cols="11">
                  <p class="ma-0 fs-14 font-weight-bold">
                    Điều khoản và quy định
                    <span class="error--text ml-1">*</span>
                  </p>
                  <v-tabs v-model="tab8" background-color="#F5F7FE">
                    <v-tab
                      v-for="(language, index) in languages"
                      :key="`${index}-${language}`"
                      class="text-none"
                      @click="tab9 = null"
                    >
                      {{ language.name }}
                    </v-tab>
                  </v-tabs>
                  <v-tabs-items
                    v-model="tab8"
                    style="background-color: #f5f7fe"
                  >
                    <v-tab-item
                      v-for="(language, index) in languages"
                      :key="`${index}-${language}`"
                    >
                      <v-tabs
                        v-model="tab9"
                        hide-slider
                        background-color="#F5F7FE"
                      >
                        <v-tab class="text-none fs-13">
                          Quy định phụ thu
                        </v-tab>
                        <v-tab class="text-none fs-13"> Hủy đổi </v-tab>
                        <v-tab class="text-none fs-13"> Lưu ý </v-tab>
                      </v-tabs>
                      <v-tabs-items
                        v-model="tab9"
                        style="background-color: #f5f7fe"
                      >
                        <v-tab-item>
                          <vue-2-editor
                            id="vue-2-editor-fix-height-4"
                            :data="language.regulations"
                            :disabled="uncorrected"
                            @text-change="
                              set_value_editor(
                                $event,
                                language,
                                'regulations',
                                1
                              )
                            "
                          />
                          <div
                            v-if="language.regulations_msg.length !== 0"
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
                        <v-tab-item>
                          <vue-2-editor
                            id="vue-2-editor-fix-height-5"
                            :data="language.cancel_exchange"
                            :disabled="uncorrected"
                            @text-change="
                              set_value_editor(
                                $event,
                                language,
                                'cancel_exchange',
                                1
                              )
                            "
                          />
                          <div
                            v-if="language.cancel_exchange_msg.length !== 0"
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
                        <v-tab-item>
                          <vue-2-editor
                            id="vue-2-editor-fix-height-6"
                            :data="language.note2"
                            :disabled="uncorrected"
                            @text-change="
                              set_value_editor($event, language, 'note2', 1)
                            "
                          />
                          <div
                            v-if="language.note2_msg.length !== 0"
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
                    </v-tab-item>
                  </v-tabs-items>
                </v-col>

                <v-col cols="11">
                  <p class="ma-0 mt-2 fs-14 font-weight-bold">
                    Lưu ý đặt tour du lịch
                  </p>
                  <v-tabs v-model="tab10" background-color="#F5F7FE">
                    <v-tab
                      v-for="(language, index) in languages"
                      :key="`${index}-${language}`"
                      class="text-none"
                    >
                      {{ language.name }}
                    </v-tab>
                  </v-tabs>
                  <v-tabs-items
                    v-model="tab10"
                    style="background-color: #f5f7fe"
                  >
                    <v-tab-item
                      v-for="(language, index) in languages"
                      :key="`${index}-${language}`"
                    >
                      <vue-2-editor
                        id="vue-2-editor-fix-height-7"
                        :data="language.note_tour"
                        :disabled="uncorrected"
                        @text-change="
                          set_value_editor($event, language, 'note_tour', 0)
                        "
                      />
                    </v-tab-item>
                  </v-tabs-items>
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
                      :readonly="uncorrected"
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
                      :readonly="uncorrected"
                      @change="care === 0 ? (suggestion_msg = '') : ''"
                    />
                  </div>
                  <h3 ref="scroll_to_eight" />
                </v-col>

                <suggestions
                  ref="suggestions_tour"
                  :id-info="data.tour.id"
                  :readonly="uncorrected"
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

                <v-col cols="11">
                  <p class="ma-0 fs-14 font-weight-bold">
                    Chính sách hoàn tiền
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
                        id="vue-2-editor-fix-height-8"
                        :data="language.policy"
                        :disabled="uncorrected"
                        @text-change="
                          set_value_editor($event, language, 'policy', 0)
                        "
                      />
                    </v-tab-item>
                  </v-tabs-items>
                </v-col>

                <v-col cols="11">
                  <p class="ma-0 mt-2 fs-14 font-weight-bold">Lưu ý</p>
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
                      <vue-2-editor
                        id="vue-2-editor-fix-height-9"
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
import Vue from 'vue'
import moment from 'moment'
import Draggable from 'vuedraggable'

import SelectFile from '~/components/icon/SelectFile'

import Suggestions from '~/components/Product/edit/tour/suggestions/index'
import Schedule from '~/components/Product/edit/tour/schedule/index'
import DepartureSchedule from '~/components/Product/edit/tour/DepartureSchedule/index'
import Copy from '~/components/Product/copy'

Vue.prototype.moment = moment

export default {
  components: {
    Suggestions,
    Schedule,
    DepartureSchedule,
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
    hidden: 1,
    sku: '',
    tab: null,
    tab1: null,
    tab2: null,
    tab3: null,
    tab4: null,
    tab5: null,
    tab6: null,
    tab7: null,
    tab8: null,
    tab9: null,
    tab10: null,
    tab11: null,
    languages: [],
    enterprise: null,
    list_enterprise: [],
    phone: null,
    phone_msg: [],
    email: null,
    email_msg: [],
    category: [3],
    category_msg: [],
    list_category: [{ id: 3, name: 'Tour du lịch/ Vé tham quan' }],
    status: 1,
    status_msg: [],
    list_status: [
      { value: 1, color: '#47BBFF', text: 'Đang hoạt động' },
      { value: 2, color: '#FF0F59', text: 'Dừng hoạt động' },
      { value: 3, color: '#F5972D', text: 'Hết chỗ' },
    ],
    type: null,
    type_msg: [],
    list_type: [],
    path: '',
    evaluate: 1,
    care: 1,
    listsuggestion: [],
    suggestion_msg: '',
    open_reset: false,
    departure: null,
    departure_msg: [],
    place: null,
    place_msg: [],
    list_location: [],
    list_district: [],
    times: 1,
    daytime: 0,
    night: 0,
    night_focus: false,
    vehicle: null,
    list_vehicle: [],
    vehicle_msg: [],
    listschedule: [],
    schedules_msg: '',
    listdeparture: [],
    departure_type: 0,
    departuremsg: '',
    // xử lý files img
    list_files: [],
    reset_file: [],
    images: [],
    error_msg: '',
    maxrequied: 30,
    // backgroundImages: [],
    // suggestions: [],
    open_save: false,
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
            restaurant_msg: [],
            journeys: '',
            journeys_msg: [],
            introduce: '',
            introduce_msg: [],
            describe: '',
            policy: '',
            note: '',
            service: '',
            service_msg: [],
            service_no: '',
            service_no_msg: [],
            regulations: '',
            regulations_msg: [],
            cancel_exchange: '',
            cancel_exchange_msg: [],
            note2: '',
            note2_msg: [],
            note_tour: '',
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
      this.tab7 = null
      this.tab8 = null
      this.tab9 = null
      this.tab10 = null
      this.tab11 = null
      this.departure = null
      this.departure_msg = []
      this.place = null
      this.place_msg = []
      this.times = 1
      this.daytime = 0
      this.night = 0
      this.night_focus = false
      this.enterprise = null
      this.phone = null
      this.phone_msg = []
      this.email = null
      this.email_msg = []
      this.category = [3]
      this.category_msg = []
      this.vehicle = null
      this.vehicle_msg = []
      this.status = 1
      this.status_msg = []
      this.type = null
      this.type_msg = []
      this.evaluate = 1
      this.care = 1
      this.reset()
      this.list_files = []
      // this.backgroundImages = []
      this.listschedule = []
      this.$refs.suggestions_schedule.reset(1)
      // this.suggestions = []
      this.schedules_msg = ''
      this.$refs.suggestions_departure.reset()
      this.listdeparture = []
      this.departure_type = 0
      this.departuremsg = ''
      this.$refs.suggestions_tour.reset()
      this.listsuggestion = []
      this.suggestion_msg = ''
    },
    set_data() {
      // status = 1 sản phẩm do nhà cung cấp tạo
      if (this.data.tour.of_status === 1) {
        this.uncorrected = true
      }
      this.hidden = this.data.tour.enable
      this.sku = this.data.tour.sku
      this.set_languages()
      this.set_tour_province()
      this.set_tour_district()
      this.times = this.data.tour.time_type_id
      if (this.data.tour.time_type_id === 3) {
        this.daytime = this.data.tour.number_day
        this.night = this.data.tour.number_night
      }
      this.set_tour_enterprise()
      this.phone = this.data.tour.phone
      this.email = this.data.tour.email
      // this.set_tour_category()
      this.set_vehicle()
      this.status = this.data.tour.status
      this.set_tour_type()
      this.evaluate = this.data.tour.enable_rating
      this.care = this.data.tour.enable_suggestion

      const arrImg = []
      // const backgroundImages = []
      for (let i = 0; i < this.data.tourThumbnails.length; i++) {
        arrImg.push({
          id: this.data.tourThumbnails[i].id,
          img: this.data.tourThumbnails[i].url,
          file: '',
        })
      }
      this.list_files = [...arrImg]
      this.images = [...arrImg]

      this.departure_type = this.data.tour.depart_schedule_type
      if (this.departure_type === 1) {
        this.listdeparture = [
          this.data.tourDepartureScheduleDaily.adult_price,
          this.data.tourDepartureScheduleDaily.child_price,
        ]
      } else if (this.departure_type === 2) {
        this.listdeparture = [
          { value: this.data.tourDepartureScheduleWeekly.mo },
          { value: this.data.tourDepartureScheduleWeekly.tu },
          { value: this.data.tourDepartureScheduleWeekly.we },
          { value: this.data.tourDepartureScheduleWeekly.th },
          { value: this.data.tourDepartureScheduleWeekly.fr },
          { value: this.data.tourDepartureScheduleWeekly.sa },
          { value: this.data.tourDepartureScheduleWeekly.su },
          this.data.tourDepartureScheduleWeekly.adult_price,
          this.data.tourDepartureScheduleWeekly.child_price,
        ]
      } else if (this.departure_type === 3) {
        const listdeparture = []
        for (let i = 0; i < this.data.tourDepartureScheduleCustom.length; i++) {
          let time = []
          time = [
            moment(
              this.data.tourDepartureScheduleCustom[i].start_time,
              'DD/MM/YYYY HH:mm:ss'
            ).format('YYYY-MM-DD'),
            moment(
              this.data.tourDepartureScheduleCustom[i].return_time,
              'DD/MM/YYYY HH:mm:ss'
            ).format('YYYY-MM-DD'),
          ]
          listdeparture.push({
            id: this.data.tourDepartureScheduleCustom[i].id,
            time,
            adult_price: this.data.tourDepartureScheduleCustom[i].adult_price,
            chil_price: this.data.tourDepartureScheduleCustom[i].chil_price,
            currency: {
              value: this.data.tourDepartureScheduleCustom[i].adult_currency_id,
              text: this.data.tourDepartureScheduleCustom[i].currency_code,
            },
          })
        }
        this.listdeparture = [...listdeparture]
      }
    },
    toggle() {
      this.$emit('toggle')
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
    set_languages() {
      const LANGUAGE = [...this.$store.state.app.languages]
      const listschedule = []

      if ((LANGUAGE || []).length !== 0) {
        for (let i = 0; i < LANGUAGE.length; i++) {
          LANGUAGE[i] = {
            ...LANGUAGE[i],
            tour: !this.$isNullOrEmpty(this.data.tourLangs[i])
              ? this.data.tourLangs[i].name
              : '',
            journeys: !this.$isNullOrEmpty(this.data.tourLangs[i])
              ? this.data.tourLangs[i].journey
              : '',
            introduce: !this.$isNullOrEmpty(this.data.tourLangs[i])
              ? this.data.tourLangs[i].general_introduce
              : '',
            describe: !this.$isNullOrEmpty(this.data.tourLangs[i])
              ? this.data.tourLangs[i].sub_title
              : '',
            policy: !this.$isNullOrEmpty(this.data.tourLangs[i])
              ? this.data.tourLangs[i].refund_policy
              : '',
            note: !this.$isNullOrEmpty(this.data.tourLangs[i])
              ? this.data.tourLangs[i].note
              : '',
            service: !this.$isNullOrEmpty(this.data.tourLangs[i])
              ? this.data.tourLangs[i].service_includes
              : '',
            service_no: !this.$isNullOrEmpty(this.data.tourLangs[i])
              ? this.data.tourLangs[i].service_non_includes
              : '',
            regulations: !this.$isNullOrEmpty(this.data.tourLangs[i])
              ? this.data.tourLangs[i].surcharge_policy
              : '',
            cancel_exchange: !this.$isNullOrEmpty(this.data.tourLangs[i])
              ? this.data.tourLangs[i].cancel_exchange_policy
              : '',
            note2: !this.$isNullOrEmpty(this.data.tourLangs[i])
              ? this.data.tourLangs[i].note_policy
              : '',
            note_tour: !this.$isNullOrEmpty(this.data.tourLangs[i])
              ? this.data.tourLangs[i].order_note
              : '',
            path: !this.$isNullOrEmpty(this.data.tourLangs[i])
              ? this.data.tourLangs[i].url_seo
              : '',
            tour_msg: [],
            journeys_msg: [],
            introduce_msg: [],
            service_msg: [],
            service_no_msg: [],
            regulations_msg: [],
            cancel_exchange_msg: [],
            note2_msg: [],
            path_msg: [],
          }
          listschedule.push({
            ...LANGUAGE[i],
            list:
              (this.data.tourLangs[i] || '').length !== 0
                ? [...this.data.tourLangs[i].tourSchedules]
                : '',
          })
        }
      }
      this.languages = [...LANGUAGE]

      for (let i = 0; i < listschedule.length; i++) {
        for (let j = 0; j < listschedule[i].list.length; j++) {
          listschedule[i].list[j] = {
            name: LANGUAGE[i].name,
            journeys:
              (listschedule[i].list[j] || '').length !== 0
                ? listschedule[i].list[j].journeys
                : '',
            detail:
              (listschedule[i].list[j] || '').length !== 0
                ? listschedule[i].list[j].detail
                : '',
            day:
              (listschedule[i].list[j] || '').length !== 0
                ? listschedule[i].list[j].day
                : '',
            journey_msg: [],
            detail_msg: [],
          }
        }
      }
      this.listschedule = [...listschedule]
    },
    // set_tour_category() {
    //   this.$store.dispatch('product/hotel_category').then((res) => {
    //     if (!res.error) {
    //       this.list_category = res.data.data
    //
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
    // },
    set_tour_enterprise() {
      this.$store.dispatch('product/hotel_enterprise').then((res) => {
        if (!res.error) {
          this.list_enterprise = res.data.data
          this.enterprise = this.data.tour.enterprise_id
        }
      })
    },
    set_vehicle() {
      this.$store.dispatch('product/tour_vehicle').then((res) => {
        if (!res.error) {
          this.list_vehicle = res.data.data
          this.vehicle = this.data.tour.vehicle_id
        }
      })
    },
    set_tour_type() {
      this.$store.dispatch('product/tour_type').then((res) => {
        if (!res.error) {
          this.list_type = res.data.data
          this.type = this.data.tour.tour_type_id
        }
      })
    },
    set_tour_province() {
      this.$store.dispatch('product/tour_province').then((res) => {
        if (!res.error) {
          this.list_location = res.data.data
          this.departure = this.data.tour.start_place_id
        }
      })
    },
    set_tour_district() {
      this.$store.dispatch('product/tour_district').then((res) => {
        if (!res.error) {
          this.list_district = res.data.data
          this.place = this.data.tour.staged_place_id
        }
      })
    },
    set_suggestions(items) {
      // this.$log.debug(items)
      this.listsuggestion = [...items]
      this.suggestion_msg = ''
    },
    set_schedules(items) {
      this.listschedule = items
      this.schedules_msg = ''
    },
    set_departure(obj) {
      this.departure_type = obj.type
      this.listdeparture = obj.items
      this.departuremsg = ''
    },
    set_value(value, field) {
      if (value < 0 && field === 'daytime') {
        this[field] = 1
      }
      if (value < 0 && field === 'night') {
        this[field] = 0
      }
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

      for (let i = 0; i < this.languages.length; i++) {
        if ((this.languages[i].tour || '').trim().length === 0) {
          hasErrors = true
          this.languages[i].tour_msg = 'Không được để trống'
          this.tab = i
          count += 1
          this.check_scroll(count1, 'scroll_to_one')
          count1 += 1
        } else if (this.languages[i].tour.length > 500) {
          hasErrors = true
          this.languages[i].tour_msg = 'Không được vượt quá 500 ký tự'
          this.tab = i
          count += 1
          this.check_scroll(count1, 'scroll_to_one')
          count1 += 1
        }
        if ((this.languages[i].journeys || '').trim().length === 0) {
          hasErrors = true
          this.languages[i].journeys_msg = 'Không được để trống'
          this.tab1 = i
          count += 1
          this.check_scroll(count1, 'scroll_to_one')
          count1 += 1
        } else if (this.languages[i].journeys.length > 5000) {
          hasErrors = true
          this.languages[i].journeys_msg = 'Không được vượt quá 5000 ký tự'
          this.tab1 = i
          count += 1
          this.check_scroll(count1, 'scroll_to_one')
          count1 += 1
        }
        if ((this.languages[i].introduce || '').trim().length === 0) {
          hasErrors = true
          this.languages[i].introduce_msg = 'Không được để trống'
          this.tab2 = i
          count += 1
          this.check_scroll(count1, 'scroll_to_two')
          count1 += 1
        }
        if ((this.languages[i].service || '').trim().length === 0) {
          hasErrors = true
          this.languages[i].service_msg = 'Không được để trống'
          this.tab6 = i
          this.tab7 = 0
          count += 1
          this.check_scroll(count1, 'scroll_to_six')
          count1 += 1
        }
        if ((this.languages[i].service_no || '').trim().length === 0) {
          hasErrors = true
          this.languages[i].service_no_msg = 'Không được để trống'
          this.tab6 = i
          this.tab7 = 1
          count += 1
          this.check_scroll(count1, 'scroll_to_six')
          count1 += 1
        }
        if ((this.languages[i].regulations || '').trim().length === 0) {
          hasErrors = true
          this.languages[i].regulations_msg = 'Không được để trống'
          this.tab8 = i
          this.tab9 = 0
          count += 1
          this.check_scroll(count1, 'scroll_to_seven')
          count1 += 1
        }
        if ((this.languages[i].cancel_exchange || '').trim().length === 0) {
          hasErrors = true
          this.languages[i].cancel_exchange_msg = 'Không được để trống'
          this.tab8 = i
          this.tab9 = 1
          count += 1
          this.check_scroll(count1, 'scroll_to_seven')
          count1 += 1
        }
        if ((this.languages[i].note2 || '').trim().length === 0) {
          hasErrors = true
          this.languages[i].note2_msg = 'Không được để trống'
          this.tab8 = i
          this.tab9 = 2
          count += 1
          this.check_scroll(count1, 'scroll_to_seven')
          count1 += 1
        }
      }

      if ((this.category || []).length === 0) {
        hasErrors = true
        this.category_msg = 'Không được để trống'
        count += 1
        this.check_scroll(count1, 'scroll_to_three')
        count1 += 1
      }

      // if ((this.status || []).length === 0) {
      //   hasErrors = true
      //   this.status_msg = 'Không được để trống'
      //   count += 1
      // }

      if ((this.type || []).length === 0) {
        hasErrors = true
        this.type_msg = 'Không được để trống'
        count += 1
        this.check_scroll(count1, 'scroll_to_three')
        count1 += 1
      }

      if ((this.list_files || []).length === 0) {
        hasErrors = true
        this.error_msg = 'Không được để trống'
        count += 1
        this.check_scroll(count1, 'scroll_to_three')
        count1 += 1
      }

      if ((this.listsuggestion || []).length === 0 && this.care === 1) {
        hasErrors = true
        this.suggestion_msg = 'Không được để trống'
        count += 1
        this.check_scroll(count1, 'scroll_to_eight')
        count1 += 1
      }

      if ((this.listschedule || []).length === 0) {
        hasErrors = true
        this.schedules_msg = 'Không được để trống'
        count += 1
        this.check_scroll(count1, 'scroll_to_four')
        count1 += 1
      }

      if (this.departure_type === 1) {
        for (let i = 0; i < this.listdeparture.length; i++) {
          if (this.listdeparture[i] <= 0) {
            hasErrors = true
            this.departuremsg = 'Không được để trống'
            count += 1
            this.check_scroll(count1, 'scroll_to_five')
            count1 += 1
          }
        }
      } else if (this.departure_type === 2) {
        let check = 0
        for (let i = 0; i < this.listdeparture.length - 2; i++) {
          if (this.listdeparture[i].value === 0) {
            check += 1
          }
          if (check === 7) {
            hasErrors = true
            this.departuremsg = 'Không được để trống'
            count += 1
            this.check_scroll(count1, 'scroll_to_five')
            count1 += 1
          }
        }
        if (
          parseInt(this.listdeparture[7] || 0) <= 0 ||
          parseInt(this.listdeparture[8] || 0) <= 0
        ) {
          hasErrors = true
          this.departuremsg = 'Không được để trống'
          count += 1
          this.check_scroll(count1, 'scroll_to_five')
          count1 += 1
        }
      }
      if ((this.listdeparture || []).length === 0) {
        hasErrors = true
        this.departuremsg = 'Không được để trống'
        count += 1
        this.check_scroll(count1, 'scroll_to_five')
        count1 += 1
      }

      if ((this.departure || []).length === 0) {
        hasErrors = true
        this.departure_msg = 'Không được để trống'
        count += 1
        this.check_scroll(count1, 'scroll_to_one')
        count1 += 1
      }

      if ((this.place || []).length === 0) {
        hasErrors = true
        this.place_msg = 'Không được để trống'
        count += 1
        this.check_scroll(count1, 'scroll_to_one')
        count1 += 1
      }

      if ((this.vehicle || []).length === 0) {
        hasErrors = true
        this.vehicle_msg = 'Không được để trống'
        count += 1
        this.check_scroll(count1, 'scroll_to_three')
        count1 += 1
      }

      if (count > 0) {
        this.$showWarnNotify(this, 'Bạn nhập thiếu thông tin bắt buộc')
      }

      if (this.times === 3) {
        if (this.daytime < 3) {
          hasErrors = true
          this.$showWarnNotify(
            this,
            'Số ngày đã tồn tại bạn cần lựa chọn số ngày ít nhất là 3'
          )
        } else {
          const check = parseInt(this.daytime) - parseInt(this.night)
          if (check !== 1 && check !== 0 && check !== -1) {
            hasErrors = true
            this.$showWarnNotify(
              this,
              'Thông tin không chính xác, bạn cần nhập lại số Đêm'
            )
            this.night_focus = true
          }
        }
      }

      if (count1 > 0) {
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
      }
    },
    upload_cover_image(check) {
      const folder = 'tour-product-cover-img'
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
      const tourLangList = []
      const tourDepartureScheduleList = []
      let tourDepartureScheduleListDaily = null
      let tourDepartureScheduleListWeekly = null
      const tourSuggestionList = []
      const tourThumbnailList = []

      for (let i = 0; i < this.languages.length; i++) {
        tourLangList.push({
          lang_id: this.languages[i].id,
          name: (this.languages[i].tour || '').trim(),
          journey: (this.languages[i].journeys || '').trim(),
          sub_title: (this.languages[i].describe || '').trim(),
          general_introduce: (this.languages[i].introduce || '').trim(),
          order_note: (this.languages[i].note_tour || '').trim(),
          refund_policy: (this.languages[i].policy || '').trim(),
          note: (this.languages[i].note || '').trim(),
          service_includes: (this.languages[i].service || '').trim(),
          service_non_includes: (this.languages[i].service_no || '').trim(),
          surcharge_policy: (this.languages[i].regulations || '').trim(),
          cancel_exchange_policy: (
            this.languages[i].cancel_exchange || ''
          ).trim(),
          note_policy: (this.languages[i].note2 || '').trim(),
          url_seo: (this.languages[i].path || '').trim(),
          tourSchedules: [...this.listschedule[i].list],
        })
      }

      if (this.departure_type === 1) {
        tourDepartureScheduleListDaily = {
          adult_price: this.listdeparture[0],
          child_price: this.listdeparture[1],
        }
      } else if (this.departure_type === 2) {
        tourDepartureScheduleListWeekly = {
          mo: this.listdeparture[0].value,
          tu: this.listdeparture[1].value,
          we: this.listdeparture[2].value,
          th: this.listdeparture[3].value,
          fr: this.listdeparture[4].value,
          sa: this.listdeparture[5].value,
          su: this.listdeparture[6].value,
          adult_price: this.listdeparture[7],
          child_price: this.listdeparture[8],
        }
      } else if (this.departure_type === 3) {
        for (let i = 0; i < this.listdeparture.length; i++) {
          tourDepartureScheduleList.push({
            start_time: moment(
              this.listdeparture[i].time[0],
              'YYYY-MM-DD'
            ).format('DD/MM/YYYY 11:00:00'),
            return_time: moment(
              this.listdeparture[i].time[1],
              'YYYY-MM-DD'
            ).format('DD/MM/YYYY 11:00:00'),
            adult_price: parseInt(this.listdeparture[i].adult_price),
            child_price: parseInt(this.listdeparture[i].chil_price),
            status: 1,
            adult_currency_id: this.listdeparture[i].currency.value,
            child_currency_id: this.listdeparture[i].currency.value,
          })
        }
      }

      for (let i = 0; i < this.listsuggestion.length; i++) {
        tourSuggestionList.push({
          id: this.listsuggestion[i].id,
          type: this.listsuggestion[i].product_type,
        })
      }

      for (let i = 0; i < this.list_files.length; i++) {
        tourThumbnailList.push({
          url: this.list_files[i].img,
          type: 1, // ảnh
        })
      }

      let daytime = 0
      let night = 0

      if (this.times === 1) {
        daytime = 1
        night = 0
      } else if (this.times === 2) {
        daytime = 2
        night = 1
      } else if (this.times === 3) {
        daytime = this.daytime
        night = this.night
      }

      const DATA = {
        id: this.data.tour.id,
        sku: this.sku,
        enable: this.hidden,
        start_place_id: this.departure,
        staged_place_id: this.place,
        time_type_id: this.times,
        number_day: daytime,
        number_night: night,
        enterprise_id: this.enterprise,
        phone: this.phone,
        email: this.email,
        rating_level_id: 1,
        product_category_ids: this.category,
        vehicle_id: this.vehicle,
        status: this.status,
        tour_type_id: this.type,
        enable_rating: this.evaluate,
        enable_suggestion: this.care,
        tourThumbnailList,
        tourSuggestionList,
        tourLangList,
        depart_schedule_type: this.departure_type,
        tour_departure_schedule_daily: tourDepartureScheduleListDaily,
        tour_departure_schedule_weekly: tourDepartureScheduleListWeekly,
        tour_departure_schedule_custom: tourDepartureScheduleList,
      }

      this.$store.dispatch('product/tour_edit', DATA).then((res) => {
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

      const tourLangList = []
      const tourDepartureScheduleList = []
      let tourDepartureScheduleListDaily = null
      let tourDepartureScheduleListWeekly = null
      const tourSuggestionList = []
      const tourThumbnailList = []

      for (let i = 0; i < this.languages.length; i++) {
        tourLangList.push({
          lang_id: this.languages[i].id,
          name: (this.languages[i].tour || '').trim(),
          journey: (this.languages[i].journeys || '').trim(),
          sub_title: (this.languages[i].describe || '').trim(),
          general_introduce: (this.languages[i].introduce || '').trim(),
          order_note: (this.languages[i].note_tour || '').trim(),
          refund_policy: (this.languages[i].policy || '').trim(),
          note: (this.languages[i].note || '').trim(),
          service_includes: (this.languages[i].service || '').trim(),
          service_non_includes: (this.languages[i].service_no || '').trim(),
          surcharge_policy: (this.languages[i].regulations || '').trim(),
          cancel_exchange_policy: (
            this.languages[i].cancel_exchange || ''
          ).trim(),
          note_policy: (this.languages[i].note2 || '').trim(),
          url_seo: null,
          tourSchedules: [...this.listschedule[i].list],
        })
      }

      if (this.departure_type === 1) {
        tourDepartureScheduleListDaily = {
          adult_price: this.listdeparture[0],
          child_price: this.listdeparture[1],
        }
      } else if (this.departure_type === 2) {
        tourDepartureScheduleListWeekly = {
          mo: this.listdeparture[0].value,
          tu: this.listdeparture[1].value,
          we: this.listdeparture[2].value,
          th: this.listdeparture[3].value,
          fr: this.listdeparture[4].value,
          sa: this.listdeparture[5].value,
          su: this.listdeparture[6].value,
          adult_price: this.listdeparture[7],
          child_price: this.listdeparture[8],
        }
      } else if (this.departure_type === 3) {
        for (let i = 0; i < this.listdeparture.length; i++) {
          tourDepartureScheduleList.push({
            start_time: moment(
              this.listdeparture[i].time[0],
              'YYYY-MM-DD'
            ).format('DD/MM/YYYY 11:00:00'),
            return_time: moment(
              this.listdeparture[i].time[1],
              'YYYY-MM-DD'
            ).format('DD/MM/YYYY 11:00:00'),
            adult_price: parseInt(this.listdeparture[i].adult_price),
            child_price: parseInt(this.listdeparture[i].chil_price),
            status: 1,
            adult_currency_id: this.listdeparture[i].currency.value,
            child_currency_id: this.listdeparture[i].currency.value,
          })
        }
      }

      for (let i = 0; i < this.listsuggestion.length; i++) {
        tourSuggestionList.push({
          id: this.listsuggestion[i].id,
          type: this.listsuggestion[i].product_type,
        })
      }

      for (let i = 0; i < this.list_files.length; i++) {
        tourThumbnailList.push({
          url: this.list_files[i].img,
          type: 1, // ảnh
        })
      }

      let daytime = 0
      let night = 0

      if (this.times === 1) {
        daytime = 1
        night = 0
      } else if (this.times === 2) {
        daytime = 2
        night = 1
      } else if (this.times === 3) {
        daytime = this.daytime
        night = this.night
      }

      const DATA = {
        id: this.data.tour.id,
        sku: this.sku,
        enable: this.hidden,
        start_place_id: this.departure,
        staged_place_id: this.place,
        time_type_id: this.times,
        number_day: daytime,
        number_night: night,
        enterprise_id: this.enterprise,
        phone: this.phone,
        email: this.email,
        rating_level_id: 1,
        product_category_ids: this.category,
        vehicle_id: this.vehicle,
        status: this.status,
        tour_type_id: this.type,
        enable_rating: this.evaluate,
        enable_suggestion: this.care,
        tourThumbnailList,
        tourSuggestionList,
        tourLangList,
        depart_schedule_type: this.departure_type,
        tour_departure_schedule_daily: tourDepartureScheduleListDaily,
        tour_departure_schedule_weekly: tourDepartureScheduleListWeekly,
        tour_departure_schedule_custom: tourDepartureScheduleList,
      }

      this.$store
        .dispatch('product/review_tour', DATA)
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
        product_id: this.data.tour.id,
        product_type: this.$store.state.app.product_type.tour,
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
        return window.document.getElementById('product-img-tour-room').click()
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

<style lang="scss" scoped>
.add-product-tour-info {
  /* .fix-height {
    max-height: calc(100vh - 200px);
    overflow-x: hidden;
    overflow-y: auto;
  } */

  .v-slider--horizontal {
    margin: 0 !important;
  }
}
</style>
