<template>
  <div>
    <v-toolbar color="#f8f8f8" dense>
      <v-toolbar-title class="secondary--text text-subtitle-2 text-capitalize">
        {{ $t('logs') }}
      </v-toolbar-title>
    </v-toolbar>

    <v-spacer></v-spacer>

    <v-tabs v-model="tab">
      <v-tab class="ml-4 text-uppercase">audit log</v-tab>
      <v-tab class="ml-4 text-uppercase">login trail</v-tab>
      <!-- audit log -->

      <v-tab-item>
        <AuditLogTableComponent
          :tab="tab"
          :trail="auditLogDetail"
          :loading="loading"
          :filter-drawer.sync="filterDrawer"
          @show-feedback="showFeedback"
        ></AuditLogTableComponent>
      </v-tab-item>
      <!-- login trail  -->
      <v-tab-item>
        <LoginTrailTableComponent
          :tab="tab"
          :filter-drawer.sync="filterDrawer"
          :trail="LoginTrailLogDetail"
          :loading="loading"
          @show-feedback="showFeedback"
        ></LoginTrailTableComponent>
      </v-tab-item>
    </v-tabs>

    <FeedbackSnackBar
      :show-snack.sync="feedbackSnackShowing"
      :snack-text="feedbackSnackText"
      :snack-color="feedbackSnackColor"
    ></FeedbackSnackBar>
  </div>
</template>

<script>
import AuditLogTableComponent from '../../../components/user-access-management/audit.log.vue';
import LoginTrailTableComponent from '../../../components/user-access-management/login.trail.vue';
import { mapGetters } from 'vuex';
import FeedbackSnackBar from '@/components/FeedbackSnackBar';

export default {
  name: 'LogsView',
  drawer: null,
  filterDrawer: false,
  components: {
    AuditLogTableComponent,
    LoginTrailTableComponent,
    FeedbackSnackBar,
  },

  data() {
    return {
      // filter
      filterDrawer: false,
      filterCompany: '',
      filterById: null,
      filterBonusCode: '',

      feedbackSnackShowing: false,
      feedbackSnackColor: '',
      feedbackSnackText: '',

      // tab items
      tab: 0,
    };
  },

  computed: {
    ...mapGetters('logs', {
      LoginTrailLogDetail: 'loginTrailLog',
      loading: 'loadingLoginTrail',
      auditLogDetail: 'auditTrailLog',
    }),
  },

  watch: {
    tab(val) {
      this.tab = val;
    },
  },

  created() {
    this.$store.dispatch('logs/loadLoginTrail');
    this.$store.dispatch('logs/loadAuditTrail');
  },

  methods: {
    closeFilterSidebar() {
      this.filterDrawer = false;
    },
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
