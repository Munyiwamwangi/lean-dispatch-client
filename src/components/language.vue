<template>
  <div class="text-center pa-5">
    <v-menu offset-y open-on-hover>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-model="$i18n.locale"
          v-bind="attrs"
          :items="langs"
          hide-details
          outlined
          color="white"
          v-on="on"
        >
          {{ selectedLocale }}
          <v-icon right> mdi-chevron-down </v-icon>
        </v-btn>
      </template>

      <v-list pt-2>
        <v-list-item
          v-for="lang in langs"
          :key="lang"
          @click="selectLanguage(lang)"
        >
          <v-list-item-title class="text-uppercase">
            {{ lang }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
export default {
  name: 'LangSelector',
  data() {
    return {
      langs: ['en', 'et'],
      selectedLocale: this.$i18n.locale,
    };
  },

  watch: {
    selectedLocale(val) {
      this.$i18n.locale = val;
    },
  },

  methods: {
    selectLanguage(lang) {
      this.$i18n.locale = this.selectedLocale = lang;
      // persiste the language into state
      this.$store.language = localStorage.setItem('language', lang);
    },
  },
};
</script>

<style lang="scss" scoped>
.langSelector {
  padding: 15px;
  border: 1px solid green;
  font-size: 15px;
}
</style>
