/**
 * CreateWellPage component - create well page rendered at /wells/new.
 * Renders WellForm in create mode with empty initial data.
 * On submit, calls createWell from useWells and navigates back to /.
 * On cancel, navigates back to /.
 * Page header shows 'Create New Well' title.
 * Styled consistently with dark theme.
 * @module CreateWellPage
 */

import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWells } from '../hooks/useWells.js';
import { WellForm } from '../components/wells/WellForm.jsx';

/**
 * CreateWellPage renders the create well form view.
 * @returns {React.ReactElement}
 */
export function CreateWellPage() {
  const navigate = useNavigate();
  const { createWell } = useWells();

  /**
   * Handles form submission by creating a new well and navigating back to the list.
   * @param {Object} formData - The well form data
   */
  const handleSubmit = useCallback((formData) => {
    try {
      const result = createWell(formData);
      if (result.success) {
        navigate('/');
      } else {
        console.error('[CreateWellPage] Failed to create well:', result.errors);
      }
    } catch (err) {
      console.error('[CreateWellPage] Unexpected error creating well:', err);
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
            Create New Well
          </h1>
        </div>

        <WellForm
          initialData={null}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          mode="create"
        />
      </div>
    </div>
  );
}

export default CreateWellPage;