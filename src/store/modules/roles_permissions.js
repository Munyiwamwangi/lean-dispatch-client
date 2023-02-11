import {
  fetchRoles,
  addRole,
  editRole,
  deleteRole,
  fetchRoleDetails,
} from '../../services/modules/roles_permissions_service';

export default {
  namespaced: true,
  state: {
    roles: [],
    objectPermissions: [],
    errors: null,
    loading: false,
    errored: false,
  },

  getters: {
    loadingRoles: (state) => state.loading,

    allRoles: (state) =>
      state.roles.map((_role) => {
        return {
          id: _role.id,
          roleName: _role.company.code.toLowerCase() + '_' + _role.title,
          groupName: _role.groups.map((_role) => _role.title),
        };
      }),

    roleDetail: (state) =>
      state.objectPermissions.map((_roleDetail) => {
        return {
          id: _roleDetail.id,
          object: _roleDetail.name,
          create: _roleDetail.create,
          read: _roleDetail.read,
          update: _roleDetail.edit,
          delete: _roleDetail.delete,
        };
      }),
  },

  actions: {
    async createRole({ dispatch, commit }, data) {
      commit('SET_LOADING_STATUS', true);
      try {
        await addRole(data);
        // refresh Roles
        await dispatch('loadRoles');
      } catch (error) {
        commit('SET_ERRORED', true);
        commit('SET_ERROR', error);
      }
    },
    async loadRoles({ commit }) {
      commit('SET_LOADING_STATUS', true);
      try {
        const data = await fetchRoles();
        commit('SET_LOADING_STATUS', false);
        commit('SET_ROLES', data);
      } catch (error) {
        commit('SET_ERRORED', true);
        commit('SET_ERROR', error);
        commit('SET_LOADING_STATUS', true);
      }
    },
    async updateRole({ dispatch, commit }, payload) {
      commit('SET_LOADING_STATUS', true);
      try {
        await editRole(payload.id, payload.data);
        // refresh Roles
        await dispatch('loadRoles');
        commit('SET_LOADING_STATUS', false);
      } catch (error) {
        commit('SET_ERRORED', true);
        commit('SET_ERROR', error);
        commit('SET_LOADING_STATUS', false);
      }
    },

    async delRole({ dispatch, commit }, id) {
      try {
        await deleteRole(id);
        // refresh Roles
        await dispatch('loadRoles');
      } catch (error) {
        commit('SET_ERRORED', true);
        commit('SET_ERROR', error);
      }
    },

    async loadObjectPermissions({ commit }, id) {
      commit('SET_LOADING_STATUS', true);
      try {
        const data = await fetchRoleDetails(id);
        commit('SET_LOADING_STATUS', false);
        commit('SET_ROLE_DETAILS', data.data.permissions);
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

    SET_ROLES(state, data) {
      state.roles = data;
    },

    SET_ROLE_DETAILS(state, data) {
      state.objectPermissions = data;
    },

    SET_ERRORED(state, status) {
      state.errored = status;
    },

    SET_ERROR(state, error) {
      state.error = error;
    },
  },
};
