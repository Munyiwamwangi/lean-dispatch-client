<template>
  <v-data-table
    :headers="headers"
    :items="orders"
    :loading="loading"
    sort-by="calories"
    class="elevation-1"
    hide-default-footer
    show-select
    checkbox-color="blue"
  >
    <template slot="progress">
      <LoadingBar></LoadingBar>
    </template>

    <!-- <template #[`item.id`]="props">
      {{ props.index + 1 }}
    </template> -->

    <template v-slot:top>
      <v-container fluid>
        <v-row align-content="center" justify="center">
          <v-col cols="12" md="3" sm="6">
            <v-card outlined flat>
              <v-card-text>
                <v-toolbar flat>
                  <v-card-title>Ongoing</v-card-title>
                  <v-spacer></v-spacer>
                  <v-icon> mdi-walk </v-icon>
                </v-toolbar>
                <v-col cols="12" md="6">
                  <v-card-title> {{ orders.length }} </v-card-title>
                </v-col>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="3" sm="6">
            <v-card outlined flat>
              <v-card-text>
                <v-toolbar flat>
                  <v-card-title>Delivered</v-card-title>
                  <v-spacer></v-spacer>
                  <v-icon color="green"> mdi-check-circle</v-icon>
                </v-toolbar>
                <v-col cols="12" md="6">
                  <v-card-title> {{ orders.length }} </v-card-title>
                </v-col>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="3" sm="6">
            <v-card outlined flat>
              <v-card-text>
                <v-toolbar flat>
                  <v-card-title>Customers</v-card-title>
                  <v-spacer></v-spacer>
                  <v-icon color="amber"> mdi-account-circle-outline </v-icon>
                </v-toolbar>
                <v-col cols="12" md="6">
                  <v-card-title> {{ customers.length }} </v-card-title>
                </v-col>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="3" sm="6">
            <v-card outlined flat>
              <v-card-text>
                <v-toolbar flat>
                  <v-card-title>Drivers</v-card-title>
                  <v-spacer></v-spacer>
                  <v-icon color="primary"> mdi-car </v-icon>
                </v-toolbar>
                <v-col cols="12" md="6">
                  <v-card-title> {{ orders.length }} </v-card-title>
                </v-col>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
      <v-divider></v-divider>

      <v-toolbar flat>
        <v-toolbar-title>
          <v-btn color="primary" dark @click="openDialog"> + New Order </v-btn>
        </v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>

        <v-card flat>
          <v-menu bottom offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" small icon v-bind="attrs" v-on="on">
                <v-icon color="accent">mdi-filter-outline</v-icon>
              </v-btn>
            </template>
            <v-card-text class="ml-0 mr-0">
              <v-list dense>
                <v-list-item
                  class="text-capitalize"
                  link
                  @click="filterApprovalsByStatus('REJECTED')"
                >
                  Unassigned
                </v-list-item>
                <v-list-item
                  class="text-capitalize"
                  link
                  @click="filterApprovalsByStatus('dm_pending')"
                >
                  In transit
                </v-list-item>

                <v-list-item
                  class="text-capitalize"
                  link
                  @click="filterApprovalsByStatus('ACCEPTED')"
                >
                  Delivered
                </v-list-item>

                <v-list-item
                  class="text-capitalize"
                  link
                  @click="filterApprovalsByStatus('PENDING')"
                >
                  {{ $t("pending") }}
                </v-list-item>
                <v-list-item
                  class="text-capitalize"
                  link
                  @click="filterApprovalsByStatus('all')"
                >
                  All
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-menu>
        </v-card>
      </v-toolbar>
      <CreateOrder
        :dialog="dialog"
        :formTitle="formTitle"
        :order="defaultOrder"
        :customers="customers"
        @close-dialog="dismissDeleteEdit"
        @order-data="createEditOrder"
      >
      </CreateOrder>

      <v-dialog v-model="dialogDelete" max-width="500px">
        <v-card class="text-center">
          <v-card-text class="py-4">
            <v-icon color="secondary" dark size="64">
              mdi-alert-outline
            </v-icon>
          </v-card-text>
          <v-card-text class="text-h6">
            {{ $t("deleteItemTextTranslate") }}
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="accent darken-1" text @click="dismissDeleteEdit()">
              close
            </v-btn>
            <v-btn color="secondary darken-1" text @click="orderDelete">
              Delete
            </v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>

    <!-- rating  -->
    <template v-slot:[`item.rating`]="{ item }">
      <v-rating
        v-model="item.rating"
        color="yellow darken-3"
        background-color="grey darken-1"
        empty-icon="$ratingFull"
        half-increments
        hover
        x-small
        class="pl-0"
      ></v-rating>
    </template>

    <!-- statuses  -->
    <template v-slot:[`item.status`]="{ item }">
      <v-btn text v-if="item.status === 'active'"
        ><v-icon small color="success" class="mr-2" @click="editItem(item)">
          mdi-check-circle
        </v-icon></v-btn
      >
      <v-btn v-else small color="warning" @click="deleteItem(item)">
        {{ item.status }}
      </v-btn>
    </template>

    <!-- actions  -->
    <template v-slot:[`item.actions`]="{ item }">
      <v-icon small color="success" class="mr-2" @click="editItem(item)">
        mdi-pencil
      </v-icon>
      <v-icon small color="red" @click="deleteItem(item)">
        mdi-delete-outline
      </v-icon>
    </template>
  </v-data-table>
