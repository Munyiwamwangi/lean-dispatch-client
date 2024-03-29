import api from "../api";

export function fetchPrivateRiders() {
  return api
    .get("/api/riders/privateRiders")
    .then((res) => Promise.resolve(res.data))
    .catch((err) => Promise.reject(err));
}

export function fetchPublicRiders() {
  return api
    .get("/api/riders/publicRiders")
    .then((res) => Promise.resolve(res.data))
    .catch((err) => Promise.reject(err));
}

export function addRider(data) {
  return api
    .post("/api/riders/", data)
    .then((res) => Promise.resolve(res))
    .catch((err) => Promise.reject(err));
}

export function editRider(id, data) {
  return api
    .patch(`/api/riders/profile/${id}/`, data)
    .then((res) => Promise.resolve(res))
    .catch((err) => Promise.reject(err));
}

export function delRider(id) {
  return api
    .delete(`/api/riders/${id}/`)
    .then((res) => Promise.resolve(res))
    .catch((err) => Promise.reject(err));
}

export function reassignRider(id) {
  return api
    .delete(`/api/riders/${id}/`)
    .then((res) => Promise.resolve(res))
    .catch((err) => Promise.reject(err));
}
