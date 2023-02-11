<template>
  <div>
    <v-toolbar color="#f8f8f8" dense>
      <v-toolbar-title class="secondary--text text-subtitle-2 text-capitalize">
        {{ $t('approverDashboard') }}
      </v-toolbar-title>
    </v-toolbar>
    <v-tabs v-model="tab">
      <v-tab> {{ $t('pendingApproval') }} </v-tab>
      <v-tab>
        <v-badge color="secondary">
          {{ $t('approvedBonuses') }}
        </v-badge>
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item v-for="tabItem in tabData" :key="tabItem.id">
        <v-toolbar light elevation="1" dense>
          <v-spacer></v-spacer>
          <p class="mb-0 px-2 text-caption text-capitalize">
            {{ $t('recordsTranslate') }}:
          </p>

          <v-responsive max-width="85">
            <v-select
              v-model="itemPerPage"
              item-text="text"
              item-value="value"
              :items="itemsPerPage"
              dense
              outlined
              hide-details
              solo
              flat
              return-object
            ></v-select>
          </v-responsive>
        </v-toolbar>

        <v-container fluid>
          <v-data-table
            :headers="pendingApprovalHeaders"
            :items="pendingApproval"
            :items-per-page="itemPerPage.value"
            hide-default-footer
            class="elevation-1"
            :loading="loading"
            :loading-text="$t('dataLoadingText')"
            :no-data-text="$t('noDataTextForTables')"
          >
            <template slot="progress">
              <v-progress-linear
                color="secondary"
                indeterminate
              ></v-progress-linear>
            </template>

            <template v-slot:item.id="props">
              {{ props.index + 1 }}
            </template>
          </v-data-table>
        </v-container>
      </v-tab-item>

      <v-tab-item>
        <v-toolbar light elevation="1" dense>
          <v-spacer></v-spacer>
          <p class="mb-0 px-2 text-caption text-capitalize">
            {{ $t('recordsTranslate') }}:
          </p>

          <v-responsive max-width="85">
            <v-select
              v-model="itemPerPage"
              item-text="text"
              item-value="value"
              :items="itemsPerPage"
              dense
              outlined
              hide-details
              solo
              flat
              return-object
            ></v-select>
          </v-responsive>
        </v-toolbar>
        <v-container fluid>
          <v-data-table
            :headers="approvedBonusesHeaders"
            :items="approvedBonuses"
            :items-per-page="itemPerPage.value"
            hide-default-footer
            class="elevation-1"
            :loading="loading"
            :loading-text="$t('dataLoadingText')"
            :no-data-text="$t('noDataTextForTables')"
          >
            <template slot="progress">
              <v-progress-linear
                color="secondary"
                indeterminate
              ></v-progress-linear>
            </template>

            <template v-slot:item.id="props">
              {{ props.index + 1 }}
            </template>
          </v-data-table>
        </v-container>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
export default {
  name: 'ApproverDashboard',
  data: () => ({
    loading: true,
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

    pendingApproval: [],
    approvedBonuses: [],
  }),

  computed: {
    pendingApprovalHeaders() {
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
          text: this.$t('approvalCode'),
          sortable: false,
          value: 'approval_code',
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
          sortable: false,
          value: 'company',
          class: 'accent--text text-subtitle-2 text-uppercase',
        },
        {
          text: this.$t('requestDate'),
          sortable: false,
          value: 'request_date',
          class: 'accent--text text-subtitle-2 text-uppercase',
        },
        {
          text: this.$t('bonusClaimTranslate'),
          sortable: false,
          value: 'bonus_claim',
          class: 'accent--text text-subtitle-2 text-uppercase',
          align: 'center',
        },
        {
          text: this.$t('filesCount'),
          sortable: false,
          value: 'files_count',
          class: 'accent--text text-subtitle-2 text-uppercase',
          align: 'center',
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
          text: this.$t('approvalCode'),
          sortable: false,
          value: 'approval_code',
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
          sortable: false,
          value: 'company',
          class: 'accent--text text-subtitle-2 text-uppercase',
        },
        {
          text: this.$t('requestDate'),
          sortable: false,
          value: 'request_date',
          class: 'accent--text text-subtitle-2 text-uppercase',
        },
        {
          text: this.$t('bonusClaimTranslate'),
          sortable: false,
          value: 'bonus_claim',
          class: 'accent--text text-subtitle-2 text-uppercase',
          align: 'center',
        },
        {
          text: this.$t('filesCount'),
          sortable: false,
          value: 'files_count',
          class: 'accent--text text-subtitle-2 text-uppercase',
          align: 'center',
        },
        {
          text: this.$t('bonusStatus'),
          sortable: false,
          value: 'files_count',
          class: 'accent--text text-subtitle-2 text-uppercase',
          align: 'center',
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

  created() {},

  methods: {},
};
</script>

<style lang="scss" scoped></style>
