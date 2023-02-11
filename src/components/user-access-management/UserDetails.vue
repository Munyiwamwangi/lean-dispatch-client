<template>
  <div>
    <v-toolbar color="#f8f8f8" dense elevation="1">
      <v-btn text icon @click="redirectToUsersOrEmployees()">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-toolbar-title class="secondary--text text-subtitle-2 text-capitalize">
        {{ fullName }}
      </v-toolbar-title>
    </v-toolbar>

    <v-container fluid>
      <v-card class="d-flex flex-column flex-md-row pa-6 mb-6" elevation="1">
        <div class="align-self-center mb-5 mb-md-0">
          <v-avatar color="accent" size="96">
            <v-img :src="defaultUserObject.profile_pic" :alt="fullName">
              <template v-slot:placeholder>
                <v-icon color="white" x-large>mdi-account</v-icon>
              </template>
            </v-img>
          </v-avatar>
        </div>

        <div class="mx-md-7">
          <p>
            <span class="text-subtitle-2 text-capitalize"
              >{{ $t('nameText') }}:&nbsp;</span
            >
            <span class="text-body-2"
              >{{ defaultUserObject.firstName }}
              {{ defaultUserObject.lastName }}
            </span>
          </p>
          <p>
            <span class="text-subtitle-2 text-capitalize">
              {{ $t('company') }}:&nbsp;</span
            >
            <span class="text-body-2">{{ defaultUserObject.company }} </span>
          </p>
          <p>
            <span class="text-subtitle-2 text-capitalize">
              {{ $t('emailAdressText') }}:&nbsp;
            </span>
            <span class="text-body-2">{{ defaultUserObject.email }} </span>
          </p>
        </div>

        <div class="mx-md-7">
          <p>
            <span class="text-subtitle-2 text-capitalize">
              last activity date :&nbsp;</span
            >
            <span class="text-body-2">
              {{
                $date(defaultUserObject.updatedAt).format('DD-MMM-YYYY, HH:mm')
              }}
            </span>
          </p>
          <p>
            <span class="text-body-2">
              <v-list-item-subtitle>
                <span class="text-subtitle-2 text-capitalize"
                  >status:&nbsp;</span
                >
                <v-list-item-icon>
                  <v-switch
                    v-model="defaultUserObject.status"
                    inset
                    color="primary"
                    class="ml-4"
                    @click="launchActivateOrDeactivateUserProcess()"
                  ></v-switch>
                </v-list-item-icon>
              </v-list-item-subtitle>
            </span>
          </p>

          <!-- <p>
            <span class="text-subtitle-2 text-capitalize"
              >{{ $t('hireDate') }}:&nbsp;</span
            >
            <span class="text-body-2">
              {{ defaultUserObject.join_date }}
            </span>
          </p> -->
        </div>
      </v-card>
      <!-- user details end   -->
      <v-data-table
        :headers="headers"
        :search="search"
        :items="groupsAndRoles"
        :items-per-page="itemPerPage.value"
        hide-default-footer
        class="elevation-1"
        :loading="loading"
        :loading-text="$t('dataLoadingText')"
        :no-data-text="$t('noDataTextForTables')"
      >
        <template slot="progress">
          <LoadingBar></LoadingBar>
        </template>

        <TableTopbar
          :item-per-page.sync="itemPerPage"
          :items-per-page="itemsPerPage"
        >
          <template #leading>
            <v-btn
              color="primary"
              class="text-capitalize"
              @click="launchGroupCreatingDialog()"
            >
              <v-icon left>mdi-plus </v-icon>
              <span class="text-capitalize"> Add Group</span>
            </v-btn>
          </template>

          <template #trailing>
            <v-text-field
              v-model="searchTable"
              clearable
              dense
              item-color="grey"
              hide-details="auto"
              append-icon=""
              prepend-inner-icon="mdi-magnify"
              :label="$t('searchTextTranslate')"
              single-line
              item-text="name"
              item-value="name"
              return-object
              class="pl-2"
            >
            </v-text-field>
          </template>
        </TableTopbar>

        <!-- ids  -->
        <template v-slot:[`item.id`]="props">
          {{ props.index + 1 }}
        </template>

        <!-- override roles  -->
        <template #[`item.roles`]="{ item }">
          <div v-if="item.roles.length > 1">
            <div v-for="rol in item.roles" :key="rol.title">
              <v-chip
                small
                link
                class="mt-1"
                @click:close="removeFromGroup(item)"
              >
                <span class="text-capitalize">{{ rol }}</span>
              </v-chip>
            </div>
          </div>
        </template>

        <!-- table actions -->
        <template v-slot:[`item.actions`]="{ item }">
          <!-- <v-icon small color="green" class="mr-4"> mdi-pencil </v-icon> -->
          <v-icon
            small
            color="red"
            @click="launchRemoveUserFromGroupDialog(item)"
          >
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>

      <!-- user activation dialog -->
      <v-dialog v-model="activationDialog" max-width="500px">
        <v-card class="text-center">
          <v-icon color="blue darken-1" dark size="128"
            >mdi-account-check</v-icon
          >
          <v-card-text class="primary--text text-center text-h5">
            {{ $t('activateEmployeeAccountText') }}
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
              @click="dismissDeactivationDialog()"
            >
              {{ $t('cancelButtonText') }}
            </v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- disable user dialog  -->
      <v-dialog v-model="deactivationDialog" max-width="500px" persistent>
        <v-card class="text-center">
          <v-icon color="red" dark size="128">mdi-account-cancel</v-icon>
          <v-card-text
            class="secondary--text text-center text-h5 text-capitalize"
          >
            {{ $t('disableUserAccountText') }}
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
        </v-card>
      </v-dialog>

      <!-- remove user from a group dialog  -->
      <v-dialog v-model="removeUserFromGroup" max-width="500px" persistent>
        <v-card class="text-center">
          <v-icon color="warning" dark size="64">mdi-alert-outline</v-icon>
          <v-card-text
            class="secondary--text text-center text-h5 text-capitalize"
          >
            {{ $t('removeUserFromGroup') }} ?
          </v-card-text>
          <v-card-text>
            {{ $t('removedUsersCannotAccessRoles') }}.
          </v-card-text>
          <v-card-subtitle> {{ $t('butYouCanAddThemBack') }}. </v-card-subtitle>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red darken-1" text @click="removeFromGroup()">
              {{ $t('proceedButtonText') }}
            </v-btn>
            <v-btn
              color="accent--text"
              text
              @click="closeRemoveUserFromGroupDialog"
            >
              {{ $t('cancelButtonText') }}
            </v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </div>
