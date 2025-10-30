import axios from "axios";
import { parseApiError } from "../helper/error";
import { BASE_URL } from "../constant/common";

axios.interceptors.request.use(
    async (config) => {
        return config;
    },
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

const getApi = async ({ url, params }) => {
    const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
    };

    const requestParams = {
        ...params,
    };

    const fullUrl = `${BASE_URL}/${url}`;

    return axios
        .get(fullUrl, {
            headers,
            params: requestParams,
            withCredentials: true,
        })
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            const errorMessage = parseApiError(error);
            throw Error(errorMessage);
        });
};

const postApi = async ({ url, body, contentType = "application/json" }) => {
    let fullUrl = `${BASE_URL}/${url}`;

    const headers = {
        Accept: "application/json",
        "Content-Type": contentType,
    };

    return axios
        .post(fullUrl, body, { headers, withCredentials: true })
        .then((response) => response.data)
        .catch((error) => {
            throw Error(parseApiError(error));
        });
};

const deleteApi = async ({ url }) => {
    const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
    };

    const fullUrl = `${BASE_URL}/${url}`;

    return axios
        .delete(fullUrl, { headers, withCredentials: true })
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw Error(parseApiError(error));
        });
};

const putApi = async ({ url, body, contentType = "application/json" }) => {
    const fullUrl = `${BASE_URL}/${url}`;
    const headers = {
        Accept: "application/json",
        "Content-Type": contentType,
    };
    return axios
        .put(fullUrl, body, { headers, withCredentials: true })
        .then((response) => response.data)
        .catch((error) => {
            throw Error(parseApiError(error));
        });
};

const patchApi = async ({ url, body, contentType = "application/json" }) => {
    const fullUrl = `${BASE_URL}/${url}`;
    const headers = {
        Accept: "application/json",
        "Content-Type": contentType,
    };
    return axios
        .patch(fullUrl, body, { headers, withCredentials: true })
        .then((response) => response.data)
        .catch((error) => {
            throw Error(parseApiError(error));
        });
};

export { getApi, postApi, putApi, deleteApi, patchApi };
