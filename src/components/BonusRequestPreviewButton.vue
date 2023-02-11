<template>
  <v-btn icon color="primary" @click="$emit('view-requests-history', item)">
    <v-icon>mdi-eye-outline</v-icon>
  </v-btn>
</template>

<script>
export default {
  name: 'BonusRequestPreviewButton',
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped></style>
