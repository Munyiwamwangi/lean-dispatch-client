import {
  fetchAuditTrail,
  fetchLoginTrail,
  searchAuditTrail,
  searchLoginTrail,
} from "../../services/modules/logs_service";

export default {
  namespaced: true,

  state: {
    loginTrail: [],
    auditTrail: [],
    errors: null,
    loading: false,
    errored: false,
  },

  getters: {
    loadingLoginTrail: (state) => state.loading,

    loginTrailLog: (state) =>
      state.loginTrail.map((_trail) => {
        return {
          id: _trail.id,
          userName: _trail.username,
          loginTime: _trail.login_datetime,
          logoutTime: _trail.logout_time ? _trail.logout_time : "--",
        };
      }),

    auditTrailLog: (state) =>
      state.auditTrail.map((_trail) => {
        return {
          id: _trail.id,
          dateTime: _trail.action_datetime,
          userName: _trail.username,
          eventCategory: _trail.event_category,
          changedObject: _trail.changed_object,
          summary: _trail.change_summary ? _trail.change_summary : "__",
        };
      }),
  },

  actions: {
    async loadLoginTrail({ commit }, payload) {
      commit("SET_LOADING_STATUS", true);
      try {
        const data = await fetchLoginTrail(payload);
        commit("SET_LOGIN_TRAIL", data.data.results);
        commit("SET_LOADING_STATUS", false);
      } catch (error) {
        commit("SET_ERRORED", true);
        commit("SET_ERROR", error);
      }
    },

    async searchLoginTrails({ commit }, payload) {
      commit("SET_LOADING_STATUS", true);
      try {
        const data = await searchLoginTrail(payload);
        commit("SET_LOGIN_TRAIL", data.data.results);
        commit("SET_LOADING_STATUS", false);
      } catch (error) {
        commit("SET_ERRORED", true);
        commit("SET_ERROR", error);
      }
    },

    async loadAuditTrail({ commit }, payload) {
      commit("SET_LOADING_STATUS", true);
      try {
        const data = await fetchAuditTrail(payload);
        commit("SET_AUDIT_TRAIL", data.data.results);
        commit("SET_LOADING_STATUS", false);
      } catch (error) {
        commit("SET_ERRORED", true);
        commit("SET_ERROR", error);
      }
    },

    async searchAuditTrails({ commit }, payload) {
      commit("SET_LOADING_STATUS", true);
      try {
        const data = await searchAuditTrail(payload);
        commit("SET_AUDIT_TRAIL", data.data.results);
        commit("SET_LOADING_STATUS", false);
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

    SET_LOGIN_TRAIL(state, data) {
      state.loginTrail = data;
    },

    SET_AUDIT_TRAIL(state, data) {
      state.auditTrail = data;
    },

    SET_ERRORED(state, status) {
      state.errored = status;
    },

    SET_ERROR(state, error) {
      state.error = error;
    },
  },
};
