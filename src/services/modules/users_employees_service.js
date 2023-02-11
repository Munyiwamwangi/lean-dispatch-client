import api from '../api';

export function fetchPaginatedEmployees(payload) {
  return api
    .get(`bms/api/admin/employees/${payload.query}`)
    .then((res) => Promise.resolve(res.data))
    .catch((err) => Promise.reject(err));
}

export function fetchPaginatedUsers(payload) {
  return api
    .get(`bms/api/admin/users/${payload.query}`)
    .then((res) => Promise.resolve(res.data))
    .catch((err) => Promise.reject(err));
}

export function activateOrDeactivateUsers(data) {
  return api
    .post(`bms/api/admin/users-toggle/`, data)
    .then((res) => Promise.resolve(res.data))
    .catch((err) => Promise.reject(err));
}

export function deleteUser(data) {
  return api
    .post(`bms/api/admin/users-delete/`, data)
    .then((res) => Promise.resolve(res.data))
    .catch((err) => Promise.reject(err));
}

export function editEmployee(id, data) {
  return api
    .patch(`bms/api/admin/employees/${id}/`, data)
    .then((res) => Promise.resolve(res.data))
    .catch((err) => Promise.reject(err));
}

export function deleteEmployee(data) {
  return api
    .post(`bms/api/admin/employees-delete/`, data)
    .then((res) => Promise.resolve(res.data))
    .catch((err) => Promise.reject(err));
}

export function fetchEmployeeTypes() {
  return api
    .get(`/bms/api/admin/employee-type/`)
    .then((res) => Promise.resolve(res.data))
    .catch((err) => Promise.reject(err));
}

export function fetchCompaniesAndDepartments() {
  return api
    .get(`/bms/api/admin/companies-with-depts/`)
    .then((res) => Promise.resolve(res.data))
    .catch((err) => Promise.reject(err));
}
// export function deleteNeverLoggedInUsers() {
//   return api
//     .patch(`bms/api/admin/users/`)
//     .then((res) => Promise.resolve(res.data))
//     .catch((err) => Promise.reject(err));
// }
