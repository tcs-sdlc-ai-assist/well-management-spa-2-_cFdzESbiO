import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getDisplayWells,
  activateWell,
  updateWell,
  createWell,
  getActiveWellForRig,
} from './wellListManager.js';
import * as wellRepository from './wellRepository.js';

vi.mock('./wellRepository.js', () => ({
  getAllWells: vi.fn(),
  getWellById: vi.fn(),
  saveWell: vi.fn(),
  setWells: vi.fn(),
  deleteWell: vi.fn(),
  seedInitialData: vi.fn(),
  default: {
    getAllWells: vi.fn(),
    getWellById: vi.fn(),
    saveWell: vi.fn(),
    setWells: vi.fn(),
    deleteWell: vi.fn(),
    seedInitialData: vi.fn(),
  },
}));

const mockWellsData = [
  {
    id: '1',
    rig: 'Rig 1',
    wellName: 'Thunder Horse #1',
    wellId: 'WL-1001',
    operator: 'DeepSea Energy',
    contractor: 'Atlas Drilling Co.',
    spudDate: '2024-01-15',
    status: 'active',
    type: 'Exploration',
    depth: 12500,
    location: 'Gulf of Mexico, Block 42',
  },
  {
    id: '2',
    rig: 'Rig 3',
    wellName: 'Permian Basin #7',
    wellId: 'WL-1002',
    operator: 'Frontier Oil & Gas',
    contractor: 'Summit Drilling Inc.',
    spudDate: '2024-02-20',
    status: 'active',
    type: 'Development',
    depth: 9800,
    location: 'Permian Basin, West Texas',
  },
  {
    id: '3',
    rig: 'Rig 5',
    wellName: 'Eagle Ford South #3',
    wellId: 'WL-1003',
    operator: 'Lone Star Petroleum',
    contractor: 'Atlas Drilling Co.',
    spudDate: '2023-11-05',
    status: 'inactive',
    type: 'Appraisal',
    depth: 11200,
    location: 'Eagle Ford Shale, South Texas',
  },
  {
    id: '4',
    rig: 'Rig 1',
    wellName: 'Bakken North #12',
    wellId: 'WL-1004',
    operator: 'Northern Plains Energy',
    contractor: 'Pinnacle Drilling LLC',
    spudDate: '2024-03-10',
    status: 'inactive',
    type: 'Exploration',
    depth: 10500,
    location: 'Bakken Formation, North Dakota',
  },
  {
    id: '5',
    rig: 'Rig 7',
    wellName: 'Marcellus Deep #5',
    wellId: 'WL-1005',
    operator: 'Appalachian Gas Corp.',
    contractor: 'Summit Drilling Inc.',
    spudDate: '2024-01-28',
    status: 'inactive',
    type: 'Development',
    depth: 8700,
    location: 'Marcellus Shale, Pennsylvania',
  },
];

