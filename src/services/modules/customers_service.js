import api from "../api";

export function addCustomer(data) {
  return api
    .post("/api/customers/", data)
    .then((res) => Promise.resolve(res))
    .catch((err) => Promise.reject(err));
}

export function fetchCustomers() {
  return api
    .get("/api/customers/")
    .then((res) => Promise.resolve(res.data))
    .catch((err) => Promise.reject(err));
}

export function fetchOneCustomer(id, data) {
  return api
    .get(`/api/customers/${id}/`, data)
    .then((res) => Promise.resolve(res))
    .catch((err) => Promise.reject(err));
}

export function patchCustomer(id, data) {
  return api
    .patch(`/api/customers/${id}/`, data)
    .then((res) => Promise.resolve(res))
    .catch((err) => Promise.reject(err));
}

export function addCustomerAdress(id, data) {
  return api
    .post(`/api/customers/adress/${id}/`, data)
    .then((res) => Promise.resolve(res))
    .catch((err) => Promise.reject(err));
}

export function fetchCustomerAdress(id, data) {
  return api
    .get(`/api/customers/adress/${id}/`, data)
    .then((res) => Promise.resolve(res))
    .catch((err) => Promise.reject(err));
}

export function patchCustomerAdress(id, data) {
  return api
    .patch(`/api/customers/adress/${id}/`, data)
    .then((res) => Promise.resolve(res))
    .catch((err) => Promise.reject(err));
}

export function deleteCustomer(id) {
  return api
    .delete(`/api/Customer/${id}/`)
    .then((res) => Promise.resolve(res))
    .catch((err) => Promise.reject(err));
}
