<template>
  <div class="main-tour">
    <client-only>
      <div v-if="open_add === 1">
        <div class="d-flex w-100 actions-coordinates-1 py-2 mt-n2">
          <v-spacer></v-spacer>

          <v-btn
            large
            depressed
            width="114px"
            height="39px"
            color="#47BBFF"
            class="mr-5 text-none white--text"
            @click="open_change = true"
          >
            <img class="mr-1" src="~/assets/icon/copy.png" />
            Nhân bản
          </v-btn>

          <v-btn
            large
            depressed
            width="114px"
            height="39px"
            color="#4873C2"
            class="mr-5 text-none white--text"
            @click="open_reset = true"
          >
            <img class="mr-1" src="~/assets/icon/change.png" /> Đặt lại
          </v-btn>

          <v-btn
            large
            depressed
            width="120px"
            height="39px"
            color="#4873C2"
            class="mr-5 text-none white--text"
            @click="preview_validate_all"
          >
            <img class="mr-1" src="~/assets/icon/view.svg" />
            Xem trước
          </v-btn>
          <div class="d-flex w-100 actions-coordinates-2">
            <!-- @click="config_insert" -->
            <div class="flex-grow-1"></div>
            <v-btn
              large
              depressed
              width="108px"
              height="39px"
              color="#FF0F59"
              class="mr-5 text-none white--text"
              @click="open_cancel = true"
              ><v-icon></v-icon> Hủy
            </v-btn>
            <div v-if="disabled">
              <v-btn
                large
                depressed
                width="101px"
                height="39px"
                color="#47BBFF"
                dark
                class="mr-5 text-none white--text"
                @click="open_save = true"
                ><v-icon></v-icon> Lưu
              </v-btn>
            </div>

            <!-- validate_all -->
          </div>
        </div>

        <div class="pt-16 pb-5">
          <div class="ml-12 d-flex">
            <div class="font-weight-bold fs-17 pr-7 pt-1">Hiển thị/ Ẩn</div>
            <v-switch
              v-model="status_page"
              inset
              class="ma-0"
              color="#47bbff"
              :true-value="1"
              :false-value="0"
            ></v-switch>
          </div>
          <!-- ẩn hiện tiêu đề -->

          <div class="ml-14">
            <div class="font-weight-bold fs-14">
              Tiêu đề trang <span class="red--text pl-1">*</span>
            </div>
            <v-row>
              <v-col cols="10" class="py-0"
                ><v-text-field
                  v-model="page_title"
                  :error-messages="page_title_errors"
                  flat
                  solo
                  dense
                  placeholder="Nhập tiêu đề"
                  class="border-1 fs-14"
                  @input="page_title_errors = []"
                ></v-text-field
              ></v-col>
            </v-row>
          </div>
          <div class="ml-14">
            <div class="font-weight-bold fs-14">URL thân thiện cho SEO</div>
            <v-col class="pa-0" cols="10">
              <div class="d-flex">
                <v-text-field
                  v-model="path"
                  :error-messages="path_errors"
                  class="border-1 rounded-r-0 fs-14"
                  solo
                  flat
                  dense
                  @input="path_errors = []"
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
                      @click="copy_text(`copy-text`)"
                    >
                      <v-icon> mdi-content-copy </v-icon>
                    </v-btn>
                  </template>
                  <span>Copy</span>
                </v-tooltip>
              </div>
              <div :id="`copy-text`" class="d-none">
                {{ `${$store.state.app.domain_name}${path}` }}
              </div>
            </v-col>
          </div>
          <div class="ml-14 mt-3">
            <div class="font-weight-bold fs-14">
              Hình ảnh Slider <span class="red--text pl-1">*</span>
            </div>
          </div>
          <div class="ml-12">
            <v-row>
              <v-col cols="10" class="py-0 pr-2">
                <!-- :errormsg="error_slider" -->
                <!-- <files
                id="selected-files-slider"
                ref="selected_files_slider"
                :list="image_list"
                :maxrequied="max_requied"
                :errormsg="error_slider"
                @slider="slider_list"
              ></files> -->

                <v-card
                  outlined
                  height="140"
                  style="
                    overflow-y: auto;
                    background-color: #f5f7fe;
                    border: none;
                  "
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
                      <icon-select-file></icon-select-file>
                    </div>
                  </div>
                  <slot></slot>
                  <draggable
                    :list="slider_id"
                    class="d-flex justify-center"
                    @change="move_file_slider"
                  >
                    <template v-for="(image, idx) in slider_id">
                      <div :key="`${idx}+${image}`">
                        <v-img
                          :src="image.image"
                          style="cursor: move"
                          class="ml-2"
                          height="120"
                          width="120"
                        >
                        </v-img>
                        <v-icon
                          style="
                            cursor: pointer;
                            position: absolute;
                            top: 10px;
                            margin-left: 108px;
                          "
                          size="20"
                          color="error"
                          @click="delete_img_slider(idx)"
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
                      {{ error_msg_slider }}
                    </div>
                  </div>
                </div>
                <v-file-input
                  id="input_file"
                  ref="input_file"
                  :value="reset_file"
                  multiple
                  accept="image/png, image/jpeg, image/bmp"
                  class="d-none"
                  @change="inputFile"
                ></v-file-input>
              </v-col>
            </v-row>
            <!-- <div
            class="v-messages theme--light error--text mt-1 ml-2 mb-2"
            role="alert"
          >
            <div class="v-messages__wrapper">
              <div class="v-messages__message">{{ error_msg_slider }}</div>
            </div>
          </div> -->
          </div>

          <!-- ẩn hiện combo -->

          <div class="ml-12 d-flex">
            <div class="font-weight-bold fs-14 mt-1 pr-7">Combo du lịch</div>
            <v-switch
              v-model="status_combo"
              class="ma-0"
              color="#47bbff"
              inset
              :true-value="1"
              :false-value="0"
            ></v-switch>
          </div>

          <div class="ml-14">
            <div class="font-weight-bold fs-14">
              Tiêu đề <span class="red--text pl-1">*</span>
            </div>
            <v-row>
              <v-col cols="10" class="py-0">
                <v-text-field
                  v-model="combo_title"
                  :error-messages="combo_title_errors"
                  flat
                  solo
                  dense
                  class="border-1 fs-14"
                  placeholder="Nhập tiêu đề"
                  @input="combo_title_errors = []"
                ></v-text-field>
              </v-col>
            </v-row>
            <div class="font-weight-bold fs-14">Mô tả ngắn</div>
            <v-row>
              <v-col cols="10" class="py-0">
                <v-text-field
                  v-model="description_combo"
                  flat
                  solo
                  dense
                  hide-details
                  class="border-1 fs-14"
                  placeholder="Mô tả ngắn"
                ></v-text-field>
              </v-col>
            </v-row>
          </div>
          <div class="ml-14 mt-3">
            <div class="font-weight-bold fs-14">
              Danh sách combo du lịch <span class="red--text pl-1">*</span>
            </div>
          </div>
          <!-- //list Combo du lịch -->
          <div class="ml-12">
            <v-row>
              <v-col cols="10" style="height: 140px" class="py-0 pr-2">
                <v-card
                  solo
                  flat
                  height="135px"
                  style="overflow-y: auto; background-color: #f5f7fe"
                  class="d-flex align-center"
                >
                  <div
                    class="ml-2"
                    style="cursor: pointer"
                    @click="open_combo_tour"
                  >
                    <icon-select-file></icon-select-file>
                  </div>
                  <draggable
                    :list="image_url"
                    class="d-flex justify-center"
                    @change="move_file"
                  >
                    <template v-for="(image, idx) in image_url">
                      <div :key="`${idx}+${image}`">
                        <!-- @mousemove="mousemove" -->
                        <!-- @mouseleave="mouseleave" -->
                        <div v-if="image.status === 1">
                          <v-hover v-slot="{ hover }">
                            <v-img
                              :src="image.image"
                              class="ml-2 mb-2"
                              height="120"
                              width="120"
                            >
                              <v-expand-transition>
                                <div
                                  v-if="hover"
                                  class="
                                    d-flex
                                    transition-fast-in-fast-out
                                    fs-14
                                    white
                                    v-card--reveal
                                    text-truncate
                                    black--text
                                  "
                                  style="height: 100%"
                                >
                                  <span
                                    class="text-truncate"
                                    style="max-width: 100px"
                                    >{{ image.tilte }}</span
                                  >
                                </div>
                              </v-expand-transition></v-img
                            >
                          </v-hover>
                        </div>
                        <div v-else>
                          <v-img
                            :src="image.image"
                            class="ml-2 mb-2 style-image"
                            height="120"
                            width="120"
                          >
                            <!-- <div
                            class="ml-2 mb-2 pt-2 fs-14 text-truncate"
                            align="center"
                          >
                            {{ image.tilte }}
                          </div> -->
                          </v-img>
                          <div
                            class="pt-13 mx-4"
                            align="center"
                            style="position: absolute; top: 0; width: 100px"
                          >
                            <v-icon size="28">mdi-eye-off</v-icon>
                            <div
                              class="pt-3 fs-14 text-truncate"
                              style="max-width: 100px"
                            >
                              {{ image.tilte }}
                            </div>
                          </div>
                        </div>

                        <div
                          class="ml-2 d-flex"
                          style="position: absolute; top: 5px"
                        >
                          <v-icon
                            size="22"
                            style="cursor: move"
                            color="secondary"
                            >mdi-cursor-move</v-icon
                          >
                          <v-icon
                            style="cursor: pointer"
                            color="primary"
                            class="ml-6"
                            @click="open_edit_combo_tour(image)"
                            >mdi-pencil-circle</v-icon
                          >
                          <v-icon
                            style="cursor: pointer"
                            color="error"
                            class="ml-6"
                            @click="delete_img(image.id)"
                            >mdi-close-circle</v-icon
                          >
                        </div>
                      </div>
                    </template>
                  </draggable>
                </v-card>
                <div
                  class="v-messages theme--light error--text mt-1 ml-2 mb-2"
                  role="alert"
                >
                  <div class="v-messages__wrapper">
                    <div class="v-messages__message">{{ error_msg }}</div>
                  </div>
                </div>
              </v-col>
            </v-row>
          </div>

          <!-- //khách sạn -->
          <div class="ml-12 d-flex mt-3">
            <div class="font-weight-bold fs-14 pt-1 pr-7">Khách sạn</div>
            <v-switch
              v-model="status_hotel"
              class="ma-0"
              color="#47bbff"
              inset
              :true-value="1"
              :false-value="0"
            ></v-switch>
          </div>
          <!-- ẩn tiêu đề khách sạn -->

          <div class="ml-14">
            <div class="font-weight-bold fs-14">
              Tiêu đề <span class="red--text pl-1">*</span>
            </div>
            <v-row>
              <v-col cols="10" class="py-0">
                <v-text-field
                  v-model="hotel_title"
                  :error-messages="hotel_title_errors"
                  flat
                  solo
                  dense
                  class="border-1 fs-14"
                  placeholder="Nhập tiêu đề cho block khách sạn"
                  @input="hotel_title_errors = []"
                ></v-text-field>
              </v-col>
            </v-row>
            <div class="font-weight-bold fs-14">Mô tả ngắn</div>
            <v-row>
              <v-col cols="10" class="py-0">
                <v-text-field
                  v-model="description_hotel"
                  flat
                  solo
                  dense
                  hide-details
                  class="border-1 fs-14"
                  placeholder="Mô tả ngắn"
                ></v-text-field>
              </v-col>
            </v-row>
            <div class="mt-4">
              <v-row>
                <v-col cols="auto">
                  <div class="font-weight-bold fs-14">Sắp xếp</div>
                </v-col>
                <v-col cols="3" class="pt-1">
                  <v-select
                    v-model="choose_hotel"
                    :items="Sort_hotel"
                    solo
                    hide-details
                    dense
                    class="border-1 fs-14"
                    :menu-props="{ zIndex: '1' }"
                    flat
                    style="width: 200px"
                  >
                    <template #append
                      ><v-divider vertical></v-divider
                      ><v-icon class="pl-2">mdi-menu-down</v-icon></template
                    >
                  </v-select>
                </v-col>
              </v-row>
            </div>
          </div>

          <!-- //nhà hàng -->

          <div class="ml-12 d-flex">
            <div class="font-weight-bold fs-14 pt-1 pr-7">Nhà hàng</div>

            <v-switch
              v-model="status_restaurant"
              class="ma-0"
              color="#47bbff"
              inset
              :false-value="0"
              :true-value="1"
            ></v-switch>
          </div>
          <div class="ml-14">
            <div class="font-weight-bold fs-14">
              Tiêu đề <span class="red--text pl-1">*</span>
            </div>
            <v-row>
              <v-col cols="10" class="py-0">
                <v-text-field
                  v-model="restaurant_title"
                  :error-messages="restaurant_title_errors"
                  flat
                  solo
                  dense
                  class="border-1 fs-14"
                  placeholder="Nhập tiêu đề cho block Nhà hàng"
                  @input="restaurant_title_errors = []"
                ></v-text-field>
              </v-col>
            </v-row>
            <div class="font-weight-bold fs-14">Mô tả ngắn</div>
            <v-row>
              <v-col cols="10" class="py-0">
                <v-text-field
                  v-model="description_restaurant"
                  flat
                  solo
                  hide-details
                  dense
                  class="border-1 fs-14"
                  placeholder="Mô tả ngắn"
                ></v-text-field>
              </v-col>
            </v-row>
            <div class="mt-4">
              <v-row>
                <v-col cols="auto">
                  <div class="font-weight-bold fs-14">Sắp xếp</div>
                </v-col>
                <v-col cols="3" class="pt-1">
                  <v-select
                    v-model="choose_restaurant"
                    :items="Sort_restaurant"
                    solo
                    dense
                    hide-details
                    :value="0"
                    class="border-1"
                    :menu-props="{ zIndex: '1' }"
                    flat
                    style="width: 200px"
                  >
                    <template #append
                      ><v-divider vertical></v-divider
                      ><v-icon class="pl-2">mdi-menu-down</v-icon></template
                    >
                  </v-select>
                </v-col>
              </v-row>
            </div>
          </div>

          <!-- //tour du lịch -->

          <div class="ml-12 d-flex">
            <div class="font-weight-bold fs-14 pt-1 pr-7">Tour du lịch</div>

            <v-switch
              v-model="status_tour"
              class="ma-0"
              color="#47bbff"
              inset
              :true-value="1"
              :false-value="0"
            ></v-switch>
          </div>

          <div class="ml-14">
            <div class="font-weight-bold fs-16">
              Tiêu đề <span class="red--text pl-1">*</span>
            </div>
            <v-row>
              <v-col cols="10" class="py-0">
                <v-text-field
                  v-model="tour_title"
                  :error-messages="tour_title_errors"
                  flat
                  solo
                  dense
                  class="border-1 fs-14"
                  placeholder="Nhập tiêu đề cho block Tour du lịch"
                  @input="tour_title_errors = []"
                ></v-text-field>
              </v-col>
            </v-row>
            <div class="font-weight-bold fs-14">Mô tả ngắn</div>
            <v-row>
              <v-col cols="10" class="py-0">
                <v-text-field
                  v-model="description_tour"
                  flat
                  solo
                  dense
                  hide-details
                  class="border-1 fs-14"
                  placeholder="Mô tả ngắn"
                ></v-text-field>
              </v-col>
            </v-row>
            <div class="mt-4">
              <v-row>
                <v-col cols="auto">
                  <div class="font-weight-bold fs-14">Sắp xếp</div>
                </v-col>
                <v-col cols="3" class="pt-1">
                  <v-select
                    v-model="choose_tour"
                    :items="Sort_tour"
                    solo
                    dense
                    hide-details
                    :menu-props="{ zIndex: '1' }"
                    class="border-1"
                    flat
                    style="width: 200px"
                  >
                    <template #append
                      ><v-divider vertical></v-divider
                      ><v-icon class="pl-2">mdi-menu-down</v-icon></template
                    >
                  </v-select>
                </v-col>
              </v-row>
            </div>
          </div>

          <!-- // videos -->
          <div class="ml-12 d-flex">
            <div class="font-weight-bold fs-14 pt-1 pr-7">Videos</div>

            <v-switch
              v-model="status_videos"
              class="ma-0"
              color="#47bbff"
              inset
              :true-value="1"
              :false-value="0"
            ></v-switch>
          </div>

          <div class="ml-14">
            <div class="font-weight-bold fs-14">
              Tiêu đề<span class="red--text pl-1">*</span>
            </div>
            <v-row>
              <v-col cols="10" class="py-0">
                <v-text-field
                  v-model="video_title"
                  :error-messages="video_title_errors"
                  flat
                  solo
                  dense
                  class="border-1 fs-14"
                  placeholder="Nhập tiêu đề cho block "
                  @input="video_title_errors = []"
                ></v-text-field>
              </v-col>
            </v-row>
            <div class="font-weight-bold fs-14">Mô tả ngắn</div>
            <v-row>
              <v-col cols="10" class="py-0">
                <v-text-field
                  v-model="description_video"
                  flat
                  solo
                  dense
                  class="border-1 fs-14"
                  placeholder="Mô tả ngắn"
                ></v-text-field>
              </v-col>
            </v-row>
            <div>
              <div class="font-weight-bold fs-14">
                Videos<span class="red--text ml-1">*</span>
              </div>
              <v-row>
                <v-col cols="10" class="py-0">
                  <v-select
                    v-model="select_choose"
                    :error-messages="select_choose_errors"
                    solo
                    flat
                    dense
                    clearable
                    class="border-1 fs-14"
                    :menu-props="{ zIndex: '1' }"
                    placeholder="Chọn loại upload"
                    :items="videos"
                    @change="reset_model"
                    @input="select_choose_errors = []"
                  ></v-select>
                </v-col>
              </v-row>
            </div>
          </div>
          <!-- check video -->
          <!-- Link liên kết -->
          <div v-if="select_choose === 0" class="ml-14">
            <!-- ảnh link liên kết -->
            <div class="pb-2">
              <div class="d-flex align-center">
                <div
                  v-if="(image_link || []).length === 0"
                  style="cursor: pointer; width: fit-content"
                  @click="select_file_image_link"
                >
                  <IconSelectFile class="rounded" />
                </div>
                <div v-else>
                  <v-img
                    class="rounded"
                    style="cursor: pointer"
                    :src="image_link"
                    width="120"
                    height="120"
                    @click="select_file_image_link"
                  />
                </div>
                <v-btn
                  v-if="!hidden_image_link"
                  class="text-none text-body-2 rounded ml-4"
                  color="white"
                  height="32"
                  style="color: #47bbff"
                  depressed
                  @click="select_file_image_link"
                >
                  Chỉnh sửa
                </v-btn>
              </div>
              <div
                v-if="limited_msg_image_link.length !== 0"
                class="v-messages theme--light error--text mt-1"
                role="alert"
              >
                <div class="v-messages__wrapper">
                  <div class="v-messages__message">
                    {{ limited_msg_image_link }}
                  </div>
                </div>
              </div>
              <v-file-input
                id="input_image_link_file"
                accept="image/png, image/jpeg, image/gif"
                class="d-none"
                :value="reset_file_image_link"
                @change="inputFileImageLink($event)"
              />
            </div>

            <!-- end ảnh link liên kết -->

            <div class="font-weight-bold fs-14">Link liên kết</div>
            <v-row>
              <v-col cols="10" class="pt-2">
                <v-text-field
                  v-model="video_url"
                  :error-messages="video_url_error"
                  solo
                  dense
                  flat
                  class="border-1 fs-14"
                  placeholder="Nhập link liên kết"
                  @input="video_url_error = []"
                >
                </v-text-field>
              </v-col>
            </v-row>
          </div>
          <!-- Video file -->
          <div v-if="select_choose === 1" class="ml-14">
            <div class="font-weight-bold fs-14">
              Video file <span class="red--text">*</span>
            </div>

            <!-- <div>
              <div class="d-flex align-center">
                <div
                  v-if="$isNullOrEmpty(img_video)"
                  style="cursor: pointer; width: fit-content"
                  @click="select_file_video"
                >
                  <no-file class="rounded"></no-file>
              
                </div>
                <div v-else>
                  <div @click="open_cancel_video = true">
                    <video
                      :poster="imgUrl"
                      style="cursor: pointer"
                      width="200"
                      height="120"
                    ></video>
                    <div
                      style="
                        position: absolute;
                        margin-top: -75px;
                        margin-left: 85px;
                        width: 24px;
                        height: 24px;
                        cursor: pointer;
                        background-color: hsla(0, 0%, 100%, 0.4);
                      "
                    >
                      <img
                        width="24px"
                        class="mr-1"
                        src="~/assets/icon/video.svg"
                      />
                    </div>
                  </div>
                </div>

                <v-btn
                  class="text-none text-body-2 rounded ml-4"
                  color="white"
                  height="32"
                  style="color: #47bbff"
                  depressed
                  @click="select_file_video"
                >
                  Chỉnh sửa
                </v-btn>
              </div>

              <div
                class="v-messages theme--light error--text mt-1"
                role="alert"
              >
                <div class="v-messages__wrapper">
                  <div class="v-messages__message">{{ limited_msg }}</div>
                </div>
              </div>
              <v-file-input
                id="input_file_video"
                ref="input_file_video"
                accept="video/mp4,video/x-m4v"
                class="d-none"
                :value="reset_file"
                @change="inputFileVideo"
              ></v-file-input>

              <DialogVideo
                :open="open_cancel_video"
                :data="img_video"
                :persistent="true"
                @toggle="open_cancel_video = !open_cancel_video"
              >
              </DialogVideo>
            </div> -->
            <section>
              <div>
                <div class="d-flex align-center">
                  <div
                    v-if="$isNullOrEmpty(img_thumbnail)"
                    style="cursor: pointer; width: fit-content"
                    @click="select_file_video"
                  >
                    <no-file class="rounded"></no-file>
                  </div>
                  <div v-else>
                    <div
                      style="cursor: pointer"
                      @click="open_cancel_video = true"
                    >
                      <v-hover v-slot="{ hover }">
                        <v-img
                          width="200px"
                          height="120px"
                          class="mr-1"
                          :src="img_thumbnail"
                        >
                          <v-expand-transition>
                            <div
                              v-if="hover"
                              class="
                                d-flex
                                transition-fast-in-fast-out
                                fs-14
                                white
                                v-card--reveal
                                text-truncate
                                black--text
                              "
                              style="height: 100%"
                            >
                              <span
                                class="text-truncate"
                                style="max-width: 150px"
                                >{{ img_name }}</span
                              >
                            </div>
                          </v-expand-transition>
                        </v-img>
                      </v-hover>
                    </div>
                  </div>

                  <v-btn
                    class="text-none text-body-2 rounded ml-4"
                    color="white"
                    height="32"
                    style="color: #47bbff"
                    depressed
                    @click="select_file_video"
                  >
                    Chỉnh sửa
                  </v-btn>
                </div>

                <div
                  class="v-messages theme--light error--text mt-1"
                  role="alert"
                >
                  <div class="v-messages__wrapper">
                    <div class="v-messages__message">{{ limited_msg }}</div>
                  </div>
                </div>
                <input
                  id="input_file_video"
                  ref="input_file_video"
                  type="file"
                  class="d-none"
                  accept="video/mp4,video/x-m4v"
                  @change="getVideoThumbnail"
                />

                <DialogVideo
                  :open="open_cancel_video"
                  :data="img_video"
                  :persistent="true"
                  @toggle="open_cancel_video = !open_cancel_video"
                >
                </DialogVideo>
              </div>
            </section>
          </div>
          <div v-else></div>

          <!-- đối tác đồng hành -->
          <div class="ml-12 d-flex">
            <div class="font-weight-bold fs-14 pt-1 pr-7">
              Đối tác đồng hành
            </div>

            <v-switch
              v-model="status_partner"
              class="ma-0"
              color="#47bbff"
              inset
              :true-value="1"
              :false-value="0"
            ></v-switch>
          </div>

          <div class="ml-14">
            <div class="font-weight-bold fs-14">
              Tiêu đề <span class="red--text pl-1">*</span>
            </div>
            <v-row>
              <v-col cols="10" class="py-0">
                <v-text-field
                  v-model="partner_title"
                  :error-messages="partner_title_errors"
                  flat
                  solo
                  dense
                  class="border-1 fs-14"
                  placeholder="Nhập tiêu đề cho block "
                  @input="partner_title_errors = []"
                ></v-text-field>
              </v-col>
            </v-row>
            <div class="font-weight-bold fs-14">Mô tả ngắn</div>
            <v-row>
              <v-col cols="10" class="py-0">
                <v-text-field
                  v-model="description_partner"
                  flat
                  solo
                  dense
                  class="border-1 fs-14"
                  placeholder="Mô tả ngắn"
                ></v-text-field>
              </v-col>
            </v-row>
            <div>
              <div class="font-weight-bold fs-14">
                Danh sách đối tác<span class="red--text pl-1">*</span>
              </div>
            </div>
          </div>
          <!-- <v-btn
            ref="button"
            block
            color="primary"
            @click="$vuetify.goTo(target, options)"
            >scroll
          </v-btn> -->
          <!-- //list doi tac -->
          <div class="ml-12 pb-10">
            <v-row>
              <v-col cols="10" style="height: 140px" class="py-0 pr-2">
                <v-card
                  solo
                  flat
                  height="135px"
                  style="overflow-y: auto; background-color: #f5f7fe"
                  class="d-flex align-center"
                >
                  <div
                    class="ml-2"
                    style="cursor: pointer"
                    @click="open_partner"
                  >
                    <icon-select-file></icon-select-file>
                  </div>
                  <draggable
                    class="d-flex justify-center"
                    :list="image_url_partner"
                    @change="move_file_partner"
                  >
                    <template v-for="(image, idx) in image_url_partner">
                      <div :key="`${idx}+${image}`">
                        <div v-if="image.status === 1">
                          <v-hover v-slot="{ hover }">
                            <v-img
                              contain
                              :src="image.logo"
                              class="ml-2 mb-2"
                              height="120"
                              width="120"
                            >
                              <v-expand-transition>
                                <div
                                  v-if="hover"
                                  class="
                                    d-flex
                                    transition-fast-in-fast-out
                                    fs-14
                                    white
                                    v-card--reveal
                                    black--text
                                  "
                                  style="height: 100%"
                                >
                                  <span
                                    class="text-truncate"
                                    style="max-width: 100px"
                                  >
                                    {{ image.tilte }}</span
                                  >
                                </div>
                              </v-expand-transition>
                            </v-img>
                          </v-hover>
                        </div>
                        <div v-else>
                          <v-img
                            contain
                            :src="image.logo"
                            class="ml-2 mb-2 style-image"
                            height="120"
                            width="120"
                          >
                          </v-img>
                          <div
                            class="pt-13 pl-2"
                            align="center"
                            style="
                              position: absolute;
                              top: 0;
                              width: 120px;
                              height: 120px;
                            "
                          >
                            <v-icon size="28">mdi-eye-off</v-icon>
                            <div class="pt-3 fs-14 text-truncate">
                              {{ image.tilte }}
                            </div>
                          </div>
                        </div>

                        <div
                          class="ml-2 d-flex"
                          style="position: absolute; top: 5px"
                        >
                          <v-icon
                            size="22"
                            style="cursor: move"
                            color="secondary"
                            >mdi-cursor-move</v-icon
                          >
                          <v-icon
                            style="cursor: pointer"
                            color="primary"
                            class="ml-6"
                            @click="open_edit_parter(image)"
                            >mdi-pencil-circle</v-icon
                          >
                          <v-icon
                            style="cursor: pointer"
                            color="error"
                            class="ml-6"
                            @click="delete_img_parter(image.id)"
                            >mdi-close-circle</v-icon
                          >
                        </div>
                      </div>
                    </template>
                  </draggable>
                </v-card>
                <div
                  class="v-messages theme--light error--text mt-1 ml-2 mb-2"
                  role="alert"
                >
                  <div class="v-messages__wrapper">
                    <div class="v-messages__message">
                      {{ error_msg_parter }}
                    </div>
                  </div>
                </div>
              </v-col>
            </v-row>
          </div>
        </div>
      </div>

      <add-combo-tour
        v-show="open_add === 2"
        :open="open_add"
        @exit="scroll_combo"
        @add="add_combo"
      ></add-combo-tour>
      <edit-combo-tour
        v-show="open_add === 4"
        :open="open_add"
        :data="dataItem"
        @exit="scroll_combo"
        @edit="edit_combo"
      >
      </edit-combo-tour>
      <add-partner
        v-show="open_add === 3"
        :open="open_add"
        @exit="scroll_partner"
        @add="add_partner"
      ></add-partner>
      <edit-parter
        v-show="open_add === 5"
        :open="open_add"
        :data="data_item_parter"
        @exit="scroll_partner"
        @edit="edit_parter"
      >
      </edit-parter>
      <!-- dialog chứa năng nhân bản -->
      <change-name
        :open="open_change"
        @toggle="open_change = !open_change"
        @OK="page_clone"
      />
      <!-- // chức năng đặt lại -->
      <yes-no-alert
        :open="open_reset"
        alert-msg="Bạn có chắc chắn muốn đặt lại cấu hình trang?"
        @toggle="open_reset = !open_reset"
        @OK="set_again"
      >
      </yes-no-alert>
      <yes-no-alert
        :open="open_save"
        alert-msg="Bạn có chắc chắn muốn lưu thông tin cấu hình trang?"
        @toggle="open_save = !open_save"
        @OK="validate_all"
      >
      </yes-no-alert>

      <yes-no-alert
        :open="open_cancel"
        alert-msg="Bạn có chắc chắn muốn thoát trang?"
        @toggle="open_cancel = !open_cancel"
        @OK="cancel"
      >
      </yes-no-alert>
      <yes-no-alert
        :open="open_confirm"
        alert-msg="Bạn có chắc chắn muốn thoát không?"
        @toggle="open_confirm = !open_confirm"
        @OK="open_add = 1"
      ></yes-no-alert>
    </client-only>
  </div>
