/**
 * Reusable CollapsibleSection component adhering to the design system.
 * Renders a header with title and expand/collapse toggle icon.
 * Content area animates open/closed with CSS transitions.
 * Used in Create/Edit forms for Rig Setup and Well Setup sections.
 * Styled with bg-stone-900 border-stone-700.
 * @module CollapsibleSection
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { designTokens } from '../../constants/designTokens.js';

/**
 * Chevron icon SVG component for expand/collapse toggle.
 * Rotates based on expanded state.
 * @param {Object} props
 * @param {boolean} props.expanded - Whether the section is expanded
 * @returns {React.ReactElement}
 */
function ChevronIcon({ expanded }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={[
        'h-5 w-5 text-stone-400 transition-transform duration-200',
        expanded ? 'rotate-180' : 'rotate-0',
      ].join(' ')}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
        clipRule="evenodd"
      />
    </svg>
  );
}

ChevronIcon.propTypes = {
  expanded: PropTypes.bool.isRequired,
};

/**
 * CollapsibleSection component with design system compliance.
 * @param {Object} props
 * @param {string} props.title - Section header title text
 * @param {boolean} [props.defaultExpanded=true] - Whether the section is expanded by default
 * @param {React.ReactNode} [props.children] - Section content
 * @param {string} [props.className] - Additional CSS classes
 * @param {string} [props.ariaLabel] - Accessible label for the section
 * @returns {React.ReactElement}
 */
export function CollapsibleSection({
  title,
  defaultExpanded = true,
  children,
  className = '',
  ariaLabel,
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const contentRef = useRef(null);
  const [contentHeight, setContentHeight] = useState(defaultExpanded ? 'auto' : '0px');

  /**
   * Updates the content height for animation when expanded state changes.
   */
  useEffect(() => {
    if (expanded) {
      if (contentRef.current) {
        const scrollHeight = contentRef.current.scrollHeight;
        setContentHeight(`${scrollHeight}px`);
        const timer = setTimeout(() => {
          setContentHeight('auto');
        }, 200);
        return () => clearTimeout(timer);
      }
    } else {
      if (contentRef.current) {
        const scrollHeight = contentRef.current.scrollHeight;
        setContentHeight(`${scrollHeight}px`);
        // Force a reflow before setting to 0
        // eslint-disable-next-line no-unused-expressions
        contentRef.current.offsetHeight;
        requestAnimationFrame(() => {
          setContentHeight('0px');
        });
      }
    }
  }, [expanded]);

  /**
   * Toggles the expanded state.
   */
  const handleToggle = useCallback(() => {
    setExpanded((prev) => !prev);
  }, []);

  /**
   * Handles keyboard interaction on the header.
   * @param {React.KeyboardEvent} event
   */
  const handleKeyDown = useCallback((event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleToggle();
    }
  }, [handleToggle]);

  const sectionId = title
    ? `collapsible-${title.toLowerCase().replace(/\s+/g, '-')}`
    : 'collapsible-section';
  const contentId = `${sectionId}-content`;

  const wrapperClasses = [
    'bg-stone-900 border border-stone-700 rounded-lg overflow-hidden',
    designTokens.transition.colors,
    className,
  ].filter(Boolean).join(' ');

  const headerClasses = [
    'flex items-center justify-between w-full px-4 py-3 cursor-pointer select-none',
    'hover:bg-stone-800/50 transition-colors duration-150',
    'focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-inset',
  ].join(' ');

  const contentClasses = [
    'overflow-hidden transition-[max-height] duration-200 ease-in-out',
  ].join(' ');

  return (
    <div className={wrapperClasses}>
      <button
        type="button"
        className={headerClasses}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        aria-expanded={expanded}
        aria-controls={contentId}
        aria-label={ariaLabel || `Toggle ${title || 'section'}`}
      >
        <h3 className="text-sm font-semibold text-stone-100 uppercase tracking-wider">
          {title}
        </h3>
        <ChevronIcon expanded={expanded} />
      </button>
      <div
        id={contentId}
        ref={contentRef}
        className={contentClasses}
        style={{ maxHeight: contentHeight }}
        role="region"
        aria-labelledby={sectionId}
      >
        <div className="px-4 pb-4 pt-1">
          {children}
        </div>
      </div>
    </div>
  );
}

CollapsibleSection.propTypes = {
  title: PropTypes.string.isRequired,
  defaultExpanded: PropTypes.bool,
  children: PropTypes.node,
  className: PropTypes.string,
  ariaLabel: PropTypes.string,
};

export default CollapsibleSection;