<template>
  <div class="ml-1">
    <client-only>
      <RevenueStatistics />

      <SupplierStatistics />

      <CustomerStatistics />

      <ProductStatistics />

      <InteractiveStatistics />
    </client-only>
  </div>
</template>

<script>
// import moment from 'moment'
import RevenueStatistics from '../../components/Dashboard/RevenueStatistics'
import SupplierStatistics from '../../components/Dashboard/SupplierStatistics'
import CustomerStatistics from '../../components/Dashboard/CustomerStatistics'
import ProductStatistics from '~/components/Dashboard/ProductStatistics'
import InteractiveStatistics from '~/components/Dashboard/InteractiveStatistics'

export default {
  components: {
    RevenueStatistics,
    SupplierStatistics,
    CustomerStatistics,
    ProductStatistics,
    InteractiveStatistics,
  },
  data() {
    return {
      title: 'Dashboard',
    }
  },
  methods: {},
  head() {
    this.$store.commit('app/setTitle', this.title)
    return {
      title: this.title,
    }
  },
}
</script>
