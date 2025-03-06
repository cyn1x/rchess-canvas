import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";


/** @type {import('eslint').Linter.Config[]} */
export default [
    { files: ["**/*.{js,mjs,cjs,ts}"] },
    {
        languageOptions: { globals: globals.browser }, rules: {
            "consistent-return": "error",
            "indent": ["error", 4],
            "no-else-return": "warn",
            "semi": ["warn", "always"],
            "space-unary-ops": "error"
        }
    },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
];
