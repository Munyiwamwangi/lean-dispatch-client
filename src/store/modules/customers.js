import {
  addCustomer,
  deleteCustomer,
  fetchCustomers,
  patchCustomer,
} from "../../services/modules/customers_service";

export default {
  namespaced: true,

  state: {
    customers: [],
    errors: null,
    loading: false,
    errored: false,
  },

  getters: {
    loadingCustomers: (state) => state.loading,

    allCustomers: (state) =>
      state.customers.map((_customer) => {
        return {
          id: _customer.id,
          email: _customer.email,
          fullName: _customer.fullName,
          phonenumber: _customer.phonenumber,
          adresses: _customer.adresses,
          createdAt:_customer.createdAt,
          createdByMerchantId: _customer.createdByMerchantId,
        };
      }),
  },

  actions: {
    async createCustomer({ dispatch, commit }, data) {
      commit("SET_LOADING_STATUS", true);
      try {
        await addCustomer(data);
        // refresh customers
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
        commit("SET_CUSTOMERS", data.results);
        commit("SET_LOADING_STATUS", false);
      } catch (error) {
        commit("SET_LOADING_STATUS", false);
        commit("SET_ERRORED", true);
        commit("SET_ERROR", error);
      }
    },
    async updateCustomer({ dispatch, commit }, payload) {
      commit("SET_LOADING_STATUS", true);
      try {
        await patchCustomer(payload.id, payload.data);
        // refresh customers
        await dispatch("loadCustomers");
      } catch (error) {
        commit("SET_ERRORED", true);
        commit("SET_ERROR", error);
      }
    },

    async delCustomer({ dispatch, commit }, id) {
      try {
        await deleteCustomer(id);
        // refresh customers
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

    SET_CUSTOMERS(state, data) {
      state.customers = data;
    },

    SET_ERRORED(state, status) {
      state.errored = status;
    },

    SET_ERROR(state, error) {
      state.error = error;
    },
  },
};
