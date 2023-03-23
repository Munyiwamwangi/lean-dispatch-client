<template>
  <v-data-table
    :headers="headers"
    :items="privateRiders"
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
        :edit-id="editedIndex"
        :formTitle="formTitle"
        :rider="editedRider"
        :loading="loading"
        @close-dialog="dismissDeleteEdit"
        @rider-data="createRider"
      >
      </CreateRider>

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
            <v-btn color="secondary darken-1" text @click="riderDelete">
              Delete
            </v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="statusesDialog" max-width="600px">
        <v-card class="text-center">
          <!-- <v-card-header> Status tracker </v-card-header> -->
          <v-card-text class="py-4">
            <v-icon color="secondary" dark size="64">
              mdi-alert-outline
            </v-icon>
          </v-card-text>
          <v-card-text class="text-h6 text-center">
            Account Status Control Panel
            <v-row no-gutters justify="center" class="">
              <v-col cols="12" md="4" sm="6">
                <v-card-subtitle>Activate /Deactivate</v-card-subtitle>
                <v-row no-gutters justify="center">
                  <v-switch v-model="active" @click="activateDeactivateUser()">
                  </v-switch
                ></v-row>
              </v-col>
              <v-col cols="12" md="4" sm="6">
                <v-card-subtitle>Blaclist/Remove</v-card-subtitle>
                <v-row no-gutters justify="center">
                  <v-switch v-model="blacklisted"></v-switch>
                </v-row>
              </v-col>
              <v-col cols="12" md="4" sm="6">
                <v-card-subtitle>Exit User</v-card-subtitle>
                <v-row no-gutters justify="center">
                  <v-switch v-model="exited"></v-switch>
                </v-row>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="accent darken-1" text @click="dismissDeleteEdit()">
              close
            </v-btn>
            <!-- <v-btn color="secondary darken-1" text @click="riderDelete">
              Delete
            </v-btn> -->
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
    <!-- partialApplication, pendingApproval, active, inactive, rejected, exited, blacklisted -->

    <!-- statuses  -->
    <template v-slot:[`item.accountState`]="{ item }">
      <v-btn
        v-if="item.accountState === 'active'"
        small
        class="text-capitalize"
        @click="toggleStatusOptions(item)"
      >
        Active
      </v-btn>
      <v-btn
        v-else-if="item.accountState === 'inactive'"
        small
        class="text-capitalize"
        @click="toggleStatusOptions(item)"
      >
        inactive
      </v-btn>
      <v-btn
        v-else-if="item.accountState === 'pendingApproval'"
        small
        color="warning"
        class="text-capitalize"
        @click="toggleStatusOptions(item)"
      >
        Pending approval
      </v-btn>
      <v-btn
        v-else-if="item.accountState === 'partialApplication'"
        small
        color="warning"
        class="text-capitalize"
        @click="toggleStatusOptions(item)"
      >
        partially approved
      </v-btn>
      <v-btn
        v-else-if="item.accountState === 'approved'"
        small
        color="warning"
        class="text-capitalize"
        @click="toggleStatusOptions(item)"
      >
        approved
      </v-btn>
      <v-btn
        v-else-if="item.accountState === 'rejected'"
        small
        color="danger"
        class="text-capitalize"
        @click="toggleStatusOptions(item)"
      >
        rejected
      </v-btn>
      <v-btn
        v-else-if="item.accountState === 'exited'"
        small
        class="text-capitalize"
        @click="toggleStatusOptions(item)"
      >
        exited
      </v-btn>
      <v-btn
        v-else-if="item.blacklisted === 'blacklisted'"
        small
        class="text-capitalize"
        @click="toggleStatusOptions(item)"
      >
        blacklisted
      </v-btn>

      <!-- <v-icon
        v-if="item.accountState === 'active'"
        small
        color="success"
        class="mr-2"
        @click="editItem(item)"
      >
        mdi-check-circle
      </v-icon>
      <v-icon v-else small color="warning" @click="deleteItem(item)">
        mdi-cancel
      </v-icon> -->
    </template>

    <!-- joined on  -->
    <!-- <template #[`item.joinedOn`]="props">
      {{ $date(props.item.joinedOn).format("DD-MMM-YYYY") }}
    </template> -->

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
import LoadingBar from "../LoadingBar.vue";
import { mapActions } from "vuex";
export default {
  components: { CreateRider, LoadingBar },
  props: {
    privateRiders: {
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
    statusesDialog: false,
    active: false,
    blacklisted: false,
    exited: false,
    approved: false,
    partiallyApproved: false,
    headers: [
      // {
      //   text: "ID",
      //   sortable: false,
      //   value: "id",
      // },
      {
        text: "name",
        sortable: false,
        value: "fullName",
        class: "text-capitalize",
      },
      {
        text: "completed orders",
        value: "completedOrders",
        class: "text-capitalize",
      },
      {
        text: "earnings",
        value: "totalEarnings",
        class: "text-capitalize",
        sortable: false,
      },
      {
        text: "rating",
        value: "rating",
        class: "text-capitalize",
        sortable: false,
      },
      // {
      //   text: "company",
      //   value: "company",
      //   class: "text-capitalize",
      //   sortable: false,
      // },
      {
        text: "city",
        value: "city",
        class: "text-capitalize",
        sortable: false,
      },
      {
        text: "account state",
        value: "accountState",
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

      complatedOrders: 256,
      earnings: 4000,
      rating: 5,
      company: "Twin Courier",
      city: "Kisumu",
      status: "active",
      joinedOn: "2/06/2022",
    },

    defaultRider: {
      firstName: "",
      lastName: "",
      email: "",
      userType: "",
      phonenumber: "",
      password: "",
      acceptTerms: false,

      // complatedOrders: 256,
      // earnings: 4000,
      // rating: 5,
      // company: "Twin Courier",
      // city: "Kisumu",
      // status: "active",
      // joinedOn: "2/06/2022",
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Rider" : "Edit Rider";
    },
  },

  watch: {
    dialog(val) {
      val || this.dismissDeleteEdit();
    },
    // dialogDelete(val) {
    //   val || this.closeDelete();
    // },
  },

  created() {},

  methods: {
    ...mapActions("riders", {
      createPrivateRider: "addPrivateRider",
      editRider: "updateRider",
      deleteRider: "deleteRider",
    }),

    openDialog() {
      this.dialog = true;
    },

    statusComputer(item) {
      // if (item.accountState === "active") {
      //   this.active === true;
      // }

      switch (item.accountState) {
        case "active":
          this.active === true;
          break;
        case "inactive":
          this.active === false;
          break;
        case "pendingApproval":
          this.approved === false;
          break;
        case "approved":
          this.approved === true;
          break;
        case "partialApplication":
          this.partiallyApproved === true;
          break;
      }
    },

    editItem(item) {
      this.editedRider = Object.assign({}, item);
      this.editedIndex = item.riderId;
      this.dialog = true;
    },

    // saveRider() {
    //   if (this.editedIndex > -1) {
    //     Object.assign(this.desserts[this.editedIndex], this.editedRider);
    //   } else {
    //     this.createRider;
    //   }
    // },

    createRider(data) {
      // editing
      if (this.editedIndex > -1) {
        this.editRider(data)
          .then(() => {})
          .catch(() => {})
          .finally(() => {
            this.dismissDeleteEdit();
          });
      } else {
        // creating;
        this.createPrivateRider(data)
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

    toggleStatusOptions(item) {
      this.statusesDialog = true;
      this.editedIndex = item.riderId;
      this.editedRider = Object.assign({}, item);
    },

    activateDeactivateRider() {
      this.$emit("show-feedback", {
        status: "submitting",
        message: "submitting",
      });

      this.approvals.splice(this.editedIndex, 1);
      const data = {
        id: this.editedItem.id,
        status: "ACCEPTED",
        comments: this.editedItem.comments,
      };

      this.createPrivateRider(data).then(() => {
        this.$emit("show-feedback", {
          status: "success",
          message: "rider created",
        });
      });

      this.closeApprove();
    },

    deleteItem(item) {
      this.editedIndex = item.riderId;
      this.editedRider = Object.assign({}, item);
      this.dialogDelete = true;
    },

    riderDelete() {
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
