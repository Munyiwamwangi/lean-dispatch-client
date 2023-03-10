<template>
  <div>
    <v-dialog v-model="dialog" max-width="450px" persistent>
      <v-card class="px-2 pl-0 pr-0">
        <v-card-title class="">
          {{ formTitle }}
        </v-card-title>
        <v-card-text>
          <v-form
            ref="registerForm"
            v-model="registerForm"
            lazy-validation
            @submit.prevent="signUp"
          >
            <v-row>
              <v-col cols="12" sm="6" md="6" class="pb-0">
                <v-text-field
                  v-model="firstName"
                  :rules="[rules.required]"
                  dense
                  outlined
                  label="First Name"
                  maxlength="20"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="6" class="pb-0">
                <v-text-field
                  v-model="lastName"
                  dense
                  outlined
                  :rules="[rules.required]"
                  label="Last Name"
                  maxlength="20"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" class="pt-0 pb-0">
                <v-text-field
                  v-model="email"
                  :rules="[rules.required, rules.emailRules]"
                  dense
                  outlined
                  label="E-mail"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="6" class="pt-0 pb-0">
                <v-combobox
                  v-model="userType"
                  :rules="[rules.required]"
                  :items="userTypes"
                  dense
                  outlined
                  item-text="title"
                  item-value="id"
                  label="User Type"
                  required
                ></v-combobox>
              </v-col>
              <v-col cols="12" sm="6" md="6" class="pt-0 pb-0">
                <v-text-field
                  v-model="phoneNumber"
                  :rules="[rules.required, rules.phoneMin]"
                  dense
                  type="number"
                  hint="Use a valid, work number"
                  outlined
                  item-text="title"
                  item-value="id"
                  label="Phone Number"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" class="pt-0 pb-0">
                <v-text-field
                  v-model="password"
                  :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                  :rules="[rules.required, rules.passMin]"
                  :type="show1 ? 'text' : 'password'"
                  dense
                  outlined
                  name="input-10-1"
                  label="Password"
                  hint="At least 8 characters"
                  counter
                  @click:append="show1 = !show1"
                ></v-text-field>
              </v-col>
              <v-col cols="12" class="pt-0 pb-0">
                <v-text-field
                  v-model="verify"
                  :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                  :rules="[rules.required, passwordMatch]"
                  :type="show1 ? 'text' : 'password'"
                  block
                  dense
                  outlined
                  name="input-10-1"
                  label="Confirm Password"
                  counter
                  @click:append="show1 = !show1"
                ></v-text-field>
              </v-col>
              <v-col cols="12" class="pt-0 pb-0">
                <div class="mainCheckBox">
                  <v-checkbox
                    v-model="checkbox"
                    :rules="[(v) => !!v || 'You must agree to continue!']"
                    required
                  >
                    <template v-slot:label>
                      <div>
                        {{ $t("acceptAll") }}
                        <v-tooltip>
                          <template v-slot:activator="{ on }">
                            <a
                              class="bold-underlined"
                              target="_blank"
                              @click.stop
                              v-on="on"
                            >
                              {{ $t("termsAndConditions") }}
                            </a>
                          </template>
                        </v-tooltip>
                      </div>
                    </template>
                  </v-checkbox>
                </div>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-btn text class="t-white" @click="close">close </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            :disabled="!registerForm"
            type="submit"
            class="t-white universal-blue"
            @click="signUp"
            >Register
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
    // newGroup: {
    //   type: Object,
    //   required: true,
    // },
    rider: {
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
      phoneNumber: null,
      registerForm: false,
      form: false,
      email: "",
      password: "",
      formErrors: [false],
      loading: false,
      firstName: "",
      lastName: "",

      // new data
      userTypes: [
        { id: 1, title: "merchant" },
        { id: 2, title: "rider" },
      ],
      tab: 0,
      tabItems: [
        { id: 1, name: "Login", icon: "mdi-account" },
        { id: 2, name: "Register", icon: "mdi-account-outline" },
      ],
      verify: "",
      loginPassword: "",
      loginEmail: "",

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
      return () => this.password === this.verify || "Password must match";
    },
  },
  created() {
    console.log(this.rider);
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

    signUp() {
      if (!this.validate()) return;
      const data = {
        title: this.newGroup.name,
      };
      this.$emit("send-group-data", data);
      this.closeRoleCreatingDialog();
    },
  },
};
</script>
