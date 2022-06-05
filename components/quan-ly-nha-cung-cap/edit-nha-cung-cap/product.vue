<template>
  <div>
    <div v-show="add_product === 1" class="product-admin">
      <v-row class="pt-16 pr-3" style="background-color: #f4f7fe">
        <v-col cols="12" class="py-0">
          <v-menu :close-on-content-click="false" offset-y max-height="400">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                class="mr-2 text-none"
                style="border-radius: 4px"
                color="#656565"
                dark
                depressed
                height="40"
                v-bind="attrs"
                v-on="on"
              >
                <v-icon>mdi-pencil-box-outline</v-icon>Trường thông tin
              </v-btn>
            </template>
            <v-list
              v-for="(header, i) in headerscustom"
              :key="`${i}-${header.text}`"
              class="pa-0"
              style="border-top: 1px solid #f0f0f0 !important"
              dense
              subheader
            >
              <v-list-item v-if="i !== 0 && i !== headerscustom.length - 1">
                <v-checkbox
                  v-model="header.checked"
                  class="ma-0"
                  hide-details
                  :true-value="1"
                  :false-value="0"
                  :ripple="false"
                  @change="set_headers($event, header)"
                >
                </v-checkbox>
                <v-list-item-title class="mt-1">
                  {{ header.text }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-col>
        <v-col>
          <v-text-field
            v-model="sku"
            placeholder="Tìm kiếm: Tên sản phẩm, danh mục sản phẩm"
            prepend-inner-icon="mdi-magnify"
            class="border-1 fs-14"
            height="40"
            solo
            flat
            dense
            hide-details
            @keydown.enter="searchProduct"
          >
          </v-text-field>
        </v-col>
        <div class="mt-3">
          <v-btn
            class="mr-2 text-none white--text"
            height="40"
            depressed
            color="#656565"
            @click="open_search = true"
          >
            Tìm kiếm nâng cao
          </v-btn>
          <v-btn
            color="#3F69B8"
            class="mr-2 text-none white--text"
            height="40"
            depressed
            :loading="loading"
            :disabled="loading"
            @click="export_file"
          >
            <img class="pr-1" src="~/assets/icon/excel.svg" />
            Xuất excel
            <template v-slot:loader>
              <span>Xin chờ...</span>
            </template>
          </v-btn>
          <v-btn
            color="#47BBFF"
            class="text-none white--text"
            height="40"
            depressed
            @click="add"
          >
            <v-icon>mdi-plus</v-icon>
            Thêm mới
          </v-btn>
        </div>
      </v-row>
      <v-data-table
        :headers="headers"
        :items="items"
        :items-per-page="pageSize"
        :header-props="{ sortIcon: 'mdi-menu-swap' }"
        item-key="stt"
        show-select
        fixed-header
        hide-default-footer
        loading-text="Xin chờ..."
        no-results-text="Không có kết quả phù hợp"
        no-data-text="Không có dữ liệu"
        class="elevation-0"
        @update:options="onSortedChange($event)"
      >
        <template #top>
          <div class="d-flex align-center pt-3 pl-6">
            <v-btn
              class="fs-14 text-none"
              color="white"
              depressed
              :disabled="disabled"
              @click="quest_deletes"
            >
              <icon-close :disabled="disabled" class="mr-2"></icon-close>
              <div :style="`${disabled ? 'color: #CFD8DC' : 'color: black'}`">
                Xóa
              </div>
            </v-btn>
            <v-divider
              style="max-height: 16px"
              class="mx-2 mt-3"
              inset
              vertical
            ></v-divider>
            <v-btn
              class="fs-14 text-none"
              color="white"
              depressed
              :disabled="disabled"
              @click="quest_changestatus"
            >
              <icon-edit
                :disabled="disabled"
                class="mr-2"
                height="15"
                width="15"
              />
              <div :style="`${disabled ? 'color: #CFD8DC' : 'color: black'}`">
                Cập nhật trạng thái
              </div>
            </v-btn>
            <v-divider
              style="max-height: 16px"
              class="mx-2 mt-3"
              inset
              vertical
            />
            <v-btn
              class="fs-14 text-none"
              color="white"
              depressed
              :disabled="disabled"
              @click="reset_form"
            >
              <icon-excap :disabled="disabled" class="mr-2" />
              <div :style="`${disabled ? 'color: #CFD8DC' : 'color: black'}`">
                Quay lại
              </div>
            </v-btn>
          </div>
        </template>

        <template v-slot:[`header.data-table-select`]>
          <div class="w-100 d-flex justify-center">
            <v-checkbox
              v-model="tick_all"
              class="ma-0"
              hide-details
              :disabled="(items || []).length === 0"
              :ripple="false"
              @change="selectall"
            >
            </v-checkbox>
          </div>
        </template>

        <template v-slot:[`item.data-table-select`]="{ item }">
          <div class="w-100 d-flex justify-center">
            <v-checkbox
              v-model="item.checked"
              class="ma-0"
              hide-details
              :true-value="1"
              :false-value="0"
              :ripple="false"
              @change="set_value($event, item)"
            >
            </v-checkbox>
          </div>
        </template>

        <template v-slot:[`item.sku`]="{ item }">
          <v-chip outlined small>
            {{ item.sku }}
          </v-chip>
        </template>

        <template v-slot:[`item.img`]="{ item }">
          <div class="d-flex align-center">
            <v-lazy>
              <v-img
                class="ml-2"
                :src="item.product_thumbnail_url"
                max-width="42"
                max-height="42"
              ></v-img>
            </v-lazy>
          </div>
        </template>

        <template v-slot:[`item.status`]="{ item }">
          <v-select
            v-model="item.status"
            :items="set_list_status(item.product_type)"
            item-color="white"
            style="width: 180px !important"
            class="border-2 fs-14"
            solo
            flat
            dense
            hide-details
            @click="set_status(item.status)"
            @change="confirm_change_status(item)"
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
        </template>

        <template v-slot:[`item.price`]="{ item }">
          <div
            v-if="item.product_type !== $store.state.app.products"
            style="white-space: nowrap"
          >
            {{
              (item.from_price || []).length !== 0 &&
              (item.to_price || []).length !== 0
                ? `${$formatMoney({
                    amount: item.from_price,
                  })} - ${$formatMoney({
                    amount: item.to_price,
                  })}`
                : ''
            }}
          </div>
          <div v-else>
            {{
              (item.from_price || []).length !== 0
                ? `${$formatMoney({ amount: item.from_price })}`
                : ''
            }}
          </div>
        </template>

        <template v-slot:[`item.rate_score`]="{ item }">
          <div class="d-flex">
            {{
              item.rate_score !== 0 ? parseFloat(item.rate_score).toFixed(2) : 0
            }}
            <img class="mb-1 ml-1" src="~/assets/icon/star.svg" />
          </div>
        </template>

        <template v-slot:[`item.supplier`]="{ item }">
          <div class="d-flex align-center">
            <v-avatar class="mr-2" size="24">
              <v-img :src="item.enterprise_image"></v-img>
            </v-avatar>
            {{ item.enterprise_name }}
          </div>
        </template>

        <template v-slot:[`item.url_seo`]="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <div
                class="d-inline-block text-truncate text-decoration-underline blue--text cp"
                style="max-width: 150px"
                v-bind="attrs"
                v-on="on"
                @click="openNewTab(item.url_seo)"
              >
                {{ item.url_seo }}
              </div>
            </template>
            <span>{{ item.url_seo }}</span>
          </v-tooltip>
        </template>

        <template v-slot:[`item.enable_status`]="{ item }">
          <v-chip
            :color="item.enable_status === 1 ? '#47BBFF' : '#FF0F59'"
            small
            label
            outlined
          >
            {{ item.enable_status === 1 ? 'Hiển thị' : 'Ẩn' }}
          </v-chip>
        </template>

        <template v-slot:[`item.sub_title`]="{ item }">
          <v-tooltip
            v-if="(item.sub_title || '').length !== 0"
            max-width="300px"
            bottom
          >
            <template v-slot:activator="{ on, attrs }">
              <div
                class="d-inline-block text-truncate"
                style="max-width: 140px"
                v-bind="attrs"
                v-on="on"
              >
                {{ get_content(item) }}
              </div>
            </template>
            <span v-html="item.sub_title"></span>
          </v-tooltip>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <div class="d-flex">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  v-bind="attrs"
                  v-on="on"
                  @click="quest_delete(item)"
                >
                  <icon-delete></icon-delete>
                </v-btn>
              </template>
              <span>Xóa</span>
            </v-tooltip>

            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on" @click="quest_copy(item)">
                  <icon-copy></icon-copy>
                </v-btn>
              </template>
              <span>Copy</span>
            </v-tooltip>

            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on" @click="edit(item)">
                  <icon-edit></icon-edit>
                </v-btn>
              </template>
              <span>Cập nhật</span>
            </v-tooltip>
          </div>
        </template>
      </v-data-table>
      <pagination
        :page-info="pageInfo"
        :page="page"
        :page-size="pageSize"
        :page-count="pageCount"
        @changePage="changePage"
        @changePageSize="changePageSize"
      >
      </pagination>

      <!-- xóa 1 -->
      <yes-no-alert
        :open="open_delete"
        :alert-msg="alertdelete"
        @toggle="open_delete = !open_delete"
        @OK="confirm_delete"
      >
      </yes-no-alert>

      <!-- xóa nhiều -->
      <yes-no-alert
        :open="open_deletes"
        :alert-msg="alertdelete"
        @toggle="open_deletes = !open_deletes"
        @OK="confirm_deletes"
      >
      </yes-no-alert>

      <copy
        :open="open_copy"
        @toggle="open_copy = !open_copy"
        @OK="copy_product"
      />

      <change-status
        :open="open_change"
        @toggle="open_change = !open_change"
        @OK="changes_status"
      />

      <Dialog
        :open="open_search"
        :is-reset="true"
        dialog-name="Tìm kiếm nâng cao"
        max_width="800"
        @reset="reset_filter"
        @toggle="open_search = !open_search"
        @actionsUser="searchProduct"
      >
        <v-row>
          <v-col cols="6">
            <p class="ma-0">SKU</p>
            <v-text-field
              v-model="search.sku"
              placeholder="Nhập SKU"
              class="border-1 fs-14"
              solo
              flat
              dense
              hide-details
              clearable
            >
            </v-text-field>
          </v-col>
          <v-col cols="6">
            <p class="ma-0">Tên sản phẩm</p>
            <v-text-field
              v-model="search.name"
              placeholder="Nhập tên sản phẩm"
              class="border-1 fs-14"
              solo
              flat
              dense
              hide-details
              clearable
            >
            </v-text-field>
          </v-col>
          <v-col cols="6">
            <p class="ma-0">Trạng thái</p>
            <v-select
              v-model="search.status"
              :items="list_status"
              placeholder="Chọn trạng thái"
              item-color="white"
              class="border-1 fs-14"
              solo
              flat
              dense
              clearable
            >
              <template v-slot:selection="data_status">
                <div class="fs-14" :style="`color: ${data_status.item.color}`">
                  {{ data_status.item.text }}
                </div>
              </template>
              <template v-slot:item="data_status">
                <div
                  :style="`color: ${data_status.item.color} !important`"
                  class="fs-14"
                >
                  {{ data_status.item.text }}
                </div>
              </template>
            </v-select>
          </v-col>
          <v-col cols="6">
            <p class="ma-0">Mức giá</p>
            <v-text-field
              v-model="search.price"
              :error-messages="search.price_msg"
              placeholder="Nhập mức giá"
              class="border-1 fs-14"
              solo
              flat
              dense
              clearable
              @input="validate_number"
            >
            </v-text-field>
          </v-col>
          <v-col cols="6" class="pt-0">
            <p class="ma-0">Danh mục sản phẩm</p>
            <v-autocomplete
              v-model="search.category"
              :items="list_category"
              item-value="id"
              item-text="name"
              placeholder="Chọn danh mục sản phẩm"
              class="border-1 fs-14"
              solo
              flat
              dense
              multiple
              hide-details
              clearable
            >
            </v-autocomplete>
          </v-col>
          <v-col cols="6" class="pt-0">
            <p class="ma-0">Loại sản phẩm</p>
            <v-autocomplete
              v-model="search.type"
              :items="list_type"
              item-value="id"
              item-text="name"
              placeholder="Chọn loại sản phẩm"
              class="border-1 fs-14"
              solo
              flat
              dense
              hide-details
              clearable
              @change="set_type_detail(search.type)"
            >
            </v-autocomplete>
          </v-col>
          <v-col cols="6">
            <p class="ma-0">Loại hình của sản phẩm</p>
            <v-autocomplete
              v-model="search.type_detail"
              :items="list_type_detail"
              item-value="id"
              item-text="name"
              placeholder="Chọn loại hình của sản phẩm"
              class="border-1 fs-14"
              solo
              flat
              dense
              hide-details
              clearable
            >
            </v-autocomplete>
          </v-col>
          <v-col cols="6">
            <p class="ma-0">Trạng thái ẩn/hiện</p>
            <v-autocomplete
              v-model="search.display"
              :items="list_display"
              placeholder="Chọn trạng thái ẩn/hiện"
              class="border-1 fs-14"
              solo
              flat
              dense
              hide-details
              clearable
            >
            </v-autocomplete>
          </v-col>
          <v-col cols="6">
            <p class="ma-0">Loại món ăn</p>
            <v-autocomplete
              v-model="search.dish_type"
              :items="list_dish_type"
              item-value="id"
              item-text="name"
              placeholder="Chọn loại món ăn"
              class="border-1 fs-14"
              solo
              flat
              dense
              hide-details
              clearable
            >
            </v-autocomplete>
          </v-col>
          <v-col cols="6">
            <p class="ma-0">Loại tour</p>
            <v-autocomplete
              v-model="search.tour_time"
              :items="list_tour_time"
              placeholder="Chọn loại tour"
              class="border-1 fs-14"
              solo
              flat
              dense
              hide-details
              clearable
            >
            </v-autocomplete>
          </v-col>
          <v-col cols="6">
            <p class="ma-0">Lịch khởi hành</p>
            <v-menu
              v-model="menu"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  :value="
                    !$isNullOrEmpty(search.departure_schedule)
                      ? moment(search.departure_schedule).format('DD/MM/YYYY')
                      : ''
                  "
                  label="Chọn lịch khởi hành"
                  hide-details
                  class="border-1 fs-14"
                  solo
                  dense
                  flat
                  readonly
                  clearable
                  v-on="on"
                />
              </template>
              <v-date-picker
                v-model="search.departure_schedule"
                @input="menu = false"
              />
            </v-menu>
          </v-col>
        </v-row>
      </Dialog>

      <yes-no-alert
        :open="open_status"
        alert-msg="Bạn có muốn thay đổi trạng thái không?"
        @toggle="toggle_change_status"
        @OK="change_status"
      >
      </yes-no-alert>
    </div>

    <Add
      v-if="add_product === 2"
      :data="data"
      :open="open_add"
      @toggle="add_product = 1"
      @success="get_product"
      @backproduct="$emit('backproduct')"
    />

    <edit-hotel
      v-if="add_product === 3"
      :data="detail"
      @toggle="add_product = 1"
      @success="get_product"
      @set_title="
        $store.commit(
          'app/setTitle',
          `Sản phẩm admin tạo - ${data.producer_name}`
        )
      "
      @backproduct="$emit('backproduct')"
    />

    <edit-restaurant
      v-if="add_product === 4"
      :data="detail"
      @toggle="add_product = 1"
      @success="get_product"
      @set_title="
        $store.commit(
          'app/setTitle',
          `Sản phẩm admin tạo - ${data.producer_name}`
        )
      "
      @backproduct="$emit('backproduct')"
    />

    <edit-tour
      v-if="add_product === 5"
      :data="detail"
      @toggle="add_product = 1"
      @success="get_product"
      @set_title="
        $store.commit(
          'app/setTitle',
          `Sản phẩm admin tạo - ${data.producer_name}`
        )
      "
      @backproduct="$emit('backproduct')"
    />

    <edit-tourism
      v-if="add_product === 6"
      :data="detail"
      :prod-attr-set="detail.attributeSetId"
      @toggle="add_product = 1"
      @success="get_product"
      @set_title="
        $store.commit(
          'app/setTitle',
          `Sản phẩm admin tạo - ${data.producer_name}`
        )
      "
      @backproduct="$emit('backproduct')"
    />
    <yes-no-alert
      :open="open_confirm_product"
      alert-msg="Bạn chắc chắn muốn thoát không?"
      @toggle="open_confirm_product = !open_confirm_product"
      @OK="backProduct"
    />
  </div>
</template>

<script>
import moment from 'moment'
import EditHotel from '~/components/product-nha-cung-cap/edit/hotel/index'
import EditRestaurant from '~/components/product-nha-cung-cap/edit/restaurant/index'
import EditTour from '~/components/product-nha-cung-cap/edit/tour/index'
import EditTourism from '~/components/product-nha-cung-cap/edit/tourism-product/UpdateTourismProduct'
import Add from '~/components/product-nha-cung-cap/add'
import Copy from '~/components/product-nha-cung-cap/copy'
import ChangeStatus from '~/components/product-nha-cung-cap/changestatusAdmin'
import Dialog from '~/components/Dialog'

export default {
  components: {
    Add,
    EditHotel,
    EditRestaurant,
    EditTour,
    EditTourism,
    Copy,
    ChangeStatus,
    Dialog,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
    tab: {
      type: Number,
      required: true,
    },
  },
  data: () => ({
    price_msg: [],
    open_confirm_product: false,
    open_add: false,
    add_product: 1,
    open_copy: false,
    items: [],
    headerscustom: [
      { checked: 1, text: 'SKU', value: 'sku', width: 80 },
      {
        checked: 1,
        text: 'Ảnh sản phẩm',
        sortable: false,
        value: 'img',
        width: 120,
      },
      {
        checked: 1,
        text: 'Tên sản phẩm',
        sortable: false,
        value: 'product_name',
        width: 250,
      },
      {
        checked: 1,
        text: 'Trạng thái',
        sortable: false,
        value: 'status',
        width: 180,
      },
      {
        checked: 1,
        text: 'Mức giá VND',
        sortable: false,
        value: 'price',
        width: 200,
      },
      {
        checked: 1,
        text: 'Danh mục sản phẩm',
        sortable: false,
        value: 'product_category_name',
        width: 200,
      },
      {
        checked: 1,
        text: 'Đánh giá',
        value: 'rate_score',
        width: 130,
      },
      {
        checked: 1,
        text: 'Nhà cung cấp',
        sortable: false,
        value: 'supplier',
        width: 200,
      },
      {
        checked: 0,
        text: 'Mô tả ngắn',
        sortable: false,
        value: 'sub_title',
        width: 150,
      },
      {
        checked: 0,
        text: 'Số điện thoại',
        sortable: false,
        value: 'phone',
        width: 150,
      },
      {
        checked: 0,
        text: 'Email',
        sortable: false,
        value: 'email',
        width: 150,
      },
      {
        checked: 0,
        text: 'URL thân thiện cho SEO',
        sortable: false,
        value: 'url_seo',
        width: 200,
      },
      {
        checked: 0,
        text: 'Loại sản phẩm',
        sortable: false,
        value: 'product_type_name',
        width: 150,
      },
      {
        checked: 0,
        text: 'Loại hình sản phẩm',
        sortable: false,
        value: 'type_of_product',
        width: 150,
      },
      {
        checked: 0,
        text: 'Trạng thái ẩn/hiện',
        sortable: false,
        value: 'enable_status',
        width: 150,
      },
      {
        checked: 0,
        text: 'Loại món ăn',
        sortable: false,
        value: 'type_of_dish',
        width: 150,
      },
      {
        checked: 0,
        text: 'Loại Tour',
        sortable: false,
        value: 'type_of_tour',
        width: 150,
      },
      {
        checked: 0,
        text: 'Hành trình',
        sortable: false,
        value: 'journeys',
        width: 150,
      },
      {
        checked: 0,
        text: 'Lịch trình',
        sortable: false,
        value: 'departure',
        width: 150,
      },
      {
        checked: 0,
        text: 'Khu vực',
        sortable: false,
        value: 'area',
        width: 150,
      },
      {
        checked: 1,
        text: 'Hành động',
        sortable: false,
        value: 'actions',
        width: 130,
      },
    ],
    headers: [],
    sku: null,
    data_selected: [],
    tick_all: false,
    disabled: true,
    // auto: 0,
    setup: false,
    page: 1,
    pageCount: 1,
    pageSize: 50,
    pageInfo: {},
    list_status: [
      { value: 1, color: '#47BBFF', text: 'Đang hoạt động' },
      { value: 2, color: '#FF0F59', text: 'Dừng hoạt động' },
    ],
    data_row: {},
    alertdelete: '',
    open_delete: false,
    alertdeletes: '',
    open_deletes: false,
    open_change: false,
    open_status: false,
    status: 0,
    status_new: 0,
    open_search: false,
    search: {
      sku: null,
      name: null,
      status: null,
      price: null,
      category: null,
      type: null,
      type_detail: null,
      display: null,
      dish_type: null,
      tour_time: null,
      departure_schedule: null,
    },
    list_category: [],
    status_data: {},
    order_by: null,
    loading: false,
    list_type: [],
    list_type_detail: [],
    list_display: [],
    list_dish_type: [],
    list_tour_time: [],
    menu: false,
  }),
  watch: {
    tab(value) {
      if (value === 1) {
        if (!this.$isServer) {
          this.add_product = 1
          this.get_list()
          this.set_category()
          this.set_type_product()
          this.set_restaurant_dish_type()
          this.list_display = [
            { value: 0, text: 'Ẩn' },
            { value: 1, text: 'Hiển thị' },
          ]
          this.list_tour_time = [
            // { value: '', text: 'Tất cả' },
            { value: 1, text: 'Trong ngày' },
            { value: 2, text: '2 ngày 1 đêm' },
            { value: 3, text: 'Khác' },
          ]
          this.search.tour_time = ''
          const arr = []
          for (let i = 0; i < this.headerscustom.length; i++) {
            if (this.headerscustom[i].checked === 1) {
              arr.push({ ...this.headerscustom[i] })
            }
          }
          this.headers = [...arr]
        }
      }
    },
    '$store.state.app.change_back'(value) {
      if (this.$store.state.app.pageTitle === 'Thêm mới sản phẩm') {
        this.add_product = 1
        this.$store.commit(
          'app/setTitle',
          `Sản phẩm admin tạo - ${this.data.producer_name}`
        )
      }
      if (
        this.$store.state.app.pageTitle.includes('Cập nhật sản phẩm admin tạo')
      ) {
        this.open_confirm_product = true
      }
    },
  },
  created() {
    if (!this.$isServer) {
      this.add_product = 1
      this.set_category()
      this.set_type_product()
      this.set_restaurant_dish_type()
      this.list_display = [
        { value: 0, text: 'Ẩn' },
        { value: 1, text: 'Hiển thị' },
      ]
      this.list_tour_time = [
        // { value: '', text: 'Tất cả' },
        { value: 1, text: 'Trong ngày' },
        { value: 2, text: '2 ngày 1 đêm' },
        { value: 3, text: 'Khác' },
      ]
      this.search.tour_time = ''
      const arr = []

      for (let i = 0; i < this.headerscustom.length; i++) {
        if (this.headerscustom[i].checked === 1) {
          arr.push({ ...this.headerscustom[i] })
        }
      }
      this.headers = [...arr]
    }
  },

  methods: {
    reset_filter() {
      this.search = {
        sku: null,
        name: null,
        status: null,
        price: null,
        price_msg: [],
        category: null,
        // enterprise: null,
        type: null,
        type_detail: null,
        display: null,
        dish_type: null,
        tour_time: null,
        departure_schedule: null,
      }
    },
    validate_number() {
      const number = /^[1-9]\d*(\.\d+)?$/
      const price = String(this.search.price)
      price.trim()

      if (!this.$isNullOrEmpty(this.search.price) && !number.test(price)) {
        this.search.price_msg = 'Định dạng giá tiền không hợp lệ'
      } else {
        this.search.price_msg = []
      }
    },
    searchProduct() {
      let hasErrors = false
      const number = /^[1-9]\d*(\.\d+)?$/
      const price = String(this.search.price)
      price.trim()

      if (!this.$isNullOrEmpty(this.search.price) && !number.test(price)) {
        hasErrors = true
        this.$showWarnNotify(this, 'Định dạng giá tiền không hợp lệ')
      }

      if (!hasErrors) {
        this.page = 1
        this.get_list()
        this.open_search = false
      }
    },
    set_type_product() {
      this.$store.dispatch('nha_cung_cap_san_pham/product_type').then((res) => {
        if (!res.error) {
          this.list_type = res.data.data
        }
      })
    },
    set_type_detail(id) {
      if (!this.$isNullOrEmpty(id)) {
        this.list_type_detail = []
        if (id === 1) {
          this.$store
            .dispatch('nha_cung_cap_san_pham/hotel_type')
            .then((res) => {
              if (!res.error) {
                this.list_type_detail = res.data.data
              }
            })
        } else if (id === 2) {
          this.$store
            .dispatch('nha_cung_cap_san_pham/restaurant_type')
            .then((res) => {
              if (!res.error) {
                this.list_type_detail = res.data.data
              }
            })
        } else if (id === 3) {
          this.$store
            .dispatch('nha_cung_cap_san_pham/tour_type')
            .then((res) => {
              if (!res.error) {
                this.list_type_detail = res.data.data
              }
            })
        }
      } else {
        this.search.type_detail = null
        this.list_type_detail = []
      }
    },
    set_restaurant_dish_type() {
      this.$store
        .dispatch('nha_cung_cap_san_pham/restaurant_dish_type')
        .then((res) => {
          if (!res.error) {
            this.list_dish_type = res.data.data
          }
        })
    },
    get_product() {
      this.get_list()
      this.$store.commit(
        'app/setTitle',
        `Sản phẩm admin tạo - ${this.data.producer_name}`
      )
    },
    backProduct() {
      this.$store.commit(
        'app/setTitle',
        `Sản phẩm admin tạo - ${this.data.producer_name}`
      )
      this.add_product = 1
    },
    changePage(value) {
      this.page = value
      this.get_list()
    },
    changePageSize(pageSizes) {
      if (pageSizes !== this.itemsPerPage) {
        this.page = 1
        this.pageSize = pageSizes
        this.get_list()
      }
    },
    get_list() {
      const DATA = {
        enterprise_id: this.$store.state.nha_cung_cap.enterprise,
        page_index: this.page,
        page_size: this.pageSize,
        search: (this.sku || []).length !== 0 ? this.sku.trim() : null,
        type: this.$store.state.app.type.admin,
        sku:
          (this.search.sku || '').length !== 0 ? this.search.sku.trim() : null,
        product_name:
          (this.search.name || '').length !== 0
            ? this.search.name.trim()
            : null,
        status: !this.$isNullOrEmpty(this.search.status)
          ? this.search.status
          : null,
        price: this.search.price > 0 ? this.search.price : null,
        product_category_ids: !this.$isNullOrEmpty(this.search.category)
          ? this.search.category.join()
          : null,
        enterprise_name: !this.$isNullOrEmpty(this.search.enterprice)
          ? this.search.enterprice
          : null,
        product_type: !this.$isNullOrEmpty(this.search.type)
          ? this.search.type
          : null,
        type_of_product: !this.$isNullOrEmpty(this.search.type_detail)
          ? this.search.type_detail
          : null,
        enable_status: !this.$isNullOrEmpty(this.search.display)
          ? this.search.display
          : null,
        dish_type: !this.$isNullOrEmpty(this.search.dish_type)
          ? this.search.dish_type
          : null,
        tour_time_type: !this.$isNullOrEmpty(this.search.tour_time)
          ? this.search.tour_time
          : null,
        departure_day: !this.$isNullOrEmpty(this.search.departure_schedule)
          ? moment(this.search.departure_schedule, 'YYYY-MM-DD').format(
              'DD/MM/YYYY 00:00:00'
            )
          : null,
        order_by: this.order_by,
      }

      this.$store
        .dispatch('nha_cung_cap_san_pham/get_list', DATA)
        .then((res) => {
          this.items = []
          if (!res.error) {
            if ((res.data.data.items || []).length !== 0) {
              for (let i = 0; i < res.data.data.items.length; i++) {
                res.data.data.items[i] = {
                  ...res.data.data.items[i],
                  stt: i + 1,
                  checked: 0,
                }
                for (let j = 0; j < this.data_selected.length; j++) {
                  if (res.data.data.items[i].id === this.data_selected[j].id) {
                    res.data.data.items[i] = {
                      ...res.data.data.items[i],
                      checked: 1,
                    }
                  }
                }
              }

              let count = 0

              for (let i = 0; i < res.data.data.items.length; i++) {
                if (res.data.data.items[i].checked === 1) {
                  count += 1
                }
              }

              if (count === res.data.data.items.length) {
                this.tick_all = true
              } else {
                this.tick_all = false
              }
            }
            this.items = [...res.data.data.items]
            this.pageInfo = res.data.data.pageable
            this.pageCount = res.data.data.pageable.total_page
          }
        })
      this.open_search = false
    },
    onSortedChange(value) {
      if (value.sortBy.length > 0) {
        this.order_by =
          value.sortBy[0] + ' ' + (value.sortDesc[0] ? 'desc' : 'asc')
      } else {
        this.order_by = null
      }
      this.get_list()
    },

    set_list_status(value) {
      if (value === this.$store.state.app.product_type.hotel) {
        return [
          { value: 1, color: '#47BBFF', text: 'Đang hoạt động' },
          { value: 2, color: '#FF0F59', text: 'Dừng hoạt động' },
        ]
      } else if (value === this.$store.state.app.product_type.restaurant) {
        return [
          { value: 1, color: '#47BBFF', text: 'Đang hoạt động' },
          { value: 2, color: '#FF0F59', text: 'Dừng hoạt động' },
          { value: 3, color: '#F5972D', text: 'Hết bàn' },
        ]
      } else if (value === this.$store.state.app.product_type.tour) {
        return [
          { value: 1, color: '#47BBFF', text: 'Đang hoạt động' },
          { value: 2, color: '#FF0F59', text: 'Dừng hoạt động' },
          { value: 3, color: '#F5972D', text: 'Hết chỗ' },
        ]
      } else if (value === this.$store.state.app.product_type.products) {
        return [
          { value: 1, color: '#47BBFF', text: 'Đang hoạt động' },
          { value: 2, color: '#FF0F59', text: 'Dừng hoạt động' },
          { value: 3, color: '#F5972D', text: 'Hết hàng' },
        ]
      } else {
        return []
      }
    },
    set_category() {
      this.$store
        .dispatch('nha_cung_cap_san_pham/hotel_category')
        .then((res) => {
          if (!res.error) {
            this.list_category = res.data.data
          }
        })
    },

    reset_form() {
      if (!this.disabled) {
        this.tick_all = false
        this.disabled = true
        this.data_selected = []
        const arr = [...this.items]

        for (let i = 0; i < arr.length; i++) {
          arr[i].checked = 0
        }
        this.items = [...arr]
      }
    },
    set_selected_all(checked) {
      const arr = [...this.items]

      for (let i = 0; i < arr.length; i++) {
        arr[i] = {
          ...arr[i],
          checked,
        }

        if (checked === 0 && this.data_selected.length > 0) {
          const arr1 = [...this.data_selected]
          for (let j = 0; j < this.data_selected.length; j++) {
            if (arr[i].id === this.data_selected[j].id) {
              arr1.splice(j, 1)
            }
          }
          this.data_selected = [...arr1]
        }
      }
      this.items = [...arr]
    },
    selectall(value) {
      if (value) {
        this.set_selected_all(1)
        this.disabled = false

        const arr = [...this.items]

        for (let i = 0; i < arr.length; i++) {
          if (this.data_selected.length > 0) {
            const arr1 = [...this.data_selected]
            for (let j = 0; j < this.data_selected.length; j++) {
              if (arr[i].id === this.data_selected[j].id) {
                arr1.splice(j, 1)
              }
            }
            this.data_selected = [...arr1]
          }
        }

        const arr2 = []

        for (let i = 0; i < arr.length; i++) {
          arr2.push(arr[i])
        }
        this.data_selected = [...arr2, ...this.data_selected]
      } else {
        this.set_selected_all(0)
        this.disabled = true
      }
    },
    set_value(value, item) {
      // item.checked = value
      const arrselected = [...this.data_selected]

      if (value === 1) {
        arrselected.push(item)
      } else {
        for (let i = 0; i < arrselected.length; i++) {
          if (item.id === arrselected[i].id) {
            arrselected.splice(i, 1)
          }
        }
      }
      this.data_selected = [...arrselected]

      const arr = []

      for (let i = 0; i < this.items.length; i++) {
        if (this.items[i].checked === 1) {
          arr.push(this.items[i].checked)
        }
      }

      if (arr.length > 0 && arr.length < this.items.length) {
        this.disabled = false
      } else if (arr.length === this.items.length) {
        this.tick_all = true
        this.disabled = false
      } else if (arr.length === 0) {
        this.tick_all = false
        this.disabled = true
      }
    },
    set_headers(value, item) {
      let arr = [...this.headers]

      if (value === 1) {
        const array = []

        for (let i = 0; i < this.headerscustom.length; i++) {
          if (this.headerscustom[i].checked === 1) {
            array.push({ ...this.headerscustom[i] })
          }
        }
        arr = [...array]
      } else {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].value === item.value) {
            arr.splice(i, 1)
          }
        }
      }

      this.headers = [...arr]
    },
    set_status(status) {
      this.status = status
    },
    confirm_change_status(item) {
      this.status_data = item
      this.status_new = item.status
      this.open_status = true
    },
    toggle_change_status() {
      this.open_status = false

      const arr = [...this.items]
      for (let i = 0; i < arr.length; i++) {
        if (
          arr[i].id === this.status_data.id &&
          arr[i].product_type === this.status_data.product_type
        ) {
          arr[i].status = this.status
        }
      }
      this.items = [...arr]
    },
    change_status() {
      if (!this.$isNullOrEmpty(this.status_data)) {
        const DATA = {
          items: [
            {
              id: this.status_data.id,
              product_category_id: this.status_data.product_type,
              status: this.status_new,
            },
          ],
        }

        this.$store
          .dispatch('nha_cung_cap_san_pham/change_status', DATA)
          .then((res) => {
            if (!res.error) {
              this.$showSuccess(this, 'Thay đổi trạng thái sản phẩm thành công')

              const arr = [...this.items]
              for (let i = 0; i < arr.length; i++) {
                if (
                  arr[i].id === this.status_data.id &&
                  arr[i].product_type === this.status_data.product_type
                ) {
                  arr[i].status = this.status_new
                }
              }
              this.items = [...arr]
            }
          })
          .finally(() => {})
      }
    },
    changes_status(value) {
      const arr = []

      for (let i = 0; i < this.data_selected.length; i++) {
        arr.push({
          id: this.data_selected[i].id,
          product_category_id: this.data_selected[i].product_type,
          status: value,
        })
      }

      const DATA = { items: [...arr] }

      this.$store
        .dispatch('nha_cung_cap_san_pham/change_status', DATA)
        .then((res) => {
          if (!res.error) {
            this.$showSuccess(this, 'Thay đổi trạng thái sản phẩm thành công')
          }
        })
        .finally(() => {
          this.get_list()
          this.open_change = false
        })
    },
    quest_delete(item) {
      this.data_row = item
      this.alertdelete =
        'Bạn chắc chắn muốn xóa sản phẩm "' + item.product_name + '" này?'
      this.open_delete = true
    },
    confirm_delete() {
      this.$store
        .dispatch('nha_cung_cap_san_pham/delete_product', [
          {
            id: this.data_row.id,
            product_category_id: this.data_row.product_type,
          },
        ])
        .then((res) => {
          if (!res.error) {
            this.$showSuccess(this, 'Xóa sản phẩm thành công')
            this.get_list()
            this.disabled = true
          }
        })
    },
    quest_deletes() {
      if (!this.disabled) {
        if (this.data_selected.length === 1) {
          this.alertdelete =
            'Bạn chắc chắn muốn xóa sản phẩm "' +
            this.data_selected[0].product_name +
            '" này?'
        } else if (this.data_selected.length > 1) {
          this.alertdelete = 'Bạn chắc chắn muốn xóa những sản phẩm này?'
        }
        this.open_deletes = true
      }
    },
    confirm_deletes() {
      const DATA = []

      for (let i = 0; i < this.data_selected.length; i++) {
        DATA.push({
          id: this.data_selected[i].id,
          product_category_id: this.data_selected[i].product_type,
        })
      }

      this.$store
        .dispatch('nha_cung_cap_san_pham/delete_product', DATA)
        .then((res) => {
          if (!res.error) {
            this.$showSuccess(this, 'Xóa sản phẩm thành công')
            this.get_list()
            this.disabled = true
          }
        })
        .finally(() => {
          this.open_deletes = false
        })
    },
    quest_changestatus() {
      if (!this.disabled) {
        this.open_change = true
      }
    },
    quest_copy(item) {
      this.data_row = item
      this.open_copy = true
    },
    copy_product(name) {
      const DATA = {
        product_id: this.data_row.id,
        product_type: this.data_row.product_type,
        product_name: name,
      }
      this.$store
        .dispatch('nha_cung_cap_san_pham/copy_product', DATA)
        .then((res) => {
          if (!res.error) {
            this.$showSuccess(this, 'Nhân bản sản phẩm thành công')
            this.get_list()
          }
        })
        .finally(() => {
          this.open_copy = false
        })
    },
    export_file() {
      this.loading = true
      const DATA = {
        enterprise_id: this.$store.state.nha_cung_cap.enterprise,
        type: this.$store.state.app.type.admin, // sản phẩm do admin tạo
        search: (this.sku || []).length !== 0 ? this.sku.trim() : null,
        sku:
          (this.search.sku || '').length !== 0 ? this.search.sku.trim() : null,
        product_name:
          (this.search.name || '').length !== 0
            ? this.search.name.trim()
            : null,
        status: !this.$isNullOrEmpty(this.search.status)
          ? this.search.status
          : null,
        price: this.search.price > 0 ? this.search.price : null,
        product_category_ids: !this.$isNullOrEmpty(this.search.category)
          ? this.search.category.join()
          : null,
        enterprise_name: !this.$isNullOrEmpty(this.search.enterprice)
          ? this.search.enterprice
          : null,
        product_type: !this.$isNullOrEmpty(this.search.type)
          ? this.search.type
          : null,
        type_of_product: !this.$isNullOrEmpty(this.search.type_detail)
          ? this.search.type_detail
          : null,
        enable_status: !this.$isNullOrEmpty(this.search.display)
          ? this.search.display
          : null,
        dish_type: !this.$isNullOrEmpty(this.search.dish_type)
          ? this.search.dish_type
          : null,
        tour_time_type: !this.$isNullOrEmpty(this.search.tour_time)
          ? this.search.tour_time
          : null,
        departure_day: !this.$isNullOrEmpty(this.search.departure_schedule)
          ? moment(this.search.departure_schedule, 'YYYY-MM-DD').format(
              'DD/MM/YYYY 00:00:00'
            )
          : null,
      }
      this.$store
        .dispatch('nha_cung_cap_san_pham/export_file', DATA)
        .then((res) => {
          if (!res.error) {
            window.location.href = res.data.data
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    openNewTab(url) {
      window.open(url)
    },
    add() {
      this.$emit('click')
      this.add_product = 2
      this.open_add = true
      this.$emit('addProduct')
      this.$emit('add')
      this.$store.commit('app/setTitle', 'Thêm mới sản phẩm')
    },
    edit(item) {
      this.$emit('click')
      this.data_row = item
      if (item.product_type === 1) {
        // sửa sản phẩm khách sạn
        this.$store
          .dispatch('nha_cung_cap_san_pham/hotel_detail', item.id)
          .then((res) => {
            if (!res.error) {
              this.detail = res.data.data
              this.add_product = 3
              this.$store.commit(
                'app/setTitle',
                `Cập nhật sản phẩm admin tạo - #${item.sku}`
              )
            }
          })
      } else if (item.product_type === 2) {
        // sửa sản phẩm nhà hàng
        this.$store
          .dispatch('nha_cung_cap_san_pham/restaurant_detail', item.id)
          .then((res) => {
            if (!res.error) {
              this.detail = res.data.data
              this.add_product = 4
              this.$store.commit(
                'app/setTitle',
                `Cập nhật sản phẩm admin tạo - #${item.sku}`
              )
            }
          })
      } else if (item.product_type === 3) {
        // sửa sản phẩm tour
        this.$store
          .dispatch('nha_cung_cap_san_pham/tour_detail', item.id)
          .then((res) => {
            if (!res.error) {
              this.detail = res.data.data
              this.add_product = 5
              this.$store.commit(
                'app/setTitle',
                `Cập nhật sản phẩm admin tạo - #${item.sku}`
              )
            }
          })
      } else if (item.product_type === 4) {
        // sửa sản phẩm du lijch
        this.$store
          .dispatch('tourismProduct/getTourismProductDetails', {
            product_id: item.id,
          })
          .then((res) => {
            if (!res.error) {
              this.detail = res.data.data
              this.add_product = 6
              this.$store.commit(
                'app/setTitle',
                `Cập nhật sản phẩm admin tạo - #${item.sku}`
              )
            }
          })
      }
    },

    get_content(item) {
      return (item.sub_title || '').replace(/<[^>]*>?/gm, '')
    },
  },
}
</script>

<style lang="scss">
.product-admin {
  .v-data-table--fixed-header .v-data-table__wrapper {
    max-height: calc(100vh - 360px) !important;
  }

  .cp {
    cursor: pointer;
  }
  .theme--light.v-btn.v-btn--disabled:not(.v-btn--flat):not(.v-btn--text):not(.v-btn--outlined) {
    background-color: white !important;
    color: black !important;
  }
}
</style>
