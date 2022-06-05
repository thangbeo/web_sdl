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
          @click="clicked_tab(0)"
        >
          Thông tin
        </v-tab>

        <v-tab
          :class="
            (tab !== 1 && 'black--text') +
            ' text-none letter-spacing-normal fs-17  font-weight-bold'
          "
          @click="clicked_tab(1)"
        >
          Thông báo
        </v-tab>
        <v-tab
          :class="
            (tab !== 2 && 'black--text') +
            ' text-none letter-spacing-normal fs-17  font-weight-bold'
          "
          @click="clicked_tab(2)"
        >
          Phân quyền
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab">
        <v-tab-item eager>
          <information
            ref="information"
            :open="tab == 0"
            @exit="exit()"
            @success="$emit('success')"
          >
          </information>
        </v-tab-item>

        <v-tab-item eager>
          <notication
            ref="notication"
            :open="tab == 1"
            :listnotification="listnotification"
            @success="$emit('success')"
            @tab="tabSwitch"
            @exit="exit()"
          >
          </notication>
        </v-tab-item>

        <v-tab-item eager>
          <permission
            ref="permission"
            :open="tab == 2"
            :listpermissions="listpermissions"
            @tab="tabSwitch"
            @success="$emit('success')"
            @exit="exit()"
          >
          </permission>
        </v-tab-item>
      </v-tabs-items>
    </client-only>
  </div>
</template>

<script>
import information from '../../components/quan-tri-vien/add-quan-tri-vien/information'
import notication from '../../components/quan-tri-vien/add-quan-tri-vien/notication'
import permission from '../../components/quan-tri-vien/add-quan-tri-vien/permission'

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
  }),
  watch: {
    open(value) {
      if (value) {
        this.tab = 0
        const listPhanQuyen = []
        for (let i = 0; i < this.listpermissions.length; i++) {
          this.listpermissions[i].status = 1
          listPhanQuyen.push(this.listpermissions[i].page_id)
        }
        this.$store.commit('quan_tri_vien/add_PhanQuyen', listPhanQuyen.join())
        this.$store.commit('quan_tri_vien/is_owner', 0)
        const listThongbao = []
        for (let i = 0; i < this.listnotification.length; i++) {
          this.listnotification[i].status = 1
          listThongbao.push(this.listnotification[i].notify_index)
        }
        this.$store.commit('quan_tri_vien/add_Thongbao', listThongbao.join())
      }
    },
  },
  methods: {
    tabSwitch() {
      this.tab = 0
      this.$refs.information.save()
    },
    exit() {
      this.$refs.information.resets()
      this.$emit('exit')
      this.tab = 0
      for (let i = 0; i < this.listpermissions.length; i++) {
        this.listpermissions[i].status = 1
      }
      for (let i = 0; i < this.listnotification.length; i++) {
        this.listnotification[i].status = 1
      }
    },
    clicked_tab(value) {
      this.check_get = value
    },
  },
}
</script>
