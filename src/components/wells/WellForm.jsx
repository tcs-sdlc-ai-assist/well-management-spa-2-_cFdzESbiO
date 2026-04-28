/**
 * Shared WellForm component used by both Create and Edit pages.
 * Contains two CollapsibleSections: Rig Setup and Well Setup.
 * Accepts initialData, onSubmit, onCancel, and mode props.
 * Validates required fields before submission.
 * @module WellForm
 */

import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { CollapsibleSection } from '../ui/CollapsibleSection.jsx';
import { Input } from '../ui/Input.jsx';
import { Button } from '../ui/Button.jsx';

/**
 * Default empty form state for creating a new well.
 * @type {Object}
 */
const defaultFormData = {
  rig: '',
  operator: '',
  contractor: '',
  wellName: '',
  wellId: '',
  spudDate: '',
  type: '',
  depth: '',
  location: '',
};

/**
 * Validates the form data and returns an object of field-level error messages.
 * @param {Object} formData - The form data to validate
 * @returns {{ valid: boolean, errors: Object<string, string> }} Validation result
 */
function validateFormData(formData) {
  const errors = {};

  if (!formData.rig || typeof formData.rig !== 'string' || formData.rig.trim() === '') {
    errors.rig = 'Rig is required.';
  }

  if (!formData.operator || typeof formData.operator !== 'string' || formData.operator.trim() === '') {
    errors.operator = 'Operator is required.';
  }

  if (!formData.contractor || typeof formData.contractor !== 'string' || formData.contractor.trim() === '') {
    errors.contractor = 'Contractor is required.';
  }

  if (!formData.wellName || typeof formData.wellName !== 'string' || formData.wellName.trim() === '') {
    errors.wellName = 'Well name is required.';
  }

  if (!formData.spudDate || typeof formData.spudDate !== 'string' || formData.spudDate.trim() === '') {
    errors.spudDate = 'Spud date is required.';
  } else {
    const date = new Date(formData.spudDate);
    if (isNaN(date.getTime())) {
      errors.spudDate = 'Spud date must be a valid date.';
    }
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

/**
 * WellForm component for creating and editing wells.
 * @param {Object} props
 * @param {import('../../constants/mockData.js').Well|null} [props.initialData=null] - Initial well data (null for create, well object for edit)
 * @param {Function} props.onSubmit - Submit handler called with form data object
 * @param {Function} props.onCancel - Cancel handler
 * @param {'create'|'edit'} [props.mode='create'] - Form mode
 * @param {string} [props.className] - Additional CSS classes
 * @returns {React.ReactElement}
 */
export function WellForm({
  initialData = null,
  onSubmit,
  onCancel,
  mode = 'create',
  className = '',
}) {
  const isEdit = mode === 'edit';

  const [formData, setFormData] = useState(() => {
    if (initialData) {
      return {
        rig: initialData.rig || '',
        operator: initialData.operator || '',
        contractor: initialData.contractor || '',
        wellName: initialData.wellName || '',
        wellId: initialData.wellId || '',
        spudDate: initialData.spudDate || '',
        type: initialData.type || '',
        depth: initialData.depth !== undefined && initialData.depth !== null ? String(initialData.depth) : '',
        location: initialData.location || '',
      };
    }
    return { ...defaultFormData };
  });

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);

  /**
   * Creates a change handler for a specific form field.
   * @param {string} field - The form field name
   * @returns {Function} Change handler
   */
  const handleChange = useCallback((field) => {
    return (event) => {
      const value = event.target.value;
      setFormData((prev) => ({ ...prev, [field]: value }));
      // Clear field error on change
      setErrors((prev) => {
        if (prev[field]) {
          const updated = { ...prev };
          delete updated[field];
          return updated;
        }
        return prev;
      });
      setSubmitError(null);
    };
  }, []);

  /**
   * Handles form submission with validation.
   * @param {React.FormEvent} event
   */
  const handleSubmit = useCallback((event) => {
    event.preventDefault();

    const validation = validateFormData(formData);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    setSubmitError(null);

    const submissionData = {
      ...formData,
      depth: formData.depth !== '' ? Number(formData.depth) : undefined,
    };

    if (isEdit && initialData) {
      submissionData.id = initialData.id;
      submissionData.status = initialData.status;
    }

    try {
      if (onSubmit && typeof onSubmit === 'function') {
        onSubmit(submissionData);
      }
    } catch (err) {
      setSubmitError('An unexpected error occurred while saving the well.');
      console.error('[WellForm] Submit error:', err);
    }
  }, [formData, isEdit, initialData, onSubmit]);

  /**
   * Handles cancel action.
   */
  const handleCancel = useCallback(() => {
    if (onCancel && typeof onCancel === 'function') {
      onCancel();
    }
  }, [onCancel]);

  const wrapperClasses = [
    'space-y-6',
    className,
  ].filter(Boolean).join(' ');

  return (
    <form
      className={wrapperClasses}
      onSubmit={handleSubmit}
      noValidate
      aria-label={isEdit ? 'Edit well form' : 'Create well form'}
    >
      {submitError && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {submitError}
        </div>
      )}

      <CollapsibleSection
        title="Rig Setup"
        defaultExpanded={!isEdit}
        ariaLabel="Toggle Rig Setup section"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label htmlFor="form-rig" className="block text-sm font-medium text-stone-300 mb-1">
              Rig <span className="text-red-400">*</span>
            </label>
            <Input
              id="form-rig"
              name="rig"
              value={formData.rig}
              onChange={handleChange('rig')}
              placeholder="Enter rig name..."
              ariaLabel="Rig"
              size="md"
            />
            {errors.rig && (
              <p className="mt-1 text-xs text-red-400">{errors.rig}</p>
            )}
          </div>
          <div>
            <label htmlFor="form-operator" className="block text-sm font-medium text-stone-300 mb-1">
              Operator <span className="text-red-400">*</span>
            </label>
            <Input
              id="form-operator"
              name="operator"
              value={formData.operator}
              onChange={handleChange('operator')}
              placeholder="Enter operator name..."
              ariaLabel="Operator"
              size="md"
            />
            {errors.operator && (
              <p className="mt-1 text-xs text-red-400">{errors.operator}</p>
            )}
          </div>
          <div>
            <label htmlFor="form-contractor" className="block text-sm font-medium text-stone-300 mb-1">
              Contractor <span className="text-red-400">*</span>
            </label>
            <Input
              id="form-contractor"
              name="contractor"
              value={formData.contractor}
              onChange={handleChange('contractor')}
              placeholder="Enter contractor name..."
              ariaLabel="Contractor"
              size="md"
            />
            {errors.contractor && (
              <p className="mt-1 text-xs text-red-400">{errors.contractor}</p>
            )}
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title="Well Setup"
        defaultExpanded={true}
        ariaLabel="Toggle Well Setup section"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label htmlFor="form-wellName" className="block text-sm font-medium text-stone-300 mb-1">
              Well Name <span className="text-red-400">*</span>
            </label>
            <Input
              id="form-wellName"
              name="wellName"
              value={formData.wellName}
              onChange={handleChange('wellName')}
              placeholder="Enter well name..."
              ariaLabel="Well Name"
              size="md"
            />
            {errors.wellName && (
              <p className="mt-1 text-xs text-red-400">{errors.wellName}</p>
            )}
          </div>
          <div>
            <label htmlFor="form-wellId" className="block text-sm font-medium text-stone-300 mb-1">
              Well ID
            </label>
            <Input
              id="form-wellId"
              name="wellId"
              value={formData.wellId}
              onChange={handleChange('wellId')}
              placeholder="Enter well ID..."
              ariaLabel="Well ID"
              size="md"
            />
          </div>
          <div>
            <label htmlFor="form-spudDate" className="block text-sm font-medium text-stone-300 mb-1">
              Spud Date <span className="text-red-400">*</span>
            </label>
            <Input
              id="form-spudDate"
              name="spudDate"
              type="date"
              value={formData.spudDate}
              onChange={handleChange('spudDate')}
              placeholder="YYYY-MM-DD"
              ariaLabel="Spud Date"
              size="md"
            />
            {errors.spudDate && (
              <p className="mt-1 text-xs text-red-400">{errors.spudDate}</p>
            )}
          </div>
          <div>
            <label htmlFor="form-type" className="block text-sm font-medium text-stone-300 mb-1">
              Type
            </label>
            <Input
              id="form-type"
              name="type"
              value={formData.type}
              onChange={handleChange('type')}
              placeholder="e.g. Exploration, Development..."
              ariaLabel="Well Type"
              size="md"
            />
          </div>
          <div>
            <label htmlFor="form-depth" className="block text-sm font-medium text-stone-300 mb-1">
              Depth (ft)
            </label>
            <Input
              id="form-depth"
              name="depth"
              type="number"
              value={formData.depth}
              onChange={handleChange('depth')}
              placeholder="Enter depth in feet..."
              ariaLabel="Depth in feet"
              size="md"
            />
          </div>
          <div>
            <label htmlFor="form-location" className="block text-sm font-medium text-stone-300 mb-1">
              Location
            </label>
            <Input
              id="form-location"
              name="location"
              value={formData.location}
              onChange={handleChange('location')}
              placeholder="Enter location..."
              ariaLabel="Location"
              size="md"
            />
          </div>
        </div>
      </CollapsibleSection>

      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          variant="outline"
          size="md"
          type="button"
          onClick={handleCancel}
          ariaLabel="Cancel"
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          size="md"
          type="submit"
          ariaLabel={isEdit ? 'Save changes' : 'Create well'}
        >
          {isEdit ? 'Save Changes' : 'Create Well'}
        </Button>
      </div>
    </form>
  );
}

WellForm.propTypes = {
  initialData: PropTypes.shape({
    id: PropTypes.string,
    rig: PropTypes.string,
    wellName: PropTypes.string,
    wellId: PropTypes.string,
    operator: PropTypes.string,
    contractor: PropTypes.string,
    spudDate: PropTypes.string,
    status: PropTypes.oneOf(['active', 'inactive']),
    type: PropTypes.string,
    depth: PropTypes.number,
    location: PropTypes.string,
  }),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  mode: PropTypes.oneOf(['create', 'edit']),
  className: PropTypes.string,
};

export default WellForm;