import { defineConfig } from "vitest/config";
import path from "node:path";

// Pure-logic test runner. We deliberately do NOT spin up jsdom or
// happy-dom here: every test in the suite is a function-in / value-out
// check on schemas and helpers. Component, network, and DB tests are
// out of scope until they're worth the maintenance cost.
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    globals: false,
    coverage: {
      provider: "v8",
      include: ["src/lib/**/*.ts", "src/app/(platform)/**/*.ts"],
      exclude: ["**/*.test.ts", "**/*.test.tsx", "**/page.tsx", "**/layout.tsx"],
      reporter: ["text", "html"],
    },
  },
});
