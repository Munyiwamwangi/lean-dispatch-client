import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import router from "../router";
import axios from "axios";
import SecureLS from "secure-ls";
import common from "./modules/common";
import bonus_request from "./modules/bonus_request.js";
import packages from "./modules/packages";
import bonuses from "./modules/bonuses";
import logs from "./modules/logs";
import approvers from "./modules/approvers";
import welcome_messages from "./modules/welcome_messages";
import { fetchCompanies } from "../services/modules/common";
import groups from "./modules/groups";
import users_employees from "./modules/users_employees.js";
import roles_permissions from "./modules/roles_permissions";
// instanstiate secure local storage
var ls = new SecureLS({ isCompression: false });

Vue.use(Vuex);

const state = {
  users: null,
  isAuthenticated: false,
  currentUser: null,
  employeeData: null,
  employeeBonuses: null,
  language: null,
  companies: [],
  companiesLoadError: null,
  notificationMessagesArray: [],

  // for deedback utility
  feedbackSnackShowing: false,
  feedbackSnackColor: "",
  feedbackSnackText: "",
};

const defaultState = {
  users: null,
  isAuthenticated: false,
  currentUser: null,
  employeeData: null,
  employeeBonuses: null,
  language: null,
  companies: [],
  companiesLoadError: null,
  error: false,
  notificationMessagesArray: [],

  feedbackSnackShowing: false,
  feedbackSnackColor: "",
  feedbackSnackText: "",
};

const mutations = {
  clearError: (state) => {
    state.feedbackSnackShowing = false;
    state.feedbackSnackColor = "";
    state.feedbackSnackText = "";
  },

  setError: (state, value) => {
    state.feedbackSnackShowing = true;
    state.feedbackSnackColor = value.color;
    state.feedbackSnackText = value.text;
  },

  doLogin: (state, value) => {
    state.isAuthenticated = value.isAuthenticated;
    state.currentUser = value.currentUser;
    state.employeeData = value.employeeData;
  },

  ggleLogin: (state, value) => {
    state.isAuthenticated = value.isAuthenticated;
    state.currentUser = value.currentUser;
  },

  doLogout: (state) => {
    state.currentUser = {};
    state.users = [];
    state.isAuthenticated = false;
    axios.defaults.headers.common["Authorization"] = null;
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("user");
    window.localStorage.removeItem("employee");
  },

  setEmployeeBonuses: (state, value) => {
    state.employeeBonuses = value;
  },

  clearState(state) {
    Object.assign(state, defaultState);
  },

  SET_COMPANIES_DATA(state, data) {
    state.companies = data;
  },

  SET_COMPANIES_LOADING_ERROR(state, err) {
    state.companiesLoadError = err;
  },

  notificationsReceiver: (state, value) => {
    state.notificationMessagesArray = value;
  },
};

