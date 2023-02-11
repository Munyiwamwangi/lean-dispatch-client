import api from '../../services/BonusRequestsAPI';

// initial state
const state = () => ({
  all: [],
  current_request: {},
});

// getters
const getters = {};

// actions
const actions = {
  updateCurrentRequest({ commit }, item) {
    commit('setCurrentRequest', item);
  },

  async retrieveBonusRequests({ commit }) {
    await api
      .fetchDeclinedBonusRequests()
      .then((result) => commit('setAllBonusRequests', result))
      .catch((err) => {
        throw err;
      });
  },
};

// mutations
const mutations = {
  setCurrentRequest(state, request) {
    state.current_request = request;
  },

  setAllBonusRequests(state, all_requests) {
    state.all = all_requests;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
