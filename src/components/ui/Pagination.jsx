/**
 * Pagination controls component adhering to the design system.
 * Renders first, prev, numbered page buttons, next, last buttons, and a page size dropdown.
 * Buttons are disabled at bounds (first/last page). Active page button is highlighted.
 * Page size dropdown resets to page 1 on change.
 * Uses Button component for navigation buttons.
 * Includes aria-labels for all controls.
 * @module Pagination
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Button } from './Button.jsx';
import { designTokens } from '../../constants/designTokens.js';

/**
 * Generates an array of page numbers to display.
 * Shows up to maxVisible pages with ellipsis gaps represented as null.
 * @param {number} currentPage - Current active page (1-based)
 * @param {number} totalPages - Total number of pages
 * @param {number} [maxVisible=5] - Maximum number of page buttons to show
 * @returns {Array<number|null>} Array of page numbers and nulls for ellipsis
 */
function getPageNumbers(currentPage, totalPages, maxVisible = 5) {
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages = [];
  const half = Math.floor(maxVisible / 2);

  let start = currentPage - half;
  let end = currentPage + half;

  if (start < 1) {
    start = 1;
    end = maxVisible;
  }

  if (end > totalPages) {
    end = totalPages;
    start = totalPages - maxVisible + 1;
  }

  if (start < 1) {
    start = 1;
  }

  if (start > 1) {
    pages.push(1);
    if (start > 2) {
      pages.push(null);
    }
  }

  for (let i = start; i <= end; i++) {
    if (!pages.includes(i)) {
      pages.push(i);
    }
  }

  if (end < totalPages) {
    if (end < totalPages - 1) {
      pages.push(null);
    }
    if (!pages.includes(totalPages)) {
      pages.push(totalPages);
    }
  }

  return pages;
}

/** @type {number[]} Available page size options */
const PAGE_SIZE_OPTIONS = [5, 10, 25, 50];

/**
 * Pagination component with design system compliance.
 * @param {Object} props
 * @param {number} props.currentPage - Current active page (1-based)
 * @param {number} props.totalPages - Total number of pages
 * @param {number} props.pageSize - Current page size
 * @param {Function} props.onPageChange - Handler called with (pageNumber) when page changes
 * @param {Function} props.onPageSizeChange - Handler called with (newPageSize) when page size changes
 * @param {string} [props.className] - Additional CSS classes
 * @returns {React.ReactElement}
 */
export function Pagination({
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
  className = '',
}) {
  const safeTotalPages = Math.max(1, totalPages);
  const safeCurrentPage = Math.max(1, Math.min(currentPage, safeTotalPages));

  const isFirstPage = safeCurrentPage === 1;
  const isLastPage = safeCurrentPage === safeTotalPages;

  const pageNumbers = getPageNumbers(safeCurrentPage, safeTotalPages);

  /**
   * Handles page size dropdown change.
   * Resets to page 1 when page size changes.
   * @param {React.ChangeEvent<HTMLSelectElement>} event
   */
  const handlePageSizeChange = (event) => {
    const newSize = Number(event.target.value);
    if (onPageSizeChange && typeof onPageSizeChange === 'function') {
      onPageSizeChange(newSize);
    }
  };

  const wrapperClasses = [
    'flex flex-col sm:flex-row items-center justify-between gap-4',
    className,
  ].filter(Boolean).join(' ');

  return (
    <nav
      className={wrapperClasses}
      role="navigation"
      aria-label="Pagination navigation"
    >
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="md"
          onClick={() => onPageChange(1)}
          disabled={isFirstPage}
          ariaLabel="Go to first page"
          className="px-2.5"
        >
          «
        </Button>
        <Button
          variant="outline"
          size="md"
          onClick={() => onPageChange(safeCurrentPage - 1)}
          disabled={isFirstPage}
          ariaLabel="Go to previous page"
          className="px-2.5"
        >
          ‹
        </Button>

        {pageNumbers.map((page, index) => {
          if (page === null) {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-2 py-2 text-sm text-stone-500 select-none"
                aria-hidden="true"
              >
                …
              </span>
            );
          }

          const isActive = page === safeCurrentPage;

          return (
            <Button
              key={page}
              variant={isActive ? 'primary' : 'outline'}
              size="md"
              onClick={() => onPageChange(page)}
              disabled={isActive}
              ariaLabel={isActive ? `Page ${page}, current page` : `Go to page ${page}`}
              className="px-3"
            >
              {String(page)}
            </Button>
          );
        })}

        <Button
          variant="outline"
          size="md"
          onClick={() => onPageChange(safeCurrentPage + 1)}
          disabled={isLastPage}
          ariaLabel="Go to next page"
          className="px-2.5"
        >
          ›
        </Button>
        <Button
          variant="outline"
          size="md"
          onClick={() => onPageChange(safeTotalPages)}
          disabled={isLastPage}
          ariaLabel="Go to last page"
          className="px-2.5"
        >
          »
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <label
          htmlFor="page-size-select"
          className="text-sm text-stone-400"
        >
          Rows per page:
        </label>
        <select
          id="page-size-select"
          value={pageSize}
          onChange={handlePageSizeChange}
          aria-label="Select number of rows per page"
          className={[
            'rounded-lg border bg-stone-800 border-stone-700 text-stone-100',
            'px-2 py-1.5 text-sm',
            'focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none',
            designTokens.transition.colors,
          ].join(' ')}
        >
          {PAGE_SIZE_OPTIONS.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>
    </nav>
  );
}

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onPageSizeChange: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default Pagination;