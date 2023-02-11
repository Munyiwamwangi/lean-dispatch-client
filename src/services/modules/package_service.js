import api from '../api';

export function fetchPackages() {
  return api
    .get('bms/api/packages/')
    .then((res) => Promise.resolve(res.data))
    .catch((err) => Promise.reject(err));
}

export function addPackage(data) {
  return api
    .post('bms/api/package/', data)
    .then((res) => Promise.resolve(res))
    .catch((err) => Promise.reject(err));
}

export function editPackage(id, data) {
  return api
    .patch(`bms/api/package/${id}/`, data)
    .then((res) => Promise.resolve(res))
    .catch((err) => Promise.reject(err));
}

export function deletePackage(id) {
  return api
    .delete(`bms/api/package/${id}/`)
    .then((res) => Promise.resolve(res))
    .catch((err) => Promise.reject(err));
}
