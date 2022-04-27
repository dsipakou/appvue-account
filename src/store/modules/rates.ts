/* eslint no-shadow: ["error", { "allow": ["state"] }] */

import {
  getRates,
  createRate,
  getRateChartData,
} from '../../service/rates';

const state = {
  rates: {
    items: [],
    isLoading: false,
    chart: [],
  },
};

const getters = {
  ratesList: (state: any) => state.rates.items,
  isRatesListLoading: (state: any) => state.rates.isLoading,
  ratesChartData: (state: any) => state.rates.chart,
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

  async fetchChartData({ commit }: any, range: number = 30) {
    commit('setRatesLoading', true);
    const response = await getRateChartData(range);
    if (response.status === 200) {
      const body = await response.json();
      commit('setRatesChartData', body);
    }
    commit('setRatesLoading', false);
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

  setRatesChartData(state: any, data: any) {
    state.rates.chart = data;
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
