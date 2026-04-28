/**
 * Reusable Table component adhering to the design system.
 * Renders a styled data grid with proper table semantics and accessibility features.
 * Supports sortable columns, active row highlighting, and custom action rendering.
 * Uses designTokens for consistent styling and includes WCAG 2.1 AA compliance.
 * @module Table
 */

import React from 'react';
import PropTypes from 'prop-types';
import { designTokens } from '../../constants/designTokens.js';
import { validateTableProps, logValidationErrors } from '../../utils/validationUtils.js';

/**
 * Table component with design system compliance.
 * @param {Object} props
 * @param {Array<{key: string, header: string, sortable?: boolean}>} props.columns - Column definitions
 * @param {Array<Object>} props.data - Row data array
 * @param {string} [props.activeRowId] - ID of the currently active row for highlighting
 * @param {Function} [props.onSort] - Sort handler called with (columnKey) when a sortable header is clicked
 * @param {Function} [props.renderActions] - Render function for row actions, called with (row)
 * @param {string} [props.ariaLabel] - Accessible label for the table
 * @param {string} [props.className] - Additional CSS classes
 * @param {Object} [props.sort] - Current sort state with { field, direction }
 * @returns {React.ReactElement}
 */
export function Table({
  columns,
  data,
  activeRowId,
  onSort,
  renderActions,
  ariaLabel,
  className = '',
  sort,
}) {
  const validation = validateTableProps({ columns, data, ariaLabel });
  logValidationErrors('Table', validation);

  const safeColumns = Array.isArray(columns) ? columns : [];
  const safeData = Array.isArray(data) ? data : [];

  const hasActions = typeof renderActions === 'function';

  /**
   * Handles click on a sortable column header.
   * @param {string} columnKey - The key of the column clicked
   */
  const handleHeaderClick = (columnKey) => {
    if (onSort && typeof onSort === 'function') {
      onSort(columnKey);
    }
  };

  /**
   * Handles keyboard interaction on a sortable column header.
   * @param {React.KeyboardEvent} event - The keyboard event
   * @param {string} columnKey - The key of the column
   */
  const handleHeaderKeyDown = (event, columnKey) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleHeaderClick(columnKey);
    }
  };

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

  const wrapperClasses = [
    designTokens.table.wrapper,
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={wrapperClasses}>
      <table
        className={designTokens.table.base}
        aria-label={ariaLabel}
        role="grid"
      >
        <thead className={designTokens.table.header}>
          <tr>
            {safeColumns.map((column) => {
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
                  onClick={isSortable ? () => handleHeaderClick(column.key) : undefined}
                  onKeyDown={isSortable ? (e) => handleHeaderKeyDown(e, column.key) : undefined}
                  tabIndex={isSortable ? 0 : undefined}
                  role={isSortable ? 'columnheader button' : 'columnheader'}
                  aria-sort={ariaSort}
                >
                  {column.header}{sortIndicator}
                </th>
              );
            })}
            {hasActions && (
              <th
                scope="col"
                className={designTokens.table.headerCell}
                role="columnheader"
              >
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {safeData.length === 0 ? (
            <tr>
              <td
                colSpan={safeColumns.length + (hasActions ? 1 : 0)}
                className="px-4 py-8 text-center text-stone-500 text-sm"
              >
                No data available.
              </td>
            </tr>
          ) : (
            safeData.map((row, rowIndex) => {
              const isActive = activeRowId !== undefined && activeRowId !== null && row.id === activeRowId;
              const rowClasses = isActive
                ? [
                    designTokens.activeRow.base,
                    'border-b border-stone-800 transition-colors duration-150',
                  ].join(' ')
                : designTokens.table.row;

              return (
                <tr
                  key={row.id || rowIndex}
                  className={rowClasses}
                  aria-selected={isActive || undefined}
                >
                  {safeColumns.map((column) => (
                    <td
                      key={`${row.id || rowIndex}-${column.key}`}
                      className={designTokens.table.cell}
                    >
                      {row[column.key] !== undefined && row[column.key] !== null
                        ? String(row[column.key])
                        : ''}
                    </td>
                  ))}
                  {hasActions && (
                    <td className={designTokens.table.cell}>
                      {renderActions(row)}
                    </td>
                  )}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

Table.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      header: PropTypes.string.isRequired,
      sortable: PropTypes.bool,
    })
  ).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  activeRowId: PropTypes.string,
  onSort: PropTypes.func,
  renderActions: PropTypes.func,
  ariaLabel: PropTypes.string,
  className: PropTypes.string,
  sort: PropTypes.shape({
    field: PropTypes.string,
    direction: PropTypes.oneOf(['asc', 'desc']),
  }),
};

export default Table;