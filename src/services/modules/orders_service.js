import api from "../api";

export function fetchOrders() {
  return api
    .get("/api/delivery/search/")
    .then((res) => Promise.resolve(res.data))
    .catch((err) => Promise.reject(err));
}

export function fetchOneOrder(id) {
  return api
    .patch(`/api/delivery/${id}/`)
    .then((res) => Promise.resolve(res))
    .catch((err) => Promise.reject(err));
}

export function addOrder(data) {
  return api
    .post("/api/Order/", data)
    .then((res) => Promise.resolve(res))
    .catch((err) => Promise.reject(err));
}

export function editOrder(id, data) {
  return api
    .patch(`/api/delivery/changeStatus/${id}/`, data)
    .then((res) => Promise.resolve(res))
    .catch((err) => Promise.reject(err));
}

export function deleteOrder(id) {
  return api
    .delete(`/api/Order/${id}/`)
    .then((res) => Promise.resolve(res))
    .catch((err) => Promise.reject(err));
}
