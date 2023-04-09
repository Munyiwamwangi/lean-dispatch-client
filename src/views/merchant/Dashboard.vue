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
      <v-tab class="ml-4 text-uppercase">Riders</v-tab>
      <v-tab class="ml-4 text-uppercase">customers</v-tab>

      <!-- audit log -->

      <v-tab-item>
        <OrdersComponent
          :tab="tab"
          :orders="orders"
          :loading="ordersLoader"
          :customers="allCustomers"
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
        <RidersComponent
          :tab="tab"
          :privateRiders="privateRiders"
          :loading="ridersLoader"
          :filter-drawer.sync="filterDrawer"
          @show-feedback="showFeedback"
        ></RidersComponent>
      </v-tab-item>

      <v-tab-item>
        <Customers
          :tab="tab"
          :filter-drawer.sync="filterDrawer"
          :loading="loadingCustomers"
          :allCustomers="allCustomers"
          @show-feedback="showFeedback"
        ></Customers>
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
import RidersComponent from "../../components/riders/Riders.vue";
import OrdersComponent from "../../components/orders/Orders";
import Customers from "../../components/customers/Customers.vue";

import { mapGetters } from "vuex";
import FeedbackSnackBar from "@/components/FeedbackSnackBar";

export default {
  name: "MainDashBoard",
  drawer: null,
  filterDrawer: false,
  components: {
    RidersComponent,
    OrdersComponent,
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
