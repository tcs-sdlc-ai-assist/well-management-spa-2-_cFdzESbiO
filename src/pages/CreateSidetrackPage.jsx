/**
 * CreateSidetrackPage component - create sidetrack well page rendered at /wells/sidetrack/new.
 * Similar to CreateWellPage but with sidetrack-specific context/defaults.
 * Renders WellForm in create mode with sidetrack type pre-filled.
 * On submit, calls createWell with sidetrack flag and navigates back to /.
 * On cancel, navigates back to /.
 * Page header shows 'Create Sidetrack Well' title.
 * Styled consistently with dark theme.
 * @module CreateSidetrackPage
 */

import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWells } from '../hooks/useWells.js';
import { WellForm } from '../components/wells/WellForm.jsx';

/**
 * Default initial data for a sidetrack well form.
 * Pre-fills the type field with 'Sidetrack'.
 * @type {Object}
 */
const sidetrackDefaults = {
  rig: '',
  operator: '',
  contractor: '',
  wellName: '',
  wellId: '',
  spudDate: '',
  type: 'Sidetrack',
  depth: undefined,
  location: '',
};

/**
 * CreateSidetrackPage renders the create sidetrack well form view.
 * @returns {React.ReactElement}
 */
export function CreateSidetrackPage() {
  const navigate = useNavigate();
  const { createWell } = useWells();

  /**
   * Handles form submission by creating a new sidetrack well and navigating back to the list.
   * @param {Object} formData - The well form data
   */
  const handleSubmit = useCallback((formData) => {
    try {
      const sidetrackData = {
        ...formData,
        type: formData.type || 'Sidetrack',
      };
      const result = createWell(sidetrackData);
      if (result.success) {
        navigate('/');
      } else {
        console.error('[CreateSidetrackPage] Failed to create sidetrack well:', result.errors);
      }
    } catch (err) {
      console.error('[CreateSidetrackPage] Unexpected error creating sidetrack well:', err);
    }
  }, [createWell, navigate]);

  /**
   * Handles cancel action by navigating back to the well list.
   */
  const handleCancel = useCallback(() => {
    navigate('/');
  }, [navigate]);

  return (
    <div className="min-h-screen bg-stone-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-stone-100">
            Create Sidetrack Well
          </h1>
          <p className="mt-1 text-sm text-stone-400">
            Create a new sidetrack well entry with pre-filled sidetrack defaults.
          </p>
        </div>

        <WellForm
          initialData={sidetrackDefaults}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          mode="create"
        />
      </div>
    </div>
  );
}

export default CreateSidetrackPage;