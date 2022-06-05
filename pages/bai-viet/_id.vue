<template>
  <div v-if="checkRole()" class="main_list_posts">
    <!-- // chức năng -->
    <div class="d-flex w-100 actions-coordinates-1 mr-5">
      <div class="flex-grow-1"></div>

      <v-btn
        v-if="choose_form === 1"
        class="text-none white--text mr-3"
        color="#4873C2"
        dark
        depressed
        width="120px"
        @click="validate_view_default"
      >
        <img class="mr-1" src="~/assets/icon/view.svg" />
        Xem trước
      </v-btn>

      <v-btn
        v-if="choose_form === 2"
        class="text-none white--text mr-3"
        color="#4873C2"
        dark
        depressed
        width="120px"
        @click="validata_view_promotions"
      >
        <img class="mr-1" src="~/assets/icon/view.svg" />
        Xem trước
      </v-btn>

      <div
        v-if="text_save_publication === 0"
        class="d-flex w-100 actions-coordinates-2"
      >
        <div class="flex-grow-1"></div>
        <v-btn
          color="error"
          class="text-none white--text mr-3"
          depressed
          width="90"
          @click="open_cancel = true"
          >Hủy</v-btn
        >
        <v-btn
          class="text-none white--text mr-3"
          color="#47BBFF"
          dark
          depressed
          @click="open_add_save = true"
          >Lưu nháp</v-btn
        >
        <v-btn
          class="text-none white--text mr-3"
          color="#47BBFF"
          dark
          depressed
          @click="open_add_save_print = true"
          >Lưu và xuất bản</v-btn
        >
      </div>

      <div
        v-if="text_save_publication === 1"
        class="d-flex w-100 actions-coordinates-2"
      >
        <div class="flex-grow-1"></div>
        <div>
          <v-btn
            color="error"
            class="text-none white--text mr-3"
            depressed
            width="90"
            @click="open_cancel = true"
            >Hủy</v-btn
          >
        </div>
        <div v-if="choose_form === 1">
          <v-btn
            class="text-none white--text mr-3"
            color="#47BBFF"
            dark
            width="90"
            depressed
            @click="open_save_draft_default = true"
            >Lưu
          </v-btn>
        </div>
        <div v-if="choose_form === 2">
          <v-btn
            class="text-none white--text mr-3"
            color="#47BBFF"
            dark
            depressed
            width="90"
            @click="open_save_draft_promotion = true"
            >Lưu
          </v-btn>
        </div>
      </div>
    </div>
    <!-- //noi dung -->

    <div class="pb-16">
      <div class="pt-16 ml-16 mr-3">
        <div class="d-flex">
          <div class="font-weight-bold fs-17 pr-7 pt-1">Hiển thị/ Ẩn</div>
          <v-switch
            v-model="page_status"
            color="#47bbff"
            class="mt-0 mr-5"
            inset
            :true-value="1"
            :false-value="0"
          ></v-switch>
          <div v-if="text_save_publication === 0" class="pt-1 error--text">
            Lưu nháp
          </div>
          <div v-if="text_save_publication === 1" class="pt-1 primary--text">
            Đã xuất bản
          </div>
        </div>

        <p class="ma-0 fs-14 font-weight-bold">
          Mẫu bài viết <span class="error--text ml-1">*</span>
        </p>
        <div>
          <v-row>
            <v-col cols="11" class="py-0 pr-0">
              <v-select
                v-model="choose_form"
                :items="form_status"
                :error-messages="choose_form_error"
                solo
                dense
                flat
                placeholder="chọn mẫu bài viết"
                :menu-props="{ zIndex: '1' }"
                class="border-1 fs-14"
                @input="choose_form_error = []"
                @change="open_change = true"
              ></v-select>
            </v-col>
          </v-row>
        </div>
      </div>
      <!-- // chọn mặc định -->
      <!-- <mac-dinh v-if="choose_form == 1" ref="validateDefault"></mac-dinh> -->

      <div v-if="choose_form === 1" class="ml-16">
        <p class="ma-0 fs-14 font-weight-bold">
          Tên bài viết <span class="error--text ml-1">*</span>
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
            <v-col class="pa-0" cols="11">
              <v-text-field
                v-model="language.name_posts_default"
                :error-messages="language.name_posts_default_error"
                placeholder="Nhập địa chỉ"
                class="border-1 fs-14"
                solo
                flat
                dense
                @input="language.name_posts_default_error = []"
              >
              </v-text-field>
            </v-col>
          </v-tab-item>
        </v-tabs-items>
        <p class="ma-0 fs-14 font-weight-bold">
          Danh mục bài viết <span class="error--text ml-1">*</span>
        </p>
        <v-col class="pa-0" cols="11">
          <v-autocomplete
            v-model="category_posts_default"
            :error-messages="category_posts_default_error"
            :items="choose_status_category"
            multiple
            solo
            dense
            flat
            class="border-1 fs-14"
            :menu-props="{ zIndex: '1' }"
            placeholder="chọn danh mục bài viết"
            @input="category_posts_default_error = []"
          ></v-autocomplete>
        </v-col>

        <v-col class="py-0 px-0" cols="11">
          <p class="ma-0 fs-14 font-weight-bold">URL thân thiện cho SEO</p>

          <v-col class="py-0 d-flex" cols="12"> </v-col>

          <v-tabs v-model="tab1" background-color="#F5F7FE">
            <v-tab
              v-for="(language, index) in languages"
              :key="`${index}-${language}`"
              class="text-none"
            >
              {{ language.name }}
            </v-tab>
          </v-tabs>
          <v-tabs-items v-model="tab1" style="background-color: #f5f7fe">
            <v-tab-item
              v-for="(language, index) in languages"
              :key="`${index}-${language}`"
            >
              <div class="d-flex">
                <v-text-field
                  v-model="language.path_default"
                  :error-messages="language.path_default_error"
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
                      style="height: 38px; width: 38px; min-width: 38px"
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
                {{ `${$store.state.app.domain_name}${language.path_default}` }}
              </div>
            </v-tab-item>
          </v-tabs-items>
        </v-col>
        <div>
          <v-row>
            <v-col cols="6">
              <v-row class="ml-10">
                <v-col cols="auto">
                  <p class="font-weight-bold fs-14">
                    Ảnh thu nhỏ <span class="error--text pl-1">*</span>
                  </p>
                </v-col>

                <v-col cols="auto">
                  <!-- ảnh thu nhỏ mặc định -->
                  <div>
                    <div class="d-flex align-center">
                      <div
                        v-if="(image_zoom_out_default || []).length === 0"
                        style="cursor: pointer; width: fit-content"
                        @click="select_file_zoom_out_default"
                      >
                        <SelectFile class="rounded" />
                      </div>
                      <div v-else>
                        <v-img
                          class="rounded"
                          style="cursor: pointer"
                          :src="image_zoom_out_default"
                          width="120"
                          height="120"
                          @click="select_file_zoom_out_default"
                        />
                      </div>
                      <v-btn
                        v-if="!hidden_zoom_out_default"
                        class="text-none text-body-2 rounded ml-4"
                        color="white"
                        height="32"
                        style="color: #47bbff"
                        depressed
                        @click="select_file_zoom_out_default"
                      >
                        Chỉnh sửa
                      </v-btn>
                    </div>
                    <div
                      class="v-messages theme--light error--text mt-1"
                      role="alert"
                    >
                      <div class="v-messages__wrapper">
                        <div class="v-messages__message">
                          {{ image_zoom_out_default_error }}
                        </div>
                      </div>
                    </div>
                    <div
                      v-if="limited_msg_zoom_out_default.length !== 0"
                      class="v-messages theme--light error--text mt-1"
                      role="alert"
                    >
                      <div class="v-messages__wrapper">
                        <div class="v-messages__message">
                          {{ limited_msg_zoom_out_default }}
                        </div>
                      </div>
                    </div>
                    <v-file-input
                      id="input_zoom_out_default_file"
                      ref="input_zoom_out_default_file"
                      accept="image/png, image/jpeg, image/gif"
                      class="d-none"
                      :value="reset_file_zoom_out_default"
                      @change="inputFileZoomOutDefault($event)"
                    />
                  </div>
                  <!-- end ảnh thu nhỏ mặc đinh  -->
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="6">
              <v-row>
                <v-col cols="3" class="pr-1">
                  <p class="font-weight-bold fs-14">
                    Ảnh bìa <span class="error--text pl-1">*</span>
                  </p>
                </v-col>

                <v-col cols="auto">
                  <!-- ảnh bìa mặc định -->

                  <div>
                    <div class="d-flex align-center">
                      <div
                        v-if="(image_avatar_default || []).length === 0"
                        style="cursor: pointer; width: fit-content"
                        @click="select_file_avatar_default"
                      >
                        <SelectFile class="rounded" />
                      </div>
                      <div v-else>
                        <v-img
                          class="rounded"
                          style="cursor: pointer"
                          :src="image_avatar_default"
                          width="120"
                          height="120"
                          @click="select_file_avatar_default"
                        />
                      </div>
                      <v-btn
                        v-if="!hidden_avatar_default"
                        class="text-none text-body-2 rounded ml-4"
                        color="white"
                        height="32"
                        style="color: #47bbff"
                        depressed
                        @click="select_file_avatar_default"
                      >
                        Chỉnh sửa
                      </v-btn>
                    </div>
                    <div
                      class="v-messages theme--light error--text mt-1"
                      role="alert"
                    >
                      <div class="v-messages__wrapper">
                        <div class="v-messages__message">
                          {{ image_avatar_default_error }}
                        </div>
                      </div>
                    </div>
                    <div
                      v-if="limited_msg_avatar_default.length !== 0"
                      class="v-messages theme--light error--text mt-1"
                      role="alert"
                    >
                      <div class="v-messages__wrapper">
                        <div class="v-messages__message">
                          {{ limited_msg_avatar_default }}
                        </div>
                      </div>
                    </div>
                    <v-file-input
                      id="input_avatar_default_file"
                      accept="image/png, image/jpeg, image/gif"
                      class="d-none"
                      :value="reset_file_avatar_default"
                      @change="inputFileAvatarDefault($event)"
                    />
                  </div>

                  <!-- end ảnh bìa mặc định -->
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </div>
        <div class="d-flex">
          <div class="fs-14 mt-4 font-weight-bold" style="margin-right: 100px">
            Đánh giá
          </div>
          <v-switch
            v-model="status_evaluate_default"
            class="mt-3"
            color="#47bbff"
            :true-value="1"
            :false-value="0"
            inset
          ></v-switch>
        </div>
        <div class="d-flex">
          <div class="fs-14 mr-5 mt-4 font-weight-bold">
            Có thể bạn quan tâm
          </div>
          <v-switch
            v-model="stauts_care_default"
            class="mt-3"
            color="#47bbff"
            :false-value="0"
            :true-value="1"
            inset
            @change="stauts_care_default === 0 ? (suggestion_msg = '') : ''"
          ></v-switch>
        </div>
        <v-col cols="11" class="py-0">
          <suggestions
            ref="suggestionsDefault"
            :id-info="$route.params.id"
            @set_data="set_suggestions"
          >
            <span v-if="stauts_care_default === 1" class="error--text ml-1"
              >*</span
            >
          </suggestions>
          <v-col cols="12" class="ml-2">
            <div class="v-messages theme--light error--text mt-1" role="alert">
              <div class="v-messages__wrapper">
                <div class="v-messages__message">
                  {{ suggestion_msg }}
                </div>
              </div>
            </div>
          </v-col>
        </v-col>

        <div>
          <p class="ma-0 fs-14 font-weight-bold">
            Nội dung <span class="error--text">*</span>
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
          <v-tabs-items v-model="tab2" style="background-color: #f5f7fe">
            <v-tab-item
              v-for="(language, index) in languages"
              :key="`${index}-${language}`"
            >
              <v-col class="pa-0" cols="11">
                <vue-editor
                  v-model="language.category_posts_content_default"
                  use-custom-image-handler
                  :editor-toolbar="customToolbar"
                  @image-added="handleImageAdded"
                  @text-change="
                    language.category_posts_content_default_error = []
                  "
                ></vue-editor>
              </v-col>
            </v-tab-item>
          </v-tabs-items>
        </div>
      </div>
      <!-- end mặc định -->
      <!-- // chọn khuyến mại -->
      <!-- <khuyen-mai v-if="choose_form == 2" ref="validatePromotion"></khuyen-mai> -->
      <div v-if="choose_form === 2">
        <div class="ml-16">
          <p class="ma-0 fs-14 font-weight-bold">
            Tên bài viết <span class="error--text ml-1">*</span>
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
              <v-col class="pa-0" cols="11">
                <v-text-field
                  v-model="language.name_posts_promotion"
                  :error-messages="language.name_posts_promotion_error"
                  placeholder="Nhập địa chỉ"
                  class="border-1 fs-14"
                  solo
                  flat
                  dense
                  @input="language.name_posts_promotion_error = []"
                >
                </v-text-field>
              </v-col>
            </v-tab-item>
          </v-tabs-items>
          <p class="ma-0 fs-14 font-weight-bold">
            Danh mục bài viết <span class="error--text ml-1">*</span>
          </p>

          <v-col class="pa-0" cols="11">
            <v-autocomplete
              v-model="category_posts_promotion"
              :error-messages="category_posts_promotion_error"
              :items="choose_status_category"
              multiple
              solo
              dense
              flat
              class="border-1 fs-14"
              :menu-props="{ zIndex: '1' }"
              placeholder="chọn danh mục bài viết"
              @input="category_posts_promotion_error = []"
            ></v-autocomplete>
          </v-col>

          <v-col class="py-0 px-0" cols="11">
            <p class="ma-0 fs-14 font-weight-bold">URL thân thiện cho SEO</p>

            <v-col class="py-0 d-flex" cols="12"> </v-col>

            <v-tabs v-model="tab1" background-color="#F5F7FE">
              <v-tab
                v-for="(language, index) in languages"
                :key="`${index}-${language}`"
                class="text-none"
              >
                {{ language.name }}
              </v-tab>
            </v-tabs>
            <v-tabs-items v-model="tab1" style="background-color: #f5f7fe">
              <v-tab-item
                v-for="(language, index) in languages"
                :key="`${index}-${language}`"
              >
                <div class="d-flex">
                  <v-text-field
                    v-model="language.path_promotion"
                    :error-messages="language.path_promotion_error"
                    class="border-1 rounded-r-0 fs-14"
                    solo
                    flat
                    dense
                    @input="validate_url1(language)"
                  >
                    <template v-slot:prepend-inner>
                      {{ $store.state.app.domain_name }}
                    </template>
                  </v-text-field>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        class="rounded-l-0"
                        style="height: 38px; width: 38px; min-width: 38px"
                        color="primary"
                        depressed
                        v-bind="attrs"
                        v-on="on"
                        @click="copy_text1(`copy-text-${index}`)"
                      >
                        <v-icon> mdi-content-copy </v-icon>
                      </v-btn>
                    </template>
                    <span>Copy</span>
                  </v-tooltip>
                </div>
                <div :id="`copy-text-${index}`" class="d-none">
                  {{
                    `${$store.state.app.domain_name}${language.path_promotion}`
                  }}
                </div>
              </v-tab-item>
            </v-tabs-items>
          </v-col>
          <div>
            <v-row>
              <v-col cols="6">
                <v-row class="ml-10">
                  <v-col cols="auto">
                    <p class="font-weight-bold fs-14">
                      Ảnh thu nhỏ <span class="error--text">*</span>
                    </p>
                  </v-col>

                  <v-col cols="auto">
                    <div>
                      <div class="d-flex align-center">
                        <div
                          v-if="(image_zoom_out_promotion || []).length === 0"
                          style="cursor: pointer; width: fit-content"
                          @click="select_file_zoom_out_promotion"
                        >
                          <SelectFile class="rounded" />
                        </div>
                        <div v-else>
                          <v-img
                            class="rounded"
                            style="cursor: pointer"
                            :src="image_zoom_out_promotion"
                            width="120"
                            height="120"
                            @click="select_file_zoom_out_promotion"
                          />
                        </div>
                        <v-btn
                          v-if="!hidden_zoom_out_promotion"
                          class="text-none text-body-2 rounded ml-4"
                          color="white"
                          height="32"
                          style="color: #47bbff"
                          depressed
                          @click="select_file_zoom_out_promotion"
                        >
                          Chỉnh sửa
                        </v-btn>
                      </div>
                      <div
                        class="v-messages theme--light error--text mt-1"
                        role="alert"
                      >
                        <div class="v-messages__wrapper">
                          <div class="v-messages__message">
                            {{ image_zoom_out_promotion_error }}
                          </div>
                        </div>
                      </div>
                      <div
                        v-if="limited_msg_zoom_out_promotion.length !== 0"
                        class="v-messages theme--light error--text mt-1"
                        role="alert"
                      >
                        <div class="v-messages__wrapper">
                          <div class="v-messages__message">
                            {{ limited_msg_zoom_out_promotion }}
                          </div>
                        </div>
                      </div>
                      <v-file-input
                        id="input_zoom_out_promotion_file"
                        accept="image/png, image/jpeg, image/gif"
                        class="d-none"
                        :value="reset_file_zoom_out_promotion"
                        @change="inputFileZoomOutPromotion($event)"
                      />
                    </div>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="6">
                <v-row>
                  <v-col cols="2">
                    <p class="font-weight-bold fs-14">
                      Ảnh bìa <span class="error--text">*</span>
                    </p>
                  </v-col>

                  <v-col cols="auto">
                    <div>
                      <div class="d-flex align-center">
                        <div
                          v-if="(image_avatar_promotion || []).length === 0"
                          style="cursor: pointer; width: fit-content"
                          @click="select_file_avatar_promotion"
                        >
                          <SelectFile class="rounded" />
                        </div>
                        <div v-else>
                          <v-img
                            class="rounded"
                            style="cursor: pointer"
                            :src="image_avatar_promotion"
                            width="120"
                            height="120"
                            @click="select_file_avatar_promotion"
                          />
                        </div>
                        <v-btn
                          v-if="!hidden_avatar_promotion"
                          class="text-none text-body-2 rounded ml-4"
                          color="white"
                          height="32"
                          style="color: #47bbff"
                          depressed
                          @click="select_file_avatar_promotion"
                        >
                          Chỉnh sửa
                        </v-btn>
                      </div>
                      <div
                        class="v-messages theme--light error--text mt-1"
                        role="alert"
                      >
                        <div class="v-messages__wrapper">
                          <div class="v-messages__message">
                            {{ image_avatar_promotion_error }}
                          </div>
                        </div>
                      </div>
                      <div
                        v-if="limited_msg_avatar_promotion.length !== 0"
                        class="v-messages theme--light error--text mt-1"
                        role="alert"
                      >
                        <div class="v-messages__wrapper">
                          <div class="v-messages__message">
                            {{ limited_msg_avatar_promotion }}
                          </div>
                        </div>
                      </div>
                      <v-file-input
                        id="input_avatar_promotion_file"
                        accept="image/png, image/jpeg, image/gif"
                        class="d-none"
                        :value="reset_file_avatar_promotion"
                        @change="inputFileAvatarPromotion($event)"
                      />
                    </div>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </div>
          <p class="mb-0 fs-14 font-weight-bold">
            Mã khuyến mại <span class="error--text pl-1">*</span>
          </p>
          <v-row>
            <v-col cols="11" class="py-0 pr-0">
              <v-text-field
                v-model="code_promotion"
                :error-messages="code_promotion_error"
                class="border-1 fs-14"
                solo
                flat
                placeholder="Nhập mã code khuyến mại"
                dense
                @input="code_promotion_error = []"
              >
              </v-text-field>
            </v-col>
          </v-row>
        </div>

        <div class="ml-16">
          <p class="mb-0 fs-14 font-weight-bold">Thời gian khuyến mại</p>
          <v-row>
            <v-col cols="6" class="py-0">
              <v-row>
                <v-col class="pb-0 font-weight-bold fs-16 pr-1" cols="auto"
                  >Thời gian bắt đầu<span class="red--text ml-1">*</span></v-col
                >
                <v-col cols="4" class="px-0 pb-0">
                  <v-text-field
                    v-model="time_checkin"
                    type="time"
                    placeholder="HH:mm:ss"
                    class="border-1 ml-2"
                    style="max-width: 300px"
                    solo
                    flat
                    dense
                    :error-messages="time_checkinError"
                    @input="time_checkinError = []"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-menu
                    ref="menuStart"
                    v-model="menuStart"
                    :close-on-content-click="false"
                    :return-value.sync="startDate"
                    offset-y
                    transition="scale-transition"
                    z-index="3"
                    width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <div v-bind="attrs" v-on="on">
                        <v-text-field
                          v-model="dateTime"
                          placeholder="dd/mm/yyyy"
                          append-icon="mdi-calendar"
                          solo
                          dense
                          readonly
                          flat
                          class="border-1"
                          :error-messages="startDateError"
                          @input="startDateError = []"
                        ></v-text-field>
                      </div>
                    </template>
                    <v-date-picker
                      v-model="date"
                      :show-current="date"
                      :allowed-dates="allowedDates"
                      @input="menuStart = false"
                    >
                    </v-date-picker>
                  </v-menu>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="6" class="py-0">
              <v-row>
                <v-col cols="auto" class="fs-14 font-weight-bold pl-0 pr-1"
                  >Thời gian kết thúc
                  <span class="red--text ml-1">*</span></v-col
                >
                <v-col cols="4" class="px-0">
                  <v-text-field
                    v-model="time_checkout"
                    type="time"
                    placeholder="HH:mm:ss"
                    class="border-1 ml-2"
                    style="max-width: 300px"
                    solo
                    flat
                    dense
                    :error-messages="time_checkoutError"
                    @input="time_checkoutError = []"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="4" class="">
                  <v-menu
                    ref="menuEnd"
                    v-model="menuEnd"
                    :close-on-content-click="false"
                    :return-value.sync="endDate"
                    transition="scale-transition"
                    offset-y
                    z-index="3"
                    width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <div v-bind="attrs" v-on="on">
                        <v-text-field
                          v-model="dateTime1"
                          hide-details
                          append-icon="mdi-calendar"
                          placeholder="dd/mm/yyyy"
                          solo
                          dense
                          readonly
                          flat
                          class="border-1"
                          :error-messages="endDateError"
                          @input="endDateError = []"
                        ></v-text-field>
                      </div>
                    </template>
                    <v-date-picker
                      v-model="date1"
                      :show-current="date1"
                      :allowed-dates="allowedDates1"
                      @input="menuEnd = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </div>
        <div class="ml-16">
          <div class="d-flex">
            <div
              class="fs-14 font-weight-bold mr-5 mt-4"
              style="padding-right: 80px"
            >
              Đánh giá
            </div>
            <v-switch
              v-model="status_evaluate_promotion"
              color="#47bbff"
              inset
              :true-value="1"
              :false-value="0"
            ></v-switch>
          </div>
          <div class="d-flex">
            <div class="fs-14 font-weight-bold mr-5 mt-4">
              Có thể bạn quan tâm
            </div>
            <v-switch
              v-model="status_care_promotion"
              inset
              color="#47bbff"
              :false-value="0"
              :true-value="1"
              @change="status_care_promotion === 0 ? (suggestion_msg = '') : ''"
            ></v-switch>
          </div>

          <v-col cols="11">
            <suggestions
              ref="suggestionsPromotion"
              :id-info="$route.params.id"
              @set_data="set_suggestions"
            >
              <span v-if="status_care_promotion === 1" class="error--text ml-1"
                >*</span
              >
            </suggestions>
          </v-col>
          <v-col cols="12" class="ml-2 pb-2">
            <div class="v-messages theme--light error--text mt-1" role="alert">
              <div class="v-messages__wrapper">
                <div class="v-messages__message">
                  {{ suggestion_msg }}
                </div>
              </div>
            </div>
          </v-col>

          <div class="pt-2">
            <p class="ma-0 fs-14 font-weight-bold">
              Nội dung <span class="error--text">*</span>
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
            <v-tabs-items v-model="tab2" style="background-color: #f5f7fe">
              <v-tab-item
                v-for="(language, index) in languages"
                :key="`${index}-${language}`"
              >
                <v-col class="pa-0" cols="11">
                  <vue-editor
                    v-model="language.category_posts_content_promotion"
                    use-custom-image-handler
                    :editor-toolbar="customToolbar"
                    @image-added="handleImageAdded1"
                    @text-change="
                      language.category_posts_content_promotion_error = []
                    "
                  ></vue-editor>
                </v-col>
              </v-tab-item>
            </v-tabs-items>
          </div>
        </div>
      </div>
    </div>
    <!-- end khuyến mại -->
    <DialogStatus :open="open_change" @toggle="closeStatus" @OK="change_status">
    </DialogStatus>

    <yes-no-alert
      :open="open_add_save"
      alert-msg="Bạn có chắc chắn muốn cập nhật bài viết?"
      @toggle="open_add_save = !open_add_save"
      @OK="save"
    >
    </yes-no-alert>
    <yes-no-alert
      :open="open_add_save_print"
      alert-msg="Bạn có chắc chắn muốn cập nhật bài viết?"
      @toggle="open_add_save_print = !open_add_save_print"
      @OK="save_print"
    >
    </yes-no-alert>
    <yes-no-alert
      :open="open_save_draft_default"
      alert-msg="Bạn có chắc chắn muốn cập nhật bài viết?"
      @toggle="open_save_draft_default = !open_save_draft_default"
      @OK="save_draft_default"
    >
    </yes-no-alert>
    <yes-no-alert
      :open="open_save_draft_promotion"
      alert-msg="Bạn có chắc chắn muốn cập nhật bài viết?"
      @toggle="open_save_draft_promotion = !open_save_draft_promotion"
      @OK="save_draft_promotion"
    >
    </yes-no-alert>
    <yes-no-alert
      :open="open_cancel"
      alert-msg="Bạn có chắc chắn muốn thoát?"
      @toggle="open_cancel = !open_cancel"
      @OK="confirm_cancel"
    />
  </div>
