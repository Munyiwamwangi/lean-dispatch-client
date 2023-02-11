<template>
  <v-container fluid>
    <v-data-table
      :headers="groupTableHeaders"
      :items="groups"
      :search="searchTable"
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

      <template v-slot:top>
        <v-row no-gutters justify="end" class="mb-2">
          <div>
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
                  <span class="text-capitalize"> Add group</span>
                </v-btn>
              </template>

              <template #trailing>
                <v-combobox
                  v-model="model"
                  :search-input.sync="searchTerm"
                  :items="searchResults"
                  :label="$t('searchTextTranslate')"
                  :loading="groupSearchLoader"
                  single-line
                  item-text="description"
                  item-value="id"
                  clearable
                  dense
                  item-color="grey"
                  hide-details="auto"
                  append-icon=""
                  prepend-inner-icon="mdi-magnify"
                  return-object
                  class="pl-2 increase-search-field-width"
                >
                  <template v-slot:item="data">
                    <template>
                      <v-list max-width="355px">
                        <v-list-item class="pl-0">
                          <v-list-item-content>
                            <v-list-item-title class="text-lowercase"
                              >{{ data.item.title }}
                            </v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list>
                    </template>
                  </template>
                </v-combobox>
              </template>
            </TableTopbar>
          </div>
        </v-row>
        <v-row class="mt-0">
          <!-- create group dialog  -->
          <v-dialog
            v-model="dialog"
            class="mx-auto"
            max-width="550px"
            persistent
          >
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-card>
                <v-card-title class="accent--text text-capitalize">
                  {{ formTitle }}
                </v-card-title>

                <v-card-text>
                  <v-combobox
                    v-model="newGroup.name"
                    :label="$t('groupNameTranslate')"
                    :search-input.sync="search"
                    :hide-no-data="!search"
                    append-icon=""
                    dense
                    multiple
                    persistent-hint
                    small-chips
                    outlined
                    rounded
                    :rules="[rules.required]"
                  >
                    <template v-slot:no-data>
                      <v-list-item>
                        <span class="subheading">Save group: </span>
                        <v-chip :color="`${colors[nonce - 1]} lighten-3`" small>
                          {{ search }}
                        </v-chip>
                        <span>
                          Or press <kbd>Enter</kbd> to create multiple
                          groups</span
                        >
                      </v-list-item>
                    </template>
                  </v-combobox>

                  <v-autocomplete
                    v-model="newGroup.role"
                    :items="roles"
                    :label="$t('roleNameTranslate')"
                    :rules="[rules.required]"
                    item-text="title"
                    item-value="id"
                    multiple
                    chips
                    dense
                    outlined
                    rounded
                    append-outer-icon="mdi-plus-circle-outline"
                    @click:append-outer="addMore(roles)"
                  >
                    <template v-slot:selection="data">
                      <v-chip
                        v-bind="data.attrs"
                        :input-value="data.selected"
                        close
                        class="mt-1"
                        @click="data.select"
                        @click:close="remove(data.item)"
                      >
                        {{ data.item.title }}
                      </v-chip>
                    </template>

                    <template v-slot:append-outer>
                      <v-tooltip top>
                        <template v-slot:activator="{ on }">
                          <v-icon color="primary" @click="addMore()" v-on="on">
                            mdi-plus-circle-outline
                          </v-icon>
                        </template>
                        Create new role
                      </v-tooltip>
                    </template>
                  </v-autocomplete>

                  <v-card-actions class="pt-0 mt-0">
                    <v-spacer></v-spacer>
                    <v-btn
                      class="text-capitalize"
                      text
                      @click="closeGroupCreatingDialog()"
                    >
                      {{ $t('cancelButtonText') }}
                    </v-btn>
                    <v-btn
                      color="accent"
                      :disabled="!valid"
                      class="text-capitalize"
                      @click="saveGroup()"
                    >
                      {{ $t('saveButtonText') }}
                    </v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-form>
          </v-dialog>

          <!-- add employee to a group dialog -->
          <v-dialog
            v-model="addEmployeesToGroupDialog"
            max-width="1000px"
            persistent
          >
            <v-card>
              <v-container>
                <v-card-text height="500px">
                  <v-data-table
                    :headers="groupUserTableHeaders"
                    :items="groupUsers"
                    :items-per-page="itemPerPage.value"
                    hide-default-footer
                    class="elevation-1"
                    :loading="loading"
                    :loading-text="$t('dataLoadingText')"
                    :no-data-text="$t('noDataTextForTables')"
                  >
                    <template v-slot:top>
                      <v-row justify="start">
                        <v-card-title
                          class="text-h5 accent--text pt-0 mb-5 subtitle-3 is-fixed-top"
                        >
                          Add Employee(s)
                        </v-card-title>
                        <div class="pt-2">
                          <v-autocomplete
                            v-model="proposedGroupEmployees"
                            :items="groupNonMembers"
                            small
                            clearable
                            dense
                            outlined
                            multiple
                            chips
                            item-text="employeeName"
                            item-value="id"
                            class="set-max-width"
                            label="Select one or more employees"
                          >
                            <!-- display a closable chip  -->
                            <template v-slot:selection="data">
                              <v-chip
                                v-bind="data.attrs"
                                :input-value="data.selected"
                                close
                                class="mt-1"
                                @click="data.select"
                                @click:close="removeEmployees(data.item)"
                              >
                                {{ data.item.employeeName }}
                              </v-chip>
                            </template>
                          </v-autocomplete>
                        </div>
                        <v-card-actions class="mb-6">
                          <v-btn
                            color="accent"
                            class="text-capitalize"
                            @click="saveEmployeeIntoGroup()"
                          >
                            {{ $t('saveButtonText') }}
                          </v-btn>
                          <v-btn
                            text
                            color="accent"
                            class="text-capitalize"
                            @click="close()"
                          >
                            {{ $t('cancelButtonText') }}
                          </v-btn>
                        </v-card-actions>
                      </v-row>
                    </template>

                    <!-- ids  -->
                    <template #[`item.id`]="props">
                      {{ props.index + 1 }}
                    </template>

                    <!-- actions  -->
                    <template v-slot:[`item.actions`]="{ item }">
                      <v-icon
                        small
                        color="red"
                        @click="launchConfirmRemoveGroupEmployeeDialog(item)"
                      >
                        mdi-delete
                      </v-icon>
                    </template>
                  </v-data-table>
                </v-card-text>
                <v-card-actions class="mr-1">
                  <v-spacer></v-spacer>
                  <v-btn
                    color="accent"
                    class="text-capitalize"
                    @click="close()"
                  >
                    {{ $t('closeButtonText') }}
                  </v-btn>
                </v-card-actions>
              </v-container>
            </v-card>
          </v-dialog>
        </v-row>
        <!-- manage roles dialog  -->
        <v-dialog v-model="manageRolesDialog" max-width="750px" persistent>
          <v-card>
            <!-- <v-container> -->
            <v-card-text>
              <v-row no-gutters justify="center">
                <v-card-title class="text-h5 accent--text pb-0">
                  {{ $t('manageGroupRolesText') }}:
                  <span class="text-lowercase pl-2">{{
                    clickedGroupName
                  }}</span>
                </v-card-title>
              </v-row>
              <template>
                <v-row>
                  <!-- all roles space -->
                  <v-col cols="12" md="6" class="pt-0">
                    <v-card
                      v-if="rolesArr.length > 0"
                      flat
                      outlined
                      height="400px"
                      class="my-list"
                    >
                      <v-card-text>
                        <p class="text-md-center">
                          <strong>{{ $t('otherRolesText') }}</strong>
                        </p>
                        <!-- <v-autocomplete
                            v-model="model"
                            :search-input.sync="search"
                            small
                            dense
                            outlined
                            multiple
                            chips
                            :items="uniqueRoles"
                            item-text="title"
                            item-value="id"
                            label="Search Role"
                          >
                            <template v-slot:selection="data">
                              <v-chip
                                v-bind="data.attrs"
                                :input-value="data.selected"
                                close
                                class="mt-1"
                                @click="data.select"
                                @click:close="removeEmployees(data.item)"
                              >
                                {{ data.item.title }}
                              </v-chip>
                            </template>
                          </v-autocomplete> -->

                        <div v-for="_role in rolesArr" :key="_role.id">
                          <v-list-item
                            link
                            dense
                            @click="addRoleToRolesArray(_role)"
                          >
                            <v-list-item-subtitle>
                              {{ _role.title }}
                              <!-- || {{ _role.title }} -->
                            </v-list-item-subtitle>
                            <v-list-item-icon>
                              <v-icon> mdi-plus </v-icon>
                            </v-list-item-icon>
                          </v-list-item>
                        </div>
                      </v-card-text>
                    </v-card>
                    <v-card v-else flat outlined height="400px">
                      <v-card-text class="pt-0">
                        <v-row no-gutters justify="center">
                          <v-icon size="45" color="green" class="pt-4"
                            >mdi-check-circle-outline</v-icon
                          >
                        </v-row>
                        <v-card-subtitle>
                          <strong
                            >This group has been given all available roles.
                          </strong>
                        </v-card-subtitle>
                        <v-card-subtitle class="pt-0">
                          <strong>
                            You can create a new role and add it to the group.
                          </strong>
                        </v-card-subtitle>
                      </v-card-text>
                    </v-card>
                  </v-col>

                  <!-- roles aleady in the group  -->
                  <v-col cols="12" md="6" class="pt-0">
                    <v-card
                      v-if="originalGroupRoles.length > 0"
                      flat
                      outlined
                      height="400px"
                      class="my-list"
                    >
                      <v-card-text>
                        <p class="text-md-center">
                          <strong>{{ $t('groupRolesText') }} </strong>
                        </p>
                        <div
                          v-for="_rol in originalGroupRoles"
                          :key="_rol.id"
                          link
                          class="pb-0 pt-0"
                        >
                          <v-list-item
                            link
                            dense
                            @click="removeRoleFromRolesArray(_rol)"
                          >
                            <v-list-item-subtitle class="p-0">
                              {{ _rol.title }}
                            </v-list-item-subtitle>
                            <v-list-item-icon>
                              <v-icon> mdi-minus</v-icon>
                            </v-list-item-icon>
                          </v-list-item>
                        </div>
                      </v-card-text>
                    </v-card>
                    <v-card v-else flat outlined height="400px">
                      <v-card-subtitle>
                        There are no roles in this group yet
                      </v-card-subtitle>
                      <v-card-subtitle class="pt-0">
                        You can add some or create new roles:
                      </v-card-subtitle>
                    </v-card>
                  </v-col>
                </v-row>
              </template>
            </v-card-text>

            <v-card-actions class="mr-1 pt-0">
              <v-spacer></v-spacer>
              <v-btn
                text
                color="accent"
                class="text-capitalize"
                @click="close()"
              >
                {{ $t('cancelButtonText') }}
              </v-btn>
              <v-btn
                color="accent"
                class="text-capitalize"
                @click="editGroupRoles()"
              >
                {{ $t('saveButtonText') }}
              </v-btn>
            </v-card-actions>
            <!-- </v-container> -->
          </v-card>
        </v-dialog>
      </template>

      <template #[`item.employeeCount`]="{ item }">
        <v-btn
          fab
          text
          link
          class="mx-2 text-decoration-underline"
          color="primary"
          @click="viewGroupEmployees(item)"
        >
          {{ item.employeeCount }}
        </v-btn>
      </template>

      <!-- ids  -->
      <template v-slot:[`item.id`]="props">
        {{ props.index + 1 }}
      </template>

      <!-- ids  -->
      <template v-slot:[`item.manageRoles`]="props">
        <v-btn fab text small>
          <v-icon
            color="primary"
            class="mx-4"
            dark
            @click="manageRoles(props.item)"
          >
            mdi-account-cog
          </v-icon>
        </v-btn>
      </template>

      <!-- table actions -->
      <template v-slot:[`item.actions`]="{ item }">
        <v-row>
          <div>
            <!-- <v-btn small fab text>
              <span
                class="force_blue text-capitalize"
                link
                @click="viewGroupEmployees(item)"
              >
                <v-icon>mdi-account-multiple-outline</v-icon>

                show employees
              </span>
            </v-btn> -->

            <v-btn fab small text rounded>
              <span
                class="force_blue text-capitalize"
                link
                @click="openGroupEditDialog(item)"
              >
                <v-icon small color="green"> mdi-pencil </v-icon>
                <!-- edit -->
              </span>
            </v-btn>

            <v-btn fab small text rounded>
              <span
                class="force_blue text-capitalize"
                link
                @click="launchconfirmDeleteDialog(item)"
              >
                <v-icon small color="red"> mdi-delete </v-icon>
                <!-- delete -->
              </span>
            </v-btn>
          </div>
        </v-row>
      </template>
    </v-data-table>
    <!-- edit group  -->
    <EditGroupDialog
      :dialog="editGroupDialog"
      :form-title="formTitle"
      :new-group="newGroup"
      :default-group="defaultGroup"
      @send-group-data="updateGroupDetails"
      @close-dialog="closeEditGroupDialog"
    >
    </EditGroupDialog>

    <!-- create role dialog  -->
    <CreaateRoleDialog
      :form-name="createRoleFormName"
      :new-role="newRole"
      :default-role="defaultRole"
      :dialog="createRole"
      @close-dialog="closeRoleCreatingDialog"
      @send-role-data="addARole"
    ></CreaateRoleDialog>

    <DeleteGroupDialog
      :dialog="confirmDeleteDialog"
      @close-dialog="dismissConfirmDelete"
      @delete-item="deleteGroup()"
    >
    </DeleteGroupDialog>

    <!-- delete employee from group -->
    <DeleteEmployeeFromGroupDialog
      :dialog="removeEmployeeFromGroupDialog"
      @close-dialog="dismissConfirmRemoveEmployee"
      @delete-item="removeGroupEmployee()"
    ></DeleteEmployeeFromGroupDialog>
  </v-container>
