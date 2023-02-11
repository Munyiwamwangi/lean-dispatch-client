<template>
  <v-row>
    <v-dialog
      v-model="computedDialog"
      transition="dialog-bottom-transition"
      persistent
      max-width="600px"
    >
      <v-card>
        <v-card-title>
          <span class="accent--text">{{
            $t('confirmSingleSelectBonusDialogTitle')
          }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col>
                <p>
                  {{ $t('bonusCodeTranslate') }}: {{ selectedBonus.bonus_code }}
                </p>
                <p>{{ $t('Company') }}: {{ selectedBonus.company }}</p>
                <p class="text-capitalize">
                  {{ $t('bonusDescription') }}: {{ selectedBonus.description }}
                </p>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="accent" text @click="closeConfidoDialog">
            {{ $t('closeButtonText') }}
          </v-btn>
          <v-btn color="accent" @click="submit">
            {{ $t('confirmButtonText') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- snackbar  -->
    <v-snackbar
      v-model="bonusandPackageActionStatusSnack"
      :timeout="5000"
      :color="bonusandPackageActionStatusSnackColor"
      shaped
      app
      top
    >
      {{ bonusandPackageActionStatusSnackText }}

      <template v-slot:action="{ attrs }">
        <v-btn
          v-bind="attrs"
          text
          @click="bonusandPackageActionStatusSnack = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>

    <FeedbackSnackBar
      :show-snack.sync="feedbackSnackShowing"
      :snack-text="feedbackSnackText"
      :snack-color="feedbackSnackColor"
    ></FeedbackSnackBar>
    <!-- snackbar  -->
  </v-row>
</template>

<script>
import FeedbackSnackBar from '@/components/FeedbackSnackBar';

export default {
  name: 'health-insurance',
  components: {
    FeedbackSnackBar,
  },

  emits: ['closeSingleSelect'],

  props: {
    bonuses: {
      type: Object,
      required: true,
    },
    dialog: {
      type: Boolean,
      required: true,
    },
  },

  data: () => ({
    files: [],
    submitting: false, // toggles progress bar when a user assigns a bonus to employee
    submitErrored: false,
    loading: false,
    errored: false,
    showAlert: false,
    alertType: null,

    // user feedback
    bonusandPackageActionStatusSnack: false,
    bonusandPackageActionStatusSnackColor: '',
    bonusandPackageActionStatusSnackText: '',

    feedbackSnackShowing: false,
    feedbackSnackColor: '',
    feedbackSnackText: '',
  }),

  computed: {
    selectedBonus() {
      return this.bonuses;
    },
    currentUserEmail() {
      return this.$store.state.currentUser.email;
    },
    computedDialog() {
      return this.dialog;
    },
  },

  methods: {
    closeConfidoDialog() {
      this.$emit('closeSingleSelect');
    },

    async submit() {
      this.loading = true;

      let bonusData = {
        bonus: { pending_approval: true },
        email: this.currentUserEmail,
      };
      let id = this.selectedBonus.id;

      this.$http
        .patch(`bms/api/bonus/${id}/approval/request/`, bonusData)
        .then((res) => {
          if (res.status === 200) {
            this.bonusandPackageActionStatusSnack = true;
            this.bonusandPackageActionStatusSnackColor = 'success';
            this.bonusandPackageActionStatusSnackText =
              'Bonus Activation Request Successful';
            this.$emit('closeSingleSelect');
          }
        })
        .then(() => {
          this.$store.dispatch('fetchEmployeeBonuses');
        })
        .catch(() => {
          this.bonusandPackageActionStatusSnack = true;
          this.bonusandPackageActionStatusSnackColor = 'red';
          this.bonusandPackageActionStatusSnackText = 'Request failed.';
        })
        .finally(() => {
          this.loading = false;
          this.$emit('closeSingleSelect');
        });
    },
  },
};
</script>
