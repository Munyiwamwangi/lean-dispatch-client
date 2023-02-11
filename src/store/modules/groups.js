import {
  fetchGroups,
  addGroup,
  editGroup,
  deleteGroup,
  fetchGroupEmployees,
  addOrRemoveEmployeeToGroup,
} from '../../services/modules/group_service';

export default {
  namespaced: true,
  state: {
    groups: [],
    groupEmployees: [],
    groupNonMembers: [],
    error: null,
    loading: false,
    errored: false,
  },

  getters: {
    loadingGroups: (state) => state.loading,

    allGroups: (state) =>
      state.groups.map((_group) => {
        return {
          id: _group.id,
          name: _group.company.code.toLowerCase() + '_' + _group.title,
          employeeCount: _group.employee_count,
        };
      }),

    clickedGroupEmployees: (state) =>
      state.groupEmployees.map((_employee) => {
        return {
          id: _employee.id,
          role: _employee.role,
          username: _employee.first_name + ' ' + _employee.last_name,
          email: _employee.company_email,
        };
      }),

    allGroupNonMembers: (state) =>
      state.groupNonMembers.map((_employee) => {
        return {
          id: _employee.id,
          employeeName: _employee.first_name + ' ' + _employee.last_name,
          email: _employee.company_email,
        };
      }),
  },

  actions: {
    async createGroup({ dispatch, commit }, data) {
      commit('SET_LOADING_STATUS', true);
      try {
        // either this
        await addGroup(data);

        // or this: create group first then add roles

        // await addGroup(data).then((response) => {
        // wait group creation, save with roles
        //   editGroup(response.data.id, data);
        // });
        // refresh groups
        await dispatch('loadGroups');
      } catch (error) {
        commit('SET_ERRORED', true);
        commit('SET_ERROR', error);
        commit('SET_LOADING_STATUS', false);
      }
    },

    async loadGroups({ commit }) {
      commit('SET_LOADING_STATUS', true);
      try {
        const data = await fetchGroups();
        commit('SET_GROUPS', data.groups);
        commit('SET_LOADING_STATUS', false);
      } catch (error) {
        commit('SET_ERRORED', true);
        commit('SET_ERROR', error);
        commit('SET_LOADING_STATUS', false);
      }
    },

    async loadGroupEmployees({ commit }, id) {
      commit('SET_LOADING_STATUS', true);
      try {
        const data = await fetchGroupEmployees(id);
        commit('SET_GROUP_EMPLOYEES', data.data.employees);
        commit('SET_GROUP_NON_MEMBERS', data.data.nonMembers);

        commit('SET_LOADING_STATUS', false);
      } catch (error) {
        commit('SET_ERRORED', true);
        commit('SET_ERROR', error);
        commit('SET_LOADING_STATUS', false);
      }
    },

    async updateGroup({ dispatch, commit }, payload) {
      commit('SET_LOADING_STATUS', true);
      try {
        await editGroup(payload.id, payload.data);
        // refresh groups
        await dispatch('loadGroups');
      } catch (error) {
        commit('SET_ERRORED', true);
        commit('SET_ERROR', error);
        commit('SET_LOADING_STATUS', false);
      }
    },

    // add employees into a group
    async removeOrAddEmploeesIntoGroup({ dispatch, commit }, payload) {
      commit('SET_LOADING_STATUS', true);
      try {
        await addOrRemoveEmployeeToGroup(payload.id, payload.data);
        // refresh groups
        await dispatch('loadGroups');
      } catch (error) {
        commit('SET_ERRORED', true);
        commit('SET_ERROR', error);
        commit('SET_LOADING_STATUS', false);
      }
    },

    async delGroup({ dispatch, commit }, id) {
      try {
        await deleteGroup(id);
        // refresh groups
        await dispatch('loadGroups');
      } catch (error) {
        commit('SET_ERRORED', true);
        commit('SET_ERROR', error);
        commit('SET_LOADING_STATUS', false);
      }
    },
  },

  mutations: {
    SET_LOADING_STATUS(state, status) {
      state.loading = status;
    },

    SET_GROUPS(state, data) {
      state.groups = data;
    },

    SET_GROUP_EMPLOYEES(state, data) {
      state.groupEmployees = data;
    },

    // group non members from the same company
    SET_GROUP_NON_MEMBERS(state, data) {
      state.groupNonMembers = data;
    },

    SET_ERRORED(state, status) {
      state.errored = status;
    },

    SET_ERROR(state, error) {
      state.error = error;
    },
  },
};
