<template>
  <div>
    <v-navigation-drawer v-model="filterDrawer" app right width="320">
      <v-form class="pa-4">
        <h6 class="text-h6 text-capitalize">{{ $t('bonusesFilterText') }}</h6>
        <v-row no-gutters>
          <v-col>
            <p class="text-subtitle-2">{{ $t('company') }}</p>
            <v-autocomplete
              v-model="filterCompany"
              :items="filteredCompanies"
              :label="$t('company')"
              dense
              outlined
              rounded
              clearable
              open-on-clear
            ></v-autocomplete>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col>
            <p class="text-subtitle-2">{{ $t('bonusCodeTranslate') }}</p>
            <v-autocomplete
              v-model="filterBonusCode"
              :items="filterBonusCodes"
              :label="$t('bonusCodeTranslate')"
              dense
              outlined
              rounded
              clearable
              open-on-clear
            ></v-autocomplete>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col>
            <p class="text-subtitle-2">{{ $t('bonusStatusTranslation') }}</p>
            <v-select
              v-model="filterStatus"
              :items="statuses"
              :label="$t('bonusStatusTranslation')"
              item-text="text"
              item-value="value"
              dense
              outlined
              rounded
              clearable
              open-on-clear
            ></v-select>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-btn
              class="text-capitalize"
              text
              rounded
              @click="closeFilterSidebar"
            >
              {{ $t('cancelButtonText') }}
            </v-btn>
          </v-col>
          <v-col>
            <v-btn
              class="text-capitalize"
              color="accent"
              rounded
              @click="clear"
            >
              {{ $t('clearButtonText') }}
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-navigation-drawer>
    <v-toolbar color="#f8f8f8" dense>
      <v-toolbar-title class="secondary--text text-subtitle-2 text-capitalize">
        {{ $t('myBonuses') }}
      </v-toolbar-title>
    </v-toolbar>
    <v-toolbar light elevation="1" dense>
      <v-toolbar-title class="text-subtitle-2 text-capitalize">
        {{ $t('total') }} {{ $t('bonusesTranslate') }}:
        {{ employeeBonuses.length }}
      </v-toolbar-title>
      <v-spacer></v-spacer>

      <v-row no-gutters>
        <v-toolbar-title class="text-h2 text-subtitle-2">
          This is a summary of your five most recent bonuses
        </v-toolbar-title>
      </v-row>

      <v-spacer></v-spacer>

      <p class="mb-0 pr-2 text-caption text-capitalize">
        {{ $t('recordsTranslate') }}:
      </p>

      <v-btn icon @click.stop="filterDrawer = !filterDrawer">
        <v-icon>mdi-filter-variant</v-icon>
      </v-btn>
    </v-toolbar>
    <v-container fluid>
      <v-data-table
        :headers="headers"
        :items="filteredEmployeeBonuses"
        class="elevation-1"
        :loading="loading"
        :loading-text="$t('dataLoadingText')"
        :no-data-text="$t('noDataTextForTables')"
        hide-default-footer
      >
        <!-- group-by="package.name" -->
        <template slot="progress">
          <v-progress-linear
            color="secondary"
            indeterminate
          ></v-progress-linear>
        </template>
        <template v-slot:top>
          <v-dialog v-model="dialog" max-width="400px" persistent>
            <v-form ref="activationForm" v-model="formValid">
              <v-card>
                <v-card-title class="accent--text">
                  {{ $t('bonusActivationRequesttranslate') }}
                  <v-card-subtitle class="pl-0">
                    <strong>Note:</strong> You are about to activate this bonus,
                    after which you can access its priviledges.
                  </v-card-subtitle>
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

        <template v-slot:[`item.date_assigned`]="props">
          {{ $date(props.item.date_assigned).format('DD-MM-YYYY HH:mm') }}
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

        <template v-slot:[`group.header`]="{ items, isOpen, toggle }">
          <th colspan="6">
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
      </v-data-table>

      <SingleSelectBonusDialog
        :dialog="singleSelectBonus"
        :bonuses="claimedBonus"
        class="pa-3"
        @closeSingleSelect="closeSingleSelecBonustDialog"
      ></SingleSelectBonusDialog>
    </v-container>

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
  </div>
</template>

<style scoped>
.v-select__selections input {
  display: none;
}
</style>

<script>
import FeedbackSnackBar from '@/components/FeedbackSnackBar';
import SingleSelectBonusDialog from '@/components/SingleSelectBonusesDialog';
import FilterMixin from '../../src/mixins/filterMixins';
import { mapGetters } from 'vuex';

