<template>
  <div>
    <v-toolbar color="#f8f8f8" dense>
      <v-toolbar-title class="secondary--text text-subtitle-2 text-capitalize">
        {{ $t('employee') }} {{ $t('bonusTracker') }}
      </v-toolbar-title>
    </v-toolbar>
    <v-navigation-drawer v-model="filterDrawer" app right width="320">
      <v-form class="pa-4">
        <h6 class="text-h6 text-capitalize">
          {{ $t('employeesFilterText') }}
        </h6>
        <v-row no-gutters>
          <v-col>
            <p class="text-subtitle-2 text-capitalize">{{ $t('company') }}</p>
            <v-autocomplete
              v-model="filterCompany"
              :items="companies"
              :label="$t('company')"
              item-text="name"
              item-value="name"
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
            <p class="text-subtitle-2">{{ $t('hireDateRangeText') }}</p>
            <v-menu
              ref="dateDialog"
              v-model="dateDialog"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="filterDateRangeText"
                  :label="$t('hireDateRangeText')"
                  dense
                  readonly
                  rounded
                  outlined
                  append-icon="mdi-calendar"
                  v-bind="attrs"
                  clearable
                  open-on-clear
                  v-on="on"
                  @click:clear="filterDateRange = []"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="filterDateRange"
                range
                header-color="accent"
                color="secondary"
              >
                <v-spacer></v-spacer>
                <v-btn text color="accent" @click="dateDialog = false">
                  Cancel
                </v-btn>
                <v-btn
                  text
                  color="accent"
                  @click="$refs.dateDialog.save(filterDateRange)"
                >
                  OK
                </v-btn>
              </v-date-picker>
            </v-menu>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col>
            <p class="text-subtitle-2">{{ $t('employeeTypeText') }}</p>
            <v-select
              v-model="filterEmployeeType"
              :items="employeeTypes"
              :label="$t('employeeTypeText')"
              dense
              outlined
              rounded
              clearable
              open-on-clear
            ></v-select>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col>
            <p class="text-subtitle-2">{{ $t('employeeNameTranslate') }}</p>
            <v-autocomplete
              v-model="filterEmployeeName"
              :items="filterEmployees"
              :label="$t('employeeNameTranslate')"
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
    <v-tabs v-model="tab">
      <v-tooltip top color="primary">
        <template v-slot:activator="{ on, attrs }">
          <v-tab v-bind="attrs" v-on="on">
            <v-badge
              v-if="allEmployees.length > 0"
              color="primary"
              :content="allEmployees.length"
            >
              {{ $t('allEmployeesTranslation') }}
            </v-badge>
            <span v-else> {{ $t('allEmployeesTranslation') }} </span>
          </v-tab>
        </template>
        <span class="text-capitalize">{{
          $t('employeesWithBonusesText')
        }}</span>
      </v-tooltip>

      <v-tooltip top color="primary">
        <template v-slot:activator="{ on, attrs }">
          <v-tab v-bind="attrs" v-on="on">
            <v-badge
              v-if="newEmployees.length > 0"
              color="secondary"
              :content="newEmployees.length"
            >
              {{ $t('newEmployeesTranslation') }}
            </v-badge>
            <span v-else> {{ $t('newEmployeesTranslation') }} </span>
          </v-tab>
        </template>
        <span class="text-capitalize">{{
          $t('employeesWithoutBonusesText')
        }}</span>
      </v-tooltip>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item v-for="tabItem in tabData" :key="tabItem.id">
        <v-container fluid>
          <v-data-table
            v-model="bonusAssigned.employees"
            :headers="headers"
            :items="filteredEmployeeList"
            :items-per-page="itemPerPage.value"
            :footer-props="{
              itemsPerPageOptions: itemsPerPage,
            }"
            class="elevation-1"
            :loading="loading"
            :loading-text="$t('dataLoadingText')"
            :no-data-text="$t('noDataTextForTables')"
            show-select
            fixed-header
            height="500"
          >
            <template slot="progress">
              <v-progress-linear
                color="secondary"
                indeterminate
              ></v-progress-linear>
            </template>
            <template slot="top">
              <v-toolbar flat>
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

                <v-btn icon @click.stop="filterDrawer = !filterDrawer">
                  <v-icon>mdi-filter-variant</v-icon>
                </v-btn>
              </v-toolbar>
            </template>
            <template slot="header.data-table-select">
              <v-row
                no-gutters
                align="center"
                justify="center"
                class="flex-nowrap"
              >
                <v-col>
                  <v-simple-checkbox
                    v-model="allSelected"
                    :ripple="false"
                    :disabled="employees.length === 0"
                    @click="selectAllEmployees"
                  ></v-simple-checkbox>
                </v-col>
                <v-col>
                  <v-menu top offset-x :disabled="employees.length === 0">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        color="primary"
                        small
                        icon
                        v-bind="attrs"
                        :disabled="employees.length === 0"
                        v-on="on"
                      >
                        <v-icon color="accent">mdi-menu-down</v-icon>
                      </v-btn>
                    </template>

                    <v-list dense>
                      <v-list-item link @click="selectAllEmployees">
                        {{ $t('allButtonText') }}
                      </v-list-item>
                      <v-list-item
                        class="text-capitalize"
                        :disabled="bonusAssigned.employees.length === 0"
                        link
                        @click="launchAssignBonusDialog"
                      >
                        {{ $t('assignBonusButtonText') }}
                      </v-list-item>
                      <v-list-item
                        :disabled="bonusAssigned.employees.length === 0"
                        link
                        @click="launchDeactivationDialog"
                      >
                        {{ $t('deactivateAccountTextTranslate') }}
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-col>
              </v-row>
            </template>

            <template #[`item.id`]="props">
              {{ props.index + 1 }}
            </template>

            <template #[`item.bonus_claim`]="{ item }">
              <router-link
                :to="{ name: 'hr-employee-bonuses', params: { id: item.id } }"
              >
                {{ item.bonus_claim }}
              </router-link>
            </template>
            <template v-slot:[`item.preview`]="{ item }">
              <v-btn
                icon
                color="primary"
                :to="{ name: 'hr-employee-bonuses', params: { id: item.id } }"
              >
                <v-icon>mdi-eye-outline</v-icon>
              </v-btn>
            </template>
          </v-data-table>
          <v-dialog
            v-model="assignBonusDialog"
            fullscreen
            hide-overlay
            transition="dialog-bottom-transition"
            close-delay="1000"
          >
            <v-card>
              <v-toolbar dark color="accent">
                <v-btn icon dark @click="dismissAssignBonusDialog">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-toolbar-title>
                  {{ $t('bonusAssignmentTextTranslate') }}
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items>
                  <v-btn dark text @click="postEmployeeBonus">
                    {{ $t('saveButtonText') }}
                  </v-btn>
                </v-toolbar-items>
              </v-toolbar>

              <v-card-title>
                <span class="text-h6 accent--text">{{
                  $t('assignBonusButtonText')
                }}</span>
              </v-card-title>

              <v-card-text>
                <v-row>
                  <v-col>
                    <p class="text-subtitle-2 mb-2 text-capitalize">
                      {{ $t('company ') }}
                    </p>
                    <v-autocomplete
                      v-model="bonusAssigned.companies"
                      :items="companies"
                      item-text="name"
                      item-value="id"
                      :label="$t('company')"
                      dense
                      outlined
                      rounded
                      multiple
                      :no-data-text="$t('noCompanyFound')"
                      return-object
                    >
                    </v-autocomplete>
                  </v-col>
                  <v-divider
                    v-if="$vuetify.breakpoint.mdAndUp"
                    vertical
                  ></v-divider>
                  <v-col>
                    <p class="text-subtitle-2 mb-2">
                      {{ $t('bonusPackageText') }}
                    </p>
                    <v-autocomplete
                      v-model="packagesToAssign"
                      :items="filteredPackages"
                      item-text="name"
                      item-value="id"
                      :label="$t('bonusPackageText')"
                      dense
                      outlined
                      rounded
                      multiple
                      :no-data-text="$t('noPackagesFound')"
                      return-object
                    >
                    </v-autocomplete>
                    <v-list subheader two-line>
                      <v-subheader>
                        {{ $t('selectedPackageTextTranslate') }}
                      </v-subheader>
                      <v-list-item v-for="pack in packagesToAssign" :key="pack">
                        <v-list-item-content>
                          <v-list-item-title
                            v-text="pack.name"
                          ></v-list-item-title>

                          <v-list-item-subtitle
                            v-text="pack.company"
                          ></v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </v-col>
                  <v-divider
                    v-if="$vuetify.breakpoint.mdAndUp"
                    vertical
                  ></v-divider>
                  <v-col cols="12" md="3">
                    <p class="text-subtitle-2 mb-2 text-capitalize">
                      {{ $t('bonusClaimTranslate') }}
                    </p>

                    <v-list v-if="packagesToAssign.length > 0" three-line>
                      <v-list-item
                        v-for="bonus in filteredBonuses"
                        :key="bonus.id"
                      >
                        <v-list-item-content>
                          <v-list-item-title
                            v-text="bonus.description"
                          ></v-list-item-title>

                          <v-list-item-subtitle
                            v-text="bonus.company.name"
                          ></v-list-item-subtitle>
                          <v-list-item-subtitle v-text="bonus.bonus_id">
                          </v-list-item-subtitle>
                        </v-list-item-content>
                        <v-list-item-action>
                          <v-btn icon @click="removeBonus(bonus)">
                            <v-icon color="red lighten-1"> mdi-close </v-icon>
                          </v-btn>
                        </v-list-item-action>
                      </v-list-item>
                    </v-list>
                    <span v-else>
                      {{ $t('selectaApackageToPopulateBonusesTextTranslate') }}
                    </span>
                  </v-col>
                  <v-divider v-if="$vuetify.breakpoint.mdAndUp" vertical>
                  </v-divider>
                  <v-col>
                    <p class="text-subtitle-2 mb-2 text-capitalize">
                      {{ $t('selectedEmployees') }}
                    </p>
                    <!-- <v-autocomplete
                            v-model="bonusAssigned.employees"
                            :items="employees"
                            item-text="employee_name"
                            item-value="id"
                            label="Employee Name"
                            dense
                            outlined
                            rounded
                            multiple
                            no-data-text="No employees found."
                            allow-overflow
                          >
                          </v-autocomplete> -->
                    <v-list two-line>
                      <v-list-item
                        v-for="employee in bonusAssigned.employees"
                        :key="employee.id"
                      >
                        <v-list-item-content>
                          <v-list-item-title
                            v-text="employee.employee_name"
                          ></v-list-item-title>

                          <v-list-item-subtitle
                            v-text="employee.personal_id_code"
                          ></v-list-item-subtitle>
                        </v-list-item-content>
                        <v-list-item-action>
                          <v-btn icon @click="removeEmployee(employee)">
                            <v-icon color="red lighten-1"> mdi-close </v-icon>
                          </v-btn>
                        </v-list-item-action>
                      </v-list-item>
                    </v-list>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-dialog>
          <v-dialog v-model="deleteDialog" max-width="500px">
            <v-card class="text-center">
              <v-card-text class="py-4">
                <v-icon color="warning" dark size="64">
                  mdi-alert-outline
                </v-icon>
              </v-card-text>

              <v-card-text class="text-h6">
                {{ $t('removeButtonText') }} {{ itemListCategory }}?
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="accent darken-1" text @click="closeDelete">
                  {{ $t('cancelButtonText') }}
                </v-btn>
                <v-btn
                  color="secondary darken-1"
                  text
                  @click="removeItemConfirm"
                >
                  {{ $t('removeButtonText') }}
                </v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="deactivationDialog" max-width="500px">
            <v-card class="text-center">
              <v-icon color="red" dark size="128">mdi-account-alert</v-icon>
              <v-card-text class="secondary--text text-center text-h5">
                {{ $t('deactivateEmployeeAccountText') }}
              </v-card-text>
              <v-card-subtitle>
                {{ $t('actionisIrreversibleText') }}
              </v-card-subtitle>
              <v-card-text>
                {{ $t('selectedEmployeesWillNotBeAbleToLogin') }}
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="red darken-1"
                  text
                  @click="launchConfirmDeactivationDialog"
                >
                  {{ $t('proceedButtonText') }}
                </v-btn>
                <v-btn
                  color="accent--text"
                  text
                  @click="dismissDeactivationDialog"
                >
                  {{ $t('cancelButtonText') }}
                </v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-dialog v-model="confirmDeactivationDialog" max-width="400px">
            <v-card class="text-center">
              <v-card-text>
                <v-icon color="info" dark size="64">
                  mdi-information-outline
                </v-icon>
              </v-card-text>
              <v-card-text class="info--text text-center text-h5">
                {{ $t('areYouSureText') }}
              </v-card-text>
              <v-card-subtitle>
                {{ $t('employeeAccountsWillBeDeactivatedText') }}
              </v-card-subtitle>
              <v-card-text>
                {{ $t('selctedEmployeeesAndBonuseWillBeDiscontinued') }}
                <div class="d-flex justify-center">
                  <v-checkbox
                    v-model="agreed"
                    :rules="[(v) => !!v || this.$t('youMustConfirmToContinue')]"
                    :label="$t('doYouWishToProceedText')"
                    required
                  ></v-checkbox>
                </div>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  :disabled="!agreed"
                  color="red darken-1"
                  text
                  @click="initiateUserAccountsDeactivation"
                >
                  {{ $t('continueButtonText') }}
                </v-btn>
                <v-btn
                  color="accent--text"
                  text
                  @click="dissmissConfirmDeactivationDialog"
                >
                  {{ $t('cancelButtonText') }}
                </v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-container>
      </v-tab-item>
    </v-tabs-items>
    <v-snackbar
      v-model="bonusAssigmentStatusSnack"
      :timeout="5000"
      :color="bonusAssigmentStatusSnackColor"
      shaped
      app
      top
    >
      {{ bonusAssigmentStatusSnackText }}

      <template v-slot:action="{ attrs }">
        <v-btn v-bind="attrs" text @click="bonusAssigmentStatusSnack = false">
          {{ $t('closeButtonText') }}
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<style scoped>
.v-select__selections input {
  display: none;
}
</style>

