<template>
  <div>
    <v-navigation-drawer v-model="filterDrawer" app right width="320">
      <v-form class="pa-4">
        <h6 class="text-h6 text-capitalize">
          {{ $t('logsFilter') }}
        </h6>
        <v-row no-gutters>
          <v-col>
            <p class="text-subtitle-2 text-capitalize mt-3">
              {{ $t('employeeNameTranslate') }}
            </p>
            <v-combobox
              v-model="model"
              :search-input.sync="searchTerm"
              :items="searchResults"
              :label="$t('userName')"
              item-text="userName"
              item-value="id"
              dense
              outlined
              rounded
              clearable
              item-color="grey"
              hide-details="auto"
              append-icon=""
              return-object
              open-on-clear
            >
              <template v-slot:item="data">
                <template>
                  <v-list max-width="355px">
                    <v-list-item class="pl-0">
                      <v-list-item-content>
                        <v-list-item-title
                          >{{ data.item.userName }}
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </template>
              </template>
            </v-combobox>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col>
            <p class="text-subtitle-2 text-capitalize mt-3">
              {{ $t('logDateRange') }}
            </p>
            <v-menu
              ref="dateDialog"
              v-model="dateDialog"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="filterDateRangeText"
                  :label="$t('logsDateRangeText')"
                  dense
                  readonly
                  rounded
                  outlined
                  append-icon="mdi-calendar"
                  v-bind="attrs"
                  clearable
                  open-on-clear
                  v-on="on"
                  @click:clear="filterDateRange = []"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="filterDateRange"
                prev-icon="mdi-skip-previous"
                next-icon="mdi-skip-next"
                range
                header-color="accent"
                :allowed-dates="
                  (date) => date <= new Date().toISOString().substr(0, 10)
                "
                color="secondary"
              >
                <v-spacer></v-spacer>
                <v-btn text color="accent" @click="dateDialog = false">
                  Cancel
                </v-btn>
                <v-btn
                  text
                  color="accent"
                  @click="$refs.dateDialog.save(filterDateRange)"
                >
                  OK
                </v-btn>
              </v-date-picker>
            </v-menu>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn
              class="text-capitalize"
              text
              rounded
              @click="closeFilterSidebar()"
            >
              {{ $t('cancelButtonText') }}
            </v-btn>
          </v-col>
          <v-col>
            <v-btn
              class="text-capitalize"
              color="accent"
              rounded
              @click="clear()"
            >
              {{ $t('clearButtonText') }}
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-navigation-drawer>

    <v-container fluid>
      <v-data-table
        v-model="selected"
        :headers="userTableHeaders"
        :items="trail"
        :single-select="singleSelect"
        :items-per-page="itemPerPage.value"
        hide-default-footer
        class="elevation-1"
        :loading-text="$t('dataLoadingText')"
        :no-data-text="$t('noDataTextForTables')"
        show-select
      >
        <template slot="progress">
          <LoadingBar></LoadingBar>
        </template>

        <template v-slot:top>
          <v-row no-gutters justify="end">
            <div>
              <TableTopbar
                :item-per-page.sync="itemPerPage"
                :items-per-page="itemsPerPage"
              >
                <template #leading>
                  <v-btn
                    color="primary"
                    :disabled="selected.length < 1"
                    class="float-right text-capitalize"
                    @click="exportLogs()"
                  >
                    <v-icon size="20" class="pr-1"> mdi-export-variant </v-icon>
                    {{ $t('exportText') }}
                  </v-btn>
                </template>

                <template #trailing>
                  <v-btn icon @click.stop="filterDrawer = !filterDrawer">
                    <v-icon>mdi-filter-variant</v-icon>
                  </v-btn>
                </template>
              </TableTopbar>
            </div>
          </v-row>
        </template>

        <!-- ids  -->
        <template v-slot:[`item.id`]="props">
          {{ props.index + 1 }}
        </template>

        <!-- last activity date  -->
        <template #[`item.dateTime`]="props">
          {{ $date(props.item.dateTime).format('DD-MMM-YYYY HH:mm') }}
        </template>
      </v-data-table>
    </v-container>
  </div>
</template>

<script>
import showRecordsBy from '../../mixins/showRecordsBy';
import LoadingBar from '../LoadingBar.vue';
import TableTopbar from '../TableTopbar.vue';
// import { searchAuditTrail } from '../../services/modules/logs_service';
import lodash from 'lodash';
import { mapActions } from 'vuex';

