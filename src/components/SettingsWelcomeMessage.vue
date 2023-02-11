<template>
  <v-container fluid>
    <WelcomeMessageEditor
      :content.sync="message"
      :message-title.sync="messageTitle"
      :show-editor.sync="showEditor"
      :editing="itemEditIndex"
      @reset-hide-editor="resetAndHideEditor"
      @save-message="postWelcomeMessage"
      @update-message="updateMessage"
    ></WelcomeMessageEditor>

    <SettingsWelcomeMessagesTable
      :messages="messages"
      :active-message="activeMessage"
      :loading="loading"
      @delete-message="deleteMessage"
      @edit-message="editMessage"
    ></SettingsWelcomeMessagesTable>
  </v-container>
</template>

<script>
import WelcomeMessageEditor from '@/components/SettingsWelcomeMessageEditor.vue';
// eslint-disable-next-line vue/max-len
import SettingsWelcomeMessagesTable from '@/components/SettingsWelcomeMessagesTable.vue';
import { mapActions, mapGetters } from 'vuex';
export default {
  name: 'WelcomeMessageSettingsComponent',
  components: {
    WelcomeMessageEditor,
    SettingsWelcomeMessagesTable,
  },
  data() {
    return {
      // Editor message
      message: '',
      messageTitle: '',
      showEditor: false,
      itemEditIndex: -1,
    };
  },

  computed: {
    ...mapGetters('welcome_messages', {
      messages: 'allMessages',
      activeMessage: 'activeMessage',
      loading: 'loadingMessages',
    }),
  },

  created() {
    this.loadMessages();
    this.loadActiveMessage(this.$store.state.employeeData.company.id);
  },

  methods: {
    ...mapActions('welcome_messages', {
      loadMessages: 'loadMessages',
      loadActiveMessage: 'loadActiveMessage',
      createMessage: 'createMessage',
      updateMessageContent: 'updateMessage',
      removeMessage: 'delMessage',
    }),

    editMessage(item) {
      this.message = item.description;
      this.messageTitle = item.title;
      this.itemEditIndex = item.id;
      this.showEditor = true;
    },

    resetAndHideEditor() {
      this.showEditor = false;
      this.resetEditor();
    },

    resetEditor() {
      this.message = '';
      this.messageTitle = '';
      this.itemEditIndex = -1;
    },

    postWelcomeMessage(payload) {
      this.$emit('show-feedback', {
        status: 'submitting',
        message: 'submitting',
      });
      let company_id = this.$store.state.employeeData.company.id;

      const data = {
        company: company_id,
        title: payload.title,
        description: payload.message,
        published: payload.publish ? true : false,
      };

      this.createMessage(data)
        .then(() => {
          this.$emit('show-feedback', {
            status: 'success',
            message: data.published
              ? 'Message saved and published'
              : 'Message saved as draft.',
          });
          this.resetAndHideEditor();
        })
        .catch(() => {
          this.$emit('show-feedback', {
            status: 'fail',
            message: 'Something went wrong.',
          });
        });
    },

    updateMessage(payload) {
      let feedback = {
        status: 'submitting',
        message: 'Submitting request...',
      };

      this.$emit('show-feedback', feedback);

      const data = {
        id: payload.messageId,
        data: {
          title: payload.title,
          description: payload.message,
          published: payload.publish ? true : false,
        },
      };

      this.updateMessageContent(data)
        .then(() => {
          this.$emit('show-feedback', {
            status: 'success',
            message: 'Message updated!',
          });
          this.resetAndHideEditor();
        })
        .catch(() => {
          this.$emit('show-feedback', {
            status: 'fail',
            message: 'Message update failed. Try again.',
          });
        });
    },

    deleteMessage(item) {
      let feedback = {
        status: 'submitting',
        message: 'submitting',
      };

      this.$emit('show-feedback', feedback);

      this.removeMessage(item)
        .then(() => {
          this.$emit('show-feedback', {
            status: 'success',
            message: 'Message deleted!',
          });
        })
        .catch(() => {
          this.$emit('show-feedback', {
            status: 'fail',
            message: 'Message deletion failed.',
          });
        });
    },
  },
};
</script>

<style lang="scss" scoped></style>
