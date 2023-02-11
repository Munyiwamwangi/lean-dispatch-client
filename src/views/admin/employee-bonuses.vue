<template>
  <div>
    <v-navigation-drawer v-model="filterDrawer" app right width="320">
      <v-form class="pa-4">
        <h6 class="text-h6 text-capitalize">{{ $t('bonusesFilterText') }}</h6>

        <v-row no-gutters>
          <v-col>
            <p class="text-subtitle-2">{{ $t('company') }}</p>
            <v-autocomplete
              v-model="filterCompany"
              :items="filterCompanies"
              label="Company"
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
        <v-row no-gutters>
          <v-col>
            <p class="text-subtitle-2">{{ $t('bonusStatusTranslation') }}</p>
            <v-select
              v-model="filterStatus"
              :items="statuses"
              :label="$t('bonusStatusTranslation')"
              item-text="name"
              item-value="value"
              dense
              outlined
              rounded
              clearable
              open-on-clear
            ></v-select>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-btn text rounded @click="closeFilterSidebar">
              {{ $t('cancelButtonText') }}
            </v-btn>
          </v-col>
          <v-col>
            <v-btn color="accent" rounded @click="clear">
              {{ $t('clearButtonText') }}
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-navigation-drawer>
    <v-toolbar color="#f8f8f8" dense>
      <v-btn text icon @click="$router.replace('/bonus/tracker')">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-toolbar-title class="secondary--text text-subtitle-2 text-capitalize">
        {{ $t('employeeDetails') }}
      </v-toolbar-title>
    </v-toolbar>
    <v-toolbar light elevation="1" dense>
      <v-toolbar-title class="text-subtitle-2">
        {{ $t('bonusTextTranslate') }}: {{ employeeBonusesCount }}
      </v-toolbar-title>

      <v-spacer></v-spacer>
    </v-toolbar>

    <v-container fluid>
      <EmployeeDetailsCard :employee="employee"></EmployeeDetailsCard>
      <v-data-table
        :headers="headers"
        :items="filteredEmployeeBonuses"
        :items-per-page="itemPerPage.value"
        :footer-props="{
          itemsPerPageOptions: itemsPerPage,
        }"
        group-by="package.name"
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

        <template v-slot:top>
          <v-toolbar flat>
            <v-btn small color="primary" elevation="2" @click="assignBonus()">
              {{ $t('assignBonusButtonText') }}
              <v-icon right dark>mdi-plus</v-icon>
            </v-btn>

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
          <v-dialog
            v-model="assignBonusDialog"
            persistent
            max-width="640"
            close-delay="2000"
            :fullscreen="$vuetify.breakpoint.mobile"
          >
            <v-card>
              <v-card-title>
                <span class="text-h6 accent--text">Assign Bonus</span>
              </v-card-title>

              <v-card-text>
                <v-row>
                  <v-col>
                    <p class="text-subtitle-2 mb-0 text-capitalize">
                      {{ $t('nameText') }}:
                      {{ employee.first_name + ' ' + employee.last_name }}
                    </p>
                  </v-col>
                  <v-col>
                    <p class="text-subtitle-2 mb-0 text-capitalize">
                      {{ $t('personalIdCodeText') }}:
                      {{ employee.personal_id }}
                    </p>
                  </v-col>
                </v-row>
              </v-card-text>

              <v-card-text>
                <p class="text-subtitle-2 mb-2 text-capitalize">
                  {{ $t('company') }}
                </p>
                <v-autocomplete
                  v-model="bonusAssigned.companies"
                  :items="companies"
                  item-text="name"
                  item-value="id"
                  :label="$t('company')"
                  outlined
                  rounded
                  multiple
                  small-chips
                  deletable-chips
                  cache-items
                  hide-selected
                  :no-data-text="$t('noCompanyFound')"
                  return-object
                  class="text-capitalize"
                  dense
                >
                </v-autocomplete>

                <v-row no-gutters>
                  <v-col>
                    <p class="text-subtitle-2 mb-2 text-capitalize">
                      {{ $t('bonusPackages') }}
                    </p>
                    <v-autocomplete
                      v-model="packageToAssign"
                      :items="filteredPackages"
                      item-text="name"
                      item-value="id"
                      :label="$t('bonusPackageText')"
                      :no-data-text="$t('noPackagesFound')"
                      :messages="$t('selectCompanyToPopulateTheFieldText')"
                      outlined
                      rounded
                      return-object
                      class="text-capitalize"
                      dense
                    >
                    </v-autocomplete>
                  </v-col>
                </v-row>

                <v-row no-gutters>
                  <v-col>
                    <p class="text-subtitle-2 mb-2 text-capitalize">
                      {{ $t('bonusClaimTranslate') }}
                    </p>
                    <v-autocomplete
                      v-model="bonusAssigned.bonuses"
                      :items="filteredBonuses"
                      item-text="description"
                      item-value="id"
                      :label="$t('bonusClaimText')"
                      :messages="$t('selectPackageToPopulateTheFieldText')"
                      outlined
                      rounded
                      multiple
                      return-object
                      :no-data-text="$t('noBonusesAreFoundOnSelectedPackage')"
                      class="text-capitalize"
                      dense
                    >
                      <template v-slot:prepend-item>
                        <v-list-item
                          ripple
                          @mousedown.prevent
                          @click="toggleSelectAllBonuses"
                        >
                          <v-list-item-action>
                            <v-icon
                              :color="
                                bonusAssigned.bonuses.length > 0
                                  ? 'indigo darken-4'
                                  : ''
                              "
                            >
                              {{ icon }}
                            </v-icon>
                          </v-list-item-action>
                          <v-list-item-content>
                            <v-list-item-title class="text-capitalize">
                              {{ $t('selectAllButtonText') }}
                            </v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                        <v-divider class="mt-2"></v-divider>
                      </template>
                      <template v-slot:selection="{ item, index }">
                        <v-chip v-if="index < 2" small>
                          <span>{{ item.description }}</span>
                        </v-chip>
                        <span
                          v-if="index === 2"
                          class="grey--text text-caption"
                        >
                          (+{{ bonusAssigned.bonuses.length - 2 }} others)
                        </span>
                      </template>
                      <template v-slot:default="{ active, item, attrs, on }">
                        <v-list-item v-bind="attrs" v-on="on">
                          <v-list-item-action>
                            <v-checkbox :input-value="active"></v-checkbox>
                          </v-list-item-action>
                          <v-list-item-content>
                            <v-list-item-title>
                              <v-row no-gutters align="center">
                                <span>{{ item.description }}</span>
                                <v-spacer></v-spacer>
                              </v-row>
                            </v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </template>
                    </v-autocomplete>
                  </v-col>
                </v-row>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="accent"
                  text
                  rounded
                  @click="closeBonusAssignDialog"
                >
                  {{ $t('cancelButtonText') }}
                </v-btn>
                <v-btn color="accent" rounded @click="postEmployeeBonus">
                  {{ $t('submitButtonText') }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card class="text-center">
              <v-card-text class="py-4">
                <v-icon color="secondary" dark size="64">
                  mdi-alert-outline
                </v-icon>
              </v-card-text>
              <v-card-text class="text-h6">
                {{ $t('deleteEmployeeBonusTextTranslate') }}
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="accent darken-1" text @click="closeDelete">
                  {{ $t('cancelButtonText') }}
                </v-btn>
                <v-btn
                  color="secondary darken-1"
                  text
                  @click="deleteItemConfirm"
                >
                  {{ $t('okButtonText') }}
                </v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </template>

        <template v-slot:[`item.approved_at`]="props">
          {{ $date(props.item.approved_at).format('DD-MM-YYYY HH:mm') }}
        </template>

        <template v-slot:[`group.header`]="{ items, isOpen, toggle }">
          <th colspan="7">
            <v-icon @click="toggle">
              {{ isOpen ? 'mdi-minus' : 'mdi-plus' }}
            </v-icon>
            <span class="text-capitalize">
              {{ items[0].package.name }}
            </span>
          </th>
        </template>

        <template v-slot:[`item.id`]="props">
          {{ props.index + 1 }}
        </template>

        <template v-slot:item.status="props">
          <v-edit-dialog
            :return-value="props.item.status"
            large
            persistent
            :save-text="$t('updateTextTranslate')"
            return
            @save="updateBonusStatus(props.item)"
          >
            <template v-slot:default>
              <v-btn
                v-if="props.item.status"
                small
                color="warning"
                elevation="0"
              >
                {{ $t('claimedButtontext') }}
              </v-btn>
              <v-btn v-else small color="secondary" elevation="0">
                {{ $t('activeButtonText') }}
              </v-btn>
            </template>
            <template v-slot:input>
              <div class="mt-4 text-h6">
                {{ $t('updateBonusStatusText') }}
              </div>
              <v-select
                v-model="props.item.status"
                :items="statuses"
                item-text="name"
                item-value="value"
                :label="$t('bonusStatusTranslation')"
                dense
                outlined
                rounded
                hide-details
                autofocus
                class="mt-2"
              >
              </v-select>
            </template>
          </v-edit-dialog>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon small color="red" @click="deleteItem(item)">
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>
      <v-snackbar
        v-model="feedbackSnack"
        :timeout="5000"
        :color="feedbackSnackColor"
        shaped
        app
        top
      >
        {{ feedbackSnackText }}

        <template v-slot:action="{ attrs }">
          <v-btn v-bind="attrs" text @click="feedbackSnack = false">
            {{ $t('closeButtonText') }}
          </v-btn>
        </template>
      </v-snackbar>
    </v-container>

  </div>
</template>

<style scoped>
.v-select__selections input {
  display: none;
}
</style>

<script>
import EmployeeDetailsCard from '../../components/EmployeeDetailsCard.vue';
import FilterMixin from '../../mixins/filterMixins';
export default {
  name: 'EmployeeBonuses',
  components: { EmployeeDetailsCard },
  mixins: [FilterMixin],

  data: () => ({
    drawer: null,

    filterDrawer: false,
    assignBonusDialog: false,
    dateDialog: false,
    dialogDelete: false,
    filterDateRange: [],
    loading: false,
    errored: false,
    submitting: false, // toggles progress bar when a user assigns a bonus to employee
    submitErrored: false,
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
    feedbackSnack: false,
    feedbackSnackColor: '',
    feedbackSnackText: '',
    employeeBonuses: [],

    // employee bonus edit related data
    employeeBonusIndex: -1,
    employeeBonusEdited: {},

    // bonus update dialog related
    statuses: [
      { name: 'Claimed', value: true },
      { name: 'Unclaimed', value: false },
    ],
    bonusAssigned: {
      companies: [],
      bonuses: [],
      status: true,
    },

    defaultBonusAssigned: {
      companies: [],
      bonuses: [],
      status: true,
    },

    packageToAssign: {},

    // API related data
    companies: [],
    packages: [],
    bonuses: [],
    employeeId: null,

    // employee object
    employee: {},
    employeeName: '',

    // sidebar filter
    filterCompany: '',
    filterBonusCode: '',
    filterStatus: null,
  }),

  computed: {
    // compute headers to translate them
    headers() {
      // bonuses table related data.
      return [
        {
          text: 'ID',
          align: 'start',
          sortable: false,
          value: 'id',
          class: 'accent--text text-subtitle-2 text-uppercase',
        },
        {
          text: this.$t('bonusCodeTranslate'),
          sortable: false,
          value: 'bonus_code',
          class: 'accent--text text-subtitle-2 text-uppercase',
        },
        {
          text: this.$t('company'),
          sortable: false,
          value: 'company',
          class: 'accent--text text-subtitle-2 text-uppercase',
        },
        {
          text: this.$t('bonusClaimTranslate'),
          sortable: false,
          value: 'description',
          class: 'accent--text text-subtitle-2 text-uppercase',
        },
        {
          text: this.$t('date'),
          sortable: false,
          value: 'approved_at',
          class: 'accent--text text-subtitle-2 text-uppercase',
        },
        {
          text: this.$t('bonusStatusTranslation'),
          sortable: false,
          value: 'status',
          class: 'accent--text text-subtitle-2 text-uppercase',
        },
        {
          text: this.$t('tableActionsHeaderText'),
          sortable: false,
          value: 'actions',
          class: 'accent--text text-subtitle-2 text-uppercase',
        },
      ];
    },

    // assign bonuses filter
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
    filteredBonuses() {
      // get bonuses by the selected company
      let filteredBonuses = this.bonuses.filter((bonus) =>
        this.bonusAssigned.companies.some(
          (company) => company.name === bonus.company.name
        )
      );
      // Get bonuses from the selected package
      let packageBonuses = filteredBonuses.filter(
        (bonus) => bonus.package.name === this.packageToAssign.name
      );
      return packageBonuses;
    },

    // Side filter
    filterCompanies() {
      return this.employeeBonuses.map((bonus) => bonus.company);
    },

    filterBonusCodes() {
      return this.employeeBonuses.map((bonus) => bonus.bonus_code);
    },

    filteredEmployeeBonuses() {
      let conditions = [];

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
        return this.employeeBonuses.filter((bonus) => {
          return conditions.every((condition) => {
            return condition(bonus);
          });
        });
      }

      return this.employeeBonuses;
    },

    employeeBonusesCount() {
      return this.employeeBonuses.length;
    },

    selectedAllBonuses() {
      return this.bonusAssigned.bonuses.length === this.filteredBonuses.length;
    },
    selectedSomeBonuses() {
      return this.bonusAssigned.bonuses.length > 0 && !this.selectedAllBonuses;
    },
    icon() {
      if (this.selectedAllBonuses) return 'mdi-close-box';
      if (this.selectedSomeBonuses) return 'mdi-minus-box';
      return 'mdi-checkbox-blank-outline';
    },
  },

  watch: {
    assignBonusDialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },

    // call again the method if the route changes
    $route: 'fetchEmployeeBonuses',

    filteredBonuses(val) {
      this.bonusAssigned.bonuses = val;
    },
  },

  mounted() {
    this.fetchEmployee();
  },

  created() {
    // fetch the data when the view is created and the data is
    // already being observed
    this.fetchEmployeeBonuses();
    this.fetchCompanies();
    this.fetchPackages();
    this.fetchBonuses();
  },

  methods: {
    assignBonus() {
      // this.bonusIndex = this.employees.indexOf(employee);
      //this.assignBonus = Object.assign({}, employee);
      this.assignBonusDialog = true;
    },

    deleteItem(item) {
      this.itemToDelete = Object.assign({}, item);
      this.itemToDeleteIndex = this.itemToDelete.id;
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.deleteBonus();
      this.employeeBonuses.splice(this.itemToDelete, 1);
      this.closeDelete();
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.itemToDelete = Object.assign({}, this.defaultItem);
        this.itemToDeleteIndex = -1;
      });
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedBonus = Object.assign({}, this.defaultBonus);
        this.editedBonusIndex = -1;
      });
    },

    closeBonusAssignDialog() {
      this.assignBonusDialog = false;
      this.$nextTick(() => {
        this.bonusAssigned = Object.assign({}, this.defaultBonusAssigned);
      });
    },

    updateBonusStatus(item) {
      this.feedbackSnack = true;
      this.feedbackSnackColor = 'info';
      this.feedbackSnackText = 'Updating...';
      this.employeeBonusEdited = Object.assign({}, item);
      this.employeeBonusIndex = this.employeeBonusEdited.id;
      this.updateEmployeeBonusStatus();
    },

    // select all bonuses toggle
    toggleSelectAllBonuses() {
      this.$nextTick(() => {
        if (this.selectedAllBonuses) {
          this.bonusAssigned.bonuses = [];
        } else {
          this.bonusAssigned.bonuses = this.filteredBonuses.slice();
        }
      });
    },

    // TODO: Revist actions that happend after the submit
    postEmployeeBonus() {
      this.feedbackSnack = true;
      this.feedbackSnackColor = 'info';
      this.feedbackSnackText = 'Submitting...';
      this.assignEmployeeBonuses();
      this.closeBonusAssignDialog();
    },

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

    // API call methods to somewhere else.
    // get employee bonuses
    fetchEmployeeBonuses() {
      this.loading = true;
      const id = this.$route.params.id;

      this.$http
        .get(`bms/api/employees/${id}/bonuses/`)
        .then((res) => {
          let bonusesResponse = res.data.map((item) => {
            return {
              id: item.id,
              bonus_id: item.bonus.id,
              bonus_code: item.bonus.bonus_id,
              company: item.bonus.company.name,
              description: item.bonus.description,
              package: item.bonus.package,
              status: item.activated,
            };
          });

          this.employeeBonuses = bonusesResponse; // bonuses of employee under view.
        })
        .catch((err) => {
          this.submitErrored = true;
          throw err;
        })
        .finally(() => (this.loading = false));
    },

    // fetch companies
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

    // get all packages
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

    fetchEmployee() {
      const id = this.$route.params.id;
      this.$http
        .get(`bms/api/employees/${id}/`)
        .then((res) => {
          this.employee = res.data;
        })
        .catch((err) => {
          throw err;
        });
    },

    // assingn employee bonuses.
    assignEmployeeBonuses() {
      this.submitting = true;

      let employee_bonuses = this.bonusAssigned.bonuses.map((bonus) => {
        return {
          employee: this.$route.params.id,
          bonus: bonus.id,
        };
      });

      // convert employee bonuses array to object.
      let data = Object.assign({}, employee_bonuses);

      this.$http
        .post('bms/api/employee/bonus/', data)
        .then((res) => {
          if (res.status === 201) {
            this.feedbackSnack = true;
            this.feedbackSnackColor = 'success';
            this.feedbackSnackText = 'Bonus(es) assigned to employee.';
            this.refreshBonusesList();
          }
        })
        .catch((err) => {
          this.feedbackSnack = true;
          this.feedbackSnackColor = 'red';
          this.feedbackSnackText = 'Bonus assignment failed.';
          throw err;
        })
        .finally(() => (this.submitting = false));
    },

    // update employee bonus status
    updateEmployeeBonusStatus() {
      let data = {
        activated: this.employeeBonusEdited.status,
      };

      const id = this.employeeBonusIndex;

      this.$http
        .patch(`bms/api/employees/bonuses/${id}/`, data)
        .then((res) => {
          if (res.status === 200) {
            this.feedbackSnack = true;
            this.feedbackSnackColor = 'success';
            this.feedbackSnackText = 'Status updated!';
            this.refreshBonusesList();
          }
        })
        .catch((err) => {
          this.feedbackSnack = true;
          this.feedbackSnackColor = 'red';
          this.feedbackSnackText = 'Status update failed!';
          throw err;
        })
        .finally(() => {
          this.employeeBonusIndex = -1;
          this.employeeBonusEdited = {};
        });
    },

    deleteBonus() {
      const id = this.itemToDeleteIndex;

      this.$http
        .delete(`bms/api/employees/bonuses/${id}/`)
        .then((res) => {
          if (res.status === 204) {
            this.feedbackSnack = true;
            this.feedbackSnackColor = 'success';
            this.feedbackSnackText = 'Employee Bonus removed!';
          }
        })
        .catch((err) => {
          this.feedbackSnack = true;
          this.feedbackSnackColor = 'red';
          this.feedbackSnackText = 'Something went wrong.!';
          throw err;
        });
    },

    refreshBonusesList() {
      this.fetchEmployeeBonuses();
    },
  },
};
</script>
