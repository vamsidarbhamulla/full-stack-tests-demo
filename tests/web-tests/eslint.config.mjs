import typescriptEslint from "@typescript-eslint/eslint-plugin";
import prettier from "eslint-plugin-prettier";
import _import from "eslint-plugin-import";
import jsdoc from "eslint-plugin-jsdoc";
import { fixupPluginRules } from "@eslint/compat";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [{
    ignores: [
        "**/node_modules/",
        "**/test-results/",
        "**/playwright-report/",
        "**/.husky/",
        "**/*.js",
        "**/package-lock.json",
        "dist/**/*",
        "build/**/*",
    ],
}, ...compat.extends(
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "prettier",
    "plugin:playwright/playwright-test",
), {
    plugins: {
        "@typescript-eslint": typescriptEslint,
        prettier,
        import: fixupPluginRules(_import),
        jsdoc,
    },

    languageOptions: {
        parser: tsParser,
        ecmaVersion: 5,
        sourceType: "script",

        parserOptions: {
            project: "./tsconfig.json",
        },
    },

    settings: {
        "import/resolver": {
            typescript: {
                alwaysTryTypes: true,
            },
        },
    },

    rules: {
        "prettier/prettier": "error",

        "sort-imports": ["error", {
            ignoreDeclarationSort: true,
        }],

        "@typescript-eslint/no-unsafe-assignment": "off",
        "@typescript-eslint/no-unsafe-member-access": "off",
        "@typescript-eslint/no-floating-promises": "error",
        "@typescript-eslint/no-unnecessary-type-assertion": "error",
        "import/no-unresolved": "error",
        "import/named": "error",
        "import/default": "error",
        "import/no-absolute-path": "error",
        "import/no-self-import": "error",
        "require-await": "error",
        "no-trailing-spaces": "error",

        "no-multiple-empty-lines": ["error", {
            max: 1,
            maxEOF: 0,
        }],

        complexity: ["warn", {
            max: 11,
        }],

        "jsdoc/check-alignment": "warn",
        "jsdoc/check-indentation": "warn",
        "playwright/missing-playwright-await": ["error"],
        "playwright/no-focused-test": "error",
        "playwright/valid-expect": "error",
        "playwright/prefer-web-first-assertions": "error",
        "playwright/no-useless-await": "error",
        "playwright/no-page-pause": "error",
        "playwright/no-element-handle": "error",
        "playwright/no-eval": "error",
        "playwright/prefer-to-be": "error",
        "playwright/prefer-to-contain": "error",
        "playwright/prefer-to-have-length": "error",
        "playwright/no-wait-for-timeout": "warn",
        "playwright/no-useless-not": "warn",
        "playwright/require-top-level-describe": "warn",
        "playwright/expect-expect": "off",
        "playwright/no-conditional-in-test": "off",
        "playwright/no-skipped-test": "off",
    },
}, {
    files: ["**/*.ts"],

    rules: {
        "@typescript-eslint/no-explicit-any": "warn",
        "@typescript-eslint/explicit-module-boundary-types": "off",
    },
}];