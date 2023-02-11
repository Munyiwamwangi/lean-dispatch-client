<template>
  <v-container fluid>
    <v-data-table
      :headers="rolesTableHeaders"
      :items="roles"
      :search="searchTable"
      :loading="loading"
      :items-per-page="itemPerPage.value"
      hide-default-footer
      class="elevation-1"
      :loading-text="$t('dataLoadingText')"
      :no-data-text="$t('noDataTextForTables')"
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
                <v-btn
                  color="primary"
                  class="text-capitalize"
                  @click="launchRoleCreatingDialog()"
                >
                  <v-icon left>mdi-plus </v-icon>
                  Add new role
                </v-btn>
              </template>
              <template #trailing>
                <v-autocomplete
                  v-model="model"
                  :search-input.sync="searchTerm"
                  :items="searchResults"
                  :label="$t('searchTextTranslate')"
                  single-line
                  item-text="title"
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
                            <v-list-item-title
                              >{{ data.item.title }}
                            </v-list-item-title>
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

        <EditRoleDialog
          :dialog="editRoleDialog"
          :form-title="roleFormTitle"
          :new-group="newRole"
          :default-group="defaultRole"
          @send-group-data="updateRoleDetails"
          @close-dialog="closeRoleEditDialog"
        >
        </EditRoleDialog>

        <!-- <ReusableGroupCreateForm
          :title="formTitle"
          :roles="roles"
          :dialog="createGroupDialog"
          @close-dialog="closeGroupCreatingDialog"
          @send-group-data="addGroup"
        ></ReusableGroupCreateForm> -->

        <v-row>
          <!-- create role dialog  -->
          <v-dialog v-model="createRoleDialog" max-width="450px">
            <v-card outlined>
              <v-form ref="form" v-model="valid" lazy-validation>
                <v-card-text>
                  <v-list-item-title class="accent--text text-capitalize mb-2">
                    <h4>Role Name <span style="color: #a31515"> * </span></h4>
                  </v-list-item-title>
                  <v-combobox
                    v-model="newRole.name"
                    :search-input.sync="syncRole"
                    :hide-no-data="!syncRole"
                    append-icon=""
                    solo
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
                        <span class="subheading">Save: </span>
                        <v-chip :color="`${colors[nonce - 1]} lighten-3`" small>
                          {{ syncRole }}
                        </v-chip>
                        <span>
                          Or press <kbd>Enter</kbd> to create multiple
                          roles</span
                        >
                      </v-list-item>
                    </template>
                  </v-combobox>

                  <v-card-actions class="pt-0 mt-0">
                    <v-spacer></v-spacer>
                    <v-btn
                      color="accent"
                      text
                      class="text-capitalize"
                      @click="closeRoleCreatingDialog()"
                    >
                      {{ $t('cancelButtonText') }}
                    </v-btn>
                    <v-btn
                      color="accent"
                      class="text-capitalize"
                      :disabled="!valid"
                      @click="saveRole()"
                    >
                      {{ $t('saveButtonText') }}
                    </v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-form>
            </v-card>
          </v-dialog>
        </v-row>
      </template>

      <template #[`item.permissions`]="{ item }">
        <v-btn text rounded>
          <span
            class="force_blue text-capitalize"
            link
            @click="getRoleDetails(item)"
          >
            manage permissions
          </span>
        </v-btn>
      </template>

      <!-- ids slot -->
      <template #[`item.id`]="props">
        {{ props.index + 1 }}
      </template>

      <!-- group name slot  -->
      <template #[`item.groupName`]="{ item }">
        <div v-if="item.groupName.length > 0">
          <v-chip>
            <span class="text-capitalize">{{ item.groupName[0] }}</span>
            <v-badge
              v-if="item.groupName.length > 1"
              color="error"
              bordered
              :content="` +${item.groupName.length - 1}`"
              class="mx-4"
            >
            </v-badge>
          </v-chip>
        </div>
        <div v-else>
          <v-btn text rounded>
            <span
              class="force_blue text-capitalize"
              link
              @click="launchAddRoleToGroupDialog(item)"
            >
              Add Group
              <!-- launchAddRoleToGroupDialog -->
              <!-- launchCreateGroupDialog  -->
            </span>
          </v-btn>
        </div>
      </template>

      <!-- actions slot -->
      <template #[`item.actions`]="{ item }">
        <v-icon small color="green" class="mr-4" @click="editRole(item)">
          mdi-pencil
        </v-icon>
        <v-icon small color="red" @click="launchconfirmDeleteDialog(item)">
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>

    <!-- assign group to a role  -->
    <v-dialog v-model="addGroupToRoleDialog" class="mx-auto" max-width="550px">
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-card>
          <v-card-title class="accent--text text-capitalize">
            Add Group(s)
          </v-card-title>

          <v-card-text>
            <v-text-field
              v-model="newRole.name"
              :label="$t('roleNameTranslate')"
              :rules="[rules.required]"
              dense
              outlined
              rounded
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
                  {{ data.item.roleName }}
                </v-chip>
              </template>
            </v-text-field>

            <v-combobox
              v-model="newGroup.name"
              :items="groups"
              item-text="name"
              item-value="id"
              :label="$t('groupNameTranslate')"
              :search-input.sync="search"
              :hide-no-data="!search"
              dense
              multiple
              persistent-hint
              small-chips
              outlined
              rounded
              :rules="[rules.required]"
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
                  {{ data.item.name }}
                </v-chip>
              </template>

              <!-- <template v-slot:no-data> -->
              <!-- <v-list-item>
                  <span class="subheading">Save</span>
                  <v-chip :color="`${colors[nonce - 1]} lighten-3`" small>
                    {{ search }}
                  </v-chip>
                  <span>
                    Or press <kbd>enter</kbd> to create multiple groups</span
                  >
                </v-list-item> -->
              <!-- </template> -->
            </v-combobox>

            <v-card-actions class="pt-0 mt-0">
              <v-spacer></v-spacer>
              <v-btn
                class="text-capitalize"
                text
                @click="closeAddRoleToGroupDialog()"
              >
                {{ $t('cancelButtonText') }}
              </v-btn>
              <v-btn
                color="accent"
                :disabled="!valid"
                class="text-capitalize"
                @click="attachRoleToGroup()"
              >
                {{ $t('saveButtonText') }}
              </v-btn>
            </v-card-actions>
          </v-card-text>
        </v-card>
      </v-form>
    </v-dialog>

    <v-dialog v-model="managePermissionsDialog" max-width="800px">
      <v-card flat active-class="red" outlined height="500px" class="my-list">
        <v-container>
          <v-row justify="center">
            <v-card-title class="text-h5 accent--text">
              Manage Permissions: {{ selectedRoleName }}
            </v-card-title>
          </v-row>
          <v-card-text>
            <v-row no-gutters class="pb-4">
              <v-col
                cols="12"
                md="4"
                class="accent--text text-subtitle-2 text-uppercase"
                >Content Type
              </v-col>
              <v-col
                cols="12"
                md="2"
                class="accent--text text-subtitle-2 text-uppercase"
                >View
              </v-col>
              <v-col
                cols="12"
                md="2"
                class="accent--text text-subtitle-2 text-uppercase"
                >Create
              </v-col>
              <v-col
                cols="12"
                md="2"
                class="accent--text text-subtitle-2 text-uppercase"
                >Edit
              </v-col>
              <v-col
                cols="12"
                md="2"
                class="accent--text text-subtitle-2 text-uppercase"
                >Delete
              </v-col>
            </v-row>

            <v-divider></v-divider>

            <v-card flat>
              <!-- <v-row justify="end" class="">
                <div style="position: fixed">
                  <v-btn
                    fab
                    dark
                    color="accent"
                    class="mx-2"
                    @click="closeRoleManageDialogue()"
                  >
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </div>
              </v-row> -->
              <v-list dense>
                <v-list-item>
                  <v-list-item-content>
                    <div v-for="item in ojectPermissions" :key="item.id">
                      <!-- {{ item }} -->
                      <v-row>
                        <v-col cols="12" md="4" class="mt-5 text-capitalize">
                          <span>
                            {{ item.object }}
                          </span>
                        </v-col>
                        <v-col cols="12" md="2">
                          <v-checkbox
                            v-model="item.read"
                            @change="updatePerm(item)"
                          ></v-checkbox
                        ></v-col>
                        <v-col cols="12" md="2">
                          <v-checkbox
                            v-model="item.create"
                            @change="updatePerm(item)"
                          ></v-checkbox
                        ></v-col>
                        <v-col cols="12" md="2">
                          <v-checkbox
                            v-model="item.update"
                            @change="updatePerm(item)"
                          ></v-checkbox>
                        </v-col>
                        <v-col cols="12" md="2">
                          <v-checkbox
                            v-model="item.delete"
                            @change="updatePerm(item)"
                          ></v-checkbox>
                        </v-col>
                      </v-row>
                      <v-divider></v-divider>
                    </div>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card>
            <v-card-actions class="pb-0">
              <v-spacer></v-spacer>
              <v-btn
                color="accent"
                class="mr-2"
                @click="closeRoleManageDialogue()"
              >
                {{ $t('closeButtonText') }}
              </v-btn>
            </v-card-actions>
          </v-card-text>
        </v-container>
      </v-card>
    </v-dialog>

    <!-- delete dialog  -->
    <v-dialog v-model="confirmDeleteDialog" max-width="500px">
      <v-card class="text-center">
        <v-card-text class="py-4">
          <v-icon color="secondary" dark size="64"> mdi-alert-outline </v-icon>
        </v-card-text>
        <v-card-text class="text-h6">
          {{ $t('deleteItemTextTranslate') }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="accent darken-1" text @click="dismissConfirmDelete()">
            {{ $t('cancelButtonText') }}
          </v-btn>
          <v-btn color="secondary darken-1" text @click="deleteRole">
            {{ $t('removeButtonText') }}
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { isEqual, uniq } from 'lodash';
import showRecordsBy from '../../mixins/showRecordsBy';
import LoadingBar from '../LoadingBar.vue';
import TableTopbar from '../TableTopbar.vue';
import { mapActions, mapGetters } from 'vuex';
import EditRoleDialog from './create_edit_group.vue';
import { searchRoles } from '../../services/modules/roles_permissions_service';
import lodash from 'lodash';
// import ReusableGroupCreateForm from './create_group_form.vue';

export default {
  name: 'RolesTableComponent',
  components: {
    LoadingBar,
    TableTopbar,
    EditRoleDialog,
    // ReusableGroupCreateForm,
  },
  mixins: [showRecordsBy],
  props: {
    roles: {
      type: Array,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    roledetail: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      syncRole: null,
      colors: ['green', 'purple', 'indigo', 'cyan', 'teal', 'orange'],
      nonce: 1,
      search: null,

      searchTerm: '',
      searchResults: [],

      valid: true,
      createRoleDialog: false,
      managePermissionsDialog: false,
      confirmDeleteDialog: false,
      deleteDialog: false,
      editedRoleIndex: -1,
      oldObjectPermissionsState: [],
      selected: false,
      createGroupDialog: false,
      addGroupToRoleDialog: false,
      searchTable: '',
      editRoleDialog: false,
      model: null,
      selectedRole: '',

      newGroup: {
        name: '',
        employeeCount: '',
        role: '',
      },

      defaultGroup: {
        name: '',
        employeeCount: '',
        role: '',
      },

      newRole: {
        name: '',
      },
      defaultRole: {
        name: '',
      },

      defaultPermissionObject: {
        create: false,
        read: false,
        update: false,
        delete: false,
      },

      rules: {
        required: (value) => !!value || 'Required.',
      },
    };
  },
  computed: {
    ...mapGetters('roles_permissions', {
      ojectPermissions: 'roleDetail',
    }),

    ...mapGetters('groups', {
      groups: 'allGroups',
    }),

    formTitle() {
      return this.editedGroupIndex === -1
        ? this.$t('createGroupHeadingText')
        : this.$t('editGroupNameHeaderText');
    },

    selectedRoleName() {
      return this.selectedRole.roleName || '';
    },

    roleFormTitle() {
      return 'Edit Role';
    },
    rolesTableHeaders() {
      return [
        {
          text: 'ID',
          sortable: false,
          value: 'id',
          class: 'accent--text text-subtitle-2 text-uppercase',
        },
        {
          text: 'role',
          sortable: false,
          value: 'roleName',
          class: 'accent--text text-subtitle-2 text-uppercase',
        },
        {
          text: 'permissions',
          sortable: false,
          value: 'permissions',
          class: 'accent--text text-subtitle-2 text-uppercase',
        },
        {
          text: 'group name',
          sortable: false,
          value: 'groupName',
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
    // search
    searchTerm() {
      this.debouncedSearch();
    },

    model(item) {
      this.getRoleDetails(item);
    },
  },

  mounted() {
    this.debouncedSearch = lodash.debounce(this.searchData, 500);
  },

  methods: {
    ...mapActions('roles_permissions', {
      createRole: 'createRole',
      updateRole: 'updateRole',
      removeRole: 'delRole',
      loadRoles: 'loadRoles',
      loadObjectPermissions: 'loadObjectPermissions',
    }),

    ...mapActions('groups', {
      createGroup: 'createGroup',
    }),

    // search
    searchData() {
      searchRoles(this.searchTerm)
        .then((res) => {
          this.searchResults = res;
        })
        .catch(() => {});
    },

    remove(item) {
      const index = this.newGroup.name
        .map((_test) => _test.id)
        .indexOf(item.id);
      console.log(index);
      console.log(item.id);
      let fullArr = this.newGroup.name.flatMap((_tst) => _tst.id);
      console.log('full aarray', fullArr);

      if (index >= 0)
        this.newGroup.name.map((_test) => _test.id).splice(index, 1);
    },

    launchAddRoleToGroupDialog(item) {
      this.editedRoleIndex = item.id;
      this.newRole = Object.assign(
        {},
        {
          name: item.roleName,
        }
      );
      this.addGroupToRoleDialog = true;
    },

    closeAddRoleToGroupDialog() {
      this.$nextTick(() => {
        this.editedRoleIndex = -1;
        this.newRole = Object.assign({}, this.defaultRole);
      });
      this.addGroupToRoleDialog = false;
    },

    launchCreateGroupDialog(item) {
      this.newRole = Object.assign({}, item);
      this.createGroupDialog = true;
    },

    closeGroupCreatingDialog() {
      this.createGroupDialog = false;
    },

    // create group from roles table
    addGroup(data) {
      this.$emit('show-feedback', {
        status: 'submitting',
        message: 'submitting',
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
          }).finally(() => {});
        });
    },

    launchconfirmDeleteDialog(item) {
      this.confirmDeleteDialog = true;
      this.editedRoleIndex = item.id;
    },

    dismissConfirmDelete() {
      this.confirmDeleteDialog = false;
      this.$nextTick(() => {
        this.newRole = Object.assign({}, this.defaultRole);
        this.editedRoleIndex = -1;
      });
    },

    validate() {
      return this.$refs.form.validate();
    },

    resetValidation() {
      this.$refs.form.resetValidation();
    },

    toggleFilter() {
      this.$emit('update:filter-drawer', !this.filterDrawer);
    },

    launchRoleCreatingDialog() {
      this.createRoleDialog = true;
    },

    closeRoleEditDialog() {
      this.editRoleDialog = false;
      this.$nextTick(() => {
        this.editedRoleIndex = -1;
        Object.keys(this.newRole).forEach((key) => delete this.newRole[key]);
      });
    },

    closeRoleCreatingDialog() {
      this.createRoleDialog = false;
      this.resetValidation();
      this.$nextTick(() => {
        this.editedRoleIndex = -1;
        Object.keys(this.newRole).forEach((key) => delete this.newRole[key]);
      });
    },

    saveRole() {
      // validate
      if (!this.validate()) return;
      // check for edit or existing item
      if (this.editedRoleIndex.length > -1) {
        // update selected role
        this.updateRoleDetails();
      } else {
        // or add a new rolw
        this.addRole();
      }
      this.closeRoleCreatingDialog();
    },

    //  add role
    addRole() {
      this.$emit('show-feedback', {
        status: 'submitting',
        message: 'submitting',
      });

      const data = this.newRole.name.map((_titles) => {
        return {
          title: _titles,
        };
      });

      this.createRole({ roles: data })
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

    // edit
    editRole(item) {
      this.editedRoleIndex = item.id;
      this.newRole = Object.assign(
        {},
        {
          name: item.roleName,
        }
      );
      this.editRoleDialog = true;
    },
    // update
    updateRoleDetails() {
      this.$emit('show-feedback', {
        status: 'submitting',
        message: 'submitting',
      });

      let data = {
        title: this.newRole.name,
      };
      let payload = { id: this.editedRoleIndex, data: data };

      this.updateRole(payload)
        .then(() => {
          this.$emit('show-feedback', {
            status: 'success',
            message: 'Role updated.',
          });
        })
        .catch(() => {
          this.$emit('show-feedback', {
            status: 'fail',
            message: 'Role update fail.',
          });
        });
    },

    // attach group to role
    attachRoleToGroup() {
      this.$emit('show-feedback', {
        status: 'submitting',
        message: 'submitting',
      });

      let data = {
        action: 'add',
        groupIds: this.newGroup.name.map((_grpId) => _grpId.id),
      };

      this.$http
        .patch(`bms/api/admin/roles/${this.editedRoleIndex}/attachGroup/`, data)
        .then(() => {
          this.$emit('show-feedback', {
            status: 'success',
            message: 'Role updated.',
          });
        })
        .catch(() => {
          this.$emit('show-feedback', {
            status: 'fail',
            message: 'Role update fail.',
          });
        })
        .finally(() => {
          this.loadRoles();
          this.closeAddRoleToGroupDialog();
        });
    },

    // delete
    deleteRole() {
      this.dismissConfirmDelete();
      this.$emit('show-feedback', {
        status: 'submitting',
        message: 'submitting',
      });
      this.removeRole(this.editedRoleIndex)
        .then(() => {
          this.$emit('show-feedback', {
            status: 'success',
            message: 'Role deleted.',
          });
        })
        .catch(() => {
          this.$emit('show-feedback', {
            status: 'fail',
            message: 'Role deletion failed.',
          });
        });
    },

    addMore() {
      console.log('additional role');
    },

    saveRolePermissions(item) {
      console.log('editted permisions', item);
      this.managePermissionsDialog = false;
    },
    launchPermissionEdittingDialog() {
      this.managePermissionsDialog = true;
    },
    closeRoleManageDialogue() {
      this.managePermissionsDialog = false;
    },

    getRoleDetails(item) {
      if (item != null) {
        this.selectedRole = item;
        this.launchPermissionEdittingDialog();
        this.oldObjectPermissionsState = this.ojectPermissions;
        this.loadObjectPermissions(item.id);
        this.editedRoleIndex = item.id;
      }
    },

    updatePerm(item) {
      // find the older state of the clicked item
      let olderObject = this.oldObjectPermissionsState.find(
        (x) => x.id === item.id
      );

      // compare the older and new state to figure out what exactly changed
      const getUpdatedKey = (oldData, newData) => {
        const data = uniq([...Object.keys(oldData), ...Object.keys(newData)]);

        for (const key of data) {
          if (!isEqual(oldData[key], newData[key])) {
            return key;
          }
        }

        return null;
      };
      let changedValue = getUpdatedKey(olderObject, item);
      let alteredValue = item[changedValue];

      let data = {
        action: alteredValue ? 'add' : 'remove',
        model: item.object,
        kind: changedValue,
      };

      this.$http
        .patch(
          `bms/api/admin/roles/${this.editedRoleIndex}/attachPermission/`,
          data
        )
        .then(() => {})
        .catch((err) => {
          throw err;
        })
        .finally(() => {
          changedValue = '';
          alteredValue = '';
          item = this.defaultPermissionObject;
          olderObject = this.defaultPermissionObject;
          this.oldObjectPermissionsState = this.ojectPermissions;
          this.loadObjectPermissions(this.editedRoleIndex);
        });
    },
  },
};
</script>

<style lang="scss">
.my-list {
  height: calc(100vh - 300px);
  overflow-y: scroll;
}
</style>
