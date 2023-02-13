<template>
  <div>Account Management</div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "LogsView",
  drawer: null,
  filterDrawer: false,
  components: {},

  data() {
    return {
      // filter
      filterDrawer: false,
      filterCompany: "",
      filterById: null,
      filterBonusCode: "",

      feedbackSnackShowing: false,
      feedbackSnackColor: "",
      feedbackSnackText: "",

      // tab items
      tab: 0,
    };
  },

  computed: {
    ...mapGetters("logs", {
      LoginTrailLogDetail: "loginTrailLog",
      loading: "loadingLoginTrail",
      auditLogDetail: "auditTrailLog",
    }),
  },

  watch: {
    tab(val) {
      this.tab = val;
    },
  },

  created() {
    // this.$store.dispatch("logs/loadLoginTrail");
    // this.$store.dispatch("logs/loadAuditTrail");
  },

  methods: {
    closeFilterSidebar() {
      this.filterDrawer = false;
    },
    showFeedback({ status, message }) {
      let snackColor = "";
      if (status === "submitting") {
        snackColor = "info";
      } else if (status === "success") {
        snackColor = "success lighten-1";
      } else if (status === "fail") {
        snackColor = "red lighten-1";
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