describe('wellListManager', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    wellRepository.getAllWells.mockReturnValue([...mockWellsData.map((w) => ({ ...w }))]);
    wellRepository.saveWell.mockReturnValue(true);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getDisplayWells', () => {
    it('returns all wells with default filters, sort, and pagination', () => {
      const result = getDisplayWells({}, {}, { page: 1, pageSize: 10 });

      expect(result.wells).toHaveLength(5);
      expect(result.totalCount).toBe(5);
      expect(result.totalPages).toBe(1);
      expect(result.currentPage).toBe(1);
      expect(result.pageSize).toBe(10);
    });

    it('filters by search term case-insensitively with partial match', () => {
      const result = getDisplayWells(
        { search: 'thunder' },
        {},
        { page: 1, pageSize: 10 }
      );

      expect(result.wells).toHaveLength(1);
      expect(result.wells[0].wellName).toBe('Thunder Horse #1');
    });

    it('filters by search term matching wellId', () => {
      const result = getDisplayWells(
        { search: 'WL-1003' },
        {},
        { page: 1, pageSize: 10 }
      );

      expect(result.wells).toHaveLength(1);
      expect(result.wells[0].id).toBe('3');
    });

    it('filters by rig with case-insensitive partial match', () => {
      const result = getDisplayWells(
        { rig: 'rig 1' },
        {},
        { page: 1, pageSize: 10 }
      );

      expect(result.wells).toHaveLength(2);
      expect(result.wells.every((w) => w.rig === 'Rig 1')).toBe(true);
    });

    it('filters by operator with partial match', () => {
      const result = getDisplayWells(
        { operator: 'frontier' },
        {},
        { page: 1, pageSize: 10 }
      );

      expect(result.wells).toHaveLength(1);
      expect(result.wells[0].operator).toBe('Frontier Oil & Gas');
    });

    it('filters by contractor with partial match', () => {
      const result = getDisplayWells(
        { contractor: 'atlas' },
        {},
        { page: 1, pageSize: 10 }
      );

      expect(result.wells).toHaveLength(2);
      expect(result.wells.every((w) => w.contractor === 'Atlas Drilling Co.')).toBe(true);
    });

    it('filters by status', () => {
      const result = getDisplayWells(
        { status: 'inactive' },
        {},
        { page: 1, pageSize: 10 }
      );

      expect(result.wells).toHaveLength(3);
      expect(result.wells.every((w) => w.status === 'inactive')).toBe(true);
    });

    it('filters by type with partial match', () => {
      const result = getDisplayWells(
        { type: 'explor' },
        {},
        { page: 1, pageSize: 10 }
      );

      expect(result.wells).toHaveLength(2);
      expect(result.wells.every((w) => w.type === 'Exploration')).toBe(true);
    });

    it('combines multiple filters', () => {
      const result = getDisplayWells(
        { contractor: 'atlas', status: 'inactive' },
        {},
        { page: 1, pageSize: 10 }
      );

      expect(result.wells).toHaveLength(1);
      expect(result.wells[0].id).toBe('3');
    });

    it('returns empty results when no wells match filters', () => {
      const result = getDisplayWells(
        { search: 'nonexistent well xyz' },
        {},
        { page: 1, pageSize: 10 }
      );

      expect(result.wells).toHaveLength(0);
      expect(result.totalCount).toBe(0);
      expect(result.totalPages).toBe(1);
    });

    it('sorts by spudDate descending by default', () => {
      const result = getDisplayWells(
        { status: 'inactive' },
        { field: 'spudDate', direction: 'desc' },
        { page: 1, pageSize: 10 }
      );

      const dates = result.wells.map((w) => w.spudDate);
      for (let i = 0; i < dates.length - 1; i++) {
        expect(new Date(dates[i]).getTime()).toBeGreaterThanOrEqual(
          new Date(dates[i + 1]).getTime()
        );
      }
    });

    it('sorts by spudDate ascending', () => {
      const result = getDisplayWells(
        { status: 'inactive' },
        { field: 'spudDate', direction: 'asc' },
        { page: 1, pageSize: 10 }
      );

      const dates = result.wells.map((w) => w.spudDate);
      for (let i = 0; i < dates.length - 1; i++) {
        expect(new Date(dates[i]).getTime()).toBeLessThanOrEqual(
          new Date(dates[i + 1]).getTime()
        );
      }
    });

    it('pins active wells to the top of the list', () => {
      const result = getDisplayWells({}, {}, { page: 1, pageSize: 10 });

      const activeWells = result.wells.filter((w) => w.status === 'active');
      const inactiveWells = result.wells.filter((w) => w.status !== 'active');

      expect(activeWells.length).toBeGreaterThan(0);
      expect(inactiveWells.length).toBeGreaterThan(0);

      const lastActiveIndex = result.wells.findLastIndex((w) => w.status === 'active');
      const firstInactiveIndex = result.wells.findIndex((w) => w.status !== 'active');

      if (lastActiveIndex !== -1 && firstInactiveIndex !== -1) {
        expect(lastActiveIndex).toBeLessThan(firstInactiveIndex);
      }
    });

    it('paginates results correctly with page 1', () => {
      const result = getDisplayWells({}, {}, { page: 1, pageSize: 2 });

      expect(result.wells).toHaveLength(2);
      expect(result.totalCount).toBe(5);
      expect(result.totalPages).toBe(3);
      expect(result.currentPage).toBe(1);
      expect(result.pageSize).toBe(2);
    });

    it('paginates results correctly with page 2', () => {
      const result = getDisplayWells({}, {}, { page: 2, pageSize: 2 });

      expect(result.wells).toHaveLength(2);
      expect(result.currentPage).toBe(2);
    });

    it('paginates results correctly with last page having fewer items', () => {
      const result = getDisplayWells({}, {}, { page: 3, pageSize: 2 });

      expect(result.wells).toHaveLength(1);
      expect(result.currentPage).toBe(3);
    });

    it('clamps page to valid range when page exceeds total pages', () => {
      const result = getDisplayWells({}, {}, { page: 100, pageSize: 2 });

      expect(result.currentPage).toBe(3);
      expect(result.wells).toHaveLength(1);
    });

    it('defaults to page 1 and pageSize 10 when pagination is empty', () => {
      const result = getDisplayWells({}, {}, {});

      expect(result.currentPage).toBe(1);
      expect(result.pageSize).toBe(10);
    });

    it('handles empty wells array', () => {
      wellRepository.getAllWells.mockReturnValue([]);

      const result = getDisplayWells({}, {}, { page: 1, pageSize: 10 });

      expect(result.wells).toHaveLength(0);
      expect(result.totalCount).toBe(0);
      expect(result.totalPages).toBe(1);
    });
  });

  describe('activateWell', () => {
    it('activates an inactive well successfully', () => {
      const targetWell = { ...mockWellsData[2], status: 'inactive' };
      wellRepository.getWellById.mockReturnValue(targetWell);

      const result = activateWell('3');

      expect(result.success).toBe(true);
      expect(result.newActiveWellId).toBe('3');
      expect(result.error).toBeNull();
      expect(wellRepository.saveWell).toHaveBeenCalledWith(
        expect.objectContaining({ id: '3', status: 'active' })
      );
    });

    it('returns success when well is already active (no-op)', () => {
      const targetWell = { ...mockWellsData[0], status: 'active' };
      wellRepository.getWellById.mockReturnValue(targetWell);

      const result = activateWell('1');

      expect(result.success).toBe(true);
      expect(result.previousActiveWellId).toBe('1');
      expect(result.newActiveWellId).toBe('1');
      expect(result.error).toBeNull();
      expect(wellRepository.saveWell).not.toHaveBeenCalled();
    });

    it('enforces one-active-per-rig by demoting the current active well', () => {
      const targetWell = { ...mockWellsData[3], status: 'inactive' };
      const currentActiveWell = { ...mockWellsData[0], status: 'active' };

      wellRepository.getWellById.mockReturnValue(targetWell);
      wellRepository.getAllWells.mockReturnValue([
        currentActiveWell,
        { ...mockWellsData[1] },
        { ...mockWellsData[2] },
        targetWell,
        { ...mockWellsData[4] },
      ]);

      const result = activateWell('4');

      expect(result.success).toBe(true);
      expect(result.previousActiveWellId).toBe('1');
      expect(result.newActiveWellId).toBe('4');
      expect(result.error).toBeNull();

      expect(wellRepository.saveWell).toHaveBeenCalledTimes(2);
      expect(wellRepository.saveWell).toHaveBeenCalledWith(
        expect.objectContaining({ id: '1', status: 'inactive' })
      );
      expect(wellRepository.saveWell).toHaveBeenCalledWith(
        expect.objectContaining({ id: '4', status: 'active' })
      );
    });

    it('returns error when well is not found', () => {
      wellRepository.getWellById.mockReturnValue(null);

      const result = activateWell('nonexistent');

      expect(result.success).toBe(false);
      expect(result.error).toContain('not found');
      expect(wellRepository.saveWell).not.toHaveBeenCalled();
    });

    it('activates well on a rig with no current active well (first-activation)', () => {
      const targetWell = { ...mockWellsData[4], status: 'inactive' };
      wellRepository.getWellById.mockReturnValue(targetWell);
      wellRepository.getAllWells.mockReturnValue([
        { ...mockWellsData[0] },
        { ...mockWellsData[1] },
        { ...mockWellsData[2] },
        { ...mockWellsData[3] },
        targetWell,
      ].map((w) => {
        if (w.rig === 'Rig 7') {
          return { ...w, status: 'inactive' };
        }
        return w;
      }));

      const result = activateWell('5');

      expect(result.success).toBe(true);
      expect(result.previousActiveWellId).toBeNull();
      expect(result.newActiveWellId).toBe('5');
      expect(wellRepository.saveWell).toHaveBeenCalledTimes(1);
      expect(wellRepository.saveWell).toHaveBeenCalledWith(
        expect.objectContaining({ id: '5', status: 'active' })
      );
    });

    it('returns error when demoting the current active well fails', () => {
      const targetWell = { ...mockWellsData[3], status: 'inactive' };
      const currentActiveWell = { ...mockWellsData[0], status: 'active' };

      wellRepository.getWellById.mockReturnValue(targetWell);
      wellRepository.getAllWells.mockReturnValue([
        currentActiveWell,
        { ...mockWellsData[1] },
        { ...mockWellsData[2] },
        targetWell,
        { ...mockWellsData[4] },
      ]);
      wellRepository.saveWell.mockReturnValueOnce(false);

      const result = activateWell('4');

      expect(result.success).toBe(false);
      expect(result.error).toContain('demote');
    });

    it('returns error when saving the activated well fails', () => {
      const targetWell = { ...mockWellsData[4], status: 'inactive' };
      wellRepository.getWellById.mockReturnValue(targetWell);
      wellRepository.getAllWells.mockReturnValue(
        mockWellsData.map((w) => {
          if (w.rig === 'Rig 7') {
            return { ...w, status: 'inactive' };
          }
          return { ...w };
        })
      );
      wellRepository.saveWell.mockReturnValue(false);

      const result = activateWell('5');

      expect(result.success).toBe(false);
      expect(result.error).toContain('Failed to activate');
    });
  });

  describe('updateWell', () => {
    it('updates an existing well successfully', () => {
      const existingWell = { ...mockWellsData[0] };
      wellRepository.getWellById.mockReturnValue(existingWell);

      const updatedData = {
        id: '1',
        rig: 'Rig 1',
        wellName: 'Updated Thunder Horse',
        wellId: 'WL-1001',
        operator: 'DeepSea Energy',
        contractor: 'Atlas Drilling Co.',
        spudDate: '2024-01-15',
        status: 'active',
      };

      const result = updateWell(updatedData);

      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(wellRepository.saveWell).toHaveBeenCalledWith(
        expect.objectContaining({ wellName: 'Updated Thunder Horse' })
      );
    });

    it('returns error when well id is missing', () => {
      const result = updateWell({ wellName: 'No ID' });

      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(wellRepository.saveWell).not.toHaveBeenCalled();
    });

    it('returns error when well is not found', () => {
      wellRepository.getWellById.mockReturnValue(null);

      const result = updateWell({ id: 'nonexistent', wellName: 'Test' });

      expect(result.success).toBe(false);
      expect(result.errors[0]).toContain('not found');
      expect(wellRepository.saveWell).not.toHaveBeenCalled();
    });

    it('returns error when well data is null', () => {
      const result = updateWell(null);

      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('returns validation errors for invalid data', () => {
      const existingWell = { ...mockWellsData[0] };
      wellRepository.getWellById.mockReturnValue(existingWell);

      const result = updateWell({
        id: '1',
        rig: '',
        wellName: '',
        operator: '',
        contractor: '',
        spudDate: '',
      });

      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('returns error when saveWell fails', () => {
      const existingWell = { ...mockWellsData[0] };
      wellRepository.getWellById.mockReturnValue(existingWell);
      wellRepository.saveWell.mockReturnValue(false);

      const result = updateWell({
        id: '1',
        rig: 'Rig 1',
        wellName: 'Updated',
        wellId: 'WL-1001',
        operator: 'DeepSea Energy',
        contractor: 'Atlas Drilling Co.',
        spudDate: '2024-01-15',
        status: 'active',
      });

      expect(result.success).toBe(false);
      expect(result.errors[0]).toContain('Failed to save');
    });
  });

  describe('createWell', () => {
    it('creates a new well with generated id and inactive status', () => {
      const wellData = {
        rig: 'Rig 99',
        wellName: 'New Well #1',
        wellId: 'WL-9999',
        operator: 'Test Operator',
        contractor: 'Test Contractor',
        spudDate: '2024-06-01',
        type: 'Exploration',
        depth: 5000,
        location: 'Test Location',
      };

      const result = createWell(wellData);

      expect(result.success).toBe(true);
      expect(result.well).not.toBeNull();
      expect(result.well.id).toBeDefined();
      expect(result.well.id).not.toBe('');
      expect(result.well.status).toBe('inactive');
      expect(result.well.wellName).toBe('New Well #1');
      expect(result.errors).toHaveLength(0);
      expect(wellRepository.saveWell).toHaveBeenCalledWith(
        expect.objectContaining({
          wellName: 'New Well #1',
          status: 'inactive',
        })
      );
    });

    it('returns validation errors for missing required fields', () => {
      const result = createWell({
        rig: '',
        wellName: '',
        operator: '',
        contractor: '',
        spudDate: '',
      });

      expect(result.success).toBe(false);
      expect(result.well).toBeNull();
      expect(result.errors.length).toBeGreaterThan(0);
      expect(wellRepository.saveWell).not.toHaveBeenCalled();
    });

    it('returns error when wellData is null', () => {
      const result = createWell(null);

      expect(result.success).toBe(false);
      expect(result.well).toBeNull();
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('preserves provided id if present', () => {
      const wellData = {
        id: 'custom-id-123',
        rig: 'Rig 99',
        wellName: 'Custom ID Well',
        wellId: 'WL-CUSTOM',
        operator: 'Test Operator',
        contractor: 'Test Contractor',
        spudDate: '2024-06-01',
      };

      const result = createWell(wellData);

      expect(result.success).toBe(true);
      expect(result.well.id).toBe('custom-id-123');
    });

    it('returns error when saveWell fails', () => {
      wellRepository.saveWell.mockReturnValue(false);

      const wellData = {
        rig: 'Rig 99',
        wellName: 'Fail Well',
        wellId: 'WL-FAIL',
        operator: 'Test Operator',
        contractor: 'Test Contractor',
        spudDate: '2024-06-01',
      };

      const result = createWell(wellData);

      expect(result.success).toBe(false);
      expect(result.well).toBeNull();
      expect(result.errors[0]).toContain('Failed to save');
    });

    it('returns validation error for invalid spud date', () => {
      const wellData = {
        rig: 'Rig 99',
        wellName: 'Bad Date Well',
        wellId: 'WL-BAD',
        operator: 'Test Operator',
        contractor: 'Test Contractor',
        spudDate: 'not-a-date',
      };

      const result = createWell(wellData);

      expect(result.success).toBe(false);
      expect(result.errors.some((e) => e.toLowerCase().includes('date'))).toBe(true);
    });
  });

  describe('getActiveWellForRig', () => {
    it('returns the active well for a given rig', () => {
      wellRepository.getAllWells.mockReturnValue([...mockWellsData.map((w) => ({ ...w }))]);

      const result = getActiveWellForRig('Rig 1');

      expect(result).not.toBeNull();
      expect(result.id).toBe('1');
      expect(result.rig).toBe('Rig 1');
      expect(result.status).toBe('active');
    });

    it('returns null when no active well exists for the rig', () => {
      wellRepository.getAllWells.mockReturnValue(
        mockWellsData.map((w) => {
          if (w.rig === 'Rig 7') {
            return { ...w, status: 'inactive' };
          }
          return { ...w };
        })
      );

      const result = getActiveWellForRig('Rig 7');

      expect(result).toBeNull();
    });

    it('returns null when rig is empty string', () => {
      const result = getActiveWellForRig('');

      expect(result).toBeNull();
    });

    it('returns null when rig is null', () => {
      const result = getActiveWellForRig(null);

      expect(result).toBeNull();
    });

    it('returns null when rig is undefined', () => {
      const result = getActiveWellForRig(undefined);

      expect(result).toBeNull();
    });

    it('returns null when rig does not exist', () => {
      wellRepository.getAllWells.mockReturnValue([...mockWellsData.map((w) => ({ ...w }))]);

      const result = getActiveWellForRig('Nonexistent Rig');

      expect(result).toBeNull();
    });
  });
});