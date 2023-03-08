<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="12" sm="9" class="mt-4 mb-4">
        <v-card class="elevation-6 mt-12">
          <v-row>
            <!-- col 1  -->
            <v-col
              cols="12"
              md="6"
              class="first-col hidden-xs-and-up hidden-sm-and-down"
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

            <!-- col 2  -->

            <v-col cols="12" md="6" sm="6" class="px-4 pl-1 pt-0">
              <div>
                <v-tabs
                  v-model="tab"
                  show-arrows
                  icons-and-text
                  dark
                  grow
                >
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
                        <v-form ref="loginForm" v-model="valid" lazy-validation>
                          <v-row>
                            <v-col cols="12">
                              <v-text-field
                                v-model="loginEmail"
                                :rules="loginEmailRules"
                                dense
                                outlined
                                label="E-mail"
                                required
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12">
                              <v-text-field
                                v-model="loginPassword"
                                :append-icon="show1 ? 'eye' : 'eye-off'"
                                :rules="[rules.required, rules.min]"
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
                          color="success"
                          @click="validate"
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
                          v-model="valid"
                          lazy-validation
                        >
                          <v-row>
                            <v-col cols="12" sm="6" md="6">
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
                            <v-col cols="12" sm="6" md="6">
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
                            <v-col cols="12">
                              <v-text-field
                                v-model="email"
                                :rules="emailRules"
                                dense
                                outlined
                                label="E-mail"
                                required
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12">
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
                            <v-col cols="12">
                              <v-text-field
                                v-model="password"
                                :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                                :rules="[rules.required, rules.min]"
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
                            <v-col cols="12">
                              <v-text-field
                                block
                                v-model="verify"
                                :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                                :rules="[rules.required, passwordMatch]"
                                :type="show1 ? 'text' : 'password'"
                                name="input-10-1"
                                label="Confirm Password"
                                counter
                                @click:append="show1 = !show1"
                              ></v-text-field>
                            </v-col>
                          </v-row>
                        </v-form>
                      </v-card-text>
                      <v-card-actions>
                        <v-btn
                          x-large
                          block
                          :disabled="!valid"
                          color="success"
                          @click="validate"
                          >Register</v-btn
                        >
                      </v-card-actions>
                    </v-card>
                  </v-tab-item>
                </v-tabs>
              </div>
              <!-- <v-form
                ref="form"
                v-model="valid"
                lazy-validation
                @submit.prevent="submit"
              >
                <v-card-text>
                  <v-row no-gutters justify="center">
                    <h1 class="accent--text">Login</h1>
                  </v-row>

                  <v-row align="center" justify="center">
                    <v-col cols="12" sm="8">
                      <v-text-field
                        v-model="email"
                        ref="email"
                        :rules="emailRules"
                        :label="$t('emailAdressLabel')"
                        required
                        prepend-inner-icon="person"
                        color="blue"
                        autocomplete="false"
                        class="mt-8"
                      />
                      <v-text-field
                        ref="password"
                        v-model="password"
                        :rules="passwordRules"
                        :label="$t('passwordInputFieldPlaceHolder')"
                        :type="passwordShow ? 'text' : 'password'"
                        :append-icon="passwordShow ? 'mdi-eye' : 'mdi-eye-off'"
                        @click:append="passwordShow = !passwordShow"
                        required
                        color="blue"
                        autocomplete="false"
                        placeholder="Password"
                        prepend-inner-icon="key"
                      />

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

                      <v-btn
                        rounded
                        block
                        :disabled="!valid"
                        color="#536878"
                        type="submit"
                        class="t-white"
                        :loading="loading"
                      >
                        <h2 class="text-capitalize">
                          {{ $t("loginText") }}
                        </h2>
                      </v-btn>

                      <div class="mt-2 text-center bold-underlined">
                        <router-link to="/forgot-password">
                          {{ $t("forgotPassword") }}
                        </router-link>
                      </div>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-form> -->
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
      userTypes: [
        { id: 1, title: "merchant" },
        { id: 2, title: "rider" },
      ],
      // form validation essentials
      checkbox: false,
      valid: false,
      passwordShow: false,
      users: null,

      email: "",

      password: "",
      passwordRules: [
        (v) => !!v || this.$t("passwordInputHint1"),
        (v) =>
          (v && v.length >= 6) || this.$t("minimalPasswordCharacterErrortext"),
      ],

      // form essentials
      formErrors: [false],
      loading: false,

      firstName: "",
      lastName: "",

      // new data
      tab: 0,
      tabItems: [
        { id: 1, name: "Login", icon: "mdi-account" },
        { id: 2, name: "Register", icon: "mdi-account-outline" },
      ],

      // new data
      verify: "",
      loginPassword: "",
      loginEmail: "",
      loginEmailRules: [
        (v) => !!v || "Required",
        (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
      ],
      emailRules: [
        (v) => !!v || "Required",
        (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
      ],

      show1: false,
      rules: {
        required: (value) => !!value || "Required.",
        min: (v) => (v && v.length >= 8) || "Min 8 characters",
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

  watch: {
    emailRules: "validateForm",
    email: "validateForm",
    password: "validateForm",
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
        email: this.email,
        password: this.password,
      };
      if (this.$refs.form.validate()) {
        this.loading = true;
        this.$store
          .dispatch("login", data)
          .then(() => {
            this.$store.dispatch("setError", {
              text: "successfully logged in",
              color: "success lighten-1",
            });
            this.loading = false;
          })
          .catch(() => {
            this.emailRules = [
              ...this.emailRules,
              (v) => v === "invalid" || "Invalid email or password",
            ];
            this.passwordRules = [
              ...this.passwordRules,
              (v) => v === "invalid" || "Invalid email or password",
            ];
          })
          .finally(() => {
            if (this.emailRules.length === 3) {
              setTimeout(() => {
                this.emailRules = this.emailRules.slice(0, 2);
                this.passwordRules = this.passwordRules.slice(0, 2);
              }, 4000);
            }
            this.loading = false;
          });
      }
    },

    // reset password
    passReset() {
      this.$router.push({ name: "password-reset" }).catch(() => {});
    },
    // new methods
    validate() {
      if (this.$refs.loginForm.validate()) {
        // submit form to server/API here...
      }
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
  },
};
</script>

<style lang="scss" scoped>
.v-application .first-col {
  // border-bottom-right-radius: 300px !important;
  background: linear-gradient(180deg, #15488f 0%, #235eb3 50%, #17396a 100%);
}

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
