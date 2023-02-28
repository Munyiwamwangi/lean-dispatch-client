import api from "../api";

export function fetchMerchants() {
  return api
    .get("/api/users/search/")
    .then((res) => Promise.resolve(res.data))
    .catch((err) => Promise.reject(err));
}

export function addMerchant(data) {
  return api
    .post("/api/merchant/", data)
    .then((res) => Promise.resolve(res))
    .catch((err) => Promise.reject(err));
}

export function editMerchant(id, data) {
  return api
    .patch(`/api/merchant/${id}/`, data)
    .then((res) => Promise.resolve(res))
    .catch((err) => Promise.reject(err));
}

export function deleteMerchant(id) {
  return api
    .delete(`/api/merchant/${id}/`)
    .then((res) => Promise.resolve(res))
    .catch((err) => Promise.reject(err));
}
