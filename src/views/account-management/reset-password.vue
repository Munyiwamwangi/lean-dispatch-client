<template>
  <v-container>
    <v-row align="center" justify="center">
      <v-col order-md="1" cols="12" md="6">
        <v-card style="padding: 20%" class="elevation-6 mt-15">
          <v-col class="card-content">
            <form @submit.prevent="handleSubmit">
              <v-card-text class="">
                <h1 class="text-center text-default-color mb-4">
                  {{ $t('resetPasswordTextTranslation') }} <br />
                </h1>
                <h4>{{ $t('pleaseEnterYourPasswordBelowText') }}</h4>
              </v-card-text>

              <v-text-field
                v-model="password"
                :rules="passwordRules"
                :label="$t('newPassword')"
                outlined
                rounded
                color="blue"
                autocomplete="false"
                :type="passwordShow ? 'text' : 'password'"
                :placeholder="$t('passwordInputFieldPlaceHolder')"
                prepend-inner-icon="mdi-key"
                :append-icon="passwordShow ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="passwordShow = !passwordShow"
              />

              <v-text-field
                v-model="password_confirm"
                :rules="passwordRules"
                :label="$t('confirmNewPasswordText')"
                outlined
                rounded
                color="blue"
                autocomplete="false"
                :type="passwordShow ? 'text' : 'password'"
                :placeholder="$t('passwordInputFieldPlaceHolder')"
                prepend-inner-icon="mdi-key"
                :append-icon="passwordShow ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="passwordShow = !passwordShow"
              />

              <v-btn
                type="submit"
                class="mt-10"
                style="height: 3.5em"
                color="#536878"
                rounded
                dark
                block
              >
                <strong>{{ $t('submitButtonText') }}</strong>
              </v-btn>

              <div class="mt-2 bold-underlined text-center">
                <router-link to="/forgot-password"> Login </router-link>
              </div>
            </form>
          </v-col>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios';
export default {
  name: 'ConfirmPassword',

  data() {
    return {
      checkbox: false,
      valid: false,
      passwordShow: false,
      password: '',
      password_confirm: '',
      passwordRules: [
        (v) => !!v || 'Password is required',
        (v) =>
          (v && v.length >= 6) || 'Password must be 6  characters or more!',
      ],
    };
  },

  methods: {
    async handleSubmit() {
      let data = {
        password: this.password,
        password_confirm: this.password_confirm,
        token: this.$route.params.token,
      };
      try {
        await axios.post('mmauth/api/reset-password/', data);
        this.$router.push('/login');
      } catch (error) {
        return error;
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
