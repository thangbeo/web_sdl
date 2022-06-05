<template>
  <div class="main_list_posts">
    <!-- // chức năng -->
    <div class="d-flex w-100 actions-coordinates-1 mr-5">
      <div class="flex-grow-1"></div>

      <v-btn
        class="text-none white--text mr-3"
        color="#4873C2"
        dark
        depressed
        width="120px"
        @click="quest_view"
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
          <div class="font-weight-bold fs-16 pr-7 pt-1">Hiển thị/ Ẩn</div>
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

        <p class="ma-0 fs-16 font-weight-bold">
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
                class="border-1 fs-16"
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
        <p class="ma-0 fs-16 font-weight-bold">
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
                class="border-1 fs-16"
                solo
                flat
                dense
                @input="language.name_posts_default_error = []"
              >
              </v-text-field>
            </v-col>
          </v-tab-item>
        </v-tabs-items>
        <p class="ma-0 fs-16 font-weight-bold">
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
            :menu-props="{ zIndex: '1' }"
            class="border-1 fs-16"
            placeholder="chọn danh mục bài viết"
            @input="category_posts_default_error = []"
          ></v-autocomplete>
        </v-col>

        <v-col class="py-0 px-0" cols="11">
          <p class="ma-0 fs-16 font-weight-bold">URL thân thiện cho SEO</p>

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
                  <p class="font-weight-bold fs-16">
                    Ảnh thu nhỏ <span class="error--text pl-1">*</span>
                  </p>
                </v-col>

                <v-col cols="2">
                  <SelectFile
                    id="input_file_img_zoom_out_default"
                    ref="input_file_img_zoom_out_default"
                    :hidden="true"
                    :required="required_img_zoom_out_default"
                    @set_file="file_selected_zoom_out_default"
                  ></SelectFile>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="6">
              <v-row>
                <v-col cols="2" class="pr-1">
                  <p class="font-weight-bold fs-16">
                    Ảnh bìa <span class="error--text pl-1">*</span>
                  </p>
                </v-col>

                <v-col cols="2">
                  <SelectFile
                    id="input_file_img_avatar_default"
                    ref="input_file_img_avatar_default"
                    :hidden="true"
                    :required="required_img_avatar_default"
                    @set_file="file_selected_avatar_default"
                  ></SelectFile>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </div>
        <div class="d-flex">
          <div class="fs-16 mt-4 font-weight-bold" style="margin-right: 100px">
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
          <div class="fs-16 mr-5 mt-4 font-weight-bold">
            Có thể bạn quan tâm
          </div>
          <v-switch
            v-model="stauts_care_default"
            class="mt-3"
            color="#47bbff"
            :false-value="0"
            :true-value="1"
            inset
          ></v-switch>
        </div>
        <div class="pt-5">
          <p class="ma-0 fs-16 font-weight-bold">
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
          <p class="ma-0 fs-16 font-weight-bold">
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
                  class="border-1 fs-16"
                  solo
                  flat
                  dense
                  @input="language.name_posts_promotion_error = []"
                >
                </v-text-field>
              </v-col>
            </v-tab-item>
          </v-tabs-items>
          <p class="ma-0 fs-16 font-weight-bold">
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
              class="border-1 fs-16"
              placeholder="chọn danh mục bài viết"
              @input="category_posts_promotion_error = []"
            ></v-autocomplete>
          </v-col>

          <v-col class="py-0 px-0" cols="11">
            <p class="ma-0 fs-16 font-weight-bold">URL thân thiện cho SEO</p>

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
                    class="border-1 rounded-r-0"
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
                    <p class="font-weight-bold fs-16">
                      Ảnh thu nhỏ <span class="error--text">*</span>
                    </p>
                  </v-col>

                  <v-col cols="2">
                    <SelectFile
                      id="input_file_img_zoom_out_promotion_edit"
                      ref="input_file_img_zoom_out_promotion_edit"
                      :hidden="true"
                      :required="required_img_zoom_out_promotion"
                      @set_file="file_selected_zoom_out_promotion"
                    ></SelectFile>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="6">
                <v-row>
                  <v-col cols="2">
                    <p class="font-weight-bold fs-16">
                      Ảnh bìa <span class="error--text">*</span>
                    </p>
                  </v-col>

                  <v-col cols="2">
                    <SelectFile
                      id="input_file_img_avatar_promotion_edit"
                      ref="input_file_img_avatar_promotion_edit"
                      :hidden="true"
                      :required="required_img_avatar_promotion"
                      @set_file="file_selected_avatar_promotion"
                    ></SelectFile>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </div>
          <p class="mb-0 fs-16 font-weight-bold">Mã khuyến mại</p>
          <v-row>
            <v-col cols="11" class="py-0 pr-0">
              <v-text-field
                v-model="code_promotion"
                class="border-1 fs-16"
                solo
                flat
                placeholder="Nhập mã code khuyến mại"
                dense
              >
              </v-text-field>
            </v-col>
          </v-row>
        </div>

        <div class="ml-16">
          <p class="mb-0 fs-16 font-weight-bold">Thời gian khuyến mại</p>
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
                    solo
                    flat
                    dense
                    hide-details
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-menu
                    ref="menuStart"
                    v-model="menuStart"
                    :return-value.sync="startDate"
                    :close-on-content-click="false"
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
                <v-col cols="auto" class="fs-16 font-weight-bold pl-0 pr-1"
                  >Thời gian kết thúc
                  <span class="red--text ml-1">*</span></v-col
                >
                <v-col cols="4" class="px-0">
                  <v-text-field
                    v-model="time_checkout"
                    type="time"
                    placeholder="HH:mm:ss"
                    class="border-1 ml-2"
                    solo
                    flat
                    dense
                    hide-details
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
              class="fs-16 font-weight-bold mr-5 mt-4"
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
            <div class="fs-16 font-weight-bold mr-5 mt-4">
              Có thể bạn quan tâm
            </div>
            <v-switch
              v-model="status_care_promotion"
              inset
              color="#47bbff"
              :false-value="0"
              :true-value="1"
            ></v-switch>
          </div>
          <div>
            <p class="ma-0 fs-16 font-weight-bold">
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
      :open="open_cancel"
      alert-msg="Bạn có chắc chắn muốn thoát?"
      @toggle="open_cancel = !open_cancel"
      @OK="toggle"
    >
    </yes-no-alert>

    <yes-no-alert
      :open="open_add_save"
      alert-msg="Bạn có chắc chắn muốn cập nhật bài viết du lịch?"
      @toggle="open_add_save = !open_add_save"
      @OK="save"
    >
    </yes-no-alert>
    <yes-no-alert
      :open="open_add_save_print"
      alert-msg="Bạn có chắc chắn muốn cập nhật bài viết du lịch?"
      @toggle="open_add_save_print = !open_add_save_print"
      @OK="save_print"
    >
    </yes-no-alert>
    <yes-no-alert
      :open="open_save_draft_default"
      alert-msg="Bạn có chắc chắn muốn cập nhật bài viết du lịch?"
      @toggle="open_save_draft_default = !open_save_draft_default"
      @OK="save_draft_default"
    >
    </yes-no-alert>
    <yes-no-alert
      :open="open_save_draft_promotion"
      alert-msg="Bạn có chắc chắn muốn cập nhật bài viết du lịch?"
      @toggle="open_save_draft_promotion = !open_save_draft_promotion"
      @OK="save_draft_promotion"
    >
    </yes-no-alert>
  </div>
