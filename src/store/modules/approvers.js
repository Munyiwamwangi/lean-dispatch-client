import { fetchApprovers } from '../../services/modules/common';

export default {
  namespaced: true,
  state: {
    approvers: [],
    error: null,
  },

  getters: {
    allApprovers: (state) =>
      state.approvers.map((employee) => {
        return {
          id: employee.id,
          email: employee.company_email,
          name: employee.first_name + ' ' + employee.last_name,
        };
      }),
  },

  actions: {
    async loadApprovers({ commit }) {
      try {
        const data = await fetchApprovers();
        commit('SET_APPROVERS', data);
      } catch (error) {
        commit('SET_ERROR', error);
      }
    },
  },

  mutations: {
    SET_APPROVERS(state, data) {
      state.approvers = data;
    },

    SET_ERROR(state, error) {
      state.error = error;
    },
  },
};
