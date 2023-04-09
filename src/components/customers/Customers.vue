<template>
  <v-data-table
    :headers="headers"
    :items="dummyCustomers"
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
          <v-toolbar-title>My Customers</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-btn color="primary" dark class="mb-2" @click="openDialog">
            + New Customer
          </v-btn>
        </v-row>
      </v-toolbar>
      <CreateCustomer
        :dialog="dialog"
        :formTitle="formTitle"
        :order="defaultItem"
        @close-dialog="dismissDeleteEdit"
        @order-data="createEditCustomer"
      >
      </CreateCustomer>

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
            <v-btn color="secondary darken-1" text @click="customerDelete">
              Delete
            </v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>

    <!-- status  -->
    <template v-slot:[`item.status`]="{ item }">
      <v-icon
        v-if="item.status === 'active'"
        small
        color="success"
        class="mr-2"
        @click="editItem(item)"
      >
        mdi-check-circle
      </v-icon>
      <v-icon v-else small color="warning" @click="deleteItem(item)">
        mdi-cancel
      </v-icon>
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
import LoadingBar from "../LoadingBar.vue";
import CreateCustomer from "./forms/CreateCustomer.vue";

export default {
  components: { LoadingBar, CreateCustomer },

  props: {
    allCustomers: {
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
        align: "start",
        sortable: false,
        value: "id",
      },
      {
        text: "Name",
        align: "start",
        sortable: false,
        value: "fullName",
        class: "text-capitalize",
      },
      {
        text: "stores",
        value: "stores",
        class: "text-capitalize",
      },
      {
        text: "drivers",
        value: "drivers",
        class: "text-capitalize",
        sortable: false,
      },
      {
        text: "employees",
        value: "employees",
        class: "text-capitalize",
      },
      {
        text: "vehicles",
        value: "vehicles",
        class: "text-capitalize",
        sortable: false,
      },
      {
        text: "subscription",
        value: "subscription",
        class: "text-capitalize",
        sortable: false,
      },
      {
        text: "city",
        value: "city",
        class: "text-capitalize",
        sortable: false,
      },
      {
        text: "status",
        value: "status",
        class: "text-capitalize",
        sortable: false,
      },
      {
        text: "joined on",
        value: "joinedOn",
        class: "text-capitalize",
        sortable: false,
      },

      { text: "Actions", value: "actions", sortable: false },
    ],
    dummyCustomers: [],
    editedIndex: -1,
    editedItem: {
      businessName: "",
      businessPhone: "",
      businessAddress: "",
      latitude: "",
      longitude: "",
      businessLogo: "",
    },
    defaultItem: {
      name: "",
      calories: 0,
      fat: 0,
      carbs: 0,
      protein: 0,
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Customer" : "Edit Customer";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  created() {
    this.initialize();
  },

  methods: {
    initialize() {
      this.dummyCustomers = [
        {
          name: "Joe Munyi",
          stores: 1,
          drivers: 2,
          employees: 4,
          vehicles: 3,
          subscription: "Premium",
          city: "Nairobi",
          status: "active",
          joinedOn: "2/06/2022",
        },
        {
          name: "Silvester Odera",
          stores: 3,
          drivers: 5,
          employees: 2,
          vehicles: 1,
          subscription: "Premium",
          city: "Kisumu",
          status: "active",
          joinedOn: "4/07/2022",
        },
        {
          name: "Odera Silverster",
          stores: 5,
          drivers: 6,
          employees: 17,
          vehicles: 6,
          subscription: "Premium",
          city: "Eldoret",
          status: "active",
          joinedOn: "12/05/2022",
        },
        {
          name: "Moon Rey",
          stores: 2,
          drivers: 15,
          employees: 3,
          vehicles: 3,
          subscription: "Gold",
          city: "Nairobi",
          status: "active",
          joinedOn: "12/05/2022",
        },
        {
          name: "John Doe",
          stores: 4,
          drivers: 3,
          employees: 4,
          vehicles: 3,
          subscription: "Silver",
          city: "Eldoret",
          status: "inactive",
          joinedOn: "12/05/2022",
        },
        {
          name: "Kaimenyi",
          stores: 4,
          drivers: 3,
          employees: 4,
          vehicles: 3,
          subscription: "Bronze",
          city: "Kisumu",
          status: "active",
          joinedOn: "12/05/2022",
        },
      ];
    },

    openDialog() {
      this.dialog = true;
    },

    editItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
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
    dismissDeleteEdit() {
      this.dialog = false;
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedOrder = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    createEditCustomer(data) {
      if (this.editedIndex > -1) {
        Object.assign(this.desserts[this.editedIndex], this.editedOrder);
      } else {
        this.createPrivateOrder(data)
          .then(() => {
            this.$emit("show-feedback", {
              status: "success",
              message: "order created",
            });
          })
          .catch((e) => {
            console.log(e);
            this.$emit("show-feedback", {
              status: "fail",
              message: "order created successfully.",
            });
          })
          .finally(() => {
            this.dismissDeleteEdit();
          });
      }
    },

    customerDelete() {
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
