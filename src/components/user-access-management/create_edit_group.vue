<template>
  <div>
    <v-dialog v-model="dialog" max-width="450px">
      <v-card outlined>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-card-text>
            <v-list-item-title class="accent--text text-capitalize mb-2">
              <h4>{{ formTitle }} <span style="color: #a31515"> * </span></h4>
            </v-list-item-title>
            <v-text-field
              v-model="newGroup.name"
              solo
              dense
              rounded
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
  name: 'EditGroupDialog',

  props: {
    dialog: {
      type: Boolean,
      default: false,
    },
    formTitle: {
      type: String,
      required: true,
    },
    newGroup: {
      type: Object,
      required: true,
    },
    defaultGroup: {
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

  methods: {
    closeRoleCreatingDialog() {
      this.$emit('close-dialog');
      this.resetValidation();
    },

    validate() {
      return this.$refs.form.validate();
    },

    resetValidation() {
      this.$refs.form.resetValidation();
    },

    saveRole() {
      if (!this.validate()) return;
      const data = {
        title: this.newGroup.name,
      };
      this.$emit('send-group-data', data);
      this.closeRoleCreatingDialog();
    },
  },
};
</script>
