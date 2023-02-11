<template>
  <v-container fluid>
    <v-data-table
      :headers="headers"
      :items="bonuses"
      :items-per-page="itemPerPage.value"
      hide-default-footer
      class="elevation-1"
      group-by="package.name"
      :loading="loading"
      :loading-text="$t('dataLoadingText')"
      :no-data-text="$t('noDataTextForTables')"
    >
      <template slot="progress">
        <LoadingBar></LoadingBar>
      </template>
      <template v-slot:top>
        <TableTopbar
          :item-per-page.sync="itemPerPage"
          :items-per-page="itemsPerPage"
        >
          <template #leading>
            <v-btn
              class="text-uppercase"
              color="primary"
              small
              @click="launchBonusDialog"
            >
              {{ $t('addBonusClaim') }}
            </v-btn>
          </template>
          <template #trailing>
            <v-btn icon @click.stop="toggleFilter()">
              <v-icon>mdi-filter-variant</v-icon>
            </v-btn>
          </template>
        </TableTopbar>

        <!-- Add/Edit bonus dialog -->
        <v-dialog
          v-model="dialog"
          max-width="540px"
          :fullscreen="$vuetify.breakpoint.mobile"
        >
          <v-form>
            <v-card>
              <v-card-title class="accent--text text-capitalize">
                {{ formTitle }}
              </v-card-title>

              <!-- add bonus claim modal -->

              <v-card-text>
                <v-autocomplete
                  v-model="newBonus.company"
                  :items="companies"
                  item-text="name"
                  item-value="id"
                  :label="$t('company')"
                  dense
                  outlined
                  no-data-text="No company found."
                  rounded
                  return-object
                ></v-autocomplete>
                <v-autocomplete
                  v-model="newBonus.package"
                  :items="companyPackages"
                  item-text="name"
                  item-value="id"
                  :label="$t('packageNameTextTranslation')"
                  dense
                  outlined
                  rounded
                  no-data-text="No package found."
                  return-object
                ></v-autocomplete>
                <v-text-field
                  v-model="newBonus.description"
                  :label="$t('bonusClaimDescriptionText')"
                  rounded
                  outlined
                  type="text"
                  dense
                ></v-text-field>
                <v-divider></v-divider>

                <v-checkbox
                  v-model="newBonus.informative"
                  :label="$t('informativeBonus')"
                  class="text-capitalize"
                  hide-details="auto"
                  :disabled="
                    newBonus.requires_email || newBonus.requires_document
                  "
                >
                  <template v-slot:label>
                    <v-tooltip bottom open-delay="500">
                      <template v-slot:activator="{ on, attrs }">
                        <span>
                          {{ $t('informativeBonus') }}
                        </span>
                        <sup v-bind="attrs" v-on="on">
                          <v-icon small> mdi-help-circle </v-icon>
                        </sup>
                      </template>
                      <span>{{ $t('informativeBonusInfo') }}</span>
                    </v-tooltip>
                  </template>
                </v-checkbox>

                <v-scroll-y-transition v-if="!newBonus.informative" group>
                  <v-checkbox
                    key="subscription_service"
                    v-model="newBonus.requires_email"
                    class="text-capitalize"
                    hide-details="auto"
                    :disabled="newBonus.requires_document"
                  >
                    <template v-slot:label>
                      <v-tooltip bottom open-delay="500">
                        <template v-slot:activator="{ on, attrs }">
                          <span>
                            {{ $t('requiresEmailForActivation') }}
                          </span>
                          <sup v-bind="attrs" v-on="on">
                            <v-icon small> mdi-help-circle </v-icon>
                          </sup>
                        </template>
                        <span>{{ $t('requiresEmailInfo') }}</span>
                      </v-tooltip>
                    </template>
                  </v-checkbox>

                  <v-scroll-y-transition
                    v-if="!newBonus.requires_email"
                    key="approval-options"
                    group
                  >
                    <v-checkbox
                      key="option-1"
                      v-model="newBonus.requires_document"
                      :label="$t('requiresDocumentForActivation')"
                      class="text-capitalize"
                    ></v-checkbox>

                    <v-autocomplete
                      key="option-2"
                      v-model="newBonus.approver"
                      :disabled="!newBonus.requires_document"
                      :items="approvers"
                      item-text="name"
                      item-value="id"
                      :label="$t('bonusRequestApprover')"
                      dense
                      outlined
                      rounded
                      :no-data-text="$t('noApproversFound')"
                      return-object
                      hide-details="auto"
                      :rules="[rules.required]"
                    ></v-autocomplete>

                    <v-checkbox
                      key="option-3"
                      v-model="newBonus.company_hr_approval_required"
                      :disabled="!newBonus.requires_document"
                      :label="$t('hrCanApprove')"
                      class="text-capitalize"
                    ></v-checkbox>

                    <v-container key="option-4">
                      <v-row align="center">
                        <v-text-field
                          v-model="newBonus.approverEmails"
                          :disabled="!newBonus.requires_document"
                          :label="$t('emailCCTo')"
                          dense
                          outlined
                          class="text-capitalize"
                          :hint="$t('commaSeparatedEmails')"
                          rounded
                        ></v-text-field>
                      </v-row>
                    </v-container>
                  </v-scroll-y-transition>
                </v-scroll-y-transition>
              </v-card-text>

              <!-- add bonus claim modal ends -->

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="accent" text @click="dismissBonusDialog">
                  {{ $t('cancelButtonText') }}
                </v-btn>
                <v-btn
                  color="accent"
                  :disabled="!isBonusFormComplete"
                  @click="saveBonus"
                >
                  {{ $t('saveButtonText') }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-form>
        </v-dialog>
      </template>

      <template #[`group.header`]="{ items, isOpen, toggle }">
        <th colspan="5">
          <v-icon @click="toggle">
            {{ isOpen ? 'mdi-minus' : 'mdi-plus' }}
          </v-icon>
          <span class="text-capitalize">
            {{ items[0].package.name }}
          </span>
        </th>
      </template>

      <template #[`item.id`]="props">
        {{ props.index + 1 }}
      </template>

      <!-- edit and delete actions  -->
      <template #[`item.actions`]="{ item }">
        <v-icon small color="green" class="mr-2" @click="editBonus(item)">
          mdi-pencil
        </v-icon>
        <v-icon small color="red" @click="launchDeleteDialog(item)">
          mdi-delete
        </v-icon>
      </template>
      <!-- edit and delete actions ends  -->
    </v-data-table>
    <v-dialog v-model="deleteDialog" max-width="500px">
      <v-card class="text-center">
        <v-card-text class="py-4">
          <v-icon color="secondary" dark size="64"> mdi-alert-outline </v-icon>
        </v-card-text>
        <v-card-text class="text-h6">
          {{ $t('deleteItemTextTranslate') }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="accent darken-1" text @click="closeDelete">
            {{ $t('cancelButtonText') }}
          </v-btn>
          <v-btn color="secondary darken-1" text @click="deleteBonus">
            {{ $t('removeButtonText') }}
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import showRecordsBy from '../mixins/showRecordsBy';

import TableTopbar from './TableTopbar.vue';
import LoadingBar from './LoadingBar.vue';

import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'SettingsBonusesTable',
  components: {
    TableTopbar,
    LoadingBar,
  },
  mixins: [showRecordsBy],
  props: {
    bonuses: {
      type: Array,
      required: true,
    },
    filterDrawer: {
      type: Boolean,
      required: true,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      dialog: false,
      deleteDialog: false,
      extraEmail: false,
      isBonusFormComplete: false,

      defaultNewBonus: {
        company: {},
        package: {},
        description: '',
        approver: null,
        approverEmails: '',
        informative: false,
        requires_email: false,
        requires_document: false,
        company_hr_approval_required: false,
      },

      newBonus: {
        company: {},
        package: {},
        description: '',
        approver: null,
        approverEmails: '',
        informative: false,
        requires_email: false,
        requires_document: false,
        company_hr_approval_required: false,
      },

      rules: {
        required: (value) => !!value || 'Required.',
      },

      editedBonusIndex: -1,
    };
  },

  computed: {
    ...mapGetters({ companies: 'allCompanies' }),
    ...mapGetters('packages', { packages: 'allPackages' }),
    ...mapGetters('approvers', { approvers: 'allApprovers' }),

    // compute headers to translate them
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
          text: this.$t('tableActionsHeaderText'),
          value: 'actions',
          sortable: false,
          class: 'accent--text text-subtitle-2 text-uppercase',
        },
      ];
    },

    formTitle() {
      return this.editedBonusIndex === -1
        ? this.$t('createBonusHeadingText')
        : this.$t('editBonusClaimHeadingText');
    },

    companyPackages() {
      // filter packages by the selected company/companies
      let packages = this.packages.filter(
        (bonusPackage) => this.newBonus.company.name === bonusPackage.company
      );
      // return packages that belong to selected companies
      return packages;
    },
  },

  watch: {
    launchBonusDialog(val) {
      val || this.dismissBonusDialog();
    },
    deleteDialog(val) {
      val || this.closeDelete();
    },

    newBonus: {
      handler: function () {
        // form validity check.
        if (
          this.newBonus.company &&
          this.newBonus.description.length > 0 &&
          this.newBonus.package
        ) {
          this.isBonusFormComplete = true;
        } else {
          this.isBonusFormComplete = false;
        }

        // reset additional fields to default when a bonus is set as informative.
        if (this.newBonus.informative) {
          this.newBonus.requires_document = false;
          this.newBonus.company_hr_approval_required = false;
          this.newBonus.approverEmails = '';
          this.newBonus.requires_email = false;
        }

        // reset all other feilds when bonus is set to require email
        if (this.newBonus.requires_email) {
          this.newBonus.requires_document = false;
          this.newBonus.company_hr_approval_required = false;
          this.newBonus.approverEmails = '';
          this.newBonus.informative = false;
        }

        // set requires email and is informative to false when bonus requires approval
        if (this.newBonus.requires_document) {
          this.newBonus.is_informative = false;
          this.newBonus.requires_email = false;
        }

        // when requires doc is set to false reset fields that need approver.
        if (!this.newBonus.requires_document) {
          this.newBonus.company_hr_approval_required = false;
          this.newBonus.approverEmails = '';
          this.newBonus.approver = null;
        }
      },
      deep: true,
      immediate: true,
    },
  },

  created() {
    this.getApprovers();
  },

  methods: {
    ...mapActions('bonuses', {
      createBonus: 'createBonus',
      updateBonus: 'updateBonus',
      removeBonus: 'delBonus',
    }),
    ...mapActions('approvers', {
      getApprovers: 'loadApprovers',
    }),

    toggleFilter() {
      this.$emit('update:filter-drawer', !this.filterDrawer);
    },

    launchBonusDialog() {
      this.dialog = true;
    },

    launchDeleteDialog(item) {
      this.deleteDialog = true;
      this.editedBonusIndex = item.id;
    },

    dismissBonusAddEditDialog() {
      // close launch view item dialog
      this.showViewMessageDialog = false;
      // reset item to delete and message title to default
      this.$nextTick(() => {
        this.message = Object.assign(this.message, {});
      });
    },

    saveBonus() {
      if (this.editedBonusIndex > -1) {
        // update selected bonus details
        this.updateBonusDetails();
      } else {
        // add new bonus
        this.addBonus();
      }

      this.dismissBonusDialog();
    },

    addBonus() {
      this.$emit('show-feedback', {
        status: 'submitting',
        message: 'submitting',
      });

      const data = {
        company: this.newBonus.company.id,
        description: this.newBonus.description,
        package: this.newBonus.package.id,
        requires_document: this.newBonus.requires_document,
        approver: this.newBonus.approver ? this.newBonus.approver.id : null,
        extra_approver_emails: this.newBonus.approverEmails,
        is_informative: this.newBonus.informative,
        requires_email: this.newBonus.requires_email,
        hr_can_approve: this.newBonus.company_hr_approval_required,
      };

      this.createBonus(data)
        .then(() => {
          this.$emit('show-feedback', {
            status: 'success',
            message: 'bonusCreatedSuccessfully',
          });
        })
        .catch(() => {
          this.$emit('show-feedback', {
            status: 'fail',
            message: 'bonusCreationFailed',
          });
        });
    },

    editBonus(item) {
      this.dialog = true;
      this.editedBonusIndex = item.id;

      const company = this.companies.find((i) => {
        return i.name == item.company;
      });

      const _package = this.packages.find((i) => {
        return i.name == item.package.name;
      });

      let approver = null;

      if (item.approver) {
        approver = this.approvers.find((i) => {
          return i.id == item.approver.id;
        });
      }

      this.newBonus = Object.assign(
        {},
        {
          company: company,
          package: _package,
          description: item.description,
          requires_document: item.requires_document,
          approverEmails: item.approver_emails,
          informative: item.informative,
          approver: approver,
          requires_email: item.requires_email,
          company_hr_approval_required: item.hr_can_approve,
        }
      );
    },

    updateBonusDetails() {
      this.$emit('show-feedback', {
        status: 'submitting',
        message: 'submitting',
      });
      const data = {
        company: this.newBonus.company.id,
        description: this.newBonus.description,
        package: this.newBonus.package,
        requires_document: this.newBonus.requires_document,
        approver: this.newBonus.approver ? this.newBonus.approver.id : null,
        extra_approver_emails: this.newBonus.approverEmails,
        is_informative: this.newBonus.informative,
        requires_email: this.newBonus.requires_email,
      };

      let payload = { id: this.editedBonusIndex, data: data };

      this.updateBonus(payload)
        .then(() => {
          this.$emit('show-feedback', {
            status: 'success',
            message: 'Bonus edit successful.',
          });
        })
        .catch(() => {
          this.$emit('show-feedback', {
            status: 'failed',
            message: 'Bonus updating failed.',
          });
        });
    },

    deleteBonus() {
      this.closeDelete();
      this.$emit('show-feedback', {
        status: 'submitting',
        message: 'Submitting request...',
      });

      this.removeBonus(this.editedBonusIndex)
        .then(() => {
          this.$emit('show-feedback', {
            status: 'success',
            message: 'Bonus deleted.',
          });
        })
        .catch(() => {
          this.$emit('show-feedback', {
            status: 'fail',
            message: 'Bonus deletion failed.',
          });
        });
    },

    dismissBonusDialog() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedBonusIndex = -1;
        this.newBonus = Object.assign({}, this.defaultNewBonus);
      });
    },

    closeDelete() {
      this.deleteDialog = false;
      this.$nextTick(() => {
        this.editedBonusIndex = -1;
      });
    },
  },
};
</script>
