<template>
  <v-container fluid>
    <v-data-table
      :headers="packageHeaders"
      :items="packages"
      :items-per-page="itemPerPage.value"
      hide-default-footer
      class="elevation-1"
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
              @click="openPackageDialog"
            >
              {{ $t('addBonusPackageText') }}
            </v-btn>
            <v-spacer></v-spacer>
          </template>
          <template #trailing>
            <v-btn icon @click.stop="toggleFilter()">
              <v-icon>mdi-filter-variant</v-icon>
            </v-btn>
          </template>
        </TableTopbar>

        <v-dialog v-model="dialog" max-width="500px">
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-card>
              <v-card-title class="accent--text text-capitalize">
                {{ formTitle }}
              </v-card-title>

              <v-card-text>
                <v-autocomplete
                  v-model="newPackage.company"
                  :items="companies"
                  :rules="[rules.required]"
                  :label="$t('company')"
                  item-text="name"
                  item-value="id"
                  dense
                  outlined
                  rounded
                ></v-autocomplete>
                <v-text-field
                  v-model="newPackage.name"
                  :label="$t('packageNameTextTranslation')"
                  :rules="[rules.required]"
                  rounded
                  outlined
                  type="text"
                  dense
                ></v-text-field>
                <v-row>
                  <v-col>
                    <v-checkbox
                      v-model="newPackage.isPackageDefault"
                      label="Default"
                      hide-details="auto"
                    >
                    </v-checkbox>
                  </v-col>
                  <v-col>
                    <v-checkbox
                      v-model="newPackage.isSingleSelect"
                      label="Single select: Only one bonus from this package can be claimed"
                    >
                      <template v-slot:label>
                        <v-tooltip bottom open-delay="500">
                          <template v-slot:activator="{ on, attrs }">
                            <span>
                              {{ $t('singleSelectPackageText') }}
                            </span>
                            <sup v-bind="attrs" v-on="on">
                              <v-icon small> mdi-help-circle </v-icon>
                            </sup>
                          </template>
                          <span>{{ $t('singleSelectPackageInfo') }}</span>
                        </v-tooltip>
                      </template>
                    </v-checkbox>
                  </v-col>
                </v-row>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn color="accent" text @click="closePackageDialogue">
                  {{ $t('cancelButtonText') }}
                </v-btn>
                <v-btn color="accent" :disabled="!valid" @click="savePackage()">
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
            {{ items[0].company }}
          </span>
        </th>
      </template>

      <template #[`item.id`]="props">
        {{ props.index + 1 }}
      </template>

      <template #[`item.actions`]="{ item }">
        <v-icon small color="green" class="mr-2" @click="editPackage(item)">
          mdi-pencil
        </v-icon>
        <v-icon small color="red" @click="launchDeleteDialog(item)">
          mdi-delete
        </v-icon>
      </template>
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
          <v-btn color="accent darken-1" text @click="dismissDelete()">
            {{ $t('cancelButtonText') }}
          </v-btn>
          <v-btn color="secondary darken-1" text @click="deletePackage">
            {{ $t('removeButtonText') }}
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex';

import showRecordsBy from '../mixins/showRecordsBy';

import TableTopbar from './TableTopbar.vue';
import LoadingBar from './LoadingBar.vue';

