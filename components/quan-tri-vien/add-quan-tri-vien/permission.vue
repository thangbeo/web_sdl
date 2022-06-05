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
            :false-value="0"
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
      alert-msg="Bạn chắc chắn muốn lưu thông tin quản trị viên không?"
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
      default: true,
    },
    listpermissions: {
      type: Array,
      default: null,
    },
  },
  data: () => ({
    open_cancel: false,
    open_update: false,
    owner: 0,
    dataList: [],
    listQuanTriVien: [],
    dataThongtin: {},
  }),
  watch: {
    open(value) {
      if (value) {
        this.getList()
      } else {
        this.listQuanTriVien = []
        for (let i = 0; i < this.dataList.length; i++) {
          if (this.dataList[i].status === 1) {
            this.listQuanTriVien.push(this.dataList[i].page_id)
          }
        }
        this.$store.commit(
          'quan_tri_vien/add_PhanQuyen',
          this.listQuanTriVien.join()
        )
        this.$store.commit('quan_tri_vien/is_owner', this.owner)
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
      this.dataList = this.listpermissions
      this.owner = this.$store.state.quan_tri_vien.is_owner
    },
    save() {
      this.listQuanTriVien = []
      for (let i = 0; i < this.dataList.length; i++) {
        if (this.dataList[i].status === 1) {
          this.listQuanTriVien.push(this.dataList[i].page_id)
        }
      }
      this.$store.commit(
        'quan_tri_vien/add_PhanQuyen',
        this.listQuanTriVien.join()
      )
      this.$store.commit('quan_tri_vien/is_owner', this.owner)
      this.dataThongtin = this.$store.state.quan_tri_vien.data_add_QTVien
      let hasErrors = false
      if (this.$isNullOrEmpty(this.dataThongtin.name)) {
        hasErrors = true
        this.$emit('tab')
      }
      if (this.$isNullOrEmpty(this.dataThongtin.email)) {
        hasErrors = true
        this.$emit('tab')
      } else if (!this.$isEmail(this.dataThongtin.email)) {
        hasErrors = true
        this.$emit('tab')
      }
      if (this.$isNullOrEmpty(this.dataThongtin.note)) {
        hasErrors = true
        this.$emit('tab')
      }
      if (isNaN(this.phone) && !this.$isNullOrEmpty(this.dataThongtin.phone)) {
        hasErrors = true
        this.$emit('tab')
      } else if (
        (this.dataThongtin.phone + '').length < 10 ||
        (this.dataThongtin.phone + '').length > 12
      ) {
        if (!this.$isNullOrEmpty(this.dataThongtin.phone)) {
          hasErrors = true
          this.$emit('tab')
        }
      }
      if (!hasErrors) {
        this.Add()
      }
    },
    Add() {
      const data = {
        list_notify: this.$store.state.quan_tri_vien.list_notify,
        list_page: this.listQuanTriVien.join(),
        is_owner: this.owner,
      }
      Object.assign(data, this.$store.state.quan_tri_vien.data_add_QTVien)
      this.$store
        .dispatch('quan_tri_vien/add', data)
        .then((response) => {
          if (!response.error) {
            this.$emit('exit')
            this.$emit('success')
            this.$showSuccess(this, 'Thêm mới quản trị viên thành công')
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
