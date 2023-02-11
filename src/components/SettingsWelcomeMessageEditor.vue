<template>
  <div class="pb-4">
    <v-btn
      v-if="!editorShowing"
      color="primary"
      small
      @click.stop="editorShowing = true"
    >
      Add a welcome message
    </v-btn>
    <v-form ref="form" v-model="valid" lazy-validation>
      <div v-if="editorShowing">
        <v-row>
          <v-col md="6">
            <v-text-field
              v-model="title"
              dense
              outlined
              label="Message Title"
              counter
              maxlength="50"
              :rules="rules.required"
            ></v-text-field>
          </v-col>
        </v-row>

        <quill-editor
          ref="myQuillEditor"
          v-model="message"
          :options="editorOptions"
        />
        <div class="py-4">
          <v-btn
            color="primary"
            small
            elevation="0"
            :disabled="title.length === 0 || message.length === 0"
            class="mr-2"
            @click.stop="editing === -1 ? save() : update()"
          >
            {{ editing === -1 ? 'Save' : 'Update' }}
          </v-btn>
          <v-btn
            color="primary"
            small
            elevation="0"
            :disabled="title.length === 0 || message.length === 0"
            class="mr-2"
            @click.stop="editing === -1 ? save(true) : update(true)"
          >
            {{ editing === -1 ? 'Save & Publish' : 'Update & Publish' }}
          </v-btn>
          <v-btn
            color="accent"
            small
            text
            elevation="0"
            @click.stop="hideAndClearEditor"
          >
            Cancel
          </v-btn>
        </div>
      </div>
    </v-form>
  </div>
</template>

<script>
// Vue app...

import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';

import { quillEditor } from 'vue-quill-editor';

export default {
  name: 'WelcomeMessageEditor',
  components: {
    quillEditor,
  },
  props: {
    content: {
      type: String,
      required: true,
    },
    messageTitle: {
      type: String,
      required: true,
    },
    showEditor: {
      type: Boolean,
      default: false,
    },
    editing: {
      type: Number,
      default: -1,
    },
  },

  data() {
    return {
      // message editor
      valid: false,
      formErrors: [false],

      editorOptions: {
        placeholder: 'Enter new welcome message here...',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote'],
            [{ header: 1 }, { header: 2 }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ script: 'sub' }, { script: 'super' }],
            [{ indent: '-1' }, { indent: '+1' }],
            [{ direction: 'rtl' }],
            [{ size: ['small', false, 'large', 'huge'] }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ font: [] }],
            [{ color: [] }, { background: [] }],
            [{ align: [] }],
            ['clean'],
            ['link', 'image', 'video'],
          ],
        },
      },
      rules: {
        required: [(value) => !!value || this.$t('requiredText')],
      },
    };
  },
  computed: {
    editor() {
      return this.$refs.myQuillEditor.quill;
    },

    editorShowing: {
      get() {
        return this.showEditor;
      },
      set(value) {
        this.$emit('update:show-editor', value);
      },
    },

    title: {
      get() {
        return this.messageTitle;
      },
      set(value) {
        this.$emit('update:message-title', value);
      },
    },

    message: {
      get() {
        return this.content;
      },
      set(value) {
        this.$emit('update:content', value);
      },
    },
  },

  watch: {
    rules: 'validateForm',
    message: 'validateForm',
  },
  methods: {
    validateForm() {
      this.$refs.form.validate();
    },

    save(value) {
      let payload = { title: this.title, message: this.message };
      if (value) {
        payload.publish = true;
      }

      this.$emit('save-message', payload);
    },

    update(value) {
      let payload = {
        title: this.title,
        message: this.message,
        messageId: this.editing,
      };
      if (value) {
        payload.publish = true;
      }
      this.$emit('update-message', payload);
    },

    hideAndClearEditor() {
      this.$emit('reset-hide-editor');
    },
  },
};
</script>