</template>

<script>
import moment from 'moment'
import DialogStatus from '~/components/bai-viet/DialogStatus'
import Folder from '~/assets/configurations/Folder_Config'
import SelectFile from '~/components/Selected/File'
import BASE from '~/assets/configurations/BASE_URL'
export default {
  components: {
    SelectFile,
    DialogStatus,
  },
  props: {
    open: {
      type: Number,
      required: true,
    },
    data: {
      type: Object,
      default: null,
    },
  },
  data: (vm) => ({
    open_save_draft_promotion: false,
    open_save_draft_default: false,
    open_add_save_print: false,
    open_add_save: false,
    open_cancel: false,
    chooseForm: {},
    date: new Date().toISOString().substr(0, 10),
    date1: new Date().toISOString().substr(0, 10),
    endDate: new Date().toISOString().substr(0, 10),
    startDate: new Date().toISOString().substr(0, 10),
    startDateError: [],
    endDateError: [],
    statusDefault: 1,
    page_status: 1,
    time_checkin: '07:30:59',
    time_checkout: '17:30:59',
    menuStart: false,
    menuEnd: false,
    menu: false,
    choose_form_error: [],
    choose_status_category: [],
    open_change: false,
    text_save_publication: null,
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
    required_img_zoom_out_default: false,
    required_img_avatar_default: false,
    status_evaluate_default: 1,
    stauts_care_default: 1,
    category_posts_content_default: null,
    category_posts_content_default_error: [],
    languages: [],
    image_zoom_out_url_default: '',
    image_avatar_url_default: '',
    avatar_default: '',
    zoom_out_default: '',

    // end mặc định
    // khuyến mại
    zoom_out_promotion: '',
    avatar_promotion: '',
    name_posts_promotion: '',
    name_posts_promotion_error: [],
    path_promotion: '',
    path_promotion_error: [],
    required_img_zoom_out_promotion: false,
    required_img_avatar_promotion: false,
    code_promotion: '',
    category_posts_promotion: '',
    category_posts_promotion_error: [],
    time_start: null,
    time_end: null,
    status_care_promotion: 1,
    status_evaluate_promotion: 1,
    category_posts_content_promotion: null,
    category_posts_content_promotion_error: [],
    image_avatar_url_promotion: '',
    image_zoom_out_url_promotion: '',

    // end khuyến mại

    choose_form: 1,
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
    open(value) {
      if (value === 3) {
        this.$store.commit('app/checkBack', true)
        if (this.choose_form === 2) {
          this.$refs.input_file_img_zoom_out_promotion_edit.reset('')
          this.$refs.input_file_img_avatar_promotion_edit.reset('')
        } else {
          this.$refs.input_file_img_avatar_default.reset('')
          this.$refs.input_file_img_zoom_out_default.reset('')
        }
        // console.log(this.data.post.status, '1')
        this.text_save_publication = this.data.post.save_status
        this.getlist()
        if (this.data.post.post_type === 1) {
          this.getdetail()
          // console.log('1')
        }
        if (this.data.post.post_type === 2) {
          // console.log('2')
          this.get_detail()
        }
      }
    },
    data(value) {
      this.choose_form = this.data.post.post_type
      if (this.choose_form === 1) {
        this.set_again_default()
      }
      if (this.choose_form === 2) {
        this.set_again_promotion()
      }
    },
    date(val) {
      if (this.date > this.date1) {
        this.startDateError = ['Thời gian bắt đầu nhỏ hơn thời gian kết thúc']
      } else if (this.date === this.date1) {
        this.startDateError = []
      }
    },
    date1(val) {
      if (this.date === this.date1) {
        this.startDateError = []
      } else if (this.date > this.date1) {
        this.startDateError = ['Thời gian bắt đầu nhỏ hơn thời gian kết thúc']
      } else {
        this.startDateError = []
      }
    },
  },

  methods: {
    quest_view() {
      this.$store.dispatch('bai_viet/preview_post').then((res) => {
        if (!res.error) {
          window.open(res.data.data)
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
      // console.log('1')
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
            name_posts_promotion: null,
            name_posts_promotion_error: [],
            category_posts_promotion: null,
            category_posts_content_promotion_error: [],
            path_promotion: null,
            path_promotion_error: null,
          }
        }
      }
      this.category_posts_default = null
      this.category_posts_default_error = []
      this.category_posts_promotion = null
      this.category_posts_promotion_error = []
      this.status_evaluate_default = 1
      this.stauts_care_default = 1
      this.status_care_promotion = 1
      this.status_evaluate_promotion = 1
      this.tab = null
      this.tab1 = null
      this.tab2 = null
      this.languages = [...LANGUAGE]
      this.date = new Date().toISOString().substr(0, 10)
      this.date1 = new Date().toISOString().substr(0, 10)
      this.endDate = new Date().toISOString().substr(0, 10)
      this.startDate = new Date().toISOString().substr(0, 10)
      this.time_checkin = '07:30:59'
      this.time_checkout = '17:30:59'
      this.code_promotion = null
      this.required_img_zoom_out_default = false
      this.required_img_avatar_default = false
      this.required_img_zoom_out_promotion = false
      this.required_img_avatar_promotion = false
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
      this.choose_form = this.data.post.post_type
      this.open_change = false
    },
    get_detail() {
      this.$store
        .dispatch('bai_viet/detail', {
          post_id: this.data.post.id,
        })
        .then((res) => {
          if (!res.error) {
            this.image_avatar_url_promotion = this.data.post.avatar
            if (!this.$isNullOrEmpty(this.image_avatar_url_promotion)) {
              this.$refs.input_file_img_avatar_promotion_edit.set_img(
                this.image_avatar_url_promotion
              )
            }
            this.image_zoom_out_url_promotion = this.data.post.avatar_small
            // console.log(this.image_zoom_out_url_promotion, '1')
            if (!this.$isNullOrEmpty(this.image_zoom_out_url_promotion)) {
              this.$refs.input_file_img_zoom_out_promotion_edit.set_img(
                this.image_zoom_out_url_promotion
              )
            }
          }
        })
    },
    getdetail() {
      this.$store
        .dispatch('bai_viet/detail', {
          post_id: this.data.post.id,
        })
        .then((res) => {
          if (!res.error) {
            this.image_avatar_url_default = this.data.post.avatar
            if (!this.$isNullOrEmpty(this.image_avatar_url_default)) {
              this.$refs.input_file_img_avatar_default.set_img(
                this.image_avatar_url_default
              )
            }
            this.image_zoom_out_url_default = this.data.post.avatar_small
            if (!this.$isNullOrEmpty(this.image_zoom_out_url_default)) {
              this.$refs.input_file_img_zoom_out_default.set_img(
                this.image_zoom_out_url_default
              )
            }
          }
        })
    },
    getlist() {
      this.$store.dispatch('bai_viet/category_post', {}).then((response) => {
        if (!response.error) {
          response.data.data.map((item) => {
            this.choose_status_category.push({
              text: item.tilte,
              value: String(item.category_post_id),
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
      // if ((this.avatar_default || []).length === 0) {
      //   hasErrors = true
      //   this.required_img_avatar_default = true
      // }
      // if ((this.zoom_out_default || []).length === 0) {
      //   hasErrors = true
      //   this.required_img_zoom_out_default = true
      // }
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
      // if ((this.avatar_default || []).length === 0) {
      //   hasErrors = true
      //   this.required_img_avatar_default = true
      // }
      // if ((this.zoom_out_default || []).length === 0) {
      //   hasErrors = true
      //   this.required_img_zoom_out_default = true
      // }
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
        this.startDateError = ['Thời gian bắt đầu nhỏ hơn thời gian kết thúc']
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
      // if ((this.avatar_default || '').length === 0) {
      //   hasErrors = true
      //   this.required_img_avatar_default = true
      // }
      // if ((this.zoom_out_default || '').length === 0) {
      //   hasErrors = true
      //   this.required_img_zoom_out_default = true
      // }
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
      // if ((this.avatar_promotion || '').length === 0) {
      //   hasErrors = true
      //   this.required_img_avatar_promotion = true
      // }
      // if ((this.zoom_out_promotion || '').length === 0) {
      //   hasErrors = true
      //   this.required_img_zoom_out_promotion = true
      // }
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

        this.startDateError = ['Thời gian bắt đầu nhỏ hơn thời gian kết thúc']
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
      for (let i = 0; i < this.category_posts_default.length; i++) {
        arr.push({ category_id: this.category_posts_default[i] })
      }

      for (let i = 0; i < this.languages.length; i++) {
        postLangs.push({
          lang_id: this.languages[i].id,
          post_name: this.languages[i].name_posts_default,
          url_seo: this.languages[i].path_default,
          content: this.languages[i].category_posts_content_default,
        })
      }
      this.$store
        .dispatch('bai_viet/update', {
          post_id: this.data.post.id,
          save_status: 0,
          status: this.page_status,
          post_type: 1,
          avatar_small: this.image_zoom_out_url_default,
          avatar: this.image_avatar_url_default,
          vote_status: this.status_evaluate_default,
          interested_status: this.stauts_care_default,
          promotions_start: null,
          promotions_end: null,
          promotions_code: null,
          postLangs,
          categoryPosts: arr,
        })
        .then((response) => {
          if (!response.error) {
            this.$emit('success')
            this.$showSuccess(this, 'Cập nhật bài viết thành công')
            this.$emit('toggle')
          }
        })
    },
    update_post_promotion() {
      const postLangs = []
      const arr = []
      for (let i = 0; i < this.category_posts_promotion.length; i++) {
        arr.push({ category_id: this.category_posts_promotion[i] })
      }

      for (let i = 0; i < this.languages.length; i++) {
        postLangs.push({
          lang_id: this.languages[i].id,
          post_name: this.languages[i].name_posts_promotion,
          url_seo: this.languages[i].path_promotion,
          content: this.languages[i].category_posts_content_promotion,
        })
      }
      this.$store
        .dispatch('bai_viet/update', {
          post_id: this.data.post.id,
          save_status: 0,
          status: this.page_status,
          post_type: 2,
          avatar_small: this.image_zoom_out_url_promotion,
          avatar: this.image_avatar_url_promotion,
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
        })
        .then((response) => {
          if (!response.error) {
            this.$emit('success')
            this.$showSuccess(this, 'Cập nhật bài viết khuyến mại thành công')
            this.$emit('toggle')
          }
        })
    },
    update_post_default_print() {
      const postLangs = []
      const arr = []
      for (let i = 0; i < this.category_posts_default.length; i++) {
        arr.push({ category_id: this.category_posts_default[i] })
      }

      for (let i = 0; i < this.languages.length; i++) {
        postLangs.push({
          lang_id: this.languages[i].id,
          post_name: this.languages[i].name_posts_default,
          url_seo: this.languages[i].path_default,
          content: this.languages[i].category_posts_content_default,
        })
      }
      this.$store
        .dispatch('bai_viet/update', {
          post_id: this.data.post.id,
          save_status: 1,
          status: this.page_status,
          post_type: 1,
          avatar_small: this.image_zoom_out_url_default,
          avatar: this.image_avatar_url_default,
          vote_status: this.status_evaluate_default,
          interested_status: this.stauts_care_default,
          promotions_start: null,
          promotions_end: null,
          promotions_code: null,
          postLangs,
          categoryPosts: arr,
        })
        .then((response) => {
          if (!response.error) {
            this.$emit('success')
            this.$showSuccess(this, 'Cập nhật bài viết thành công')
            this.$emit('toggle')
          }
        })
    },
    update_post_promotion_print() {
      const postLangs = []
      const arr = []
      for (let i = 0; i < this.category_posts_promotion.length; i++) {
        arr.push({ category_id: this.category_posts_promotion[i] })
      }

      for (let i = 0; i < this.languages.length; i++) {
        postLangs.push({
          lang_id: this.languages[i].id,
          post_name: this.languages[i].name_posts_promotion,
          url_seo: this.languages[i].path_promotion,
          content: this.languages[i].category_posts_content_promotion,
        })
      }
      this.$store
        .dispatch('bai_viet/update', {
          post_id: this.data.post.id,
          save_status: 1,
          status: this.page_status,
          post_type: 2,
          avatar_small: this.image_zoom_out_url_promotion,
          avatar: this.image_avatar_url_promotion,
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
        })
        .then((response) => {
          if (!response.error) {
            this.$emit('success')
            this.$showSuccess(this, 'Cập nhật bài viết khuyến mại thành công')
            this.$emit('toggle')
          }
        })
    },
    // lấy dữ liệu khuyến mại
    set_again_promotion() {
      const LANGUAGE = [...this.$store.state.app.languages]
      if ((LANGUAGE || []).length !== 0) {
        for (let i = 0; i < LANGUAGE.length; i++) {
          LANGUAGE[i] = {
            ...LANGUAGE[i],
            name_posts_promotion:
              (this.data.postLangs[i] || '').length !== 0
                ? this.data.postLangs[i].post_name
                : '',
            name_posts_promotion_error: [],
            path_promotion:
              (this.data.postLangs[i] || '').length !== 0
                ? this.data.postLangs[i].url_seo
                : '',
            path_promotion_error_error: [],
            category_posts_content_promotion:
              (this.data.postLangs[i] || '').length !== 0
                ? this.data.postLangs[i].content
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
        this.data.post.promotions_start,
        'DD/MM/YYYY HH:mm:ss'
      ).format('HH:mm:ss')
      this.time_checkout = moment(
        this.data.post.promotions_end,
        'DD/MM/YYYY HH:mm:ss'
      ).format('HH:mm:ss')

      this.date = moment(
        this.data.post.promotions_start,
        'DD/MM/YYYY HH:mm:ss'
      ).format('YYYY-MM-DD')

      this.date1 = moment(
        this.data.post.promotions_end,
        'DD/MM/YYYY HH:mm:ss'
      ).format('YYYY-MM-DD')
      this.status_evaluate_promotion = this.data.post.interested_status
      this.status_care_promotion = this.data.post.vote_status
      this.category_posts_promotion =
        this.data.post.category_post_ids.split(',')
      this.code_promotion = this.data.post.promotions_code

      this.page_status = this.data.post.status
    },
    // lấy dữ liệu mặc định
    set_again_default() {
      const LANGUAGE = [...this.$store.state.app.languages]
      if ((LANGUAGE || []).length !== 0) {
        for (let i = 0; i < LANGUAGE.length; i++) {
          LANGUAGE[i] = {
            ...LANGUAGE[i],
            name_posts_default:
              (this.data.postLangs[i] || '').length !== 0
                ? this.data.postLangs[i].post_name
                : '',
            name_posts_default_error: [],
            path_default:
              (this.data.postLangs[i] || '').length !== 0
                ? this.data.postLangs[i].url_seo
                : '',
            path_default_error: [],
            category_posts_content_default:
              (this.data.postLangs[i] || '').length !== 0
                ? this.data.postLangs[i].content
                : '',
            category_posts_content_default_error: [],
          }
        }
      }
      this.languages = [...LANGUAGE]
      this.tab = null
      this.tab1 = null
      this.tab2 = null
      this.status_evaluate_default = this.data.post.interested_status
      this.stauts_care_default = this.data.post.vote_status
      this.category_posts_default = this.data.post.category_post_ids.split(',')
      this.page_status = this.data.post.status
    },
    // upload ảnh thu nhỏ mặc định
    file_selected_zoom_out_default(file) {
      this.zoom_out_default = file
      this.required_img_zoom_out_default = false
      const formData = new FormData()
      formData.append('file', this.zoom_out_default)
      const folder = Folder.bai_viet
      const data = { formData, folder }
      this.$store.dispatch('uploadImg/uploadFile', data).then((response) => {
        if (!response.error) {
          this.image_zoom_out_url_default = response.data.data.image_url
          // console.log(response.data.data.image_url, '1')
        }
      })
    },
    // upload ảnh mặc định
    file_selected_avatar_default(file) {
      this.avatar_default = file
      this.required_img_avatar_default = false
      const formData = new FormData()
      formData.append('file', this.avatar_default)
      const folder = Folder.update_bai_viet
      const data = { formData, folder }
      this.$store.dispatch('uploadImg/uploadFile', data).then((response) => {
        if (!response.error) {
          this.image_avatar_url_default = response.data.data.image_url
        }
      })
    },
    // upload ảnh thu nhỏ khuyến mại
    file_selected_zoom_out_promotion(file) {
      this.zoom_out_promotion = file
      this.required_img_zoom_out_promotion = false
      const formData = new FormData()
      formData.append('file', file)
      const folder = Folder.danh_muc_bai_viet
      const data = { formData, folder }
      this.$store.dispatch('uploadImg/uploadFile', data).then((response) => {
        if (!response.error) {
          this.image_zoom_out_url_promotion = response.data.data.image_url
          // console.log(response.data.data.image_url, '1')
        }
      })
    },
    // upload ảnh khuyến mại
    file_selected_avatar_promotion(file) {
      this.avatar_promotion = file
      this.required_img_avatar_promotion = false
      const formData = new FormData()
      formData.append('file', file)
      const folder = Folder.danh_muc_bai_viet
      const data = { formData, folder }
      this.$store.dispatch('uploadImg/uploadFile', data).then((response) => {
        if (!response.error) {
          this.image_avatar_url_promotion = response.data.data.image_url
        }
      })
    },

    toggle() {
      this.$emit('toggle')
      if (this.choose_form === 2) {
        this.$refs.input_file_img_zoom_out_promotion_edit.reset('')
        this.$refs.input_file_img_avatar_promotion_edit.reset('')
      } else {
        this.$refs.input_file_img_avatar_default.reset('')
        this.$refs.input_file_img_zoom_out_default.reset('')
      }
    },
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
}
</style>