</template>
<script>
import Draggable from 'vuedraggable'
import IconSelectFile from '~/components/icon/SelectFile'
import ChangeName from '~/components/Quan-tri-trang-chu/ChangeName'
import BASE from '~/assets/configurations/BASE_URL'
import AddComboTour from '~/components/Quan-tri-trang-chu/AddComboTour.vue'
import EditComboTour from '~/components/Quan-tri-trang-chu/EditComboTour.vue'
import AddPartner from '~/components/Quan-tri-trang-chu/AddPartner.vue'
import EditParter from '~/components/Quan-tri-trang-chu/EditPartner.vue'
// import Files from '~/components/Selected/FileSlider'
// import SelectFileVideo from '~/components/Selected/FileVideo'
import Folder from '~/assets/configurations/Folder_Config'
// import SelectFile from '~/components/icon/SelectFile'
// import ListPartner from '~/components/ComponentListImg/ListPartner.vue'
import DialogVideo from '~/components/Quan-tri-trang-chu/DialogVideo'
import NoFile from '~/components/icon/NoFile'
import imgUrl from '~/assets/login/img-video.png'
// import GetVideoThumbnail from '~/components/GetVideoThumbnail.vue'
export default {
  components: {
    // Files,
    // SelectFile,
    IconSelectFile,
    AddComboTour,
    AddPartner,
    EditParter,
    ChangeName,
    EditComboTour,
    Draggable,
    // SelectFileVideo,
    NoFile,
    DialogVideo,
  },
  // mixins: [GetVideoThumbnail],
  props: {
    open: {
      type: Number,
      required: true,
    },
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      required_img_link: false,
      reset_file_image_link: null,
      image_link: '',
      limited_msg_image_link: '',
      hidden_image_link: false,
      easing: 'easeInOutCubic',
      GetVideoThumbnail: null,
      GetVideoThumbnailVideo: null,
      GetVideoThumbnailUrl: null,
      GetVideoThumbnailUrlResolve: null,
      disabled: true,
      open_confirm: false,
      imgUrl,
      reset_file_video: null,
      img: '',
      limited_msg: '',
      open_cancel_video: false,
      error_msg_slider: '',
      error_msg: '',
      error_msg_parter: '',
      status_restaurant: 1,
      status_partner: 1,
      status_videos: 1,
      status_tour: 1,
      status_page: 1,
      status_combo: 1,
      status_hotel: 1,
      images: [],
      avatar: '',
      // title: 'Sàn du lịch',
      dataItem: null,
      data_item_parter: null,
      maxrequied: 6,
      name_page: null,
      page_title: null,
      combo_title: null,
      description_combo: null,
      hotel_title: null,
      description_hotel: null,
      choose_hotel: 0,
      restaurant_title: null,
      description_restaurant: null,
      choose_restaurant: 0,
      tour_title: null,
      description_tour: null,
      choose_tour: 0,
      video_title: null,
      select_choose: 0,
      video_url: null,
      description_video: null,
      partner_title: null,
      description_partner: null,
      partner_title_errors: [],
      video_file_errors: [],
      video_url_error: [],
      select_choose_errors: [],
      video_title_errors: [],
      tour_title_errors: [],
      restaurant_title_errors: [],
      hotel_title_errors: [],
      combo_title_errors: [],
      page_title_errors: [],
      name_page_errors: [],
      path_errors: [],
      path: null,
      open_change: false,
      open_reset: false,
      open_save: false,
      open_cancel: false,
      file_img: '',
      required_video: false,
      list_combo: [],
      required_img: false,
      open_add: 1,
      max_requied: 6,
      url_web: BASE,
      error_slider: '',
      error_combo: '',
      error_partner: '',
      file_video_url: '',
      file_video: '',
      image_url: [],
      image_url_partner: [],
      delete_id_combo: [],
      images_url: [],
      is_list_combo_id: [],
      is_list_partner_id: [],
      is_list_slider_id: [],
      list_slider_id: [],
      img_slider: [],
      slider_id: [],
      is_slider_id: [],
      image_list: [],
      file_url_video: '',
      img_video: '',
      img_thumbnail: '',
      img_name: '',
      offset_page: 0,
      offset_combo: 600,
      offset_partner: 9999,
      // demo
      reset_file: [],
      // slider_id: [],
      // images: [],
      // stt: -1,
      // error_msg: '',
      // is_slider_id: null,

      Sort_hotel: [
        { value: 1, text: 'Mặc định' },
        { value: 2, text: 'Đánh giá cao nhất' },
        { value: 3, text: 'Giá cao nhất' },
        { value: 4, text: 'Giá thấp nhất' },
      ],
      Sort_restaurant: [
        { value: 1, text: 'Mặc định' },
        { value: 2, text: 'Đánh giá cao nhất' },
        { value: 3, text: 'Giá cao nhất' },
        { value: 4, text: 'Giá thấp nhất' },
      ],
      Sort_tour: [
        { value: 1, text: 'Mặc định' },
        { value: 2, text: 'Đánh giá cao nhất' },
        { value: 3, text: 'Giá cao nhất' },
        { value: 4, text: 'Giá thấp nhất' },
      ],
      videos: [
        { value: 0, text: 'Link liên kết' },
        { value: 1, text: 'Upload videos file' },
      ],
    }
  },

  watch: {
    open(value) {
      if (value === 4) {
        this.config_detail()
        this.$store.commit(
          'quan_tri_trang_chu/page_id',
          this.data.homeConfigCur
        )
        this.$store.commit('app/checkBack', true)
        this.$vuetify.goTo(this.offset_page)
      }
    },
    open_add(value) {
      if (value === 1) {
        this.$store.commit('app/checkBack', true)
      } else if (value === 2) {
        this.$store.commit('app/setTitle', 'Thêm combo du lịch')
        this.title = 'Thêm combo du lịch'
      } else if (value === 3) {
        this.$store.commit('app/setTitle', 'Thêm đối tác')
        this.title = 'Thêm đối tác'
      } else if (value === 4) {
        this.$store.commit('app/setTitle', 'Cập nhật combo du lịch')
        this.title = 'Cập nhật combo du lịch'
      } else if (value === 5) {
        this.$store.commit('app/setTitle', 'Cập nhật đối tác')
        this.title = 'Cập nhật đối tác'
      }
    },
    '$store.state.app.change_back'(value) {
      if (this.$store.state.app.pageTitle.includes('Thêm combo du lịch')) {
        this.open_add = 1
        this.$store.commit(
          'app/setTitle',
          `${this.data.homeConfigCur.page_tilte}`
        )
        this.scroll_combo()
      } else if (this.$store.state.app.pageTitle === 'Thêm đối tác') {
        this.open_add = 1
        this.$store.commit(
          'app/setTitle',
          `${this.data.homeConfigCur.page_tilte}`
        )
        this.scroll_partner()
      } else if (this.$store.state.app.pageTitle === 'Cập nhật combo du lịch') {
        this.open_add = 1
        this.$store.commit(
          'app/setTitle',
          `${this.data.homeConfigCur.page_tilte}`
        )
        this.scroll_combo()
      } else if (this.$store.state.app.pageTitle === 'Cập nhật đối tác') {
        this.open_add = 1
        this.$store.commit(
          'app/setTitle',
          `${this.data.homeConfigCur.page_tilte}`
        )
        this.scroll_partner()
      }
    },
  },
  // mounted() {
  //   if (!this.$isServer) {

  //   }
  // },

  methods: {
    select_file_image_link() {
      return window.document.getElementById('input_image_link_file').click()
    },
    inputFileImageLink(file) {
      if (!this.$isNullOrEmpty(file)) {
        this.hidden_image_link = false
        let hasErrors = false
        if ((file.size || 0) > 3145728) {
          hasErrors = true
          this.limited_msg_image_link = 'File được chọn không được vượt quá 3MB'
        }
        if (!hasErrors) {
          this.limited_msg_image_link = ''
          this.reset_file_image_link = file
          this.hidden_image_link = false
          if ((file || []).length !== 0) {
            this.image_link = URL.createObjectURL(file)
          }
          this.file_selected_image_link(file)
        }
      }
    },
    file_selected_image_link(file) {
      this.file_img_link = file
      this.required_img_link = false
      const formData = new FormData()
      formData.append('file', this.file_img_link)
      const folder = Folder.quan_tri_trang_chu
      const data = { formData, folder }
      this.$store.dispatch('uploadImg/uploadFile', data).then((response) => {
        if (!response.error) {
          this.image_link = response.data.data.image_url
          // console.log(response.data.data.image_url, '1')
        }
      })
    },
    reset_image_link() {
      this.reset_file_image_link = null
      this.image_link = ''
    },
    delete_image_link() {
      this.file_selected_image_link('')
      this.reset_file_image_link = null
      this.image_link = ''
    },

    preview_validate_all() {
      let hasErrors = false
      let count = 0
      if ((this.page_title || []).length === 0) {
        hasErrors = true
        this.page_title_errors = ['Không được để trống']
        count += 1
      } else if (this.page_title.length > 200) {
        hasErrors = true
        this.page_title_errors = ['Nhập không quá 200 kí tự cho phép']
        count += 1
      } // oke
      if ((this.image_list || []).length === 0) {
        hasErrors = true
        this.error_slider = 'Không được để trống'
        count += 1
      }
      if (this.$isNullOrEmpty(this.combo_title)) {
        hasErrors = true
        this.combo_title_errors = ['Không được để trống']
        count += 1
      } else if ((this.combo_title || []).length > 200) {
        hasErrors = true
        this.combo_title_errors = ['Nhập không quá 200 kí tự cho phép']

        count += 1
      } // oke
      if ((this.image_url || []).length === 0) {
        hasErrors = true
        this.error_msg = 'Không được để trống'
        count += 1
      }

      if (this.$isNullOrEmpty(this.hotel_title)) {
        hasErrors = true
        this.hotel_title_errors = ['Không được để trống']
        count += 1
      } else if ((this.hotel_title || []).length > 200) {
        hasErrors = true
        this.hotel_title_errors = ['Nhập không quá 200 kí tự cho phép']
        count += 1
      } // oke
      if (this.$isNullOrEmpty(this.restaurant_title)) {
        hasErrors = true
        this.restaurant_title_errors = ['Không được để trống']
        count += 1
      } else if ((this.restaurant_title || []).length > 200) {
        hasErrors = true
        this.restaurant_title_errors = ['Nhập không quá 200 kí tự cho phép']
        count += 1
      } // oke
      if (this.$isNullOrEmpty(this.tour_title)) {
        hasErrors = true
        this.tour_title_errors = ['Không được để trống']
        count += 1
      } else if ((this.tour_title || []).length > 200) {
        hasErrors = true
        this.tour_title_errors = ['Nhập không quá 200 kí tự cho phép']
        count += 1
      } // oke
      if (this.$isNullOrEmpty(this.video_title)) {
        hasErrors = true
        this.video_title_errors = ['Không được để trống']
        count += 1
      } else if ((this.video_title || []).length > 200) {
        hasErrors = true
        this.video_title_errors = ['Nhập không quá 200 kí tự cho phép']
        count += 1
      } // oke
      if (this.$isNullOrEmpty(this.select_choose)) {
        hasErrors = true
        this.select_choose_errors = ['Bạn chưa chọn loại upload']
        count += 1
      } // oke

      if (this.select_choose === 0) {
        if (!this.$isNullOrEmpty(this.video_url)) {
          if (
            this.$isHasVietnamese(this.video_url) ||
            /\s/g.test(this.video_url)
          ) {
            hasErrors = true
            this.video_url_error = ['Không đúng định dạng link website']
            count += 1
          }
        }
        // if (this.$isHasVietnamese(this.video_url)) {
        //   hasErrors = true
        //   this.video_url_error = ['Không đúng định dạng link website']
        // }
      }
      if (this.select_choose === 1) {
        if (this.$isNullOrEmpty(this.img_video)) {
          hasErrors = true
          this.limited_msg = 'Không được để trống'
          count += 1
        }
      } // oke

      if (this.$isNullOrEmpty(this.partner_title)) {
        hasErrors = true
        this.partner_title_errors = ['Không được để trống']
        count += 1
      } // oke
      if ((this.image_url_partner || []).length === 0) {
        hasErrors = true
        this.error_msg_parter = 'Không được để trống'
        count += 1
      }
      if (!this.$isNullOrEmpty(this.path)) {
        if (this.$isHasVietnamese(this.path) || /\s/g.test(this.path)) {
          hasErrors = true
          this.path_errors = ['Không đúng định dạng link website']
          count += 1
        }
      }
      if (count > 0) {
        this.$showWarnNotify(this, 'Bạn nhập thiếu thông tin bắt buộc')
      }
      if (!hasErrors) {
        this.preview_page_home()
      }
    },
    preview_page_home() {
      const listComboId = []
      for (let i = 0; i < this.image_url.length; i++) {
        listComboId.push(this.image_url[i].id)
        // if (listComboId.length <= 6) {
        this.is_list_combo_id = listComboId.join()
        // }
      }

      const listPartnerId = []
      for (let i = 0; i < this.image_url_partner.length; i++) {
        listPartnerId.push(this.image_url_partner[i].id)
        // if (listPartnerId.length <= 6) {
        this.is_list_partner_id = listPartnerId.join()
        // }
      }

      const listSliderId = []
      for (let i = 0; i < this.slider_id.length; i++) {
        listSliderId.push(this.slider_id[i].id)
        // if (listSliderId.length <= 6) {
        this.is_list_slider_id = listSliderId.join()
        // }
      }

      this.$store
        .dispatch('quan_tri_trang/preview_page_home', {
          homeId: this.data.homeConfigCur.home_id,
          home_status: this.status_page,
          pageTitle: this.page_title,
          pageUrl: this.path,
          comboTitle: this.combo_title,
          comboDesc: this.description_combo,
          comboStatus: this.status_combo,
          hotelTitle: this.hotel_title,
          hotelDesc: this.description_hotel,
          hotelOrder: this.choose_hotel,
          hotelStatus: this.status_hotel,
          restaurantTitle: this.restaurant_title,
          restaurantDesc: this.description_restaurant,
          restaurantOrder: this.choose_restaurant,
          restaurantStatus: this.status_restaurant,
          tourTitle: this.tour_title,
          tourDesc: this.description_tour,
          tourOrder: this.choose_tour,
          tourStatus: this.status_tour,
          videoTitle: this.video_title,
          videoDesc: this.description_video,
          videoStatus: this.status_videos,
          videoUrlType: this.select_choose,
          videoUrl: this.select_choose === 0 ? this.video_url : this.img_video,
          video_thumbnail:
            this.select_choose === 1 ? this.img_thumbnail : this.image_link,
          video_name: this.select_choose === 1 ? this.img_name : null,
          partnerTitle: this.partner_title,
          partnerDesc: this.description_partner,
          partnerStatus: this.status_partner,
          listCombo: this.is_list_combo_id,
          listPartner: this.is_list_partner_id,
          listSlider: this.is_list_slider_id,
          // linkThumbnail: this.select_choose === 0 ? this.image_link : null,
        })
        .then((response) => {
          if (!response.error) {
            window.open(response.data.data)
          }
        })
    },
    scroll_combo() {
      this.open_add = 1
      this.$vuetify.goTo(this.offset_combo)
    },
    scroll_partner() {
      this.open_add = 1
      this.$vuetify.goTo(this.offset_partner)
    },
    downloadURI(uri, name) {
      // console.log('1')
      const link = document.createElement('a')
      link.download = name
      link.href = uri
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },

    timeupdate() {
      // console.log('2')
      const snapped = this.snapImage()
      if (snapped) {
        // console.log('3')
        this.GetVideoThumbnailVideo.removeEventListener(
          'timeupdate',
          this.timeupdate
        )
        this.GetVideoThumbnailVideo.pause()
        this.GetVideoThumbnailUrlResolve(snapped)
      }
    },

    snapImage() {
      // console.log('4')
      const canvas = document.createElement('canvas')
      canvas.width = this.GetVideoThumbnailVideo.videoWidth
      canvas.height = this.GetVideoThumbnailVideo.videoHeight
      canvas
        .getContext('2d')
        .drawImage(
          this.GetVideoThumbnailVideo,
          0,
          0,
          canvas.width,
          canvas.height
        )
      const image = canvas.toDataURL()
      const success = image.length > 100000

      if (success) {
        this.GetVideoThumbnailUrlResolve(image)
        URL.revokeObjectURL(this.GetVideoThumbnailUrl)
      }

      return success
    },

    getThumnail(files) {
      if (files.length) {
        return new Promise((resolve, reject) => {
          this.GetVideoThumbnailUrlResolve = resolve

          const file = files[0]

          const fileReader = new FileReader()
          if (file.type.match('image')) {
            fileReader.onload = () => {
              resolve(fileReader.result)
            }
            fileReader.readAsDataURL(file)
          } else {
            fileReader.onload = () => {
              const blob = new Blob([fileReader.result], { type: file.type })
              this.GetVideoThumbnailUrl = URL.createObjectURL(blob)

              this.GetVideoThumbnailVideo = document.createElement('video')

              this.GetVideoThumbnailVideo.addEventListener('loadeddata', () => {
                const snapped = this.snapImage()
                if (snapped) {
                  this.GetVideoThumbnailVideo.removeEventListener(
                    'timeupdate',
                    this.timeupdate
                  )
                  this.GetVideoThumbnailVideo.pause()
                }
              })

              this.GetVideoThumbnailVideo.addEventListener(
                'timeupdate',
                this.timeupdate
              )

              this.GetVideoThumbnailVideo.preload = 'metadata'

              this.GetVideoThumbnailVideo.src = this.GetVideoThumbnailUrl

              this.GetVideoThumbnailVideo.muted = true
              this.GetVideoThumbnailVideo.playsInline = true
              this.GetVideoThumbnailVideo.play()
            }

            fileReader.readAsArrayBuffer(file)
          }
        })
      } else {
        return false
      }
    },
    // page_update() {
    //   this.$store
    //     .dispatch('quan_tri_trang/page_update', {
    //       page_id: this.data.pages.id,
    //       enable_status: this.status_page,
    //       url_seo: this.path,
    //     })
    //     .then((response) => {
    //       if (!response.error) {
    //         this.$showSuccess(this, 'Cập nhật trang thành công')
    //       }
    //     })
    //     .finally(() => {
    //       this.$emit('toggle')
    //       this.$emit('success')
    //     })
    // },
    copy_text(elementId) {
      console.log(elementId)
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
    page_clone(name) {
      this.$store
        .dispatch('quan_tri_trang_chu/config_replication', {
          homeId: this.data.homeConfigCur.home_id,
          homeName: name,
        })
        .then((response) => {
          if (!response.error) {
            this.$emit('success')
            this.$emit('toggle')
            this.$showSuccess(this, 'Nhân bản trang thành công')
          }
        })
      this.open_change = false
    },
    select_file_video() {
      return window.document.getElementById('input_file_video').click()
    },
    select_file() {
      return window.document.getElementById('input_file').click()
    },

    // silder

    move_file_slider(event) {
      for (let i = 0; i < this.slider_id.length; i++) {
        if (this.slider_id[i].id === event.moved.id) {
          this.slider_id[i] = event
        }
      }
    },
    delete_img_slider(index) {
      this.slider_id.splice(index, 1)
      this.reset_file = []
    },
    insert_slider(slider) {
      this.$store
        .dispatch('quan_tri_trang_chu/insert_slider', {
          homeId: this.data.homeConfigCur.home_id,
          image: slider,
        })
        .then((response) => {
          if (!response.error) {
            for (let i = 0; i < response.data.data.length; i++) {
              this.slider_id.unshift(response.data.data[i])
            }
          }
        })
    },

    // inputFileVideo(file) {
    //   this.disabled = false
    //   if (!this.$isNullOrEmpty(file)) {
    //     let hasErrors = false
    //     if ((file.size || 0) > 209715200) {
    //       hasErrors = true
    //       this.limited_msg = 'File được chọn không được vượt quá 200MB'
    //     }
    //     if (!hasErrors) {
    //       this.limited_msg = ''
    //       const formData = new FormData()
    //       formData.append('file', file)

    //       const folder = Folder.quan_tri_trang_chu
    //       const data = { formData, folder }
    //       this.$store
    //         .dispatch('uploadImg/uploadFile', data)
    //         .then((response) => {
    //           if (!response.error) {
    //             this.img_video = response.data.data.image_url
    //           }
    //           this.disabled = true
    //         })
    //         .catch((e) => {
    //           this.$log.debug(e)
    //         })
    //       this.reset_file = []
    //     }
    //   }
    // },

    // slider
    async getVideoThumbnail(event) {
      this.disabled = false
      if (!this.$isNullOrEmpty(event.target.files[0])) {
        let hasErrors = false
        if ((event.target.files[0].size || 0) > 209715200) {
          hasErrors = true
          this.disabled = true
          this.limited_msg = 'File được chọn không được vượt quá 200MB'
        }

        if (!hasErrors) {
          this.limited_msg = ''
          const img = await this.getThumnail(event.target.files)
          this.img_thumbnail = img
          const formData = new FormData()
          this.img_name = event.target.files[0].name
          const folder = Folder.video_quan_tri_trang_chu
          formData.append('image_type', '.png')
          formData.append('decode_image', this.img_thumbnail.slice(22))
          formData.append('file', event.target.files[0])
          this.$store
            .dispatch('quan_tri_trang_chu/upload_file', {
              folder,
              formData,
              // decodeImage,
              // imageType,
            })
            .then((response) => {
              if (!response.error) {
                this.img_thumbnail = response.data.data.image_thumbnail
                this.img_video = response.data.data.image_url
              }
              this.disabled = true
            })
            .catch((e) => {
              this.$log.debug(e)
            })
          this.reset_file = []
        }
      }
    },

    inputFile(files) {
      let hasErrors = false
      if ((files || []).length === 0) {
        hasErrors = true
        this.error_msg_slider = 'Không được để trống'
      }
      if ((files || []).length !== 0) {
        for (let i = 0; i < files.length; i++) {
          if (files[i].size > 3145728) {
            hasErrors = true
            this.error_msg_slider = 'File được chọn không được vượt quá 3MB'
          }
        }
      }
      if (!hasErrors) {
        this.error_msg_slider = ''
        const formData = new FormData()
        for (let i = 0; i < files.length; i++) {
          formData.append('file', files[i])
        }
        const folder = Folder.quan_tri_trang_chu
        const data = { formData, folder }
        this.$store
          .dispatch('uploadImg/uploadFile', data)
          .then((response) => {
            if (!response.error) {
              this.insert_slider(response.data.data.image_url)
            }
          })
          .catch((e) => {
            this.$log.debug(e)
          })
        this.reset_file = []
      }

      // if ((files || []).length + this.slider_id.length > this.maxrequied) {
      //   this.error_msg = `Vui lòng chọn tối đa ${this.maxrequied} ảnh`
      //   this.$emit('slider', this.slider_id)
      // } else {
      //   this.reset_file = files
      //   this.$emit('slider', this.slider_id)
      //   this.error_msg = ''
      // }
    },
    // end slider
    // slider_list(value) {
    //   this.image_list = value.all_item
    // },

    move_file_partner(event) {
      for (let i = 0; i < this.image_url_partner.length; i++) {
        if (this.image_url_partner[i].id === event.moved.id) {
          this.image_url_partner[i] = event
        }
      }
    },
    add_partner(object) {
      this.image_url_partner.unshift(object)
    },
    edit_parter(object) {
      for (let i = 0; i < this.image_url_partner.length; i++) {
        if (this.image_url_partner[i].id === object.id) {
          this.image_url_partner[i] = object
        }
      }
    },
    delete_img_parter(value) {
      for (let i = 0; i < this.image_url_partner.length; i++) {
        if (this.image_url_partner[i].id === value) {
          this.image_url_partner.splice(i, 1)
        }
      }
    },
    move_file(event) {
      for (let i = 0; i < this.image_url.length; i++) {
        if (this.image_url[i].id === event.moved.id) {
          this.image_url[i] = event
        }
      }
    },

    add_combo(object) {
      this.image_url.unshift(object)
    },
    edit_combo(object) {
      for (let i = 0; i < this.image_url.length; i++) {
        if (this.image_url[i].id === object.id) {
          this.image_url[i] = object
        }
      }
    },
    delete_img(value) {
      for (let i = 0; i < this.image_url.length; i++) {
        if (this.image_url[i].id === value) {
          this.image_url.splice(i, 1)
        }
      }
    },
    reset_model() {
      this.video_url = null
      this.img_video = ''
      this.img_thumbnail = ''
      this.img_name = ''
      this.hidden_image_link = true
      this.image_link = ''
    },
    // file_selected_videos(file) {
    //   if (!this.$isNullOrEmpty(file)) {
    //     const formData = new FormData()
    //     formData.append('file', file)
    //     const folder = Folder.video_quan_tri_trang_chu
    //     const data = { formData, folder }
    //     this.$store.dispatch('uploadImg/uploadFile', data).then((response) => {
    //       if (!response.error) {
    //         this.file_video_url = response.data.data.image_url
    //       }
    //     })
    //   } else {
    //     this.file_video_url = this.file_url_video
    //   }

    //   // this.required_video = false
    // },

    // api xem chi tiết

    config_detail() {
      this.status_page = this.data.homeConfigCur.home_status
      this.page_title = this.data.homeConfigCur.page_tilte
      this.path = this.data.homeConfigCur.page_url
      this.slider_id = this.data.sliderCurList
      this.image_list = this.data.sliderCurList
      this.status_combo = this.data.homeConfigCur.combo_status
      this.combo_title = this.data.homeConfigCur.combo_tilte
      this.description_combo = this.data.homeConfigCur.combo_description
      this.image_url = this.data.homeComboCurList
      this.status_hotel = this.data.homeConfigCur.hotel_status
      this.hotel_title = this.data.homeConfigCur.hotel_tilte
      this.description_hotel = this.data.homeConfigCur.hotel_description
      this.choose_hotel = this.data.homeConfigCur.hotel_order
      this.status_restaurant = this.data.homeConfigCur.restaurant_status
      this.restaurant_title = this.data.homeConfigCur.restaurant_tilte
      this.description_restaurant =
        this.data.homeConfigCur.restaurant_description
      this.choose_restaurant = this.data.homeConfigCur.restaurant_order
      this.status_tour = this.data.homeConfigCur.tour_status
      this.tour_title = this.data.homeConfigCur.tour_tilte
      this.description_tour = this.data.homeConfigCur.tour_description
      this.choose_tour = this.data.homeConfigCur.tour_order
      this.status_videos = this.data.homeConfigCur.video_status
      this.video_title = this.data.homeConfigCur.video_tilte
      this.description_video = this.data.homeConfigCur.video_description
      this.img_video = this.data.homeConfigCur.video_url
      this.video_url = this.data.homeConfigCur.video_url
      this.image_link = this.data.homeConfigCur.video_thumbnail
      // this.img_thumbnail =
      //   this.select_choose === 1
      //     ? null
      //     : this.data.homeConfigCur.video_thumbnail

      this.img_thumbnail = this.data.homeConfigCur.video_thumbnail
      this.img_name =
        this.select_choose === 0 ? this.data.homeConfigCur.video_name : null
      this.select_choose = this.data.homeConfigCur.video_url_type
      this.status_partner = this.data.homeConfigCur.partner_status
      this.partner_title = this.data.homeConfigCur.partner_tilte
      this.description_partner = this.data.homeConfigCur.partner_description
      this.image_url_partner = this.data.partnerCurList
    },
    // api thêm mới trang
    config_insert() {
      const listComboId = []
      for (let i = 0; i < this.image_url.length; i++) {
        listComboId.push(this.image_url[i].id)
        // if (listComboId.length <= 6) {
        this.is_list_combo_id = listComboId.join()
        // }
      }

      const listPartnerId = []
      for (let i = 0; i < this.image_url_partner.length; i++) {
        listPartnerId.push(this.image_url_partner[i].id)
        // if (listPartnerId.length <= 6) {
        this.is_list_partner_id = listPartnerId.join()
        // }
      }

      const listSliderId = []
      for (let i = 0; i < this.slider_id.length; i++) {
        listSliderId.push(this.slider_id[i].id)
        // if (listSliderId.length <= 6) {
        this.is_list_slider_id = listSliderId.join()
        // }
      }

      this.$store
        .dispatch('quan_tri_trang_chu/config_insert', {
          homeId: this.data.homeConfigCur.home_id,
          home_status: this.status_page,
          pageTitle: this.page_title,
          pageUrl: this.path,
          comboTitle: this.combo_title,
          comboDesc: this.description_combo,
          comboStatus: this.status_combo,
          hotelTitle: this.hotel_title,
          hotelDesc: this.description_hotel,
          hotelOrder: this.choose_hotel,
          hotelStatus: this.status_hotel,
          restaurantTitle: this.restaurant_title,
          restaurantDesc: this.description_restaurant,
          restaurantOrder: this.choose_restaurant,
          restaurantStatus: this.status_restaurant,
          tourTitle: this.tour_title,
          tourDesc: this.description_tour,
          tourOrder: this.choose_tour,
          tourStatus: this.status_tour,
          videoTitle: this.video_title,
          videoDesc: this.description_video,
          videoStatus: this.status_videos,
          videoUrlType: this.select_choose,
          videoUrl: this.select_choose === 0 ? this.video_url : this.img_video,
          video_thumbnail:
            this.select_choose === 1 ? this.img_thumbnail : this.image_link,
          video_name: this.select_choose === 1 ? this.img_name : null,
          partnerTitle: this.partner_title,
          partnerDesc: this.description_partner,
          partnerStatus: this.status_partner,
          listCombo: this.is_list_combo_id,
          listPartner: this.is_list_partner_id,
          listSlider: this.is_list_slider_id,
          linkThumbnail: this.select_choose === 0 ? this.image_link : null,
        })
        .then((response) => {
          if (!response.error) {
            this.$showSuccess(this, 'Cập nhật trang thành công')
            this.$emit('toggle')
            this.$emit('success')
          }
        })
        .finally(() => {})
    },

    open_edit_combo_tour(item) {
      this.open_add = 4
      this.dataItem = item
    },
    open_edit_parter(item) {
      this.open_add = 5
      this.data_item_parter = item
    },
    // data_item_parter
    open_combo_tour(value) {
      this.open_add = 2
    },
    open_partner() {
      this.open_add = 3
    },
    set_again() {
      this.image_url_partner = []
      this.description_partner = null
      this.partner_title = null
      this.status_partner = 1
      this.video_url = null
      this.select_choose = 0
      this.description_video = null
      this.video_title = null
      this.status_videos = 1
      this.choose_tour = 1
      this.description_tour = null
      this.tour_title = null
      this.status_tour = 1
      this.choose_restaurant = 1
      this.description_restaurant = null
      this.restaurant_title = null
      this.status_restaurant = 1
      this.choose_hotel = 1
      this.description_hotel = null
      this.hotel_title = null
      this.status_hotel = 1
      this.status_combo = 1
      this.description_combo = null
      this.combo_title = null
      this.path = null
      this.status_page = 1
      this.image_url_partner = []
      this.image_url = []
      this.reset_file = null
      this.file_img = ''
      this.page_title = null
      this.required_img = false
      this.slider_id = []
      this.image_link = ''
      this.hidden_image_link = true
    },
    cancel() {
      this.$emit('toggle')
      // this.set_again()
    },
    validate_all() {
      let hasErrors = false
      let count = 0
      if ((this.page_title || []).length === 0) {
        hasErrors = true
        this.page_title_errors = ['Không được để trống']
        count += 1
      } else if (this.page_title.length > 200) {
        hasErrors = true
        this.page_title_errors = ['Nhập không quá 200 kí tự cho phép']
        count += 1
      } // oke
      if ((this.image_list || []).length === 0) {
        hasErrors = true
        this.error_slider = 'Không được để trống'
        count += 1
      }
      if (this.$isNullOrEmpty(this.combo_title)) {
        hasErrors = true
        this.combo_title_errors = ['Không được để trống']
        count += 1
      } else if ((this.combo_title || []).length > 200) {
        hasErrors = true
        this.combo_title_errors = ['Nhập không quá 200 kí tự cho phép']

        count += 1
      } // oke
      if ((this.image_url || []).length === 0) {
        hasErrors = true
        this.error_msg = 'Không được để trống'
        count += 1
      }

      if (this.$isNullOrEmpty(this.hotel_title)) {
        hasErrors = true
        this.hotel_title_errors = ['Không được để trống']
        count += 1
      } else if ((this.hotel_title || []).length > 200) {
        hasErrors = true
        this.hotel_title_errors = ['Nhập không quá 200 kí tự cho phép']
        count += 1
      } // oke
      if (this.$isNullOrEmpty(this.restaurant_title)) {
        hasErrors = true
        this.restaurant_title_errors = ['Không được để trống']
        count += 1
      } else if ((this.restaurant_title || []).length > 200) {
        hasErrors = true
        this.restaurant_title_errors = ['Nhập không quá 200 kí tự cho phép']
        count += 1
      } // oke
      if (this.$isNullOrEmpty(this.tour_title)) {
        hasErrors = true
        this.tour_title_errors = ['Không được để trống']
        count += 1
      } else if ((this.tour_title || []).length > 200) {
        hasErrors = true
        this.tour_title_errors = ['Nhập không quá 200 kí tự cho phép']
        count += 1
      } // oke
      if (this.$isNullOrEmpty(this.video_title)) {
        hasErrors = true
        this.video_title_errors = ['Không được để trống']
        count += 1
      } else if ((this.video_title || []).length > 200) {
        hasErrors = true
        this.video_title_errors = ['Nhập không quá 200 kí tự cho phép']
        count += 1
      } // oke
      if (this.$isNullOrEmpty(this.select_choose)) {
        hasErrors = true
        this.select_choose_errors = ['Bạn chưa chọn loại upload']
        count += 1
      } // oke

      if (this.select_choose === 0) {
        if (!this.$isNullOrEmpty(this.video_url)) {
          if (
            this.$isHasVietnamese(this.video_url) ||
            /\s/g.test(this.video_url)
          ) {
            hasErrors = true
            this.video_url_error = ['Không đúng định dạng link website']
            count += 1
          }
        }
        // if (this.$isHasVietnamese(this.video_url)) {
        //   hasErrors = true
        //   this.video_url_error = ['Không đúng định dạng link website']
        // }
      }
      if (this.select_choose === 1) {
        if (this.$isNullOrEmpty(this.img_video)) {
          hasErrors = true
          this.limited_msg = 'Không được để trống'
          count += 1
        }
      } // oke

      if (this.$isNullOrEmpty(this.partner_title)) {
        hasErrors = true
        this.partner_title_errors = ['Không được để trống']
        count += 1
      } // oke
      if ((this.image_url_partner || []).length === 0) {
        hasErrors = true
        this.error_msg_parter = 'Không được để trống'
        count += 1
      }
      if (!this.$isNullOrEmpty(this.path)) {
        if (this.$isHasVietnamese(this.path) || /\s/g.test(this.path)) {
          hasErrors = true
          this.path_errors = ['Không đúng định dạng link website']
          count += 1
        }
      }
      if (count > 0) {
        this.$showWarnNotify(this, 'Bạn nhập thiếu thông tin bắt buộc')
      }
      if (!hasErrors) {
        this.config_insert()
      }
    },

    // zoom() {
    //   const video = document.getElementById('xxx')

    //   video.style.width = 1000 + 'px'
    //   video.style.height = 1000 + 'px'
    //   video.style.zIndex = 999
    //   video.style.position = 'absolute'
    //   video.style.opacity = 0.1
    // },
  },
}
</script>
<style lang="scss">
.main-tour {
  .style-image {
    opacity: 0.3;
    filter: alpha(opacity=50);
  }
  .v-input__prepend-inner {
    padding-right: 0 !important;
  }
  .actions-coordinates-1 {
    position: fixed;
    z-index: 3;
    right: 0;
    top: 75px;
    background-color: #f5f7fe;
  }
  .actions-coordinates-2 {
    position: fixed;
    padding-bottom: 20px;
    z-index: 3;
    right: 0;
    bottom: 0;
    background-color: #f5f7fe;
  }
  .style-css-domain-input {
    .v-text-field__slot {
      margin-left: 45px;
    }
  }
  .v-input {
    .v-input__control {
      .v-input__slot {
        .v-select__selections {
          font-size: 14px;
        }
        .v-text-field__slot {
          .v-text-field__prefix {
            width: 125px;
            background-color: #c4c4c4;
            position: initial;
            padding-top: 8px;
            border-top-left-radius: 4px;
            padding-left: 8px;
            height: 38px !important;
            max-height: 100%;
            color: #000;
            margin-left: -11px;
            margin-right: 5px;
            border-bottom-left-radius: 4px;
          }
        }
      }
    }
  }
  ::-webkit-scrollbar {
    width: 6px !important;
    height: 6px !important;
  }
  ::-webkit-scrollbar-thumb {
    background: #c4c4c4 !important;
    border-radius: 10px !important;
  }
  .v-card--reveal {
    align-items: center;
    bottom: 0;
    justify-content: center;
    opacity: 0.5;
    position: absolute;
    width: 100%;
    z-index: 1;
  }
}
</style>
