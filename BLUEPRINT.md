# Angular Project Blueprint – Full Documentation

This document describes the **full project structure**, **architecture**, and **how to create a new project** from this blueprint. Only **project name**, **SEO metadata**, and **UI/design** change; architecture, business logic, routing, and tooling stay the same.

---

## 1. Project structure and architecture

### 1.1 Folder structure

```
france_web/
├── public/                          # Static assets (optional)
├── src/
│   ├── app/
│   │   ├── core/                    # Core (singleton) resources
│   │   │   ├── interfaces/          # Shared TS interfaces
│   │   │   │   ├── iblog.ts
│   │   │   │   ├── icategory.ts
│   │   │   │   ├── idestination.ts
│   │   │   │   ├── iduration.ts
│   │   │   │   ├── isettings.ts
│   │   │   │   └── itour.ts
│   │   │   └── interceptors/
│   │   │       └── http.interceptor.ts
│   │   ├── modules/                 # Feature route modules (route config only)
│   │   │   ├── auth/
│   │   │   │   └── auth.routes.ts
│   │   │   └── data/
│   │   │       └── data.routes.ts
│   │   ├── pages/                   # Route (page) components
│   │   │   ├── about/
│   │   │   ├── blog/
│   │   │   ├── blog-category/
│   │   │   ├── blog-details/
│   │   │   ├── cart/
│   │   │   ├── category/
│   │   │   ├── checkout/
│   │   │   ├── contact/
│   │   │   ├── destination/
│   │   │   ├── destination-details/
│   │   │   ├── faq/
│   │   │   ├── forget-password/
│   │   │   ├── home/
│   │   │   ├── login/
│   │   │   ├── make-trip/
│   │   │   ├── not-found/
│   │   │   ├── profile/
│   │   │   ├── signup/
│   │   │   ├── tour/
│   │   │   └── tour-details/
│   │   ├── services/                # Business logic & API
│   │   │   ├── auth.service.ts
│   │   │   ├── base.service.ts
│   │   │   ├── booking.service.ts
│   │   │   ├── data.service.ts
│   │   │   ├── datepicker.service.ts
│   │   │   ├── make-trip.service.ts
│   │   │   ├── profile.service.ts
│   │   │   └── seo.service.ts
│   │   ├── shared/
│   │   │   ├── components/
│   │   │   │   ├── banner/
│   │   │   │   ├── best-services/
│   │   │   │   ├── blog-cart/
│   │   │   │   ├── counter/
│   │   │   │   ├── destination-cart/
│   │   │   │   ├── faq-content/
│   │   │   │   ├── footer/
│   │   │   │   ├── make-trip-form/
│   │   │   │   ├── nav/
│   │   │   │   ├── ngx-dropzone-wrapper/
│   │   │   │   ├── pagination/
│   │   │   │   ├── parteners/
│   │   │   │   ├── social/
│   │   │   │   ├── tour-cart/
│   │   │   │   ├── video/
│   │   │   │   ├── whatsapp-icon/
│   │   │   │   └── why-choose-us/
│   │   │   └── (no pipes/directives folders – see section 6)
│   │   ├── app.ts                    # Root component (class name: App)
│   │   ├── app.html
│   │   ├── app.scss
│   │   ├── app.config.ts
│   │   ├── app.config.server.ts
│   │   ├── app.routes.ts
│   │   └── app.routes.server.ts
│   ├── assets/
│   │   ├── i18n/
│   │   │   ├── en.json
│   │   │   └── fr.json
│   │   └── image/
│   ├── environments/
│   │   ├── environment.ts
│   │   └── environment.prod.ts
│   ├── styles/
│   │   └── variables.scss            # Design tokens (colors, fonts) – UI-only
│   ├── index.html
│   ├── main.ts
│   ├── main.server.ts
│   ├── server.ts                     # Express SSR entry
│   └── styles.scss                   # Global styles
├── angular.json
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.spec.json
├── vercel.json                       # Deployment (project name in outputDirectory)
└── BLUEPRINT.md
```

### 1.2 Architecture pattern

- **Standalone components**: All components are standalone (no NgModules for features).
- **Route-based structure**: `app.routes.ts` composes `authRoutes` and `dataRoutes`; each route uses `loadComponent` for lazy loading.
- **Core**: Interfaces + one HTTP interceptor; no guards in this blueprint.
- **Shared**: Reusable UI components (nav, footer, banner, carts, forms, etc.).
- **Pages**: One folder per route; each page owns its template, styles, and minimal TS (calls services).
- **Services**: All API and app-wide state live in `services/`; `BaseService` holds `apiUrl` from environment.

---

## 2. Routing structure

### 2.1 Main routes (`app.routes.ts`)

