/**
 * Reusable Input component adhering to the design system.
 * Supports text input with optional search icon prefix.
 * Uses designTokens for consistent styling and includes accessibility features.
 * @module Input
 */

import React from 'react';
import PropTypes from 'prop-types';
import { designTokens } from '../../constants/designTokens.js';

/**
 * Search icon SVG component for input prefix.
 * @returns {React.ReactElement}
 */
function SearchIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4 text-stone-400"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
        clipRule="evenodd"
      />
    </svg>
  );
}

/**
 * Input component with design system compliance.
 * @param {Object} props
 * @param {string} [props.value] - Current input value
 * @param {Function} [props.onChange] - Change handler
 * @param {string} [props.placeholder] - Placeholder text
 * @param {string} [props.type='text'] - HTML input type attribute
 * @param {string} [props.ariaLabel] - Accessible label for the input
 * @param {'search'|null} [props.icon] - Icon to display as prefix (currently supports 'search')
 * @param {string} [props.className] - Additional CSS classes
 * @param {string} [props.name] - HTML name attribute
 * @param {string} [props.id] - HTML id attribute
 * @param {boolean} [props.disabled=false] - Whether the input is disabled
 * @param {'md'|'lg'} [props.size='md'] - Input size
 * @returns {React.ReactElement}
 */
export function Input({
  value,
  onChange,
  placeholder,
  type = 'text',
  ariaLabel,
  icon,
  className = '',
  name,
  id,
  disabled = false,
  size = 'md',
}) {
  const baseClasses = designTokens.input.base;
  const sizeClasses = designTokens.input.size[size] || designTokens.input.size.md;
  const hasIcon = icon === 'search';

  const inputClasses = [
    baseClasses,
    sizeClasses,
    hasIcon ? 'pl-9' : '',
    className,
  ].filter(Boolean).join(' ');

  if (hasIcon) {
    return (
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <SearchIcon />
        </div>
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          aria-label={ariaLabel}
          name={name}
          id={id}
          disabled={disabled}
          className={inputClasses}
        />
      </div>
    );
  }

  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      aria-label={ariaLabel}
      name={name}
      id={id}
      disabled={disabled}
      className={inputClasses}
    />
  );
}

Input.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  ariaLabel: PropTypes.string,
  icon: PropTypes.oneOf(['search']),
  className: PropTypes.string,
  name: PropTypes.string,
  id: PropTypes.string,
  disabled: PropTypes.bool,
  size: PropTypes.oneOf(['md', 'lg']),
};

export default Input;