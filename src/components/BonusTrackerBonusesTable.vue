<template>
  <v-container fluid>
    <v-data-table
      :headers="headers"
      :items="filteredEmployeeBonuses"
      :items-per-page="itemPerPage.value"
      :footer-props="{
        itemsPerPageOptions: itemsPerPage,
      }"
      group-by="package.name"
      class="elevation-1"
      :loading="loading"
      :loading-text="$t('dataLoadingText')"
      :no-data-text="$t('noDataTextForTables')"
    >
      <template slot="progress">
        <v-progress-linear color="secondary" indeterminate></v-progress-linear>
      </template>

      <template v-slot:top>
        <v-dialog v-model="dialog" max-width="400px" persistent>
          <v-form ref="activationForm" v-model="formValid">
            <v-card>
              <v-card-title class="accent--text">
                {{ $t('bonusActivationRequesttranslate') }}
              </v-card-title>
              <v-card-subtitle v-if="requires_email">
                {{ $t('emailForBonusActivationTextTranslate') }}
              </v-card-subtitle>
              <v-card-subtitle v-if="document_required">
                {{ $t('uploadSupportingDocumentsForAction') }}
              </v-card-subtitle>

              <v-card-text v-if="requires_email">
                <v-text-field
                  v-model="email"
                  required
                  :label="$t('emailAdressText')"
                  :rules="emailRules"
                  rounded
                  outlined
                  type="email"
                  dense
                  hide-details="auto"
                ></v-text-field>
              </v-card-text>

              <v-card-text v-if="document_required">
                <v-card-subtitle class="accent--text">
                  {{ $t('documentUploadText') }}
                </v-card-subtitle>
                <template>
                  <v-file-input
                    v-model="supportFiles"
                    accept="image/png, image/jpeg, image/jpg"
                    :label="$t('fileInputText')"
                    :rules="fileRules"
                    multiple
                    counter
                    show-size
                    prepend-icon="mdi-paperclip"
                    hide-details="auto"
                  >
                  </v-file-input>
                </template>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="accent" text @click="closeBonusRequestDialog">
                  {{ $t('cancelButtonText') }}
                </v-btn>
                <v-btn color="accent" :disabled="!formValid" @click="submit">
                  {{ $t('submitButtonText') }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-form>
        </v-dialog>
      </template>

      <template v-slot:[`group.header`]="{ items, isOpen, toggle }">
        <th colspan="5">
          <v-icon @click="toggle">
            {{ isOpen ? 'mdi-minus' : 'mdi-plus' }}
          </v-icon>
          <span class="text-capitalize">
            {{ items[0].package.name }}
          </span>
        </th>
      </template>

      <template v-slot:[`item.id`]="props">
        {{ props.index + 1 }}
      </template>

      <!-- statuses  -->
      <template v-slot:[`item.bonus_status`]="{ item }">
        <v-btn v-if="item.activated" small color="success">
          {{ $t('activeButtonText') }}
        </v-btn>

        <v-btn v-else-if="item.disabled" small color="#aa6c39">
          {{ $t('didabledButtonText') }}
        </v-btn>

        <v-btn v-else-if="item.pending_approval" small color="warning">
          {{ $t('pendingButtonText') }}
        </v-btn>

        <v-btn v-else small color="secondary" @click="claimBonus(item)">
          {{ $t('inactiveButtonText') }}
        </v-btn>
      </template>
      <!-- statuses  -->
    </v-data-table>

    <SingleSelectBonusDialog
      :dialog="singleSelectBonus"
      :bonuses="claimedBonus"
      class="pa-3"
      @closeSingleSelect="closeSingleSelecBonustDialog"
    ></SingleSelectBonusDialog>
  </v-container>
</template>

<script>
import SingleSelectBonusDialog from '@/components/SingleSelectBonusesDialog';

export default {
  name: 'BonusTrackerTable',
  components: {
    SingleSelectBonusDialog,
  },
  data() {
    return {
      itemPerPage: {
        text: '25',
        value: 25,
      },
      itemsPerPage: [
        {
          text: '25',
          value: 25,
        },
        {
          text: '50',
          value: 50,
        },
        {
          text: '100',
          value: 100,
        },
        {
          text: 'All',
          value: -1,
        },
      ],
      bonuses: [],
      bonusIndex: -1,

      // file uploads
      supportFiles: [],
      email: '',
      emailRules: [
        (v) => !!v || 'E-mail is required',
        (v) => /.+@.+/.test(v) || 'E-mail must be valid',
      ],
      fileRules: [
        // todo: Check if theres a files in the files object
        (files) =>
          !files ||
          !files.some((file) => file.size > 5e6) ||
          'File should be less than 5 MB!',
      ],
      formValid: false,

      // bonus upload dialog
      document_required: false,
      requires_email: false,
    };
  },
  computed: {
    headers() {
      return [
        {
          text: 'ID',
          align: 'start',
          sortable: false,
          value: 'id',
          class: 'accent--text text-subtitle-2 text-uppercase',
        },
        {
          text: this.$t('bonusCodeTranslate'),
          sortable: false,
          value: 'bonus_code',
          class: 'accent--text text-subtitle-2 text-uppercase',
        },
        {
          text: this.$t('companyNameTranslate'),
          sortable: false,
          value: 'company',
          class: 'accent--text text-subtitle-2 text-uppercase',
        },
        {
          text: this.$t('bonusClaimTranslate'),
          sortable: false,
          value: 'description',
          class: 'accent--text text-subtitle-2 text-uppercase',
        },
        {
          text: this.$t('bonusStatusTranslation'),
          sortable: false,
          value: 'bonus_status',
          class: 'accent--text text-subtitle-2 text-uppercase',
        },
      ];
    },

    employeeBonuses() {
      return this.$store.state.employeeBonuses;
    },
    singleSelectPackage() {
      return this.$store.state.packages.filter(
        (_package) => _package.is_single_select
      );
    },

    watch: {},

    methods: {
      closeSingleSelecBonustDialog() {
        this.singleSelectBonus = false;
      },

      claimBonus(bonus) {
        this.bonusIndex = this.bonuses.indexOf(bonus);
        this.claimedBonus = Object.assign({}, bonus);
        this.document_required = this.claimedBonus.requires_document_upload;
        this.requires_email = this.claimedBonus.requires_email;

        // compare bonus package id to single select package id
        //  to identify single select bonuses
        if (bonus.package.id === this.singleSelectPackage[0].id) {
          this.singleSelectBonus = true;
        } else {
          this.dialog = true;
        }
      },

      closeBonusRequestDialog() {
        this.dialog = false;
        this.$nextTick(() => {
          this.bonusIndex = -1;
          this.email = '';
          this.files = [];
          this.document_required = false;
          this.requires_email = false;
        });
      },

      async submit() {
        // TODO: before submission check bonus attributes and validate form accordingly.
        let id = this.claimedBonus.id;

        let formdata = new FormData();

        this.supportFiles.forEach((file) => {
          formdata.append(file.name, file);
        });

        // if bonus requests need approval
        if (this.claimedBonus.needs_approval) {
          // call api to send bonus approval request
          this.showFeedback({
            status: 'submitting',
            message: 'submitting',
          });
          this.dialog = false;

          this.$http
            .post(`bms/api/bonus/${id}/approval/request/`, formdata, {
              headers: { 'Content-Type': 'multipart/form-data' },
            })
            .then((res) => {
              if (res.status === 201) {
                this.showFeedback({
                  status: 'success',
                  message: 'bonusApprovalRequestSent',
                });
                this.$store.dispatch('fetchEmployeeBonuses');
              }
            })
            .catch((err) => {
              this.showFeedback({
                status: 'fail',
                message: 'submissionFailed',
              });
              throw err;
            });
        }

        // if bonus request is subscription based.(employee only needs to provide an email)
        if (this.claimedBonus.requires_email) {
          // call api to send email and activate bonus.

          this.dialog = false;

          this.$http
            .patch(`bms/api/employees/bonuses/activate/${id}/`, {
              email: this.email,
            })
            .then((res) => {
              if (res.status === 200) {
                this.showFeedback({
                  status: 'success',
                  message: 'bonusActivatedSuccessfully',
                });
                this.$store.dispatch('fetchEmployeeBonuses');
              }
            })
            .catch((err) => {
              this.dialog = false;
              this.showFeedback({
                status: 'fail',
                message: 'submissionFailed',
              });
              throw err;
            });
        }
      },
    },
  },
};
</script>

<style lang="scss" scoped></style>
