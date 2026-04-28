/**
 * EditWellPage component - edit well page rendered at /wells/:id/edit.
 * Loads well data from localStorage via wellRepository using the id URL param.
 * Renders WellForm in edit mode with well data as initialData.
 * On submit, calls updateWell and navigates back to /.
 * On cancel, navigates back to /.
 * Shows loading state while fetching. Handles well-not-found with error message.
 * @module EditWellPage
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useWells } from '../hooks/useWells.js';
import { getWellById } from '../services/wellRepository.js';
import { WellForm } from '../components/wells/WellForm.jsx';
import { Button } from '../components/ui/Button.jsx';

/**
 * EditWellPage renders the edit well form view.
 * Loads well data by id from URL params, displays loading/error states,
 * and renders WellForm in edit mode when data is available.
 * @returns {React.ReactElement}
 */
export function EditWellPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateWell } = useWells();

  const [well, setWell] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Loads well data from localStorage on mount or when id changes.
   */
  useEffect(() => {
    try {
      setLoading(true);
      setError(null);

      if (!id) {
        setError('No well ID provided.');
        setLoading(false);
        return;
      }

      const foundWell = getWellById(id);

      if (!foundWell) {
        setError(`Well with ID "${id}" not found.`);
        setLoading(false);
        return;
      }

      setWell(foundWell);
      setLoading(false);
    } catch (err) {
      console.error('[EditWellPage] Error loading well:', err);
      setError('An unexpected error occurred while loading the well.');
      setLoading(false);
    }
  }, [id]);

  /**
   * Handles form submission by updating the well and navigating back to the list.
   * @param {Object} formData - The well form data
   */
  const handleSubmit = useCallback((formData) => {
    try {
      const result = updateWell(formData);
      if (result.success) {
        navigate('/');
      } else {
        console.error('[EditWellPage] Failed to update well:', result.errors);
        setError(result.errors.join(' '));
      }
    } catch (err) {
      console.error('[EditWellPage] Unexpected error updating well:', err);
      setError('An unexpected error occurred while saving the well.');
    }
  }, [updateWell, navigate]);

  /**
   * Handles cancel action by navigating back to the well list.
   */
  const handleCancel = useCallback(() => {
    navigate('/');
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-16">
            <div className="text-stone-400 text-sm">Loading well data...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-stone-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-stone-100">
              Edit Well
            </h1>
          </div>
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-6">
            {error}
          </div>
          <Button
            variant="outline"
            size="md"
            onClick={handleCancel}
            ariaLabel="Back to well list"
          >
            Back to Well List
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-stone-100">
            Edit Well
          </h1>
          <p className="mt-1 text-sm text-stone-400">
            Update the details for {well.wellName || 'this well'}.
          </p>
        </div>

        <WellForm
          initialData={well}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          mode="edit"
        />
      </div>
    </div>
  );
}

export default EditWellPage;