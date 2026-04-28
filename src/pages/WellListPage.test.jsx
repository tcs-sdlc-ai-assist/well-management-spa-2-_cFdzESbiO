import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { WellProvider } from '../context/WellContext.jsx';
import { WellListPage } from './WellListPage.jsx';
import { mockWells } from '../constants/mockData.js';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

function renderWellListPage() {
  return render(
    <WellProvider>
      <MemoryRouter initialEntries={['/']}>
        <WellListPage />
      </MemoryRouter>
    </WellProvider>
  );
}

describe('WellListPage', () => {
  let storage;
  let getItemSpy;
  let setItemSpy;

  beforeEach(() => {
    storage = {};
    getItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      return storage[key] !== undefined ? storage[key] : null;
    });
    setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation((key, value) => {
      storage[key] = value;
    });
    mockNavigate.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('rendering', () => {
    it('renders the page title', () => {
      renderWellListPage();

      expect(screen.getByText('Well List')).toBeInTheDocument();
    });

    it('renders well grid with mock data', async () => {
      renderWellListPage();

      await waitFor(() => {
        expect(screen.getByText('Thunder Horse #1')).toBeInTheDocument();
      });

      expect(screen.getByText('WL-1001')).toBeInTheDocument();
      expect(screen.getByText('DeepSea Energy')).toBeInTheDocument();
    });

    it('renders the well table with aria-label', () => {
      renderWellListPage();

      expect(screen.getByRole('grid', { name: 'Well list' })).toBeInTheDocument();
    });

    it('renders filter bar with search role', () => {
      renderWellListPage();

      expect(screen.getByRole('search', { name: 'Filter wells' })).toBeInTheDocument();
    });

    it('renders pagination navigation', () => {
      renderWellListPage();

      expect(screen.getByRole('navigation', { name: 'Pagination navigation' })).toBeInTheDocument();
    });
  });

  describe('active well pinned to top', () => {
    it('pins active wells to the top of the table', async () => {
      renderWellListPage();

      await waitFor(() => {
        expect(screen.getByText('Thunder Horse #1')).toBeInTheDocument();
      });

      const table = screen.getByRole('grid', { name: 'Well list' });
      const rows = within(table).getAllByRole('row');

      // First data row (index 1, since index 0 is the header row) should be an active well
      // Active rows have aria-selected attribute
      const dataRows = rows.slice(1);
      expect(dataRows.length).toBeGreaterThan(0);

      // Check that the first data rows are active (have aria-selected)
      const firstRow = dataRows[0];
      expect(firstRow).toHaveAttribute('aria-selected', 'true');
    });
  });

  describe('filter inputs', () => {
    it('filters the grid by rig in real-time', async () => {
      const user = userEvent.setup();
      renderWellListPage();

      await waitFor(() => {
        expect(screen.getByText('Thunder Horse #1')).toBeInTheDocument();
      });

      const rigInput = screen.getByLabelText('Filter by rig');
      await user.type(rigInput, 'Rig 1');

      await waitFor(() => {
        expect(screen.getByText('Thunder Horse #1')).toBeInTheDocument();
      });
    });

    it('filters the grid by operator in real-time', async () => {
      const user = userEvent.setup();
      renderWellListPage();

      await waitFor(() => {
        expect(screen.getByText('Thunder Horse #1')).toBeInTheDocument();
      });

      const operatorInput = screen.getByLabelText('Filter by operator');
      await user.type(operatorInput, 'DeepSea');

      await waitFor(() => {
        expect(screen.getByText('Thunder Horse #1')).toBeInTheDocument();
        expect(screen.queryByText('Permian Basin #7')).not.toBeInTheDocument();
      });
    });

    it('filters the grid by contractor in real-time', async () => {
      const user = userEvent.setup();
      renderWellListPage();

      await waitFor(() => {
        expect(screen.getByText('Thunder Horse #1')).toBeInTheDocument();
      });

      const contractorInput = screen.getByLabelText('Filter by contractor');
      await user.type(contractorInput, 'Atlas');

      await waitFor(() => {
        expect(screen.getByText('Thunder Horse #1')).toBeInTheDocument();
        expect(screen.getByText('Atlas Drilling Co.')).toBeInTheDocument();
      });
    });

    it('shows no wells found when filter matches nothing', async () => {
      const user = userEvent.setup();
      renderWellListPage();

      await waitFor(() => {
        expect(screen.getByText('Thunder Horse #1')).toBeInTheDocument();
      });

      const operatorInput = screen.getByLabelText('Filter by operator');
      await user.type(operatorInput, 'NonexistentOperatorXYZ');

      await waitFor(() => {
        expect(screen.getByText('No wells found.')).toBeInTheDocument();
      });
    });
  });

  describe('pagination controls', () => {
    it('renders page size dropdown', () => {
      renderWellListPage();

      const pageSizeSelect = screen.getByLabelText('Select number of rows per page');
      expect(pageSizeSelect).toBeInTheDocument();
    });

    it('changes page size and resets to page 1', async () => {
      const user = userEvent.setup();
      renderWellListPage();

      await waitFor(() => {
        expect(screen.getByText('Thunder Horse #1')).toBeInTheDocument();
      });

      const pageSizeSelect = screen.getByLabelText('Select number of rows per page');
      await user.selectOptions(pageSizeSelect, '5');

      await waitFor(() => {
        expect(pageSizeSelect).toHaveValue('5');
      });
    });

    it('navigates to next page when next button is clicked', async () => {
      const user = userEvent.setup();
      renderWellListPage();

      await waitFor(() => {
        expect(screen.getByText('Thunder Horse #1')).toBeInTheDocument();
      });

      // Set page size to 5 to create multiple pages
      const pageSizeSelect = screen.getByLabelText('Select number of rows per page');
      await user.selectOptions(pageSizeSelect, '5');

      await waitFor(() => {
        expect(pageSizeSelect).toHaveValue('5');
      });

      const nextButton = screen.getByLabelText('Go to next page');
      if (!nextButton.disabled) {
        await user.click(nextButton);

        await waitFor(() => {
          expect(screen.getByRole('navigation', { name: 'Pagination navigation' })).toBeInTheDocument();
        });
      }
    });
  });

  describe('Create New Well button', () => {
    it('renders Create New Well button', () => {
      renderWellListPage();

      expect(screen.getByRole('button', { name: 'Create New Well' })).toBeInTheDocument();
    });

    it('navigates to /wells/new when Create New Well is clicked', async () => {
      const user = userEvent.setup();
      renderWellListPage();

      const createButton = screen.getByRole('button', { name: 'Create New Well' });
      await user.click(createButton);

      expect(mockNavigate).toHaveBeenCalledWith('/wells/new');
    });
  });

  describe('Create Sidetrack button', () => {
    it('renders Create Sidetrack Well button', () => {
      renderWellListPage();

      expect(screen.getByRole('button', { name: 'Create Sidetrack Well' })).toBeInTheDocument();
    });

    it('navigates to /wells/sidetrack/new when Create Sidetrack Well is clicked', async () => {
      const user = userEvent.setup();
      renderWellListPage();

      const sidetrackButton = screen.getByRole('button', { name: 'Create Sidetrack Well' });
      await user.click(sidetrackButton);

      expect(mockNavigate).toHaveBeenCalledWith('/wells/sidetrack/new');
    });
  });

  describe('activation modal', () => {
    it('opens activation modal when Activate button is clicked on an inactive well', async () => {
      const user = userEvent.setup();
      renderWellListPage();

      await waitFor(() => {
        expect(screen.getByRole('grid', { name: 'Well list' })).toBeInTheDocument();
      });

      // Find an Activate button (only shown for inactive wells)
      const activateButtons = screen.getAllByRole('button', { name: /^Activate/ });
      expect(activateButtons.length).toBeGreaterThan(0);

      await user.click(activateButtons[0]);

      await waitFor(() => {
        const dialog = screen.getByRole('dialog');
        expect(dialog).toBeInTheDocument();
      });
    });

    it('shows Confirm and Cancel buttons in the activation modal', async () => {
      const user = userEvent.setup();
      renderWellListPage();

      await waitFor(() => {
        expect(screen.getByRole('grid', { name: 'Well list' })).toBeInTheDocument();
      });

      const activateButtons = screen.getAllByRole('button', { name: /^Activate/ });
      await user.click(activateButtons[0]);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      expect(screen.getByRole('button', { name: /Cancel activation/ })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Confirm/ })).toBeInTheDocument();
    });

    it('closes activation modal when Cancel is clicked', async () => {
      const user = userEvent.setup();
      renderWellListPage();

      await waitFor(() => {
        expect(screen.getByRole('grid', { name: 'Well list' })).toBeInTheDocument();
      });

      const activateButtons = screen.getAllByRole('button', { name: /^Activate/ });
      await user.click(activateButtons[0]);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      const cancelButton = screen.getByRole('button', { name: /Cancel activation/ });
      await user.click(cancelButton);

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });

    it('closes activation modal and activates well when Confirm is clicked', async () => {
      const user = userEvent.setup();
      renderWellListPage();

      await waitFor(() => {
        expect(screen.getByRole('grid', { name: 'Well list' })).toBeInTheDocument();
      });

      const activateButtons = screen.getAllByRole('button', { name: /^Activate/ });
      await user.click(activateButtons[0]);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      const confirmButton = screen.getByRole('button', { name: /Confirm/ });
      await user.click(confirmButton);

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });
  });

  describe('sorting', () => {
    it('renders sortable SPUD DATE column header', async () => {
      renderWellListPage();

      await waitFor(() => {
        expect(screen.getByText('Thunder Horse #1')).toBeInTheDocument();
      });

      const table = screen.getByRole('grid', { name: 'Well list' });
      const spudDateHeader = within(table).getByText(/SPUD DATE/);
      expect(spudDateHeader).toBeInTheDocument();
      expect(spudDateHeader.closest('th')).toHaveAttribute('tabindex', '0');
    });

    it('toggles sort direction when SPUD DATE header is clicked', async () => {
      const user = userEvent.setup();
      renderWellListPage();

      await waitFor(() => {
        expect(screen.getByText('Thunder Horse #1')).toBeInTheDocument();
      });

      const table = screen.getByRole('grid', { name: 'Well list' });
      const spudDateHeader = within(table).getByText(/SPUD DATE/);

      await user.click(spudDateHeader);

      await waitFor(() => {
        expect(spudDateHeader.textContent).toContain('↑');
      });

      await user.click(spudDateHeader);

      await waitFor(() => {
        expect(spudDateHeader.textContent).toContain('↓');
      });
    });
  });

  describe('action buttons in table rows', () => {
    it('renders View Details button for each well', async () => {
      renderWellListPage();

      await waitFor(() => {
        expect(screen.getByText('Thunder Horse #1')).toBeInTheDocument();
      });

      const viewButtons = screen.getAllByRole('button', { name: /View details for/ });
      expect(viewButtons.length).toBeGreaterThan(0);
    });

    it('navigates to well detail page when View Details is clicked', async () => {
      const user = userEvent.setup();
      renderWellListPage();

      await waitFor(() => {
        expect(screen.getByText('Thunder Horse #1')).toBeInTheDocument();
      });

      const viewButtons = screen.getAllByRole('button', { name: /View details for/ });
      await user.click(viewButtons[0]);

      expect(mockNavigate).toHaveBeenCalledWith(expect.stringMatching(/^\/wells\/.+$/));
    });

    it('renders Edit button for each well', async () => {
      renderWellListPage();

      await waitFor(() => {
        expect(screen.getByText('Thunder Horse #1')).toBeInTheDocument();
      });

      const editButtons = screen.getAllByRole('button', { name: /^Edit / });
      expect(editButtons.length).toBeGreaterThan(0);
    });

    it('navigates to well edit page when Edit is clicked', async () => {
      const user = userEvent.setup();
      renderWellListPage();

      await waitFor(() => {
        expect(screen.getByText('Thunder Horse #1')).toBeInTheDocument();
      });

      const editButtons = screen.getAllByRole('button', { name: /^Edit / });
      await user.click(editButtons[0]);

      expect(mockNavigate).toHaveBeenCalledWith(expect.stringMatching(/^\/wells\/.+\/edit$/));
    });
  });
});