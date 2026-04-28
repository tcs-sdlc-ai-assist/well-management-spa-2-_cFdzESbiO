/**
 * WellTable component that composes the Table component with well-specific columns and data.
 * Receives processed wells array (filtered, sorted, paginated, with active pinned to top) from useWells.
 * Defines columns: RIG, WELL NAME, WELL ID, OPERATOR, CONTRACTOR, SPUD DATE (sortable), STATUS, ACTIONS.
 * Passes sort handler for Spud Date column. Renders WellTableRow for each well.
 * Identifies active row for styling.
 * @module WellTable
 */

import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useWells } from '../../hooks/useWells.js';
import { Badge } from '../ui/Badge.jsx';
import { Button } from '../ui/Button.jsx';
import { designTokens } from '../../constants/designTokens.js';

/**
 * @type {Array<{key: string, header: string, sortable?: boolean}>}
 */
const WELL_COLUMNS = [
  { key: 'rig', header: 'RIG' },
  { key: 'wellName', header: 'WELL NAME' },
  { key: 'wellId', header: 'WELL ID' },
  { key: 'operator', header: 'OPERATOR' },
  { key: 'contractor', header: 'CONTRACTOR' },
  { key: 'spudDate', header: 'SPUD DATE', sortable: true },
  { key: 'status', header: 'STATUS' },
];

/**
 * WellTable component renders the well list as a styled data table.
 * @param {Object} props
 * @param {Function} [props.onActivate] - Callback when the Activate button is clicked, called with (well)
 * @param {string} [props.className] - Additional CSS classes
 * @returns {React.ReactElement}
 */
export function WellTable({ onActivate, className = '' }) {
  const { wells, sort, setSort } = useWells();
  const navigate = useNavigate();

  /**
   * Handles sort toggling for sortable columns.
   * @param {string} columnKey - The key of the column clicked
   */
  const handleSort = useCallback((columnKey) => {
    if (columnKey === 'spudDate') {
      const newDirection = sort.field === 'spudDate' && sort.direction === 'desc' ? 'asc' : 'desc';
      setSort({ field: 'spudDate', direction: newDirection });
    }
  }, [sort, setSort]);

  /**
   * Returns the sort direction indicator for a column.
   * @param {string} columnKey - The column key
   * @returns {string} Sort indicator character or empty string
   */
  const getSortIndicator = (columnKey) => {
    if (!sort || sort.field !== columnKey) {
      return '';
    }
    return sort.direction === 'asc' ? ' ↑' : ' ↓';
  };

  /**
   * Returns the aria-sort value for a column.
   * @param {string} columnKey - The column key
   * @returns {string|undefined} The aria-sort value
   */
  const getAriaSort = (columnKey) => {
    if (!sort || sort.field !== columnKey) {
      return undefined;
    }
    return sort.direction === 'asc' ? 'ascending' : 'descending';
  };

  /**
   * Handles keyboard interaction on a sortable column header.
   * @param {React.KeyboardEvent} event - The keyboard event
   * @param {string} columnKey - The key of the column
   */
  const handleHeaderKeyDown = (event, columnKey) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleSort(columnKey);
    }
  };

  const safeWells = Array.isArray(wells) ? wells : [];

  const wrapperClasses = [
    designTokens.table.wrapper,
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={wrapperClasses}>
      <table
        className={designTokens.table.base}
        aria-label="Well list"
        role="grid"
      >
        <thead className={designTokens.table.header}>
          <tr>
            {WELL_COLUMNS.map((column) => {
              const isSortable = column.sortable === true;
              const ariaSort = getAriaSort(column.key);
              const sortIndicator = getSortIndicator(column.key);

              return (
                <th
                  key={column.key}
                  scope="col"
                  className={[
                    designTokens.table.headerCell,
                    isSortable ? 'cursor-pointer select-none hover:text-stone-200 transition-colors duration-150' : '',
                  ].filter(Boolean).join(' ')}
                  onClick={isSortable ? () => handleSort(column.key) : undefined}
                  onKeyDown={isSortable ? (e) => handleHeaderKeyDown(e, column.key) : undefined}
                  tabIndex={isSortable ? 0 : undefined}
                  role={isSortable ? 'columnheader button' : 'columnheader'}
                  aria-sort={ariaSort}
                >
                  {column.header}{sortIndicator}
                </th>
              );
            })}
            <th
              scope="col"
              className={designTokens.table.headerCell}
              role="columnheader"
            >
              ACTIONS
            </th>
          </tr>
        </thead>
        <tbody>
          {safeWells.length === 0 ? (
            <tr>
              <td
                colSpan={WELL_COLUMNS.length + 1}
                className="px-4 py-8 text-center text-stone-500 text-sm"
              >
                No wells found.
              </td>
            </tr>
          ) : (
            safeWells.map((well) => {
              const isActive = well.status === 'active';
              const rowClasses = isActive
                ? [
                    designTokens.activeRow.base,
                    'border-b border-stone-800 transition-colors duration-150',
                  ].join(' ')
                : designTokens.table.row;

              return (
                <tr
                  key={well.id}
                  className={rowClasses}
                  aria-selected={isActive || undefined}
                >
                  <td className={designTokens.table.cell}>
                    {well.rig || ''}
                  </td>
                  <td className={designTokens.table.cell}>
                    {well.wellName || ''}
                  </td>
                  <td className={designTokens.table.cell}>
                    {well.wellId || ''}
                  </td>
                  <td className={designTokens.table.cell}>
                    {well.operator || ''}
                  </td>
                  <td className={designTokens.table.cell}>
                    {well.contractor || ''}
                  </td>
                  <td className={designTokens.table.cell}>
                    {well.spudDate || ''}
                  </td>
                  <td className={designTokens.table.cell}>
                    <Badge variant={isActive ? 'active' : 'inactive'} />
                  </td>
                  <td className={designTokens.table.cell}>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="md"
                        onClick={() => navigate(`/wells/${well.id}`)}
                        ariaLabel={`View details for ${well.wellName || 'well'}`}
                        className="px-2.5 py-1 text-xs"
                      >
                        View Details
                      </Button>
                      <Button
                        variant="secondary"
                        size="md"
                        onClick={() => navigate(`/wells/${well.id}/edit`)}
                        ariaLabel={`Edit ${well.wellName || 'well'}`}
                        className="px-2.5 py-1 text-xs"
                      >
                        Edit
                      </Button>
                      {!isActive && (
                        <Button
                          variant="success"
                          size="md"
                          onClick={() => {
                            if (onActivate && typeof onActivate === 'function') {
                              onActivate(well);
                            }
                          }}
                          ariaLabel={`Activate ${well.wellName || 'well'}`}
                          className="px-2.5 py-1 text-xs"
                        >
                          Activate
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

WellTable.propTypes = {
  onActivate: PropTypes.func,
  className: PropTypes.string,
};

export default WellTable;