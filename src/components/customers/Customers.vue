<template>
  <v-data-table
    :headers="headers"
    :items="allCustomers"
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
        :customer="editedItem"
        @close-dialog="dismissDeleteEdit"
        @save="createEditCustomer"
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
import { mapActions } from "vuex";

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
        value: "createdAt",
        class: "text-capitalize",
        sortable: false,
      },

      { text: "Actions", value: "actions", sortable: false },
    ],
    dummyCustomers: [],
    editedIndex: -1,
    editedItem: {
      fullName: "",
      email: "",
      phonenumber: null,
      businessAddress: null,
    },
    defaultCustomer: {
      fullName: "",
      email: "",
      phonenumber: null,
      businessAddress: null,
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

  methods: {
    ...mapActions("customers", {
      createCustomer: "createCustomer",
      editCustomer: "updateCustomer",
      delCustomer: "delCustomer",
    }),

    openDialog() {
      this.dialog = true;
    },

    editItem(item) {
      this.editedItem = Object.assign({}, item);
      this.editedIndex = item.id;
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedItem = Object.assign({}, item);
      this.editedIndex = item.id;
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.allCustomers.splice(this.editedIndex, 1);
      this.dismissDeleteEdit();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    createEditCustomer(data) {
      // edit
      if (this.editedIndex > -1) {
        this.editCustomer(data)
          .then(() => {
            this.$emit("show-feedback", {
              status: "success",
              message: "Customer details updated",
            });
          })
          .catch(() => {})
          .finally(() => {
            this.dismissDeleteEdit();
          });
      } else {
        // create
        this.createCustomer(data)
          .then(() => {
            this.$emit("show-feedback", {
              status: "success",
              message: "Customer created",
            });
          })
          .catch(() => {})

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

      this.delCustomer(this.editedIndex)
        .then(() => {})
        .catch(() => {})
        .finally(() => {
          this.closeDelete();
        });
    },

    dismissDeleteEdit() {
      this.dialog = false;
      this.dialogDelete = false;
      this.statusesDialog = false;
      this.$nextTick(() => {
        this.editedRider = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedRider = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
  },
};
</script>
