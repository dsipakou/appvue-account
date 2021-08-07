/* eslint no-shadow: ["error", { "allow": ["state"] }] */

import {
  getCurrencies,
  createCurrency,
} from '../../service';

const state = {
  currencies: {
    items: [],
    isLoading: false,
  },
};

const getters = {
  currenciesList: (state) => state.currencies.items,
  isCurrencyListLoading: (state) => state.currencies.isLoading,
};

const actions = {
  async fetchCurrencies({ commit }) {
    commit('setCurrenciesLoading', true);
    const response = await getCurrencies();
    if (response.status === 200) {
      const body = await response.json();
      commit('setCurrenciesLoading', false);
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

  setCurrenciesLoading(state, isLoading) {
    state.currencies.isLoading = isLoading;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
