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
  // tsconfig.json sets "jsx": "preserve" because Next does its own JSX
  // transform. Vite honours that and then cannot parse what it emits,
  // which is why no .tsx file could be imported into a test — and why
  // a React-19-only hook in a client component, and a PDF template
  // that threw, both reached production with a green suite.
  oxc: {
    jsx: { runtime: "automatic", importSource: "react" },
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
