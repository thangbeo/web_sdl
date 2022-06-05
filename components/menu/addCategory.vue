<template>
  <div>
    <dialog-right
      :open="open"
      width="800px"
      title="THÊM DANH MỤC"
      @toggle="toggle"
    >
      <div>
        <v-row>
          <v-col cols="2">
            <p class="pt-5 fs-14 font-weight-bold">
              Thêm từ <span class="error--text">*</span>
            </p>
          </v-col>
          <v-col cols="10">
            <v-autocomplete
              v-model="addText"
              :items="listText"
              placeholder="Chọn Thêm từ"
              solo
              flat
              dense
              class="pt-3 border-1 fs-14"
              :error-messages="addTextError"
              @input="addTextsError = []"
            >
            </v-autocomplete>
          </v-col>
        </v-row>
      </div>

      <categoryPage
        v-if="addText == 1"
        :opencategorypost="addText == 1"
        @add="add"
        @toggle="toggle"
      ></categoryPage>

      <categoryProduct
        v-if="addText == 2"
        :opencategorypost="addText == 2"
        @add="add"
        @toggle="toggle"
      ></categoryProduct>

      <categoryPost
        v-if="addText == 3"
        :opencategorypost="addText == 3"
        @add="add"
        @toggle="toggle"
      ></categoryPost>

      <categoryLink
        v-if="addText == 4"
        :opencategorypost="addText == 4"
        @add="add"
        @toggle="toggle"
      ></categoryLink>
    </dialog-right>
  </div>
</template>
<script>
import categoryPost from '~/components/menu/categoryPost'
import categoryProduct from '~/components/menu/categoryProduct'
import categoryPage from '~/components/menu/categoryPage'
import categoryLink from '~/components/menu/categoryLink'
import DialogRight from '~/components/Dialog/Right'
export default {
  components: {
    categoryPost,
    categoryProduct,
    categoryPage,
    categoryLink,
    DialogRight,
  },
  props: {
    open: {
      type: Boolean,
      required: true,
    },
    data: {
      type: Array,
      default: Array,
    },
  },
  data: () => ({
    addText: null,
    addTextError: [],
    listText: [
      { value: 1, text: 'Trang' },
      { value: 2, text: 'Danh mục sản phẩm' },
      { value: 3, text: 'Danh mục bài viết' },
      { value: 4, text: 'Link' },
    ],
  }),
  watch: {
    open(value) {
      if (!value) {
        this.reset()
      }
    },
  },
  methods: {
    add(data) {
      this.$emit('add', data)
    },
    toggle() {
      this.$emit('toggle')
    },
    reset() {
      this.addText = null
      this.addTextError = []
    },
  },
}
</script>
