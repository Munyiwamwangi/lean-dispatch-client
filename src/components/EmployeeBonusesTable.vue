<template>
  <v-data-table
    :headers="headers"
    :items="employeeBonuses"
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
      <v-toolbar flat>
        <v-btn small color="primary" elevation="2" @click="assignBonus()">
          {{ $t('assignBonusButtonText') }}
          <v-icon right dark>mdi-plus</v-icon>
        </v-btn>

        <v-spacer></v-spacer>
        <p class="mb-0 px-2 text-caption text-capitalize">
          {{ $t('recordsTranslate') }}:
        </p>

        <v-responsive max-width="85">
          <v-select
            v-model="itemPerPage"
            item-text="text"
            item-value="value"
            :items="itemsPerPage"
            dense
            outlined
            hide-details
            solo
            flat
            return-object
          ></v-select>
        </v-responsive>
        <v-btn icon @click.stop="filterDrawer = !filterDrawer">
          <v-icon>mdi-filter-variant</v-icon>
        </v-btn>
      </v-toolbar>
      <v-dialog
        v-model="assignBonusDialog"
        persistent
        max-width="640"
        close-delay="2000"
        :fullscreen="$vuetify.breakpoint.mobile"
      >
        <v-card>
          <v-card-title>
            <span class="text-h6 accent--text">Assign Bonus</span>
          </v-card-title>

          <v-card-text>
            <v-row>
              <v-col>
                <p class="text-subtitle-2 mb-0 text-capitalize">
                  {{ $t('nameText') }}:
                  {{ employee.first_name + ' ' + employee.last_name }}
                </p>
              </v-col>
              <v-col>
                <p class="text-subtitle-2 mb-0 text-capitalize">
                  {{ $t('personalIdCodeText') }}:
                  {{ employee.personal_id }}
                </p>
              </v-col>
            </v-row>
          </v-card-text>

          <v-card-text>
            <p class="text-subtitle-2 mb-2 text-capitalize">
              {{ $t('company') }}
            </p>
            <v-autocomplete
              v-model="bonusAssigned.companies"
              :items="companies"
              item-text="name"
              item-value="id"
              :label="$t('company')"
              outlined
              rounded
              multiple
              small-chips
              deletable-chips
              cache-items
              hide-selected
              :no-data-text="$t('noCompanyFound')"
              return-object
              class="text-capitalize"
              dense
            >
            </v-autocomplete>

            <v-row no-gutters>
              <v-col>
                <p class="text-subtitle-2 mb-2 text-capitalize">
                  {{ $t('bonusPackages') }}
                </p>
                <v-autocomplete
                  v-model="packageToAssign"
                  :items="filteredPackages"
                  item-text="name"
                  item-value="id"
                  :label="$t('bonusPackageText')"
                  :no-data-text="$t('noPackagesFound')"
                  :messages="$t('selectCompanyToPopulateTheFieldText')"
                  outlined
                  rounded
                  return-object
                  class="text-capitalize"
                  dense
                >
                </v-autocomplete>
              </v-col>
            </v-row>

            <v-row no-gutters>
              <v-col>
                <p class="text-subtitle-2 mb-2 text-capitalize">
                  {{ $t('bonusClaimTranslate') }}
                </p>
                <v-autocomplete
                  v-model="bonusAssigned.bonuses"
                  :items="filteredBonuses"
                  item-text="description"
                  item-value="id"
                  :label="$t('bonusClaimText')"
                  :messages="$t('selectPackageToPopulateTheFieldText')"
                  outlined
                  rounded
                  multiple
                  return-object
                  :no-data-text="$t('noBonusesAreFoundOnSelectedPackage')"
                  class="text-capitalize"
                  dense
                >
                  <template v-slot:prepend-item>
                    <v-list-item
                      ripple
                      @mousedown.prevent
                      @click="toggleSelectAllBonuses"
                    >
                      <v-list-item-action>
                        <v-icon
                          :color="
                            bonusAssigned.bonuses.length > 0
                              ? 'indigo darken-4'
                              : ''
                          "
                        >
                          {{ icon }}
                        </v-icon>
                      </v-list-item-action>
                      <v-list-item-content>
                        <v-list-item-title class="text-capitalize">
                          {{ $t('selectAllButtonText') }}
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-divider class="mt-2"></v-divider>
                  </template>
                  <template v-slot:selection="{ item, index }">
                    <v-chip v-if="index < 2" small>
                      <span>{{ item.description }}</span>
                    </v-chip>
                    <span v-if="index === 2" class="grey--text text-caption">
                      (+{{ bonusAssigned.bonuses.length - 2 }} others)
                    </span>
                  </template>
                  <template v-slot:default="{ active, item, attrs, on }">
                    <v-list-item v-bind="attrs" v-on="on">
                      <v-list-item-action>
                        <v-checkbox :input-value="active"></v-checkbox>
                      </v-list-item-action>
                      <v-list-item-content>
                        <v-list-item-title>
                          <v-row no-gutters align="center">
                            <span>{{ item.description }}</span>
                            <v-spacer></v-spacer>
                          </v-row>
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </template>
                </v-autocomplete>
              </v-col>
            </v-row>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="accent" text rounded @click="closeBonusAssignDialog">
              {{ $t('cancelButtonText') }}
            </v-btn>
            <v-btn color="accent" rounded @click="postEmployeeBonus">
              {{ $t('submitButtonText') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialogDelete" max-width="500px">
        <v-card class="text-center">
          <v-card-text class="py-4">
            <v-icon color="secondary" dark size="64">
              mdi-alert-outline
            </v-icon>
          </v-card-text>
          <v-card-text class="text-h6">
            {{ $t('deleteEmployeeBonusTextTranslate') }}
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="accent darken-1" text @click="closeDelete">
              {{ $t('cancelButtonText') }}
            </v-btn>
            <v-btn color="secondary darken-1" text @click="deleteItemConfirm">
              {{ $t('okButtonText') }}
            </v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>

    <template v-slot:[`item.approved_at`]="props">
      {{ $date(props.item.approved_at).format('DD-MM-YYYY HH:mm') }}
    </template>

    <template v-slot:[`group.header`]="{ items, isOpen, toggle }">
      <th colspan="7">
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

    <template v-slot:[`item.status`]="props">
      <v-edit-dialog
        :return-value="props.item.status"
        large
        persistent
        :save-text="$t('updateTextTranslate')"
        return
        @save="updateBonusStatus(props.item)"
      >
        <template v-slot:default>
          <v-btn v-if="props.item.status" small color="warning" elevation="0">
            {{ $t('claimedButtontext') }}
          </v-btn>
          <v-btn v-else small color="secondary" elevation="0">
            {{ $t('activeButtonText') }}
          </v-btn>
        </template>
        <template v-slot:input>
          <div class="mt-4 text-h6">
            {{ $t('updateBonusStatusText') }}
          </div>
          <v-select
            v-model="props.item.status"
            :items="statuses"
            item-text="name"
            item-value="value"
            :label="$t('bonusStatusTranslation')"
            dense
            outlined
            rounded
            hide-details
            autofocus
            class="mt-2"
          >
          </v-select>
        </template>
      </v-edit-dialog>
    </template>
    <template v-slot:[`item.actions`]="{ item }">
      <v-icon small color="red" @click="deleteItem(item)"> mdi-delete </v-icon>
    </template>
  </v-data-table>
</template>

<script>
import { showRecordsBy } from '../mixins/showRecordsBy';

export default {
  name: 'EmployeeBonusesTable',
  mixins: [showRecordsBy],
  props: {
    employeeBonuses: {
      type: Array,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    dialogDelete: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    // compute headers to translate them
    headers() {
      // bonuses table related data.
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
          value: 'approved_at',
          class: 'accent--text text-subtitle-2 text-uppercase',
        },
        {
          text: this.$t('bonusStatusTranslation'),
          sortable: false,
          value: 'status',
          class: 'accent--text text-subtitle-2 text-uppercase',
        },
        {
          text: this.$t('tableActionsHeaderText'),
          sortable: false,
          value: 'actions',
          class: 'accent--text text-subtitle-2 text-uppercase',
        },
      ];
    },
  },
};
</script>

<style lang="scss" scoped></style>
