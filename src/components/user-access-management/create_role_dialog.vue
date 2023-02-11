<template>
  <div>
    <v-dialog v-model="openFormDialog" max-width="450px" persistent>
      <v-card outlined>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-card-text>
            <v-list-item-title class="accent--text text-capitalize mb-2">
              <h4>{{ formName }} <span style="color: #a31515"> * </span></h4>
            </v-list-item-title>
            <v-text-field
              v-model="newRole.name"
              solo
              dense
              rounded
              append-icon=""
              clearable
              outlined
              class="pr-2"
              :rules="[rules.required]"
            ></v-text-field>

            <v-card-actions class="pt-0 mt-0">
              <v-spacer></v-spacer>
              <v-btn
                small
                text
                color="accent"
                class="text-capitalize"
                @click="closeRoleCreatingDialog()"
              >
                {{ $t('cancelButtonText') }}
              </v-btn>
              <v-btn
                small
                color="accent"
                :disabled="!valid"
                class="text-capitalize"
                @click="saveRole()"
              >
                {{ $t('saveButtonText') }}
              </v-btn>
            </v-card-actions>
          </v-card-text>
        </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'CreateRoleDialog',

  props: {
    dialog: {
      type: Boolean,
      default: false,
    },
    formName: {
      type: String,
      required: true,
    },
    newRole: {
      type: Object,
      required: true,
    },
    defaultRole: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      valid: true,
      rules: {
        required: (value) => !!value || 'Required.',
      },
    };
  },

  computed: {
    openFormDialog: {
      get() {
        return this.dialog;
      },
      set() {
        return this.dialog;
      },
    },
  },

  methods: {
    closeRoleCreatingDialog() {
      this.$emit('close-dialog');
      this.reset();
      Object.keys(this.newRole).forEach((key) => delete this.newRole[key]);
    },

    validate() {
      return this.$refs.form.validate();
    },

    reset() {
      this.$refs.form.reset();
      this.$refs.form.resetValidation();
    },

    saveRole() {
      if (!this.validate()) return;

      const data = [this.newRole.name].map((_titles) => {
        return {
          title: _titles,
        };
      });
      this.reset();
      this.$emit('send-role-data', data);
      Object.keys(this.newRole).forEach((key) => delete this.newRole[key]);
    },
  },
};
</script>