- `''` → Home (lazy)
- `...authRoutes` (login, signup, forget-password)
- `...dataRoutes` (all content + cart, checkout, profile, makeTrip)
- `'**'` → Not Found (lazy)

### 2.2 Auth routes (`modules/auth/auth.routes.ts`)

| Path              | Component        | Title           |
|-------------------|------------------|-----------------|
| `login`           | LoginComponent   | Login           |
| `signup`          | SignupComponent  | Sign Up         |
| `forget-password` | ForgetPasswordComponent | Forget Password |

### 2.3 Data routes (`modules/data/data.routes.ts`)

| Path                 | Component             | Title              |
|----------------------|------------------------|--------------------|
| `about`              | AboutComponent        | About              |
| `destination`        | DestinationComponent  | Destination        |
| `destination/:slug`  | DestinationDetailsComponent | Destination Details |
| `tour`               | TourComponent         | Tour               |
| `tour/:slug`         | TourDetailsComponent  | Tour Details       |
| `blog`               | BlogComponent         | Blog               |
| `blog/:slug`         | BlogDetailsComponent  | Blog Details       |
| `blog-category/:id`  | BlogCategory          | Blog Category      |
| `category/:slug`     | Category              | Category           |
| `contact`            | ContactComponent      | Contact            |
| `faq`                | FaqComponent          | FAQ                |
| `profile`            | ProfileComponent      | Profile            |
| `checkout`           | CheckoutComponent     | Checkout           |
| `cart`               | CartComponent         | Cart               |
| `makeTrip`           | MakeTripComponent     | Make Trip          |

All routes use `loadComponent: () => import('...').then(m => m.X)` (lazy loading).

### 2.4 SSR routes (`app.routes.server.ts`)

- Dynamic: `destination/:slug`, `tour/:slug`, `blog/:slug` → `RenderMode.Server`
- Catch-all: `**` → `RenderMode.Server`

---

## 3. Shared components and core

### 3.1 Layout (used in root)

- **NavComponent** – main navigation
- **FooterComponent** – footer
- **WhatsappIconComponent** – floating WhatsApp link
- **NgxSpinnerModule** – global loading (in `app.html`)

### 3.2 Shared components (used across pages)

- **banner** – page banners  
- **best-services**, **why-choose-us**, **counter**, **video** – home/content blocks  
- **tour-cart**, **blog-cart**, **destination-cart** – list cards  
- **make-trip-form** – custom trip form  
- **faq-content** – FAQ accordion  
- **pagination** – list pagination  
- **parteners**, **social** – partners/social links  
- **ngx-dropzone-wrapper** – file upload (profile)

### 3.3 Core

- **Interfaces**: `itour`, `idestination`, `iblog`, `icategory`, `iduration`, `isettings`.
- **Interceptor**: `http.interceptor.ts` – adds `X-LOCALIZE`, `Authorization`, and NgxSpinner show/hide.

---

## 4. Services and business logic

| Service           | Role |
|-------------------|------|
| **BaseService**   | `apiUrl` from environment; extended by data/auth/booking. |
| **DataService**   | Tours, destinations, categories, blogs, FAQs, wishlist, contact; localStorage cache with TTL and auto-refresh. |
| **AuthService**   | Login, register, forget password, OTP; token in localStorage; `getToken`, `isLoggedIn`, `logout`. |
| **BookingService**| Bookings, cart (append/list/remove/clear), checkout, coupons, countries. |
| **ProfileService**| get/update profile, change image, logout. |
| **MakeTripService**| Custom trip form state (`BehaviorSubject`), send custom trip, get destinations. |
| **DatepickerService**| Helpers to open Material date(range) pickers. |
| **SeoService**    | Meta title/description, OG, Twitter, canonical, JSON-LD; defaults and `updateSeoFromSettings`. |

**State**: No NgRx. Lightweight state in `MakeTripService` (BehaviorSubject) and in services using localStorage/cache.

---

## 5. State management

- **Reactive**: `MakeTripService.makeTripSteps$` (BehaviorSubject) for make-trip flow.
- **Cache**: `DataService` – localStorage with keys prefixed by **project name** (e.g. `scrappe_voyager_destinations`) and TTL.
- **Auth**: Token and user data in memory/localStorage via `AuthService`.
- **Cart**: Server-side cart via `BookingService`; no client-only cart store.

---

## 6. Guards, interceptors, pipes, directives

- **Guards**: None.
- **Interceptors**: `httpInterceptor` (core/interceptors/http.interceptor.ts) – headers + spinner.
- **Pipes**: Only Angular/third-party: `DatePipe`, `TranslatePipe`; no custom pipes.
- **Directives**: Only third-party (e.g. `NgxDropzoneLabelDirective` from ngx-dropzone wrapper); no custom directives.

---

## 7. Angular version and packages

