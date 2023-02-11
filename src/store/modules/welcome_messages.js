import {
  fetchWelcomeMessages,
  fetchActiveWelcomeMessage,
  addMessage,
  editMessage,
  deleteMessage,
} from '../../services/modules/welcome_message_service';

export default {
  namespaced: true,

  state: {
    messages: [],
    active_message: -1,
    errors: null,
    loading: false,
    errored: false,
  },

  getters: {
    loadingMessages: (state) => state.loading,

    allMessages: (state) => state.messages,

    activeMessage: (state) =>
      state.active_message.active_message
        ? state.active_message.welcome_text.id
        : -1,
  },

  actions: {
    async createMessage({ dispatch, commit }, data) {
      commit('SET_LOADING_STATUS', true);
      try {
        await addMessage(data);
        // refresh messages
        await dispatch('loadMessages');
      } catch (error) {
        commit('SET_ERRORED', true);
        commit('SET_ERROR', error);
      }
    },
    async loadMessages({ commit }) {
      commit('SET_LOADING_STATUS', true);
      try {
        const data = await fetchWelcomeMessages();
        commit('SET_LOADING_STATUS', false);
        commit('SET_MESSAGES', data);
      } catch (error) {
        commit('SET_ERRORED', true);
        commit('SET_ERROR', error);
      }
    },

    async loadActiveMessage({ commit }, id) {
      try {
        const data = await fetchActiveWelcomeMessage(id);
        commit('SET_ACTIVE_MESSAGE', data);
      } catch (error) {
        commit('SET_ERRORED', true);
        commit('SET_ERROR', error);
      }
    },
    async updateMessage({ dispatch, commit }, payload) {
      commit('SET_LOADING_STATUS', true);
      try {
        await editMessage(payload.id, payload.data);
        // refresh messages
        await dispatch('loadMessages');
      } catch (error) {
        commit('SET_ERRORED', true);
        commit('SET_ERROR', error);
      }
    },

    async delMessage({ dispatch, commit }, id) {
      try {
        await deleteMessage(id);
        // refresh messages
        await dispatch('loadMessages');
      } catch (error) {
        commit('SET_ERRORED', true);
        commit('SET_ERROR', error);
      }
    },
  },

  mutations: {
    SET_LOADING_STATUS(state, status) {
      state.loading = status;
    },

    SET_MESSAGES(state, data) {
      state.messages = data;
    },

    SET_ACTIVE_MESSAGE(state, data) {
      state.active_message = data;
    },

    SET_ERRORED(state, status) {
      state.errored = status;
    },

    SET_ERROR(state, error) {
      state.error = error;
    },
  },
};
