/**
 * WellDetailPage component - well detail/view page rendered at /wells/:id.
 * Loads well data from localStorage using the id URL param.
 * Displays all well fields in a read-only layout with proper dark theme styling.
 * Shows well status with Badge component.
 * Includes Back to List button (navigates to /) and Edit button (navigates to /wells/:id/edit).
 * Handles well-not-found gracefully.
 * @module WellDetailPage
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getWellById } from '../services/wellRepository.js';
import { Badge } from '../components/ui/Badge.jsx';
import { Button } from '../components/ui/Button.jsx';

/**
 * DetailField renders a single label/value pair in the detail layout.
 * @param {Object} props
 * @param {string} props.label - The field label
 * @param {React.ReactNode} props.children - The field value content
 * @returns {React.ReactElement}
 */
function DetailField({ label, children }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs uppercase tracking-wider text-stone-500 font-medium">
        {label}
      </span>
      <span className="text-sm text-stone-100">
        {children !== undefined && children !== null && children !== '' ? children : '—'}
      </span>
    </div>
  );
}

/**
 * WellDetailPage renders the well detail view with all well fields displayed read-only.
 * @returns {React.ReactElement}
 */
export function WellDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

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
      console.error('[WellDetailPage] Error loading well:', err);
      setError('An unexpected error occurred while loading the well.');
      setLoading(false);
    }
  }, [id]);

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
              Well Details
            </h1>
          </div>
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-6">
            {error}
          </div>
          <Button
            variant="outline"
            size="md"
            onClick={() => navigate('/')}
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
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-stone-100">
              {well.wellName || 'Well Details'}
            </h1>
            <p className="mt-1 text-sm text-stone-400">
              Viewing details for {well.wellId || 'this well'}.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="md"
              onClick={() => navigate('/')}
              ariaLabel="Back to well list"
            >
              Back to List
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate(`/wells/${well.id}/edit`)}
              ariaLabel={`Edit ${well.wellName || 'well'}`}
            >
              Edit
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-stone-900 border border-stone-700 rounded-lg p-6">
            <h2 className="text-sm font-semibold text-stone-100 uppercase tracking-wider mb-4">
              Rig Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <DetailField label="Rig">
                {well.rig}
              </DetailField>
              <DetailField label="Operator">
                {well.operator}
              </DetailField>
              <DetailField label="Contractor">
                {well.contractor}
              </DetailField>
            </div>
          </div>

          <div className="bg-stone-900 border border-stone-700 rounded-lg p-6">
            <h2 className="text-sm font-semibold text-stone-100 uppercase tracking-wider mb-4">
              Well Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <DetailField label="Well Name">
                {well.wellName}
              </DetailField>
              <DetailField label="Well ID">
                {well.wellId}
              </DetailField>
              <DetailField label="Spud Date">
                {well.spudDate}
              </DetailField>
              <DetailField label="Type">
                {well.type}
              </DetailField>
              <DetailField label="Depth (ft)">
                {well.depth !== undefined && well.depth !== null ? String(well.depth) : ''}
              </DetailField>
              <DetailField label="Location">
                {well.location}
              </DetailField>
              <DetailField label="Status">
                <Badge variant={well.status === 'active' ? 'active' : 'inactive'} />
              </DetailField>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WellDetailPage;