/* eslint no-shadow: ["error", { "allow": ["state"] }] */

import {
  getTransactions,
  getGroupedTransactions,
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

  groupedTransactions: {
    items: [],
    status: itemStatus.INIT,
  },
};

const getters = {
  transactionList: (state) => state.transactions.items,
  groupedTransactionList: (state) => state.groupedTransactions.items,
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

  async fetchGroupedTransaction({ commit }, payload) {
    commit('setGroupedTransactionsStatus', itemStatus.LOADING);
    const response = await getGroupedTransactions(payload);
    if (response.status === 200) {
      const body = await response.json();
      commit('setGroupedTransactionsStatus', itemStatus.LOADING);
      commit('setGroupedTransactions', body);
    }
  },

  async createTransaction({ commit }, payload) {
    const response = await createTransaction(payload);
    if (response.status === 201) {
      const body = await response.json();
      commit('createTransaction', body);
    }
  },

  async transferBetweenAccounts({ commit }, payload) {

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

  setGroupedTransactions(state, amounts) {
    state.groupedTransactions.items = amounts;
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

  setGroupedTransactionsStatus(state, status) {
    state.groupedTransactions.status = status;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
