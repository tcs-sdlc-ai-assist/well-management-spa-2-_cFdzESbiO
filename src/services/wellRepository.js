/**
 * LocalStorage data access layer for well management.
 * Provides CRUD operations with JSON serialization/deserialization
 * and error handling for corrupt data (auto-reset to mock data).
 * @module wellRepository
 */

import { mockWells } from '../constants/mockData.js';

const STORAGE_KEY = 'wells';
const VERSION_KEY = 'wells_version';
const CURRENT_VERSION = '1';
const MAX_RETRIES = 3;

/**
 * Attempts to write to localStorage with retry logic.
 * @param {string} key - localStorage key
 * @param {string} value - serialized value to store
 * @param {number} [retries=MAX_RETRIES] - number of retry attempts
 * @returns {boolean} whether the write succeeded
 */
function writeWithRetry(key, value, retries = MAX_RETRIES) {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (err) {
      console.error(
        `[WellRepository] localStorage write failed (attempt ${attempt + 1}/${retries}):`,
        err
      );
      if (attempt === retries - 1) {
        return false;
      }
    }
  }
  return false;
}

/**
 * Reads and parses the wells array from localStorage.
 * If data is corrupt or missing, resets to mock data.
 * @returns {import('../constants/mockData.js').Well[]} Array of well objects
 */
export function getAllWells() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) {
      seedInitialData(mockWells);
      return [...mockWells];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      console.warn('[WellRepository] Corrupt data detected (not an array). Resetting to mock data.');
      seedInitialData(mockWells, true);
      return [...mockWells];
    }
    return parsed;
  } catch (err) {
    console.error('[WellRepository] Failed to read wells from localStorage:', err);
    seedInitialData(mockWells, true);
    return [...mockWells];
  }
}

/**
 * Finds a well by its unique id.
 * @param {string} id - The well id to search for
 * @returns {import('../constants/mockData.js').Well | null} The well object or null if not found
 */
export function getWellById(id) {
  const wells = getAllWells();
  return wells.find((well) => well.id === id) || null;
}

/**
 * Creates or updates a well in localStorage.
 * If a well with the same id exists, it is replaced; otherwise, the well is appended.
 * @param {import('../constants/mockData.js').Well} well - The well object to save
 * @returns {boolean} whether the save succeeded
 */
export function saveWell(well) {
  const wells = getAllWells();
  const index = wells.findIndex((w) => w.id === well.id);
  if (index !== -1) {
    wells[index] = { ...well };
  } else {
    wells.push({ ...well });
  }
  const serialized = JSON.stringify(wells);
  const success = writeWithRetry(STORAGE_KEY, serialized);
  if (!success) {
    console.error('[WellRepository] Failed to save well after retries.');
  }
  return success;
}

/**
 * Removes a well by id from localStorage.
 * @param {string} id - The well id to delete
 * @returns {boolean} whether the delete succeeded
 */
export function deleteWell(id) {
  const wells = getAllWells();
  const filtered = wells.filter((well) => well.id !== id);
  const serialized = JSON.stringify(filtered);
  const success = writeWithRetry(STORAGE_KEY, serialized);
  if (!success) {
    console.error('[WellRepository] Failed to delete well after retries.');
  }
  return success;
}

/**
 * Replaces the entire wells array in localStorage.
 * @param {import('../constants/mockData.js').Well[]} wells - The new wells array
 * @returns {boolean} whether the operation succeeded
 */
export function setWells(wells) {
  if (!Array.isArray(wells)) {
    console.error('[WellRepository] setWells called with non-array argument.');
    return false;
  }
  const serialized = JSON.stringify(wells);
  const success = writeWithRetry(STORAGE_KEY, serialized);
  if (!success) {
    console.error('[WellRepository] Failed to set wells after retries.');
  }
  return success;
}

/**
 * Seeds localStorage with mock data if no wells key exists.
 * If force is true, overwrites existing data.
 * @param {import('../constants/mockData.js').Well[]} [data=mockWells] - The data to seed
 * @param {boolean} [force=false] - Whether to overwrite existing data
 * @returns {boolean} whether seeding occurred and succeeded
 */
export function seedInitialData(data = mockWells, force = false) {
  try {
    const existing = localStorage.getItem(STORAGE_KEY);
    if (existing !== null && !force) {
      return false;
    }
    const serialized = JSON.stringify(data);
    const success = writeWithRetry(STORAGE_KEY, serialized);
    if (success) {
      writeWithRetry(VERSION_KEY, CURRENT_VERSION);
    }
    return success;
  } catch (err) {
    console.error('[WellRepository] Failed to seed initial data:', err);
    return false;
  }
}

export default {
  getAllWells,
  getWellById,
  saveWell,
  deleteWell,
  setWells,
  seedInitialData,
};