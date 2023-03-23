<template>
  <v-data-table
    :headers="headers"
    :items="desserts"
    :loading="loading"
    sort-by="calories"
    class="elevation-1"
    hide-default-footer
  >
    <template slot="progress">
      <LoadingBar></LoadingBar>
    </template>

    <template #[`item.id`]="props">
      {{ props.index + 1 }}
    </template>

    <template v-slot:top>
      <v-toolbar flat>
        <v-row no-gutters>
          <v-toolbar-title>My Orders</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-btn color="primary" dark class="mb-2" @click="openDialog">
            + New Order
          </v-btn>
        </v-row>
      </v-toolbar>
      <CreateOrder
        :dialog="dialog"
        :formTitle="formTitle"
        :rider="defaultOrder"
        @close-dialog="dismissDeleteEdit"
        @rider-data="createEditOrder"
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
import CreateOrder from "../forms/CreateOrder.vue";
import LoadingBar from "../LoadingBar.vue";
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
  },

  data: () => ({
    dialog: false,
    dialogDelete: false,
    headers: [
      {
        text: "ID",
        sortable: false,
        value: "id",
      },
      {
        text: "Customer",
        sortable: false,
        value: "name",
        class: "text-capitalize",
      },
      {
        text: "Store Name",
        value: "company",
        class: "text-capitalize",
      },
      {
        text: "order id",
        value: "orderId",
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
        text: "amount",
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
        text: "payment status",
        value: "status",
        class: "text-capitalize",
        sortable: false,
      },

      { text: "Actions", value: "actions", sortable: false },
    ],
    desserts: [],
    editedIndex: -1,
    editedItem: {
      name: "",
      calories: 0,
      fat: 0,
      carbs: 0,
      protein: 0,
    },
    defaultOrder: {
      name: "",
      calories: 0,
      fat: 0,
      carbs: 0,
      protein: 0,
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

  created() {
    this.initialize();
  },

  methods: {
    openDialog() {
      this.dialog = true;
    },

    initialize() {
      this.desserts = [
        {
          name: "Joe Munyi",
          company: "Premium Deliveries",
          orderId: "IFS484",
          deliveryType: "Last Mile",
          amount: "60 Kgs",
          paymentType: "MPESA",
          status: "active",
          joinedOn: "2/06/2022",
        },
        {
          name: "Silvester Odera",
          company: "Beaver Couriers",
          orderId: "FDHJ2000",
          deliveryType: "Home Delivery",
          amount: "4 Kgs",
          paymentType: "KCB Cheque",
          status: "50%",
          joinedOn: "4/07/2022",
        },
        {
          name: "Odera Silverster",
          company: "Twin Courier",
          orderId: "EFE10007",
          deliveryType: "Office Delivery",
          amount: "2 Kgs",
          paymentType: "MPESA",
          status: "30%",
          joinedOn: "12/05/2022",
        },

        {
          name: "Moon Rey",
          company: "Asap Delivery",
          orderId: "SDD3000",
          deliveryType: "Last Mile",
          amount: "20 Kgs",
          paymentType: "MPESA",
          status: "80%",
          joinedOn: "12/05/2022",
        },
        {
          name: "John Doe",
          company: "Hassler Courier",
          orderId: "DSAA4000",
          deliveryType: "Last Mile",
          amount: "25 Kgs",
          paymentType: "EQUITY Cheque",
          status: "active",
          joinedOn: "12/05/2022",
        },
        {
          name: "Kaimenyi",
          company: "Beaver Couriers",
          orderId: "ASDA4000",
          deliveryType: "Last Mile",
          amount: "10 Kgs",
          paymentType: "MPESA",
          status: "active",
          joinedOn: "12/05/2022",
        },
      ];
    },

    editItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      // this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
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
        this.editedRider = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    createEditOrder(data) {
      if (this.editedIndex > -1) {
        Object.assign(this.desserts[this.editedIndex], this.editedRider);
      } else {
        this.createPrivateRider(data)
          .then(() => {
            this.$emit("show-feedback", {
              status: "success",
              message:
                "Rider registered, ask them to login and change password",
            });
          })
          .catch((e) => {
            console.log(e);
            this.$emit("show-feedback", {
              status: "fail",
              message: "Rider registration failed.",
            });
          })
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

      this.deleteRider(this.editedIndex)
        .then(() => {
          this.$emit("show-feedback", {
            status: "success",
            message: "Rider deleted.",
          });
        })
        .catch(() => {
          this.$emit("show-feedback", {
            status: "fail",
            message: "Rider deletion failed.",
          });
        })
        .finally(() => {
          this.closeDelete();
        });
    },
  },
};
</script>
