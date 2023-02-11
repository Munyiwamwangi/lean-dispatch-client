<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="12" sm="8" class="mt-4 mb-4">
        <v-card class="elevation-6 mt-12">
          <v-row>
            <!-- col 1  -->
            <v-col
              cols="12"
              md="6"
              class="first-col hidden-xs-and-up hidden-sm-and-down"
            >
              <div class="align_horizontal_left">
                <Language> </Language>
              </div>
              <div class="center">
                <v-row>
                  <v-card-text class="white--text text-uppercase">
                    <h1 class="text-center">
                      {{ $t('welcome') }} {{ $t('bonusManagementPortal') }}
                    </h1>
                  </v-card-text>
                  <hr class="horizontal-underline" />
                </v-row>
              </div>
            </v-col>

            <!-- col 2  -->
            <v-col cols="12" md="6">
              <v-form
                ref="form"
                v-model="valid"
                lazy-validation
                @submit.prevent="submit"
              >
                <v-card-text>
                  <h1
                    class="text-center text-default-color mt-4 mb-3 text-capitalize"
                  >
                    {{ $t('loginToYourAccount') }}
                  </h1>
                  <h4 class="text-center mb-3 mt-3">
                    {{ $t('fillDetailsToAccessAccount') }}
                  </h4>
                  <v-row align="center" justify="center">
                    <v-col cols="12" sm="8">
                      <v-text-field
                        ref="email"
                        v-model="email"
                        :rules="emailRules"
                        required
                        :label="$t('emailAdressLabel')"
                        prepend-inner-icon="mdi-account"
                        outlined
                        rounded
                        color="blue"
                        autocomplete="false"
                        class="mt-8"
                      />
                      <v-text-field
                        ref="password"
                        v-model="password"
                        required
                        :rules="passwordRules"
                        outlined
                        :label="$t('passwordInputFieldPlaceHolder')"
                        rounded
                        color="blue"
                        autocomplete="false"
                        :type="passwordShow ? 'text' : 'password'"
                        placeholder="Password"
                        prepend-inner-icon="mdi-key"
                        :append-icon="passwordShow ? 'mdi-eye' : 'mdi-eye-off'"
                        @click:append="passwordShow = !passwordShow"
                      />

                      <div class="mainCheckBox">
                        <v-checkbox
                          v-model="checkbox"
                          :rules="[(v) => !!v || 'You must agree to continue!']"
                          required
                        >
                          <template v-slot:label>
                            <div>
                              {{ $t('acceptAll') }}
                              <v-tooltip>
                                <template v-slot:activator="{ on }">
                                  <a
                                    class="bold-underlined"
                                    target="_blank"
                                    @click.stop
                                    v-on="on"
                                  >
                                    {{ $t('termsAndConditions') }}
                                  </a>
                                </template>
                              </v-tooltip>
                            </div>
                          </template>
                        </v-checkbox>
                      </div>

                      <v-btn
                        x-large
                        rounded
                        block
                        :disabled="!valid"
                        color="#536878"
                        type="submit"
                        class="t-white"
                        :loading="loading"
                      >
                        <h2 class="text-capitalize">
                          {{ $t('loginText') }}
                        </h2>
                      </v-btn>

                      <div class="mt-2 text-center bold-underlined">
                        <router-link to="/forgot-password">
                          {{ $t('forgotPassword') }}
                        </router-link>
                      </div>

                      <div
                        class="d-flex justify-space-between align-center mx-10 mb-8 mt-5"
                      >
                        <hr class="or-line" />
                        <h5 class="text-center">{{ $t('or') }}</h5>
                        <hr class="or-line" />
                      </div>

                      <div class="d-flex align-center">
                        <v-btn class="place-center" fab @click="googleLogin()">
                          <v-icon color="red">fab fa-google</v-icon>
                        </v-btn>
                      </div>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-form>
            </v-col>
            <!-- col 2 ends  -->
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Language from '../../src/components/language.vue';

export default {
  name: 'login',
  components: {
    Language,
  },

  data() {
    return {
      // form validation essentials
      checkbox: false,
      valid: false,
      passwordShow: false,
      users: null,

      email: '',
      emailRules: [
        (v) => !!v || this.$t('emailIputHint'),
        (v) => /.+@.+\..+/.test(v) || this.$t('emailmustBeValidText'),
      ],
      password: '',
      passwordRules: [
        (v) => !!v || this.$t('passwordInputHint1'),
        (v) =>
          (v && v.length >= 6) || this.$t('minimalPasswordCharacterErrortext'),
      ],

      // form essentials
      formErrors: [false],
      loading: false,
    };
  },

  computed: {
    showError() {
      const error = this.$store.getters['getError'].error;
      if (!error) {
        this.formErrors.push[1];
      }
      return error;
    },
  },

  watch: {
    emailRules: 'validateForm',
    email: 'validateForm',
    password: 'validateForm',
  },

  methods: {
    validateForm() {
      this.$refs.form.validate();
    },

    resetValidation() {
      this.$refs.form.valid;
    },

    //  email and password login
    async submit() {
      const data = {
        email: this.email,
        password: this.password,
      };
      if (this.$refs.form.validate()) {
        this.loading = true;
        this.$store
          .dispatch('login', data)
          .then(() => {
            this.$store.dispatch('setError', {
              text: 'successfully logged in',
              color: 'success lighten-1',
            });
            this.loading = false;
          })
          .catch(() => {
            this.emailRules = [
              ...this.emailRules,
              (v) => v === 'invalid' || 'Invalid email or password',
            ];
            this.passwordRules = [
              ...this.passwordRules,
              (v) => v === 'invalid' || 'Invalid email or password',
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
      this.$router.push({ name: 'password-reset' }).catch(() => {});
    },
  },
};
</script>

<style lang="scss" scoped>
.v-application .first-col {
  // border-bottom-right-radius: 300px !important;
  background-color: #536878;
}

.text-default-color {
  color: #536878;
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
