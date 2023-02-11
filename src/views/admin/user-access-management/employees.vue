<template>
  <div>
    <v-toolbar color="#f8f8f8" dense flat>
      <v-toolbar-title class="secondary--text text-subtitle-2 text-capitalize">
        {{ $t('employeeText') }}s
      </v-toolbar-title>
    </v-toolbar>
    <EmpoyeesTableComponent
      :companies-departments="companiesDepartments"
      :employee-types="employeeTypes"
      :companies="companies"
      :employees="employees"
      :loading="loadingEmployees"
      @show-feedback="showFeedback"
    ></EmpoyeesTableComponent>

    <!-- feedback snack component  -->
    <FeedbackSnackBar
      :show-snack.sync="feedbackSnackShowing"
      :snack-text="feedbackSnackText"
      :snack-color="feedbackSnackColor"
    ></FeedbackSnackBar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import EmpoyeesTableComponent from '../../../components/user-access-management/employees.vue';
import FeedbackSnackBar from '@/components/FeedbackSnackBar';

export default {
  name: 'EmployeesView',
  components: {
    EmpoyeesTableComponent,
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
    ...mapGetters('users_employees', {
      employees: 'allEmployees',
      employeeTypes: 'allEmployeeTypes',
      loadingEmployees: 'loadingEmployees',
      companiesDepartments: 'companiesDepartments',
    }),
    ...mapGetters('common', {
      companies: 'allCompanies',
    }),
  },

  created() {
    this.$store.dispatch('users_employees/loadCompaniesAndDepartments');
    this.$store.dispatch('users_employees/loadEmployees(limit=25, offset=25)');
    this.$store.dispatch('users_employees/loadEmployeeTypes');
    this.$store.dispatch('common/loadCompanies');
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
