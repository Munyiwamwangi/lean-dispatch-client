<template>
  <v-data-table
    :headers="headers"
    :items="desserts"
    sort-by="calories"
    class="elevation-1"
    hide-default-footer
  >
    <template #[`item.id`]="props">
      {{ props.index + 1 }}
    </template>

    <template v-slot:top>
      <v-toolbar flat>
        <v-row no-gutters>
          <v-toolbar-title>My Riders</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-btn color="primary" dark class="mb-2" @click="openDialog">
            + New Rider
          </v-btn>
        </v-row>
      </v-toolbar>
      <CreateRider
        :dialog="dialog"
        :formTitle="formTitle"
        :rider="defaultRider"
        :loading="loading"
        @close-dialog="close"
        @rider-data="signUp"
      >
      </CreateRider>
    </template>

    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card>
        <v-card-title class="text-h5"
          >Are you sure you want to delete this item?</v-card-title
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="deleteItemConfirm"
            >OK</v-btn
          >
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
import CreateRider from "../forms/CreateRiders.vue";

export default {
  components: { CreateRider },
  data: () => ({
    dialog: false,
    dialogDelete: false,
    loading: false,
    headers: [
      {
        text: "ID",
        sortable: false,
        value: "id",
      },
      {
        text: "name",
        sortable: false,
        value: "name",
        class: "text-capitalize",
      },
      {
        text: "completed orders",
        value: "complatedOrders",
        class: "text-capitalize",
        width: 5,
      },
      {
        text: "earnings",
        value: "earnings",
        class: "text-capitalize",
        sortable: false,
      },
      {
        text: "rating",
        value: "rating",
        class: "text-capitalize",
        sortable: false,
      },
      {
        text: "company",
        value: "company",
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

    desserts: [],
    editedIndex: -1,
    editedRider: {
      firstName: "",
      lastName: "",
      email: "",
      userType: "",
      phonenumber: "",
      password: "",
    },
    defaultRider: {
      firstName: "",
      lastName: "",
      email: "",
      userType: "",
      phonenumber: "",
      password: "",
      acceptTerms: false,
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Rider" : "Edit Rider";
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
    openDialog() {
      this.dialog = true;
    },

    initialize() {
      this.desserts = [
        {
          name: "Joe Munyi",
          complatedOrders: 256,
          earnings: 4000,
          rating: 5,
          company: "Twin Courier",
          city: "Kisumu",
          status: "active",
          joinedOn: "2/06/2022",
        },
        {
          name: "Silvester Odera",
          complatedOrders: 129,
          earnings: 2000,
          rating: 1.6,
          company: "Asap Delivery",
          city: "Nairobi",
          status: "inactive",
          joinedOn: "4/07/2022",
        },
        {
          name: "Odera Silverster",
          complatedOrders: 89,
          earnings: 10007,
          rating: 2.6,
          company: "Premium Deliveries",
          city: "Eldoret",
          status: "active",
          joinedOn: "12/05/2022",
        },

        {
          name: "Moon Rey",
          complatedOrders: 65,
          earnings: 3000,
          rating: 3.6,
          company: "Hassler Courier",
          city: "Kisumu",
          status: "active",
          joinedOn: "12/05/2022",
        },
        {
          name: "John Doe",
          complatedOrders: 90,
          earnings: 4000,
          rating: 3.6,
          company: "Beaver Couriers",
          city: "Nairobi",
          status: "inactive",
          joinedOn: "12/05/2022",
        },
        {
          name: "Kaimenyi",
          complatedOrders: 112,
          earnings: 4000,
          rating: 4.6,
          company: "Smart Delivery",
          city: "Kisumu",
          status: "active",
          joinedOn: "12/05/2022",
        },
      ];
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
      this.closeDelete();
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

    signUp(data) {
      if (this.editedIndex > -1) {
        Object.assign(this.desserts[this.editedIndex], this.editedItem);
      } else {
        // submit form to server/API here...
        //
        this.loading = true;
        this.$store
          .dispatch("signUp", data)
          .then(() => {
            this.$store.dispatch("setError", {
              text: "Successfully registered",
              color: "success lighten-1",
            });
            this.loading = false;
          })
          .catch(() => {
            this.$store.dispatch("setError", {
              text: "Registration failed, please try again",
              color: "error lighten-1",
            });
          })
          .finally(() => {
            this.loading = false;
          });
      }
      this.close();
    },
  },
};
</script>
