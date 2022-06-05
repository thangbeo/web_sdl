<template>
  <div>
    <div class="d-flex pb-6">
      <div style="margin-top: 10px"></div>
    </div>
    <!-- <div style="position: fixed; right: 0; top: 90px; z-index: 5">
      <v-btn class="text-none white--text mr-4" color="#656565" depressed
        >Portal Nhà cung cấp
      </v-btn>
    </div> -->
    <client-only>
      <v-tabs
        v-model="tab"
        active-class="primary--text"
        background-color="#f4f7fe"
        style="position: fixed; z-index: 1"
      >
        <v-tab
          :class="
            (tab !== 0 && 'black--text') +
            ' text-none letter-spacing-normal fs-17 font-weight-bold'
          "
          @click="clicked_tab(0)"
        >
          Thông tin Nhà cung cấp
        </v-tab>

        <v-tab
          :class="
            (tab !== 1 && 'black--text') +
            ' text-none letter-spacing-normal fs-17 font-weight-bold'
          "
          @click="clicked_tab(1)"
        >
          Sản phẩm Admin tạo
        </v-tab>

        <v-tab
          :class="
            (tab !== 2 && 'black--text') +
            ' text-none letter-spacing-normal fs-17 font-weight-bold'
          "
          @click="clicked_tab(2)"
        >
          Sản phẩm Nhà cung cấp tạo
        </v-tab>
        <v-tab
          :class="
            (tab !== 3 && 'black--text') +
            ' text-none letter-spacing-normal fs-17 font-weight-bold'
          "
          @click="clicked_tab(3)"
        >
          Thuộc tính sản phẩm
        </v-tab>

        <v-tab
          :class="
            (tab !== 4 && 'black--text') +
            ' text-none letter-spacing-normal fs-17 font-weight-bold'
          "
          @click="clicked_tab(4)"
        >
          Bộ thuộc tính sản phẩm
        </v-tab>

        <v-tab
          :class="
            (tab !== 5 && 'black--text') +
            ' text-none letter-spacing-normal fs-17 font-weight-bold'
          "
          @click="clicked_tab(5)"
        >
          Lịch sử Giao dịch
        </v-tab>

        <v-tab
          :class="
            (tab !== 6 && 'black--text') +
            ' text-none letter-spacing-normal fs-17 font-weight-bold'
          "
          @click="clicked_tab(6)"
        >
          Đánh giá
        </v-tab>

        <!-- <v-tab
          :class="
            (tab !== 5 && 'black--text') +
            ' text-none letter-spacing-normal fs-17 font-weight-bold'
          "
          @click="clicked_tab(5)"
        >
          Danh sách đã lưu
        </v-tab> -->
      </v-tabs>

      <v-tabs-items v-model="tab" class="transparent">
        <v-tab-item>
          <information
            :data="dataThongtin"
            :get="check_get"
            @exit="$emit('exit')"
            @success="$emit('success')"
          >
          </information>
        </v-tab-item>

        <v-tab-item>
          <product
            :tab="tabProduct"
            :data="data"
            :get="check_get"
            @click="numberTitle = 1"
            @success="$emit('success')"
            @addProduct="$emit('addproduct')"
            @backproduct="$emit('backproduct')"
            @updateproduct="$emit('updateproduct', $event)"
            @exit="$emit('exit')"
          >
          </product>
        </v-tab-item>

        <v-tab-item>
          <productncc
            :tab="tabProductNcc"
            :data="data"
            :get="check_get"
            @click="numberTitle = 1"
            @success="$emit('success')"
            @addProductNcc="$emit('addproductncc')"
            @backproductncc="$emit('backproductncc')"
            @updateproductncc="$emit('updateproductncc', $event)"
            @exit="$emit('exit')"
          >
          </productncc>
        </v-tab-item>

        <v-tab-item>
          <properties v-if="tab == 3" :provider-id="data.id"> </properties>
        </v-tab-item>

        <v-tab-item>
          <productAttrSet v-if="tab == 4" :provider-id="data.id">
          </productAttrSet>
        </v-tab-item>

        <v-tab-item>
          <history
            :tab="tabNCC"
            :data="data"
            :get="check_get"
            @click="numberTitle = 1"
            @success="$emit('success')"
            @backhistory="$emit('backhistory')"
            @nameadd="$emit('addhistory')"
            @previewHistory="$emit('previewhistory', $event)"
            @exit="$emit('exit')"
          >
          </history>
        </v-tab-item>

        <v-tab-item>
          <review
            :tab="tabReview"
            :data="data"
            :get="check_get"
            @click="numberTitle = 1"
            @updatereview="$emit('updatereview')"
            @backreview="$emit('backreview')"
            @exit="$emit('exit')"
          >
          </review>
        </v-tab-item>
        <!-- 
        <v-tab-item>
          <listSave :get="check_get" @exit="$emit('exit')"> </listSave>
        </v-tab-item> -->
      </v-tabs-items>
    </client-only>
  </div>
</template>

<script>
import information from '~/components/quan-ly-nha-cung-cap/edit-nha-cung-cap/information'
import product from '~/components/quan-ly-nha-cung-cap/edit-nha-cung-cap/product'
import productncc from '~/components/quan-ly-nha-cung-cap/edit-nha-cung-cap/productncc'
import properties from '~/components/quan-ly-nha-cung-cap/edit-nha-cung-cap/properties'
import productAttrSet from '~/components/quan-ly-nha-cung-cap/edit-nha-cung-cap/productAttrSet'
import history from '~/components/quan-ly-nha-cung-cap/edit-nha-cung-cap/history'
import review from '~/components/quan-ly-nha-cung-cap/edit-nha-cung-cap/review'
// import listSave from '~/components/quan-ly-nha-cung-cap/edit-nha-cung-cap/listSave'

export default {
  components: {
    information,
    product,
    productncc,
    properties,
    history,
    review,
    productAttrSet,
    // listSave,
  },
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
  data: () => ({
    value: null,
    numberTitle: 0,
    tab: 0,
    tabNCC: 0,
    tabProduct: 0,
    tabProductNcc: 0,
    tabReview: 0,
    check_get: 0,
    title: '',
    dataThongtin: {},
  }),
  watch: {
    open(value) {
      if (value === 3) {
        this.tab = 0
        this.title = 'Thông tin nhà cung cấp'
        this.detail()
      }
    },
  },
  methods: {
    detail() {
      this.$store
        .dispatch('nha_cung_cap/detail', {
          enterprise_id: this.data.id,
        })
        .then((response) => {
          if (!response.error) {
            this.dataThongtin = response.data.data
          }
        })
    },
    clicked_tab(value) {
      this.tabNCC = value
      this.tabProduct = value
      this.tabProductNcc = value
      this.tabReview = value
      if (this.value !== value) {
        this.numberTitle = 0
      }
      this.value = value
      if (this.numberTitle !== 1) {
        this.$emit('title_edit', value)
      }
    },
  },
}
</script>
