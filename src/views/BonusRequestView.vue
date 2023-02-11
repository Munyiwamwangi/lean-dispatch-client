<template>
  <div>
    <v-toolbar color="#f8f8f8" flat dense>
      <v-btn text icon @click="$router.replace({ name: 'bonus-requests' })">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-toolbar-title class="secondary--text text-subtitle-2 text-capitalize">
        {{ $t('bonusRequest') }}
      </v-toolbar-title>
    </v-toolbar>
    <v-container fluid>
      <v-data-table
        :headers="headers"
        :items="bonus_requests"
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
          <v-toolbar flat>
            <v-toolbar-title
              class="accent--text text-subtitle-1 text-capitalize"
            >
              {{ $t('bonusApprovalReviewHistory') }}
            </v-toolbar-title>
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
                return-object
              ></v-select>
            </v-responsive>
          </v-toolbar>
        </template>
        <template slot="progress">
          <v-progress-linear
            color="secondary"
            indeterminate
          ></v-progress-linear>
        </template>

        <template v-slot:[`item.id`]="props">
          {{ props.index + 1 }}
        </template>

        <template v-slot:[`item.created_at`]="props">
          {{ $date(props.item.created_at).format('DD-MM-YYYY HH:mm') }}
        </template>

        <template v-slot:[`item.comment`]="props">
          {{ props.item.comment === null ? '-' : props.item.comment }}
        </template>

        <template v-slot:[`item.files`]="props">
          <FilesDownload :item="props.item"></FilesDownload>
        </template>

        <template v-slot:[`item.status`]="props">
          <v-btn
            v-if="props.item.comment === null && props.item.active"
            x-small
            color="warning lighten-1"
            depressed
          >
            Awaiting Review
          </v-btn>
          <v-btn
            v-else-if="
              props.item.comment === null && props.item.active === false
            "
            x-small
            color="success lighten-3"
            depressed
          >
            Resolved
          </v-btn>
          <v-btn
            v-else-if="props.item.comment && props.item.active === false"
            color="error ligthen-3"
            depressed
            x-small
          >
            Declined
          </v-btn>
          <v-btn v-else color="accent ligthen-3" depressed x-small>
            Unknown
          </v-btn>
        </template>
      </v-data-table>
    </v-container>
  </div>
</template>

<script>
import FilesDownload from '../components/FilesDownload.vue';
import { mapState } from 'vuex';

export default {
  name: 'BonusRequestView',
  components: {
    FilesDownload,
  },
  data() {
    return {
      loading: false,
      bonus_requests: [],

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
    };
  },

  computed: {
    headers() {
      //  Table headers.
      return [
        {
          text: 'ID',
          align: 'start',
          sortable: false,
          value: 'id',
          class: 'accent--text text-subtitle-2 text-uppercase',
          width: '10%',
        },
        {
          text: this.$t('comment'),
          sortable: false,
          value: 'comment',
          class: 'accent--text text-subtitle-2 text-uppercase',
          width: '40%',
        },
        {
          text: this.$t('files'),
          sortable: false,
          value: 'files',
          class: 'accent--text text-subtitle-2 text-uppercase',
          align: 'center',
          width: '10%',
        },
        {
          text: this.$t('requestDate'),
          value: 'created_at',
          class: 'accent--text text-subtitle-2 text-uppercase',
          width: '15%',
        },
        {
          text: this.$t('status'),
          sortable: false,
          value: 'status',
          class: 'accent--text text-subtitle-2 text-uppercase',
          width: '10%',
        },
      ];
    },

    ...mapState('bonus_request', {
      employee_bonus: (state) => state.current_request,
    }),
  },

  created() {
    this.fetchBonusRequests();
  },

  methods: {
    requestStatus(request) {
      if (request.comment === null && request.active) {
        return 'awaiting review';
      } else if (request.comment && request.active === false) {
        return 'resolved';
      } else {
        return 'unknown';
      }
    },
    fetchBonusRequests() {
      const id = this.employee_bonus.id;

      this.loading = true;
      this.$http
        .get(`bms/api/bonus/${id}/approval/request/`)
        .then((result) => {
          if (result.status == 200) {
            this.bonus_requests = result.data.map((bonus_request) => {
              return {
                id: bonus_request.id,
                emp_bonus: bonus_request.employee_bonus,
                comment: bonus_request.comment,
                created_at: bonus_request.created_at,
                files: bonus_request.links,
                active: bonus_request.active,
              };
            });
          }
        })
        .catch((err) => {
          throw err;
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped></style>
