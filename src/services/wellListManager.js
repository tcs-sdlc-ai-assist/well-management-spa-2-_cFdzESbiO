/**
 * Business logic layer for well list operations.
 * Provides filtering, sorting, pagination, activation enforcement,
 * and CRUD operations for wells.
 * @module wellListManager
 */

import {
  getAllWells,
  getWellById,
  saveWell,
  setWells,
} from './wellRepository.js';

/**
 * @typedef {Object} WellFilters
 * @property {string} [search] - General search term (matches wellName, wellId, operator, contractor, rig, location)
 * @property {string} [status] - Filter by status ('active', 'inactive', or '' for all)
 * @property {string} [type] - Filter by well type
 * @property {string} [operator] - Filter by operator name
 * @property {string} [contractor] - Filter by contractor name
 * @property {string} [rig] - Filter by rig name
 */

/**
 * @typedef {Object} WellSort
 * @property {string} [field] - Field to sort by (default: 'spudDate')
 * @property {'asc'|'desc'} [direction] - Sort direction (default: 'desc')
 */

/**
 * @typedef {Object} Pagination
 * @property {number} [page] - Current page (1-based, default: 1)
 * @property {number} [pageSize] - Items per page (default: 10)
 */

/**
 * @typedef {Object} DisplayWellsResult
 * @property {import('../constants/mockData.js').Well[]} wells - The paginated wells for display
 * @property {number} totalCount - Total number of wells after filtering
 * @property {number} totalPages - Total number of pages
 * @property {number} currentPage - Current page number (1-based)
 * @property {number} pageSize - Current page size
 */

/**
 * @typedef {Object} ActivationResult
 * @property {boolean} success - Whether the activation succeeded
 * @property {string|null} previousActiveWellId - Id of the previously active well on the same rig, or null
 * @property {string} newActiveWellId - Id of the newly activated well
 * @property {string|null} error - Error message if activation failed
 */

/**
 * Checks if a string value contains the search term (case-insensitive).
 * @param {string} value - The value to search in
 * @param {string} term - The search term
 * @returns {boolean} Whether the value contains the term
 */
function matchesSearch(value, term) {
  if (!value || !term) {
    return false;
  }
  return String(value).toLowerCase().includes(term.toLowerCase());
}

/**
 * Filters wells based on the provided filter criteria.
 * All string matching is case-insensitive and partial.
 * @param {import('../constants/mockData.js').Well[]} wells - Array of wells to filter
 * @param {WellFilters} filters - Filter criteria
 * @returns {import('../constants/mockData.js').Well[]} Filtered wells
 */
