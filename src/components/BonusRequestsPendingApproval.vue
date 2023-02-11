<template>
  <div>
    <v-data-table
      :headers="pendingApprovalHeaders"
      :items="pendingApproval"
      :items-per-page="itemPerPage.value"
      class="elevation-1"
      :loading="loading"
      :loading-text="$t('dataLoadingText')"
      :no-data-text="$t('noDataTextForTables')"
      :footer-props="{
        itemsPerPageOptions: itemsPerPage,
      }"
    >
      <template v-slot:top>
        <RecordsShowingSelector
          :item-per-page.sync="itemPerPage"
          :items-per-page="itemsPerPage"
        ></RecordsShowingSelector>

        <v-dialog v-model="commentDialog" max-width="500px" persistent>
          <v-form ref="commentForm" v-model="commentFormValid">
            <v-card class="text-center">
              <v-card-title class="text-h6 text-capitalize">
                {{ $t('declineWithComment') }}
              </v-card-title>
              <v-card-text>
                <v-textarea
                  v-model="comment"
                  outlined
                  rows="2"
                  auto-grow
                  clearable
                  dense
                  counter="2500"
                  hide-details="auto"
                  :label="$t('reasonForDecline')"
                  class="text-capitalize"
                  :rules="commentRules"
                ></v-textarea>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="accent darken-1"
                  text
                  @click="dismissCommentDialog"
                >
                  {{ $t('cancelButtonText') }}
                </v-btn>
                <v-btn
                  color="secondary darken-1"
                  text
                  :disabled="!commentFormValid"
                  @click="submitComment"
                >
                  {{ $t('submitButtonText') }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-form>
        </v-dialog>

        <v-dialog v-model="approveDialog" max-width="500px" persistent>
          <v-card class="text-center" :loading="submitting">
            <template slot="progress">
              <LoadingBar></LoadingBar>
            </template>
            <v-card-text class="py-4">
              <v-icon color="info" dark size="64">
                mdi-information-outline
              </v-icon>
            </v-card-text>
            <v-card-text class="text-h6 text-capitalize">
              {{ $t('confirmApprovalText') }}
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="accent darken-1"
                :disabled="submitting"
                text
                @click="dissmissApproveDialog"
              >
                {{ $t('cancelButtonText') }}
              </v-btn>
              <v-btn
                color="secondary darken-1"
                text
                :disabled="submitting"
                @click="confirmRequestApproval"
              >
                {{ $t('okButtonText') }}
              </v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </template>
      <template slot="progress">
        <v-progress-linear color="secondary" indeterminate></v-progress-linear>
      </template>

      <template v-slot:[`item.id`]="props">
        {{ props.index + 1 }}
      </template>

      <template v-slot:[`item.request_date`]="props">
        {{ $date(props.item.request_date).format('DD-MM-YYYY HH:mm') }}
      </template>

      <template v-slot:[`item.preview`]="{ item }">
        <BonusRequestPreviewButton
          :item="item"
          v-on="$listeners"
        ></BonusRequestPreviewButton>
      </template>

      <template v-slot:[`item.files`]="{ item }">
        <FilesDownload :item="item"></FilesDownload>
      </template>

      <template v-slot:[`item.action`]="{ item }">
        <v-row>
          <v-col cols="6">
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-btn
                  icon
                  color="success"
                  v-on="on"
                  @click="showApproveDialog(item)"
                >
                  <v-icon>mdi-clipboard-check</v-icon>
                </v-btn>
              </template>
              <span>Approve</span>
            </v-tooltip>
          </v-col>
          <v-col cols="6">
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-btn
                  icon
                  color="red"
                  v-on="on"
                  @click="showCommentDialog(item)"
                >
                  <v-icon>mdi-clipboard-remove</v-icon>
                </v-btn>
              </template>
              <span>Decline</span>
            </v-tooltip>
          </v-col>
        </v-row>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import FilesDownload from './FilesDownload.vue';
import LoadingBar from './LoadingBar.vue';
import BonusRequestPreviewButton from '../components/BonusRequestPreviewButton.vue';
import RecordsShowingSelector from './RecordsShowingSelector.vue';

export default {
  name: 'BonusRequestsPendingApproval',
  components: {
    LoadingBar,
    FilesDownload,
    BonusRequestPreviewButton,
    RecordsShowingSelector,
  },
  data() {
    return {
      loading: true,
      submitting: false,
      commentDialog: false,
      approveDialog: false,
      commentFormValid: false,

      commentRules: [(v) => !!v || this.$t('commentRequired')],

      comment: '',
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
      pendingApproval: [],

      // employee bonus update related data
      employeeBonusId: -1,
      employeeBonusComment: {},
    };
  },
  computed: {
    pendingApprovalHeaders() {
      //  Table headers.
      return [
        {
          text: 'ID',
          align: 'start',
          sortable: false,
          value: 'id',
          class: 'accent--text text-subtitle-2 text-uppercase',
        },
        {
          text: this.$t('employeeNameTranslate'),
          sortable: false,
          value: 'employee_name',
          class: 'accent--text text-subtitle-2 text-uppercase',
        },
        {
          text: this.$t('personalIdCode'),
          sortable: false,
          value: 'personal_id_code',
          class: 'accent--text text-subtitle-2 text-uppercase',
        },
        {
          text: this.$t('company'),
          value: 'company',
          class: 'accent--text text-subtitle-2 text-uppercase',
        },
        {
          text: this.$t('employeeTypeText'),
          sortable: false,
          value: 'employee_type',
          class: 'accent--text text-subtitle-2 text-uppercase',
        },
        {
          text: this.$t('date'),
          value: 'request_date',
          class: 'accent--text text-subtitle-2 text-uppercase',
        },
        {
          text: this.$t('bonusClaimTranslate'),
          value: 'bonus_claim',
          class: 'accent--text text-subtitle-2 text-uppercase',
        },
        {
          text: this.$t('files'),
          sortable: false,
          value: 'files',
          class: 'accent--text text-subtitle-2 text-uppercase',
          align: 'center',
        },
        {
          text: this.$t('previewTranslate'),
          sortable: false,
          value: 'preview',
          class: 'accent--text text-subtitle-2 text-uppercase',
          align: 'center',
        },
        {
          text: this.$t('actionsTranslate'),
          sortable: false,
          value: 'action',
          class: 'accent--text text-subtitle-2 text-uppercase',
          align: 'center',
        },
      ];
    },
  },
  created() {
    this.fetchBonusRequestsPendingApproval();
  },

  methods: {
    fetchBonusRequestsPendingApproval() {
      // fetches all bonus requests pending approval.
      this.loading = true;
      this.$http
        .get('/bms/api/employees/bonus/requests/?pending_approval=True')
        .then((result) => {
          let results = result.data.map((bonus_request) => {
            return {
              id: bonus_request.id,
              approval_code: bonus_request.request_code,
              employee_name: bonus_request.employee_name,
              employee_type: bonus_request.employee_type,
              personal_id_code: bonus_request.employee_name,
              company: bonus_request.employee_company,
              request_date: bonus_request.requested_at,
              bonus_claim: bonus_request.bonus_name,
              files: bonus_request.approval_requests[0].links,
            };
          });
          this.pendingApproval = results;
        })
        .catch((err) => {
          throw err;
        })
        .finally(() => (this.loading = false));
    },

    // dialogs and their interactions.
    showCommentDialog(employee_bonus) {
      this.commentDialog = true;
      this.employeeBonusId = employee_bonus.id;
    },

    showApproveDialog(employee_bonus) {
      this.approveDialog = true;
      this.employeeBonusId = employee_bonus.id;
    },

    dismissCommentDialog() {
      this.commentDialog = false;
      this.$nextTick(() => {
        this.employeeBonusId = -1;
        this.comment = '';
      });
    },

    submitComment() {
      this.commentDialog = false;
      this.declineBonusRequest();
    },

    dissmissApproveDialog() {
      this.approveDialog = false;
      this.$nextTick(() => {
        this.employeeBonusId = -1;
        this.submitting = false;
      });
    },

    confirmRequestApproval() {
      this.approveBonusRequest();
    },

    approveBonusRequest() {
      let id = this.employeeBonusId;

      this.submitting = true;

      this.$http
        .patch(`bms/api/bonus/${id}/request/?action=approve`)
        .then((res) => {
          if (res.status === 200) {
            this.$emit('show-feedback', {
              status: 'success',
              message: 'bonusRequestApproved',
            });
            this.refreshBonusRequests();
          }
        })
        .catch((err) => {
          this.$emit('show-feedback', {
            status: 'fail',
            message: 'bonusRequestApprovalFailed',
          });
          throw err;
        })
        .finally(() => {
          this.dissmissApproveDialog();
        });
    },

    declineBonusRequest() {
      let id = this.employeeBonusId;

      this.$http
        .patch(`bms/api/bonus/${id}/request/?action=decline`, {
          comment: this.comment,
        })
        .then((res) => {
          if (res.status === 200) {
            this.$emit('show-feedback', {
              status: 'success',
              message: 'bonusRequestDeclined',
            });
            this.refreshBonusRequests();
          }
        })
        .catch((err) => {
          this.$emit('show-feedback', {
            status: 'fail',
            message: 'bonusRequestDeclineFailed',
          });
          throw err;
        })
        .finally(() => {
          this.dissmissApproveDialog();
        });
    },

    refreshBonusRequests() {
      this.fetchBonusRequestsPendingApproval();
    },
  },
};
</script>

<style lang="scss" scoped></style>
