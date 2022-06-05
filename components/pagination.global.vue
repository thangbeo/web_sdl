<template>
  <v-col
    :class="(depressed && 'depressed-pagination') + ' pt-0 pb-0'"
    cols="12"
  >
    <v-row no-gutters class="justify-sm-end justify-center">
      <v-col class="d-flex align-center justify-end col-auto">
        <div style="width: 100px">
          <v-select
            :value="pageSize"
            :items="$store.state.app.pageSizes"
            solo
            flat
            dense
            hide-details
            append-icon="mdi-menu-swap"
            class="mt-1 mr-2 fs-14"
            @change="changePageSize"
          ></v-select>
        </div>
        <div v-if="server" class="fs-14 pt-1">
          <div v-if="pageInfo.total_record > 0">
            Hiển thị
            {{ pageInfo.begin_idx }}
            đến
            {{ pageInfo.end_idx }}
            của
            {{ pageInfo.total_record }}
            mục.
          </div>
        </div>
        <div v-else class="fs-14 pt-1">
          <div v-if="items.length !== 0">
            Hiển thị
            {{ (page - 1) * pageSize + 1 }}
            đến
            {{
              page !== pageCount
                ? (page - 1) * pageSize + pageSize
                : items.length
            }}
            của
            {{ items.length }}
            mục.
          </div>
        </div>
      </v-col>
      <div class="flex-grow-1"></div>
      <v-col :key="pageCount" class="col-auto" style="min-width: 10%">
        <div class="ml-2">
          <v-pagination
            :value="page"
            :length="pageCount"
            total-visible="10"
            page-aria-label
            next-aria-label
            previous-aria-label
            wrapper-aria-label
            current-page-aria-label
            @input="changePageButton($event)"
          ></v-pagination>
        </div>
      </v-col>
    </v-row>
  </v-col>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      default: Array,
    },
    page: {
      type: Number,
      required: true,
    },
    pageCount: {
      type: Number,
      required: true,
    },
    pageSize: {
      type: Number,
      required: true,
    },
    pageInfo: {
      type: Object,
      default: Object,
    },
    server: {
      type: Boolean,
      default: true,
    },
    depressed: {
      type: Boolean,
      default: true,
    },
  },
  data: () => ({
    rerender: Math.random(),
  }),
  watch: {
    page(value) {
      this.rerender = Math.random()
    },
  },
  methods: {
    changePageSize(value) {
      this.$emit('changePageSize', value)
    },
    changePageButton(value) {
      this.$emit('changePage', parseInt(value))
    },
  },
}
</script>

<style lang="scss">
.depressed-pagination {
  background-color: white;
  .v-pagination__item {
    box-shadow: none !important;
    // border: thin solid #f5f7fe;
    height: 30px;
  }
  .v-pagination__item:hover {
    background-color: rgba(0, 0, 0, 0.12) !important;
  }

  .v-pagination__navigation {
    box-shadow: none !important;
    border: thin solid rgba(0, 0, 0, 0.12);
    height: 30px;
    width: 30px;
  }

  .v-pagination__item--active {
    background-color: #3f69b8 !important;
    border-color: #3f69b8 !important;
  }

  .v-pagination__navigation:hover {
    background-color: rgba(0, 0, 0, 0.12) !important;
  }

  .v-pagination__item--active:hover {
    background-color: #42a5f5 !important;
    border-color: #42a5f5 !important;
  }
}
</style>
