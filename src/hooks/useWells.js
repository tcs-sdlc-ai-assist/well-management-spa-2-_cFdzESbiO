/**
 * Custom hook that consumes WellContext and returns all well state and actions.
 * Provides a convenient API for components to access well management functionality.
 * @module useWells
 */

import { useWellContext } from '../context/WellContext.jsx';

/**
 * Custom hook that consumes WellContext and returns all well state and actions.
 * Provides a convenient API for components: wells, filters, sort, pagination,
 * setFilters, setSort, setPagination, activateWell, updateWell, createWell,
 * refreshWells, getActiveWellForRig.
 *
 * @throws {Error} If used outside of a WellProvider
 * @returns {{
 *   wells: import('../constants/mockData.js').Well[],
 *   totalCount: number,
 *   totalPages: number,
 *   currentPage: number,
 *   pageSize: number,
 *   filters: import('../context/WellContext.jsx').WellFilters,
 *   sort: import('../context/WellContext.jsx').WellSort,
 *   pagination: import('../context/WellContext.jsx').WellPagination,
 *   setFilters: (newFilters: Partial<import('../context/WellContext.jsx').WellFilters>) => void,
 *   setSort: (newSort: Partial<import('../context/WellContext.jsx').WellSort>) => void,
 *   setPagination: (newPagination: Partial<import('../context/WellContext.jsx').WellPagination>) => void,
 *   activateWell: (wellId: string) => import('../services/wellListManager.js').ActivationResult,
 *   updateWell: (well: import('../constants/mockData.js').Well) => { success: boolean, errors: string[] },
 *   createWell: (wellData: Object) => { success: boolean, well: import('../constants/mockData.js').Well|null, errors: string[] },
 *   refreshWells: () => void,
 *   getActiveWellForRig: (rig: string) => import('../constants/mockData.js').Well|null,
 * }} Well state and actions
 */
export function useWells() {
  const context = useWellContext();
  return context;
}

export default useWells;