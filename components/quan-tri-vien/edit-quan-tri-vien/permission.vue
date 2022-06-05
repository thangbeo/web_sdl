<template>
  <div style="background-color: #f4f7fe">
    <v-container>
      <v-row class="pt-10">
        <v-col cols="1">
          <v-card-text class="ml-0 pt-5 font-weight-bold">Owner</v-card-text>
        </v-col>
        <v-col cols="11">
          <v-switch
            v-model="owner"
            color="#47bbff"
            :false-value="2"
            :true-value="1"
            inset
            @click="changeOwner(owner)"
          ></v-switch>
        </v-col>

        <v-col
          v-for="(item, index) in dataList"
          :key="index"
          cols="6"
          class="py-0 d-flex"
        >
          <div>
            <v-card-text class="pt-5">{{ item.page_name }}</v-card-text>
          </div>
          <v-spacer></v-spacer>
          <div style="margin-right: 280px">
            <v-switch
              v-model="item.status"
              color="#47bbff"
              :false-value="0"
              :true-value="1"
              :readonly="owner === 1"
              inset
            ></v-switch>
          </div>
        </v-col>

        <v-col cols="10" class="pt-12 d-flex justify-end">
          <v-btn
            color="#FF0F59"
            width="90px"
            class="text-none white--text mr-3"
            depressed
            @click="open_cancel = true"
            >Hủy</v-btn
          >
          <v-btn
            class="text-none"
            width="90px"
            color="#47BBFF"
            dark
            depressed
            @click="open_update = true"
            >Lưu</v-btn
          >
        </v-col>
      </v-row>
    </v-container>
    <yes-no-alert
      :open="open_update"
      alert-msg="Bạn chắc chắn muốn lưu thông tin được thay đổi của quản trị viên không?"
      @toggle="open_update = !open_update"
      @OK="save"
    >
    </yes-no-alert>
    <yes-no-alert
      :open="open_cancel"
      alert-msg="Bạn chắc chắn muốn hủy không?"
      @toggle="open_cancel = !open_cancel"
      @OK="toggle"
    >
    </yes-no-alert>
  </div>
</template>

<script>
export default {
  props: {
    open: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Array,
      default: null,
    },
    id: {
      type: Object,
      default: null,
    },
    listpermissions: {
      type: Array,
      default: null,
    },
  },

  data: () => ({
    open_update: false,
    open_cancel: false,
    owner: 1,
    page: true,
    dataList: [],
    configuration: true,
    list_page: [],
  }),
  watch: {
    open(value) {
      if (value) {
        this.getList()
      } else {
      }
    },
  },
  methods: {
    toggle() {
      this.$emit('exit')
    },
    changeOwner() {
      for (let i = 0; i < this.dataList.length; i++) {
        this.dataList[i].status = 1
      }
    },
    getList() {
      this.owner = this.id.account_type
      this.dataList = this.listpermissions
      for (let i = 0; i < this.dataList.length; i++) {
        const element = this.dataList[i]
        if (
          this.data.filter((e) => e.page_index === element.page_index)
            .length === 0
        ) {
          element.status = 0
        }
      }
      // console.log(this.dataList, this.data)
    },
    save() {
      this.list_page = []
      for (let i = 0; i < this.dataList.length; i++) {
        if (this.dataList[i].status === 1) {
          this.list_page.push(this.dataList[i].page_id)
        }
      }
      const data = {
        account_id: this.id.id,
        account_type: this.owner,
        list_page:
          (this.list_page || []).length === 0 ? '' : this.list_page.join(),
      }
      this.$store
        .dispatch('quan_tri_vien/updatePermission', data)
        .then((response) => {
          if (!response.error) {
            this.$emit('exit')
            this.$emit('success')
            this.$showSuccess(this, 'Cập nhật quản trị viên thành công')
          }
        })
        .catch((e) => {
          this.$log.debug(e)
        })
        .finally(() => {})
    },
  },
}
</script>
<style lang="scss">
.ml-0 {
  font-size: 20px;
  color: black;
}
</style>
