/* eslint no-shadow: ["error", { "allow": ["state"] }] */

import {
  getRates,
} from '../../service';

const state = {
  rates: {
    items: [],
    isLoading: false,
  },
};

const getters = {
  ratesList: (state) => state.rates.items,
  isRatesListLoading: (state) => state.rates.isLoading,
};

const actions = {
  async fetchRates({ commit }) {
    commit('setRatesLoading', true);
    const response = await getRates();
    if (response.status === 200) {
      const body = await response.json();
      commit('setRatesLoading', false);
      commit('setRates', body);
    }
  },
};

const mutations = {
  setRates(state, rates) {
    state.rates.items = rates;
  },

  setRatesLoading(state, isLoading) {
    state.rates.isLoading = isLoading;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
