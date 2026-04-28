/**
 * React context provider that serves as the WellUIStore.
 * Manages global state for wells, filters, sort, and pagination.
 * Exposes all wellListManager functions and state setters.
 * @module WellContext
 */

import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { seedInitialData } from '../services/wellRepository.js';
import {
  getDisplayWells,
  activateWell,
  updateWell,
  createWell,
  getActiveWellForRig,
} from '../services/wellListManager.js';

/**
 * @typedef {Object} WellFilters
 * @property {string} search - General search term
 * @property {string} status - Filter by status
 * @property {string} type - Filter by well type
 * @property {string} operator - Filter by operator
 * @property {string} contractor - Filter by contractor
 * @property {string} rig - Filter by rig
 */

/**
 * @typedef {Object} WellSort
 * @property {string} field - Field to sort by
 * @property {'asc'|'desc'} direction - Sort direction
 */

/**
 * @typedef {Object} WellPagination
 * @property {number} currentPage - Current page (1-based)
 * @property {number} pageSize - Items per page
 */

const defaultFilters = {
  search: '',
  status: '',
  type: '',
  operator: '',
  contractor: '',
  rig: '',
};

const defaultSort = {
  field: 'spudDate',
  direction: 'desc',
};

const defaultPagination = {
  currentPage: 1,
  pageSize: 10,
};

/**
 * @type {React.Context}
 */
const WellContext = createContext(null);

/**
 * WellProvider component that wraps the app and provides well state management.
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components
 * @returns {React.ReactElement}
 */
