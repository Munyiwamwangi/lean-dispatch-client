<template>
  <v-container fluid class="dont-scroll-horizontal">
    <v-data-table
      v-model="allSelectedUsers"
      :headers="userTableHeaders"
      :items="usersWithAtLeastOneGroup"
      :loading="loading"
      :items-per-page="itemPerPage.value"
      hide-default-footer
      class="elevation-1"
      :loading-text="$t('dataLoadingText')"
      :no-data-text="$t('noDataTextForTables')"
      show-select
    >
      <template slot="progress">
        <LoadingBar></LoadingBar>
      </template>
      <!-- v-if="allSelectedUsers.length > 0" -->
      <template v-slot:top>
        <v-row no-gutters justify="end">
          <v-col
            v-if="allSelectedUsers.length > 0"
            cols="6"
            sm="6"
            md="6"
            align-self="center"
            class="mt-2"
          >
            <v-toolbar flat max-height="50px">
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                    v-bind="attrs"
                    color="primary"
                    dark
                    size="26"
                    class="pl-2 pr-2 ml-2"
                    v-on="on"
                    @click="enableSelectedUsers()"
                    >mdi-account-check
                  </v-icon>
                </template>
                <span class="text-capitalize">enable</span>
              </v-tooltip>

              <v-divider class="mx-4" vertical></v-divider>

              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                    v-bind="attrs"
                    color="secondary"
                    dark
                    size="26"
                    class="pl-2 pr-2 ml-2"
                    v-on="on"
                    @click="disableSeelctedUsers()"
                    >mdi-account-alert
                  </v-icon>
                </template>
                <span class="text-capitalize">disable</span>
              </v-tooltip>

              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                    size="23"
                    class="pl-2 pr-2 ml-2"
                    color="secondary"
                    v-bind="attrs"
                    v-on="on"
                    @click="launchUserDeleteDialogFromTheMenu()"
                  >
                    mdi-delete
                  </v-icon>
                </template>
                <span class="text-capitalize">Delete</span>
              </v-tooltip>
            </v-toolbar>
          </v-col>

          <v-col cols="6" sm="6" md="6">
            <TableTopbar
              :item-per-page.sync="itemPerPage"
              :items-per-page="itemsPerPage"
            >
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
                  no-filter
                  return-object
                  width="50px"
                  class="pl-2"
                >
                  <template v-slot:item="data">
                    <template>
                      <v-list max-width="318px">
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
          </v-col>
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
              @click="selectAllUsers"
            ></v-simple-checkbox>
          </v-col>
          <v-col>
            <v-menu
              bottom
              offset-x
              :disabled="users.length === 0"
              min-width="150px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  small
                  icon
                  v-bind="attrs"
                  :disabled="users.length === 0"
                  v-on="on"
                >
                  <v-icon color="accent" class="resize">mdi-menu-down</v-icon>
                </v-btn>
              </template>

              <v-list dense>
                <v-list-item link @click="selectAllUsers">
                  {{ $t('allButtonText') }}
                </v-list-item>
                <v-list-item link @click="filterEnabledOnly()">
                  <!-- @click="enableSelectedUsers()" -->
                  Enabled
                </v-list-item>
                <v-list-item link @click="filterDisabledOnly()">
                  <!-- @click="disableSeelctedUsers()" -->
                  Disabled
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

      <!-- status  -->
      <template v-slot:[`item.status`]="{ item }">
        <v-row>
          <v-col cols="12" md="4">
            <!-- <div v-if="item.email === checkCurrentUser"></div> -->
            <v-switch
              v-model="item.status"
              :disabled="item.email === checkCurrentUser"
              color="primary"
              dense
              class="mr-4"
              @click="launchActivateOrDeactivateUserProcess(item)"
            ></v-switch>
          </v-col>
        </v-row>
      </template>

      <!-- overdide roles  -->
      <template #[`item.role`]="{ item }">
        <v-chip v-if="item.role.length > 0" link @click="manageUserRoles(item)">
          <span class="text-capitalize">{{ item.role[0] }}</span>
          <v-badge
            v-if="item.role.length > 1"
            color="error"
            bordered
            :content="` +${item.role.length - 1}`"
            class="mx-4"
          >
          </v-badge>
        </v-chip>
        <p v-else class="text-subtitle1">--</p>
      </template>

      <!-- groups -->
      <template #[`item.groups`]="{ item }">
        <v-chip
          v-if="item.groups.length > 0"
          link
          class="myDIV"
          @click="manageUserRoles(item)"
        >
          <span class="text-capitalize">{{ item.groups[0] }}</span>
          <v-badge
            v-if="item.groups.length > 1"
            color="error"
            bordered
            :content="` +${item.groups.length - 1}`"
            class="mx-4"
          >
          </v-badge>
        </v-chip>
        <p v-else class="text-subtitle1">--</p>

        <!-- <div v-for="_item in item.groups" :key="_item" class="hide mt-1">
          <v-chip small pill>
            {{ _item }}
          </v-chip>
        </div> -->
      </template>

      <!-- last activity date  -->
      <template #[`item.lastActivityDate`]="props">
        {{ $date(props.item.lastActivityDate).format('DD-MM-YYYY HH:mm') }}
      </template>

      <!-- actions  -->
      <template v-slot:[`item.actions`]="{ item }">
        <v-row no-gutters align="center" justify="center" class="flex-nowrap">
          <v-col>
            <v-icon
              size="20"
              color="red"
              :disabled="item.email === checkCurrentUser"
              @click="launchUserDeleteDialog(item)"
            >
              mdi-delete
            </v-icon>
          </v-col>
          <v-col>
            <v-list-item @click="manageUserRoles(item)">
              <v-list-item-subtitle class="text-capitalize">
                <span class="force_blue"> manage roles</span>
              </v-list-item-subtitle>
            </v-list-item>
          </v-col>
        </v-row>
      </template>
    </v-data-table>
    <!-- 
    <DeleteUserDialog
      :dialog="confirmDeleteDialog"
      @close-dialog="dismissConfirmDelete"
      @delete-item="deleteGroup()"
    >
    </DeleteUserDialog> -->

    <!-- disable user dialog  -->
    <v-dialog v-model="deactivationDialog" max-width="500px" persistent>
      <v-card class="text-center">
        <v-icon color="red" dark size="128">mdi-account-cancel</v-icon>
        <!-- <div v-if="checkCurrentUser.length > 0">
          <v-card-text>
            You can not deactivate yourself. Please remove yourself from the
            list of people you want to deactivate
          </v-card-text>
          <v-btn color="accent--text" text @click="dismissDeactivationDialog">
            {{ $t('cancelButtonText') }}
          </v-btn>
        </div> -->
        <div>
          <v-card-text
            class="secondary--text text-center text-h5 text-capitalize"
          >
            {{ $t('disableUserAccountText') }}
            <span v-if="this.allSelectedUsers.length > 1" class="text-lowercase"
              >(s)
            </span>
          </v-card-text>
          <v-card-text>
            {{ $t('selectedUsersCanNotAccessBMS') }}
          </v-card-text>
          <v-card-subtitle>
            {{ $t('usersCanBeActivatedAgain') }}
          </v-card-subtitle>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red darken-1" text @click="activateOrDeactivate()">
              {{ $t('proceedButtonText') }}
            </v-btn>
            <v-btn color="accent--text" text @click="dismissDeactivationDialog">
              {{ $t('cancelButtonText') }}
            </v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </div>
      </v-card>
    </v-dialog>

    <!--delete user dialog -->
    <v-dialog v-model="userDeleteDialog" max-width="500px">
      <v-card class="text-center">
        <v-icon color="red" dark size="128">mdi-account-alert</v-icon>
        <v-card-text
          class="secondary--text text-center text-h5 text-capitalize"
        >
          {{ $t('deleteUserAccountText') }}
          <span v-if="this.allSelectedUsers.length > 1" class="text-lowercase"
            >(s)
          </span>
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
            @click="launchConfirmDeactivationDialog()"
          >
            {{ $t('proceedButtonText') }}
          </v-btn>
          <v-btn color="accent--text" text @click="dismissUserDeleteDialog">
            {{ $t('cancelButtonText') }}
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- confirm if you want to delete user dialog  -->
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

    <!-- user activation dialog -->
    <v-dialog v-model="activationDialog" max-width="500px">
      <v-card class="text-center">
        <v-icon color="blue darken-1" dark size="128">mdi-account-check</v-icon>
        <v-card-text class="primary--text text-center text-h5 text-capitalize">
          {{ $t('enableEmployeeAccountText') }}
          <span v-if="this.allSelectedUsers.length > 1" class="text-lowercase"
            >(s)
          </span>
        </v-card-text>
        <v-card-text>
          {{ $t('selectedUsersCanLoginIntoSystem') }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="activateOrDeactivate()">
            {{ $t('confirmButtonText') }}
          </v-btn>
          <v-btn
            color="accent--text"
            text
            @click="dismissUserActivationDialog()"
          >
            {{ $t('cancelButtonText') }}
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style lang="scss">
.dont-scroll-horizontal {
  overflow-x: hidden;
}
</style>

<script>
import showRecordsBy from '../../mixins/showRecordsBy';
import TableTopbar from '../TableTopbar.vue';
import { mapActions } from 'vuex';
import LoadingBar from '../LoadingBar.vue';
import lodash from 'lodash';
import { searchUsers } from '@/services/modules/common.js';

// import DeleteUserDialog from '../DeleteItemDialog.vue';

export default {
  name: 'userTableComponent',
  components: {
    LoadingBar,
    TableTopbar,
    // DeleteUserDialog,
  },
  mixins: [showRecordsBy],
  props: {
    users: {
      type: Array,
      required: true,
    },
    loading: {
      type: Boolean,
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
      model: null,
      switch1: false,
      allSelected: false,
      allSelectedUsers: [],
      selectedUserIndex: -1,
      enablingDisablingStatus: false,
      deactivationDialog: false,
      userDeleteDialog: false,
      activationDialog: false,
      confirmDeleteDialog: false,
      confirmDeleteUserDialog: false,
      offset: 0,
      agreed: false,
    };
  },
  computed: {
    employeeData() {
      return this.$store.state.employeeData || {};
    },

    checkCurrentUser() {
      return this.employeeData.company_email;
    },

    usersWithAtLeastOneGroup() {
      return this.users.filter((_usr) => _usr.groups.length > 0);
    },

    userTableHeaders() {
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
          value: 'userName',
          class: 'accent--text text-subtitle-2 text-uppercase',
        },
        {
          text: 'Group(s)',
          sortable: false,
          value: 'groups',
          class: 'accent--text text-subtitle-2 text-uppercase',
        },
        {
          text: 'Role',
          sortable: false,
          value: 'role',
          class: 'accent--text text-subtitle-2 text-uppercase',
        },
        {
          text: 'email',
          sortable: false,
          value: 'email',
          class: 'accent--text text-subtitle-2 text-uppercase',
        },
        {
          text: 'last activity date',
          sortable: false,
          value: 'lastActivityDate',
          class: 'accent--text text-subtitle-2 text-uppercase',
        },
        {
          text: 'status',
          sortable: false,
          value: 'status',
          class: 'accent--text text-subtitle-2 text-uppercase',
        },
        {
          text: 'actions',
          sortable: false,
          value: 'actions',
          class: 'accent--text text-subtitle-2 text-uppercase link',
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
      this.paginateUserLoad();
    },
  },

  mounted() {
    this.paginateUserLoad();
  },

  methods: {
    ...mapActions('users_employees', {
      loadUsers: 'loadUsers',
      delUser: 'delUser',
      activateOrDeactivateUsr: 'activateOrDeactivateUsr',
      delNeverLoggedInUser: 'delNeverLoggedInUser',
    }),

    // pagination employee search
    paginateUserLoad() {
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
      this.loadUsers(payload)
        .then(() => {})
        .catch(() => {})
        .finally(() => {
          this.query = '?';
        });
    },

    debouncedSearch() {
      this.debouncedSearch = lodash.debounce(this.searchData, 500);
    },

    // search
    manageUserRoles(item) {
      this.$router.push(`/admin/groups/user/${item.userId}`);
    },

    searchData() {
      searchUsers(this.searchTerm)
        .then((res) => {
          this.searchResults = res.results;
        })
        .catch(() => {});
    },

    redirectAfterSearch(val) {
      this.$router.push(`/admin/groups/user/${val.user_id}`);
    },

    // user deactivation and activation section
    launchConfirmDeactivationDialog() {
      this.confirmDeleteUserDialog = true;
    },
    closeUserActivationDialog() {
      this.activationDialog = false;
    },
    dismissUserActivationDialog() {
      this.activationDialog = false;
      this.loadUsers(this.payload);
    },
    dismissDeactivationDialog() {
      this.deactivationDialog = false;
      this.allSelectedUsers = [];
      this.loadUsers(this.payload);
    },

    launchActivateOrDeactivateUserProcess(item) {
      this.allSelectedUsers.push(item);
      this.selectedUserIndex = item.userId;
      if (!item.status) {
        this.enablingDisablingStatus = false;
        this.deactivationDialog = true;
      } else {
        this.enablingDisablingStatus = true;
        this.activationDialog = true;
      }
    },

    enableSelectedUsers() {
      this.enablingDisablingStatus = true;
      this.activationDialog = true;
    },

    disableSeelctedUsers() {
      this.enablingDisablingStatus = false;
      this.deactivationDialog = true;
    },

    // activate or deactivate user
    activateOrDeactivate() {
      this.$emit('show-feedback', {
        status: 'submitting',
        message: 'submitting',
      });
      const data = {
        action: this.enablingDisablingStatus ? 'enable' : 'disable',
        userIds: this.allSelectedUsers.map((usr) => usr.userId),
      };

      this.activateOrDeactivateUsr(data)
        .then(() => {
          this.$emit('show-feedback', {
            status: 'success',
            message: 'Operation successful',
          });
        })
        .catch(() => {
          this.$emit('show-feedback', {
            status: 'fail',
            message:
              'User activation failed, please try again after a few minutes or contact IT support',
          });
        })
        .finally(() => {
          this.loadUsers(this.payload);
          this.closeUserActivationDialog();
          this.dismissDeactivationDialog();
          this.enablingDisablingStatus = false;
          this.allSelectedUsers = [];
        });
    },

    selectAllUsers() {
      // employees selected length is not the same as employees list length
      if (this.allSelectedUsers.length != this.users.length) {
        // select all
        this.allSelectedUsers = this.users;
        this.allSelected = true;
      } else {
        // unselect all
        this.allSelectedUsers = [];

        this.allSelected = false;
      }
    },

    filterEnabledOnly() {
      this.allSelectedUsers = this.users.filter(
        (_user) => _user.status == true
      );
    },

    filterDisabledOnly() {
      this.allSelectedUsers = this.users.filter(
        (_user) => _user.status == false
      );
    },

    // user delete
    launchUserDeleteDialogFromTheMenu() {
      this.userDeleteDialog = true;
    },
    launchUserDeleteDialog(item) {
      this.allSelectedUsers.push(item);
      this.userDeleteDialog = true;
    },
    dismissUserDeleteDialog() {
      this.userDeleteDialog = false;
    },
    launchConfirmDeleteUser() {
      this.confirmDeleteUserDialog = true;
    },
    dissmissConfirmDeleteUser() {
      this.confirmDeleteUserDialog = false;
      this.userDeleteDialog = false;
      this.allSelectedUsers = [];
      this.agreed = false;
    },

    deleteItem() {
      this.$emit('show-feedback', {
        status: 'submitting',
        message: 'submitting',
      });
      const data = {
        userIds: this.allSelectedUsers.map((usr) => usr.userId),
      };
      this.delUser(data)
        .then(() => {
          this.$emit('show-feedback', {
            status: 'success',
            message: 'User Deleted.',
          });
        })
        .catch(() => {
          this.$emit('show-feedback', {
            status: 'fail',
            message: 'Delete user failed.',
          });
        })
        .finally(() => {
          this.dissmissConfirmDeleteUser();
          this.enablingDisablingStatus = false;
          this.allSelectedUsers = [];
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.resize {
  height: 10px;
  width: 10px;
}
.hide {
  display: none;
}

.myDIV:hover + .hide {
  display: block;
  color: red;
}
</style>
