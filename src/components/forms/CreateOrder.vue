<template>
  <div>
    <v-dialog v-model="dialog" max-width="700" persistent>
      <v-card class="px-2 pl-0 pr-0">
        <v-card-title class="">
          {{ formTitle }}
        </v-card-title>
        <v-card-text>
          <v-form ref="registerForm" v-model="valid" lazy-validation>
            <v-row>
              <v-col cols="12" class="pb-0">
                <v-combobox
                  v-model="order.customer"
                  :rules="[rules.required]"
                  :items="customers"
                  item-text="fullName"
                  item-value="id"
                  dense
                  outlined
                  label=" Select customer"
                  required
                ></v-combobox>
              </v-col>
              <v-col cols="12" class="pb-0">
                <v-text-field
                  v-model="order.narration"
                  :rules="[rules.required]"
                  dense
                  outlined
                  label="Order Description: Include item nature, dimensions and approximate weight"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="6" class="pb-0">
                <v-text-field
                  v-model="order.pickupAdress"
                  dense
                  outlined
                  :rules="[rules.required]"
                  label="Pickup Adress"
                  maxlength="20"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="6" class="pb-0">
                <v-text-field
                  v-model="order.receiverAddress"
                  dense
                  outlined
                  :rules="[rules.required]"
                  label="Receiver Adress"
                  maxlength="20"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="6" class="pb-0">
                <v-text-field
                  v-model="order.deliveryFee"
                  :rules="[rules.required]"
                  dense
                  type="number"
                  outlined
                  item-text="title"
                  item-value="id"
                  label="Delivery fee"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="6" class="pb-0">
                <v-text-field
                  v-model="order.amountReceived"
                  :rules="[rules.required]"
                  dense
                  type="number"
                  outlined
                  item-text="title"
                  item-value="id"
                  label="Amount Received"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="6" class="pb-0">
                <v-combobox
                  v-model="order.transportationMode"
                  :rules="[rules.required]"
                  :items="transportModes"
                  item-text="title"
                  item-value="id"
                  dense
                  outlined
                  label="Preferred transport mode"
                  required
                ></v-combobox>
              </v-col>

              <v-col cols="6" md="6" class="pt-0 pb-0 pl-0 pr-0">
                <div class="d-flex pl-3">
                  <v-row>
                    <v-col>
                      <v-checkbox
                        v-model="checkbox1"
                        :disabled="checkbox2"
                        label="Instant"
                      ></v-checkbox>
                    </v-col>
                    <v-col>
                      <v-checkbox
                        v-model="checkbox2"
                        :disabled="checkbox1"
                        label="Schedule"
                      ></v-checkbox
                    ></v-col>
                  </v-row>
                </div>

                <div v-if="checkbox2" class="d-flex">
                  <v-col cols="12" sm="6" md="6" class="pb-0">
                    <v-menu
                      ref="dateDialog"
                      v-model="dateDialog"
                      :close-on-content-click="false"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="computedDateFormatted"
                          dense
                          readonly
                          outlined
                          append-icon="mdi-calendar"
                          hint="Delivery Date"
                          v-bind="attrs"
                          open-on-clear
                          v-on="on"
                          @click:clear="picker = ''"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="picker"
                        :allowed-dates="
                          (date) =>
                            date > new Date().toISOString().substr(0, 10)
                        "
                        prev-icon="mdi-skip-previous"
                        next-icon="mdi-skip-next"
                        header-color="accent"
                        color="secondary"
                      >
                        <v-spacer></v-spacer>
                        <v-btn text color="accent" @click="dateDialog = false">
                          Cancel
                        </v-btn>
                        <v-btn
                          text
                          color="accent"
                          @click="$refs.dateDialog.save(picker)"
                        >
                          OK
                        </v-btn>
                      </v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col cols="11" sm="5" md="6" class="pb-0">
                    <v-menu
                      ref="menu"
                      v-model="menu2"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      :return-value.sync="pickupTime"
                      transition="scale-transition"
                      offset-y
                      max-width="290px"
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="pickupTime"
                          label="Time"
                          append-icon="mdi-clock-time-four-outline"
                          readonly
                          outlined
                          dense
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-time-picker
                        v-if="menu2"
                        v-model="pickupTime"
                        :allowed-hours="(v) => (v) => currentdate.getHours()"
                        :allowed-minutes="
                          (v) => (v) => currentdate.getMinutes()
                        "
                        full-width
                        @click:minute="$refs.menu.save(pickupTime)"
                      ></v-time-picker>
                    </v-menu>
                  </v-col>
                </div>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-btn text class="" @click="close">cancel </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            :disabled="!valid"
            :loading="loading"
            type="submit"
            class="t-white universal-blue"
            @click="save"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "EditGroupDialog",

  props: {
    dialog: {
      type: Boolean,
      default: false,
    },
    formTitle: {
      type: String,
      required: true,
    },
    loading: {
      type: Boolean,
    },
    customers: {
      type: Array,
      required: true,
    },
    order: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      valid: false,
      userType: null,
      checkbox: false,
      passwordShow: false,
      users: null,
      registerForm: true,
      form: false,
      dateDialog: false,
      formErrors: [false],
      picker: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      currentdate: new Date(),
      pickupTime: new Date().getHours() + ":" + new Date().getMinutes(),
      menu2: false,
      checkbox1: false,
      checkbox2: false,
      transportModes: [
        { id: 1, title: "Walking" },
        { id: 2, title: "Bicycle" },
        { id: 3, title: "Motorbike" },
        { id: 4, title: "Lorry" },
        { id: 5, title: "Car" },
        { id: 6, title: "Van" },
      ],

      // new data
      userTypes: [
        { id: 1, title: "merchant" },
        { id: 2, title: "order" },
      ],
      tab: 0,
      tabItems: [
        { id: 1, name: "Login", icon: "mdi-account" },
        { id: 2, name: "Register", icon: "mdi-account-outline" },
      ],
      verify: "",

      show1: false,
      rules: {
        required: (value) => !!value || "Required.",
        passMin: (v) => (v && v.length >= 8) || "Min 8 characters",
        phoneMin: (v) => (v && v.length === 10) || "10 characters",
        emailRules: (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
      },
    };
  },

  computed: {
    passwordMatch() {
      return () => this.order.password === this.verify || "Password must match";
    },
    computedDateFormatted() {
      return this.formatDate(this.picker);
    },

    getTime: {
      get() {
        return (
          this.currentdate.getHours() + ":" + this.currentdate.getMinutes()
        );
      },
      set() {
        return this.pickupTime;
      },
    },
  },
  created() {
    // console.log(new Date().getDate());
    // console.log(
    //   this.currentdate.getDate() +
    //     "/" +
    //     (this.currentdate.getMonth() + 1) +
    //     "/" +
    //     this.currentdate.getFullYear() +
    //     " @ " +
    //     this.currentdate.getHours() +
    //     ":" +
    //     this.currentdate.getMinutes() +
    //     ":" +
    //     this.currentdate.getSeconds()
    // );
  },

  methods: {
    formatDate(date) {
      if (!date) return null;

      const [year, month, day] = date.split("-");
      return `${day}/${month}/${year}`;
    },

    getCurrentTime() {
      let today = new Date();
      setTimeout(() => {
        today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      }, 1000);
    },

    close() {
      this.$emit("close-dialog");
      this.resetValidation();
    },

    validate() {
      return this.$refs.registerForm.validate();
    },

    resetValidation() {
      this.$refs.registerForm.resetValidation();
    },

    save() {
      let payload = {
        deliveryType: this.checkbox1 ? "instant" : "scheduled",
        customersId: this.order.customer.id,
        tasks: [
          {
            receiverLat: this.order.receiverAddress,
            receiverLong: this.order.receiverAddress,
            receiverAddress: this.order.receiverAddress,
            senderAddress: this.order.senderAddress,
            pickupLat: this.order.pickupAdress,
            pickupDate: this.checkbox1 ? "" : this.picker,
            pickupTime: this.checkbox1 ? "" : this.pickupTime,
            pickupLong: this.order.pickupAdress,
            transportationMode: this.order.transportationMode.id,
            narration: this.order.narration,
          },
        ],
      };
      // this.order["userType"] = this.userType.title;
      console.log(JSON.stringify(payload, null, 3));

      if (this.$refs.registerForm.validate()) {
        this.$emit("order-data", payload);
        this.close();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.t-white {
  color: white;
}
</style>
