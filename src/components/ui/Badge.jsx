/**
 * Reusable Badge component adhering to the design system.
 * Supports active and inactive variants for well status display.
 * Active variant includes a pulsing green dot animation.
 * Uses designTokens for consistent styling and includes accessibility features.
 * @module Badge
 */

import React from 'react';
import PropTypes from 'prop-types';
import { designTokens } from '../../constants/designTokens.js';
import { validateBadgeProps, logValidationErrors } from '../../utils/validationUtils.js';

/**
 * Badge component with design system compliance.
 * @param {Object} props
 * @param {'active'|'inactive'} props.variant - Visual variant matching well status
 * @param {React.ReactNode} [props.children] - Badge content (defaults to capitalized variant label)
 * @param {string} [props.className] - Additional CSS classes
 * @param {string} [props.ariaLabel] - Accessible label for the badge
 * @returns {React.ReactElement}
 */
export function Badge({
  variant,
  children,
  className = '',
  ariaLabel,
}) {
  const displayText = children !== undefined && children !== null
    ? children
    : variant
      ? variant.charAt(0).toUpperCase() + variant.slice(1)
      : '';

  const validation = validateBadgeProps({ variant, children: displayText });
  logValidationErrors('Badge', validation);

  const variantClasses = designTokens.badge[variant] || designTokens.badge.inactive;

  const combinedClassName = [
    'inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium rounded-md',
    variantClasses,
    className,
  ].filter(Boolean).join(' ');

  const label = ariaLabel || `Status: ${variant || 'unknown'}`;

  return (
    <span
      className={combinedClassName}
      role="status"
      aria-label={label}
    >
      {variant === 'active' && (
        <span className={designTokens.pulsingDot} aria-hidden="true">
          <span className={designTokens.pulsingDotInner} />
          <span className={designTokens.pulsingDotCore} />
        </span>
      )}
      {displayText}
    </span>
  );
}

Badge.propTypes = {
  variant: PropTypes.oneOf(['active', 'inactive']).isRequired,
  children: PropTypes.node,
  className: PropTypes.string,
  ariaLabel: PropTypes.string,
};

export default Badge;