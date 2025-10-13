const PRODUCTION_ENV = "production";
const STAGING_ENV = "staging";

const API_URL = import.meta.env.VITE_API_URL;

export const BASE_URL = ((env) => {
    switch (env) {
        case PRODUCTION_ENV:
            return API_URL || "";
        case STAGING_ENV:
            return API_URL || "";
        default:
            return API_URL || "http://localhost:5000";
    }
})(import.meta.env.VITE_ENV);
