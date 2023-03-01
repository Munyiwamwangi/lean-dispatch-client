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
        <v-toolbar-title>Orders</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="700px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
              + New Order
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
                      label="Company"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="3">
                    <v-text-field
                      v-model="editedItem.fat"
                      label="orderId"
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
      return this.editedIndex === -1 ? "New Order" : "Edit Order";
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