<script>
import FilterMixin from '../../mixins/filterMixins';

export default {
  name: 'Tracker',
  mixins: [FilterMixin],

  data: () => ({
    drawer: null,

    filterDrawer: false,
    assignBonusDialog: false,
    deactivationDialog: false,
    confirmDeactivationDialog: false,
    agreed: false,
    dateDialog: false,
    deleteDialog: false,
    loading: false,
    errored: false,
    submitting: false, // toggles progress bar when a user assigns a bonus to employee
    submitErrored: false,
    success: false,
    showAlert: false,
    alertType: null,

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

    allSelected: false,

    bonusIndex: -1,
    selectedItem: 0,
    statuses: [
      { name: 'Active', value: true },
      { name: 'Inactive', value: false },
    ],

    // side drawer filter
    filterDateRange: [],
    filterCompany: '',
    filterEmployeeType: '',
    filterEmployeeName: '',

    // bonus assignment object
    bonusAssigned: {
      employees: [],
      companies: [],
      bonuses: [],
    },

    defaultBonusAssigned: {
      employees: [],
      companies: [],
      bonuses: [],
    },

    packagesToAssign: [],

    // API related data
    companies: [],
    employees: [],
    allEmployees: [],
    newEmployees: [],
    packages: [],
    bonuses: [],
    employeeTypes: [],

    // tab items
    tab: 0,
    tabData: [
      {
        id: 0,
        label: 'allEmployeesTranslation',
      },
      {
        id: 1,
        label: 'newEmployeesTranslation',
      },
    ],

    // Remove items on dialog
    removeIndex: -1,
    removeFromList: [],
    removeBonusItem: {},
    removeEmployeeItem: {},
    itemListCategory: '',
    masterData: [],

    // user feedback
    bonusAssigmentStatusSnack: false,
    bonusAssigmentStatusSnackColor: '',
    bonusAssigmentStatusSnackText: '',
  }),

  computed: {
    headers() {
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
          sortable: false,
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
          text: this.$t('bonusClaimTranslate'),
          sortable: false,
          value: 'bonus_claim',
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
    /**
     * Side bar filter related methods
     */
    filterDateRangeText() {
      return this.filterDateRange.join(' - ');
    },
    filterEmployees() {
      return this.employees.map((employee) => employee.employee_name);
    },

    /**
     * Bonus Assignment filter related methods.
     */
    filteredPackages() {
      // filter packages by the selected company/companies
      let packages = this.packages.filter((bonusPackage) =>
        this.bonusAssigned.companies.some(
          (company) => company.name === bonusPackage.company
        )
      );
      // return packages that belong to selected companies
      return packages;
    },
    // TODO: Method can be inproved to filter depending on package selected from above method. HINT: Using Watch
    filteredBonuses() {
      // Get bonuses from the selected package/package
      let packageBonuses = this.bonuses.filter((bonus) =>
        this.packagesToAssign.some(
          (bonusPackage) => bonusPackage.id === bonus.package.id
        )
      );
      return packageBonuses;
    },

    filterCompanies() {
      return this.bonuses.map((bonus) => bonus.company.name);
    },

    filterBonusCodes() {
      return this.bonuses.map((bonus) => bonus.bonus_code);
    },

    filteredEmployeeList() {
      let conditions = [];

      if (this.filterCompany) {
        conditions.push(this.filterByCompany);
      }

      if (this.filterEmployeeType) {
        conditions.push(this.filterByEmployeeType);
      }

      if (this.filterEmployeeName) {
        conditions.push(this.filterByEmployeeName);
      }

      if (this.filterDateRange) {
        conditions.push(this.filterByHireDateRange);
      }

      if (conditions.length > 0) {
        return this.employees.filter((employee) => {
          return conditions.every((condition) => {
            return condition(employee);
          });
        });
      }

      return this.employees;
    },

    filteredMasterData() {
      let conditions = [];

      if (this.filterCompany) {
        conditions.push(this.filterByCompany);
      }

      if (this.filterEmployeeType) {
        conditions.push(this.filterByEmployeeType);
      }

      if (this.filterEmployeeName) {
        conditions.push(this.filterByEmployeeName);
      }

      if (this.filterDateRange) {
        conditions.push(this.filterByHireDateRange);
      }

      if (conditions.length > 0) {
        return this.masterData.filter((employee) => {
          return conditions.every((condition) => {
            return condition(employee);
          });
        });
      }

      return this.masterData;
    },

    refreshEmployeeBonuses() {
      return this.$store.dispatch('fetchEmployeeBonuses');
    },
  },

  watch: {
    filteredEmployeeList: {
      handler() {
        this.allEmployees = this.filteredMasterData.filter(
          (employee) => employee.bonus_claim > 0
        );

        this.newEmployees = this.filteredMasterData.filter(
          (employee) => employee.bonus_claim === 0
        );
      },
      immediate: true,
    },

    launchAssignBonusDialog(val) {
      val || this.dismissAssignBonusDialog();
    },

    launchDeactivationDialog(val) {
      val || this.dismissDeactivationDialog();
    },

    launchConfirmDeactivationDialog(val) {
      val || this.dissmissConfirmDeactivationDialog();
    },

    tab(val) {
      if (val == 0) {
        this.employees = this.allEmployees;
      } else {
        this.employees = this.newEmployees;
      }
      this.bonusAssigned.employees = [];
    },

    deleteDialog(val) {
      val || this.closeDelete();
    },

    // sets bonuses to assign whenever theres a change computed
    // filter property
    /**
     * ! BUG introduced.  Selecting a different package will render the original list with all bonuses
     * ! even the ones removed before.
     *  */
    filteredBonuses(val) {
      this.bonusAssigned.bonuses = val;
    },

    // updated the topmost checkbox depending on
    // selected emloyees length.
    bonusAssigned: {
      handler: function () {
        if (this.employees.length > 0) {
          this.allSelected =
            this.bonusAssigned.employees.length == this.employees.length;
        }
      },
      deep: true,
    },
  },

  mounted() {
    const urlParams = new URLSearchParams(window.location.search);
    this.filterCompany = urlParams.get('name');
  },

  created() {
    // fetch the data when the view is created and the data is
    // already being observed
    this.fetchEmployees();
    this.fetchCompanies();
    this.fetchPackages();
    this.fetchBonuses();
  },

  methods: {
    launchAssignBonusDialog() {
      this.assignBonusDialog = true;
    },

    dismissAssignBonusDialog() {
      this.closeBonusAssignDialog();
    },

    launchConfirmDeactivationDialog() {
      this.confirmDeactivationDialog = true;
    },

    dissmissConfirmDeactivationDialog() {
      this.confirmDeactivationDialog = false;
      this.agreed = false;
      // dismiss user deactivation dialog as well.
      this.dismissDeactivationDialog();
    },

    launchDeactivationDialog() {
      this.deactivationDialog = true;
    },

    dismissDeactivationDialog() {
      this.deactivationDialog = false;
    },

    selectAllEmployees() {
      // employees selected length is not the same as employees list length
      if (this.bonusAssigned.employees.length != this.employees.length) {
        // select all
        this.bonusAssigned.employees = this.employees;
        this.allSelected = true;
      } else {
        // unselect all
        this.bonusAssigned.employees = [];
        this.allSelected = false;
      }
    },

    closeFilterSidebar() {
      // toggle filter sidebar
      this.filterDrawer = false;
    },

    // clear filters
    clear() {
      this.filterCompany = '';
      this.filterEmployeeType = '';
      this.filterEmployeeName = '';
      this.filterDateRange = [];
    },

    closeBonusAssignDialog() {
      this.assignBonusDialog = false;
      this.showAlert = false;
      this.$nextTick(() => {
        Object.assign(this.bonusAssigned, this.defaultBonusAssigned);
        this.packagesToAssign = [];
      });
    },

    removeBonus(bonus) {
      this.removeIndex = this.bonusAssigned.bonuses.indexOf(bonus);
      this.itemListCategory = 'Bonus';
      this.removeFromList = this.bonusAssigned.bonuses;
      this.deleteDialog = true;
    },

    removeEmployee(employee) {
      this.removeIndex = this.bonusAssigned.employees.indexOf(employee);
      this.itemListCategory = 'Employee';
      this.removeFromList = this.bonusAssigned.employees;
      this.deleteDialog = true;
    },

    removeItemConfirm() {
      this.removeFromList.splice(this.removeIndex, 1);
      this.closeDelete();
    },

    closeDelete() {
      this.deleteDialog = false;
      this.$nextTick(() => {
        this.removeFromList = [];
        this.removeIndex = -1;
        this.itemListCategory = '';
      });
    },

    // TODO: Revisit actions that happen after the submit
    postEmployeeBonus() {
      this.bonusAssigmentStatusSnack = true;
      this.bonusAssigmentStatusSnackColor = 'info';
      this.bonusAssigmentStatusSnackText = 'Submitting...';
      this.assignEmployeeBonuses();
      this.closeBonusAssignDialog();
    },

    initiateUserAccountsDeactivation() {
      this.bonusAssigmentStatusSnack = true;
      this.bonusAssigmentStatusSnackColor = 'info';
      this.bonusAssigmentStatusSnackText = 'Submitting...';
      this.deactivateUserAccounts();
      this.dissmissConfirmDeactivationDialog();
    },

    // TODO: Move these methods to an API service or Vuex Store
    fetchEmployees() {
      this.loading = true;
      this.employees = [];

      this.$http
        .get('bms/api/employees/')
        .then((res) => {
          let results = res.data.map((employee) => {
            return {
              id: employee.id,
              user_id: employee.user,
              employee_name: employee.first_name + ' ' + employee.last_name,
              company: employee.company.name,
              personal_id_code: employee.personal_id,
              hire_date: employee.join_date,
              bonus_claim: employee.bonuses.length,
              employee_type: employee.employee_type,
            };
          });
          // fill employee types with current employee types found.
          this.employeeTypes = results.map(
            (employee) => employee.employee_type
          );

          this.masterData = results;

          // sets all employees to emloyees with atleast one bonus
          this.allEmployees = this.employees = results.filter(
            (employee) => employee.bonus_claim > 0
          );

          // set new employee as where employee bonuses list = 0
          this.newEmployees = results.filter(
            (employee) => employee.bonus_claim === 0
          );
        })
        .catch((err) => {
          this.errored = true;
          throw err;
        })
        .finally(() => (this.loading = false));
    },

    // get all companies
    fetchCompanies() {
      this.$http
        .get('bms/api/companies/')
        .then((res) => {
          this.companies = res.data;
        })
        .catch((err) => {
          this.errored = true;
          throw err;
        })
        .finally(() => (this.loading = false));
    },

    // get packages by employee.
    fetchPackages() {
      this.$http
        .get('bms/api/packages/')
        .then((res) => {
          this.packages = res.data;
        })
        .catch((err) => {
          this.errored = true;
          throw err;
        })
        .finally(() => (this.loading = false));
    },

    // get all bonuses.
    fetchBonuses() {
      this.$http
        .get('bms/api/bonuses/')
        .then((res) => {
          this.bonuses = res.data;
        })
        .catch((err) => {
          throw err;
        });
    },

    // assingn employee bonuses.
    assignEmployeeBonuses() {
      this.submitting = true;

      let employee_bonuses = this.bonusAssigned.employees.flatMap((emp) =>
        this.bonusAssigned.bonuses.map((bonus) => {
          return {
            employee: emp.id,
            bonus: bonus.id,
          };
        })
      );

      // convert employee bonuses array to object.
      let data = Object.assign({}, employee_bonuses);

      this.$http
        .post('bms/api/employee/bonus/', data)
        .then((res) => {
          if (res.status === 201) {
            this.bonusAssigmentStatusSnack = true;
            this.bonusAssigmentStatusSnackColor = 'success';
            this.bonusAssigmentStatusSnackText =
              'Bonuses assigned to employee(s).';
            // Refresh employees list after bonus creation is successful.
            this.refreshEmployeesList();
            this.refreshEmployeeBonuses();
            this.$store.dispatch('this.fetchEmployeeBonuses');
            this.tab = 0;
          }
        })
        .catch((err) => {
          this.bonusAssigmentStatusSnack = true;
          this.bonusAssigmentStatusSnackColor = 'red';
          this.bonusAssigmentStatusSnackText = 'Bonus assignment failed.';
          throw err;
        })
        .finally(() => (this.submitting = false));
    },

    deactivateUserAccounts() {
      this.submitting = true;

      let accounts_to_delete = this.bonusAssigned.employees.flatMap((emp) => {
        return {
          id: emp.user_id,
        };
      });

      // pass user ids list as users
      let data = { users: accounts_to_delete };

      this.$http
        .patch('mmauth/api/deactivate/', data)
        .then((res) => {
          if (res.status === 200) {
            this.bonusAssigmentStatusSnack = true;
            this.bonusAssigmentStatusSnackColor = 'success';
            this.bonusAssigmentStatusSnackText = 'User accounts deactivated.';
            // Refresh employees list after bonus creation is successful.
            this.refreshEmployeesList();
            this.tab = 0;
          }
        })
        .catch((err) => {
          this.bonusAssigmentStatusSnack = true;
          this.bonusAssigmentStatusSnackColor = 'red';
          this.bonusAssigmentStatusSnackText = 'Account deactivation failed.';
          throw err;
        })
        .finally(() => (this.submitting = false));
    },

    refreshEmployeesList() {
      this.fetchEmployees();
    },
  },
};
</script>
