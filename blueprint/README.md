# Blueprint – New project from this template

Use this blueprint to create a **new Angular project** with the same architecture, routing, services, and SSR, but with a **new project name**, **SEO metadata**, and **UI/design**.

## Quick start

1. **Create your config** (in repo root):
   ```bash
   cp blueprint/scaffold.config.example.json scaffold.config.json
   ```
   Edit `scaffold.config.json`: set `projectName`, `slug`, `seo`, and optionally `contact`, `apiUrl`.

2. **Run the scaffold** (from repo root):
   ```bash
   node scripts/scaffold.js --out ../my-new-project
   ```
   Or without `--out` to use default `../<slug>`.

3. **Install and run the new project**:
   ```bash
   cd ../my-new-project
   npm install
   npm run start
   ```

4. **Apply your design**: Replace `src/app/styles/variables.scss` (and any global/component styles) with your theme. Architecture and logic stay the same.

## Config options

| Key | Required | Description |
|-----|----------|-------------|
| `projectName` | Yes | Display name (e.g. "My Travel App") |
| `slug` | Yes | Package/project key (e.g. "my_travel_app") – used in package.json, angular.json, storage keys |
| `seo.defaultTitle` | No | Default meta title (default: projectName) |
| `seo.defaultDescription` | No | Default meta description |
| `seo.defaultImage` | No | Default OG image path |
| `seo.siteUrl` | No | Site URL for canonical/OG |
| `contact.email` | No | Contact email (e.g. info@...) |
| `contact.mapUrl` | No | Google Maps or location URL |
| `apiUrl` | No | API base URL (default: existing tourism API) |

## Full documentation

See **BLUEPRINT.md** in the repo root for:

- Full project structure and architecture
- Routing, shared components, services, state management
- Guards, interceptors, pipes, directives
- Build config, SSR, environments
- Exact list of dynamic files
- Multi-project and scaling notes
