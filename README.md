# Well Management SPA

A single-page application for managing oil and gas well operations, built with React 18+, Vite, and Tailwind CSS. Features include a full-featured data grid, client-side filtering, sorting, pagination, well activation workflows, and CRUD operations — all persisted to localStorage.

## Tech Stack

- **React 18+** — UI library with functional components and hooks
- **Vite 5** — Build tool and development server
- **Tailwind CSS 3** — Utility-first CSS framework (dark theme)
- **react-router-dom v6** — Client-side routing
- **localStorage** — Client-side data persistence
- **Vitest** — Unit and integration testing framework
- **React Testing Library** — Component testing utilities
- **PropTypes** — Runtime prop type validation

## Getting Started

### Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9.x

### Installation

```bash
npm install
```

### Environment Variables

Copy the example environment file and configure as needed:

```bash
cp .env.example .env
```

| Variable | Description | Default |
|---|---|---|
| `VITE_APP_TITLE` | Application title displayed in the browser tab and header | `Well Management SPA` |

### Development

Start the development server on port 3000:

```bash
npm run dev
```

The application will open automatically at [http://localhost:3000](http://localhost:3000).

### Build

Create a production build in the `dist/` directory:

```bash
npm run build
```

### Preview

Preview the production build locally:

```bash
npm run preview
```

### Testing

Run the full test suite:

```bash
npm test
```

Run tests in watch mode during development:

```bash
npm run test:watch
```

## Folder Structure

```
well-management-spa/
├── index.html                          # HTML entry point
├── package.json                        # Dependencies and scripts
├── vite.config.js                      # Vite configuration
├── vitest.config.js                    # Vitest configuration
├── tailwind.config.js                  # Tailwind CSS configuration
├── postcss.config.js                   # PostCSS configuration
├── vercel.json                         # Vercel deployment configuration
├── .env.example                        # Environment variable template
├── src/
│   ├── main.jsx                        # Application entry point
│   ├── App.jsx                         # Root component with routing
│   ├── index.css                       # Tailwind CSS imports
│   ├── components/
│   │   ├── ui/                         # Reusable UI component library
│   │   │   ├── Badge.jsx               # Status badge (active/inactive)
│   │   │   ├── Badge.test.jsx          # Badge unit tests
│   │   │   ├── Button.jsx              # Button with variant/size support
│   │   │   ├── Button.test.jsx         # Button unit tests
│   │   │   ├── CollapsibleSection.jsx  # Expandable/collapsible sections
│   │   │   ├── Input.jsx               # Text input with optional search icon
│   │   │   ├── Modal.jsx               # Dialog with focus trapping
│   │   │   ├── Modal.test.jsx          # Modal unit tests
│   │   │   ├── Pagination.jsx          # Pagination controls
│   │   │   └── Table.jsx               # Data grid component
│   │   └── wells/                      # Well-specific components
│   │       ├── ActivationModal.jsx     # Well activation confirmation modal
│   │       ├── FilterBar.jsx           # Well list filter inputs
│   │       ├── WellForm.jsx            # Create/edit well form
│   │       ├── WellTable.jsx           # Well data table
│   │       └── WellTableRow.jsx        # Individual well table row
│   ├── constants/
│   │   ├── designTokens.js             # Tailwind CSS design token system
│   │   └── mockData.js                 # Pre-seeded mock well data (10 records)
│   ├── context/
│   │   └── WellContext.jsx             # React Context for global well state
│   ├── hooks/
│   │   ├── useActivationModal.js       # Activation modal state management
│   │   └── useWells.js                 # Well state consumer hook
│   ├── pages/
│   │   ├── CreateSidetrackPage.jsx     # Create sidetrack well page
│   │   ├── CreateWellPage.jsx          # Create new well page
│   │   ├── EditWellPage.jsx            # Edit existing well page
│   │   ├── NotFoundPage.jsx            # 404 page
│   │   ├── WellDetailPage.jsx          # Well detail/view page
│   │   ├── WellListPage.jsx            # Main well list page
│   │   └── WellListPage.test.jsx       # Well list page integration tests
│   ├── services/
│   │   ├── wellListManager.js          # Business logic (filter, sort, activate)
│   │   ├── wellListManager.test.js     # Business logic unit tests
│   │   ├── wellRepository.js           # localStorage CRUD operations
│   │   └── wellRepository.test.js      # Repository unit tests
│   ├── utils/
│   │   └── validationUtils.js          # Design system prop validation
│   └── test/
│       └── setup.js                    # Test setup (jest-dom matchers)
```

## Features

### Well List Grid

- Full-featured data grid displaying well records with columns for Rig, Well Name, Well ID, Operator, Contractor, Spud Date, Status, and Actions
- Active wells are pinned to the top of the list with highlighted row styling

### Filtering

- Real-time client-side filtering by Rig, Well Name, Well ID, Operator, and Contractor
- Case-insensitive partial string matching
- Filter changes automatically reset pagination to page 1

### Sorting

- Sortable Spud Date column with ascending/descending toggle
- Sort direction indicators (↑/↓) with `aria-sort` attributes

### Pagination

- First, previous, numbered pages, next, and last navigation buttons
- Configurable page size dropdown (5, 10, 25, 50 rows per page)

### Well Activation

- One-active-per-rig enforcement rule
- Two-scenario activation modal:
  - **First activation** — emerald border confirmation
  - **Switch** — red border warning with demotion notice for the currently active well

### CRUD Operations

- **Create Well** — Form with collapsible Rig Setup and Well Setup sections, required field validation
- **Create Sidetrack Well** — Dedicated page with Sidetrack type pre-filled
- **Edit Well** — Pre-populated form with update persistence
- **View Well** — Read-only detail view with Rig and Well information sections

### Data Persistence

- All data stored in `localStorage` via the `wellRepository` service
- 10 pre-seeded mock well records on first load
- Corrupt data detection with automatic reset to mock data
- Retry logic for localStorage write operations

### Accessibility (WCAG 2.1 AA)

- Semantic HTML with proper ARIA roles (`grid`, `dialog`, `status`, `navigation`, `search`, `region`)
- `aria-label`, `aria-sort`, `aria-selected`, `aria-expanded`, `aria-controls`, and `aria-modal` attributes
- Focus trapping in modals with Tab/Shift+Tab cycling
- Keyboard navigation for sortable headers and collapsible sections (Enter/Space)
- Focus restoration on modal close

### Design System

- Comprehensive design token system (`designTokens.js`) with consistent dark theme styling
- `stone` and `emerald` color palettes
- All components styled exclusively with Tailwind utility classes
- Runtime prop validation with console warnings in development

## Routes

| Path | Component | Description |
|---|---|---|
| `/` | `WellListPage` | Main well list with grid, filters, and pagination |
| `/wells/new` | `CreateWellPage` | Create a new well |
| `/wells/sidetrack/new` | `CreateSidetrackPage` | Create a new sidetrack well |
| `/wells/:id` | `WellDetailPage` | View well details (read-only) |
| `/wells/:id/edit` | `EditWellPage` | Edit an existing well |
| `*` | `NotFoundPage` | 404 error page |

## Deployment

### Vercel

This project includes a `vercel.json` configuration with SPA rewrite rules for client-side routing support. To deploy:

1. Connect your repository to [Vercel](https://vercel.com)
2. Vercel will auto-detect the Vite framework preset
3. Build command: `npm run build`
4. Output directory: `dist`
5. The included `vercel.json` handles all client-side route rewrites automatically

### Other Platforms

For any static hosting platform, ensure:

- The build output from `dist/` is served
- All routes are rewritten to `index.html` to support client-side routing

## License

This project is private and proprietary.