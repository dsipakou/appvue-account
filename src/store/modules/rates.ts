/* eslint no-shadow: ["error", { "allow": ["state"] }] */
/* eslint import/no-cycle: [2, { maxDepth: 1 }] */

import { AvailableRates, BatchedRatesRequestPayload } from '@/types';
import {
  getRates,
  getRatesOnDate,
  createRate,
  createBatchedRate,
  updateRate,
  getRateChartData,
  getAvailableRates,
} from '../../service/rates';

const state = {
  rates: {
    items: [],
    listOnDate: [],
    isLoading: false,
    chart: [],
    availableRates: {},
  },
};

const getters = {
  ratesList: (state: any) => state.rates.items,
  availableRates: (state: any) => state.rates.availableRates,
  rateListOnDate: (state: any) => state.rates.listOnDate,
  isRatesListLoading: (state: any) => state.rates.isLoading,
  ratesChartData: (state: any) => state.rates.chart,
};

const actions = {
  async fetchRates({ commit }: any) {
    commit('setRatesLoading', true);
    const response = await getRates();
    if (response.status === 200) {
      const body = await response.json();
      commit('setRates', body);
    }
    commit('setRatesLoading', false);
  },

  async getAvailableRates({ commit }: any, date: string) {
    commit('setRatesLoading', true);
    const response = await getAvailableRates(date);
    if (response.status === 200) {
      const body = await response.json();
      commit('setAvailableRates', body);
    }
    commit('setRatesLoading', false);
  },

  async fetchRatesOnDate({ commit }: any, date: string) {
    commit('setRatesLoading', true);
    const response = await getRatesOnDate(date);
    if (response.status === 200) {
      const body = await response.json();
      commit('setRatesOnDate', body);
    }
    commit('setRatesLoading', false);
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
    commit('setRatesLoading', true);
    const response = await createRate(payload);
    if (response.status === 201) {
      const body = await response.json();
      commit('createRate', body);
    }
    commit('setRatesLoading', false);
  },

  async createBatchedRate({ commit }: any, payload: BatchedRatesRequestPayload) {
    commit('setRatesLoading', true);
    const response = await createBatchedRate(payload);
    if (response.status === 201) {
      const body = await response.json();
      console.log(body);
    }
    commit('setRatesLoading', false);
  },

  async updateRate({ commit }: any, payload: any) {
    commit('setRatesLoading', true);
    const response = await updateRate(payload);
    if (response.status === 200) {
      commit('updateRate', payload);
    }
    commit('setRatesLoading', false);
  },
};

const mutations = {
  setRates(state: any, rates: any) {
    state.rates.items = rates;
  },

  setAvailableRates(state: any, availableRates: AvailableRates) {
    state.rates.availableRates = availableRates;
  },

  setRatesOnDate(state: any, rates: any) {
    state.rates.listOnDate = rates;
  },

  setRatesChartData(state: any, data: any) {
    state.rates.chart = data;
  },

  createRate(state: any, rate: any) {
    state.rates.items.unshift({ ...rate });
    state.rates.listOnDate.unshift({ ...rate });
  },

  updateRate(state: any, rate: any) {
    state.rates.items = state.rates.items.map(
      (item: any) => (
        item.uuid !== rate.uuid
          ? item
          : {
            ...item,
            rate: rate.rate,
          }
      ),
    );

    state.rates.listOnDate = state.rates.listOnDate.map(
      (item: any) => (
        item.uuid !== rate.uuid
          ? item
          : {
            ...item,
            rate: rate.rate,
          }
      ),
    );
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
