/**
 * Mock well data for the Well Management SPA.
 * Used to initialize localStorage on first load.
 * @module mockData
 */

/**
 * @typedef {Object} Well
 * @property {string} id - Unique identifier for the well
 * @property {string} rig - Rig name/number
 * @property {string} wellName - Display name of the well
 * @property {string} wellId - Well identifier code
 * @property {string} operator - Operating company name
 * @property {string} contractor - Drilling contractor name
 * @property {string} spudDate - Date drilling began (ISO 8601 format)
 * @property {string} status - Current well status ('active' or 'inactive')
 * @property {string} type - Well type classification
 * @property {number} depth - Current depth in feet
 * @property {string} location - Geographic location description
 */

/** @type {Well[]} */
export const mockWells = [
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
    rig: 'Rig 2',
    wellName: 'Bakken North #12',
    wellId: 'WL-1004',
    operator: 'Northern Plains Energy',
    contractor: 'Pinnacle Drilling LLC',
    spudDate: '2024-03-10',
    status: 'active',
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
    status: 'active',
    type: 'Development',
    depth: 8700,
    location: 'Marcellus Shale, Pennsylvania',
  },
  {
    id: '6',
    rig: 'Rig 4',
    wellName: 'Haynesville #9',
    wellId: 'WL-1006',
    operator: 'Gulf Coast Resources',
    contractor: 'Pinnacle Drilling LLC',
    spudDate: '2023-09-14',
    status: 'inactive',
    type: 'Development',
    depth: 13100,
    location: 'Haynesville Shale, Louisiana',
  },
  {
    id: '7',
    rig: 'Rig 6',
    wellName: 'Niobrara West #2',
    wellId: 'WL-1007',
    operator: 'Rocky Mountain Drilling',
    contractor: 'Atlas Drilling Co.',
    spudDate: '2024-04-02',
    status: 'active',
    type: 'Exploration',
    depth: 7600,
    location: 'DJ Basin, Colorado',
  },
  {
    id: '8',
    rig: 'Rig 8',
    wellName: 'Woodford Central #4',
    wellId: 'WL-1008',
    operator: 'Midcontinent Energy Partners',
    contractor: 'Summit Drilling Inc.',
    spudDate: '2023-12-18',
    status: 'inactive',
    type: 'Appraisal',
    depth: 14200,
    location: 'Woodford Shale, Oklahoma',
  },
  {
    id: '9',
    rig: 'Rig 9',
    wellName: 'Spraberry Trend #6',
    wellId: 'WL-1009',
    operator: 'Frontier Oil & Gas',
    contractor: 'Pinnacle Drilling LLC',
    spudDate: '2024-02-05',
    status: 'active',
    type: 'Development',
    depth: 9200,
    location: 'Spraberry Trend, Midland Basin',
  },
  {
    id: '10',
    rig: 'Rig 10',
    wellName: 'Utica Point #8',
    wellId: 'WL-1010',
    operator: 'Appalachian Gas Corp.',
    contractor: 'Atlas Drilling Co.',
    spudDate: '2024-03-22',
    status: 'active',
    type: 'Exploration',
    depth: 6800,
    location: 'Utica Shale, Ohio',
  },
];

export default mockWells;