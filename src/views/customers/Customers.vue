<template>
  <div>
    <Customers
      :tab="tab"
      :filter-drawer.sync="filterDrawer"
      :loading="loadingCustomers"
      :allCustomers="allCustomers"
      @show-feedback="showFeedback"
    ></Customers>

    <FeedbackSnackBar
      :show-snack.sync="feedbackSnackShowing"
      :snack-text="feedbackSnackText"
      :snack-color="feedbackSnackColor"
    ></FeedbackSnackBar>
  </div>
</template>

<script>
import Customers from "../../components/customers/Customers.vue";
import FeedbackSnackBar from "@/components/FeedbackSnackBar";
import { mapGetters } from "vuex";

export default {
  name: "MainDashBoard",
  drawer: null,
  filterDrawer: false,
  components: {
    Customers,
    FeedbackSnackBar,
  },

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
    ...mapGetters("customers", {
      allCustomers: "allCustomers",
      loadingCustomers: "loadingCustomers",
    }),
  },

  watch: {
    tab(val) {
      this.tab = val;
    },
  },

  created() {
    this.$store.dispatch("customers/loadCustomers");
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
