import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
   baseDirectory: __dirname,
});

// Carga las configuraciones base
const baseConfigs = compat.extends('next/core-web-vitals', 'next/typescript');

// 🔧 Convierte todas las reglas “error” → “warn”
const configsWithWarnings = baseConfigs.map(cfg => {
   if (!cfg.rules) return cfg;
   const newRules = {};
   for (const [rule, value] of Object.entries(cfg.rules)) {
      if (value === 'error') newRules[rule] = 'warn';
      else if (Array.isArray(value) && value[0] === 'error') {
         newRules[rule] = ['warn', ...value.slice(1)];
      } else {
         newRules[rule] = value;
      }
   }
   return { ...cfg, rules: newRules };
});

const eslintConfig = [...configsWithWarnings];

export default eslintConfig;