export default {
  components: {
    LoadingBar,
    TableTopbar,
  },
  mixins: [showRecordsBy],
  props: {
    packages: {
      type: Array,
      required: true,
    },
    companies: {
      type: Array,
      required: true,
    },

    loading: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      valid: false,
      dialog: false,
      deleteDialog: false,
      newPackage: {
        company: '',
        name: '',
        isPackageDefault: false,
        isSingleSelect: false,
      },
      defaultNewPackage: {
        company: '',
        name: '',
        isPackageDefault: false,
        isSingleSelect: false,
      },
      editedPackageIndex: -1,

      rules: {
        required: (value) => !!value || 'Required.',
      },
    };
  },
  computed: {
    // package headers translate
    packageHeaders() {
      return [
        {
          text: 'ID',
          align: 'start',
          sortable: false,
          value: 'id',
          class: 'accent--text text-subtitle-2 text-uppercase',
        },
        {
          text: this.$t('packageNameTextTranslation'),
          sortable: true,
          value: 'name',
          class: 'accent--text text-subtitle-2 text-uppercase',
        },
        {
          text: this.$t('company'),
          sortable: true,
          value: 'company',
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
      return this.editedPackageIndex === -1
        ? this.$t('createPackageHeadingText')
        : this.$t('editPackageNameHeaderText');
    },
  },

  methods: {
    ...mapActions('packages', {
      createPackage: 'createPackage',
      updatePackage: 'updatePackage',
      removePackage: 'delPackage',
    }),

    toggleFilter() {
      this.$emit('update:filter-drawer', !this.filterDrawer);
    },

    openPackageDialog() {
      this.dialog = true;
    },

    validate() {
      return this.$refs.form.validate();
    },

    resetValidation() {
      this.$refs.form.resetValidation();
    },

    closePackageDialogue() {
      this.dialog = false;
      this.resetValidation();
      this.$nextTick(() => {
        this.editedPackageIndex = -1;
        this.newPackage = Object.assign({}, this.defaultNewPackage);
      });
    },

    savePackage() {
      // validate form.
      if (!this.validate()) return;

      if (this.editedPackageIndex > -1) {
        // update selected package details
        this.updatePackageDetails();
      } else {
        // add new package.
        this.addPackage();
      }

      // dismiss dialog
      this.closePackageDialogue();
    },

    addPackage() {
      this.$emit('show-feedback', {
        status: 'submitting',
        message: 'submitting',
      });

      const data = {
        company: this.newPackage.company,
        name: this.newPackage.name,
        is_default: this.newPackage.isPackageDefault,
        is_single_select: this.newPackage.isSingleSelect,
      };

      this.createPackage(data)
        .then(() => {
          this.$emit('show-feedback', {
            status: 'success',
            message: 'Package created.',
          });
        })
        .catch(() => {
          this.$emit('show-feedback', {
            status: 'fail',
            message: 'Package creation failed.',
          });
        });
    },

    editPackage(item) {
      this.dialog = true;
      this.editedPackageIndex = item.id;

      const company = this.companies.find((i) => {
        return i.name == item.company;
      });

      this.newPackage = Object.assign(
        {},
        {
          company: company.id,
          name: item.name,
          isPackageDefault: item.is_default,
          isSingleSelect: item.is_single_select,
        }
      );
    },

    updatePackageDetails() {
      this.$emit('show-feedback', {
        status: 'submitting',
        message: 'submitting',
      });

      let data = {
        name: this.newPackage.name,
        company: this.newPackage.company,
        is_default: this.newPackage.isPackageDefault,
        is_single_select: this.newPackage.isSingleSelect,
      };

      let payload = { id: this.editedPackageIndex, data: data };

      this.updatePackage(payload)
        .then(() => {
          this.$emit('show-feedback', {
            status: 'success',
            message: 'Package updated.',
          });
        })
        .catch(() => {
          this.$emit('show-feedback', {
            status: 'fail',
            message: 'Package update fail.',
          });
        });
    },

    deletePackage() {
      this.dismissDelete();
      this.$emit('show-feedback', {
        status: 'submitting',
        message: 'submitting',
      });

      this.removePackage(this.editedPackageIndex)
        .then(() => {
          this.$emit('show-feedback', {
            status: 'success',
            message: 'Package deleted.',
          });
        })
        .catch(() => {
          this.$emit('show-feedback', {
            status: 'fail',
            message: 'Package deletion failed.',
          });
        });
    },

    launchDeleteDialog(item) {
      this.deleteDialog = true;
      this.editedPackageIndex = item.id;
    },

    dismissDelete() {
      this.deleteDialog = false;
      this.$nextTick(() => {
        this.editedPackageIndex = -1;
      });
    },
  },
};
</script>
