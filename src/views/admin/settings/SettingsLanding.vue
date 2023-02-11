<template>
  <div>
    <v-toolbar color="#f8f8f8" dense elevation="1">
      <v-toolbar-title class="secondary--text text-subtitle-2 text-capitalize">
        {{ $t('settings') }}
      </v-toolbar-title>
    </v-toolbar>
    <SettingsLandingComponent></SettingsLandingComponent>
  </div>
</template>

<style scoped>
.v-select__selections input {
  display: none;
}
</style>

<script>
import SettingsLandingComponent from '../../../components/SettingsLandingPage.vue';
export default {
  name: 'SettingsLanding',
  components: {
    SettingsLandingComponent,
  },
};
</script>
