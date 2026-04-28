/**
 * ActivationModal component for well activation flows.
 * Uses Modal component and useActivationModal hook.
 * Displays scenario-specific content:
 * - Scenario 1 (first-activation): Shows well info with emerald border activation notice.
 * - Scenario 2 (switch): Shows red border warning box with currently active well details and demotion notice.
 * Footer has Confirm (success variant) and Cancel (outline variant) buttons.
 * Confirming calls confirmActivation which updates localStorage and refreshes UI.
 * @module ActivationModal
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from '../ui/Modal.jsx';
import { Button } from '../ui/Button.jsx';
import { Badge } from '../ui/Badge.jsx';

/**
 * ActivationModal component renders a modal for well activation confirmation.
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is currently open
 * @param {import('../../constants/mockData.js').Well|null} props.targetWell - The well to be activated
 * @param {import('../../constants/mockData.js').Well|null} props.currentActiveWell - The currently active well on the same rig (if any)
 * @param {'first-activation'|'switch'|null} props.scenario - The activation scenario
 * @param {string|null} props.error - Error message if activation failed
 * @param {Function} props.onConfirm - Confirm activation handler
 * @param {Function} props.onClose - Close/cancel handler
 * @returns {React.ReactElement|null}
 */
export function ActivationModal({
  isOpen,
  targetWell,
  currentActiveWell,
  scenario,
  error,
  onConfirm,
  onClose,
}) {
  if (!isOpen || !targetWell) {
    return null;
  }

  const isSwitch = scenario === 'switch';
  const modalVariant = isSwitch ? 'warning' : 'activation';
  const modalTitle = isSwitch ? 'Switch Active Well' : 'Activate Well';

  const footer = (
    <>
      <Button
        variant="outline"
        size="md"
        onClick={onClose}
        ariaLabel="Cancel activation"
      >
        Cancel
      </Button>
      <Button
        variant="success"
        size="md"
        onClick={onConfirm}
        ariaLabel={isSwitch ? `Confirm switching to ${targetWell.wellName || 'well'}` : `Confirm activation of ${targetWell.wellName || 'well'}`}
      >
        Confirm
      </Button>
    </>
  );

  return (
    <Modal
      open={isOpen}
      title={modalTitle}
      onClose={onClose}
      variant={modalVariant}
      footer={footer}
      ariaLabel={modalTitle}
    >
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      {scenario === 'first-activation' && (
        <div>
          <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <p className="text-sm text-emerald-400">
              This well will be set as the active well for <span className="font-semibold text-emerald-300">{targetWell.rig || 'this rig'}</span>.
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-stone-400">Well Name</span>
              <span className="text-stone-100 font-medium">{targetWell.wellName || '—'}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-stone-400">Well ID</span>
              <span className="text-stone-100 font-medium">{targetWell.wellId || '—'}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-stone-400">Rig</span>
              <span className="text-stone-100 font-medium">{targetWell.rig || '—'}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-stone-400">Operator</span>
              <span className="text-stone-100 font-medium">{targetWell.operator || '—'}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-stone-400">Status</span>
              <Badge variant="inactive" />
            </div>
          </div>
        </div>
      )}

      {scenario === 'switch' && (
        <div>
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
            <p className="text-sm text-red-400">
              <span className="font-semibold text-red-300">Warning:</span> Activating this well will deactivate the currently active well on <span className="font-semibold text-red-300">{targetWell.rig || 'this rig'}</span>.
            </p>
          </div>

          {currentActiveWell && (
            <div className="mb-4">
              <h3 className="text-xs uppercase tracking-wider text-stone-500 mb-2">Currently Active Well (will be deactivated)</h3>
              <div className="p-3 rounded-lg bg-stone-800 border border-stone-700 space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-stone-400">Well Name</span>
                  <span className="text-stone-100 font-medium">{currentActiveWell.wellName || '—'}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-stone-400">Well ID</span>
                  <span className="text-stone-100 font-medium">{currentActiveWell.wellId || '—'}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-stone-400">Status</span>
                  <Badge variant="active" />
                </div>
              </div>
            </div>
          )}

          <div>
            <h3 className="text-xs uppercase tracking-wider text-stone-500 mb-2">New Active Well</h3>
            <div className="p-3 rounded-lg bg-stone-800 border border-stone-700 space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-stone-400">Well Name</span>
                <span className="text-stone-100 font-medium">{targetWell.wellName || '—'}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-stone-400">Well ID</span>
                <span className="text-stone-100 font-medium">{targetWell.wellId || '—'}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-stone-400">Operator</span>
                <span className="text-stone-100 font-medium">{targetWell.operator || '—'}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-stone-400">Status</span>
                <Badge variant="inactive" />
              </div>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}

ActivationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  targetWell: PropTypes.shape({
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
  }),
  currentActiveWell: PropTypes.shape({
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
  }),
  scenario: PropTypes.oneOf(['first-activation', 'switch']),
  error: PropTypes.string,
  onConfirm: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ActivationModal;