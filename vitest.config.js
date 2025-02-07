// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    setupFiles: ['./setupTests.ts'],
    browser: {
        enabled: true,
        provider: "playwright",
        headless: true,


        instances: [
         {
            browser: "webkit"
         },
         {
            browser: "firefox"
         },
         {
            browser: "chromium"
         }   
        ]
    },
  },
})
