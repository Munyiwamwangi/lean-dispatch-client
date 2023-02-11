<template>
  <div>
    <v-toolbar color="#f8f8f8" dense>
      <v-toolbar-title class="secondary--text text-subtitle-2 text-capitalize">
        {{ $t('bonusRequests') }}
      </v-toolbar-title>
    </v-toolbar>
    <v-tabs v-model="tab">
      <v-tab> {{ $t('pendingApproval') }} </v-tab>
      <v-tab>
        {{ $t('approvedBonuses') }}
      </v-tab>
      <v-tab>{{ $t('declinedRequests') }}</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item>
        <v-container fluid>
          <BonusRequestsPendingApproval
            @show-feedback="showFeedback"
            @view-requests-history="saveItemAndNavigate"
          ></BonusRequestsPendingApproval>
        </v-container>
      </v-tab-item>

      <v-tab-item>
        <v-container fluid>
          <BonusRequestsApproved
            @view-requests-history="saveItemAndNavigate"
          ></BonusRequestsApproved>
        </v-container>
      </v-tab-item>

      <v-tab-item>
        <v-container fluid>
          <BonusRequestsDeclined
            @view-requests-history="saveItemAndNavigate"
          ></BonusRequestsDeclined>
        </v-container>
      </v-tab-item>
    </v-tabs-items>

    <FeedbackSnackBar
      :show-snack.sync="feedbackSnackShowing"
      :snack-text="feedbackSnackText"
      :snack-color="feedbackSnackColor"
    ></FeedbackSnackBar>
  </div>
</template>

<script>
// eslint-disable-next-line vue/max-len
import BonusRequestsPendingApproval from '@/components/BonusRequestsPendingApproval.vue';
import BonusRequestsApproved from '@/components/BonusRequestsApproved.vue';
import BonusRequestsDeclined from '@/components/BonusRequestsDeclined.vue';
import FeedbackSnackBar from '@/components/FeedbackSnackBar';

import { mapActions } from 'vuex';

export default {
  name: 'BonusRequestsList',
  components: {
    BonusRequestsPendingApproval,
    BonusRequestsApproved,
    FeedbackSnackBar,
    BonusRequestsDeclined,
  },
  data: () => ({
    loading: true,
    itemPerPage: {
      text: '25',
      value: 25,
    },
    itemsPerPage: [
      {
        text: '25',
        value: 25,
      },
      {
        text: '50',
        value: 50,
      },
      {
        text: '100',
        value: 100,
      },
      {
        text: 'All',
        value: -1,
      },
    ],
    // tab items
    tab: 0,
    tabData: [
      {
        id: 0,
        label: 'pendingApproval',
      },
      {
        id: 1,
        label: 'approvedBonuses',
      },
    ],

    pendingApproval: [],
    approvedBonuses: [],

    feedbackSnackShowing: false,
    feedbackSnackColor: '',
    feedbackSnackText: '',
  }),

  computed: {
    filteredBonusesList() {
      return this.pendingApproval;
    },
  },

  watch: {
    tab(val) {
      if (val == 0) {
        this.bonuses = this.pendingApproval;
      } else {
        this.bonuses = this.approvedBonuses;
      }
    },
  },

  methods: {
    ...mapActions('bonus_request', ['updateCurrentRequest']),

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

    saveItemAndNavigate(item) {
      this.updateCurrentRequest(item).then(
        this.$router.push({ name: 'bonus-request' })
      );
    },
  },
};
</script>

<style lang="scss" scoped></style>
