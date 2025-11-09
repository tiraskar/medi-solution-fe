import Cookies from "js-cookie";

export const setCookie = ({ cookieName, value, expiresIn }) => {
  Cookies.set(cookieName, value, { expires: expiresIn });
};

export const removeCookie = ({ cookieName }) =>
  Cookies.remove(cookieName);

export const getCookie = ({ cookieName }) => Cookies.get(cookieName);
