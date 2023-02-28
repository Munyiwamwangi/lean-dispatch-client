<template>
  <div>
    <v-toolbar color="#f8f8f8" dense>
      <v-toolbar-title class="secondary--text text-subtitle-2 text-capitalize">
        Accounts
      </v-toolbar-title>
    </v-toolbar>

    <v-spacer></v-spacer>

    <v-tabs v-model="tab">
      <v-tab class="ml-4 text-uppercase">Orders</v-tab>
      <!-- <v-tab class="ml-4 text-uppercase">Vendors</v-tab> -->
      <v-tab class="ml-4 text-uppercase">Drivers</v-tab>
      <v-tab class="ml-4 text-uppercase">Merchants</v-tab>

      <!-- audit log -->

      <v-tab-item>
        <OrdersComponent
          :tab="tab"
          :filter-drawer.sync="filterDrawer"
          @show-feedback="showFeedback"
        ></OrdersComponent>
      </v-tab-item>

      <!-- <v-tab-item>
        <VendorsComponent
          :tab="tab"
          :filter-drawer.sync="filterDrawer"
          @show-feedback="showFeedback"
        ></VendorsComponent>
      </v-tab-item> -->

      <v-tab-item>
        <DriversComponent
          :tab="tab"
          :filter-drawer.sync="filterDrawer"
          @show-feedback="showFeedback"
        ></DriversComponent>
      </v-tab-item>

      <v-tab-item>
        <Merchants
          :tab="tab"
          :filter-drawer.sync="filterDrawer"
          :allMerchants="allMerchants"
          @show-feedback="showFeedback"
        ></Merchants>
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
import DriversComponent from "../../components/account-management/Drivers.vue";
import OrdersComponent from "../../components/account-management/Orders.vue";
// import VendorsComponent from "../../components/account-management/Vendors.vue";
import Merchants from "../../components/account-management/Merchants.vue";

import { mapGetters } from "vuex";
import FeedbackSnackBar from "@/components/FeedbackSnackBar";

export default {
  name: "MainDashBoard",
  drawer: null,
  filterDrawer: false,
  components: {
    DriversComponent,
    OrdersComponent,
    // VendorsComponent,
    Merchants,
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
    ...mapGetters("merchants", {
      allMerchants: "allMerchants",
      loading: "loadingMerchants",
    }),
  },

  watch: {
    tab(val) {
      this.tab = val;
    },
  },

  created() {
    this.$store.dispatch("merchants/loadMerchants");
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
