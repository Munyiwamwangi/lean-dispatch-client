<template>
  <v-container fluid>
    <v-data-table
      v-model="allSelectedUsers"
      :headers="employeeTableHeaders"
      :items="allEmployees"
      :search="searchTerm"
      :items-per-page="itemPerPage.value"
      :loading="loading"
      :loading-text="$t('dataLoadingText')"
      :no-data-text="$t('noDataTextForTables')"
      hide-default-footer
      class="elevation-1"
      show-select
    >
      <template slot="progress">
        <LoadingBar></LoadingBar>
      </template>

      <template v-slot:top>
        <v-row no-gutters justify="end">
          <div class="mb-2">
            <TableTopbar
              :item-per-page.sync="itemPerPage"
              :items-per-page="itemsPerPage"
            >
              <template #leading>
                <v-tooltip top color="accent">
                  <template v-slot:activator="{ on, attrs }">
                    <form enctype="multipart/form-data">
                      <!-- 1. Create the button that will be clicked to select a file -->
                      <v-btn
                        color="primary"
                        dark
                        v-bind="attrs"
                        :loading="isSelecting"
                        v-on="on"
                        @click="importEmployeeData()"
                      >
                        <v-icon size="20" class="mr-1">mdi-import</v-icon>
                        {{ $t('importText') }}
                      </v-btn>

                      <!-- Create a File Input that will be hidden but triggered with JavaScript -->
                      <input
                        ref="uploader"
                        class="d-none"
                        accept=".csv"
                        type="file"
                        @change="onFileChanged"
                      />
                    </form>
                  </template>
                  <span>Only CSV files are supported</span>
                </v-tooltip>
              </template>
              <template #trailing>
                <v-autocomplete
                  v-model="model"
                  :search-input.sync="searchTerm"
                  :items="searchResults"
                  :label="$t('searchTextTranslate')"
                  item-text="full_name"
                  item-value="user_id"
                  clearable
                  dense
                  item-color="grey"
                  hide-details="auto"
                  append-icon=""
                  prepend-inner-icon="mdi-magnify"
                  single-line
                  return-object
                  class="pl-2 increase-search-field-width"
                >
                  <template v-slot:item="data">
                    <template>
                      <v-list max-width="355px">
                        <v-list-item class="pl-0">
                          <v-list-item-avatar
                            class="elevation-1"
                            color="#eeeeee"
                            size="44"
                          >
                            <img :src="data.item.profile_pic" />
                          </v-list-item-avatar>
                          <v-list-item-content>
                            <v-list-item-title
                              >{{ data.item.full_name }}
                            </v-list-item-title>
                            <v-list-item-subtitle
                              >{{ data.item.company_email }}
                            </v-list-item-subtitle>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list>
                    </template>
                  </template>
                </v-autocomplete>
              </template>
            </TableTopbar>
          </div>
        </v-row>
      </template>

      <!-- menu dropdown  -->
      <template slot="header.data-table-select">
        <v-row
          no-gutters
          align="center"
          justify="center"
          class="flex-nowrap accent--text"
        >
          <v-col>
            <v-simple-checkbox
              v-model="allSelected"
              :ripple="false"
              class="resize mr-2 mb-3"
              indeterminate-icon="mdi - plus"
              @click="selectAllUsers"
            >
              <v-icon>mdi-check</v-icon>
            </v-simple-checkbox>
          </v-col>
          <v-col>
            <v-menu
              bottom
              offset-x
              :disabled="employees.length === 0"
              min-width="150px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  small
                  icon
                  v-bind="attrs"
                  :disabled="employees.length === 0"
                  v-on="on"
                >
                  <!-- <v-icon color="accent" class="resize">mdi-menu-down</v-icon> -->

                  <v-icon color="accent" class="resize">mdi-menu-down</v-icon>
                </v-btn>
              </template>

              <v-list dense>
                <v-list-item link @click="selectAllUsers">
                  {{ $t('allButtonText') }}
                </v-list-item>
                <v-list-item
                  :disabled="allSelectedUsers.length === 0"
                  link
                  class="text-capitalize"
                  @click="launchUserDeleteDialogFromTheMenu()"
                >
                  {{ $t('deleteButtonText') }}
                </v-list-item>
              </v-list>
            </v-menu>
          </v-col>
        </v-row>
      </template>
      <!-- ids  -->
      <template #[`item.id`]="props">
        {{ props.index + 1 }}
      </template>

      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small color="green" class="mr-5" @click="editItem(item)">
          mdi-pencil
        </v-icon>
        <v-icon small color="red" @click="launchEmployeeDeleteDialog(item)">
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>

    <!-- edit employee -->
    <v-dialog v-model="dialog" max-width="750" close-delay="2000" persistent>
      <v-card>
        <v-container>
          <v-card-title>
            <span class="text-h6 accent--text text-center text-capitalize">
              {{ formTitle }} : {{ this.editedItem.employeeName }}
            </span>
          </v-card-title>

          <v-card-text>
            <v-row>
              <v-col>
                <p class="text-subtitle-2 mb-0 text-capitalize accent--text">
                  Id: {{ editedItem.id }}
                </p>
              </v-col>
              <v-col>
                <p class="text-subtitle-2 mb-0 text-capitalize accent--text">
                  {{ $t('personalIdCodeText') }}:
                  {{ editedItem.personalIdCode }}
                </p>
              </v-col>
            </v-row>
          </v-card-text>

          <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-row>
                <v-col cols="12" sm="6" md="6">
                  <v-text-field
                    v-model="editedItem.employeeName"
                    outlined
                    rounded
                    dense
                    label="Username"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-text-field
                    v-model="editedItem.company_email"
                    outlined
                    rounded
                    dense
                    label="Email"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-autocomplete
                    v-model="editedItem.company"
                    :items="companiesDepartments"
                    item-text="name"
                    item-value="id"
                    outlined
                    rounded
                    dense
                    :label="$t('company')"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-combobox
                    v-model="editedItem.departmentDetails"
                    :items="otherDepartments"
                    item-text="title"
                    item-value="id"
                    outlined
                    rounded
                    dense
                    label="Department"
                  ></v-combobox>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-autocomplete
                    v-model="editedItem.employee_type"
                    :items="employeeTypes"
                    item-text="name"
                    item-value="id"
                    outlined
                    rounded
                    dense
                    label="Employee Type"
                  ></v-autocomplete>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text color="accent" class="mr-4" @click="close">
              {{ $t('cancelButtonText') }}
            </v-btn>
            <v-btn color="accent" @click="editEmployee()">
              {{ $t('saveButtonText') }}
            </v-btn>
          </v-card-actions>
        </v-container>
      </v-card>
    </v-dialog>

    <!--delete user dialog -->
    <v-dialog v-model="userDeleteDialog" max-width="500px">
      <v-card class="text-center">
        <v-icon color="red" dark size="128">mdi-account-alert</v-icon>
        <v-card-text
          class="secondary--text text-center text-h5 text-capitalize"
        >
          {{ $t('deleteEmployeeAccountText') }}
        </v-card-text>
        <v-card-subtitle>
          {{ $t('actionisIrreversibleText') }}
        </v-card-subtitle>
        <v-card-text>
          {{ $t('selectedEmployeesWillNotBeAbleToLogin') }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="launchConfirmDeleteUser()">
            {{ $t('proceedButtonText') }}
          </v-btn>
          <v-btn color="accent--text" text @click="dismissUserDeleteDialog">
            {{ $t('cancelButtonText') }}
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- confirm if you want to delete employee dialog  -->
    <v-dialog v-model="confirmDeleteUserDialog" max-width="400px">
      <v-card class="text-center">
        <v-card-text>
          <v-icon color="info" dark size="64"> mdi-information-outline </v-icon>
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
            @click="deleteItem()"
          >
            {{ $t('continueButtonText') }}
          </v-btn>
          <v-btn color="accent--text" text @click="dissmissConfirmDeleteUser()">
            {{ $t('cancelButtonText') }}
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import showRecordsBy from '../../mixins/showRecordsBy';
import LoadingBar from '../LoadingBar.vue';
import TableTopbar from '../TableTopbar.vue';
import { mapActions } from 'vuex';
import { searchEmployees } from '@/services/modules/common.js';
import lodash from 'lodash';

export default {
  name: 'EmpoyeesTableComponent',
  components: {
    LoadingBar,
    TableTopbar,
  },
  mixins: [showRecordsBy],

  props: {
    employees: {
      type: Array,
      required: true,
    },
    employeeTypes: {
      type: Array,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    companies: {
      type: Array,
      required: true,
    },
    companiesDepartments: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      query: '?',
      payload: {
        query: '?',
      },

      searchTerm: '',
      searchResults: [],
      valid: true,
      model: null,
      dialog: false,
      transitionInput: false,
      editedIndex: -1,
      userDeleteDialog: false,
      confirmDeleteUserDialog: false,
      allSelectedUsers: [],
      allSelected: false,
      isSelecting: false,
      selectedFile: null,
      agreed: false,
      search: '',
      offset: 0,
      otherDepartments: [],
      editedItem: {
        id: 0,
        personalIdCode: '',
        employeeName: '',
        email: '',
        company: '',
        departmentDetails: '',
        employeeType: '',
        lastActiveDate: '',
        actions: '',
      },
      defaultItem: {
        id: 0,
        personalIdCode: '',
        employeeName: '',
        email: '',
        company: '',
        departmentDetails: '',
        employeeType: '',
        lastActiveDate: '',
        status: '',
        actions: '',
      },
    };
  },

  computed: {
    allEmployees() {
      return this.employees;
    },

    formTitle() {
      return this.editedIndex === -1 ? 'New Employee' : 'update Employee';
    },
    employeeTableHeaders() {
      return [
        {
          text: 'id',
          sortable: false,
          value: 'id',
          class: 'accent--text text-subtitle-2 text-uppercase',
        },
        {
          text: 'username',
          sortable: false,
          value: 'employeeName',
          class: 'accent--text text-subtitle-2 text-uppercase',
        },
        {
          text: 'email',
          sortable: false,
          value: 'email',
          class: 'accent--text text-subtitle-2 text-uppercase',
        },
        {
          text: 'Company',
          sortable: false,
          value: 'company',
          class: 'accent--text text-subtitle-2 text-uppercase',
        },
        {
          text: 'Department',
          sortable: false,
          value: 'department',
          class: 'accent--text text-subtitle-2 text-uppercase',
        },
        {
          text: 'Personal ID code',
          sortable: false,
          value: 'personalIdCode',
          class: 'accent--text text-subtitle-2 text-uppercase',
        },
        {
          text: 'employee type',
          sortable: false,
          value: 'employeeType',
          class: 'accent--text text-subtitle-2 text-uppercase',
        },
        {
          text: 'actions',
          sortable: false,
          value: 'actions',
          class: 'primary--text text-subtitle-2 text-uppercase link',
        },
      ];
    },
  },

  watch: {
    allSelectedUsers(val) {
      this.allSelectedUsers = val;
    },
    agreed(val) {
      this.agreed = val;
    },

    // search
    searchTerm() {
      this.debouncedSearch();
    },

    model(val) {
      this.redirectAfterSearch(val);
    },

    itemPerPage(val) {
      this.itemPerPage = val;
      this.paginateEmployeeLoad();
    },

    editedItem: {
      handler(newValue) {
        // upddate departments when employee changes
        const depts = this.companiesDepartments.filter(
          (_comp) => _comp.id === newValue.company
        );
        this.otherDepartments = depts[0].departments;
      },
      deep: true,
    },
  },

  mounted() {
    this.paginateEmployeeLoad();
  },

  methods: {
    ...mapActions('users_employees', {
      updateEmployee: 'updateEmployee',
      delEployee: 'delEployee',
      loadEmployees: 'loadEmployees',
    }),

    // pagination employee search

    paginateEmployeeLoad() {
      let limit = this.itemPerPage.value ? this.itemPerPage.value : 25;
      let offset = this.offset;

      if (limit == -1) {
        this.query += `all=True`;
      } else {
        this.query += `limit=${limit}&offset=${offset}`;
      }

      let payload = {
        query: this.query,
      };

      this.loadEmployees(payload)
        .then(() => {})
        .catch(() => {})
        .finally(() => {
          this.query = '?';
        });
    },

    // search
    debouncedSearch() {
      this.debouncedSearch = lodash.debounce(this.searchData, 500);
    },

    searchData() {
      searchEmployees(this.searchTerm)
        .then((res) => {
          this.searchResults = res;
        })
        .catch(() => {});
    },

    redirectAfterSearch(val) {
      this.$router.push(`/admin/groups/user/${val.user_id}`);
    },

    editItem(item) {
      this.editedIndex = item.id;
      // set department to edit employee
      const depts = this.companiesDepartments.filter(
        (_comp) => _comp.id === item.company
      );
      if (depts.length > 0) this.otherDepartments = depts[0].departments;

      console.log('other depts', this.otherDepartments);

      const company = this.companies.find((i) => {
        return i.name == item.company;
      });

      const employeeType = this.employeeTypes.find((i) => {
        return i.name == item.employeeType;
      });

      this.editedItem = Object.assign(
        {},
        {
          id: 2,
          personalIdCode: item.personalIdCode,
          employeeName: item.employeeName,
          company_email: item.email,
          company: company.id,
          departmentDetails: item.department,
          employee_type: employeeType.id,
          lastActiveDate: item.lastActiveDate,
          status: item.status,
        }
      );
      this.dialog = true;
    },

    selectAllUsers() {
      // employees selected length is not the same as employees list length
      if (this.allSelectedUsers.length != this.employees.length) {
        // select all
        this.allSelectedUsers = this.employees;
        this.allSelected = true;
      } else {
        // unselect all
        this.allSelectedUsers = [];

        this.allSelected = false;
      }
    },

    // employee delete
    launchUserDeleteDialogFromTheMenu() {
      this.userDeleteDialog = true;
    },
    launchEmployeeDeleteDialog(item) {
      this.allSelectedUsers.push(item);
      this.selectedUserIndex = item.id;
      this.userDeleteDialog = true;
    },
    dismissUserDeleteDialog() {
      this.userDeleteDialog = false;
      this.allSelected = false;
      this.allSelectedUsers = [];
    },
    launchConfirmDeleteUser() {
      this.confirmDeleteUserDialog = true;
    },
    dissmissConfirmDeleteUser() {
      this.confirmDeleteUserDialog = false;
      this.userDeleteDialog = false;
      this.allSelectedUsers = [];
      this.allSelected = false;
      this.agreed = false;
    },

    // delete employee call
    deleteItem() {
      this.$emit('show-feedback', {
        status: 'submitting',
        message: this.$t('deleting'),
      });

      let data = {
        employeeIds: this.allSelectedUsers.flatMap((_emp) => _emp.id),
      };
      this.delEployee(data)
        .then(() => {
          this.$emit('show-feedback', {
            status: 'success',
            message: this.$t('deleting'),
          });
        })
        .finally(() => {
          this.paginateEmployeeLoad();
          this.dissmissConfirmDeleteUser();
          this.allSelectedUsers = [];
        });
    },

    deleteItemConfirm() {
      this.closeDelete();
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    // edit employee
    editEmployee() {
      if (this.editedIndex > -1) {
        this.$emit('show-feedback', {
          status: 'submitting',
          message: this.$t('loadingText'),
        });

        this.editedItem.first_name = this.editedItem.employeeName.split(' ')[0];
        this.editedItem.last_name = this.editedItem.employeeName.split(' ')[1];
        this.editedItem.department = this.editedItem.departmentDetails.id;

        let payload = { id: this.editedIndex, data: this.editedItem };

        this.updateEmployee(payload)
          .then(() => {
            this.$emit('show-feedback', {
              status: 'success',
              message: this.$t('updated'),
            });
          })
          .catch(() => {
            this.$emit('show-feedback', {
              status: 'fail',
              message: this.$t('updateFailed'),
            });
          })
          .finally(() => {
            this.paginateEmployeeLoad();
          });
      }
      this.dialog = false;
    },
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    toggleFilter() {
      this.$emit('update:filter-drawer', !this.filterDrawer);
    },

    importEmployeeData() {
      this.isSelecting = true;

      // Trigger click on the FileInput
      this.$refs.uploader.click();
      setTimeout(() => {
        this.isSelecting = false;
      }, 2000);
    },
    onFileChanged(e) {
      this.$emit('show-feedback', {
        status: 'submitting',
        message: this.$t('importingEmployees'),
      });

      this.selectedFile = e.target.files[0];
      // console.log(this.selectedFile);
      // Do whatever you need with the file, like reading it with FileReader
      const reader = new FileReader();
      // reader.onload = (e) => console.log(e.target.result);
      reader.readAsText(this.selectedFile);

      let formData = new FormData();
      formData.append('file', this.selectedFile);

      this.$http
        .post(`mmauth/api/load/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(() => {
          this.$emit('show-feedback', {
            status: 'success',
            message: 'Employees import successful.',
          });
        })
        .catch(() => {
          this.$emit('show-feedback', {
            status: 'fail',
            message: this.$t('employeeUploadFail'),
          });
        })
        .finally(() => {
          this.paginateEmployeeLoad();
          this.isSelecting = false;
        });
    },

    closeGroupCreatingDialog() {
      this.transitionInput = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.resize {
  height: 10px;
  width: 10px;
}
</style>
