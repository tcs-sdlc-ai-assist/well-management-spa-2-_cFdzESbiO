# Changelog

All notable changes to the Well Management SPA will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-06-01

### Added

- **Well List Grid Display**: Full-featured data grid displaying well records with columns for Rig, Well Name, Well ID, Operator, Contractor, Spud Date, Status, and Actions.
- **Client-Side Routing**: SPA routing via `react-router-dom` v6 with routes for well list (`/`), well detail (`/wells/:id`), create well (`/wells/new`), create sidetrack well (`/wells/sidetrack/new`), edit well (`/wells/:id/edit`), and a 404 not-found page.
- **Active Well Management**: One-active-per-rig enforcement rule. Active wells are automatically pinned to the top of the list with highlighted row styling (`border-l-4 border-emerald-500 bg-stone-800/50`).
- **Activation Modal Flows**: Two-scenario activation modal supporting first-activation (emerald border) and switch (red border warning) flows. Confirms activation and demotes the previously active well on the same rig when switching.
- **Filtering**: Real-time client-side filtering by Rig, Well Name, Well ID, Operator, and Contractor with case-insensitive partial string matching. Filter changes reset pagination to page 1.
- **Sorting**: Sortable Spud Date column with ascending/descending toggle, sort direction indicators (`↑`/`↓`), and `aria-sort` attributes for accessibility.
- **Pagination**: Full pagination controls with first, previous, numbered pages, next, and last buttons. Configurable page size dropdown (5, 10, 25, 50 rows per page) with automatic page reset on size change.
- **Pre-Seeded Mock Data**: 10 pre-seeded well records stored in `localStorage` via `wellRepository` service. Automatic seeding on first load with corrupt data detection and auto-reset to mock data.
- **Create Well Flow**: Form with collapsible Rig Setup and Well Setup sections. Required field validation for Rig, Operator, Contractor, Well Name, and Spud Date. New wells default to `inactive` status.
- **Create Sidetrack Well Flow**: Dedicated sidetrack creation page with `Sidetrack` type pre-filled in the form.
- **Edit Well Flow**: Edit page that loads well data by URL parameter, pre-populates the form, and persists updates to `localStorage`.
- **Well Detail Page**: Read-only detail view displaying all well fields organized into Rig Information and Well Information sections with navigation back to the list and to the edit page.
- **Reusable UI Component Library**:
  - `Button` — Primary, success, secondary, outline, and danger variants with md/lg sizes.
  - `Badge` — Active (with pulsing green dot animation) and inactive status variants.
  - `Input` — Text input with optional search icon prefix and md/lg sizes.
  - `Modal` — Dialog with focus trapping, Escape key close, click-outside close, activation/warning border variants, and body scroll prevention.
  - `Table` — Data grid with sortable column headers, active row highlighting, and custom action rendering.
  - `Pagination` — Navigation controls with page size selector.
  - `CollapsibleSection` — Expandable/collapsible content sections with animated height transitions.
- **Tailwind CSS Dark Theme Design System**: Comprehensive design token system (`designTokens.js`) with consistent dark theme styling using `stone` and `emerald` color palettes. All components styled exclusively with Tailwind utility classes.
- **State Management**: React Context-based `WellProvider` with `useWells` and `useActivationModal` custom hooks for global well state, filters, sort, pagination, and activation modal management.
- **Data Layer**: `wellRepository` service for `localStorage` CRUD operations with JSON serialization, retry logic, and corrupt data recovery. `wellListManager` service for business logic including filtering, sorting, active well pinning, pagination, and activation enforcement.
- **Accessibility (WCAG 2.1 AA)**:
  - Semantic HTML with proper ARIA roles (`grid`, `dialog`, `status`, `navigation`, `search`, `region`).
  - `aria-label`, `aria-sort`, `aria-selected`, `aria-expanded`, `aria-controls`, and `aria-modal` attributes throughout.
  - Focus trapping in modals with Tab/Shift+Tab cycling.
  - Keyboard navigation support for sortable headers and collapsible sections (Enter/Space).
  - Focus restoration on modal close.
  - `role="status"` on Badge components.
- **Runtime Prop Validation**: `validationUtils.js` providing design system compliance validation for Button, Badge, Modal, and Table components with console warnings in development.
- **Test Suite**: Unit and integration tests using Vitest, React Testing Library, and `@testing-library/user-event` covering:
  - UI components (Badge, Button, Modal, Pagination).
  - Service layer (`wellRepository`, `wellListManager`).
  - Page-level integration (`WellListPage`).
- **Vercel Deployment Configuration**: `vercel.json` with SPA rewrite rules for client-side routing support.
- **Vite Build Configuration**: Vite 5 with React plugin, source maps, and development server on port 3000.