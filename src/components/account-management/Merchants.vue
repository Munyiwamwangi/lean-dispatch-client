<template>
  <v-data-table :headers="headers" :items="dymmuMerchants" sort-by="calories" class="elevation-1" hide-default-footer>
    <template #[`item.id`]="props">
      {{ props.index + 1 }}
    </template>

    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Merchants</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="700px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
              + New Merchant
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field outlined v-model="editedItem.businessName" label="Business Name"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field outlined v-model="editedItem.businessPhone" label="Business Phone"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field outlined v-model="editedItem.businessAddress" label="Business Adress"></v-text-field>
                  </v-col>

                  <v-col cols="12" sm="6" md="6">
                    <v-text-field outlined v-model="editedItem.businessLogo" label="Upload Logo"></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close"> Cancel </v-btn>
              <v-btn color="blue darken-1" text @click="save(item)">
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>

    <!-- status  -->
    <template v-slot:[`item.status`]="{ item }">
      <v-icon v-if="item.status === 'active'" small color="success" class="mr-2" @click="editItem(item)">
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
  props: {
    allMerchants: {
      type: Array,
      required: true,
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
    dymmuMerchants: [],
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
      return this.editedIndex === -1 ? "New Merchant" : "Edit Merchant";
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
      this.dymmuMerchants = [
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

      this.dymmuMerchants = []
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
      // this.editedIndex = item.id;
      console.log(this.editedItem);
      if (this.editedIndex > -1) {
        Object.assign(this.desserts[this.editedIndex], this.editedItem);

        this.desserts.push(this.editedItem);
      }
      this.close();
    },
  },
};
</script>