</template>

<style scoped></style>

<script>
import TableTopbar from '../TableTopbar.vue';
import showRecordsBy from '../../mixins/showRecordsBy';
import LoadingBar from '../LoadingBar.vue';
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'UserDetails',

  components: {
    TableTopbar,
    LoadingBar,
    // EmployeeDetailsCard,
  },

  mixins: [showRecordsBy],
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },

  data: () => ({
    search: '',
    searchTable: '',
    deactivationDialog: false,
    activationDialog: false,
    removeUserFromGroup: false,
    userGroups: -1,
    defaultUserObject: {
      id: '',
      email: '',
      firstName: '',
      lastName: '',
      updatedAt: '',
      groups: [],
    },
    newUser: {
      id: '',
      email: '',
      firstName: '',
      lastName: '',
      updatedAt: '',
      groups: [],
      employeeUser: '',
    },
  }),

  computed: {
    ...mapGetters('groups', {
      groups: 'allGroups',
    }),

    fullName() {
      return (
        this.defaultUserObject.firstName + ' ' + this.defaultUserObject.lastName
      );
    },

    groupsAndRoles() {
      // return
      return this.defaultUserObject.groups.map((_item) => {
        return {
          groupName: _item.title,
          employeeUser: this.defaultUserObject.employeeUser,
          roles: _item.roles.flatMap((_role) => _role.title),
        };
      });
    },

    userDetails() {
      return this.defaultUserObject;
    },

    headers() {
      return [
        {
          text: 'ID',
          sortable: false,
          value: 'id',
          class: 'accent--text text-subtitle-2 text-uppercase',
        },
        {
          text: 'group name',
          sortable: false,
          value: 'groupName',
          class: 'accent--text text-subtitle-2 text-uppercase',
        },
        {
          text: 'Roles',
          sortable: false,
          value: 'roles',
          class: 'accent--text text-subtitle-2 text-uppercase',
        },
        {
          text: 'Actions',
          sortable: false,
          value: 'actions',
          class: 'accent--text text-subtitle-2 text-uppercase link',
        },
      ];
    },
  },

  watch: {
    defaultUserObject(val) {
      this.defaultUserObject = val;
    },
  },
  created() {
    this.getSingleUserDetails(this.$route.params.id);
  },

  methods: {
    ...mapActions('groups', {
      removeGroupEmployee: 'removeOrAddEmploeesIntoGroup',
    }),

    ...mapActions('users_employees', {
      activateOrDeactivateUsr: 'activateOrDeactivateUsr',
    }),

    refreshUser() {
      this.getSingleUserDetails(this.defaultUserObject.id);
    },
    // user deactivation and activation
    dismissDeactivationDialog() {
      this.activationDialog = false;
      this.deactivationDialog = false;
      this.refreshUser();
    },

    launchActivateOrDeactivateUserProcess() {
      if (!this.defaultUserObject.status) {
        this.deactivationDialog = true;
      } else {
        this.activationDialog = true;
      }
    },
    launchRemoveUserFromGroupDialog(item) {
      // console.log('clicked item', item);
      this.newUser = Object.assign({}, item);
      this.removeUserFromGroup = true;
    },

    closeRemoveUserFromGroupDialog() {
      this.removeUserFromGroup = false;
    },
    // remove employees from group
    removeFromGroup() {
      this.closeRemoveUserFromGroupDialog();
      this.$emit('show-feedback', {
        status: 'submitting',
        message: 'submitting',
      });

      let groupId = this.groups.filter(
        (_item) => _item.name === this.newUser.groupName
      );

      let data = {
        action: 'remove',
        employeeIds: [this.newUser.employeeUser],
      };

      let payload = { id: groupId[0].id, data: data };
      this.removeGroupEmployee(payload)
        .then(() => {
          this.$emit('show-feedback', {
            status: 'success',
            message: 'Employee removed.',
          });
        })
        .catch(() => {
          this.$emit('show-feedback', {
            status: 'fail',
            message: 'Employee removal not successful',
          });
        })
        .finally(() => {
          this.refreshUser();
          this.loadUsers();
        });
    },

    // activate or deactivate user
    activateOrDeactivate() {
      this.$emit('show-feedback', {
        status: 'submitting',
        message: 'submitting',
      });

      const data = {
        action: this.defaultUserObject.status ? 'enable' : 'disable',
        userIds: [this.defaultUserObject.id],
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
          this.dismissDeactivationDialog();
        });
    },

    // fetch one user
    getSingleUserDetails(id) {
      this.$http
        .get(`bms/api/admin/users/${id}/`)
        .then((res) => {
          this.userGroups = res.data.groups.length;

          let response = res.data;
          this.defaultUserObject = Object.assign(
            {},
            {
              id: response.id,
              email: response.email,
              firstName: response.first_name,
              lastName: response.last_name,
              updatedAt: response.updated_at,
              groups: response.groups,
              status: response.is_active,
              employeeUser: response.employee_user,
            }
          );
        })
        .catch((err) => {
          throw err;
        })
        .finally(() => {});
    },

    redirectToUsersOrEmployees() {
      if (this.userGroups > 0) {
        this.$router.push('/admin/groups');
      } else {
        this.$router.push('/admin/employees');
      }
    },
  },
};
</script>
