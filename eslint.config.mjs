import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
    // Este bloque fuerza todas las reglas a "warn"
  {
    name: "force-warnings",
    rules: Object.fromEntries(
      Object.entries(
        Object.assign(
          {},
          ...compat.extends("next/core-web-vitals", "next/typescript")
        ).flatMap(c => c.rules ? [c.rules] : [])
      ).map(([key]) => [key, "warn"])
    ),
  },
];

export default eslintConfig;
