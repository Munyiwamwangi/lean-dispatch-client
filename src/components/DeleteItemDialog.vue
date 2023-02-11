<template>
  <v-dialog :value="dialog" max-width="500px" persistent>
    <v-card class="text-center">
      <v-card-text class="py-4">
        <v-icon color="warning" dark size="64">mdi-alert-outline</v-icon>
      </v-card-text>

      <v-card-text class="text-h6 text-capitalize">
        {{ $t('removeButtonText') }} {{ item }}?
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="accent darken-1" text @click="closeDelete">Cancel</v-btn>
        <v-btn color="secondary darken-1" text @click="removeItem">
          {{ $t('yesDeleteItConfirmationText') }}!
        </v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'DeleteItemDialog',
  props: {
    dialog: {
      type: Boolean,
      default: false,
    },
    item: {
      type: String,
      default: 'Item',
    },
  },

  methods: {
    closeDelete() {
      this.$emit('close-dialog');
    },
    removeItem() {
      this.$emit('delete-item');
    },
  },
};
</script>

<style lang="scss" scoped></style>
