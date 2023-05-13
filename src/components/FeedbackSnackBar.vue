<template>
  <v-snackbar
    v-model="showSnackBar"
    :timeout="5000"
    :color="showColor"
    app
    top
    dense
    border="left"
    class="subtitle-2 text-truncate"
  >
    {{ $t(showText) }}

    <template v-slot:action="{ attrs }">
      <v-btn v-bind="attrs" text @click="snackShowing = false">
        {{ $t("closeButtonText") }}
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
export default {
  props: {
    showSnack: {
      type: Boolean,
      default: false,
    },
    snackText: {
      type: String,
      default: "",
    },
    snackColor: {
      type: String,
      default: "",
    },
  },
  computed: {
    error() {
      return this.$store.getters.getError;
    },

    showSnackBar: {
      get() {
        return this.showSnack
          ? this.showSnack
          : this.error.feedbackSnackShowing;
      },
      set(value) {
        this.$emit("update:show-snack", value);
      },
    },

    showText() {
      return this.snackText ? this.snackText : this.error.feedbackSnackText;
    },
    showColor() {
      return this.snackColor ? this.snackColor : this.error.feedbackSnackColor;
    },

    snackShowing: {
      get() {
        return this.showSnack;
      },
      set(value) {
        this.$emit("update:show-snack", value);
      },
    },
  },
};
</script>

<style lang="scss" scoped></style>