export function WellProvider({ children }) {
  const [filters, setFiltersState] = useState({ ...defaultFilters });
  const [sort, setSortState] = useState({ ...defaultSort });
  const [pagination, setPaginationState] = useState({ ...defaultPagination });
  const [wellsData, setWellsData] = useState({
    wells: [],
    totalCount: 0,
    totalPages: 1,
    currentPage: 1,
    pageSize: 10,
  });

  /**
   * Loads wells from the repository using current filters, sort, and pagination.
   * @param {WellFilters} [currentFilters] - Filters to apply
   * @param {WellSort} [currentSort] - Sort to apply
   * @param {WellPagination} [currentPagination] - Pagination to apply
   */
  const loadWells = useCallback((currentFilters, currentSort, currentPagination) => {
    const f = currentFilters || filters;
    const s = currentSort || sort;
    const p = currentPagination || pagination;

    const result = getDisplayWells(
      f,
      s,
      { page: p.currentPage, pageSize: p.pageSize }
    );

    setWellsData({
      wells: result.wells,
      totalCount: result.totalCount,
      totalPages: result.totalPages,
      currentPage: result.currentPage,
      pageSize: result.pageSize,
    });
  }, [filters, sort, pagination]);

  // Seed initial data and load wells on mount
  useEffect(() => {
    seedInitialData();
    loadWells(defaultFilters, defaultSort, defaultPagination);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Sets filters and resets pagination to page 1.
   * @param {Partial<WellFilters>} newFilters - New filter values
   */
  const setFilters = useCallback((newFilters) => {
    setFiltersState((prev) => {
      const updated = { ...prev, ...newFilters };
      const resetPagination = { ...defaultPagination };
      setPaginationState(resetPagination);

      // Use setTimeout to ensure state is batched, then reload
      setTimeout(() => {
        const result = getDisplayWells(
          updated,
          sort,
          { page: resetPagination.currentPage, pageSize: resetPagination.pageSize }
        );
        setWellsData({
          wells: result.wells,
          totalCount: result.totalCount,
          totalPages: result.totalPages,
          currentPage: result.currentPage,
          pageSize: result.pageSize,
        });
      }, 0);

      return updated;
    });
  }, [sort]);

  /**
   * Sets sort configuration.
   * @param {Partial<WellSort>} newSort - New sort values
   */
  const setSort = useCallback((newSort) => {
    setSortState((prev) => {
      const updated = { ...prev, ...newSort };

      setTimeout(() => {
        const result = getDisplayWells(
          filters,
          updated,
          { page: pagination.currentPage, pageSize: pagination.pageSize }
        );
        setWellsData({
          wells: result.wells,
          totalCount: result.totalCount,
          totalPages: result.totalPages,
          currentPage: result.currentPage,
          pageSize: result.pageSize,
        });
      }, 0);

      return updated;
    });
  }, [filters, pagination]);

  /**
   * Sets pagination configuration.
   * @param {Partial<WellPagination>} newPagination - New pagination values
   */
  const setPagination = useCallback((newPagination) => {
    setPaginationState((prev) => {
      const updated = { ...prev, ...newPagination };

      setTimeout(() => {
        const result = getDisplayWells(
          filters,
          sort,
          { page: updated.currentPage, pageSize: updated.pageSize }
        );
        setWellsData({
          wells: result.wells,
          totalCount: result.totalCount,
          totalPages: result.totalPages,
          currentPage: result.currentPage,
          pageSize: result.pageSize,
        });
      }, 0);

      return updated;
    });
  }, [filters, sort]);

  /**
   * Refreshes wells from localStorage using current filters, sort, and pagination.
   */
  const refreshWells = useCallback(() => {
    const result = getDisplayWells(
      filters,
      sort,
      { page: pagination.currentPage, pageSize: pagination.pageSize }
    );
    setWellsData({
      wells: result.wells,
      totalCount: result.totalCount,
      totalPages: result.totalPages,
      currentPage: result.currentPage,
      pageSize: result.pageSize,
    });
  }, [filters, sort, pagination]);

  /**
   * Activates a well and refreshes the list.
   * @param {string} wellId - The id of the well to activate
   * @returns {import('../services/wellListManager.js').ActivationResult}
   */
  const handleActivateWell = useCallback((wellId) => {
    const result = activateWell(wellId);
    if (result.success) {
      refreshWells();
    }
    return result;
  }, [refreshWells]);

  /**
   * Updates a well and refreshes the list.
   * @param {import('../constants/mockData.js').Well} well - The well to update
   * @returns {{ success: boolean, errors: string[] }}
   */
  const handleUpdateWell = useCallback((well) => {
    const result = updateWell(well);
    if (result.success) {
      refreshWells();
    }
    return result;
  }, [refreshWells]);

  /**
   * Creates a new well and refreshes the list.
   * @param {Object} wellData - The well data to create
   * @returns {{ success: boolean, well: import('../constants/mockData.js').Well|null, errors: string[] }}
   */
  const handleCreateWell = useCallback((wellData) => {
    const result = createWell(wellData);
    if (result.success) {
      refreshWells();
    }
    return result;
  }, [refreshWells]);

  /**
   * Gets the active well for a given rig.
   * @param {string} rig - The rig name
   * @returns {import('../constants/mockData.js').Well|null}
   */
  const handleGetActiveWellForRig = useCallback((rig) => {
    return getActiveWellForRig(rig);
  }, []);

  const contextValue = useMemo(() => ({
    wells: wellsData.wells,
    totalCount: wellsData.totalCount,
    totalPages: wellsData.totalPages,
    currentPage: wellsData.currentPage,
    pageSize: wellsData.pageSize,
    filters,
    sort,
    pagination,
    setFilters,
    setSort,
    setPagination,
    refreshWells,
    activateWell: handleActivateWell,
    updateWell: handleUpdateWell,
    createWell: handleCreateWell,
    getActiveWellForRig: handleGetActiveWellForRig,
  }), [
    wellsData,
    filters,
    sort,
    pagination,
    setFilters,
    setSort,
    setPagination,
    refreshWells,
    handleActivateWell,
    handleUpdateWell,
    handleCreateWell,
    handleGetActiveWellForRig,
  ]);

  return (
    <WellContext.Provider value={contextValue}>
      {children}
    </WellContext.Provider>
  );
}

WellProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * Custom hook to access the WellContext.
 * Must be used within a WellProvider.
 * @returns {Object} The well context value
 */
export function useWellContext() {
  const context = useContext(WellContext);
  if (!context) {
    throw new Error('useWellContext must be used within a WellProvider.');
  }
  return context;
}

export { WellContext };
export default WellContext;