</template>

<script>
import CreateOrder from "./forms/CreateOrder.vue";
import LoadingBar from "../LoadingBar.vue";
import { mapActions } from "vuex";

export default {
  components: { CreateOrder, LoadingBar },

  props: {
    orders: {
      type: Array,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    customers: {
      type: Array,
      required: true,
    },
  },

  data: () => ({
    dialog: false,
    dialogDelete: false,
    headers: [
      // {
      //   text: "ID",
      //   sortable: false,
      //   value: "id",
      // },
      {
        text: "order id",
        value: "id",
        class: "text-capitalize",
        sortable: false,
      },
      {
        text: "Customer",
        sortable: false,
        value: "merchantId",
        class: "text-capitalize",
      },
      {
        text: "Sender Adress",
        value: "senderAddress",
        class: "text-capitalize",
        sortable: false,
      },
      {
        text: "Receiver Adress",
        value: "receiverAddress",
        class: "text-capitalize",
        sortable: false,
      },

      {
        text: "delivery type",
        value: "deliveryType",
        class: "text-capitalize",
        sortable: false,
      },
      {
        text: "amount paid",
        value: "totalAmount",
        class: "text-capitalize",
        sortable: false,
      },
      {
        text: "balance",
        value: "balance",
        class: "text-capitalize",
        sortable: false,
      },
      {
        text: "order earnings",
        value: "amount",
        class: "text-capitalize",
        sortable: false,
      },
      {
        text: "payment type",
        value: "paymentType",
        class: "text-capitalize",
        sortable: false,
      },
      {
        text: "delivery status",
        value: "status",
        class: "text-capitalize",
        sortable: false,
      },

      { text: "Actions", value: "actions", sortable: false },
    ],
    desserts: [],
    editedIndex: -1,
    editedItem: {
      customerId: 0,
      deliveryType: "",
      scheduledAt: 0,
      narration: "",
      pickupAdress: "",
      receiverAdress: "",
      transportationMode: "",
      deliveryFee: 0,
      amountReceived: 0,
    },
    defaultOrder: {
      customerId: 0,
      deliveryType: "",
      scheduledAt: 0,
      narration: "",
      pickupAdress: "",
      receiverAdress: "",
      transportationMode: "",
      deliveryFee: 0,
      amountReceived: 0,
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Order" : "Edit Order";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.dismissDeleteEdit();
    },
  },

  created() {},

  methods: {
    ...mapActions("orders", {
      createOrder: "createOrder",
      editOrder: "updateOrder",
      deleteOrder: "delOrder",
    }),
    openDialog() {
      this.dialog = true;
    },

    editItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      // this.dialog = true;
    },

    deleteItem(item) {
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.desserts.splice(this.editedIndex, 1);
      this.dismissDeleteEdit();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultOrder);
        this.editedIndex = -1;
      });
    },

    dismissDeleteEdit() {
      this.dialog = false;
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedOrder = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    filterApprovalsByStatus(status) {
      if (status === "all") {
        this.query = `all`;
        this.filteredApprovals = this.approvals;
      } else if (
        status === "ACCEPTED" ||
        status === "REJECTED" ||
        status === "PENDING" ||
        status === "dmAccepted" ||
        status === "dm_pending" ||
        status === "dmDeclined" ||
        status === "DECLINED"
      ) {
        this.query = `all/?filter=${status}`;
      } else {
        this.query === "all";
      }

      let payload = {
        query: this.query,
      };

      // call the API
      this.filterApprovals(payload)
        .then(() => {})
        .catch(() => {})
        .finally(() => {
          this.query = "?";
          payload = {};
        });
    },

    createEditOrder(data) {
      // editing;
      if (this.editedIndex > -1) {
        this.editOrder(data)
          .then(() => {})
          .catch(() => {})
          .finally(() => {
            this.dismissDeleteEdit();
          });
      } else {
        // creating;
        this.createOrder(data)
          .then(() => {
            this.$emit("show-feedback", {
              status: "success",
              message:
                "Rider registered, ask them to login and change password",
            });
          })
          .catch(() => {})
          .finally(() => {
            this.dismissDeleteEdit();
          });
      }
    },

    orderDelete() {
      this.dismissDeleteEdit();
      this.$emit("show-feedback", {
        status: "submitting",
        message: "submitting",
      });

      this.deleteorder(this.editedIndex)
        .then(() => {
          this.$emit("show-feedback", {
            status: "success",
            message: "Order deleted.",
          });
        })
        .catch(() => {
          this.$emit("show-feedback", {
            status: "fail",
            message: "Order deletion failed.",
          });
        })
        .finally(() => {
          this.closeDelete();
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.v-card__subtitle,
.v-card__text {
  padding: 0px;
}
</style>
