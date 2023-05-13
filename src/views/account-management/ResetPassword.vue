<template>
  <v-container>
    <v-row align="center" justify="center">
      <v-col order-md="1" cols="12" md="6">
        <v-card style="padding: 20%" class="elevation-6 mt-15">
          <v-col class="card-content">
            <form @submit.prevent="handleSubmit">
              <v-card-text class="">
                <h1 class="text-center text-default-color mb-4">
                  {{ $t("resetPasswordTextTranslation") }} <br />
                </h1>
                <h4>{{ $t("pleaseEnterYourPasswordBelowText") }}</h4>
              </v-card-text>

              <v-text-field v-model="password" :rules="passwordRules" :label="$t('newPassword')" outlined rounded
                color="blue" autocomplete="false" :type="passwordShow ? 'text' : 'password'"
                :placeholder="$t('passwordInputFieldPlaceHolder')" prepend-inner-icon="mdi-key"
                :append-icon="passwordShow ? 'mdi-eye' : 'mdi-eye-off'" @click:append="passwordShow = !passwordShow" />

              <v-text-field v-model="password_confirm" :rules="passwordRules.concat(passwordConfirmationRule)"
                :label="$t('confirmNewPasswordText')" outlined rounded color="blue" autocomplete="false"
                :type="passwordShow ? 'text' : 'password'" :placeholder="$t('passwordInputFieldPlaceHolder')"
                prepend-inner-icon="mdi-key" :append-icon="passwordShow ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="passwordShow = !passwordShow" />

              <v-btn type="submit" class="mt-10" style="height: 3.5em" color="#536878" rounded dark block>
                <strong>{{ $t("submitButtonText") }}</strong>
              </v-btn>

              <v-row class="mt-2 bold-underlined text-center">
                <v-col cols="6">
                  <router-link to="/forgot-password"> Forgot Password </router-link>
                </v-col>

                <v-col cols="6">
                  <router-link to="/login"> Login </router-link>
                </v-col>
              </v-row>
            </form>
          </v-col>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "ConfirmPassword",

  computed: {
    passwordConfirmationRule() {
      return () => (this.password === this.password_confirm) || 'Password must match'
    }
  },

  data() {
    return {
      checkbox: false,
      valid: false,
      passwordShow: false,
      password: "",
      password_confirm: "",
      passwordRules: [
        (v) => !!v || "Password is required",
        (v) =>
          (v && v.length >= 6) || "Password must be 6  characters or more!",
      ],
    };
  },

  methods: {
    async handleSubmit() {
      let payload = {
        password: this.password,
        confirmPassword: this.password_confirm,
        token: this.$route.params.token,
      };
      try {
        await this.$http.post("api/auth/reset-password/", payload);
        this.$router.push("/login");
      } catch (error) {
        return error;
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
