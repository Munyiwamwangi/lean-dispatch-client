<template>
  <div>
    <RidersComponent
      :tab="tab"
      :privateRiders="privateRiders"
      :loading="ridersLoader"
      :filter-drawer.sync="filterDrawer"
      @show-feedback="showFeedback"
    ></RidersComponent>

    <FeedbackSnackBar
      :show-snack.sync="feedbackSnackShowing"
      :snack-text="feedbackSnackText"
      :snack-color="feedbackSnackColor"
    ></FeedbackSnackBar>
  </div>
</template>

<script>
import RidersComponent from "../../components/riders/Riders.vue";
import FeedbackSnackBar from "@/components/FeedbackSnackBar";
import { mapGetters } from "vuex";

export default {
  name: "MainDashBoard",
  drawer: null,
  filterDrawer: false,
  components: {
    RidersComponent,
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
    ...mapGetters("riders", {
      privateRiders: "privateRiders",
      ridersLoader: "ridersLoader",
    }),
    ...mapGetters("orders", {
      orders: "allOrders",
      ordersLoader: "ordersLoader",
    }),
  },

  watch: {
    tab(val) {
      this.tab = val;
    },
  },

  created() {
    this.$store.dispatch("riders/loadPrivateRiders");
    this.$store.dispatch("customers/loadCustomers");
    this.$store.dispatch("orders/loadOrders");
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
