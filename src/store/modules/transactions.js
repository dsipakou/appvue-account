/* eslint no-shadow: ["error", { "allow": ["state"] }] */

import {
  getTransactions,
  deleteTransaction,
  updateTransaction,
  createTransaction,
} from '../../service';
import { itemStatus } from '../constants';

const state = {
  transactions: {
    items: [],
    status: itemStatus.INIT,
  },
};

const getters = {
  transactionList: (state) => state.transactions.items,
  transactionListLoaded: (state) => state.transactions.status === itemStatus.LOADED,
};

const actions = {
  async fetchTransactions({ commit }) {
    commit('setTransactionsStatus', itemStatus.LOADING);
    const response = await getTransactions();
    if (response.status === 200) {
      const body = await response.json();
      commit('setTransactionsStatus', itemStatus.LOADED);
      commit('setTransactions', body);
    }
  },

  async createTransaction({ commit }, payload) {
    const response = await createTransaction(payload);
    if (response.status === 201) {
      const body = await response.json();
      commit('createTransaction', body);
    }
  },

  async deleteTransaction({ commit }, id) {
    const response = await deleteTransaction(id);
    if (response.status === 204) {
      commit('deleteTransaction', id);
    }
  },

  async updateTransaction({ commit }, payload) {
    const response = await updateTransaction(payload);
    if (response.status === 200) {
      const body = await response.json();
      commit('updateTransaction', body);
    }
  },
};

const mutations = {
  setTransactions(state, transactions) {
    state.transactions.items = transactions;
  },

  createTransaction(state, transaction) {
    state.transactions.items.unshift({ ...transaction });
  },

  deleteTransaction(state, id) {
    state.transactions.items = state.transactions.items.filter((user) => user.id !== id);
  },

  updateTransaction(state, newItem) {
    state.transactions.items = state.transactions.items.map((item) => {
      if (item.id === newItem.id) {
        return newItem;
      }
      return item;
    });
  },

  setTransactionsStatus(state, status) {
    state.transactions.status = status;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
