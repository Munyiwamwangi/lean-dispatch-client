<template>
  <GmapMap
    :center="center"
    :zoom="zoom"
    map-type-id="roadmap"
    style="width: 100%; height: 80vh"
    ref="mapRef"
  >
    <GmapMarker
      :key="index"
      v-for="(m, index) in markers"
      :position="m"
      :clickable="true"
      :draggable="true"
      @click="panTo"
    />
  </GmapMap>
</template>

<script allowJs="true">
import { getGoogleMapsAPI } from "gmap-vue";
export default {
  mounted() {
    // At this point, the child GmapMap has been mounted, but
    // its map has not been initialized.
    // Therefore we need to write mapRef.$mapPromise.then(() => ...)
    this.$refs.mapRef.$mapPromise.then((map) => {
      map.panTo(this.center);
    });
  },
  watch: {
    currentItem: {
      handler(val) {
        if (val && val.delivery_lat) {
          const { delivery_lat: lat, delivery_long: long } = val;
          this.panTo({ lat: parseFloat(lat), lng: parseFloat(long) });
        }
      },
      immediate: true,
    },
  },
  computed: {
    // The below example is the same as writing
    // google() {
    //   return getGoogleMapsAPI();
    // },
    google: getGoogleMapsAPI,
    currentItem() {
      return this.$store.getters["map/getCurrentItem"];
    },
  },
  data: function () {
    return {
      zoom: 11,
      center: { lat: 1.29, lng: 36.29 },
      markers: [
        { lat: 1.29, lng: 36.29 },
        { lat: 1.29, lng: 38.29 },
        { lat: 1.29, lng: 37.29 },
      ],
    };
  },
  methods: {
    panTo(coord) {
      this.$refs.mapRef.$mapPromise.then((map) => {
        map.panTo(coord);
        this.zoom = 15;
        this.markers = [coord];
      });
    },
  },
};
</script>

<style></style>
