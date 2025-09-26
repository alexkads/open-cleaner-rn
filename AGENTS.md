# Repository Guidelines

## Project Structure & Module Organization
- `src/` hosts the React UI: `components/`, `pages/`, `services/` for Tauri bridges, `utils/`, and `test-setup.ts`.
- Tests stay beside features (`__tests__/` or `*.test.tsx`); see `src/services/__tests__/` for patterns.
- `src-tauri/` contains Rust commands, deep cleaning logic under `commands/`, and release config in `tauri.conf.json`.
- `public/` delivers static assets; ship runtime media from `src/assets/`.
- Automation scripts live in `scripts/`; the docs portal resides in `docs-astro/`.

## Build, Test & Development Commands
- `pnpm install` (or `make install`) syncs dependencies.
- `pnpm dev` runs the web preview; `pnpm tauri dev` opens the desktop shell.
- `pnpm build` executes `test:once`, type checks, and emits the Vite bundle; `pnpm build:all` or `make build-*` create installers.
- Quality gates: `pnpm lint`, `pnpm format:check`, `pnpm type-check`, and `pnpm test:coverage`.

## Coding Style & Naming Conventions
- Prefer React functional components and hooks; avoid mutable singletons.
- Prettier enforces 2-space indentation, trailing commas, and single quotes; ESLint (`eslint.config.js`) guards `any`/unused vars.
- Name components with `PascalCase`, helpers and hooks with `camelCase` (`useCacheScan`), and shared constants with `SCREAMING_SNAKE_CASE`.
- Keep side effects inside services and export pure helpers from `utils/`.

## Testing Guidelines
- Vitest + Testing Library are required; co-locate specs with code using `*.test.ts(x)` or scoped `__tests__/` directories.
- Reuse `src/test-setup.ts` for globals and Tauri mocks (`vi.mock('@tauri-apps/api', ...)`).
- Cover new scanner or service logic and confirm via `pnpm test:coverage` before submitting.

## Deep Clean & System Data Responsibilities
- Deep-clean routines live in `src-tauri/src/commands/cache_scanners.rs`; group platform paths per function.
- Document any "System Data" deletions, double-check `can_delete`, and surface warnings in the returned `ScanResult` objects.
- Keep scan-first, clean-second behavior: expose new targets through the scan API before wiring deletion handlers.

## Commit & Pull Request Guidelines
- Follow Conventional Commits (`feat:`, `fix:`, `chore:`, etc.) with imperative, ≤72-character subjects.
- Run `pnpm lint`, `pnpm test:once`, and `pnpm type-check` prior to pushing.
- PRs should cite related issues, list validation commands, and attach evidence for UI or cleaning tweaks.
- Select the correct template via `?template=<type>.md` and note follow-up tasks or migrations.

## Security & Configuration Tips
- Copy `env.example` to `.env`; never commit machine-specific credentials.
- Run `make setup-targets` (or `rustup target add ...`) before building installers for a new platform.
- Keep artifacts out of git—publish installers via release assets or CI storage.
