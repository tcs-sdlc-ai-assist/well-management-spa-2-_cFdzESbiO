/**
 * WellListPage component - main well list page rendered at route /.
 * Contains page header with title and action buttons (Create New Well, Create Sidetrack Well).
 * Renders FilterBar, WellTable, Pagination, and ActivationModal components.
 * Styled with bg-stone-950 full-page background.
 * @module WellListPage
 */

import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWells } from '../hooks/useWells.js';
import { useActivationModal } from '../hooks/useActivationModal.js';
import { FilterBar } from '../components/wells/FilterBar.jsx';
import { WellTable } from '../components/wells/WellTable.jsx';
import { Pagination } from '../components/ui/Pagination.jsx';
import { Button } from '../components/ui/Button.jsx';
import { ActivationModal } from '../components/wells/ActivationModal.jsx';

/**
 * WellListPage renders the main well list view with filtering, sorting,
 * pagination, and activation modal support.
 * @returns {React.ReactElement}
 */
export function WellListPage() {
  const navigate = useNavigate();
  const {
    totalPages,
    currentPage,
    pageSize,
    setPagination,
  } = useWells();

  const {
    isOpen,
    targetWell,
    currentActiveWell,
    scenario,
    error,
    openModal,
    closeModal,
    confirmActivation,
  } = useActivationModal();

  /**
   * Handles page change from Pagination component.
   * @param {number} page - The new page number (1-based)
   */
  const handlePageChange = useCallback((page) => {
    setPagination({ currentPage: page });
  }, [setPagination]);

  /**
   * Handles page size change from Pagination component.
   * Resets to page 1 when page size changes.
   * @param {number} newPageSize - The new page size
   */
  const handlePageSizeChange = useCallback((newPageSize) => {
    setPagination({ currentPage: 1, pageSize: newPageSize });
  }, [setPagination]);

  /**
   * Handles well activation request from WellTable.
   * Opens the activation modal for the selected well.
   * @param {import('../constants/mockData.js').Well} well - The well to activate
   */
  const handleActivate = useCallback((well) => {
    openModal(well);
  }, [openModal]);

  /**
   * Handles activation confirmation from ActivationModal.
   */
  const handleConfirmActivation = useCallback(() => {
    confirmActivation();
  }, [confirmActivation]);

  /**
   * Navigates to the Create New Well page.
   */
  const handleCreateNewWell = useCallback(() => {
    navigate('/wells/new');
  }, [navigate]);

  /**
   * Navigates to the Create Sidetrack Well page.
   */
  const handleCreateSidetrackWell = useCallback(() => {
    navigate('/wells/sidetrack/new');
  }, [navigate]);

  return (
    <div className="min-h-screen bg-stone-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold text-stone-100">
            Well List
          </h1>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="md"
              onClick={handleCreateSidetrackWell}
              ariaLabel="Create Sidetrack Well"
            >
              Create Sidetrack Well
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleCreateNewWell}
              ariaLabel="Create New Well"
            >
              Create New Well
            </Button>
          </div>
        </div>

        <FilterBar className="mb-6" />

        <WellTable
          onActivate={handleActivate}
          className="mb-6"
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />

        <ActivationModal
          isOpen={isOpen}
          targetWell={targetWell}
          currentActiveWell={currentActiveWell}
          scenario={scenario}
          error={error}
          onConfirm={handleConfirmActivation}
          onClose={closeModal}
        />
      </div>
    </div>
  );
}

export default WellListPage;