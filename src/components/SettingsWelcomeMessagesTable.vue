<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="messages"
      :items-per-page="itemPerPage.value"
      class="elevation-1"
      :loading="loading"
      loading-text="Loading... Please wait"
      no-data-text="No results found."
    >
      <template slot="progress">
        <v-progress-linear color="secondary" indeterminate></v-progress-linear>
      </template>
      <template v-slot:[`item.id`]="props">
        {{ props.index + 1 }}
      </template>

      <template v-slot:[`item.title`]="props">
        <div class="d-flex align-center">
          <span class="text-capitalize mr-2">{{ props.item.title }}</span>
          <v-btn
            v-if="props.item.id === activeMessage"
            x-small
            color="success lighten-1"
            depressed
          >
            Live
          </v-btn>
          <v-btn
            v-else-if="props.item.published === false"
            color="accent ligthen-3"
            depressed
            x-small
          >
            Draft
          </v-btn>
        </div>
      </template>

      <template v-slot:[`item.created_at`]="props">
        {{ $date(props.item.created_at).format('DD-MM-YYYY HH:mm') }}
      </template>

      <template v-slot:[`item.last_published_at`]="props">
        {{
          props.item.last_published_at
            ? $date(props.item.last_published_at).format('DD-MM-YYYY HH:mm')
            : '-'
        }}
      </template>

      <!-- edit and delete actions  -->
      <template v-slot:[`item.actions`]="props">
        <v-btn
          small
          fab
          icon
          color="accent"
          @click="openViewMessageDialog(props.item)"
        >
          <v-icon> mdi-eye</v-icon>
        </v-btn>
        <v-btn
          icon
          small
          fab
          color="green"
          @click="openEditMessageEditor(props.item)"
        >
          <v-icon small>mdi-pencil</v-icon>
        </v-btn>

        <v-btn
          fab
          color="red"
          icon
          small
          @click="openDeleteMessageDialog(props.item)"
        >
          <v-icon small> mdi-delete </v-icon>
        </v-btn>
      </template>
      <!-- edit and delete actions ends  -->
    </v-data-table>
    <DeleteItemDialog
      :dialog="showDeleteMessageDialog"
      :item="itemToDeleteMessage"
      @close-dialog="closeDeleteMessageDialog"
      @delete-item="deleteMessage"
    ></DeleteItemDialog>
    <SettingsViewMessageDialog
      :dialog="showViewMessageDialog"
      :message="message"
      @close-dialog="closeViewMessageDialog"
    ></SettingsViewMessageDialog>
  </div>
</template>

<script>
import DeleteItemDialog from '@/components/DeleteItemDialog';
import SettingsViewMessageDialog from '@/components/SettingsViewMessageDialog.vue';

import showRecordsBy from '../mixins/showRecordsBy';

export default {
  name: 'SettingsWelcomeMessagesTable',
  components: {
    DeleteItemDialog,
    SettingsViewMessageDialog,
  },
  mixins: [showRecordsBy],
  props: {
    messages: {
      type: Array,
      required: true,
    },
    activeMessage: {
      type: Number,
      default: -1,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      headers: [
        {
          text: '#',
          align: 'start',
          sortable: false,
          value: 'id',
          class: 'accent--text text-subtitle-2 text-uppercase',
        },
        {
          text: 'Title',
          sortable: false,
          value: 'title',
          class: 'accent--text text-subtitle-2 text-uppercase',
        },
        {
          text: 'Created at',
          sortable: true,
          value: 'created_at',
          class: 'accent--text text-subtitle-2 text-uppercase',
        },
        {
          text: 'Last Published at',
          sortable: true,
          value: 'last_published_at',
          class: 'accent--text text-subtitle-2 text-uppercase',
        },
        {
          text: 'Actions',
          value: 'actions',
          sortable: false,
          class: 'accent--text text-subtitle-2 text-uppercase',
        },
      ],

      showDeleteMessageDialog: false,
      itemToDeleteId: -1,
      itemToDeleteMessage: '',

      showViewMessageDialog: false,
      message: {},
    };
  },

  methods: {
    openViewMessageDialog(message) {
      this.message = message;
      this.showViewMessageDialog = true;
    },

    closeViewMessageDialog() {
      // close launch view item dialog
      this.showViewMessageDialog = false;
      // reset item to delete and message title to default
      this.$nextTick(() => {
        this.message = Object.assign(this.message, {});
      });
    },

    openEditMessageEditor(message) {
      this.$emit('edit-message', message);
    },

    openDeleteMessageDialog(item) {
      // set item to delete id
      this.itemToDeleteId = item.id;
      this.itemToDeleteMessage = item.title;
      // launch delete item dialog
      this.showDeleteMessageDialog = true;
    },

    closeDeleteMessageDialog() {
      // close launch delete item dialog
      this.showDeleteMessageDialog = false;
      // reset item to delete and message title to default
      this.$nextTick(() => {
        this.itemToDelete = -1;
        this.itemToDeleteMessage = '';
      });
    },

    deleteMessage() {
      // emit action to delete selected message
      this.$emit('delete-message', this.itemToDeleteId);
      // close delete dialog
      this.closeDeleteMessageDialog();
    },
  },
};
</script>
