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
                <v-text-field
                  v-model="customer.fullName"
                  :rules="[rules.required]"
                  dense
                  outlined
                  label="Full Name"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="6" class="pb-0">
                <v-text-field
                  v-model="customer.email"
                  :rules="[rules.required, rules.emailRules]"
                  dense
                  outlined
                  label="E-mail"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="6" class="pb-0">
                <v-text-field
                  v-model="customer.phonenumber"
                  :rules="[rules.required, rules.phoneMin]"
                  dense
                  type="number"
                  hint="Use a valid, work number"
                  outlined
                  label="Phone Number"
                  required
                ></v-text-field>
              </v-col>

              <v-toolbar flat>
                <v-card-title> Business Address </v-card-title>
                <v-spacer></v-spacer>
                <!-- <v-btn text @click="trackAdresses()">
                  <v-icon>mdi-plus</v-icon><Address>Add Address</Address>
                </v-btn> -->
              </v-toolbar>
              <!-- adresses aediting loop structure -->
              <!-- <div v-for="(item, index) in customer.businessAddress" :key="index"> -->

              <div>
                <v-card flat outlined>
                  <v-card-text>
                    <v-row>
                      <v-col cols="12" class="pb-0">
                        <v-text-field
                          v-model="customer.businessAddress"
                          :rules="[rules.required]"
                          dense
                          outlined
                          label="Name"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" class="pb-0">
                        <v-text-field
                          v-model="customer.fullName"
                          :rules="[rules.required]"
                          dense
                          outlined
                          label="Pick Location"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="6" class="pb-0">
                        <v-text-field
                          v-model="customer.email"
                          :rules="[rules.required]"
                          dense
                          outlined
                          label="Descriptive Street Address 1"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="6" class="pb-0">
                        <v-text-field
                          v-model="customer.email"
                          :rules="[rules.required]"
                          dense
                          outlined
                          label="Descriptive Street Adress 2"
                          required
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </div>
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
    customer: {
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

  computed: {},
  created() {},

  methods: {
    close() {
      this.$emit("close-dialog");
      this.resetValidation();
    },

    trackAdresses() {},

    validate() {
      return this.$refs.registerForm.validate();
    },

    resetValidation() {
      this.$refs.registerForm.resetValidation();
    },

    save() {
      if (this.$refs.registerForm.validate()) {
        this.$emit("save", this.customer);
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