### 7.1 Angular (v20.3.x)

- `@angular/animations`, `common`, `compiler`, `core`, `forms`, `platform-browser`, `platform-server`, `router`, `ssr`
- `@angular/cdk`, `@angular/material`
- `@angular/build`, `@angular/cli`, `@angular/compiler-cli`

### 7.2 Third-party

- **i18n**: `@ngx-translate/core`, `@ngx-translate/http-loader`
- **UI**: `bootstrap`, `@fortawesome/fontawesome-free`, `ngx-owl-carousel-o`, `ngx-pagination`, `ngx-spinner`, `ngx-toastr`, `ngx-dropzone-next`
- **SSR**: `express`
- **Misc**: `rxjs`, `tslib`

---

## 8. Build configuration and environment

### 8.1 angular.json

- **Project key**: Must match project name (e.g. `scrappe_voyager`) – used in `buildTarget` and serve.
- **Builder**: `@angular/build:application`; production uses `server: src/main.server.ts`, `outputMode: server`, `ssr.entry: src/server.ts`.
- **Styles**: SCSS; global: ngx-spinner, Material theme, Bootstrap, FontAwesome, owl-carousel, toastr, `styles.scss`.
- **Scripts**: Bootstrap bundle.
- **Assets**: `src/favicon.ico`, `src/assets`, `public` (glob).
- **Budgets**: initial 2MB, component style 15kB (production).

### 8.2 Environments

- **environment.ts**: `production: false`, `apiUrl: '<API_BASE>'`
- **environment.prod.ts**: `production: true`, `apiUrl: '<API_BASE>'`
- **API base**: Used in `BaseService`; no `fileReplacements` in current angular.json – add if you want prod swap:

```json
"configurations": {
  "production": {
    "fileReplacements": [
      { "replace": "src/environments/environment.ts", "with": "src/environments/environment.prod.ts" }
    ],
    ...
  }
}
```

### 8.3 SSR

- **Entry**: `src/main.server.ts` bootstraps with `app.config.server.ts`.
- **Server**: `src/server.ts` – Express, `AngularNodeAppEngine`, static from `../browser`, CSP middleware, catch-all to Angular.
- **Config**: `app.config.server.ts` – `provideClientHydration(withEventReplay())`, `provideServerRendering(withRoutes(serverRoutes))`, `HashLocationStrategy`.
- **Package script**: `serve:ssr:<project_name>` → `node dist/<project_name>/server/server.mjs`.

### 8.4 Production

- **Optimizations**: Production build uses `outputHashing: all`, budgets, SSR.
- **Vercel**: `vercel.json` – `outputDirectory: dist/<project_name>/browser`, rewrites to `index.csr.html`.

---

## 9. Dynamic files (project name and SEO only)

These files must be updated when generating a new project from the blueprint. Only **project name** and **SEO** (and optional contact/API) change; logic and structure stay the same.

### 9.1 Project name (slug and display name)

Replace **project slug** (e.g. `scrappe_voyager`) and **display name** (e.g. `Scrappe Voyager`) in:

| File | What to replace |
|------|------------------|
| `package.json` | `"name": "<slug>"`, script `serve:ssr:<slug>` |
| `angular.json` | Project key `"<slug>": { ... }`, `buildTarget` / `serve` references |
| `vercel.json` | `outputDirectory`: `dist/<slug>/browser` |
| `src/app/app.ts` | `title = signal('<display name lower>')` |
| `src/app/app.html` | Spinner text (e.g. "scrappe voyager") |
| `src/index.html` | `<title>` (default) |
| `src/app/services/data.service.ts` | `STORAGE_KEYS`: prefix each key with `<slug>_` (e.g. `<slug>_destinations`) |
| `src/app/services/seo.service.ts` | `defaultTitle`, `defaultDescription`, `siteUrl` (and default image if needed) |
| `src/app/shared/components/nav/nav.component.ts` | `this.title = '<Display Name>'` (or from config) |
| `src/app/shared/components/footer/footer.component.ts` | `this.title`, `this.email` |
| All **pages** that call `seoService.updateSeoData(...)` or set document title | Fallback titles/descriptions and logo path (e.g. `scrappe voyager - Contact` → `<display> - Contact`) |
| **Pages with hardcoded brand**: `home`, `about`, `contact` (e.g. "Scrappe Voyager Egypt", contact email, map link) | Replace with new project name and contact details |
| `src/app/pages/blog-details/blog-details.component.ts` | `localStorage.getItem('<slug>_settings')` |

Use a **single slug** (e.g. `my_travel_app`) for: package name, Angular project key, dist folder, storage keys, and script names. Derive **kebab** for assets (e.g. `my-travel-app-logo.webp`) and **display name** for UI/SEO.

### 9.2 SEO-only

