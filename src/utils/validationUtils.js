/**
 * Prop validation utilities for UI Design System Compliance.
 * Validates required props and returns error messages for missing/invalid props.
 * Used by UI components for runtime prop validation and defensive rendering.
 * @module validationUtils
 */

import { designTokens } from '../constants/designTokens.js';

/**
 * @typedef {Object} ValidationResult
 * @property {boolean} valid - Whether the props are valid
 * @property {string[]} errors - Array of error messages for invalid/missing props
 */

/**
 * Validates button component props against the design system.
 * @param {Object} props - The button props to validate
 * @param {string} [props.variant] - Button variant (primary, success, secondary, outline, danger)
 * @param {string} [props.size] - Button size (md, lg)
 * @param {React.ReactNode} [props.children] - Button content
 * @param {string} [props.ariaLabel] - Accessible label for the button
 * @param {Function} [props.onClick] - Click handler
 * @returns {ValidationResult} Validation result with errors array
 */
export function validateButtonProps(props) {
  const errors = [];

  if (!props) {
    return { valid: false, errors: ['Button props are required.'] };
  }

  if (props.variant !== undefined && !designTokens.variants.button.includes(props.variant)) {
    errors.push(
      `Invalid button variant "${props.variant}". Expected one of: ${designTokens.variants.button.join(', ')}.`
    );
  }

  if (props.size !== undefined && !designTokens.variants.buttonSize.includes(props.size)) {
    errors.push(
      `Invalid button size "${props.size}". Expected one of: ${designTokens.variants.buttonSize.join(', ')}.`
    );
  }

  if (props.children === undefined && props.children !== 0 && !props.ariaLabel) {
    errors.push('Button must have either children or an ariaLabel for accessibility.');
  }

  if (!props.ariaLabel && typeof props.children !== 'string') {
    errors.push(
      'Button with non-text children should provide an ariaLabel for accessibility (WCAG 2.1 AA).'
    );
  }

  if (props.onClick !== undefined && typeof props.onClick !== 'function') {
    errors.push('Button onClick must be a function.');
  }

  if (props.disabled !== undefined && typeof props.disabled !== 'boolean') {
    errors.push('Button disabled prop must be a boolean.');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validates modal component props against the design system.
 * @param {Object} props - The modal props to validate
 * @param {boolean} [props.open] - Whether the modal is open
 * @param {string} [props.title] - Modal title
 * @param {React.ReactNode} [props.children] - Modal body content
 * @param {Function} [props.onClose] - Close handler
 * @param {string} [props.ariaLabel] - Accessible label for the modal
 * @param {string} [props.variant] - Modal variant (activation, warning)
 * @returns {ValidationResult} Validation result with errors array
 */
export function validateModalProps(props) {
  const errors = [];

  if (!props) {
    return { valid: false, errors: ['Modal props are required.'] };
  }

  if (props.open !== undefined && typeof props.open !== 'boolean') {
    errors.push('Modal open prop must be a boolean.');
  }

  if (props.title !== undefined && typeof props.title !== 'string') {
    errors.push('Modal title must be a string.');
  }

  if (!props.title && !props.ariaLabel) {
    errors.push('Modal must have either a title or an ariaLabel for accessibility (WCAG 2.1 AA).');
  }

  if (!props.onClose) {
    errors.push('Modal onClose handler is required.');
  } else if (typeof props.onClose !== 'function') {
    errors.push('Modal onClose must be a function.');
  }

  if (!props.ariaLabel && !props.title) {
    errors.push('Modal must provide an ariaLabel when no title is present for accessibility.');
  }

  if (props.variant !== undefined && !designTokens.variants.modal.includes(props.variant)) {
    errors.push(
      `Invalid modal variant "${props.variant}". Expected one of: ${designTokens.variants.modal.join(', ')}.`
    );
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validates badge component props against the design system.
 * @param {Object} props - The badge props to validate
 * @param {string} [props.variant] - Badge variant (active, inactive)
 * @param {React.ReactNode} [props.children] - Badge content
 * @returns {ValidationResult} Validation result with errors array
 */
export function validateBadgeProps(props) {
  const errors = [];

  if (!props) {
    return { valid: false, errors: ['Badge props are required.'] };
  }

  if (props.variant === undefined) {
    errors.push('Badge variant is required.');
  } else if (!designTokens.variants.badge.includes(props.variant)) {
    errors.push(
      `Invalid badge variant "${props.variant}". Expected one of: ${designTokens.variants.badge.join(', ')}.`
    );
  }

  if (props.children === undefined && props.children !== 0) {
    errors.push('Badge must have children content to display.');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validates table component props against the design system.
 * @param {Object} props - The table props to validate
 * @param {Array<Object>} [props.columns] - Column definitions
 * @param {string} [props.columns[].key] - Column data key
 * @param {string} [props.columns[].header] - Column header text
 * @param {Array<Object>} [props.data] - Row data array
 * @param {string} [props.ariaLabel] - Accessible label for the table
 * @returns {ValidationResult} Validation result with errors array
 */
export function validateTableProps(props) {
  const errors = [];

  if (!props) {
    return { valid: false, errors: ['Table props are required.'] };
  }

  if (!props.columns) {
    errors.push('Table columns are required.');
  } else if (!Array.isArray(props.columns)) {
    errors.push('Table columns must be an array.');
  } else if (props.columns.length === 0) {
    errors.push('Table must have at least one column defined.');
  } else {
    props.columns.forEach((col, index) => {
      if (!col.key) {
        errors.push(`Table column at index ${index} is missing a "key" property.`);
      }
      if (!col.header && col.header !== '') {
        errors.push(`Table column at index ${index} is missing a "header" property.`);
      }
    });
  }

  if (!props.data) {
    errors.push('Table data is required.');
  } else if (!Array.isArray(props.data)) {
    errors.push('Table data must be an array.');
  }

  if (!props.ariaLabel) {
    errors.push('Table must have an ariaLabel for accessibility (WCAG 2.1 AA).');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Logs validation errors to the console in development mode.
 * @param {string} componentName - Name of the component being validated
 * @param {ValidationResult} result - Validation result to log
 * @returns {void}
 */
export function logValidationErrors(componentName, result) {
  if (!result.valid && result.errors.length > 0) {
    console.warn(
      `[DesignCompliance] ${componentName} validation failed:\n` +
        result.errors.map((e) => `  - ${e}`).join('\n')
    );
  }
}