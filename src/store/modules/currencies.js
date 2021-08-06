/* eslint no-shadow: ["error", { "allow": ["state"] }] */

import {
  getCurrencies,
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
};

const mutations = {
  setCurrencies(state, currencies) {
    state.currencies.items = currencies;
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
