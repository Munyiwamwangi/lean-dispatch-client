import api from '../api';

export function fetchRoles() {
  return api
    .get('bms/api/admin/roles/')
    .then((res) => Promise.resolve(res.data))
    .catch((err) => Promise.reject(err));
}

export function addRole(data) {
  return api
    .post('bms/api/admin/roles/', data)
    .then((res) => Promise.resolve(res))
    .catch((err) => Promise.reject(err));
}

export function editRole(id, data) {
  return api
    .patch(`bms/api/admin/roles/${id}/`, data)
    .then((res) => Promise.resolve(res))
    .catch((err) => Promise.reject(err));
}

export function deleteRole(id) {
  return api
    .delete(`bms/api/admin/roles/${id}/`)
    .then((res) => Promise.resolve(res))
    .catch((err) => Promise.reject(err));
}

export function fetchRoleDetails(id) {
  return api
    .get(`bms/api/admin/roles/${id}/`)
    .then((res) => Promise.resolve(res))
    .catch((err) => Promise.reject(err));
}

// search roles
export function searchRoles(searchTerm) {
  return api
    .get(`bms/api/admin/roles/?search=${searchTerm}`)
    .then((res) => Promise.resolve(res.data))
    .catch((err) => Promise.reject(err));
}