export default {
  name: 'empoyeesTableComponent',
  components: {
    LoadingBar,
    TableTopbar,
  },
  mixins: [showRecordsBy],

  props: {
    trail: {
      type: Array,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    tab: {
      type: Number,
      default: 0,
    },
  },

  data() {
    return {
      model: null,
      searchTerm: '',
      searchResults: [],
      dialog: false,
      singleSelect: false,
      selected: [],
      search: '',
      filterDrawer: false,
      dateDialog: false,
      deleteDialog: false,

      query: '?',
      offset: 0,

      // side drawer filter
      filterDateRange: [],
    };
  },

  computed: {
    filterEmployees() {
      return this.trail.map((x) => x.userName);
    },

    filterDateRangeText: {
      get() {
        return this.filterDateRange.join(' - ');
      },
      set() {
        return this.filterDateRange.join(' - ');
      },
    },

    userTableHeaders() {
      return [
        {
          text: 'ID',
          sortable: false,
          value: 'id',
          class: 'accent--text text-subtitle-2 text-uppercase',
        },
        {
          text: 'Date',
          sortable: false,
          value: 'dateTime',
          class: 'accent--text text-subtitle-2 text-uppercase',
        },
        {
          text: 'Username',
          sortable: false,
          value: 'userName',
          class: 'accent--text text-subtitle-2 text-uppercase',
        },
        {
          text: 'Event Category',
          sortable: false,
          value: 'eventCategory',
          class: 'accent--text text-subtitle-2 text-uppercase',
        },
        {
          text: 'Changed Object',
          sortable: false,
          value: 'changedObject',
          class: 'accent--text text-subtitle-2 text-uppercase',
        },
        {
          text: 'Change Summary',
          sortable: false,
          value: 'summary',
          class: 'accent--text text-subtitle-2 text-uppercase',
        },
      ];
    },
  },

  watch: {
    selected(val) {
      this.selected = val;
    },

    // search
    searchTerm() {
      this.debouncedSearch();
    },

    filterDateRange() {
      this.debouncedSearch();
    },

    itemPerPage(val) {
      this.itemPerPage = val;
      this.paginateAuditLog();
    },

    tab() {
      this.filterDrawer = false;
    },
  },

  mounted() {
    this.paginateAuditLog();
  },

  methods: {
    ...mapActions('logs', {
      searchAuditTrails: 'searchAuditTrails',
      loadAuditTrail: 'loadAuditTrail',
    }),

    // search
    debouncedSearch() {
      this.debouncedSearch = lodash.debounce(this.searchData, 500);
    },
    searchData() {
      let userEmail = this.searchTerm;
      let start = this.filterDateRange[0] ? this.filterDateRange[0] : null;
      let end = this.filterDateRange[1] ? this.filterDateRange[1] : null;

      if (userEmail && start && end) {
        this.query = `filter/?username=${userEmail}&start=${start}&end=${end}`;
      } else if (start && end) {
        if (new Date(start) > new Date(end)) {
          this.query = `filter/?start=${end}&end=${start}`;
        }
        this.query = `filter/?start=${start}&end=${end}`;
      } else if (userEmail && start) {
        this.query = `filter/?username=${userEmail}&start=${start}`;
      } else if (start) {
        this.query = `filter/?start=${start}`;
      } else if (userEmail) {
        this.query = `filter/?username=${userEmail}`;
      }

      let payload = {
        query: this.query,
      };

      // if (this.filterDateRange.length > 1 || this.searchTerm.length > 1) {
      this.searchAuditTrails(payload)
        .then(() => {})
        .catch(() => {})
        .finally(() => {
          this.query = '?';
          start = null;
          end = null;
          payload = {};
        });
      // }
    },

    // paginated logs
    paginateAuditLog() {
      let limit = this.itemPerPage.value ? this.itemPerPage.value : 25;
      let offset = this.offset;

      // dynamically creating the URL depending on provided variables
      if (limit == -1) {
        this.query += `all=True`;
      } else {
        this.query += `limit=${limit}&offset=${offset}`;
      }

      let payload = {
        query: this.query,
      };
      this.loadAuditTrail(payload)
        .then(() => {})
        .catch(() => {})
        .finally(() => {
          this.query = '?';
        });
    },

    // export logs as csv
    exportLogs() {
      let csv = `${this.userTableHeaders.map((_hder) => _hder.text)} \n`;
      if (this.selected.length !== 0) {
        this.selected.forEach((row) => {
          console.log(Array(Object.values(row)).join(','));
          // make an array of values from each object
          csv += Array(Object.values(row)).join(',');
          csv += '\n';
        });

        const anchor = document.createElement('a');
        anchor.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
        anchor.target = '_blank';
        anchor.download = `Logs as at ${new Date()}.csv`;

        // anchor.download = `${this.selected[0].userName}.csv`;
        anchor.click();
      }
    },

    closeFilterSidebar() {
      this.filterDrawer = false;
    },

    // clear filters
    clear() {
      this.searchTerm = '';
      this.filterDateRange = [];
    },

    closeGroupCreatingDialog() {
      this.dialog = false;
    },
  },
};
</script>

<style lang="scss" scoped></style>
