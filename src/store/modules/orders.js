import {
  addOrder,
  deleteOrder,
  editOrder,
  fetchOneOrder,
  fetchOrders,
} from "../../services/modules/orders_service";

export default {
  namespaced: true,

  state: {
    orders: [],
    errors: null,
    loading: false,
    errored: false,
  },

  getters: {
    ordersLoader: (state) => state.loading,

    allOrders: (state) => state.orders,
    //   .map((_order) => {
    //     return {
    //       id: _order.id,
    //       status:_order
    //       riderId: _order.riderId,
    //       riderType: _order.riderType,
    //       employmentType: _order.employmentType,
    //       lincenseExpiry: _order.lincenseExpiry,
    //       dateOfBirth: _order.dateOfBirth,
    //       startDate: _order.startDate,
    //       endDate: _order.endDate,

    //       assignedAt: _order.assignedAt,
    //       deliveryAt: _order.deliveryAt,
    //       comments: _order.comments,

    //       createdAt: _order.createdAt,
    //       updatedAt: _order.updatedAt,
    //       deletedAt: _order.deletedAt,
    //       completedOrders: _order.completedOrders
    //         ? _order.completedOrders
    //         : "-",
    //       totalEarnings: _order.totalEarnings ? _order.totalEarnings : "-",
    //       rating: _order.rating * 1,
    //       city: _order.city ? _order.city : "-",
    //     };
    //   }),
  },

  actions: {
    async createOrder({ dispatch, commit }, data) {
      commit("SET_LOADING_STATUS", true);
      try {
        await addOrder(data);
        // refresh Merchants
        await dispatch("loadPrivateRiders");
      } catch (error) {
        commit("SET_ERRORED", true);
        commit("SET_ERROR", error);
      }
    },

    async loadOrders({ commit }, payload) {
      if (payload === undefined || payload === null) {
        payload = {
          page: 1,
          limit: 100,
          status: "pending",
        };
      }
      commit("SET_LOADING_STATUS", true);
      try {
        const data = await fetchOrders(payload);
        commit("SET_LOADING_STATUS", true);
        commit("SET_ORDERS", data.results);
      } catch (error) {
        commit("SET_LOADING_STATUS", false);
        commit("SET_ERRORED", true);
        commit("SET_ERROR", error);
      }
    },

    async getOneOrder({ dispatch, commit }, id) {
      try {
        await fetchOneOrder(id);
        // refresh Merchants
        await dispatch("loadPrivateRiders");
      } catch (error) {
        commit("SET_ERRORED", true);
        commit("SET_ERROR", error);
      }
    },

    async updateOrder({ dispatch, commit }, payload) {
      commit("SET_LOADING_STATUS", true);
      try {
        await editOrder(payload.id, payload.data);
        // refresh Merchants
        await dispatch("loadOrders");
      } catch (error) {
        commit("SET_LOADING_STATUS", false);
        commit("SET_ERRORED", true);
        commit("SET_ERROR", error);
      }
    },

    async delOrder({ dispatch, commit }, id) {
      try {
        await deleteOrder(id);
        // refresh Merchants
        await dispatch("loadPrivateRiders");
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

    SET_ORDERS(state, data) {
      state.orders = data;
    },

    SET_ERRORED(state, status) {
      state.errored = status;
    },

    SET_ERROR(state, error) {
      state.error = error;
    },
  },
};