function filterWells(wells, filters) {
  if (!filters) {
    return wells;
  }

  return wells.filter((well) => {
    // General search filter
    if (filters.search && filters.search.trim() !== '') {
      const term = filters.search.trim();
      const searchableFields = [
        well.wellName,
        well.wellId,
        well.operator,
        well.contractor,
        well.rig,
        well.location,
        well.type,
      ];
      const matchesAny = searchableFields.some((field) => matchesSearch(field, term));
      if (!matchesAny) {
        return false;
      }
    }

    // Status filter
    if (filters.status && filters.status.trim() !== '') {
      if (well.status !== filters.status.trim().toLowerCase()) {
        return false;
      }
    }

    // Type filter
    if (filters.type && filters.type.trim() !== '') {
      if (!matchesSearch(well.type, filters.type.trim())) {
        return false;
      }
    }

    // Operator filter
    if (filters.operator && filters.operator.trim() !== '') {
      if (!matchesSearch(well.operator, filters.operator.trim())) {
        return false;
      }
    }

    // Contractor filter
    if (filters.contractor && filters.contractor.trim() !== '') {
      if (!matchesSearch(well.contractor, filters.contractor.trim())) {
        return false;
      }
    }

    // Rig filter
    if (filters.rig && filters.rig.trim() !== '') {
      if (!matchesSearch(well.rig, filters.rig.trim())) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Sorts wells by the specified field and direction.
 * @param {import('../constants/mockData.js').Well[]} wells - Array of wells to sort
 * @param {WellSort} sort - Sort configuration
 * @returns {import('../constants/mockData.js').Well[]} Sorted wells (new array)
 */
function sortWells(wells, sort) {
  const field = (sort && sort.field) || 'spudDate';
  const direction = (sort && sort.direction) || 'desc';

  const sorted = [...wells];

  sorted.sort((a, b) => {
    let valA = a[field];
    let valB = b[field];

    // Handle spudDate as date comparison
    if (field === 'spudDate') {
      valA = valA ? new Date(valA).getTime() : 0;
      valB = valB ? new Date(valB).getTime() : 0;
    }

    // Handle depth as numeric comparison
    if (field === 'depth') {
      valA = typeof valA === 'number' ? valA : 0;
      valB = typeof valB === 'number' ? valB : 0;
    }

    // Handle string comparison
    if (typeof valA === 'string' && typeof valB === 'string') {
      valA = valA.toLowerCase();
      valB = valB.toLowerCase();
    }

    if (valA < valB) {
      return direction === 'asc' ? -1 : 1;
    }
    if (valA > valB) {
      return direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  return sorted;
}

/**
 * Pins active wells to the top of the list while preserving relative order.
 * @param {import('../constants/mockData.js').Well[]} wells - Array of wells
 * @returns {import('../constants/mockData.js').Well[]} Wells with active wells pinned to top
 */
function pinActiveWells(wells) {
  const activeWells = wells.filter((w) => w.status === 'active');
  const inactiveWells = wells.filter((w) => w.status !== 'active');
  return [...activeWells, ...inactiveWells];
}

/**
 * Paginates an array of wells.
 * @param {import('../constants/mockData.js').Well[]} wells - Array of wells to paginate
 * @param {Pagination} pagination - Pagination configuration
 * @returns {{ wells: import('../constants/mockData.js').Well[], totalCount: number, totalPages: number, currentPage: number, pageSize: number }}
 */
function paginateWells(wells, pagination) {
  const pageSize = (pagination && pagination.pageSize > 0) ? pagination.pageSize : 10;
  const totalCount = wells.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  let currentPage = (pagination && pagination.page > 0) ? pagination.page : 1;
  // Clamp page to valid range
  if (currentPage > totalPages) {
    currentPage = totalPages;
  }

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedWells = wells.slice(startIndex, endIndex);

  return {
    wells: paginatedWells,
    totalCount,
    totalPages,
    currentPage,
    pageSize,
  };
}

/**
 * Generates a unique id for a new well.
 * @returns {string} A unique id string
 */
function generateId() {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 9);
  return `${timestamp}-${random}`;
}

/**
 * Validates required well fields.
 * @param {Object} well - The well object to validate
 * @returns {{ valid: boolean, errors: string[] }} Validation result
 */
function validateWell(well) {
  const errors = [];

  if (!well) {
    return { valid: false, errors: ['Well data is required.'] };
  }

  if (!well.wellName || typeof well.wellName !== 'string' || well.wellName.trim() === '') {
    errors.push('Well name is required.');
  }

  if (!well.rig || typeof well.rig !== 'string' || well.rig.trim() === '') {
    errors.push('Rig is required.');
  }

  if (!well.operator || typeof well.operator !== 'string' || well.operator.trim() === '') {
    errors.push('Operator is required.');
  }

  if (!well.contractor || typeof well.contractor !== 'string' || well.contractor.trim() === '') {
    errors.push('Contractor is required.');
  }

  if (!well.spudDate || typeof well.spudDate !== 'string' || well.spudDate.trim() === '') {
    errors.push('Spud date is required.');
  } else {
    const date = new Date(well.spudDate);
    if (isNaN(date.getTime())) {
      errors.push('Spud date must be a valid date.');
    }
  }

  if (well.status !== undefined && well.status !== 'active' && well.status !== 'inactive') {
    errors.push('Status must be "active" or "inactive".');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Returns the display wells after applying filters, sorting, active well pinning, and pagination.
 * @param {WellFilters} [filters={}] - Filter criteria
 * @param {WellSort} [sort={}] - Sort configuration
 * @param {Pagination} [pagination={}] - Pagination configuration
 * @returns {DisplayWellsResult} The paginated, filtered, sorted wells with metadata
 */
export function getDisplayWells(filters = {}, sort = {}, pagination = {}) {
  const allWells = getAllWells();
  const filtered = filterWells(allWells, filters);
  const sorted = sortWells(filtered, sort);
  const pinned = pinActiveWells(sorted);
  const result = paginateWells(pinned, pagination);

  return result;
}

/**
 * Activates a well, enforcing the one-active-per-rig rule.
 * If another well on the same rig is currently active, it is demoted to 'inactive'.
 * @param {string} wellId - The id of the well to activate
 * @returns {ActivationResult} The result of the activation operation
 */
export function activateWell(wellId) {
  try {
    const well = getWellById(wellId);
    if (!well) {
      return {
        success: false,
        previousActiveWellId: null,
        newActiveWellId: wellId,
        error: `Well with id "${wellId}" not found.`,
      };
    }

    // If already active, no-op
    if (well.status === 'active') {
      return {
        success: true,
        previousActiveWellId: wellId,
        newActiveWellId: wellId,
        error: null,
      };
    }

    // Find current active well for the same rig
    const currentActive = getActiveWellForRig(well.rig);
    let previousActiveWellId = null;

    if (currentActive) {
      previousActiveWellId = currentActive.id;
      currentActive.status = 'inactive';
      const demoteSuccess = saveWell(currentActive);
      if (!demoteSuccess) {
        return {
          success: false,
          previousActiveWellId: currentActive.id,
          newActiveWellId: wellId,
          error: 'Failed to demote the currently active well.',
        };
      }
    }

    // Activate the target well
    well.status = 'active';
    const activateSuccess = saveWell(well);
    if (!activateSuccess) {
      return {
        success: false,
        previousActiveWellId,
        newActiveWellId: wellId,
        error: 'Failed to activate the well.',
      };
    }

    return {
      success: true,
      previousActiveWellId,
      newActiveWellId: wellId,
      error: null,
    };
  } catch (err) {
    console.error('[WellListManager] activateWell error:', err);
    return {
      success: false,
      previousActiveWellId: null,
      newActiveWellId: wellId,
      error: 'An unexpected error occurred during activation.',
    };
  }
}

/**
 * Validates and persists updates to an existing well.
 * @param {import('../constants/mockData.js').Well} well - The well object with updated fields
 * @returns {{ success: boolean, errors: string[] }} Result of the update operation
 */
export function updateWell(well) {
  if (!well || !well.id) {
    return { success: false, errors: ['Well id is required for updates.'] };
  }

  const existing = getWellById(well.id);
  if (!existing) {
    return { success: false, errors: [`Well with id "${well.id}" not found.`] };
  }

  const merged = { ...existing, ...well };
  const validation = validateWell(merged);
  if (!validation.valid) {
    return { success: false, errors: validation.errors };
  }

  const success = saveWell(merged);
  if (!success) {
    return { success: false, errors: ['Failed to save well to storage.'] };
  }

  return { success: true, errors: [] };
}

/**
 * Generates an id, validates, and persists a new well.
 * New wells default to 'inactive' status.
 * @param {Object} wellData - The well data (without id)
 * @returns {{ success: boolean, well: import('../constants/mockData.js').Well|null, errors: string[] }} Result of the create operation
 */
export function createWell(wellData) {
  if (!wellData) {
    return { success: false, well: null, errors: ['Well data is required.'] };
  }

  const newWell = {
    ...wellData,
    id: wellData.id || generateId(),
    status: wellData.status || 'inactive',
  };

  const validation = validateWell(newWell);
  if (!validation.valid) {
    return { success: false, well: null, errors: validation.errors };
  }

  const success = saveWell(newWell);
  if (!success) {
    return { success: false, well: null, errors: ['Failed to save well to storage.'] };
  }

  return { success: true, well: newWell, errors: [] };
}

/**
 * Returns the currently active well for a given rig.
 * @param {string} rig - The rig name/identifier
 * @returns {import('../constants/mockData.js').Well|null} The active well for the rig, or null
 */
export function getActiveWellForRig(rig) {
  if (!rig) {
    return null;
  }
  const allWells = getAllWells();
  return allWells.find(
    (well) => well.rig === rig && well.status === 'active'
  ) || null;
}

export default {
  getDisplayWells,
  activateWell,
  updateWell,
  createWell,
  getActiveWellForRig,
};