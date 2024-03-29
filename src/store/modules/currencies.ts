/* eslint no-shadow: ["error", { "allow": ["state"] }] */
/* eslint import/no-cycle: [2, { maxDepth: 1 }] */

import {
  getCurrencies,
  createCurrency,
  updateCurrency,
  deleteCurrency,
} from '../../service/currency';
import * as constants from '../constants';

const state = {
  currencies: {
    items: [],
    selectedItems: [],
    status: constants.itemStatus.INIT,
    range: constants.ChartRange.Month,
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
      commit('setCurrencies', body);
    }
    commit('setCurrenciesStatus', constants.itemStatus.LOADED);
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

  async deleteCurrency({ commit }: any, uuid: string) {
    const response = await deleteCurrency(uuid);
    if (response.status === 204) {
      commit('deleteCurrency', uuid);
    }
  },

  async selectCurrency({ commit }: any, payload: any) {
    commit('selectCurrency', payload);
  },

  async selectCurrencyRange({ commit }: any, payload: string) {
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
      if (item.uuid === newItem.uuid) {
        return newItem;
      }
      return item;
    });
  },

  deleteCurrency(state: any, uuid: string) {
    state.currencies.items = state.currencies.items.filter(
      (currency: any) => currency.uuid !== uuid,
    );
  },

  selectCurrency(state: any, code: string) {
    const isExist = state.currencies.selectedItems.find((item: string) => item === code);
    if (isExist) {
      state.currencies.selectedItems = state.currencies.selectedItems.filter(
        (item: string) => item !== code,
      );
    } else {
      state.currencies.selectedItems.push(code);
    }
  },

  setCurrenciesStatus(state: any, status: any) {
    state.currencies.status = status;
  },

  setRange(state: any, range: string) {
    state.currencies.range = range;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
