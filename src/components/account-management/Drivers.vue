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
        <v-toolbar-title>My Drivers</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="700px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
              + New Driver
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="3">
                    <v-text-field
                      v-model="editedItem.name"
                      label="Name"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="3">
                    <v-text-field
                      v-model="editedItem.calories"
                      readonly
                      label="Completed Orders"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="3">
                    <v-text-field
                      v-model="editedItem.fat"
                      label="Earnings"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="3">
                    <v-text-field
                      v-model="editedItem.carbs"
                      label="Company"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="3">
                    <v-text-field
                      v-model="editedItem.protein"
                      label="City"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="3">
                    <v-text-field
                      v-model="editedItem.protein"
                      label="Status"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="3">
                    <v-text-field
                      readonly
                      v-model="editedItem.protein"
                      label="Date Joined"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <!-- actions  -->
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close"> Cancel </v-btn>
              <v-btn color="blue darken-1" text @click="save"> Save </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5"
              >Are you sure you want to delete this item?</v-card-title
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete"
                >Cancel</v-btn
              >
              <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                >OK</v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
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
export default {
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
    editedItem: {
      name: "",
      calories: 0,
      fat: 0,
      carbs: 0,
      protein: 0,
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
      return this.editedIndex === -1 ? "New Driver" : "Edit Driver";
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

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.desserts[this.editedIndex], this.editedItem);
      } else {
        this.desserts.push(this.editedItem);
      }
      this.close();
    },
  },
};
</script>
