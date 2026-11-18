# Neuro Nook · UCL East

A student prototype that helps autistic and sensory-sensitive members of the UCL East community explore campus, plan arrivals, practise scenarios and reflect on journeys. Built with Lovable and TanStack Start.

## Local development

Use Node.js 22.12 or later and npm. Google Chrome is required for the default Playwright and screenshot configuration. Extract the handoff archive and run these commands from the project root.

```sh
npm install --no-package-lock
npm run dev
```

Open http://localhost:8080/. For an install that uses the committed lockfile, run `bun install --frozen-lockfile` instead of the npm install command.

| Task | Command |
| --- | --- |
| Type check | `npm run typecheck` |
| Unit and component tests | `npm test` |
| Browser tests | `npm run e2e` |
| Production build and local preview | `npm run build`, then `npm run preview` |
| Lint | `npm run lint` |
| Capture UI previews with the dev server running | `npm run preview:shots -- handoff` |

Browser scripts accept `PW_CHANNEL` (for example, `msedge`) and `E2E_BASE_URL` overrides. Capture output goes to `.preview/<label>/`. The game also runs at `/game/index.html`. The interactive basemap fetches tiles over the network.

See [handoff status](docs/HANDOFF.md), [verification history](docs/verification-log.md) and [project rules](AGENTS.md).

[Hosted prototype](https://ucl-east-neuro-nook.lovable.app) · [Lovable editor](https://lovable.dev/projects/77abe5b8-35a9-5ea0-b667-396c48d4c37e)
