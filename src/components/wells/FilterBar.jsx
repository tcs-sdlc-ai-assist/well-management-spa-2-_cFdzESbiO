/**
 * FilterBar component for well list filtering.
 * Provides input fields for RIG, WELL NAME, WELL ID, OPERATOR, and CONTRACTOR.
 * Each input uses the Input component with search icon.
 * Typing triggers real-time case-insensitive partial string filtering via setFilters from useWells hook.
 * Resets pagination to page 1 on any filter change (handled by setFilters in WellContext).
 * @module FilterBar
 */

import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Input } from '../ui/Input.jsx';
import { useWells } from '../../hooks/useWells.js';

/**
 * FilterBar component with design system compliance.
 * @param {Object} props
 * @param {string} [props.className] - Additional CSS classes
 * @returns {React.ReactElement}
 */
export function FilterBar({ className = '' }) {
  const { filters, setFilters } = useWells();

  /**
   * Creates a change handler for a specific filter field.
   * @param {string} field - The filter field name
   * @returns {Function} Change handler
   */
  const handleFilterChange = useCallback((field) => {
    return (event) => {
      setFilters({ [field]: event.target.value });
    };
  }, [setFilters]);

  const containerClasses = [
    'bg-stone-900 rounded-lg p-4',
    'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses} role="search" aria-label="Filter wells">
      <div>
        <label htmlFor="filter-rig" className="block text-sm font-medium text-stone-300 mb-1">
          Rig
        </label>
        <Input
          id="filter-rig"
          name="rig"
          value={filters.rig || ''}
          onChange={handleFilterChange('rig')}
          placeholder="Filter by rig..."
          icon="search"
          ariaLabel="Filter by rig"
          size="md"
        />
      </div>
      <div>
        <label htmlFor="filter-wellName" className="block text-sm font-medium text-stone-300 mb-1">
          Well Name
        </label>
        <Input
          id="filter-wellName"
          name="search"
          value={filters.search || ''}
          onChange={handleFilterChange('search')}
          placeholder="Filter by well name..."
          icon="search"
          ariaLabel="Filter by well name"
          size="md"
        />
      </div>
      <div>
        <label htmlFor="filter-wellId" className="block text-sm font-medium text-stone-300 mb-1">
          Well ID
        </label>
        <Input
          id="filter-wellId"
          name="search"
          value={filters.search || ''}
          onChange={handleFilterChange('search')}
          placeholder="Filter by well ID..."
          icon="search"
          ariaLabel="Filter by well ID"
          size="md"
        />
      </div>
      <div>
        <label htmlFor="filter-operator" className="block text-sm font-medium text-stone-300 mb-1">
          Operator
        </label>
        <Input
          id="filter-operator"
          name="operator"
          value={filters.operator || ''}
          onChange={handleFilterChange('operator')}
          placeholder="Filter by operator..."
          icon="search"
          ariaLabel="Filter by operator"
          size="md"
        />
      </div>
      <div>
        <label htmlFor="filter-contractor" className="block text-sm font-medium text-stone-300 mb-1">
          Contractor
        </label>
        <Input
          id="filter-contractor"
          name="contractor"
          value={filters.contractor || ''}
          onChange={handleFilterChange('contractor')}
          placeholder="Filter by contractor..."
          icon="search"
          ariaLabel="Filter by contractor"
          size="md"
        />
      </div>
    </div>
  );
}

FilterBar.propTypes = {
  className: PropTypes.string,
};

export default FilterBar;