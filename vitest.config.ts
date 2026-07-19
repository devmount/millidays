import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/**'],
      root: fileURLToPath(new URL('./', import.meta.url)),
      coverage: {
        provider: 'v8',
        include: ['src/**/*.{ts,vue}'],
        exclude: [...configDefaults.coverage.exclude!, 'src/main.ts', 'src/**/*.d.ts'],
        thresholds: {
          statements: 95,
          branches: 95,
          functions: 95,
          lines: 95,
        },
      },
    },
  }),
)
