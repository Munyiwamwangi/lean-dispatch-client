import {
  activateOrDeactivateUsers,
  // deleteNeverLoggedInUsers,
  editEmployee,
  fetchPaginatedEmployees,
  fetchPaginatedUsers,
  // fetchAllUsers,
  deleteUser,
  deleteEmployee,
  fetchEmployeeTypes,
  fetchCompaniesAndDepartments,
} from '../../services/modules/users_employees_service';

export default {
  namespaced: true,
  state: {
    loading: false,
    error: null,
    errored: false,
    employees: [],
    users: [],
    employeeTypes: [],
    companiesAndDepts: [],
  },

  getters: {
    loadingEmployees: (state) => state.loading,
    loadingUsers: (state) => state.loading,

    allEmployees: (state) =>
      state.employees.map((_employee) => {
        return {
          id: _employee.id,
          userId: _employee.user,
          employeeName: _employee.first_name + ' ' + _employee.last_name,
          email: _employee.company_email,
          company: _employee.company,
          department: _employee.department ? _employee.department : '--',
          personalIdCode: _employee.personal_id,
          hireDate: _employee.join_date,
          employeeType: _employee.employee_type,
          otherDepartments: _employee.otherDepartment.map((_dept) => {
            return {
              id: _dept.id,
              title: _dept.title,
            };
          }),
        };
      }),

    companiesDepartments: (state) =>
      state.companiesAndDepts.map((_comp) => {
        return {
          id: _comp.id,
          name: _comp.name,
          departments: _comp.department.map((_dept) => {
            return {
              id: _dept.id,
              title: _dept.title,
            };
          }),
        };
      }),

    allUsers: (state) =>
      state.users.flatMap((_user) => {
        return {
          id: _user.id,
          userName: _user.first_name + ' ' + _user.last_name,
          groups: _user.groups.flatMap((_groupTitle) => _groupTitle.title),
          role: _user.roles.flatMap((_role) => _role.title),
          email: _user.company_email || '--',
          lastActivityDate: _user.updated_at || 'unavailable',
          status: _user.is_active,
          userId: _user.user_id,
        };
      }),

    allEmployeeTypes: (state) =>
      state.employeeTypes.map((_empType) => {
        return {
          id: _empType.id,
          name: _empType.name,
          code: _empType.code,
        };
      }),
  },

  actions: {
    async loadEmployees({ commit }, payload) {
      commit('SET_LOADING_STATUS', true);
      try {
        const data = await fetchPaginatedEmployees(payload);
        commit('SET_ALL_EMPLOYEES', data.results);
        commit('SET_LOADING_STATUS', false);
      } catch (error) {
        commit('SET_ERRORED', true);
        commit('SET_ERROR', error);
        commit('SET_LOADING_STATUS', false);
      }
    },

    async loadEmployeeTypes({ commit }) {
      commit('SET_LOADING_STATUS', true);
      try {
        const data = await fetchEmployeeTypes();
        commit('SET_EMPLOYEE_TYPES', data);
        commit('SET_LOADING_STATUS', false);
      } catch (error) {
        commit('SET_ERRORED', true);
        commit('SET_ERROR', error);
        commit('SET_LOADING_STATUS', false);
      }
    },

    async loadCompaniesAndDepartments({ commit }) {
      commit('SET_LOADING_STATUS', true);
      try {
        const data = await fetchCompaniesAndDepartments();
        commit('SET_COMPANIES_AND_DEPTS', data);
        commit('SET_LOADING_STATUS', false);
      } catch (error) {
        commit('SET_ERRORED', true);
        commit('SET_ERROR', error);
        commit('SET_LOADING_STATUS', false);
      }
    },

    async loadUsers({ commit }, payload) {
      commit('SET_LOADING_STATUS', true);
      try {
        const data = await fetchPaginatedUsers(payload);
        commit('SET_ALL_USERS', data.results);
        commit('SET_LOADING_STATUS', false);
      } catch (error) {
        commit('SET_ERRORED', true);
        commit('SET_ERROR', error);
        commit('SET_LOADING_STATUS', false);
      }
    },

    async activateOrDeactivateUsr({ dispatch, commit }, data) {
      commit('SET_LOADING_STATUS', true);
      try {
        await activateOrDeactivateUsers(data);
        // refresh users
        await dispatch('loadUsers');
      } catch (error) {
        commit('SET_ERRORED', true);
        commit('SET_ERROR', error);
        commit('SET_LOADING_STATUS', false);
      }
    },

    async delUser({ dispatch, commit }, data) {
      commit('SET_LOADING_STATUS', true);

      try {
        await deleteUser(data);
        commit('SET_LOADING_STATUS', false);

        // refresh users
        await dispatch('loadUsers');
      } catch (error) {
        commit('SET_ERRORED', true);
        commit('SET_ERROR', error);
      }
    },

    async updateEmployee({ commit }, payload) {
      commit('SET_LOADING_STATUS', true);
      try {
        await editEmployee(payload.id, payload.data);
        // refresh packages
      } catch (error) {
        commit('SET_ERRORED', true);
        commit('SET_ERROR', error);
        commit('SET_LOADING_STATUS', false);
      }
    },

    async delEployee({ commit }, data) {
      commit('SET_LOADING_STATUS', true);
      console.log('delete store check --> ', data);

      try {
        await deleteEmployee(data);
        commit('SET_LOADING_STATUS', false);
      } catch (error) {
        commit('SET_ERRORED', true);
        commit('SET_ERROR', error);
        commit('SET_LOADING_STATUS', false);
      }
    },

    // async delNeverLoggedInUser({ dispatch, commit }, id) {
    //   try {
    //     await deleteNeverLoggedInUsers(id);
    //     // refresh users
    //     await dispatch('loadUsers');
    //   } catch (error) {
    //     commit('SET_ERRORED', true);
    //     commit('SET_ERROR', error);
    //   }
    // },
  },

  mutations: {
    SET_LOADING_STATUS(state, status) {
      state.loading = status;
    },

    SET_ALL_EMPLOYEES(state, data) {
      state.employees = data;
    },

    SET_EMPLOYEE_TYPES(state, data) {
      state.employeeTypes = data;
    },

    SET_COMPANIES_AND_DEPTS(state, data) {
      state.companiesAndDepts = data;
    },

    SET_ALL_USERS(state, data) {
      state.users = data;
    },

    SET_ERRORED(state, status) {
      state.errored = status;
    },

    SET_ERROR(state, error) {
      state.error = error;
    },
  },
};
