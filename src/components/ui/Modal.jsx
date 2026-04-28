/**
 * Reusable Modal component adhering to the design system.
 * Supports activation and warning variants with scenario-specific border colors.
 * Implements focus trapping, Escape key close, click-outside close, and ARIA attributes.
 * Uses designTokens for consistent styling.
 * @module Modal
 */

import React, { useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { designTokens } from '../../constants/designTokens.js';
import { validateModalProps, logValidationErrors } from '../../utils/validationUtils.js';

/**
 * Modal component with design system compliance.
 * @param {Object} props
 * @param {boolean} props.open - Whether the modal is currently open
 * @param {string} [props.title] - Modal title text
 * @param {React.ReactNode} [props.children] - Modal body content
 * @param {React.ReactNode} [props.footer] - Modal footer content
 * @param {Function} props.onClose - Close handler
 * @param {string} [props.ariaLabel] - Accessible label for the modal
 * @param {'activation'|'warning'} [props.variant] - Modal variant for border styling
 * @param {string} [props.className] - Additional CSS classes
 * @returns {React.ReactElement|null}
 */
export function Modal({
  open = false,
  title,
  children,
  footer,
  onClose,
  ariaLabel,
  variant,
  className = '',
}) {
  const validation = validateModalProps({ open, title, children, onClose, ariaLabel, variant });
  logValidationErrors('Modal', validation);

  const overlayRef = useRef(null);
  const containerRef = useRef(null);
  const previousActiveElementRef = useRef(null);

  /**
   * Returns all focusable elements within the modal container.
   * @returns {HTMLElement[]}
   */
  const getFocusableElements = useCallback(() => {
    if (!containerRef.current) {
      return [];
    }
    const selectors = [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ];
    return Array.from(containerRef.current.querySelectorAll(selectors.join(', ')));
  }, []);

  /**
   * Handles keyboard events for Escape key close and focus trapping.
   * @param {KeyboardEvent} event
   */
  const handleKeyDown = useCallback((event) => {
    if (event.key === 'Escape') {
      event.stopPropagation();
      if (onClose) {
        onClose();
      }
      return;
    }

    if (event.key === 'Tab') {
      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) {
        event.preventDefault();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    }
  }, [onClose, getFocusableElements]);

  /**
   * Handles click on the overlay to close the modal.
   * @param {React.MouseEvent} event
   */
  const handleOverlayClick = useCallback((event) => {
    if (event.target === overlayRef.current) {
      if (onClose) {
        onClose();
      }
    }
  }, [onClose]);

  // Focus management and event listeners
  useEffect(() => {
    if (open) {
      previousActiveElementRef.current = document.activeElement;

      // Focus the container or first focusable element
      const timer = setTimeout(() => {
        const focusableElements = getFocusableElements();
        if (focusableElements.length > 0) {
          focusableElements[0].focus();
        } else if (containerRef.current) {
          containerRef.current.focus();
        }
      }, 0);

      document.addEventListener('keydown', handleKeyDown);

      // Prevent body scroll
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      return () => {
        clearTimeout(timer);
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = originalOverflow;

        // Restore focus to previously active element
        if (previousActiveElementRef.current && typeof previousActiveElementRef.current.focus === 'function') {
          previousActiveElementRef.current.focus();
        }
      };
    }
  }, [open, handleKeyDown, getFocusableElements]);

  if (!open) {
    return null;
  }

  const variantBorderClass = variant === 'activation'
    ? designTokens.modal.activation
    : variant === 'warning'
      ? designTokens.modal.warning
      : '';

  const overlayClasses = designTokens.modal.overlay;
  const containerClasses = [
    designTokens.modal.container,
    variantBorderClass,
    className,
  ].filter(Boolean).join(' ');

  const headerClasses = designTokens.modal.header;
  const bodyClasses = designTokens.modal.body;
  const footerClasses = designTokens.modal.footer;
  const titleClasses = designTokens.modal.title;

  return (
    <div
      ref={overlayRef}
      className={overlayClasses}
      onClick={handleOverlayClick}
      aria-hidden="true"
    >
      <div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel || title || undefined}
        className={containerClasses}
        tabIndex={-1}
      >
        {title && (
          <div className={headerClasses}>
            <h2 className={titleClasses}>{title}</h2>
            <button
              type="button"
              className="text-stone-400 hover:text-stone-100 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-stone-500 rounded-lg p-1"
              onClick={onClose}
              aria-label="Close modal"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        )}
        {children && (
          <div className={bodyClasses}>
            {children}
          </div>
        )}
        {footer && (
          <div className={footerClasses}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

Modal.propTypes = {
  open: PropTypes.bool,
  title: PropTypes.string,
  children: PropTypes.node,
  footer: PropTypes.node,
  onClose: PropTypes.func.isRequired,
  ariaLabel: PropTypes.string,
  variant: PropTypes.oneOf(['activation', 'warning']),
  className: PropTypes.string,
};

export default Modal;