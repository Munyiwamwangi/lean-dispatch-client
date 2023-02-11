import api from '../api';

export function fetchCompanies() {
  return api
    .get('bms/api/companies/')
    .then((res) => Promise.resolve(res.data))
    .catch((err) => Promise.reject(err));
}

export function fetchPackages() {
  return api
    .get('bms/api/packages/')
    .then((res) => Promise.resolve(res.data))
    .catch((err) => Promise.reject(err));
}

export function fetchApprovers() {
  return api
    .get('bms/api/employees/bonus/approvers/')
    .then((res) => Promise.resolve(res.data))
    .catch((err) => Promise.reject(err));
}
// bms/api/admin/users/?search
export function searchAPI(searchTerm) {
  return api
    .get(`bms/api/search/?q=${searchTerm}`)
    .then((res) => Promise.resolve(res.data))
    .catch((err) => Promise.reject(err));
}

// search users
export function searchUsers(searchTerm) {
  return api
    .get(`bms/api/admin/users/?search=${searchTerm}`)
    .then((res) => Promise.resolve(res.data))
    .catch((err) => Promise.reject(err));
}

// search employees
export function searchEmployees(searchTerm) {
  return api
    .get(`bms/api/admin/employees/?search=${searchTerm}`)
    .then((res) => Promise.resolve(res.data))
    .catch((err) => Promise.reject(err));
}
