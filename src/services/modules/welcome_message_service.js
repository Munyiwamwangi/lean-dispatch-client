import api from '../api';

export function fetchWelcomeMessages() {
  return api
    .get('bms/api/companies/welcome/text')
    .then((res) => Promise.resolve(res.data))
    .catch((err) => Promise.reject(err));
}
export function fetchActiveWelcomeMessage(id) {
  return api
    .get(`bms/api/companies/${id}/active/welcome/message`)
    .then((res) => Promise.resolve(res.data))
    .catch((err) => Promise.reject(err));
}

export function addMessage(data) {
  return api
    .post('bms/api/companies/welcome/text', data)
    .then((res) => Promise.resolve(res))
    .catch((err) => Promise.reject(err));
}

export function editMessage(id, data) {
  return api
    .patch(`bms/api/companies/welcome/text/${id}/`, data)
    .then((res) => Promise.resolve(res))
    .catch((err) => Promise.reject(err));
}

export function deleteMessage(id) {
  return api
    .delete(`bms/api/companies/welcome/text/${id}/`)
    .then((res) => Promise.resolve(res))
    .catch((err) => Promise.reject(err));
}
