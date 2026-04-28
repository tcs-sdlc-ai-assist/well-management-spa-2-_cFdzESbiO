import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getAllWells,
  getWellById,
  saveWell,
  deleteWell,
  setWells,
  seedInitialData,
} from './wellRepository.js';
import { mockWells } from '../constants/mockData.js';

describe('wellRepository', () => {
  let getItemSpy;
  let setItemSpy;
  let storage;

  beforeEach(() => {
    storage = {};

    getItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      return storage[key] !== undefined ? storage[key] : null;
    });

    setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation((key, value) => {
      storage[key] = value;
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('seedInitialData', () => {
    it('populates localStorage with mock data on first load when no data exists', () => {
      const result = seedInitialData();

      expect(result).toBe(true);
      expect(setItemSpy).toHaveBeenCalledWith('wells', JSON.stringify(mockWells));
      expect(setItemSpy).toHaveBeenCalledWith('wells_version', '1');
    });

    it('does not overwrite existing data when force is false', () => {
      storage['wells'] = JSON.stringify([{ id: 'existing' }]);

      const result = seedInitialData();

      expect(result).toBe(false);
      expect(storage['wells']).toBe(JSON.stringify([{ id: 'existing' }]));
    });

    it('overwrites existing data when force is true', () => {
      storage['wells'] = JSON.stringify([{ id: 'existing' }]);

      const result = seedInitialData(mockWells, true);

      expect(result).toBe(true);
      expect(storage['wells']).toBe(JSON.stringify(mockWells));
    });

    it('seeds with custom data when provided', () => {
      const customData = [{ id: 'custom-1', wellName: 'Custom Well' }];

      const result = seedInitialData(customData);

      expect(result).toBe(true);
      expect(storage['wells']).toBe(JSON.stringify(customData));
    });
  });

  describe('getAllWells', () => {
    it('returns parsed array of wells from localStorage', () => {
      const wells = [
        { id: '1', wellName: 'Well A' },
        { id: '2', wellName: 'Well B' },
      ];
      storage['wells'] = JSON.stringify(wells);

      const result = getAllWells();

      expect(result).toEqual(wells);
    });

    it('seeds and returns mock data when localStorage is empty', () => {
      const result = getAllWells();

      expect(result).toEqual(mockWells);
      expect(storage['wells']).toBe(JSON.stringify(mockWells));
    });

    it('returns a new array reference (not the same object)', () => {
      storage['wells'] = JSON.stringify(mockWells);

      const result1 = getAllWells();
      const result2 = getAllWells();

      expect(result1).not.toBe(result2);
      expect(result1).toEqual(result2);
    });
  });

  describe('getWellById', () => {
    it('returns the correct well when found', () => {
      storage['wells'] = JSON.stringify(mockWells);

      const result = getWellById('1');

      expect(result).not.toBeNull();
      expect(result.id).toBe('1');
      expect(result.wellName).toBe('Thunder Horse #1');
    });

    it('returns null when well is not found', () => {
      storage['wells'] = JSON.stringify(mockWells);

      const result = getWellById('nonexistent-id');

      expect(result).toBeNull();
    });

    it('returns null when called with undefined', () => {
      storage['wells'] = JSON.stringify(mockWells);

      const result = getWellById(undefined);

      expect(result).toBeNull();
    });
  });

  describe('saveWell', () => {
    it('creates a new well when id does not exist', () => {
      storage['wells'] = JSON.stringify([]);

      const newWell = { id: 'new-1', wellName: 'New Well', rig: 'Rig 99' };
      const result = saveWell(newWell);

      expect(result).toBe(true);

      const stored = JSON.parse(storage['wells']);
      expect(stored).toHaveLength(1);
      expect(stored[0].id).toBe('new-1');
      expect(stored[0].wellName).toBe('New Well');
    });

    it('updates an existing well when id matches', () => {
      const initialWells = [
        { id: '1', wellName: 'Original Name', rig: 'Rig 1' },
      ];
      storage['wells'] = JSON.stringify(initialWells);

      const updatedWell = { id: '1', wellName: 'Updated Name', rig: 'Rig 1' };
      const result = saveWell(updatedWell);

      expect(result).toBe(true);

      const stored = JSON.parse(storage['wells']);
      expect(stored).toHaveLength(1);
      expect(stored[0].wellName).toBe('Updated Name');
    });

    it('does not duplicate wells on update', () => {
      storage['wells'] = JSON.stringify(mockWells);
      const originalLength = mockWells.length;

      const updatedWell = { ...mockWells[0], wellName: 'Modified Name' };
      saveWell(updatedWell);

      const stored = JSON.parse(storage['wells']);
      expect(stored).toHaveLength(originalLength);
    });

    it('returns false when localStorage write fails', () => {
      storage['wells'] = JSON.stringify([]);
      setItemSpy.mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });

      const newWell = { id: 'fail-1', wellName: 'Fail Well' };
      const result = saveWell(newWell);

      expect(result).toBe(false);
    });
  });

  describe('deleteWell', () => {
    it('removes the well with the given id', () => {
      const wells = [
        { id: '1', wellName: 'Well A' },
        { id: '2', wellName: 'Well B' },
        { id: '3', wellName: 'Well C' },
      ];
      storage['wells'] = JSON.stringify(wells);

      const result = deleteWell('2');

      expect(result).toBe(true);

      const stored = JSON.parse(storage['wells']);
      expect(stored).toHaveLength(2);
      expect(stored.find((w) => w.id === '2')).toBeUndefined();
    });

    it('does not modify array when id does not exist', () => {
      const wells = [
        { id: '1', wellName: 'Well A' },
      ];
      storage['wells'] = JSON.stringify(wells);

      const result = deleteWell('nonexistent');

      expect(result).toBe(true);

      const stored = JSON.parse(storage['wells']);
      expect(stored).toHaveLength(1);
    });

    it('returns false when localStorage write fails', () => {
      storage['wells'] = JSON.stringify([{ id: '1' }]);

      setItemSpy.mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });

      const result = deleteWell('1');

      expect(result).toBe(false);
    });
  });

  describe('setWells', () => {
    it('replaces the entire wells array in localStorage', () => {
      storage['wells'] = JSON.stringify(mockWells);

      const newWells = [
        { id: 'a', wellName: 'Alpha' },
        { id: 'b', wellName: 'Beta' },
      ];

      const result = setWells(newWells);

      expect(result).toBe(true);

      const stored = JSON.parse(storage['wells']);
      expect(stored).toEqual(newWells);
      expect(stored).toHaveLength(2);
    });

    it('returns false when called with non-array argument', () => {
      const result = setWells('not an array');

      expect(result).toBe(false);
    });

    it('can set an empty array', () => {
      storage['wells'] = JSON.stringify(mockWells);

      const result = setWells([]);

      expect(result).toBe(true);

      const stored = JSON.parse(storage['wells']);
      expect(stored).toEqual([]);
    });
  });

  describe('corrupt data handling', () => {
    it('resets to mock data when localStorage contains invalid JSON', () => {
      storage['wells'] = '{not valid json!!!';

      const result = getAllWells();

      expect(result).toEqual(mockWells);
      expect(storage['wells']).toBe(JSON.stringify(mockWells));
    });

    it('resets to mock data when localStorage contains a non-array value', () => {
      storage['wells'] = JSON.stringify({ notAnArray: true });

      const result = getAllWells();

      expect(result).toEqual(mockWells);
      expect(storage['wells']).toBe(JSON.stringify(mockWells));
    });

    it('resets to mock data when localStorage contains a string value', () => {
      storage['wells'] = JSON.stringify('just a string');

      const result = getAllWells();

      expect(result).toEqual(mockWells);
      expect(storage['wells']).toBe(JSON.stringify(mockWells));
    });

    it('resets to mock data when localStorage contains a number', () => {
      storage['wells'] = JSON.stringify(42);

      const result = getAllWells();

      expect(result).toEqual(mockWells);
      expect(storage['wells']).toBe(JSON.stringify(mockWells));
    });

    it('resets to mock data when getItem throws an error', () => {
      getItemSpy.mockImplementation((key) => {
        if (key === 'wells') {
          throw new Error('SecurityError');
        }
        return null;
      });

      const result = getAllWells();

      expect(result).toEqual(mockWells);
    });
  });
});