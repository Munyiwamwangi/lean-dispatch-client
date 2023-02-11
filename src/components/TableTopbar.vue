<template>
  <v-toolbar flat>
    <slot name="leading"></slot>
    <v-spacer></v-spacer>
    <p class="mb-0 px-2 text-caption text-capitalize">
      {{ $t('recordsTranslate') }}:
    </p>

    <v-responsive max-width="85">
      <v-select
        v-model="selectedItemPerPage"
        item-text="text"
        item-value="value"
        :items="itemsPerPage"
        dense
        outlined
        hide-details
        return-object
      ></v-select>
    </v-responsive>
    <slot name="trailing"></slot>
  </v-toolbar>
</template>

<script>
export default {
  props: {
    itemPerPage: {
      type: Object,
      required: true,
    },
    itemsPerPage: {
      type: Array,
      required: true,
    },
  },
  computed: {
    selectedItemPerPage: {
      get() {
        return this.itemPerPage;
      },
      set(value) {
        this.$emit('update:itemPerPage', value);
      },
    },
  },
};
</script>

<style lang="scss" scoped></style>
