import {
  fetchBonuses,
  addBonus,
  editBonus,
  deleteBonus,
} from '../../services/modules/bonus_service';

export default {
  namespaced: true,
  state: {
    bonuses: [],
    error: null,
    loading: false,
    errored: false,
  },

  getters: {
    loadingBonuses: (state) => state.loading,
    allBonuses: (state) =>
      state.bonuses.map((bonus) => {
        return {
          id: bonus.id,
          bonus_code: bonus.bonus_id,
          company: bonus.company.name,
          description: bonus.description,
          package: bonus.package,
          bonus_status: bonus.bonus_status === 'Active' ? true : false,
          informative: bonus.is_informative,
          approver: bonus.approver,
          approver_emails: bonus.extra_approver_emails,
          requires_document: bonus.requires_document,
          requires_email: bonus.requires_email,
          hr_can_approve: bonus.hr_can_approve,
        };
      }),
  },

  actions: {
    // create a bonus
    async createBonus({ dispatch, commit }, data) {
      commit('SET_LOADING_STATUS', true);
      try {
        await addBonus(data);
        // refresh bonuses
        await dispatch('loadBonuses');
      } catch (error) {
        commit('SET_ERRORED', true);
        commit('SET_ERROR', error);
      }
    },

    // fetch bonuses
    async loadBonuses({ commit }) {
      commit('SET_LOADING_STATUS', true);
      try {
        const data = await fetchBonuses();
        commit('SET_LOADING_STATUS', false);
        commit('SET_BONUSES', data);
      } catch (error) {
        commit('SET_ERRORED', true);
        commit('SET_ERRORS', error);
      } finally {
        commit('SET_LOADING_STATUS', false);
      }
    },

    // update bonus details.
    async updateBonus({ dispatch, commit }, payload) {
      commit('SET_LOADING_STATUS', true);
      try {
        await editBonus(payload.id, payload.data);
        // refresh bonuses
        await dispatch('loadBonuses');
      } catch (error) {
        commit('SET_ERRORED', true);
        commit('SET_ERROR', error);
      }
    },

    // delete bonus
    async delBonus({ dispatch, commit }, id) {
      try {
        await deleteBonus(id);
        // refresh packages
        await dispatch('loadBonuses');
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

    SET_BONUSES(state, data) {
      state.bonuses = data;
    },

    SET_ERRORED(state, status) {
      state.errored = status;
    },

    SET_ERROR(state, error) {
      state.error = error;
    },
  },
};
