import axios from "axios";
import { parseApiError } from "../helper/error";
import { BASE_URL } from "../constant/common";

// ---------- Interceptors ----------
axios.interceptors.request.use(
  async (config) => config,
  (error) => Promise.reject(error)
);

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    if (response && response.status === 401) {
      localStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ---------- GET ----------
const getApi = async ({ url, params }) => {
  
  const fullUrl = `${BASE_URL}/${url}`;
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  return axios
    .get(fullUrl, {
      headers,
      params,
      withCredentials: true,
    })
    .then((res) => res.data)
    .catch((err) => {
      throw Error(parseApiError(err));
    });
};

// ---------- POST ----------
const postApi = async ({ url, body, contentType = "application/json" }) => {
  const fullUrl = `${BASE_URL}/${url}`;
  const headers = {
    Accept: "application/json",
    "Content-Type": contentType,
  };

  return axios
    .post(fullUrl, body, { headers, withCredentials: true })
    .then((res) => res.data)
    .catch((err) => {
      throw Error(parseApiError(err));
    });
};

// ---------- POST FILE ----------
const postFileApi = async ({ url, body }) => {
  const fullUrl = `${BASE_URL}/${url}`;
  const headers = {
    Accept: "application/json",
    "Content-Type": "multipart/form-data",
  };

  return axios
    .post(fullUrl, body, { headers, withCredentials: true })
    .then((res) => res.data)
    .catch((err) => {
      throw Error(parseApiError(err));
    });
};

// ---------- PUT ----------
const putApi = async ({ url, body, contentType = "application/json" }) => {
  const fullUrl = `${BASE_URL}/${url}`;
  const headers = {
    Accept: "application/json",
    "Content-Type": contentType,
  };

  return axios
    .put(fullUrl, body, { headers, withCredentials: true })
    .then((res) => res.data)
    .catch((err) => {
      throw Error(parseApiError(err));
    });
};

// ---------- PUT FILE ----------
const putFileApi = async ({ url, body }) => {
  const fullUrl = `${BASE_URL}/${url}`;
  const headers = {
    Accept: "application/json",
    "Content-Type": "multipart/form-data",
  };

  return axios
    .put(fullUrl, body, { headers, withCredentials: true })
    .then((res) => res.data)
    .catch((err) => {
      throw Error(parseApiError(err));
    });
};

// ---------- DELETE ----------
const deleteApi = async ({ url }) => {
  const fullUrl = `${BASE_URL}/${url}`;
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  return axios
    .delete(fullUrl, { headers, withCredentials: true })
    .then((res) => res.data)
    .catch((err) => {
      throw Error(parseApiError(err));
    });
};

export { getApi, postApi, putApi, deleteApi, postFileApi, putFileApi };