- **index.html**: `<title>`, optional `<meta name="description">`.
- **seo.service.ts**: `defaultTitle`, `defaultDescription`, `defaultImage`, `siteUrl` (and `resetToDefaults()`).
- **Per-page**: Each page that uses `SeoService.updateSeoData(...)` – pass new default title/description/image for that page when creating the new project.

### 9.3 UI / design (change only look, not structure)

- **src/app/styles/variables.scss**: Colors (`$primary-color`, `$second-color`, etc.), fonts (`$bady-font`, `$paragraph-font`), borders, transitions. Replace to get new theme.
- **src/styles.scss**: Global styles; change as needed for new design.
- **Component SCSS files**: Update as needed for new design; keep same selectors/structure if you only change tokens/variables.

---

## 10. What to keep unchanged

- **All** of `app.routes.ts`, `auth.routes.ts`, `data.routes.ts`, `app.routes.server.ts`.
- **All** service logic (only replace project-specific constants: storage prefix, SEO defaults, API URL if different).
- **All** core interfaces and the HTTP interceptor.
- **All** page TS logic except SEO strings and any hardcoded brand/contact.
- **Angular version** and all Angular and third-party packages (and versions).
- **Build configuration** (except project key and output paths that contain the project name).
- **Lazy loading** and **standalone** pattern.
- **SSR** setup (server.ts, main.server.ts, app.config.server.ts).

---

## 11. Exact list of dynamic files (project name and SEO only)

| File | Replacements |
|------|--------------|
| `package.json` | `name`, script `serve:ssr:<slug>` |
| `angular.json` | Project key, `buildTarget` / `serve` references |
| `vercel.json` | `outputDirectory` |
| `src/index.html` | `<title>` |
| `src/app/app.ts` | Root component `title` signal |
| `src/app/app.html` | Spinner label text |
| `src/app/services/data.service.ts` | `STORAGE_KEYS` prefix |
| `src/app/services/seo.service.ts` | `defaultTitle`, `defaultDescription`, `defaultImage`, `siteUrl` |
| `src/app/shared/components/nav/nav.component.ts` | `title` |
| `src/app/shared/components/footer/footer.component.ts` | `title`, `email` |
| All page components that call `SeoService.updateSeoData` | Fallback title/description/image (e.g. home, about, contact, tour, cart, profile, login, signup, etc.) |
| `src/app/pages/home/home.component.html` | Brand text (e.g. "Scrappe Voyager Egypt") |
| `src/app/pages/about/about.component.html` | Brand text |
| `src/app/pages/contact/contact.component.ts` | SEO, email, map URL |
| `src/app/pages/blog-details/blog-details.component.ts` | localStorage key `<slug>_settings` |

Logo path used in many pages: `assets/image/scrappe-voyager-logo.webp` → add new image as `assets/image/<slug-kebab>-logo.webp` and update references, or keep path and replace the file.

---

## 12. Scaffold script usage

1. **Create config** from example:
   - Copy `blueprint/scaffold.config.example.json` to `scaffold.config.json` (or pass path via CLI).
   - Set `projectName` (display name, e.g. `"My Travel App"`), `slug` (e.g. `"my_travel_app"`), `seo`, optional `contact`, `apiUrl`.

2. **Run scaffold** (from repo root):
   - `node scripts/scaffold.js [--config path/to/scaffold.config.json] [--out ../new-project]`
   - Script copies the project (excluding node_modules, .git, dist, etc.) to `--out` and replaces in all dynamic files:
     - Project slug and display name
     - SEO default title/description/image/siteUrl
     - Contact email (and map link if present)
     - Storage key prefix in `DataService`
     - `angular.json` project key and buildTargets
     - `package.json` name and SSR script
     - `vercel.json` outputDirectory

3. **UI**: After scaffold, replace `src/app/styles/variables.scss` (and optionally global/styles) with your new design; no change to architecture or logic.

4. **Install and run**:
   - `cd ../new-project && npm install && npm run start` (or `npm run build` for production).

---

## 13. Multi-project and scaling

- **One codebase per project**: Each new project is a full copy of the blueprint with its own name and SEO; shared logic lives in the copied services and components.
- **Scaling**: Add new routes in `data.routes.ts` or new modules; add new services in `services/`; add new shared components in `shared/components/`. Keep the same naming (kebab-case folders, standalone components, lazy `loadComponent`).
- **API**: Single `apiUrl` in environment; all services use `BaseService.baseUrl`. For multi-environment, use `fileReplacements` and different env files.
- **i18n**: Same structure `assets/i18n/en.json`, `fr.json`; add more locale files and use `TranslateService` as today.

This blueprint is production-ready with SSR, lazy loading, and a clear separation of project-specific (name, SEO, design) vs shared (architecture, routing, services, core).
