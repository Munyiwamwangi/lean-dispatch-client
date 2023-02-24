import {
  fetchMerchants,
  addMerchant,
  editMerchant,
  deleteMerchant,
} from "../../services/modules/merchants_service";

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

    allMerchants: (state) =>
      state.packages.map((_merchant) => {
        return {
          id: _merchant.id,
          name: _merchant.name,
          company: _merchant.company,
          is_default: _merchant.is_default,
          is_single_select: _merchant.is_single_select,
        };
      }),
  },

  actions: {
    async createPackage({ dispatch, commit }, data) {
      commit("SET_LOADING_STATUS", true);
      try {
        await addMerchant(data);
        // refresh packages
        await dispatch("loadMerchants");
      } catch (error) {
        commit("SET_ERRORED", true);
        commit("SET_ERROR", error);
      }
    },
    async loadMerchants({ commit }) {
      commit("SET_LOADING_STATUS", true);
      try {
        const data = await fetchMerchants();
        commit("SET_LOADING_STATUS", false);
        commit("SET_PACKAGES", data);
      } catch (error) {
        commit("SET_ERRORED", true);
        commit("SET_ERROR", error);
      }
    },
    async updatePackage({ dispatch, commit }, payload) {
      commit("SET_LOADING_STATUS", true);
      try {
        await editMerchant(payload.id, payload.data);
        // refresh packages
        await dispatch("loadMerchants");
      } catch (error) {
        commit("SET_ERRORED", true);
        commit("SET_ERROR", error);
      }
    },

    async delPackage({ dispatch, commit }, id) {
      try {
        await deleteMerchant(id);
        // refresh packages
        await dispatch("loadMerchants");
      } catch (error) {
        commit("SET_ERRORED", true);
        commit("SET_ERROR", error);
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
