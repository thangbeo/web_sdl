<template>
  <div>
    <client-only>
      <v-tabs
        v-model="tab"
        color="primary"
        active-class="primary--text"
        background-color="#f4f7fe"
        style="position: fixed; z-index: 2"
      >
        <v-tab
          :class="
            (tab !== 0 && 'black--text') +
            ' text-none letter-spacing-normal fs-17  font-weight-bold'
          "
        >
          Thông tin
        </v-tab>

        <v-tab
          :class="
            (tab !== 1 && 'black--text') +
            ' text-none letter-spacing-normal fs-17  font-weight-bold'
          "
        >
          Thông báo
        </v-tab>
        <v-tab
          :class="
            (tab !== 2 && 'black--text') +
            ' text-none letter-spacing-normal fs-17  font-weight-bold'
          "
        >
          Phân quyền
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab">
        <v-tab-item eager>
          <information
            ref="informationedit"
            :open="open"
            :data="dataThongtin"
            @success="$emit('success')"
            @exit="exit"
          >
          </information>
        </v-tab-item>

        <v-tab-item eager>
          <notication
            :id="data"
            ref="noticationedit"
            :open="tab == 1"
            :listnotification="listnotification"
            :data="dataThongbao"
            @success="success"
            @exit="exit"
          >
          </notication>
        </v-tab-item>

        <v-tab-item eager>
          <permission
            :id="data"
            ref="permissionedit"
            :open="tab == 2"
            :listpermissions="listpermissions"
            :data="dataPhanquyen"
            @success="$emit('success')"
            @exit="exit"
          >
          </permission>
        </v-tab-item>
      </v-tabs-items>
    </client-only>
  </div>
</template>

<script>
import information from '../../components/quan-tri-vien/edit-quan-tri-vien/information'
import notication from '../../components/quan-tri-vien/edit-quan-tri-vien/notication'
import permission from '../../components/quan-tri-vien/edit-quan-tri-vien/permission'

export default {
  components: {
    information,
    notication,
    permission,
  },
  props: {
    open: {
      type: Boolean,
      required: true,
    },
    data: {
      type: Object,
      default: null,
    },
    listnotification: {
      type: Array,
      default: null,
    },
    listpermissions: {
      type: Array,
      default: null,
    },
  },
  data: () => ({
    tab: 0,
    check_get: 0,
    dataThongtin: {},
    dataThongbao: [],
    dataPhanquyen: [],
  }),
  watch: {
    open(value) {
      if (value) {
        this.tab = 0
        this.detail()
      }
    },
  },
  methods: {
    success() {
      this.$emit('success')
      for (let i = 0; i < this.listnotification.length; i++) {
        this.listnotification[i].status = 1
      }
      for (let i = 0; i < this.listpermissions.length; i++) {
        this.listpermissions[i].status = 1
      }
    },
    exit() {
      for (let i = 0; i < this.listnotification.length; i++) {
        this.listnotification[i].status = 1
      }
      for (let i = 0; i < this.listpermissions.length; i++) {
        this.listpermissions[i].status = 1
      }
      this.tab = 0
      this.$refs.informationedit.reset()
      this.$emit('exit')
    },

    detail() {
      const data = {
        account_id: this.data.id,
      }
      this.$store
        .dispatch('quan_tri_vien/detail', data)
        .then((response) => {
          if (!response.error) {
            this.dataThongtin = response.data.data.accountCmsCur
            this.dataThongbao = response.data.data.accountNotifyCurList
            this.dataPhanquyen = response.data.data.accountPageCurList
          }
        })
        .catch((e) => {
          this.$log.debug(e)
        })
    },

    clicked_tab(value) {
      this.check_get = value
      if (value === 2) {
        this.$store.commit('quan_tri_vien/set_data', this.dataThongbao)
      }
    },
  },
}
</script>
