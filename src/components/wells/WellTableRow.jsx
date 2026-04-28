/**
 * WellTableRow component for rendering a single well in the well list table.
 * Renders well data cells including rig, wellName, wellId, operator, contractor,
 * spudDate, and status (via Badge component).
 * Active rows receive highlighted styling with border-l-4 border-emerald-500 bg-stone-800/50.
 * Action buttons include View Details, Edit, and Activate (conditional).
 * Uses react-router-dom useNavigate for routing.
 * @module WellTableRow
 */

import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../ui/Badge.jsx';
import { Button } from '../ui/Button.jsx';
import { designTokens } from '../../constants/designTokens.js';

/**
 * WellTableRow component renders a single well as a table row.
 * @param {Object} props
 * @param {import('../../constants/mockData.js').Well} props.well - The well object to display
 * @param {Function} [props.onActivate] - Callback when the Activate button is clicked, called with (well)
 * @returns {React.ReactElement}
 */
export function WellTableRow({ well, onActivate }) {
  const navigate = useNavigate();

  const isActive = well.status === 'active';

  const rowClasses = isActive
    ? [
        designTokens.activeRow.base,
        'border-b border-stone-800 transition-colors duration-150',
      ].join(' ')
    : designTokens.table.row;

  /**
   * Navigates to the well detail page.
   */
  const handleViewDetails = () => {
    navigate(`/wells/${well.id}`);
  };

  /**
   * Navigates to the well edit page.
   */
  const handleEdit = () => {
    navigate(`/wells/${well.id}/edit`);
  };

  /**
   * Calls the onActivate callback with the well object.
   */
  const handleActivate = () => {
    if (onActivate && typeof onActivate === 'function') {
      onActivate(well);
    }
  };

  return (
    <tr
      className={rowClasses}
      aria-selected={isActive || undefined}
    >
      <td className={designTokens.table.cell}>
        {well.rig || ''}
      </td>
      <td className={designTokens.table.cell}>
        {well.wellName || ''}
      </td>
      <td className={designTokens.table.cell}>
        {well.wellId || ''}
      </td>
      <td className={designTokens.table.cell}>
        {well.operator || ''}
      </td>
      <td className={designTokens.table.cell}>
        {well.contractor || ''}
      </td>
      <td className={designTokens.table.cell}>
        {well.spudDate || ''}
      </td>
      <td className={designTokens.table.cell}>
        <Badge variant={isActive ? 'active' : 'inactive'} />
      </td>
      <td className={designTokens.table.cell}>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="md"
            onClick={handleViewDetails}
            ariaLabel={`View details for ${well.wellName || 'well'}`}
            className="px-2.5 py-1 text-xs"
          >
            View Details
          </Button>
          <Button
            variant="secondary"
            size="md"
            onClick={handleEdit}
            ariaLabel={`Edit ${well.wellName || 'well'}`}
            className="px-2.5 py-1 text-xs"
          >
            Edit
          </Button>
          {!isActive && (
            <Button
              variant="success"
              size="md"
              onClick={handleActivate}
              ariaLabel={`Activate ${well.wellName || 'well'}`}
              className="px-2.5 py-1 text-xs"
            >
              Activate
            </Button>
          )}
        </div>
      </td>
    </tr>
  );
}

WellTableRow.propTypes = {
  well: PropTypes.shape({
    id: PropTypes.string.isRequired,
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
  }).isRequired,
  onActivate: PropTypes.func,
};

export default WellTableRow;