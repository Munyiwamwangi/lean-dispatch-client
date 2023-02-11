import api from '../api';

export function fetchBonuses() {
  return api
    .get('bms/api/bonuses/')
    .then((result) => Promise.resolve(result.data))
    .catch((err) => Promise.reject(err));
}

export function addBonus(data) {
  return api
    .post('bms/api/bonus/', data)
    .then((res) => Promise.resolve(res))
    .catch((err) => Promise.reject(err));
}

export function editBonus(id, data) {
  return api
    .put(`bms/api/bonus/${id}/`, data)
    .then((res) => Promise.resolve(res))
    .catch((err) => Promise.reject(err));
}

export function deleteBonus(id) {
  return api
    .delete(`bms/api/bonus/${id}/`)
    .then((res) => Promise.resolve(res))
    .catch((err) => Promise.reject(err));
}