</template>

<script>
import moment from 'moment'
import DialogStatus from '~/components/bai-viet/DialogStatus'
import Folder from '~/assets/configurations/Folder_Config'
// import SelectFile from '~/components/Selected/File'
import SelectFile from '~/components/icon/SelectFile'
import BASE from '~/assets/configurations/BASE_URL'
import Rules from '~/assets/configurations/Rules'
import Suggestions from '~/components/bai-viet/Suggestions/index'
export default {
  components: {
    SelectFile,
    DialogStatus,
    Suggestions,
  },
  props: {
    // open: {
    //   type: Number,
    //   required: true,
    // },
    data: {
      type: Object,
      default: null,
    },
  },

  data: (vm) => ({
    customToolbar: [
      // font size
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      // text direction
      [
        {
          size: [
            '6px',
            '8px',
            '10px',
            '12px',
            '14px',
            '16px',
            '18px',
            '20px',
            '24px',
            '30px',
            '32px',
            '36px',
          ],
        },
      ],
      ['bold', 'italic', 'underline', 'strike'],
      // Bold, italic, underline, strikethrough
      ['blockquote', 'code-block'],
      // Reference, code block
      [{ header: 1 }, { header: 2 }],
      // Title, the form of key-value pairs; 1, 2 represents the font size
      [{ list: 'ordered' }, { list: 'bullet' }],
      // list
      [{ script: 'sub' }, { script: 'super' }],
      // superscript and subscript
      [{ indent: '-1' }, { indent: '+1' }],
      // indent
      [{ direction: 'rtl' }],
      // Several levels of title
      [{ color: [] }, { background: [] }],
      // font color, font background color
      [{ font: [] }],
      // font
      [{ align: [] }],
      // alignment
      ['clean'],
      // Clear font style
      ['image', 'video'],
      // Upload pictures, upload videos
    ],
    editorSettings: {
      modules: {
        Size: true,
      },
    },
    suggestion_msg: '',
    image_zoom_out_promotion_error: '',
    image_avatar_promotion_error: '',
    image_zoom_out_default_error: '',
    image_avatar_default_error: '',
    choosePostType: null,
    open_cancel: false,
    open_save_draft_promotion: false,
    open_save_draft_default: false,
    open_add_save_print: false,
    open_add_save: false,
    chooseForm: {},
    date: new Date().toISOString().substr(0, 10),
    date1: new Date().toISOString().substr(0, 10),
    endDate: new Date().toISOString().substr(0, 10),
    startDate: new Date().toISOString().substr(0, 10),
    startDateError: [],
    endDateError: [],
    statusDefault: 1,
    page_status: 1,
    time_checkinError: [],
    time_checkoutError: [],
    time_checkin: '11:11:11',
    time_checkout: '11:11:11',
    menuStart: false,
    menuEnd: false,
    menu: false,
    choose_form_error: [],
    choose_status_category: [],
    open_change: false,
    text_save_publication: null,
    check_required: 0,
    // mặc định
    tab: null,
    tab1: null,
    tab2: null,
    tab3: null,
    name_posts_default: null,
    name_posts_default_error: [],
    category_posts_default: [],
    category_posts_default_error: [],
    path_default: null,
    path_default_error: [],

    status_evaluate_default: 1,
    stauts_care_default: 1,
    category_posts_content_default: null,
    category_posts_content_default_error: [],
    languages: [],

    // xử lý file img ảnh thu nhỏ mặc định
    image_zoom_out_default: '',
    required_img_zoom_out_default: false,
    zoom_out_default: '',
    reset_file_zoom_out_default: null,
    limited_msg_zoom_out_default: '',
    hidden_zoom_out_default: false,
    // xử lý file img ảnh bìa mặc định
    image_avatar_default: '',
    required_img_avatar_default: false,
    avatar_default: '',
    reset_file_avatar_default: null,
    limited_msg_avatar_default: '',
    hidden_avatar_default: false,
    // end mặc định
    // khuyến mại

    name_posts_promotion: '',
    name_posts_promotion_error: [],
    path_promotion: '',
    path_promotion_error: [],

    code_promotion: '',
    code_promotion_error: [],
    category_posts_promotion: '',
    category_posts_promotion_error: [],
    time_start: null,
    time_end: null,
    status_care_promotion: 1,
    status_evaluate_promotion: 1,
    category_posts_content_promotion: null,
    category_posts_content_promotion_error: [],

    // xử lý file img ảnh thu nhỏ khuyến mại
    image_zoom_out_promotion: '',
    required_img_zoom_out_promotion: false,
    zoom_out_promotion: '',
    reset_file_zoom_out_promotion: null,
    limited_msg_zoom_out_promotion: '',
    hidden_zoom_out_promotion: false,
    // xử lý file img ảnh bìa khuyến mại
    image_avatar_promotion: '',
    required_img_avatar_promotion: false,
    avatar_promotion: '',
    reset_file_avatar_promotion: null,
    limited_msg_avatar_promotion: '',
    hidden_avatar_promotion: false,
    listsuggestion: [],
    // end khuyến mại

    choose_form: null,
    url_web: BASE,
    form_status: [
      {
        value: 1,
        text: 'Mặc định',
        status: 1,
      },
      {
        value: 2,
        text: 'Khuyến mại',
        status: 2,
      },
    ],
  }),
  computed: {
    dateTime() {
      const strDate = this.date
      if (!strDate) return ''
      return moment(strDate).format('DD/MM/YYYY')
    },
    dateTime1() {
      const strDate1 = this.date1
      if (!strDate1) return ''
      return moment(strDate1).format('DD/MM/YYYY')
    },
  },

  watch: {
    '$store.state.app.change_back'() {
      if (this.$store.state.app.pageTitle.includes('Cập nhật bài viết')) {
        this.open_cancel = true
      }
    },
    check_time_change_status() {
      const today = new Date()
      this.time_checkin = `${
        today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds()
      }`
      this.time_checkout = `${
        today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds()
      }`
    },
    date(val) {
      if (this.date > this.date1) {
        this.startDateError = ['Thời gian bắt đầu lớn hơn thời gian kết thúc']
      } else if (this.date === this.date1) {
        this.startDateError = []
      }
    },
    date1(val) {
      if (this.date === this.date1) {
        this.startDateError = []
      } else if (this.date > this.date1) {
        this.startDateError = ['Thời gian bắt đầu lớn hơn thời gian kết thúc']
      } else {
        this.startDateError = []
      }
    },
    // time_checkin(value) {
    //   if (value > this.time_checkout) {
    //     this.time_checkinError = [
    //       'Thời gian bắt đầu lớn hơn thời gian kết thúc',
    //     ]
    //   } else {
    //     this.time_checkinError = []
    //   }
    // },
    // time_checkout(value) {
    //   if (this.time_checkin > value) {
    //     this.time_checkinError = [
    //       'Thời gian bắt đầu lớn hơn thời gian kết thúc',
    //     ]
    //   } else {
    //     this.time_checkinError = []
    //   }
    // },
  },
  mounted() {
    this.getlist()
    this.$store.commit('app/checkBack', true)
    if ((this.$route.params || '').length !== 0) {
      this.$store
        .dispatch('bai_viet/detail', {
          post_id: Number(this.$route.params.id),
        })
        .then((res) => {
          if (!res.error) {
            this.choose_form = res.data.data.post.post_type
            this.choosePostType = res.data.data.post.post_type
            this.text_save_publication = res.data.data.post.save_status
            this.page_status = res.data.data.post.status
            if (this.choose_form === 1) {
              // console.log('mặc định')
              const LANGUAGE = [...this.$store.state.app.languages]
              if ((LANGUAGE || []).length !== 0) {
                for (let i = 0; i < LANGUAGE.length; i++) {
                  LANGUAGE[i] = {
                    ...LANGUAGE[i],
                    name_posts_default:
                      (res.data.data.postLangs[i] || '').length !== 0
                        ? res.data.data.postLangs[i].post_name
                        : '',
                    name_posts_default_error: [],
                    path_default:
                      (res.data.data.postLangs[i] || '').length !== 0
                        ? res.data.data.postLangs[i].url_seo
                        : '',
                    path_default_error: [],
                    category_posts_content_default:
                      (res.data.data.postLangs[i] || '').length !== 0
                        ? res.data.data.postLangs[i].content
                        : '',
                    category_posts_content_default_error: [],
                  }
                }
              }
              this.languages = [...LANGUAGE]
              this.tab = null
              this.tab1 = null
              this.tab2 = null
              this.status_evaluate_default = res.data.data.post.vote_status
              this.stauts_care_default = res.data.data.post.interested_status

              const dataCategory = res.data.data.post.category_post_ids.split(
                ','
              )
              for (let i = 0; i < dataCategory.length; i++) {
                dataCategory[i] = Number(dataCategory[i])
              }

              this.category_posts_default = [...dataCategory]

              this.image_zoom_out_default = res.data.data.post.avatar_small
              this.image_avatar_default = res.data.data.post.avatar

              //
            } else {
              const LANGUAGE = [...this.$store.state.app.languages]
              if ((LANGUAGE || []).length !== 0) {
                for (let i = 0; i < LANGUAGE.length; i++) {
                  LANGUAGE[i] = {
                    ...LANGUAGE[i],
                    name_posts_promotion:
                      (res.data.data.postLangs[i] || '').length !== 0
                        ? res.data.data.postLangs[i].post_name
                        : '',
                    name_posts_promotion_error: [],
                    path_promotion:
                      (res.data.data.postLangs[i] || '').length !== 0
                        ? res.data.data.postLangs[i].url_seo
                        : '',
                    path_promotion_error_error: [],
                    category_posts_content_promotion:
                      (res.data.data.postLangs[i] || '').length !== 0
                        ? res.data.data.postLangs[i].content
                        : '',
                    category_posts_content_promotion_error: [],
                  }
                }
              }
              this.languages = [...LANGUAGE]
              this.tab = null
              this.tab1 = null
              this.tab2 = null
              this.time_checkin = moment(
                res.data.data.post.promotions_start,
                'DD/MM/YYYY HH:mm:ss'
              ).format('HH:mm:ss')
              this.time_checkout = moment(
                res.data.data.post.promotions_end,
                'DD/MM/YYYY HH:mm:ss'
              ).format('HH:mm:ss')

              this.date = moment(
                res.data.data.post.promotions_start,
                'DD/MM/YYYY HH:mm:ss'
              ).format('YYYY-MM-DD')

              this.date1 = moment(
                res.data.data.post.promotions_end,
                'DD/MM/YYYY HH:mm:ss'
              ).format('YYYY-MM-DD')
              this.status_evaluate_promotion = res.data.data.post.vote_status
              this.status_care_promotion = res.data.data.post.interested_status

              const dataCategoryPromotion = res.data.data.post.category_post_ids.split(
                ','
              )
              for (let i = 0; i < dataCategoryPromotion.length; i++) {
                dataCategoryPromotion[i] = Number(dataCategoryPromotion[i])
              }

              this.category_posts_promotion = [...dataCategoryPromotion]
              this.code_promotion = res.data.data.post.promotions_code
              this.image_zoom_out_promotion = res.data.data.post.avatar_small
              this.image_avatar_promotion = res.data.data.post.avatar
            }

            this.$store.commit('app/setTitle', `Cập nhật bài viết`)
          }
        })
    }
  },

  methods: {
    set_suggestions(items) {
      this.listsuggestion = [...items]
      this.suggestion_msg = ''
    },

    handleImageAdded(file, Editor, cursorLocation, resetUploader) {
      const formData = new FormData()
      formData.append('file', file)
      const folder = Folder.bai_viet
      const data = { formData, folder }
      this.$store.dispatch('uploadImg/uploadFile', data).then((result) => {
        if (!result.error) {
          const url = result.data.data.image_url
          Editor.insertEmbed(cursorLocation, 'image', url)
          resetUploader()
        }
      })
    },
    handleImageAdded1(file, Editor, cursorLocation, resetUploader) {
      const formData = new FormData()
      formData.append('file', file)
      const folder = Folder.bai_viet
      const data = { formData, folder }
      this.$store.dispatch('uploadImg/uploadFile', data).then((result) => {
        if (!result.error) {
          const url = result.data.data.image_url
          Editor.insertEmbed(cursorLocation, 'image', url)
          resetUploader()
        }
      })
    },
    checkRole() {
      const roles = this.$isAccessAction(
        this.$store.state.app.roles,
        Rules.System.Posts.id
      )
      return roles
    },

    validata_view_promotions() {
      let hasErrors = false
      let count = 0
      if (this.check_required === 0) {
        if ((this.image_avatar_promotion || '').length === 0) {
          hasErrors = true
          this.image_avatar_promotion_error = 'Không được để trống'
        }
        if ((this.image_zoom_out_promotion || '').length === 0) {
          hasErrors = true
          this.image_zoom_out_promotion_error = 'Không được để trống'
        }
      }

      if (this.$isNullOrEmpty(this.category_posts_promotion)) {
        hasErrors = true
        this.category_posts_promotion_error = ['Không được để trống']
      }
      for (let i = 0; i < this.languages.length; i++) {
        if ((this.languages[i].name_posts_promotion || '').length === 0) {
          hasErrors = true
          this.languages[i].name_posts_promotion_error = ['Không được để trống']
          this.tab = i
          count += 1
        } else if (
          (this.languages[i].name_posts_promotion || '').length > 200
        ) {
          hasErrors = true
          this.languages[i].name_posts_promotion_error = [
            'Nhập không quá 200 kí tự cho phép',
          ]
          this.tab = i
          count += 1
        }
        if (
          (this.languages[i].category_posts_content_promotion || '').length ===
          0
        ) {
          hasErrors = true
          this.category_posts_content_promotion_error = ['không được để trống']
          this.tab2 = i
          count += 1
        }
      }
      if (this.date > this.date1) {
        hasErrors = true
        this.startDateError = ['Thời gian bắt đầu lớn hơn thời gian kết thúc']
      }
      if (this.date === this.date1) {
        if (this.time_checkin > this.time_checkout) {
          hasErrors = true
          this.time_checkinError = [
            'Thời gian bắt đầu lớn hơn thời gian kết thúc',
          ]
        } else {
          this.time_checkinError = []
        }
      } else {
        this.time_checkinError = []
      }
      if ((this.code_promotion || []).length === 0) {
        hasErrors = true
        this.code_promotion_error = ['Không được để trống']
        count += 1
      } else if (this.$isHasVietnamese(this.code_promotion)) {
        hasErrors = true
        this.code_promotion_error = ['Mã khuyến mại không hợp lệ']
        count += 1
      }
      if (
        (this.listsuggestion || []).length === 0 &&
        this.status_care_promotion === 1
      ) {
        hasErrors = true
        this.suggestion_msg = 'Không được để trống'
        count += 1
      }

      if (count > 0) {
        this.$showWarnNotify(this, 'Bạn nhập thiếu thông tin bắt buộc')
      }
      if (!hasErrors) {
        this.quest_view_promotions()
      }
    },
    validate_view_default() {
      let hasErrors = false
      let count = 0
      if (this.check_required === 0) {
        if ((this.image_avatar_default || '').length === 0) {
          hasErrors = true
          this.image_avatar_default_error = 'không được để trống'
        }
        if ((this.image_zoom_out_default || []).length === 0) {
          hasErrors = true
          this.image_zoom_out_default_error = 'Không được để trống'
        }
      }

      if (this.$isNullOrEmpty(this.choose_form)) {
        hasErrors = false
        this.choose_form_error = ['không được để trống']
      }
      if (this.$isNullOrEmpty(this.category_posts_default)) {
        hasErrors = true
        this.category_posts_default_error = ['Không được để trống']
      }
      for (let i = 0; i < this.languages.length; i++) {
        if ((this.languages[i].name_posts_default || '').length === 0) {
          hasErrors = true
          this.languages[i].name_posts_default_error = ['Không được để trống']
          this.tab = i
          count += 1
        } else if ((this.languages[i].name_posts_default || '').length > 200) {
          hasErrors = true
          this.languages[i].name_posts_default_error = [
            'Nhập không quá 200 kí tự cho phép',
          ]
          this.tab = i
          count += 1
        }

        if (
          (this.languages[i].category_posts_content_default || '').length === 0
        ) {
          hasErrors = true
          this.languages[i].category_posts_content_default_error = [
            'không được để trống',
          ]
          this.tab2 = i
          count += 1
        }
      }
      if (
        (this.listsuggestion || []).length === 0 &&
        this.stauts_care_default === 1
      ) {
        // console.log(2)
        hasErrors = true
        this.suggestion_msg = 'Không được để trống'
        count += 1
      }
      if (count > 0) {
        this.$showWarnNotify(this, 'Bạn nhập thiếu thông tin bắt buộc')
      }
      if (!hasErrors) {
        this.quest_view_default()
      }
    },

    quest_view_default() {
      const postLangs = []
      const arr = []
      const suggestions = []
      // console.log(this.category_posts_default, '1')
      for (let i = 0; i < this.category_posts_default.length; i++) {
        arr.unshift({ category_id: this.category_posts_default[i] })
      }

      for (let i = 0; i < this.languages.length; i++) {
        postLangs.push({
          lang_id: this.languages[i].id,
          post_name: this.languages[i].name_posts_default,
          url_seo: this.languages[i].path_default,
          content: this.languages[i].category_posts_content_default,
        })
      }
      for (let i = 0; i < this.listsuggestion.length; i++) {
        suggestions.push(
          String(
            `${this.listsuggestion[i].id}-${this.listsuggestion[i].product_type}`
          )
        )
      }
      this.$store
        .dispatch('bai_viet/preview_post', {
          post_id: this.$route.params.id,
          save_status: 1,
          status: this.page_status,
          post_type: 1,
          avatar_small: this.image_zoom_out_default,
          avatar: this.image_avatar_default,
          vote_status: this.status_evaluate_default,
          interested_status: this.stauts_care_default,
          promotions_start: null,
          promotions_end: null,
          promotions_code: null,
          postLangs,
          categoryPosts: arr,
          listProduct: suggestions.join(),
        })
        .then((response) => {
          if (!response.error) {
            window.open(response.data.data)
          }
        })
    },
    quest_view_promotions() {
      const postLangs = []
      const arr = []
      const suggestions = []
      for (let i = 0; i < this.category_posts_promotion.length; i++) {
        arr.unshift({ category_id: this.category_posts_promotion[i] })
      }

      for (let i = 0; i < this.languages.length; i++) {
        postLangs.push({
          lang_id: this.languages[i].id,
          post_name: this.languages[i].name_posts_promotion,
          url_seo: this.languages[i].path_promotion,
          content: this.languages[i].category_posts_content_promotion,
        })
      }
      for (let i = 0; i < this.listsuggestion.length; i++) {
        suggestions.push(
          String(
            `${this.listsuggestion[i].id}-${this.listsuggestion[i].product_type}`
          )
        )
      }
      this.$store
        .dispatch('bai_viet/preview_post', {
          post_id: this.$route.params.id,
          save_status: 0,
          status: this.page_status,
          post_type: 2,
          avatar_small: this.image_zoom_out_promotion,
          avatar: this.image_avatar_promotion,
          vote_status: this.status_evaluate_promotion,
          interested_status: this.status_care_promotion,
          promotions_start: `${moment(this.date, 'YYYY/MM/DD').format(
            'DD/MM/YYYY'
          )} ${this.time_checkin}`,
          promotions_end: `${moment(this.date1, 'YYYY/MM/DD').format(
            'DD/MM/YYYY'
          )} ${this.time_checkout}`,
          promotions_code: this.code_promotion,
          postLangs,
          categoryPosts: arr,
          listProduct: suggestions.join(),
        })
        .then((response) => {
          if (!response.error) {
            window.open(response.data.data)
          }
        })
    },

    confirm_cancel() {
      this.$router.push('/bai-viet')
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
    copy_text1(elementId) {
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
    allowedDates(value) {
      const today = moment(new Date()).format('YYYY-MM-DD')
      if (today <= value) {
        return true
      } else {
        return false
      }
    },
    allowedDates1(value) {
      const today = moment(new Date()).format('YYYY-MM-DD')
      if (today <= value) {
        return true
      } else {
        return false
      }
    },
    save_draft_default() {
      this.save_print_default()
    },
    save_draft_promotion() {
      this.save_print_promotion()
    },

    change_status() {
      if (this.choose_form === 1) {
        const LANGUAGE = [...this.$store.state.app.languages]
        if ((LANGUAGE || []).length !== 0) {
          for (let i = 0; i < LANGUAGE.length; i++) {
            LANGUAGE[i] = {
              ...LANGUAGE[i],
              name_posts_default: null,
              name_posts_default_error: [],
              category_posts_content_default: null,
              category_posts_content_default_error: [],
              path_default: null,
              path_default_error: [],
            }
          }
        }
        this.languages = [...LANGUAGE]
        this.category_posts_default = null
        this.category_posts_default_error = []
        this.status_evaluate_default = 1
        this.stauts_care_default = 1
        this.required_img_zoom_out_default = false
        this.required_img_avatar_default = false
        this.reset_zoom_out_default()
        this.reset_avatar_default()
        this.check_required = 0
        this.hidden_avatar_default = true
        this.hidden_zoom_out_default = true
        this.listsuggestion = []
        this.$refs.suggestionsDefault.reset()
      }
      if (this.choose_form === 2) {
        const LANGUAGE = [...this.$store.state.app.languages]
        if ((LANGUAGE || []).length !== 0) {
          for (let i = 0; i < LANGUAGE.length; i++) {
            LANGUAGE[i] = {
              ...LANGUAGE[i],

              name_posts_promotion: null,
              name_posts_promotion_error: [],
              category_posts_promotion: null,
              category_posts_content_promotion_error: [],
              path_promotion: null,
              path_promotion_error: null,
            }
          }
        }
        this.languages = [...LANGUAGE]
        this.category_posts_promotion = null
        this.category_posts_promotion_error = []
        this.status_care_promotion = 1
        this.status_evaluate_promotion = 1
        this.code_promotion = null
        this.required_img_zoom_out_promotion = false
        this.required_img_avatar_promotion = false
        this.reset_zoom_out_promotion()
        this.reset_avatar_promotion()
        this.check_required = 0
        this.hidden_zoom_out_promotion = true
        this.hidden_avatar_promotion = true
        this.code_promotion_error = []
        this.$refs.suggestionsPromotion.reset()
        this.listsuggestion = []
      }

      this.tab = null
      this.tab1 = null
      this.tab2 = null
      this.date = new Date().toISOString().substr(0, 10)
      this.date1 = new Date().toISOString().substr(0, 10)
      this.endDate = new Date().toISOString().substr(0, 10)
      this.startDate = new Date().toISOString().substr(0, 10)
      const today = new Date()

      this.time_checkin = `${
        today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds()
      }`
      this.time_checkout = `${
        today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds()
      }`

      this.open_change = false
    },
    validate_url(object) {
      if ((object.path_default || '').trim().length !== 0) {
        if (
          this.$isHasVietnamese(object.path_default) ||
          object.path_default.includes(' ')
        ) {
          object.path_default_error = 'Không đúng định dạng link website'
        } else {
          object.path_default_error = ''
        }
      }
    },
    validate_url1(object) {
      if ((object.path_promotion || '').trim().length !== 0) {
        if (
          this.$isHasVietnamese(object.path_promotion) ||
          object.path_promotion.includes(' ')
        ) {
          object.path_promotion_error = 'Không đúng định dạng link website'
        } else {
          object.path_promotion_error = ''
        }
      }
    },
    closeStatus() {
      this.choose_form = this.choosePostType
      this.open_change = false
    },

    getlist() {
      this.$store.dispatch('bai_viet/category_post', {}).then((response) => {
        if (!response.error) {
          response.data.data.map((item) => {
            this.choose_status_category.push({
              text: item.tilte,
              value: item.category_post_id,
            })
          })
        }
      })
    },
    save() {
      if (this.choose_form === 1) {
        this.save_default()
      }
      if (this.choose_form === 2) {
        this.save_promotion()
      }
    },
    save_print() {
      if (this.choose_form === 1) {
        this.save_print_default()
      }
      if (this.choose_form === 2) {
        this.save_print_promotion()
      }
    },

    save_default() {
      let hasErrors = false
      let count = 0
      if (this.check_required === 0) {
        if ((this.image_avatar_default || []).length === 0) {
          hasErrors = true
          this.image_avatar_default_error = 'Không được để trống'
        }
        if ((this.image_zoom_out_default || []).length === 0) {
          hasErrors = true
          this.image_zoom_out_default_error = 'Không được để trống'
        }
      }

      if (this.$isNullOrEmpty(this.category_posts_default)) {
        hasErrors = true
        this.category_posts_default_error = ['Không được để trống']
      }
      for (let i = 0; i < this.languages.length; i++) {
        if ((this.languages[i].name_posts_default || '').length === 0) {
          hasErrors = true
          this.languages[i].name_posts_default_error = ['Không được để trống']
          this.tab = i
          count += 1
        } else if ((this.languages[i].name_posts_default || '').length > 200) {
          hasErrors = true
          this.languages[i].name_posts_default_error = [
            'Nhập không quá 200 kí tự cho phép',
          ]
          this.tab = i
          count += 1
        }
        if (
          (this.languages[i].category_posts_content_default || '').length === 0
        ) {
          hasErrors = true
          this.category_posts_content_default_error = ['không được để trống']
          this.tab2 = i
          count += 1
        }
      }
      if (
        (this.listsuggestion || []).length === 0 &&
        this.stauts_care_default === 1
      ) {
        hasErrors = true
        this.suggestion_msg = 'Không được để trống'
        count += 1
      }
      if (count > 0) {
        this.$showWarnNotify(this, 'Bạn nhập thiếu thông tin bắt buộc')
      }
      if (!hasErrors) {
        this.update_post_default()
      }
    },

    save_promotion() {
      let hasErrors = false
      let count = 0
      if (this.check_required === 0) {
        if ((this.image_avatar_promotion || []).length === 0) {
          hasErrors = true
          this.image_avatar_promotion_error = 'Không được để trống'
        }
        if ((this.image_zoom_out_promotion || []).length === 0) {
          hasErrors = true
          this.image_zoom_out_promotion_error = 'Không được để trống'
        }
      }

      if (this.$isNullOrEmpty(this.category_posts_promotion)) {
        hasErrors = true
        this.category_posts_promotion_error = ['Không được để trống']
      }
      for (let i = 0; i < this.languages.length; i++) {
        if ((this.languages[i].name_posts_promotion || '').length === 0) {
          hasErrors = true
          this.languages[i].name_posts_promotion_error = ['Không được để trống']
          this.tab = i
          count += 1
        } else if (
          (this.languages[i].name_posts_promotion || '').length > 200
        ) {
          hasErrors = true
          this.languages[i].name_posts_promotion_error = [
            'Nhập không quá 200 kí tự cho phép',
          ]
          this.tab = i
          count += 1
        }
        if (
          (this.languages[i].category_posts_content_promotion || []).length ===
          0
        ) {
          hasErrors = true
          this.languages[i].category_posts_content_promotion_error = [
            'không được để trống',
          ]
          this.tab2 = i
          count += 1
        }
      }
      if (this.date > this.date1) {
        hasErrors = true
        this.startDateError = ['Thời gian bắt đầu lớn hơn thời gian kết thúc']
      }
      if (this.date === this.date1) {
        if (this.time_checkin > this.time_checkout) {
          hasErrors = true
          this.time_checkinError = [
            'Thời gian bắt đầu lớn hơn thời gian kết thúc',
          ]
        } else {
          this.time_checkinError = []
        }
      } else {
        this.time_checkinError = []
      }
      if ((this.code_promotion || []).length === 0) {
        hasErrors = true
        this.code_promotion_error = ['Không được để trống']
        count += 1
      } else if (this.$isHasVietnamese(this.code_promotion)) {
        hasErrors = true
        this.code_promotion_error = ['Mã khuyến mại không hợp lệ']
        count += 1
      }
      if (
        (this.listsuggestion || []).length === 0 &&
        this.status_care_promotion === 1
      ) {
        hasErrors = true
        this.suggestion_msg = 'Không được để trống'
        count += 1
      }
      if (count > 0) {
        this.$showWarnNotify(this, 'Bạn nhập thiếu thông tin bắt buộc')
      }
      if (!hasErrors) {
        this.update_post_promotion()
      }
    },

    save_print_default() {
      let hasErrors = false
      let count = 0
      if (this.check_required === 0) {
        if ((this.image_avatar_default || '').length === 0) {
          hasErrors = true
          this.image_avatar_default_error = 'không được để trống'
        }
        if ((this.image_zoom_out_default || []).length === 0) {
          hasErrors = true
          this.image_zoom_out_default_error = 'Không được để trống'
        }
      }

      if (this.$isNullOrEmpty(this.choose_form)) {
        hasErrors = false
        this.choose_form_error = ['không được để trống']
      }
      if (this.$isNullOrEmpty(this.category_posts_default)) {
        hasErrors = true
        this.category_posts_default_error = ['Không được để trống']
      }
      for (let i = 0; i < this.languages.length; i++) {
        if ((this.languages[i].name_posts_default || '').length === 0) {
          hasErrors = true
          this.languages[i].name_posts_default_error = ['Không được để trống']
          this.tab = i
          count += 1
        } else if ((this.languages[i].name_posts_default || '').length > 200) {
          hasErrors = true
          this.languages[i].name_posts_default_error = [
            'Nhập không quá 200 kí tự cho phép',
          ]
          this.tab = i
          count += 1
        }

        if (
          (this.languages[i].category_posts_content_default || '').length === 0
        ) {
          hasErrors = true
          this.languages[i].category_posts_content_default_error = [
            'không được để trống',
          ]
          this.tab2 = i
          count += 1
        }
      }

      if (
        (this.listsuggestion || []).length === 0 &&
        this.stauts_care_default === 1
      ) {
        hasErrors = true
        this.suggestion_msg = 'Không được để trống'
        count += 1
      }
      if (count > 0) {
        this.$showWarnNotify(this, 'Bạn nhập thiếu thông tin bắt buộc')
      }
      if (!hasErrors) {
        this.update_post_default_print()
      }
    },
    save_print_promotion() {
      let hasErrors = false
      let count = 0
      if (this.check_required === 0) {
        if ((this.image_avatar_promotion || '').length === 0) {
          hasErrors = true
          this.image_avatar_promotion_error = 'Không được để trống'
        }
        if ((this.image_zoom_out_promotion || '').length === 0) {
          hasErrors = true
          this.image_zoom_out_promotion_error = 'Không được để trống'
        }
      }

      if (this.$isNullOrEmpty(this.category_posts_promotion)) {
        hasErrors = true
        this.category_posts_promotion_error = ['Không được để trống']
      }
      for (let i = 0; i < this.languages.length; i++) {
        if ((this.languages[i].name_posts_promotion || '').length === 0) {
          hasErrors = true
          this.languages[i].name_posts_promotion_error = ['Không được để trống']
          this.tab = i
          count += 1
        } else if (
          (this.languages[i].name_posts_promotion || '').length > 200
        ) {
          hasErrors = true
          this.languages[i].name_posts_promotion_error = [
            'Nhập không quá 200 kí tự cho phép',
          ]
          this.tab = i
          count += 1
        }
        if (
          (this.languages[i].category_posts_content_promotion || '').length ===
          0
        ) {
          hasErrors = true
          this.category_posts_content_promotion_error = ['không được để trống']
          this.tab2 = i
          count += 1
        }
      }
      if (this.date > this.date1) {
        hasErrors = true
        this.startDateError = ['Thời gian bắt đầu lớn hơn thời gian kết thúc']
      }
      if (this.date === this.date1) {
        if (this.time_checkin > this.time_checkout) {
          hasErrors = true
          this.time_checkinError = [
            'Thời gian bắt đầu lớn hơn thời gian kết thúc',
          ]
        } else {
          this.time_checkinError = []
        }
      } else {
        this.time_checkinError = []
      }
      if ((this.code_promotion || []).length === 0) {
        hasErrors = true
        this.code_promotion_error = ['Không được để trống']
        count += 1
      } else if (this.$isHasVietnamese(this.code_promotion)) {
        hasErrors = true
        this.code_promotion_error = ['Mã khuyến mại không hợp lệ']
        count += 1
      }
      if (
        (this.listsuggestion || []).length === 0 &&
        this.status_care_promotion === 1
      ) {
        hasErrors = true
        this.suggestion_msg = 'Không được để trống'
        count += 1
      }

      if (count > 0) {
        this.$showWarnNotify(this, 'Bạn nhập thiếu thông tin bắt buộc')
      }
      if (!hasErrors) {
        this.update_post_promotion_print()
      }
    },
    update_post_default() {
      const postLangs = []
      const arr = []
      const suggestions = []
      for (let i = 0; i < this.category_posts_default.length; i++) {
        arr.unshift({ category_id: this.category_posts_default[i] })
      }

      for (let i = 0; i < this.languages.length; i++) {
        postLangs.push({
          lang_id: this.languages[i].id,
          post_name: this.languages[i].name_posts_default,
          url_seo: this.languages[i].path_default,
          content: this.languages[i].category_posts_content_default,
        })
      }
      for (let i = 0; i < this.listsuggestion.length; i++) {
        suggestions.push(
          String(
            `${this.listsuggestion[i].id}-${this.listsuggestion[i].product_type}`
          )
        )
      }
      this.$store
        .dispatch('bai_viet/update', {
          post_id: this.$route.params.id,
          save_status: 0,
          status: this.page_status,
          post_type: 1,
          avatar_small: this.image_zoom_out_default,
          avatar: this.image_avatar_default,
          vote_status: this.status_evaluate_default,
          interested_status: this.stauts_care_default,
          promotions_start: null,
          promotions_end: null,
          promotions_code: null,
          postLangs,
          categoryPosts: arr,
          listProduct: suggestions.join(),
        })
        .then((response) => {
          if (!response.error) {
            this.$router.push('/bai-viet')
            this.$showSuccess(this, 'Cập nhật bài viết thành công')
            this.$emit('toggle')
          }
        })
    },
    update_post_promotion() {
      const postLangs = []
      const arr = []
      const suggestions = []
      for (let i = 0; i < this.category_posts_promotion.length; i++) {
        arr.unshift({ category_id: this.category_posts_promotion[i] })
      }

      for (let i = 0; i < this.languages.length; i++) {
        postLangs.push({
          lang_id: this.languages[i].id,
          post_name: this.languages[i].name_posts_promotion,
          url_seo: this.languages[i].path_promotion,
          content: this.languages[i].category_posts_content_promotion,
        })
      }
      for (let i = 0; i < this.listsuggestion.length; i++) {
        suggestions.push(
          String(
            `${this.listsuggestion[i].id}-${this.listsuggestion[i].product_type}`
          )
        )
      }
      this.$store
        .dispatch('bai_viet/update', {
          post_id: this.$route.params.id,
          save_status: 0,
          status: this.page_status,
          post_type: 2,
          avatar_small: this.image_zoom_out_promotion,
          avatar: this.image_avatar_promotion,
          vote_status: this.status_evaluate_promotion,
          interested_status: this.status_care_promotion,
          promotions_start: `${moment(this.date, 'YYYY/MM/DD').format(
            'DD/MM/YYYY'
          )} ${this.time_checkin}`,
          promotions_end: `${moment(this.date1, 'YYYY/MM/DD').format(
            'DD/MM/YYYY'
          )} ${this.time_checkout}`,
          promotions_code: this.code_promotion,
          postLangs,
          categoryPosts: arr,
          listProduct: suggestions.join(),
        })
        .then((response) => {
          if (!response.error) {
            this.$router.push('/bai-viet')
            this.$showSuccess(this, 'Cập nhật bài viết khuyến mại thành công')
            this.$emit('toggle')
          }
        })
    },
    update_post_default_print() {
      const postLangs = []
      const arr = []
      const suggestions = []
      for (let i = 0; i < this.category_posts_default.length; i++) {
        arr.unshift({ category_id: this.category_posts_default[i] })
      }

      for (let i = 0; i < this.languages.length; i++) {
        postLangs.push({
          lang_id: this.languages[i].id,
          post_name: this.languages[i].name_posts_default,
          url_seo: this.languages[i].path_default,
          content: this.languages[i].category_posts_content_default,
        })
      }
      for (let i = 0; i < this.listsuggestion.length; i++) {
        suggestions.push(
          String(
            `${this.listsuggestion[i].id}-${this.listsuggestion[i].product_type}`
          )
        )
      }
      this.$store
        .dispatch('bai_viet/update', {
          post_id: this.$route.params.id,
          save_status: 1,
          status: this.page_status,
          post_type: 1,
          avatar_small: this.image_zoom_out_default,
          avatar: this.image_avatar_default,
          vote_status: this.status_evaluate_default,
          interested_status: this.stauts_care_default,
          promotions_start: null,
          promotions_end: null,
          promotions_code: null,
          postLangs,
          categoryPosts: arr,
          listProduct: suggestions.join(),
        })
        .then((response) => {
          if (!response.error) {
            this.$router.push('/bai-viet')
            this.$showSuccess(this, 'Cập nhật bài viết thành công')
            this.$emit('toggle')
          }
        })
    },
    update_post_promotion_print() {
      const postLangs = []
      const arr = []
      const suggestions = []
      for (let i = 0; i < this.category_posts_promotion.length; i++) {
        arr.unshift({ category_id: this.category_posts_promotion[i] })
      }

      for (let i = 0; i < this.languages.length; i++) {
        postLangs.push({
          lang_id: this.languages[i].id,
          post_name: this.languages[i].name_posts_promotion,
          url_seo: this.languages[i].path_promotion,
          content: this.languages[i].category_posts_content_promotion,
        })
      }
      for (let i = 0; i < this.listsuggestion.length; i++) {
        suggestions.push(
          String(
            `${this.listsuggestion[i].id}-${this.listsuggestion[i].product_type}`
          )
        )
      }
      this.$store
        .dispatch('bai_viet/update', {
          post_id: this.$route.params.id,
          save_status: 1,
          status: this.page_status,
          post_type: 2,
          avatar_small: this.image_zoom_out_promotion,
          avatar: this.image_avatar_promotion,
          vote_status: this.status_evaluate_promotion,
          interested_status: this.status_care_promotion,
          promotions_start: `${moment(this.date, 'YYYY/MM/DD').format(
            'DD/MM/YYYY'
          )} ${this.time_checkin}`,
          promotions_end: `${moment(this.date1, 'YYYY/MM/DD').format(
            'DD/MM/YYYY'
          )} ${this.time_checkout}`,
          promotions_code: this.code_promotion,
          postLangs,
          categoryPosts: arr,
          listProduct: suggestions.join(),
        })
        .then((response) => {
          if (!response.error) {
            this.$router.push('/bai-viet')
            this.$showSuccess(this, 'Cập nhật bài viết khuyến mại thành công')
            this.$emit('toggle')
          }
        })
    },
    // upload ảnh thu nhỏ mặc định
    select_file_zoom_out_default() {
      return window.document
        .getElementById('input_zoom_out_default_file')
        .click()
    },
    inputFileZoomOutDefault(file) {
      if (!this.$isNullOrEmpty(file)) {
        this.hidden_zoom_out_default = false
        let hasErrors = false

        if ((file.size || 0) > 3145728) {
          hasErrors = true
          this.limited_msg_zoom_out_default =
            'File được chọn không được vượt quá 3MB'
        }

        if (!hasErrors) {
          this.image_zoom_out_default_error = ''
          this.limited_msg_zoom_out_default = ''
          this.reset_file_zoom_out_default = file
          this.hidden_zoom_out_default = false
          if ((file || []).length !== 0) {
            this.image_zoom_out_default = URL.createObjectURL(file)
          }

          // this.$emit('set_file', file)
          this.file_selected_zoom_out_default(file)
        }
      }
    },
    delete_img_zoom_out_default() {
      this.reset_file_zoom_out_default = null
      this.image_zoom_out_default = ''
      this.file_selected_zoom_out_default('')
    },
    reset_zoom_out_default() {
      this.reset_file_zoom_out_default = null
      this.image_zoom_out_default = ''
    },
    set_img_zoom_out_default(value) {
      this.image_zoom_out_default = value
    },
    file_selected_zoom_out_default(file) {
      this.check_required = 1
      this.zoom_out_default = file
      this.required_img_zoom_out_default = false
      const formData = new FormData()
      formData.append('file', this.zoom_out_default)
      const folder = Folder.bai_viet
      const data = { formData, folder }
      this.$store.dispatch('uploadImg/uploadFile', data).then((response) => {
        if (!response.error) {
          this.image_zoom_out_default = response.data.data.image_url
          // console.log(response.data.data.image_url, '1')
        }
      })
    },

    // upload ảnh bìa mặc định
    file_selected_avatar_default(file) {
      this.check_required = 1
      this.avatar_default = file
      this.required_img_avatar_default = false
      const formData = new FormData()
      formData.append('file', this.avatar_default)
      const folder = Folder.bai_viet
      const data = { formData, folder }
      this.$store.dispatch('uploadImg/uploadFile', data).then((response) => {
        if (!response.error) {
          this.image_avatar_default = response.data.data.image_url
        }
      })
    },
    delete_img_avatar_default() {
      this.reset_file_avatar_default = null
      this.image_avatar_default = ''

      this.file_selected_avatar_default('')
    },
    select_file_avatar_default() {
      return window.document.getElementById('input_avatar_default_file').click()
    },

    inputFileAvatarDefault(file) {
      if (!this.$isNullOrEmpty(file)) {
        this.hidden_avatar_default = false
        let hasErrors = false

        if ((file.size || 0) > 3145728) {
          hasErrors = true
          this.limited_msg_avatar_default =
            'File được chọn không được vượt quá 3MB'
        }

        if (!hasErrors) {
          this.image_avatar_default_error = ''
          this.limited_msg_avatar_default = ''
          this.reset_file_avatar_default = file
          this.hidden_avatar_default = false

          if ((file || []).length !== 0) {
            this.image_avatar_default = URL.createObjectURL(file)
          }

          // this.$emit('set_file', file)
          this.file_selected_avatar_default(file)
        }
      }
    },
    reset_avatar_default() {
      this.reset_file_avatar_default = null
      this.image_avatar_default = ''
    },
    set_img_avatar_default(value) {
      this.image_avatar_default = value
    },
    // upload ảnh thu nhỏ khuyến mại

    delete_img_zoom_out_promotion() {
      this.reset_file_zoom_out_promotion = null
      this.image_zoom_out_promotion = ''
      this.file_selected_zoom_out_promotion('')
    },
    select_file_zoom_out_promotion() {
      return window.document
        .getElementById('input_zoom_out_promotion_file')
        .click()
    },

    inputFileZoomOutPromotion(file) {
      if (!this.$isNullOrEmpty(file)) {
        this.hidden_zoom_out_promotion = false
        let hasErrors = false

        if ((file.size || 0) > 3145728) {
          hasErrors = true
          this.limited_msg_zoom_out_promotion =
            'File được chọn không được vượt quá 3MB'
        }

        if (!hasErrors) {
          this.image_zoom_out_promotion_error = ''
          this.limited_msg_zoom_out_promotion = ''
          this.reset_file_zoom_out_promotion = file
          this.hidden_zoom_out_promotion = false

          if ((file || []).length !== 0) {
            this.image_zoom_out_promotion = URL.createObjectURL(file)
          }

          // this.$emit('set_file', file)
          this.file_selected_zoom_out_promotion(file)
        }
      }
    },
    reset_zoom_out_promotion() {
      this.reset_file_zoom_out_promotion = null
      this.image_zoom_out_promotion = ''
    },
    set_img_zoom_out_promotion(value) {
      this.image_zoom_out_promotion = value
    },

    file_selected_zoom_out_promotion(file) {
      this.check_required = 1
      this.zoom_out_promotion = file
      this.required_img_zoom_out_promotion = false
      const formData = new FormData()
      formData.append('file', file)
      const folder = Folder.danh_muc_bai_viet
      const data = { formData, folder }
      this.$store.dispatch('uploadImg/uploadFile', data).then((response) => {
        if (!response.error) {
          this.image_zoom_out_promotion = response.data.data.image_url
          // console.log(response.data.data.image_url, '1')
        }
      })
    },
    // upload ảnh bìa khuyến mại
    delete_img_avatar_promotion() {
      this.reset_file_avatar_promotion = null
      this.image_avatar_promotion = ''
      this.file_selected_avatar_promotion('')
    },
    select_file_avatar_promotion() {
      return window.document
        .getElementById('input_avatar_promotion_file')
        .click()
    },

    inputFileAvatarPromotion(file) {
      if (!this.$isNullOrEmpty(file)) {
        this.hidden_avatar_promotion = false
        let hasErrors = false

        if ((file.size || 0) > 3145728) {
          hasErrors = true
          this.limited_msg_avatar_promotion =
            'File được chọn không được vượt quá 3MB'
        }

        if (!hasErrors) {
          this.image_avatar_promotion_error = ''
          this.limited_msg_avatar_promotion = ''
          this.reset_file_avatar_promotion = file
          this.hidden_avatar_promotion = false

          if ((file || []).length !== 0) {
            this.image_avatar_promotion = URL.createObjectURL(file)
          }

          // this.$emit('set_file', file)
          this.file_selected_avatar_promotion(file)
        }
      }
    },
    reset_avatar_promotion() {
      this.reset_file_avatar_promotion = null
      this.image_avatar_promotion = ''
    },
    set_img_avatar_promotion(value) {
      this.image_avatar_promotion = value
    },
    file_selected_avatar_promotion(file) {
      this.check_required = 1
      this.avatar_promotion = file
      this.required_img_avatar_promotion = false
      const formData = new FormData()
      formData.append('file', file)
      const folder = Folder.danh_muc_bai_viet
      const data = { formData, folder }
      this.$store.dispatch('uploadImg/uploadFile', data).then((response) => {
        if (!response.error) {
          this.image_avatar_promotion = response.data.data.image_url
        }
      })
    },

    toggle() {
      this.$emit('toggle')
      this.$router.push('/bai-viet')
    },
  },
  head() {
    return {
      title: 'Bài viết',
    }
  },
}
</script>
<style lang="scss">
.main_list_posts {
  .style-css-domain-input {
    .v-text-field__slot {
      margin-left: 45px;
    }
  }
  .v-input__prepend-inner {
    padding-right: 0 !important;
  }
  .actions-coordinates-1 {
    position: fixed;
    z-index: 5;
    right: 0;
    top: 75px;
    background-color: #f5f7fe;
  }
  .actions-coordinates-2 {
    position: fixed;
    padding-bottom: 20px;
    padding-top: 10px;
    z-index: 5;
    right: 0;
    bottom: 0;
    background-color: #f5f7fe;
  }
}
</style>
