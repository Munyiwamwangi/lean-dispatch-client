<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="12" sm="9" class="mt-4 mb-4">
        <v-card class="elevation-6 mt-12">
          <v-row>
            <!-- col 1  -->
            <v-row no-gutters justify="center">
              <v-col
                cols="12"
                class="universal-blue hidden-xs-and-up hidden-sm-and-down"
              >
                <div class="center">
                  <v-row>
                    <v-card-text class="white--text text-uppercase">
                      <h1 class="text-center">Welcome to lean dispatch</h1>
                    </v-card-text>
                    <!-- <hr class="horizontal-underline" /> -->
                  </v-row>
                </div>
              </v-col>
            </v-row>

            <!-- col 2  -->

            <v-col cols="12" md="6" class="pt-0">
              <div>
                <v-tabs v-model="tab" show-arrows icons-and-text dark grow>
                  <v-tab
                    v-for="(item, i) in tabItems"
                    :key="i"
                    class="universal-blue"
                  >
                    <v-icon large>{{ item.icon }}</v-icon>
                    <div class="caption py-1">{{ item.name }}</div>
                  </v-tab>
                  <v-tab-item>
                    <v-card class="px-4">
                      <v-card-text>
                        <v-form ref="form" v-model="valid" lazy-validation>
                          <v-row no-gutters class="pt-4">
                            <v-col cols="12">
                              <v-text-field
                                v-model="loginEmail"
                                :rules="[rules.required, rules.emailRules]"
                                dense
                                outlined
                                label="E-mail"
                                required
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12">
                              <v-text-field
                                v-model="loginPassword"
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
                          </v-row>
                        </v-form>
                      </v-card-text>
                      <v-card-text>
                        <v-spacer></v-spacer>
                        <v-btn
                          x-large
                          block
                          :disabled="!valid"
                          type="submit"
                          class="t-white universal-blue"
                          :loading="loading"
                          @click="submit"
                        >
                          Login
                        </v-btn>
                      </v-card-text>
                    </v-card>
                  </v-tab-item>
                  <v-tab-item>
                    <v-card class="px-4">
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
                                  :rules="[
                                    (v) => !!v || 'You must agree to continue!',
                                  ]"
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
                        <v-btn
                          :disabled="!registerForm"
                          x-large
                          block
                          type="submit"
                          class="t-white universal-blue"
                          @click="signUp"
                          >Register</v-btn
                        >
                      </v-card-actions>
                    </v-card>
                  </v-tab-item>
                </v-tabs>
              </div>
            </v-col>
            <!-- col 2 ends  -->
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "login",

  data() {
    return {
      userType: null,
      checkbox: false,
      valid: false,
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
    showError() {
      const error = this.$store.getters["getError"].error;
      if (!error) {
        this.formErrors.push[1];
      }
      return error;
    },
  },

  methods: {
    validateForm() {
      this.$refs.form.validate();
    },

    // resetValidation() {
    //   this.$refs.form.valid;
    // },

    //  email and password login
    async submit() {
      const data = {
        email: this.loginEmail,
        password: this.loginPassword,
      };
      if (this.$refs.form.validate()) {
        this.loading = true;
        this.$store
          .dispatch("login", data)
          .then(() => {
            this.$store.dispatch("setError", {
              text: "Successfully logged in",
              color: "success lighten-1",
            });
            this.loading = false;
          })
          .catch(() => {})
          .finally(() => {
            this.loading = false;
          });
      }
    },

    // reset password
    passReset() {
      this.$router.push({ name: "password-reset" }).catch(() => {});
    },
    // new methods
    signUp() {
      if (!this.registerForm) return;

      // if (this.$refs.registerForm.validate()) {
      // submit form to server/API here...
      const data = {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        userType: this.userType.title,
        phonenumber: this.phoneNumber,
        password: this.password,
        acceptTerms: this.checkbox,
        // verify: this.verify,
      };
      this.loading = true;
      this.$store
        .dispatch("signUp", data)
        .then(() => {
          this.$store.dispatch("setError", {
            text: "Successfully signed up, proceed to login",
            color: "success lighten-1",
          });
          this.loading = false;
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false;
        });
    },
    reset() {
      this.$refs.form.reset();
      this.$refs.registerForm.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
  },
};
</script>

<style lang="scss" scoped>
hr.horizontal-underline {
  border: 3px solid white;
  width: 20%;
  margin-right: auto;
  margin-left: auto;
}

.mainCheckBox {
  margin-top: -1em;
}
.v-application .text-center {
  text-align: left;
  margin-top: 5;
  margin-left: 3;
}
.center {
  text-align: center;
  padding: 180px 0;
}
.t-white {
  color: white;
}
.place-center {
  margin: 0 auto;
}
h1 {
  line-height: 1.1em;
}
</style>
