import faker from "k6/x/faker";

export function randomAlphaNumeric(length) {
    const alpha = `${faker.strings.letterN(length)}-${faker.strings.digitN(length)}`;
    return alpha.reduce((sum, curr) => sum + curr);
}

export function toQueryParams({ params }) {
    return Object.keys(params)
        .map((key) => `${key}=${params[key]}`)
        .join("&");
}

export function uuidv4() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
            const r = (Math.random() * 16) | 0;
            const v = c === "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        },
    );
}

export function randomFloat({ min, max }) {
    return Math.random() * (max - min) + min;
}

export function randomNumber(length) {
    return Math.abs(
        Math.floor(
            Math.pow(10, length - 1) +
                Math.random() * 9 * Math.pow(10, length - 1),
        ),
    );
}

export function randomDigit() {
    return Math.floor(Math.random() * 10);
}

export function randomLetter() {
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    return alphabet[Math.floor(Math.random() * alphabet.length)];
}

export function isObjEmpty(obj) {
    return (
        obj &&
        Object.keys(obj).length === 0 &&
        Object.getPrototypeOf(obj) === Object.prototype
    );
}

export function isNumeric(str) {
    if (typeof str !== "string") return false; // we only process strings!
    return (
        !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
        !isNaN(parseFloat(str))
    ); // ...and ensure strings of whitespace fail
}

export function listProperties(obj, keys = [], output = []) {
    const props = Object.getOwnPropertyNames(obj);
    props.forEach((prop) => {
        const newKeys = [...keys, prop];
        // If the property value is an object, recursively list its properties
        if (typeof obj[prop] === "object" && obj[prop] !== null) {
            output = listProperties(obj[prop], newKeys, output);
        } else {
            // Join the keys array into a string with dot notation
            const key = newKeys.join(".");
            output.push(key);
        }
    });

    return output;
}

export function isHTMLString(str) {
    const htmlRegex = /^<!DOCTYPE html>|<html\b[^>]*>/i;
    return htmlRegex.test(str);
}

export function isObject(value) {
    return value != null && typeof value === "object" && !Array.isArray(value);
}

export function isNonEmptyArray(arr) {
    return Array.isArray(arr) && arr.length > 0;
}

export function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

// Define a comparison function that compares the name keys of two objects
export function compareByKey(key) {
    return function (a, b) {
        // Compare the values of the objects by the given key
        if (a[key] < b[key]) return -1;
        if (a[key] > b[key]) return 1;
        return 0;
    };
}

export function compareByKeys() {
    // Save the arguments object as it will be overwritten
    // Note that arguments object is an array-like object
    // Consisting of the names of the properties to sort by
    const keys = arguments;
    return function (a, b) {
        let i = 0;
        let result = 0;
        const numberOfKeys = keys.length;
        // Try getting a different result from 0 (equal)
        // As long as we have extra properties to compare
        while (result === 0 && i < numberOfKeys) {
            result = compareByKey(keys[i])(a, b);
            i++;
        }
        return result;
    };
}

// Define a function that takes an array of objects and returns a CSV string
export function arrayToCSV(array, delimiter = "|") {
    // Initialize an empty string to store the CSV data
    let csv = "";
    // Loop over the array of objects
    for (let i = 0; i < array.length; i++) {
        // Get the current object
        const obj = array[i];
        // Get the keys of the object
        const keys = Object.keys(obj);
        // Loop over the keys and append the values to the csv string, separated by commas
        for (let j = 0; j < keys.length; j++) {
            const key = keys[j];
            const value = obj[key];
            csv += value;
            // Add a delimiter after each value, except the last one
            if (j < keys.length - 1) {
                csv += delimiter;
            }
        }
        // Add a newline after each object, except the last one
        if (i < array.length - 1) {
            csv += "\n";
        }
    }
    // Return the csv string
    return csv;
}

export function valueExists(obj, value) {
    return Object.keys(obj).some((key) => obj[key] === value);
}
