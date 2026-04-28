/**
 * Reusable Button component adhering to the design system.
 * Supports primary, success, secondary, outline, and danger variants.
 * Uses designTokens for consistent styling and includes accessibility features.
 * @module Button
 */

import React from 'react';
import PropTypes from 'prop-types';
import { designTokens } from '../../constants/designTokens.js';
import { validateButtonProps, logValidationErrors } from '../../utils/validationUtils.js';

/**
 * Button component with design system compliance.
 * @param {Object} props
 * @param {'primary'|'success'|'secondary'|'outline'|'danger'} [props.variant='primary'] - Visual variant
 * @param {'md'|'lg'} [props.size='md'] - Button size
 * @param {React.ReactNode} props.children - Button content
 * @param {Function} [props.onClick] - Click handler
 * @param {boolean} [props.disabled=false] - Whether the button is disabled
 * @param {string} [props.className] - Additional CSS classes
 * @param {string} [props.type='button'] - HTML button type attribute
 * @param {string} [props.ariaLabel] - Accessible label for the button
 * @returns {React.ReactElement}
 */
export function Button({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  disabled = false,
  className = '',
  type = 'button',
  ariaLabel,
}) {
  const validation = validateButtonProps({ variant, size, children, onClick, disabled, ariaLabel });
  logValidationErrors('Button', validation);

  const variantClasses = designTokens.button[variant] || designTokens.button.primary;
  const sizeClasses = designTokens.button.size[size] || designTokens.button.size.md;
  const baseClasses = designTokens.button.base;

  const combinedClassName = [
    baseClasses,
    variantClasses,
    sizeClasses,
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={combinedClassName}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}

Button.propTypes = {
  variant: PropTypes.oneOf(['primary', 'success', 'secondary', 'outline', 'danger']),
  size: PropTypes.oneOf(['md', 'lg']),
  children: PropTypes.node,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  ariaLabel: PropTypes.string,
};

export default Button;