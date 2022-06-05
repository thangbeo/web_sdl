<template>
  <div>
    <div v-if="$store.state.app.use_ggmap">
      <client-only>
        <GmapMap
          :center="center"
          :zoom="zoom"
          style="width: 100%; height: 250px"
          @click="setMarker"
        >
          <GmapMarker
            ref="myMarker"
            :clickable="true"
            :draggable="false"
            :position="google && new google.maps.LatLng(lat, lng)"
          />
        </GmapMap>
      </client-only>
    </div>

    <div v-else>
      <client-only>
        <l-map
          :center="center_lmap"
          :zoom="zoom"
          style="height: 250px; width: 100%; z-index: 0 !important"
          @click="setMarker($event)"
        >
          <l-tile-layer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png">
          </l-tile-layer>
          <l-marker :lat-lng="[lat, lng]" />
        </l-map>
      </client-only>
    </div>

    <div class="d-flex">
      <v-text-field
        v-model="address"
        placeholder="Tìm kiếm địa điểm"
        class="border-1 fs-14"
        solo
        flat
        dense
        hide-details
        @keydown.enter="set_latlng_to_map"
      >
      </v-text-field>
      <v-btn
        color="white"
        depressed
        style="width: 38px; min-width: 38px"
        @click="set_latlng_to_map"
      >
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
import { gmapApi } from 'vue2-google-maps'

export default {
  name: 'LeafletMap',
  props: {
    latLng: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
    address: '',
    zoom: 18,
    lat: 21.028511,
    lng: 105.804817,
    center: { lat: 21.028511, lng: 105.804817 },
    center_lmap: [21.028511, 105.804817],
  }),
  computed: {
    google: gmapApi,
  },
  created() {
    this.lat = this.latLng[0]
    this.lng = this.latLng[1]
    if (this.$store.state.app.use_ggmap) {
      this.center = { lat: this.lat, lng: this.lng }
    } else {
      this.center_lmap = [this.lat, this.lng]
    }
  },
  methods: {
    setMarker(e) {
      if (this.$store.state.app.use_ggmap) {
        this.lat = e.latLng.lat()
        this.lng = e.latLng.lng()
        this.$emit('set_latlng', { lat: this.lat, lng: this.lng })
      } else {
        this.lat = e.latlng.lat
        this.lng = e.latlng.lng
        // this.latLng = [this.lat, this.lng]
        this.$emit('set_latlng', { lat: this.lat, lng: this.lng })
      }
    },
    set_latlng_to_map() {
      if (this.$store.state.app.use_ggmap) {
        const DATA = {
          latlng: `${this.lat},${this.lng}`,
          address: this.address,
        }
        this.$store.dispatch('app/get_address_to_ggmap', DATA).then((res) => {
          this.zoom = 18
          this.center = res.location
          this.lat = res.location.lat
          this.lng = res.location.lng
          this.$emit('set_latlng', { lat: this.lat, lng: this.lng })
        })
      } else {
        const DATA = {
          q: (this.address || '').trim(),
          polygon_geojson: 1,
          format: 'jsonv2',
        }
        this.$store.dispatch('app/get_latlng_to_map', DATA).then((res) => {
          this.zoom = 18
          this.lat = res.data[0].lat
          this.lng = res.data[0].lon
          this.center_lmap = [this.lat, this.lng]
          this.$emit('set_latlng', { lat: this.lat, lng: this.lng })
        })
      }
    },
  },
}
</script>
