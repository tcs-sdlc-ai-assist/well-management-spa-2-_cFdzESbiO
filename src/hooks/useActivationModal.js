/**
 * Custom hook implementing WellActivationModalController logic.
 * Manages modal state for well activation flows including scenario detection
 * (first-activation vs switching) and activation confirmation.
 * @module useActivationModal
 */

import { useState, useCallback, useMemo } from 'react';
import { useWells } from './useWells.js';

/**
 * @typedef {'first-activation'|'switch'} ActivationScenario
 */

/**
 * @typedef {Object} ActivationModalState
 * @property {boolean} isOpen - Whether the modal is currently open
 * @property {import('../constants/mockData.js').Well|null} targetWell - The well to be activated
 * @property {import('../constants/mockData.js').Well|null} currentActiveWell - The currently active well on the same rig (if any)
 * @property {ActivationScenario|null} scenario - The activation scenario
 * @property {string|null} error - Error message if activation failed
 */

/**
 * Custom hook that manages activation modal state and flows.
 * Determines the activation scenario based on current rig state,
 * handles confirmation, and exposes modal state.
 *
 * @returns {{
 *   isOpen: boolean,
 *   targetWell: import('../constants/mockData.js').Well|null,
 *   currentActiveWell: import('../constants/mockData.js').Well|null,
 *   scenario: ActivationScenario|null,
 *   error: string|null,
 *   openModal: (well: import('../constants/mockData.js').Well) => void,
 *   closeModal: () => void,
 *   confirmActivation: () => import('../services/wellListManager.js').ActivationResult|null,
 *   getModalState: () => ActivationModalState,
 * }}
 */
export function useActivationModal() {
  const { activateWell, getActiveWellForRig } = useWells();

  const [isOpen, setIsOpen] = useState(false);
  const [targetWell, setTargetWell] = useState(null);
  const [currentActiveWell, setCurrentActiveWell] = useState(null);
  const [scenario, setScenario] = useState(null);
  const [error, setError] = useState(null);

  /**
   * Opens the activation modal for a given well.
   * Determines the scenario based on whether another well is currently active on the same rig.
   * @param {import('../constants/mockData.js').Well} well - The well to activate
   */
  const openModal = useCallback((well) => {
    if (!well) {
      return;
    }

    const activeWell = getActiveWellForRig(well.rig);

    setTargetWell(well);
    setError(null);

    if (activeWell && activeWell.id !== well.id) {
      setCurrentActiveWell(activeWell);
      setScenario('switch');
    } else {
      setCurrentActiveWell(null);
      setScenario('first-activation');
    }

    setIsOpen(true);
  }, [getActiveWellForRig]);

  /**
   * Closes the modal and resets all state.
   */
  const closeModal = useCallback(() => {
    setIsOpen(false);
    setTargetWell(null);
    setCurrentActiveWell(null);
    setScenario(null);
    setError(null);
  }, []);

  /**
   * Confirms the activation of the target well.
   * Calls activateWell and closes the modal on success.
   * Sets error state on failure.
   * @returns {import('../services/wellListManager.js').ActivationResult|null} The activation result, or null if no target well
   */
  const confirmActivation = useCallback(() => {
    if (!targetWell) {
      return null;
    }

    const result = activateWell(targetWell.id);

    if (result.success) {
      setIsOpen(false);
      setTargetWell(null);
      setCurrentActiveWell(null);
      setScenario(null);
      setError(null);
    } else {
      setError(result.error || 'An unexpected error occurred during activation.');
    }

    return result;
  }, [targetWell, activateWell]);

  /**
   * Returns the current modal state as a single object.
   * @returns {ActivationModalState} The current modal state
   */
  const getModalState = useCallback(() => {
    return {
      isOpen,
      targetWell,
      currentActiveWell,
      scenario,
      error,
    };
  }, [isOpen, targetWell, currentActiveWell, scenario, error]);

  return useMemo(() => ({
    isOpen,
    targetWell,
    currentActiveWell,
    scenario,
    error,
    openModal,
    closeModal,
    confirmActivation,
    getModalState,
  }), [
    isOpen,
    targetWell,
    currentActiveWell,
    scenario,
    error,
    openModal,
    closeModal,
    confirmActivation,
    getModalState,
  ]);
}

export default useActivationModal;