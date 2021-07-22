/* eslint no-shadow: ["error", { "allow": ["state"] }] */

import {
  getTransactions,
  deleteTransaction,
  updateTransaction,
  createTransaction,
} from '../../service';

const state = {
  transactions: {
    items: [],
    isLoading: false,
  },
};

const getters = {
  transactionList: (state) => state.transactions.items,
  isTransactionListLoading: (state) => state.transactions.isLoading,
};

const actions = {
  async fetchTransactions({ commit }) {
    commit('setTransactionsLoading', true);
    const response = await getTransactions();
    commit('setTransactionsLoading', false);
    commit('setTransactions', response);
  },

  async createTransaction({ commit }, payload) {
    const response = await createTransaction(payload);
    if (response.status === 201) {
      const body = await response.json();
      const transaction = { ...payload, id: body.id };
      commit('createTransaction', transaction);
    }
  },

  async deleteTransaction({ commit }, id) {
    const response = await deleteTransaction(id);
    if (response === 204) {
      commit('deleteTransaction', id);
    }
  },

  async updateTransaction({ commit }, payload) {
    const response = await updateTransaction(payload);
    if (response === 200) {
      commit('updateTransaction', payload);
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

  setTransactionsLoading(state, isLoading) {
    state.transactions.isLoading = isLoading;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