export default {
  name: 'MyBonuses',
  components: {
    FeedbackSnackBar,
    SingleSelectBonusDialog,
  },

  mixins: [FilterMixin],
  data: () => ({
    drawer: null,

    filterDrawer: false,
    dialog: false,
    dateDialog: false,
    singleSelectBonus: false,
    claimedBonus: {},
    loading: false,
    errored: false,
    filterDateRange: [],

    bonuses: [],
    companies: [],

    bonusIndex: -1,
    selectedItem: 0,
    statuses: [
      {
        text: 'Active',
        value: true,
      },
      {
        text: 'Inactive',
        value: false,
      },
    ],

    // sidebar filter
    filterCompany: '',
    filterBonusCode: '',
    filterStatus: null,

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

    // user feedback
    bonusandPackageActionStatusSnack: false,
    bonusandPackageActionStatusSnackColor: '',
    bonusandPackageActionStatusSnackText: '',

    feedbackSnackShowing: false,
    feedbackSnackColor: '',
    feedbackSnackText: '',

    // bonus upload dialog
    document_required: false,
    requires_email: false,
  }),

  computed: {
    employeeBonuses() {
      return this.$store.state.employeeBonuses || [];
    },
    currentEmployeeEmail() {
      return this.$store.state.currentUser.email;
    },

    filteredCompanies() {
      return this.employeeBonuses.map((bonus) => bonus.company);
    },

    filterBonusCodes() {
      return this.employeeBonuses.map((bonus) => bonus.bonus_code);
    },

    filterDateRangeText() {
      return this.filterDateRange.join(' to ');
    },

    filteredEmployeeBonuses() {
      let conditions = [];

      if (this.filterCompany) {
        conditions.push(this.filterByCompany);
      }
      if (this.filterBonusCode) {
        conditions.push(this.filterByBonusCode);
      }

      if (this.filterStatus) {
        conditions.push(this.filterByStatus);
      }

      if (conditions.length > 0) {
        return this.employeeBonuses.filter((bonus) => {
          return conditions.every((condition) => {
            return condition(bonus);
          });
        });
      }

      return this.employeeBonuses.slice(0, 5);
    },

    showByCountCompaniesList() {
      return this.filteredEmployeeBonuses.slice(0, this.itemPerPage.value);
    },

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
          text: this.$t('company'),
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
          text: this.$t('date'),
          sortable: false,
          value: 'date_assigned',
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

    singleSelectPackage() {
      return this.packages.filter((_package) => _package.is_single_select);
    },

    ...mapGetters('packages', {
      packages: 'allPackages',
    }),
  },

  watch: {
    dialog(val) {
      val || this.closeBonusRequestDialog();
    },
    itemPerPage(val) {
      this.showByCountCompaniesList = this.filteredEmployeeBonuses.slice(
        0,
        val.value
      );
    },
  },

  created() {
    // console.log('single select', JSON.stringify(this.packages, null, 3));
    // console.log(
    //   'employee bonuses',
    //   JSON.stringify(this.employeeBonuses, null, 3)
    // );

    this.$store.dispatch('packages/loadPackages');
    this.$store.dispatch('fetchEmployeeBonuses');
  },

  methods: {
    closeSingleSelecBonustDialog() {
      this.singleSelectBonus = false;
    },
    // request for a bonus
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

    closeFilterSidebar() {
      // toggle filter sidebar and clear filters;
      this.filterDrawer = false;
    },

    // clear filters
    clear() {
      this.filterCompany = '';
      this.filterBonusCode = '';
      this.filterStatus = null;
    },
    // request bonus
    async submit() {
      // TODO: before submission check bonus attributes and validate form accordingly.
      let id = this.claimedBonus.id;

      let formdata = new FormData();

      this.supportFiles.forEach((file) => {
        formdata.append(file.name, file);
      });

      // if bonus requests need approval
      if (this.claimedBonus.requires_document_upload) {
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
      else if (this.claimedBonus.requires_email) {
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
      //when no action or further input needed
      else {
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

    showFeedback({ status, message }) {
      let snackColor = '';
      if (status === 'submitting') {
        snackColor = 'info';
      } else if (status === 'success') {
        snackColor = 'success lighten-1';
      } else if (status === 'fail') {
        snackColor = 'red lighten-1';
      }
      this.feedbackSnackShowing = true;
      this.feedbackSnackColor = snackColor;
      this.feedbackSnackText = message;
    },
  },
};
</script>
