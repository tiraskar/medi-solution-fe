import { isEmpty, isFunction } from "lodash";

export const checkIfEmpty = (val) => isEmpty(val);

export const checkIfFunction = (val) => isFunction(val);
