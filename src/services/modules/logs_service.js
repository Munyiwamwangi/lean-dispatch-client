import api from '../api';

export function fetchLoginTrail(payload) {
  return api
    .get(`/bms/api/admin/user-trail/${payload.query}`)
    .then((res) => Promise.resolve(res))
    .catch((err) => Promise.reject(err));
}

export function fetchAuditTrail(payload) {
  return api
    .get(`/bms/api/admin/audit-trail/${payload.query}`)
    .then((res) => Promise.resolve(res))
    .catch((err) => Promise.reject(err));
}

// search user trail
export function searchAuditTrail(payload) {
  return api
    .get(`/bms/api/admin/audit-trail/${payload.query}`)
    .then((res) => Promise.resolve(res))
    .catch((err) => Promise.reject(err));
}

// search login trail
export function searchLoginTrail(payload) {
  return api
    .get(`/bms/api/admin/audit-trail/${payload.query}`)
    .then((res) => Promise.resolve(res))
    .catch((err) => Promise.reject(err));
}

// export function exportAuditTrail() {
//   return api
//     .get(`bms/api/admin/audit-export/`)
//     .then((res) => Promise.resolve(res))
//     .catch((err) => Promise.reject(err));
// }
