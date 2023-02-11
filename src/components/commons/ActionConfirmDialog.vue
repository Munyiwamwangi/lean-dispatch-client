<template>
  <v-dialog :value="dialog" max-width="500px" persistent>
    <v-card class="text-center">
      <div v-if="statusCode === 200">
        <v-card-text class="py-4">
          <v-icon color="primary" dark size="70">mdi-cog-outline</v-icon>
        </v-card-text>
      </div>

      <div v-else>
        <v-card-text class="py-4">
          <v-icon color="warning" dark size="64">mdi-cog-outline</v-icon>
        </v-card-text>
      </div>

      <v-card-text class="text-h6 text--accent-1">
        {{ message }}
      </v-card-text>
      <v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="accent darken-1"
            class="align-center"
            text
            @click="closeDelete"
          >
            Okay
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'ActionConfirmDialog',
  props: {
    dialog: {
      type: Boolean,
      default: false,
    },
    statusCode: {
      type: Number,
      default: 0,
    },
    item: {
      type: String,
      default: 'Item',
    },
    message: {
      type: String,
      required: true,
    },
  },

  creaated() {
    console.log(this.statusCode);
  },

  methods: {
    closeDelete() {
      this.$emit('close-dialog');
    },
  },
};
</script>

<style lang="scss" scoped></style>
