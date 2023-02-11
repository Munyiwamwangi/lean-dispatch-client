<template>
  <div>
    <v-toolbar color="#f8f8f8" dense>
         <v-toolbar-title class="secondary--text text-subtitle-2 text-capitalize">
        {{ $t('userManagementText') }}
      </v-toolbar-title>
    </v-toolbar>
    <v-spacer></v-spacer>
    <v-tabs>
      <v-tab class="ml-4">users</v-tab>
      <v-tab class="ml-4">groups</v-tab>
      <v-tab class="ml-4">Roles & Permissions</v-tab>

      <!-- users  -->
      <v-tab-item>
        <UserTableComponent
          :users="users"
          :loading="loadingUsers"
          @show-feedback="showFeedback"
        ></UserTableComponent>
      </v-tab-item>
      <!-- groups  -->
      <v-tab-item>
        <SettingsGroupsListTable
          :groups="groups"
          :roles="roles"
          :employees="employees"
          :loading="loadingGroups"
          @show-feedback="showFeedback"
        ></SettingsGroupsListTable>
      </v-tab-item>
      <!-- roles -->
      <v-tab-item>
        <RolesTableComponent
          :roles="roles"
          :roledetail="roledetail"
          :loading="loadingRoles"
          @show-feedback="showFeedback"
        ></RolesTableComponent>
      </v-tab-item>
    </v-tabs>
    <FeedbackSnackBar
      :show-snack.sync="feedbackSnackShowing"
      :snack-text="feedbackSnackText"
      :snack-color="feedbackSnackColor"
    ></FeedbackSnackBar>
  </div>
</template>

<script>
import UserTableComponent from '../../../components/user-access-management/users.vue';
import SettingsGroupsListTable from '../../../components/user-access-management/groups.vue';
import RolesTableComponent from '../../../components/user-access-management/roles.permissions.vue';

import FeedbackSnackBar from '@/components/FeedbackSnackBar';
import { mapGetters } from 'vuex';

export default {
  name: 'UsersGroupsAndRoles',
  components: {
    UserTableComponent,
    SettingsGroupsListTable,
    RolesTableComponent,
    FeedbackSnackBar,
  },

  data() {
    return {
      feedbackSnackShowing: false,
      feedbackSnackColor: '',
      feedbackSnackText: '',
    };
  },
  computed: {
    ...mapGetters('groups', {
      groups: 'allGroups',
      loadingGroups: 'loadingGroups',
    }),

    ...mapGetters('roles_permissions', {
      roles: 'allRoles',
      roledetail: 'roleDetail',
      loadingRoles: 'loadingRoles',
    }),

    ...mapGetters('users_employees', {
      employees: 'allEmployees',
      users: 'allUsers',
      loadingEmployees: 'loadingEmployees',
      loadingUsers: 'loadingUsers',
    }),
  },

  beforeCreate() {
    this.$store.dispatch('users_employees/loadEmployees');
    this.$store.dispatch('groups/loadGroups');
    this.$store.dispatch('roles_permissions/loadRoles');
    this.$store.dispatch('users_employees/loadUsers');
  },

  methods: {
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
