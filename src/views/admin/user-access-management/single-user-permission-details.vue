<template>
  <div>
    <UserDetails
      :loading="loadingUsers"
      @show-feedback="showFeedback"
    ></UserDetails>
  </div>
</template>

<script>
import UserDetails from '../../../components/user-access-management/UserDetails.vue';
import { mapGetters } from 'vuex';

export default {
  name: 'UserPermissionDetails',
  components: {
    UserDetails,
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
      loadingUsers: 'loadingUsers',
    }),
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
