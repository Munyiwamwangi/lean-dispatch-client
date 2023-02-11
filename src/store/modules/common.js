import { fetchCompanies } from '../../services/modules/common';

export default {
  namespaced: true,
  state: {
    companies: [],
    error: null,
    loading: false,
    errored: false,
  },

  getters: {
    loadingCompanies: (state) => state.loading,

    allCompanies: (state) =>
      state.companies.map((_company) => {
        return {
          id: _company.id,
          name: _company.name,
          email: _company.email,
          code: _company.code,
        };
      }),
  },

  actions: {
    async loadCompanies({ commit }) {
      commit('SET_LOADING_STATUS', true);
      try {
        const data = await fetchCompanies();
        commit('SET_COMPANIES', data);
        commit('SET_LOADING_STATUS', false);
      } catch (error) {
        commit('SET_ERRORED', true);
        commit('SET_ERROR', error);
        commit('SET_LOADING_STATUS', false);
      }
    },
  },
  mutations: {
    SET_LOADING_STATUS(state, status) {
      state.loading = status;
    },

    SET_COMPANIES(state, data) {
      state.companies = data;
    },

    SET_ERRORED(state, status) {
      state.errored = status;
    },

    SET_ERROR(state, error) {
      state.error = error;
    },
  },
};
