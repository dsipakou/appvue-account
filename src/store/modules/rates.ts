/* eslint no-shadow: ["error", { "allow": ["state"] }] */

import {
  getRates,
  createRate,
} from '../../service';

const state = {
  rates: {
    items: [],
    isLoading: false,
  },
};

const getters = {
  ratesList: (state: any) => state.rates.items,
  isRatesListLoading: (state: any) => state.rates.isLoading,
};

const actions = {
  async fetchRates({ commit }: any) {
    commit('setRatesLoading', true);
    const response = await getRates();
    if (response.status === 200) {
      const body = await response.json();
      commit('setRatesLoading', false);
      commit('setRates', body);
    }
  },

  async createRate({ commit }: any, payload: any) {
    const response = await createRate(payload);
    if (response.status === 201) {
      const body = await response.json();
      commit('createRate', body);
    }
  },
};

const mutations = {
  setRates(state: any, rates: any) {
    state.rates.items = rates;
  },

  createRate(state: any, rate: any) {
    state.rates.items.unshift({ ...rate });
  },

  setRatesLoading(state: any, isLoading: boolean) {
    state.rates.isLoading = isLoading;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
