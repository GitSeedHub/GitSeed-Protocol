/**
 * @gitnut/config - ESLint base config
 *
 * Usage (eslint.config.js):
 * import base from "@gitnut/config/eslint/base";
 * export default [...base];
 */
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import importPlugin from "eslint-plugin-import";
import promise from "eslint-plugin-promise";
import unicorn from "eslint-plugin-unicorn";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    plugins: {
      import: importPlugin,
      promise,
      unicorn,
    },
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: process.cwd(),
      },
    },
    settings: {
      "import/parsers": {
        "@typescript-eslint/parser": [".ts", ".tsx"],
      },
      "import/resolver": {
        typescript: true,
        node: true,
      },
    },
    rules: {
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "import/no-unresolved": "off",
      "import/order": [
        "warn",
        {
          "newlines-between": "always",
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
            "type",
          ],
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": "error",
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        { prefer: "type-imports", fixStyle: "separate-type-imports" },
      ],
      "promise/catch-or-return": "warn",
      "unicorn/prefer-node-protocol": "error",
      "unicorn/no-null": "off",
      "unicorn/prevent-abbreviations": "off",
      "unicorn/filename-case": "off",
    },
  },
];
