<template>
  <div>
    <v-dialog v-model="dialog" max-width="500" persistent>
      <v-card elevation="0">
        <v-card-title class="secondary--text text-capitalize">
          {{ message.title }}
        </v-card-title>

        <v-card-text>
          <div class="text-caption">
            Created at:
            {{ $date(message.created_at).format('DD-MM-YYYY HH:mm') }}
          </div>
          <div v-if="message.last_published_at" class="text-caption">
            Last Published at:
            {{ $date(message.last_published_at).format('DD-MM-YYYY HH:mm') }}
          </div>
        </v-card-text>

        <v-card-text class="accent--text text-h5">Message</v-card-text>

        <v-card-text class="message" v-html="message.description"></v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="accent" text rounded @click="closeDialog">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    message: {
      type: Object,
      required: true,
    },
    dialog: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    closeDialog() {
      this.$emit('close-dialog');
    },
  },
};
</script>

<style scoped>
.message /deep/ img {
  height: auto;
  max-width: 100%;
}
</style>
