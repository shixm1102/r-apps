// [object Object]
// SPDX-License-Identifier: Apache-2.0
import { createSelector } from 'redux-bundler';

import { ACTIONS } from './ipfs-provider';

/**
 * @typedef {import('./ipfs-provider').Message} Message
 * @typedef {Object} Model
 * @property {number} [startedAt]
 * @property {number} [failedAt]
 *
 * @typedef {Object} State
 * @property {Model} retryInit
 */

// We ask for the stats every few seconds, so that gives a good indication
// that ipfs things are working (or not), without additional polling of the api.
const retryInit = {
  name: 'retryInit',

  /**
   * @param {Model} state
   * @param {Message} action
   * @returns {Model}
   */
  reducer: (state = {}, action) => {
    switch (action.type) {
      case ACTIONS.IPFS_INIT: {
        const { task } = action;

        switch (task.status) {
          case 'Init': {
            return { ...state, startedAt: Date.now() };
          }

          case 'Exit': {
            if (task.result.ok) {
              return state;
            } else {
              return { ...state, failedAt: Date.now() };
            }
          }

          default: {
            return state;
          }
        }
      }

      default: {
        return state;
      }
    }
  },

  /**
   * @param {State} state
   */
  selectInitStartedAt: (state) => state.retryInit.startedAt,

  /**
   * @param {State} state
   */
  selectInitFailedAt: (state) => state.retryInit.failedAt,

  reactConnectionInitRetry: createSelector(
    'selectAppTime',
    'selectInitStartedAt',
    'selectInitFailedAt',
    'selectHash',
    /**
     * @param {number} appTime
     * @param {number|void} startedAt
     * @param {number|void} failedAt
     */
    (appTime, startedAt, failedAt, hash) => {
      if (hash.startsWith('/storage_files') || hash === '/storage' || hash === '/' || hash === '' || !hash.startsWith('/storage')) return false;
      if (!failedAt || failedAt < startedAt) return false;
      if (appTime - failedAt < 3000) return false;

      return { actionCreator: 'doTryInitIpfs' };
    }
  )
};

export default retryInit;
