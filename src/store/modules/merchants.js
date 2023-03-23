import {
  fetchMerchants,
  addMerchant,
  editMerchant,
  deleteMerchant,
} from "../../services/modules/merchants_service";

export default {
  namespaced: true,

  state: {
    merchants: [],
    errors: null,
    loading: false,
    errored: false,
  },

  getters: {
    loadingMerchants: (state) => state.loading,

    allMerchants: (state) =>
      state.merchants.map((_merchant) => {
        return {
          id: _merchant.id,
          firstName: _merchant.firstName,
          lastName: _merchant.lastName,
          fullName: _merchant.firstName + " " + _merchant.lastName,
          userType: _merchant.userType,
          accountState: _merchant.accountState,
          phonenumber: _merchant.phonenumber,
          email: _merchant.email,
          emailVerified: _merchant.emailVerified,
          acceptTerms: _merchant.acceptTerms,
          joinedOn: _merchant.createdAt,
          deletedAt: _merchant.deletedAt,
          updatedAt: _merchant.updatedAt,
          merchant: _merchant.merchant,
          verified: _merchant.verified,
        };
      }),
  },

  actions: {
    async createMerchant({ dispatch, commit }, data) {
      commit("SET_LOADING_STATUS", true);
      try {
        await addMerchant(data);
        // refresh Merchants
        await dispatch("loadMerchants");
      } catch (error) {
        commit("SET_ERRORED", true);
        commit("SET_ERROR", error);
      }
    },
    async loadMerchants({ commit }) {
      console.log("loading merchants");
      commit("SET_LOADING_STATUS", true);
      try {
        const data = await fetchMerchants();
        commit("SET_LOADING_STATUS", false);
        // console.log("data.results --> ", data.results);
        commit("SET_MERCHANTS", data.results);
      } catch (error) {
        commit("SET_ERRORED", true);
        commit("SET_ERROR", error);
      }
    },
    async updateMerchant({ dispatch, commit }, payload) {
      commit("SET_LOADING_STATUS", true);
      try {
        await editMerchant(payload.id, payload.data);
        // refresh Merchants
        await dispatch("loadMerchants");
      } catch (error) {
        commit("SET_ERRORED", true);
        commit("SET_ERROR", error);
      }
    },

    async delMerchant({ dispatch, commit }, id) {
      try {
        await deleteMerchant(id);
        // refresh Merchants
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

    SET_MERCHANTS(state, data) {
      state.merchants = data;
    },

    SET_ERRORED(state, status) {
      state.errored = status;
    },

    SET_ERROR(state, error) {
      state.error = error;
    },
  },
};
