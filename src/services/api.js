// global axios instance
import axios from "axios";
import store from "../store/index";

import config from "../config";

import router from "../router";

const api = axios.create({
  baseURL: config.BACKEND_SERVICE,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

function clearStorage() {
  store.dispatch("clearState");
  window.localStorage.removeItem("token");
  window.localStorage.removeItem("user");
  window.localStorage.removeItem("employee");
}

function customErros(text, color = "red lighten-1") {
  store.dispatch("setError", { color: color, text: text });
}

// axios interceptors
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.common["Authorization"] = "Bearer " + token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// TODO: use better error handlers.
api.interceptors.response.use(
  (response) => {
    // customErros("success", "success lighten-1")
    return Promise.resolve(response);
  },
  (error) => {
    if (error.response.status) {
      switch (error.response.status) {
        case 400:
          // clearStorage();
          customErros("invalid data");
          break;
        case 401:
        case 403:
          customErros(error.response.data.message, "red lighten-1");

          break;
        case 502:
          clearStorage();
          setTimeout(() => {
            router.replace({
              path: "/login",
              query: {
                redirect: router.currentRoute.fullPath,
              },
            });
          }, 1000);
          break;
        default:
          customErros(error.response.data.message);
      }
      return Promise.reject(error.response);
    }
  }
);

export default api;
