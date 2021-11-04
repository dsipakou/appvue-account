/* eslint no-shadow: ["error", { "allow": ["state"] }] */

import {
  getCurrencies,
  createCurrency,
} from '../../service';
import { itemStatus } from '../constants';

const state = {
  currencies: {
    items: [],
    selectedItems: [],
    status: itemStatus.INIT,
  },
};

const getters = {
  currencyList: (state: any) => state.currencies.items,
  currencyListLoaded: (state: any) => state.currencies.status === itemStatus.LOADED,
  selectedCurrencies: (state: any) => state.currencies.selectedItems,
};

const actions = {
  async fetchCurrencies({ commit }: any) {
    commit('setCurrenciesStatus', itemStatus.LOADING);
    const response = await getCurrencies();
    if (response.status === 200) {
      const body = await response.json();
      commit('setCurrenciesStatus', itemStatus.LOADED);
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

  async selectCurrency({ commit }: any, payload: any) {
    commit('selectCurrency', payload);
  },
};

const mutations = {
  setCurrencies(state: any, currencies: any) {
    state.currencies.items = currencies;
  },

  createCurrency(state: any, currency: any) {
    state.currencies.items.unshift({ ...currency });
  },

  selectCurrency(state: any, currencies: any) {
    state.currencies.selectedItems = currencies;
  },

  setCurrenciesStatus(state: any, status: any) {
    state.currencies.status = status;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
