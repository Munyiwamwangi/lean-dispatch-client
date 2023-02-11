import api from '../api';

export function fetchGroups() {
  return api
    .get('bms/api/admin/groups/')
    .then((res) => Promise.resolve(res.data))
    .catch((err) => Promise.reject(err));
}

export function fetchGroupEmployees(id) {
  return api
    .get(`bms/api/admin/groups/${id}/employees`)
    .then((res) => Promise.resolve(res))
    .catch((err) => Promise.reject(err));
}

export function addGroup(data) {
  return api
    .post('bms/api/admin/groups/', data)
    .then((res) => Promise.resolve(res))
    .catch((err) => Promise.reject(err));
}

export function editGroup(id, data) {
  return api
    .patch(`bms/api/admin/groups/${id}/`, data)
    .then((res) => Promise.resolve(res))
    .catch((err) => Promise.reject(err));
}

export function deleteGroup(id) {
  return api
    .delete(`bms/api/admin/groups/${id}/`)
    .then((res) => Promise.resolve(res))
    .catch((err) => Promise.reject(err));
}

// add employees to a group
export function addOrRemoveEmployeeToGroup(id, data) {
  return api
    .patch(`bms/api/admin/groups/${id}/employees/`, data)
    .then((res) => Promise.resolve(res))
    .catch((err) => Promise.reject(err));
}

// search  groups
export function searchGroups(searchTerm) {
  return api
    .get(`bms/api/admin/groups/?search=${searchTerm}`)
    .then((res) => Promise.resolve(res.data))
    .catch((err) => Promise.reject(err));
}
