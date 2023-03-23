<template>
  <div>
    <v-dialog v-model="dialog" max-width="450px" persistent>
      <v-card class="px-2 pl-0 pr-0">
        <v-card-title class="">
          {{ formTitle }}
        </v-card-title>
        <v-card-text>
          <v-form ref="registerForm" v-model="valid" lazy-validation>
            <v-row>
              <v-col cols="12" sm="6" md="6" class="pb-0">
                <v-text-field
                  v-model="rider.firstName"
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
                  v-model="rider.lastName"
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
                  v-model="rider.email"
                  :rules="[rules.required, rules.emailRules]"
                  dense
                  outlined
                  label="E-mail"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="6" class="pt-0 pb-0">
                <v-combobox
                  v-model="defaultUserType"
                  :rules="[rules.required]"
                  :items="userTypes"
                  dense
                  outlined
                  item-text="title"
                  item-value="id"
                  label="User Type"
                  required
                  readonly
                ></v-combobox>
              </v-col>
              <v-col cols="12" sm="6" md="6" class="pt-0 pb-0">
                <v-text-field
                  v-model="rider.phonenumber"
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
              <v-col v-if="editId === -1" cols="12" class="pt-0 pb-0">
                <v-text-field
                  v-model="rider.password"
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
                <div class="mainCheckBox">
                  <v-checkbox
                    v-model="rider.acceptTerms"
                    :rules="[rules.required]"
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
          <v-btn text class="" @click="close">close </v-btn>
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
    editId: {
      type: Number,
      default: -1,
    },
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
      registerForm: true,
      form: false,

      formErrors: [false],

      // new data
      userTypes: [{ id: 2, title: "rider" }],

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
      return () => this.rider.password === this.verify || "Password must match";
    },
    defaultUserType() {
      return this.userTypes[0];
    },
  },
  created() {
    // console.log(this.rider);
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

    save() {
      this.rider["userType"] = this.defaultUserType.title;
      console.log(this.rider);

      if (this.$refs.registerForm.validate()) {
        this.$emit("rider-data", this.rider);
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
