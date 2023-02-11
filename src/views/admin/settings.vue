<template>
  <div>
    <v-navigation-drawer v-model="filterDrawer" app right width="320">
      <v-form class="pa-4">
        <h6 class="text-h6">{{ $t('bonusesFilterText') }}</h6>

        <v-row no-gutters>
          <v-col>
            <p class="text-subtitle-2">{{ $t('company') }}</p>
            <v-autocomplete
              v-model="filterCompany"
              :items="filterCompanies"
              :label="$t('company')"
              dense
              outlined
              rounded
              clearable
              open-on-clear
            ></v-autocomplete>
          </v-col>
        </v-row>

        <v-row no-gutters>
          <v-col>
            <p class="text-subtitle-2">{{ $t('bonusCodeTranslate') }}</p>
            <v-autocomplete
              v-model="filterBonusCode"
              :items="filterBonusCodes"
              :label="$t('bonusCodeTranslate')"
              dense
              outlined
              rounded
              clearable
              open-on-clear
            ></v-autocomplete>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-btn
              class="text-capitalize"
              text
              rounded
              @click="closeFilterSidebar"
            >
              {{ $t('cancelButtonText') }}
            </v-btn>
          </v-col>
          <v-col>
            <v-btn
              class="text-capitalize"
              color="accent"
              rounded
              @click="clear"
            >
              {{ $t('clearButtonText') }}
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-navigation-drawer>
    <v-toolbar color="#f8f8f8" dense elevation="1">
      <v-toolbar-title class="secondary--text text-subtitle-2 text-capitalize">
        {{ $t('settings') }}
      </v-toolbar-title>
    </v-toolbar>
    <v-tabs>
      <v-tab>{{ $t('bonusesTranslate') }}</v-tab>
      <v-tab>{{ $t('bonusPackages') }}</v-tab>
      <v-tab>{{ $t('welcomeMessage') }}</v-tab>

      <!-- bonuses -->
      <v-tab-item>
        <SettingsBonusesListTable
          :bonuses="filteredBonuses"
          :filter-drawer.sync="filterDrawer"
          :loading="loadingBonuses"
          :packages="packages"
          @show-feedback="showFeedback"
        >
        </SettingsBonusesListTable>
      </v-tab-item>

      <!-- create package section  -->
      <v-tab-item>
        <SettingsPackagesListTable
          :loading="loadingPackages"
          :packages="filteredPackages"
          :companies="companies"
          :filter-drawer.sync="filterDrawer"
          @show-feedback="showFeedback"
        ></SettingsPackagesListTable>
      </v-tab-item>
      <!-- end create package section  -->

      <!-- Welcome message section -->
      <v-tab-item>
        <SettingsWelcomeMessage @show-feedback="showFeedback">
        </SettingsWelcomeMessage>
      </v-tab-item>
      <!-- end welcome message section -->
    </v-tabs>

    <FeedbackSnackBar
      :show-snack.sync="feedbackSnackShowing"
      :snack-text="feedbackSnackText"
      :snack-color="feedbackSnackColor"
    ></FeedbackSnackBar>
    <!-- snackbar  -->
  </div>
</template>

<style scoped>
.v-select__selections input {
  display: none;
}
</style>

<script>
import FeedbackSnackBar from '@/components/FeedbackSnackBar';
import SettingsBonusesListTable from '../../components/SettingsBonusesListTable.vue';
import SettingsPackagesListTable from '../../components/SettingsPackagesListTable.vue';

import { mapGetters } from 'vuex';
import SettingsWelcomeMessage from '../../components/SettingsWelcomeMessage.vue';
import FilterMixin from '../../mixins/filterMixins';

export default {
  name: 'HrSettings',
  components: {
    FeedbackSnackBar,
    SettingsBonusesListTable,
    SettingsPackagesListTable,
    SettingsWelcomeMessage,
  },
  mixins: [FilterMixin],
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

  computed: {
    ...mapGetters('bonuses', {
      bonuses: 'allBonuses',
      loadingBonuses: 'loadingBonuses',
    }),

    ...mapGetters('packages', {
      packages: 'allPackages',
      loadingPackages: 'loadingPackages',
    }),

    ...mapGetters({ companies: 'allCompanies' }),

    filteredBonuses() {
      let conditions = [];

      // TODO: Reduce function complexity by reducing the number of ifs.

      if (this.filterCompany) {
        conditions.push(this.filterByCompany);
      }

      if (this.filterBonusCode) {
        conditions.push(this.filterByBonusCode);
      }

      if (this.filterStatus) {
        conditions.push(this.filterByStatus);
      }

      if (conditions.length > 0) {
        return this.bonuses.filter((bonus) => {
          return conditions.every((condition) => {
            return condition(bonus);
          });
        });
      }

      return this.bonuses;
    },

    filteredPackages() {
      let conditions = [];

      // TODO: Reduce function complexity by reducing the number of ifs.

      if (this.filterCompany) {
        conditions.push(this.filterByCompany);
      }

      if (conditions.length > 0 && this.packages.length > 0) {
        return this.packages.filter((_package) => {
          return conditions.every((condition) => {
            return condition(_package);
          });
        });
      }

      return this.packages;
    },

    filterBonusCodes() {
      return this.bonuses.map((bonus) => bonus.bonus_code);
    },

    filterCompanies() {
      return this.companies.map((company) => company.name);
    },

    // filter companies
    filteredCompaniesList() {
      let conditions = [];

      if (this.filterCompany) {
        conditions.push(this.filterByCompany);
      }

      if (this.filterByBonusCode) {
        conditions.push(this.filterByEmployeeName);
      }

      if (conditions.length > 0) {
        return this.bonuses.filter((bonus) => {
          return conditions.every((condition) => {
            return condition(bonus);
          });
        });
      }

      return this.companies;
    },
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

    closeFilterSidebar() {
      // toggle filter sidebar and clear filters;
      this.filterDrawer = false;
    },

    // clear filters
    clear() {
      this.filterCompany = '';
      this.filterBonusCode = '';
      this.filterStatus = null;
    },

    // API Call Methods
    fetchCompanyBonuses() {
      const id = this.$route.params.id;

      this.$http
        .get(`bms/api/bonuses/company/${id}/`)
        .then((res) => {
          this.companies = res.data;
        })
        .catch((err) => {
          this.errored = true;
          throw err;
        });
    },

    /**
     * status -> fail, submitting, success.
     */
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
