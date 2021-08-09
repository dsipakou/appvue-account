/* eslint no-shadow: ["error", { "allow": ["state"] }] */

import {
  getCurrencies,
  createCurrency,
} from '../../service';
import { itemStatus } from '../constants';

const state = {
  currencies: {
    items: [],
    status: itemStatus.INIT,
  },
};

const getters = {
  currencyList: (state) => state.currencies.items,
  currencyListLoaded: (state) => state.currencies.status === itemStatus.LOADED,
};

const actions = {
  async fetchCurrencies({ commit }) {
    commit('setCurrenciesStatus', itemStatus.LOADING);
    const response = await getCurrencies();
    if (response.status === 200) {
      const body = await response.json();
      commit('setCurrenciesStatus', itemStatus.LOADED);
      commit('setCurrencies', body);
    }
  },

  async createCurrency({ commit }, payload) {
    const response = await createCurrency(payload);
    if (response.status === 201) {
      const body = await response.json();
      commit('createCurrency', body);
    }
  },
};

const mutations = {
  setCurrencies(state, currencies) {
    state.currencies.items = currencies;
  },

  createCurrency(state, currency) {
    state.currencies.items.unshift({ ...currency });
  },

  setCurrenciesStatus(state, status) {
    state.currencies.status = status;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