const actions = {
  clearState({ commit }) {
    commit("clearState");
  },

  notificationsReceiver({ commit }, val) {
    commit("notificationsReceiver", val);
  },

  notificationMessages({ commit }) {
    commit("notificationMessages");
  },

  clearError({ commit }) {
    commit("clearError");
  },

  setError({ commit, dispatch }, payload) {
    commit("setError", payload);
    setTimeout(() => {
      dispatch("clearError");
    }, 4000);
  },

  login({ commit, dispatch }, user) {
    let payload = {};
    // using this._vm to access the current vue instance inside the store.
    return this._vm.$http
      .post("/api/auth/signin", user)
      .then((response) => {
        console.log("login API response ----> ", response);
        const { token, user, employee } = response.data;

        payload = {
          isAuthenticated: true,
          currentUser: user,
          employeeData: employee,
        };
        //should be offloaded to a util func
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("employee", JSON.stringify(employee));

        let empLoggedIn = JSON.parse(localStorage.getItem("employee"));
        if (empLoggedIn) {
          if (
            empLoggedIn.role === "company_hr" ||
            empLoggedIn.role === "group_hr"
          ) {
            // go to hr dashboard
            router.push({ name: "hr-dashboard" });
          } else if (empLoggedIn.role === "approver") {
            router.push({ name: "bonus-requests" });
          } else {
            // go to employee dashboard
            router.push({ name: "home" });
          }
        } else router.push({ name: "login" });

        commit("doLogin", payload);
        dispatch("setError", {
          text: "successfully logged in",
          color: "success lighten-1",
        });

        return Promise.all([dispatch("fetchEmployeeBonuses")]);
      })
      .catch(() => {
        return Promise.reject("invalid credentials");
      });
  },

  // fetch currentUsers bonuses
  fetchEmployeeBonuses({ commit, state }) {
    this.loading = true;

    this._vm.$http
      .get(`bms/api/employees/${state.employeeData.id}/bonuses/`)
      .then((res) => {
        commit(
          "setEmployeeBonuses",
          res.data.map((item) => {
            return {
              id: item.id,
              bonus_id: item.bonus.id,
              bonus_code: item.bonus.bonus_id,
              activated: item.activated,
              company: item.bonus.company.name,
              description: item.bonus.description,
              package: item.bonus.package,
              bonus_status: item.bonus.active,
              pending_approval: item.pending_approval,
              bonus_approver: item.bonus_approver,
              comment: item.comment,
              discontinued: item.discontinued,
              requires_document_upload: item.bonus.requires_document,
              requires_email: item.bonus.requires_email,
              disabled: item.disabled,
              approved_at: item.approved_at,
              date_assigned: item.created_at,
            };
          })
        );
      })
      .catch(() => {})
      .finally(() => (this.loading = false));
  },

  async oAuthLogin() {},
  // enter email to request password reset link

  // forgotPassword: (email) => {
  //   axios.post("mmauth/api/password-email/", email).then(response => {
  //     console.log(response)
  //   }).catch(error => console.log(error))
  // },

  // click link in email, then enter and confirm password

  // resetPassword: (passData) => {
  //   axios.post("mmauth/api/change-password/:token", passData).then(response => {
  //     const { token } = response.data.token;
  //     console.log(response)
  //     axios.defaults.headers.common['Authorization'] = "Token" + " " + token;
  //     router.push({ name: 'login' });
  //   }).catch(error => console.log(error))

  // },

  googleLogin: ({ commit }, token) => {
    const config = {
      headers: {
        googleToken: `${token.token}`,
      },
    };

    //call verify token endpoint
    this._vm.$http
      .post("/verifyToken", null, config)
      .post((res) => {
        const { token, employee } = res.data;

        const payload = {
          isAuthenticated: true,
          currentUser: employee,
        };

        //should be offloaded to a util func
        axios.defaults.headers.common["Authorization"] = "Token" + " " + token;
        localStorage.setItem("token", JSON.stringify(token));

        commit("doLogin", payload);
        router.push({ name: "home" });
      })
      .catch((err) => {
        throw err;
      });
  },

  logout: ({ commit }) => {
    commit("doLogout");
    commit("clearState");
    // localStorage.clear();
    commit("logout");
    router.push({ name: "login" });
    window.location.href = "/login";
    window.location.reload();
    return "done";
  },

  async loadCompanies({ commit }) {
    try {
      const data = await fetchCompanies();
      commit("SET_COMPANIES_DATA", data);
    } catch (error) {
      commit("SET_COMPANIES_LOADING_ERROR", error);
    }
  },
};

const getters = {
  getError(state) {
    return {
      feedbackSnackShowing: state.feedbackSnackShowing,
      feedbackSnackText: state.feedbackSnackText,
      feedbackSnackColor: state.feedbackSnackColor,
    };
  },

  // TODO: Do some mapping if necessary
  allCompanies: (state) => state.companies,

  getNofiticationMessages(state) {
    return state.notificationMessagesArray;
  },
};

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
  modules: {
    common,
    bonus_request,
    packages,
    bonuses,
    approvers,
    welcome_messages,
    groups,
    users_employees,
    roles_permissions,
    logs,
  },
  plugins: [
    createPersistedState({
      storage: {
        getItem: (key) => ls.get(key),
        setItem: (key, value) => ls.set(key, value),
        removeItem: (key) => ls.remove(key),
      },

      reducer(_state) {
        if (_state.isAuthenticated) return _state;
        return {};
      },
    }),
  ],
});
