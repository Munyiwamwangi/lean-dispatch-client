<template>
  <v-container>
    <v-row align="center" justify="center">
      <v-col cols="12" md="6" order-md="1">
        <v-card class="elevation-6 mt-15">
          <v-col class="card-content">
            <v-form
              ref="form"
              v-model="valid"
              lazy-validation
              @submit.prevent="handleSubmit"
            >
              <v-card-text class="text-default-color text-center">
                <h1 class="text-center mb-4">
                  {{ $t('resetPasswordTextTranslation') }} <br />
                </h1>
                <h3>{{ $t('enterEmailtoResetPasswordText') }}</h3>
              </v-card-text>

              <v-text-field
                v-model="email"
                :rules="emailRules"
                required
                :label="$t('emailAdressLabel')"
                prepend-inner-icon="mdi-account"
                outlined
                rounded
                color="blue"
                autocomplete="false"
                class="mt-8 add-height"
              />

              <v-btn
                :disabled="!valid"
                type="submit"
                style="height: 3.5em"
                color="accent"
                rounded
                block
              >
                <strong> {{ $t('submitButtonText') }} </strong>
              </v-btn>
              <div class="mt-2 text-center">
                <a target="_blank">
                  <strong style="text-decoration: underline" @click="login">
                    {{ $t('loginText') }}
                  </strong>
                </a>
              </div>
            </v-form>
          </v-col>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// import axios from "axios";
export default {
  name: 'forgot-password',
  data() {
    return {
      valid: true,
      email: '',
      emailRules: [
        (v) => !!v || this.$t('emailIputHint'),
        (v) => /.+@.+\..+/.test(v) || this.$t('emailmustBeValidText'),
      ],
    };
  },

  methods: {
    validate() {
      return this.$refs.form.validate();
    },

    resetValidation() {
      this.$refs.form.resetValidation();
    },

    login() {
      this.$router.push({ name: 'login' });
    },

    async handleSubmit() {
      if (!this.validate()) return;
      try {
        this.$http.post('mmauth/api/request-reset-email/', {
          email: this.email,
        });
        alert(
          'A password reset link has been sent to your email, reset your password to login'
        );
      } catch (error) {
        alert(error);
      }

      this.$router.push({ name: 'login' });
    },
  },
};
</script>

<style lang="scss" scoped>
.card-content {
  margin: inherit;
  padding: 20%;
}
</style>
