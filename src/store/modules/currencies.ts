/* eslint no-shadow: ["error", { "allow": ["state"] }] */

import {
  getCurrencies,
  createCurrency,
  updateCurrency,
} from '../../service';
import * as constants from '../constants';

const state = {
  currencies: {
    items: [],
    selectedItems: [],
    status: constants.itemStatus.INIT,
    range: constants.Range.Month,
  },
};

const getters = {
  currencyList: (state: any) => state.currencies.items,
  currencyListLoaded: (state: any) => state.currencies.status === constants.itemStatus.LOADED,
  selectedCurrencies: (state: any) => state.currencies.selectedItems,
  currencyRange: (state: any) => state.currencies.range,
};

const actions = {
  async fetchCurrencies({ commit }: any) {
    commit('setCurrenciesStatus', constants.itemStatus.LOADING);
    const response = await getCurrencies();
    if (response.status === 200) {
      const body = await response.json();
      commit('setCurrenciesStatus', constants.itemStatus.LOADED);
      commit('setCurrencies', body);
    }
  },

  async createCurrency({ commit }: any, payload: any) {
    const response = await createCurrency(payload);
    if (response.status === 201) {
      const body = await response.json();
      commit('createCurrency', body);
    }
  },

  async updateCurrency({ commit }: any, payload: any) {
    const response = await updateCurrency(payload);

    if (response.status === 200) {
      const body = await response.json();
      commit('updateCurrency', body);
    }
  },

  async selectCurrency({ commit }: any, payload: any) {
    commit('selectCurrency', payload);
  },

  async selectCurrencyRange({ commit }: any, payload: Range) {
    commit('setRange', payload);
  },
};

const mutations = {
  setCurrencies(state: any, currencies: any) {
    state.currencies.items = currencies;
  },

  createCurrency(state: any, currency: any) {
    state.currencies.items.unshift({ ...currency });
  },

  updateCurrency(state: any, newItem: any) {
    state.currencies.items = state.currencies.items.map((item: any) => {
      if (item.id === newItem.id) {
        return newItem;
      }
      return item;
    });
  },

  selectCurrency(state: any, currencies: any) {
    state.currencies.selectedItems = currencies;
  },

  setCurrenciesStatus(state: any, status: any) {
    state.currencies.status = status;
  },

  setRange(state: any, range: Range) {
    state.currencies.range = range;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
