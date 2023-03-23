import {
  fetchPrivateRiders,
  editRider,
  addRider,
  delRider,
} from "../../services/modules/riders_service";

import { addPrivRider } from "../../services/modules/merchants_service";

export default {
  namespaced: true,

  state: {
    riders: [],
    errors: null,
    loading: false,
    errored: false,
  },

  getters: {
    ridersLoader: (state) => state.loading,

    privateRiders: (state) =>
      state.riders.map((_rider) => {
        return {
          id: _rider.id,
          riderId: _rider.riderId,
          riderType: _rider.riderType,
          employmentType: _rider.employmentType,
          lincenseExpiry: _rider.lincenseExpiry,
          dateOfBirth: _rider.dateOfBirth,
          startDate: _rider.startDate,
          endDate: _rider.endDate,
          createdAt: _rider.createdAt,
          updatedAt: _rider.updatedAt,
          deletedAt: _rider.deletedAt,
          completedOrders: _rider.completedOrders
            ? _rider.completedOrders
            : "-",
          totalEarnings: _rider.totalEarnings ? _rider.totalEarnings : "-",
          rating: _rider.rating * 1,
          city: _rider.city ? _rider.city : "-",

          // personalInfo: {
          firstName: _rider.user.firstName,
          lastName: _rider.user.lastName,
          fullName: _rider.user.firstName + " " + _rider.user.lastName,
          userType: _rider.user.userType,
          accountState: _rider.user.accountState,
          phonenumber: _rider.user.phonenumber,
          email: _rider.user.email,
          emailVerified: _rider.user.emailVerified,
          acceptTerms: _rider.user.acceptTerms,
          joinedOn: _rider.user.createdAt,
          // createdAt: _rider.createdAt,
          // updatedAt: _rider.updatedAt,
          // deletedAt: _rider.deletedAt,
          // },
        };
      }),
  },

  actions: {
    async createRider({ dispatch, commit }, data) {
      commit("SET_LOADING_STATUS", true);
      try {
        await addRider(data);
        // refresh Merchants
        await dispatch("loadPrivateRiders");
      } catch (error) {
        commit("SET_ERRORED", true);
        commit("SET_ERROR", error);
      }
    },

    async addPrivateRider({ dispatch, commit }, data) {
      commit("SET_LOADING_STATUS", true);
      try {
        await addPrivRider(data);
        // refresh Merchants
        await dispatch("loadPrivateRiders");
      } catch (error) {
        commit("SET_ERRORED", true);
        commit("SET_ERROR", error);
      }
    },

    async loadPrivateRiders({ commit }) {
      commit("SET_LOADING_STATUS", true);
      try {
        const data = await fetchPrivateRiders();
        commit("SET_LOADING_STATUS", false);
        // console.log("data.results --> ", data.results);
        commit("SET_RIDERS", data.results);
      } catch (error) {
        commit("SET_ERRORED", true);
        commit("SET_ERROR", error);
      }
    },
    async updateRider({ dispatch, commit }, payload) {
      commit("SET_LOADING_STATUS", true);
      try {
        await editRider(payload.riderId, payload.data);
        // refresh Merchants
        await dispatch("loadMerchants");
      } catch (error) {
        commit("SET_ERRORED", true);
        commit("SET_ERROR", error);
      }
    },

    async deleteRider({ dispatch, commit }, id) {
      try {
        await delRider(id);
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

    SET_RIDERS(state, data) {
      state.riders = data;
    },

    SET_ERRORED(state, status) {
      state.errored = status;
    },

    SET_ERROR(state, error) {
      state.error = error;
    },
  },
};