</template>

<script>
import DeleteEmployeeFromGroupDialog from '../DeleteItemDialog.vue';
import DeleteGroupDialog from '../DeleteItemDialog.vue';
import EditGroupDialog from './create_edit_group.vue';
import { mapActions, mapGetters } from 'vuex';
import showRecordsBy from '../../mixins/showRecordsBy';
import LoadingBar from '../LoadingBar.vue';
import TableTopbar from '../TableTopbar.vue';
import CreaateRoleDialog from './create_role_dialog.vue';

import { searchGroups } from '../../services/modules/group_service';
import lodash from 'lodash';

export default {
  name: 'SettingsGroupsListTable',
  components: {
    EditGroupDialog,
    LoadingBar,
    TableTopbar,
    CreaateRoleDialog,
    DeleteGroupDialog,
    DeleteEmployeeFromGroupDialog,
  },
  mixins: [showRecordsBy],

  props: {
    groups: {
      type: Array,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    employees: {
      type: Array,
      required: true,
    },
    roles: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      colors: ['green', 'purple', 'indigo', 'cyan', 'teal', 'orange'],
      search: null,
      nonce: 1,

      searchTerm: '',
      searchResults: [],
      groupSearchLoader: false,

      valid: true,
      dialog: false,
      createRole: false,
      searchTable: '',
      confirmDeleteDialog: false,
      removeEmployeeFromGroupDialog: false,
      employeeIdToDelete: -1,
      editedGroupIndex: -1,
      dialogDelete: false,
      addEmployeesToGroupDialog: false,
      manageRolesDialog: false,
      clickedGroup: {},
      rolesArr: [],
      editGroupDialog: false,
      model: '',
      proposedGroupEmployees: '',
      defaultProposedGroupEmployees: '',

      newGroup: {
        name: '',
        employeeCount: '',
        role: [],
      },

      defaultGroup: {
        name: '',
        employeeCount: '',
        role: [],
      },

      // pass props for creating the role
      createRoleFormName: 'Role Name',
      newRole: {
        name: '',
      },
      defaultRole: {
        name: '',
      },

      rules: {
        required: (value) => !!value || 'Required.',
      },
    };
  },

  computed: {
    clickedGroupName() {
      return this.clickedGroup.name || this.clickedGroup.title;
    },

    originalGroupRoles() {
      return this.newGroup.role.map((_rol) => {
        return {
          id: _rol.id,
          title: _rol.title,
        };
      });
    },

    // uniqueRoles: {
    //   get() {
    //     return differenceBy(this.roles, this.newGroup.role, 'id');
    //   },
    // },

    // uniqueEmployees() {
    //   return differenceBy(this.groupNonMembers, this.groupUsers, 'id');
    // },

    formTitle() {
      return this.editedGroupIndex === -1
        ? this.$t('createGroupHeadingText')
        : this.$t('editGroupNameHeaderText');
    },

    groupTableHeaders() {
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
          value: 'name',
          class: 'accent--text text-subtitle-2 text-uppercase',
        },
        {
          text: 'manage group employees',
          sortable: false,
          value: 'employeeCount',
          class: 'accent--text text-subtitle-2 text-uppercase',
        },
        {
          text: 'manage roles',
          sortable: false,
          value: 'manageRoles',
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

    // users in a group essentials
    ...mapGetters('groups', {
      groupUsers: 'clickedGroupEmployees',
      groupNonMembers: 'allGroupNonMembers',
    }),

    groupUserTableHeaders() {
      return [
        {
          text: 'ID',
          sortable: false,
          value: 'id',
          class: 'accent--text text-subtitle-2 text-uppercase',
        },
        // {
        //   text: 'role',
        //   sortable: false,
        //   value: 'role',
        //   class: 'accent--text text-subtitle-2 text-uppercase',
        // },
        {
          text: 'username',
          sortable: false,
          value: 'username',
          class: 'accent--text text-subtitle-2 text-uppercase',
        },
        {
          text: 'email',
          sortable: false,
          value: 'email',
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
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
    // uniqueRoles(val) {
    //   this.rolesArr = val;
    // },

    // search
    searchTerm() {
      this.debouncedSearch();
    },

    model(val) {
      this.manageRoles(val);
    },
  },

  methods: {
    ...mapActions('groups', {
      createGroup: 'createGroup',
      updateGroup: 'updateGroup',
      removeGroup: 'delGroup',
      loadGroupEmployees: 'loadGroupEmployees',
      addEmploeesIntoGroup: 'removeOrAddEmploeesIntoGroup',
      removeGroupEmployee: 'removeOrAddEmploeesIntoGroup',
    }),
    ...mapActions('roles_permissions', {
      createExtraRole: 'createRole',
      loadRoles: 'loadRoles',
    }),

    ...mapActions('users_employees', {
      loadUsers: 'loadUsers',
    }),

    debouncedSearch() {
      this.debouncedSearch = lodash.debounce(this.searchData, 500);
    },

    // search
    searchData() {
      this.searchResults = [];
      this.groupSearchLoader = true;
      searchGroups(this.searchTerm)
        .then((res) => {
          this.searchResults = res.map((_res) => {
            return {
              title: _res.company.code + '_' + _res.title,
              description: _res.description,
              id: _res.id,
            };
          });
        })
        .catch(() => {})
        .finally(() => (this.groupSearchLoader = false));
    },

    addARole(data) {
      this.$emit('show-feedback', {
        status: 'submitting',
        message: 'submitting',
      });

      this.createExtraRole({ roles: data })
        .then(() => {
          this.$emit('show-feedback', {
            status: 'success',
            message: 'Role created',
          });
        })
        .catch(() => {
          this.$emit('show-feedback', {
            status: 'fail',
            message: 'Role creation failed',
          });
        })
        .finally(() => {
          this.closeRoleCreatingDialog();
        });
    },

    addMore() {
      this.createRole = true;
    },
    closeRoleCreatingDialog() {
      this.createRole = false;
      // this.$nextTick(() => {
      //   this.newRole = Object.assign({}, this.data);
      // });
    },

    remove(item) {
      const index = this.newGroup.role.indexOf(item.id);
      if (index >= 0) this.newGroup.role.splice(index, 1);
    },

    removeEmployees(item) {
      const index = this.proposedGroupEmployees.indexOf(item.id);
      if (index >= 0) this.proposedGroupEmployees.splice(index, 1);
    },

    validate() {
      return this.$refs.form.validate();
    },

    resetValidation() {
      this.$refs.form.resetValidation();
    },

    launchGroupCreatingDialog() {
      this.dialog = true;
    },

    closeGroupCreatingDialog() {
      this.dialog = false;
      this.createRole = false;
      this.resetValidation();
      this.$nextTick(() => {
        this.newGroup = Object.assign({}, this.defaultGroup);
        this.editedGroupIndex = -1;
      });
    },

    close() {
      this.addEmployeesToGroupDialog = false;
      this.manageRolesDialog = false;
      this.proposedGroupEmployees = '';
      this.$nextTick(() => {
        this.newGroup = Object.assign({}, this.defaultGroup);
        this.editedGroupIndex = -1;
      });
    },

    toggleFilter() {
      this.$emit('update:filter-drawer', !this.filterDrawer);
    },

    saveGroup() {
      // validate
      if (!this.validate()) return;
      // check for edit or existing item
      if (this.editedGroupIndex.length > -1) {
        // update selected group
        this.updateGroupDetails();
      } else {
        // or add a new group
        this.addGroup();
      }
      this.closeGroupCreatingDialog();
    },

    //  create group
    addGroup() {
      if (!this.validate()) return;

      this.$emit('show-feedback', {
        status: 'submitting',
        message: 'submitting',
      });

      const data = this.newGroup.name.map((_titles) => {
        return {
          title: _titles,
          roleIds: this.newGroup.role,
        };
      });
      this.createGroup(data)
        .then(() => {
          this.$emit('show-feedback', {
            status: 'success',
            message: 'Group created',
          });
        })
        .catch(() => {
          this.$emit('show-feedback', {
            status: 'fail',
            message: 'Group creation failed',
          });
        })
        .finally(() => {
          this.loadRoles();
        });
    },

    // edit group
    editGroup(item) {
      this.editedGroupIndex = item.id;
      // get the group roles
      this.$http
        .get(`bms/api/admin/groups/${item.id}/`)
        .then((res) => {
          this.rolesArr = res.data.nonRoles;
          this.newGroup = Object.assign(
            {},
            {
              name: item.name,
              role: res.data.roles,
            }
          );
        })
        .catch((err) => {
          throw err;
        })
        .finally(() => {});
    },

    openGroupEditDialog(item) {
      this.editedGroupIndex = item.id;
      this.newGroup = Object.assign(
        {},
        {
          name: item.name,
          role: [],
        }
      );
      this.editGroupDialog = true;
    },

    // update
    updateGroupDetails() {
      this.$emit('show-feedback', {
        status: 'submitting',
        message: 'submitting',
      });

      let data = {
        title: this.newGroup.name,
        roleIds: this.newGroup.role || [],
      };
      let payload = { id: this.editedGroupIndex, data: data };

      this.updateGroup(payload)
        .then(() => {
          this.$emit('show-feedback', {
            status: 'success',
            message: 'Group updated.',
          });
        })
        .catch(() => {
          this.$emit('show-feedback', {
            status: 'fail',
            message: 'Group update fail.',
          });
        })
        .finally(() => {
          this.closeGroupCreatingDialog;
        });
    },

    // manage roles
    manageRoles(item) {
      if (item != null) {
        this.manageRolesDialog = true;
        this.clickedGroup = item;
        this.editGroup(item);
        this.editedGroupIndex = item.id;
      }
    },

    closeEditGroupDialog() {
      this.manageRolesDialog = false;
      this.editGroupDialog = false;
      this.editedGroupIndex = -1;
      this.$nextTick(() => {
        this.newGroup = Object.assign({}, this.defaultGroup);
      });
    },

    addRoleToRolesArray(item) {
      // check index
      const index = this.rolesArr.map((_rol) => _rol.id).indexOf(item.id);
      if (index >= 0) this.rolesArr.splice(index, 1);

      // remove and add
      this.originalGroupRoles.push(item);
    },

    removeRoleFromRolesArray(item) {
      // check index
      const index = this.originalGroupRoles
        .map((_rol) => _rol.id)
        .indexOf(item.id);
      // remove and add
      if (index >= 0) this.originalGroupRoles.splice(index, 1);
      this.rolesArr.push(item);
    },

    // add or remove group roles
    editGroupRoles() {
      this.$emit('show-feedback', {
        status: 'submitting',
        message: 'updating group roles',
      });

      let data = {
        title: this.newGroup.name,
        roleIds: this.originalGroupRoles.map((_rol) => _rol.id) || [],
      };
      let payload = { id: this.editedGroupIndex, data: data };

      this.updateGroup(payload)
        .then(() => {
          this.$emit('show-feedback', {
            status: 'success',
            message: 'Group roles updated.',
          });
        })
        .catch(() => {
          this.$emit('show-feedback', {
            status: 'fail',
            message: 'Group role update failed.',
          });
        })
        .finally(() => {
          this.closeEditGroupDialog();
        });
    },

    // view group employees
    viewGroupEmployees(item) {
      this.loadGroupEmployees(item.id);
      this.editedGroupIndex = item.id;
      this.addEmployeesToGroupDialog = true;
    },

    launchConfirmRemoveGroupEmployeeDialog(item) {
      this.removeEmployeeFromGroupDialog = true;
      this.employeeIdToDelete = item.id;
    },

    // ad employees to group
    saveEmployeeIntoGroup() {
      this.$emit('show-feedback', {
        status: 'submitting',
        message: 'submitting',
      });

      let data = {
        action: 'add',
        employeeIds: this.proposedGroupEmployees,
      };

      let payload = { id: this.editedGroupIndex, data: data };
      this.addEmploeesIntoGroup(payload)
        .then(() => {
          this.$emit('show-feedback', {
            status: 'success',
            message: 'Employees add successful.',
          });
        })
        .catch(() => {
          this.$emit('show-feedback', {
            status: 'fail',
            message: 'Employee add failed',
          });
        })
        .finally(() => {
          this.loadGroupEmployees(this.editedGroupIndex);
          this.loadUsers();
          this.proposedGroupEmployees = '';
        });
    },

    // remove employees from group
    removeGroupEmployee() {
      this.dismissConfirmRemoveEmployee();
      this.$emit('show-feedback', {
        status: 'submitting',
        message: 'submitting',
      });
      let data = {
        action: 'remove',
        employeeIds: [this.employeeIdToDelete],
      };

      let payload = { id: this.editedGroupIndex, data: data };
      this.addEmploeesIntoGroup(payload)
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
          this.loadGroupEmployees(this.editedGroupIndex);
          this.loadUsers();
        });
    },

    dismissConfirmRemoveEmployee() {
      this.removeEmployeeFromGroupDialog = false;
      // this.editedGroupIndex = -1;
    },

    // delete group
    launchconfirmDeleteDialog(item) {
      this.confirmDeleteDialog = true;
      this.editedGroupIndex = item.id;
    },

    dismissConfirmDelete() {
      this.confirmDeleteDialog = false;
      this.editedGroupIndex = -1;
    },

    deleteGroup() {
      this.$emit('show-feedback', {
        status: 'submitting',
        message: 'submitting',
      });
      this.removeGroup(this.editedGroupIndex)
        .then(() => {
          this.$emit('show-feedback', {
            status: 'success',
            message: 'Group deleted.',
          });
          this.dismissConfirmDelete();
        })
        .catch(() => {
          this.$emit('show-feedback', {
            status: 'fail',
            message: 'Group deletion failed.',
          });
        })
        .finally(() => {
          this.loadRoles();
          this.loadUsers();
        });
    },
  },
};
</script>

<style lang="scss">
.v-card__title {
  color: blue;
}
.my-list {
  height: calc(100vh - 200px);
  overflow-y: auto;
}
.set-max-width {
  min-width: 350px;
  max-width: 600px;
}
</style>
