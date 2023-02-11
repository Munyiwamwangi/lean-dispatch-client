<template>
  <div>
    <v-toolbar color="#f8f8f8" dense elevation="1">
      <v-toolbar-title class="secondary--text text-subtitle-2 text-capitalize">
        {{ $t('settings') }}
      </v-toolbar-title>
    </v-toolbar>

    <v-container>
      <v-card>
        <v-card-text>
          {{ $t('esterEggCommingSoonTextTranslate') }}
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<style scoped></style>

<script>
export default {
  name: 'HrSettings',

  data: () => ({
    drawer: null,
  }),

  computed: {
    user() {
      return this.$store.state.currentUser;
    },
    fullName() {
      return (
        this.$store.state.currentUser.first_name +
        ' ' +
        this.$store.state.currentUser.last_name
      );
    },
    initials() {
      return (
        this.$store.state.currentUser.first_name[0] +
        this.$store.state.currentUser.first_name[0]
      );
    },
  },

  watch: {},

  methods: {},
};
</script>
