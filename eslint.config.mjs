import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  // scripts/ 下是本机手动跑的一次性 Node 脚本（CJS，用 require 和 __dirname），
  // 不参与 next build、也不进浏览器包。这里 require() 是正确写法，不是遗留代码，
  // 所以关掉这条规则而不是把脚本改成 ESM。
  {
    files: ["scripts/**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
    },
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
]);

export default eslintConfig;
