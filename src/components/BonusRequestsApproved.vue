<template>
  <v-data-table
    :headers="approvedBonusesHeaders"
    :items="approvedBonuses"
    :items-per-page="itemPerPage.value"
    class="elevation-1"
    :loading="loading"
    :loading-text="$t('dataLoadingText')"
    :no-data-text="$t('noDataTextForTables')"
    :footer-props="{
      itemsPerPageOptions: itemsPerPage,
    }"
  >
    <template slot="top">
      <RecordsShowingSelector
        :item-per-page.sync="itemPerPage"
        :items-per-page="itemsPerPage"
      ></RecordsShowingSelector>
    </template>
    <template slot="progress">
      <v-progress-linear color="secondary" indeterminate></v-progress-linear>
    </template>

    <template v-slot:[`item.id`]="props">
      {{ props.index + 1 }}
    </template>

    <template v-slot:[`item.request_date`]="props">
      {{ $date(props.item.request_date).format('DD-MM-YYYY HH:mm') }}
    </template>

    <template v-slot:[`item.preview`]="{ item }">
      <BonusRequestPreviewButton
        :item="item"
        v-on="$listeners"
      ></BonusRequestPreviewButton>
    </template>

    <template v-slot:[`item.files`]="{ item }">
      <FilesDownload :item="item"></FilesDownload>
    </template>
  </v-data-table>
</template>

<script>
import FilesDownload from '../components/FilesDownload.vue';
import BonusRequestPreviewButton from '../components/BonusRequestPreviewButton.vue';
import RecordsShowingSelector from '../components/RecordsShowingSelector.vue';

export default {
  name: 'ApprovedBonusRequests',
  components: {
    FilesDownload,
    BonusRequestPreviewButton,
    RecordsShowingSelector,
  },
  data() {
    return {
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
      approvedBonuses: [],
    };
  },

  computed: {
    approvedBonusesHeaders() {
      //  Table headers.
      return [
        {
          text: 'ID',
          align: 'start',
          sortable: false,
          value: 'id',
          class: 'accent--text text-subtitle-2 text-uppercase',
        },
        {
          text: this.$t('employeeNameTranslate'),
          sortable: false,
          value: 'employee_name',
          class: 'accent--text text-subtitle-2 text-uppercase',
        },
        {
          text: this.$t('personalIdCode'),
          sortable: false,
          value: 'personal_id_code',
          class: 'accent--text text-subtitle-2 text-uppercase',
        },
        {
          text: this.$t('company'),
          value: 'company',
          class: 'accent--text text-subtitle-2 text-uppercase',
        },
        {
          text: this.$t('employeeTypeText'),
          sortable: false,
          value: 'employee_type',
          class: 'accent--text text-subtitle-2 text-uppercase',
        },
        {
          text: this.$t('date'),
          value: 'request_date',
          class: 'accent--text text-subtitle-2 text-uppercase',
        },
        {
          text: this.$t('bonusClaimTranslate'),
          value: 'bonus_claim',
          class: 'accent--text text-subtitle-2 text-uppercase',
        },
        {
          text: this.$t('files'),
          sortable: false,
          value: 'files',
          class: 'accent--text text-subtitle-2 text-uppercase',
        },
        {
          text: this.$t('previewTranslate'),
          sortable: false,
          value: 'preview',
          class: 'accent--text text-subtitle-2 text-uppercase',
          align: 'center',
        },
      ];
    },
  },

  created() {
    this.fetchApprovedBonusRequests();
  },

  methods: {
    fetchApprovedBonusRequests() {
      // fetches all bonus requests pending approval.
      this.loading = true;
      this.$http
        .get('/bms/api/employees/bonus/requests/?pending_approval=False')
        .then((result) => {
          let results = result.data.map((bonus_request) => {
            return {
              id: bonus_request.id,
              approval_code: bonus_request.request_code,
              employee_name: bonus_request.employee_name,
              employee_type: bonus_request.employee_type,
              personal_id_code: bonus_request.employee_name,
              company: bonus_request.employee_company,
              request_date: bonus_request.requested_at,
              bonus_claim: bonus_request.bonus_name,
              files: bonus_request.approval_requests[0].links,
            };
          });
          this.approvedBonuses = results;
        })
        .catch((err) => {
          throw err;
        })
        .finally(() => (this.loading = false));
    },
  },
};
</script>

<style lang="scss" scoped></style>
