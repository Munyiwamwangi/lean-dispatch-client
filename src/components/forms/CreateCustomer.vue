<template>
  <div>
    <v-dialog v-model="dialog" max-width="600" persistent>
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
                  v-model="order.receiverAdress"
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
                  hint="Use a valid, work number"
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
                  dense
                  outlined
                  label="Preferred transport mode"
                  required
                ></v-combobox>
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
            @click="saveOrder"
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

      formErrors: [false],

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
  },
  created() {
    // console.log(this.order);
  },

  methods: {
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

    saveOrder() {
      // this.order["userType"] = this.userType.title;
      console.log(this.order);

      // if (this.$refs.registerForm.validate()) {
      //   this.$emit("order-data", this.order);
      //   this.close();
      // }
    },
  },
};
</script>

<style lang="scss" scoped>
.t-white {
  color: white;
}
</style>
