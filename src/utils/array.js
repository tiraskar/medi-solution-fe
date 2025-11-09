import { split } from "lodash";

export const splitTheString = ({ value, separtor }) => split(value, separtor);

export function parseUntilNotString(value) {
    try {
        while (typeof value === "string") {
            value = JSON.parse(value);
        }
    } catch (e) {
        console.log('error', e);
        // stop parsing if invalid JSON
    }
    return value;
}