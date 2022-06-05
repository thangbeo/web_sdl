<template>
  <client-only>
    <div
      style="min-width: 33px !important"
      class="d-flex align-center justify-center"
    >
      <CentreControls v-if="name === 'bang-dieu-khien-trung-tam'" />
      <Website v-if="name === 'website'" />
      <TouristFloors v-if="name === 'san-du-lich'" />
      <Kiosh v-if="name === 'kiosh'" />
      <Config v-if="name === 'cau-hinh-chung'" />
    </div>
  </client-only>
</template>

<script>
import CentreControls from '~/components/icon/navigation/CentreControls'
import Website from '~/components/icon/navigation/Website'
import TouristFloors from '~/components/icon/navigation/TouristFloors'
import Kiosh from '~/components/icon/navigation/Kiosh'
import Config from '~/components/icon/navigation/Config'

export default {
  components: {
    CentreControls,
    Website,
    TouristFloors,
    Kiosh,
    Config,
  },
  props: {
    name: {
      type: String,
      required: true,
    },
  },
}
</script>
