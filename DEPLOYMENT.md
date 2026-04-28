# Deployment Guide

This document covers deploying the Well Management SPA to Vercel and other static hosting platforms.

## Table of Contents

- [Vercel Deployment](#vercel-deployment)
  - [Prerequisites](#prerequisites)
  - [Step-by-Step Setup](#step-by-step-setup)
  - [Environment Variables](#environment-variables)
  - [Build Configuration](#build-configuration)
  - [SPA Rewrite Configuration](#spa-rewrite-configuration)
  - [CI/CD Auto-Deploy](#cicd-auto-deploy)
- [Other Hosting Platforms](#other-hosting-platforms)
  - [Netlify](#netlify)
  - [GitHub Pages](#github-pages)
  - [Generic Static Hosting](#generic-static-hosting)
- [Troubleshooting](#troubleshooting)
  - [Client-Side Routing Issues](#client-side-routing-issues)
  - [Build Failures](#build-failures)
  - [Blank Page After Deploy](#blank-page-after-deploy)
  - [Assets Not Loading](#assets-not-loading)

---

## Vercel Deployment

### Prerequisites

- A [Vercel](https://vercel.com) account (free tier is sufficient)
- A Git repository (GitHub, GitLab, or Bitbucket) containing the project source code
- Node.js >= 18.x used for local development and testing

### Step-by-Step Setup

1. **Push your code to a Git repository**

   Ensure your repository includes all source files, `package.json`, `vite.config.js`, and `vercel.json` at the project root.

2. **Connect your repository to Vercel**

   - Log in to [vercel.com](https://vercel.com) and click **"Add New Project"**.
   - Select your Git provider (GitHub, GitLab, or Bitbucket) and authorize Vercel if prompted.
   - Choose the repository containing the Well Management SPA.

3. **Configure project settings**

   Vercel will auto-detect the **Vite** framework preset. Verify the following settings:

   | Setting | Value |
   |---|---|
   | **Framework Preset** | Vite |
   | **Build Command** | `npm run build` (or `vite build`) |
   | **Output Directory** | `dist` |
   | **Install Command** | `npm install` |
   | **Node.js Version** | 18.x or later |

   > **Note:** Vercel auto-detects Vite projects by the presence of `vite.config.js` in the project root. In most cases, no manual configuration of build settings is required.

4. **Deploy**

   Click **"Deploy"** and Vercel will install dependencies, run the build, and publish the `dist` directory.

5. **Verify the deployment**

   - Visit the generated `.vercel.app` URL.
   - Navigate to different routes (e.g., `/wells/new`, `/wells/1`) to confirm client-side routing works.
   - Refresh the page on a sub-route to verify the SPA rewrite rule is active.

### Environment Variables

This is a **frontend-only** application with no server-side API keys or secrets. All data is stored in the browser's `localStorage`.

The only environment variable is optional:

| Variable | Required | Description | Default |
|---|---|---|---|
| `VITE_APP_TITLE` | No | Application title displayed in the browser tab and header | `Well Management SPA` |

To set environment variables on Vercel:

1. Go to your project dashboard on Vercel.
2. Navigate to **Settings** → **Environment Variables**.
3. Add `VITE_APP_TITLE` with your desired value.
4. Select the environments where it should apply (Production, Preview, Development).
5. Redeploy for the changes to take effect.

> **Important:** Vite environment variables must be prefixed with `VITE_` to be exposed to the client-side bundle. Variables without this prefix are not included in the build output.

### Build Configuration

The production build is handled by Vite:

```bash
npm run build
```

This runs `vite build`, which:

- Bundles all JavaScript and CSS with tree-shaking and minification.
- Outputs optimized assets to the `dist/` directory.
- Generates source maps for debugging (`sourcemap: true` in `vite.config.js`).
- Processes Tailwind CSS and removes unused utility classes via PurgeCSS (built into Tailwind).

The `dist/` directory structure after build:

```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   └── index-[hash].css
└── favicon.ico
```

### SPA Rewrite Configuration

The project includes a `vercel.json` file at the root that configures SPA rewrites for client-side routing:

```json
{
  "rewrites": [
    {
      "source": "/((?!assets/).*)",
      "destination": "/index.html"
    }
  ]
}
```

This configuration:

- Rewrites all requests that do **not** match the `/assets/` path to `index.html`.
- Allows `react-router-dom` to handle routing on the client side.
- Ensures that direct navigation to routes like `/wells/new` or `/wells/1/edit` returns the SPA shell instead of a 404 error.
- Preserves direct access to static assets (JS, CSS, images) in the `/assets/` directory.

> **Do not remove `vercel.json`** — without it, refreshing or directly navigating to any route other than `/` will result in a Vercel 404 page.

### CI/CD Auto-Deploy

Vercel provides automatic deployments out of the box:

- **Production deploys**: Every push to the `main` (or `master`) branch triggers a production deployment.
- **Preview deploys**: Every push to any other branch or every pull request generates a unique preview URL.
- **Instant rollbacks**: Previous deployments can be promoted to production from the Vercel dashboard.

#### Branch Configuration

| Branch | Deploy Type | URL |
|---|---|---|
| `main` | Production | `your-project.vercel.app` |
| Feature branches | Preview | `your-project-<hash>.vercel.app` |
| Pull requests | Preview | `your-project-<hash>.vercel.app` |

To customize branch behavior:

1. Go to your project on Vercel.
2. Navigate to **Settings** → **Git**.
3. Configure the **Production Branch** (default: `main`).

#### Skipping Deployments

To skip a deployment for a specific commit, include `[skip ci]` or `[vercel skip]` in the commit message:

```bash
git commit -m "docs: update README [skip ci]"
```

---

## Other Hosting Platforms

### Netlify

1. Connect your Git repository to [Netlify](https://netlify.com).
2. Set the build command to `npm run build`.
3. Set the publish directory to `dist`.
4. Add a `_redirects` file in the `public/` directory (create the directory if it does not exist):

   ```
   /*    /index.html   200
   ```

   This serves the same purpose as the `vercel.json` rewrite rule.

### GitHub Pages

GitHub Pages does not natively support SPA rewrites. You have two options:

1. **Use a 404.html workaround**: Copy `index.html` to `404.html` in the `dist/` directory as a post-build step.
2. **Use hash-based routing**: Switch from `BrowserRouter` to `HashRouter` in `App.jsx` (not recommended for production).

### Generic Static Hosting

For any static hosting platform (AWS S3 + CloudFront, Firebase Hosting, Surge, etc.):

1. Run `npm run build` to generate the `dist/` directory.
2. Upload the contents of `dist/` to your hosting provider.
3. Configure a rewrite/fallback rule so that all routes serve `index.html`:
   - **Nginx**: `try_files $uri $uri/ /index.html;`
   - **Apache**: Use a `.htaccess` file with `FallbackResource /index.html`
   - **AWS CloudFront**: Set the error page for 404 responses to `/index.html` with a 200 status code.
   - **Firebase**: Add `"rewrites": [{ "source": "**", "destination": "/index.html" }]` to `firebase.json`.

---

## Troubleshooting

### Client-Side Routing Issues

**Symptom:** Navigating directly to a route like `/wells/new` or refreshing the page on a sub-route returns a 404 error.

**Cause:** The hosting platform is looking for a file at that path instead of serving `index.html`.

**Solution:**

1. Verify that `vercel.json` exists at the project root and contains the rewrite rule.
2. On Vercel, confirm the file is included in the deployment by checking the **Source** tab in the deployment details.
3. For other platforms, ensure the equivalent rewrite/fallback rule is configured (see [Other Hosting Platforms](#other-hosting-platforms)).

### Build Failures

**Symptom:** The Vercel build fails with errors.

**Common causes and fixes:**

| Error | Fix |
|---|---|
| `Module not found` | Run `npm install` locally and verify all imports resolve. Ensure `package.json` lists all dependencies. |
| `Node.js version mismatch` | Set the Node.js version to 18.x or later in Vercel project settings under **Settings** → **General** → **Node.js Version**. |
| `Out of memory` | Increase the build memory limit in Vercel project settings, or optimize the build by reducing source map size. |
| `Tailwind classes not applied` | Verify `tailwind.config.js` has the correct `content` paths: `["./index.html", "./src/**/*.{js,jsx}"]`. |

**Debug locally:**

```bash
npm run build
```

If the build succeeds locally but fails on Vercel, check for environment-specific differences (Node.js version, environment variables).

### Blank Page After Deploy

**Symptom:** The deployed site shows a blank white page with no content.

**Common causes and fixes:**

1. **Check the browser console** for JavaScript errors (e.g., failed asset loading, CORS issues).
2. **Verify the base path**: If deploying to a subdirectory, set `base` in `vite.config.js`:
   ```js
   export default defineConfig({
     base: '/your-subdirectory/',
     // ...
   });
   ```
   For root deployments (default), no `base` configuration is needed.
3. **Check that `dist/index.html`** references the correct asset paths (should be relative paths like `./assets/...` or absolute paths like `/assets/...`).

### Assets Not Loading

**Symptom:** The page loads but styles are missing or JavaScript fails to execute.

**Common causes and fixes:**

1. **Verify the rewrite rule** in `vercel.json` excludes the `assets/` path. The current rule `/((?!assets/).*)` correctly allows direct access to `/assets/*` files.
2. **Check for mixed content issues**: If your site is served over HTTPS, ensure all asset URLs use HTTPS.
3. **Clear the CDN cache**: On Vercel, trigger a redeployment to invalidate the edge cache. Go to your project dashboard and click **Redeploy** on the latest deployment.