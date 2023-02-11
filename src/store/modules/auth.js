import * as api from '../../services';

export default {
  namespaced: true,
  state: {
    packages: [],
    errors: [],
  },
  getters: {
    allPackages: (state) =>
      state.packages.map((_package) => {
        return {
          id: _package.id,
          name: _package.name,
          company: _package.company,
        };
      }),
  },
  actions: {
    async loadPackages({ commit }) {
      try {
        const data = await api.fetchPackages();
        commit('SET_PACKAGES', data);
      } catch (error) {
        commit('SET_ERRORS', error);
      }
    },
  },
  mutations: {
    SET_PACKAGES(state, data) {
      state.packages = data;
    },
    SET_ERRORS(state, error) {
      state.errors.push(error);
    },
  },
};
