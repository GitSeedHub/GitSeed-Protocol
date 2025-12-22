/**
 * @gitnut/config - ESLint React config
 *
 * Usage:
 * import base from "@gitnut/config/eslint/base";
 * import react from "@gitnut/config/eslint/react";
 * export default [...base, ...react];
 */
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";

export default [
  {
    plugins: { react: reactPlugin, "react-hooks": reactHooks, "jsx-a11y": jsxA11y },
    settings: {
      react: { version: "detect" },
    },
    rules: {
      "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "jsx-a11y/alt-text": "warn",
    },
  },
];
