import {
  fetchPackages,
  addPackage,
  editPackage,
  deletePackage,
} from '../../services/modules/package_service';

export default {
  namespaced: true,

  state: {
    packages: [],
    errors: null,
    loading: false,
    errored: false,
  },

  getters: {
    loadingPackages: (state) => state.loading,

    allPackages: (state) =>
      state.packages.map((_package) => {
        return {
          id: _package.id,
          name: _package.name,
          company: _package.company,
          is_default: _package.is_default,
          is_single_select: _package.is_single_select,
        };
      }),
  },

  actions: {
    async createPackage({ dispatch, commit }, data) {
      commit('SET_LOADING_STATUS', true);
      try {
        await addPackage(data);
        // refresh packages
        await dispatch('loadPackages');
      } catch (error) {
        commit('SET_ERRORED', true);
        commit('SET_ERROR', error);
      }
    },
    async loadPackages({ commit }) {
      commit('SET_LOADING_STATUS', true);
      try {
        const data = await fetchPackages();
        commit('SET_LOADING_STATUS', false);
        commit('SET_PACKAGES', data);
      } catch (error) {
        commit('SET_ERRORED', true);
        commit('SET_ERROR', error);
      }
    },
    async updatePackage({ dispatch, commit }, payload) {
      commit('SET_LOADING_STATUS', true);
      try {
        await editPackage(payload.id, payload.data);
        // refresh packages
        await dispatch('loadPackages');
      } catch (error) {
        commit('SET_ERRORED', true);
        commit('SET_ERROR', error);
      }
    },

    async delPackage({ dispatch, commit }, id) {
      try {
        await deletePackage(id);
        // refresh packages
        await dispatch('loadPackages');
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

    SET_PACKAGES(state, data) {
      state.packages = data;
    },

    SET_ERRORED(state, status) {
      state.errored = status;
    },

    SET_ERROR(state, error) {
      state.error = error;
    },
  },
};
