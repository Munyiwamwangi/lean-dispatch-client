<template>
  <div>
    <v-toolbar color="#f8f8f8" dense elevation="1">
      <v-btn text icon @click="$router.replace('/settings')">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-toolbar-title class="secondary--text text-subtitle-2 text-capitalize">
        {{ $t('settings') }}
      </v-toolbar-title>
    </v-toolbar>
    <!-- welcome message component -->
    <SettingsWelcomeMessage @show-feedback="showFeedback">
    </SettingsWelcomeMessage>

    <!-- snackbar -->
    <FeedbackSnackBar
      :show-snack.sync="feedbackSnackShowing"
      :snack-text="feedbackSnackText"
      :snack-color="feedbackSnackColor"
    ></FeedbackSnackBar>
    <!-- snackbar ends -->
  </div>
</template>

<style scoped>
.v-select__selections input {
  display: none;
}
</style>

<script>
import SettingsWelcomeMessage from '../../../components/SettingsWelcomeMessage.vue';
import FeedbackSnackBar from '@/components/FeedbackSnackBar';

export default {
  name: 'WelcomeMessageSettingsDash',
  components: {
    FeedbackSnackBar,
    SettingsWelcomeMessage,
  },

  data() {
    return {
      drawer: null,
      filterDrawer: false,

      // filter
      filterCompany: '',
      filterById: null,
      filterBonusCode: '',

      feedbackSnackShowing: false,
      feedbackSnackColor: '',
      feedbackSnackText: '',
    };
  },

  watch: {
    deleteDialog(val) {
      val || this.closeDelete();
    },
  },

  created() {
    // fetch the data when the view is created and the data is
    // already being observed
    this.$store.dispatch('bonuses/loadBonuses');
    this.$store.dispatch('packages/loadPackages');
    this.$store.dispatch('loadCompanies');
  },

  methods: {
    showFeedback({ status, message }) {
      let snackColor = '';
      if (status === 'submitting') {
        snackColor = 'info';
      } else if (status === 'success') {
        snackColor = 'success lighten-1';
      } else if (status === 'fail') {
        snackColor = 'red lighten-1';
      }
      this.feedbackSnackShowing = true;
      this.feedbackSnackColor = snackColor;
      this.feedbackSnackText = message;
    },

    // utility Functions
    hideSnackbar() {
      this.showFeedback = false;
    },
  },
};
</script>
