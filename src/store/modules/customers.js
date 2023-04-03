import {
  addCustomer,
  deleteCustomer,
  fetchCustomers,
  patchCustomer,
} from "../../services/modules/customers_service";

export default {
  namespaced: true,

  state: {
    merchants: [],
    errors: null,
    loading: false,
    errored: false,
  },

  getters: {
    loadingCustomers: (state) => state.loading,

    allCustomers: (state) =>
      state.merchants.map((_customer) => {
        return {
          id: _customer.id,
          firstName: _customer.firstName,
          lastName: _customer.lastName,
          fullName: _customer.firstName + " " + _customer.lastName,
          userType: _customer.userType,
          accountState: _customer.accountState,
          phonenumber: _customer.phonenumber,
          email: _customer.email,
          emailVerified: _customer.emailVerified,
          acceptTerms: _customer.acceptTerms,
          joinedOn: _customer.createdAt,
          deletedAt: _customer.deletedAt,
          updatedAt: _customer.updatedAt,
          merchant: _customer.merchant,
          verified: _customer.verified,
        };
      }),
  },

  actions: {
    async createCustomer({ dispatch, commit }, data) {
      commit("SET_LOADING_STATUS", true);
      try {
        await addCustomer(data);
        // refresh Merchants
        await dispatch("loadCustomers");
      } catch (error) {
        commit("SET_ERRORED", true);
        commit("SET_ERROR", error);
      }
    },
    async loadCustomers({ commit }, payload) {
      if (payload === undefined || payload === null) {
        payload = {
          page: 1,
          limit: 100,
          status: "pending",
        };
      }
      commit("SET_LOADING_STATUS", true);
      try {
        const data = await fetchCustomers(payload);
        commit("SET_LOADING_STATUS", false);
        commit("SET_MERCHANTS", data.results);
      } catch (error) {
        commit("SET_ERRORED", true);
        commit("SET_ERROR", error);
      }
    },
    async updateCustomer({ dispatch, commit }, payload) {
      commit("SET_LOADING_STATUS", true);
      try {
        await patchCustomer(payload.id, payload.data);
        // refresh Merchants
        await dispatch("loadCustomers");
      } catch (error) {
        commit("SET_ERRORED", true);
        commit("SET_ERROR", error);
      }
    },

    async delCustomer({ dispatch, commit }, id) {
      try {
        await deleteCustomer(id);
        // refresh Merchants
        await dispatch("loadCustomers");
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
