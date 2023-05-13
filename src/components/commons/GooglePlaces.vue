<template>
  <v-combobox
    v-bind="$attrs"
    item-text="description"
    item-value="description"
    :search-input.sync="query"
    :loading="loading"
    :items="results"
    v-on="$listeners"
    @input="handleInput"
    no-filter
  >
    <template v-slot:item="{ item }">
      <v-list-item-content v-if="item">
        <v-list-item-title /> {{ item.structured_formatting.main_text }}
        <v-list-item-subtitle />item.structured_formatting.secondary_text
      </v-list-item-content>
    </template>
  </v-combobox>
</template>

<script>
import { debounce, isEmpty, isObject } from "lodash";
import { getGoogleMapsAPI } from "gmap-vue";
export default {
  props: {
    latitude: {
      type: Number,
      default: 52.08966,
    },
    longitude: {
      type: Number,
      default: 5.11436,
    },
    debounceMsec: {
      type: Number,
      default: 200,
    },
    placesFields: {
      type: Array,
      default: () => [
        // 'address_components',
        "formatted_address",
      ],
    },
    placesTypes: {
      type: Array,
      default: () => ["address"],
    },
    placesRadius: {
      type: Number,
      default: 100000,
    },
  },
  computed: {
    google: getGoogleMapsAPI,
  },
  data() {
    return {
      platform: null,
      searchService: null,
      placesService: null,
      query: "",
      results: [],
      loading: false,
      googleSessionToken: "",
    };
  },
  watch: {
    query(val) {
      this.search(val);
    },
  },
  created() {
    this.search = debounce(this.search, this.debounceMsec);
  },
  mounted() {
    // this.initService();
    console.log({ google: this.google });
  },
  methods: {
    initService() {
      this.searchService = new this.google.maps.places.AutocompleteService();
      this.placesService = new this.google.maps.places.PlacesService(
        new this.google.maps.Map(document.createElement("div"))
      );
      this.generateNewSessionToken();
    },
    async search(val) {
      if (isEmpty(val) || val.length < 3) {
        this.results = [];
        return;
      }
      this.loading = true;
      try {
        this.results = await this.searchPlace(val);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn("Could not retrieve location suggestions", e);
      }
      this.loading = false;
    },
    searchPlace(val) {
      return new Promise((resolve, reject) => {
        this.searchService.getPlacePredictions(
          {
            input: val,
            location: new this.google.maps.LatLng(
              this.latitude,
              this.longitude
            ),
            radius: this.placesRadius,
            types: this.placesTypes,
            sessionToken: this.googleSessionToken,
          },
          (predictions, status) => {
            if (status === this.google.maps.places.PlacesServiceStatus.OK) {
              return resolve(predictions);
            }
            if (
              status ===
              this.google.maps.places.PlacesServiceStatus.ZERO_RESULTS
            ) {
              return resolve([]);
            }
            return reject(status);
          }
        );
      });
    },
    generateNewSessionToken() {
      this.googleSessionToken =
        new this.google.maps.places.AutocompleteSessionToken();
    },
    async handleInput(choice) {
      // If choice is a string, simply return that
      if (!isObject(choice)) {
        this.$emit("input", choice);
        return;
      }
      // Already set the text to the current information as provided by the choice
      this.$emit("input", choice.description);
      this.loading = true;
      try {
        // Attempt to get full address including postal code
        const placeDetails = await this.getPlaceDetails(choice);
        this.$emit("input", placeDetails.formatted_address);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
      }
      this.loading = false;
      this.generateNewSessionToken();
    },
    getPlaceDetails(choice) {
      return new Promise((resolve, reject) => {
        this.placesService.getDetails(
          {
            placeId: choice.place_id,
            sessionToken: this.googleSessionToken,
            fields: this.placesFields,
          },
          (result, status) => {
            if (status === this.google.maps.places.PlacesServiceStatus.OK) {
              return resolve(result);
            }
            return reject(result);
          }
        );
      });
    },
  },
};
</script>
