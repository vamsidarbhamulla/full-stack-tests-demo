// eslint.config.mjs
import globals from 'globals';

export default [
    {
        rules: {
            "no-unused-vars": "error",
            "no-undef": "error",
        },
        languageOptions: {
            globals: {
                ...globals.node,
                var1: "writable",
                __ENV: "readonly",
            },
        },
    },
];
