# Repository Guidelines

## Project Structure & Module Organization
- `src/` hosts the React UI: `components/`, `pages/`, `services/` (Tauri adapters), `utils/`, and `test-setup.ts` for Vitest globals.
- `src-tauri/` contains the Rust commands, configuration, and release metadata (check `src-tauri/src/commands/`).
- `public/` stores static assets; app media lives in `src/assets/`.
- `scripts/` centralizes automation such as `validate-pr.sh` and `update-version.cjs`; `docs-astro/` powers the documentation site.
- Build artifacts land in `dist/`; keep them out of git.

## Build, Test & Development Commands
- `pnpm install` installs JavaScript dependencies; run after cloning or pulling lockfile updates.
- `pnpm dev` launches the Vite web preview; `pnpm tauri dev` opens the desktop shell for full-stack work.
- `pnpm build` runs tests, TypeScript emit checks, and the production Vite build; `pnpm build:all` bundles cross-platform installers.
- Quality gates: `pnpm lint`, `pnpm format:check`, and `pnpm type-check`.
- Test suite: `pnpm test` (watch), `pnpm test:once` (CI parity), `pnpm test:coverage`, and `pnpm test:ui` for the Vitest dashboard.
- Make shortcuts (e.g., `make dev`, `make build`, `make release`) wrap the pnpm/Tauri workflows.

## Coding Style & Naming Conventions
- TypeScript + React functional components; prefer hooks over mutable globals.
- Adhere to ESLint (`eslint.config.js`) and Prettier defaults (2-space indent, trailing commas, single quotes via formatter).
- Use `PascalCase` for components/pages, `camelCase` for helpers and hooks (prefixed with `use`), and `SCREAMING_SNAKE_CASE` for shared constants.
- Keep services pure; colocate styles with the component or `App.css`.

## Testing Guidelines
- Vitest with Testing Library; place specs beside implementation (`__tests__/` folders or `*.test.ts`).
- Reuse shared mocks and globals from `src/test-setup.ts`.
- Cover new logic paths before submitting; confirm metrics with `pnpm test:coverage`.
- Mock Tauri invocations with `vi.mock` as demonstrated in existing service tests.

## Commit & Pull Request Guidelines
- Follow Conventional Commits (`feat:`, `fix:`, `docs:`); keep subjects imperative and under ~72 characters.
- Before opening a PR, run `pnpm lint`, `pnpm test:once`, and `pnpm type-check`.
- PRs should include context, linked issues, and screenshots for UI tweaks.
- Select the correct template via `?template=<type>.md` and list validation commands so reviewers can reproduce.

## Security & Configuration Tips
- Copy `env.example` to `.env`; never commit secrets or machine-specific paths.
- Tauri builds depend on Rust toolchains—use `make setup-targets` when enabling cross-compilation.
- Keep installers out of git; ship them as release assets.
- For system-data deep cleans enable Deep Scan Mode and document new paths.
