/* eslint no-shadow: ["error", { "allow": ["state"] }] */

import { getTransactions } from '../../service';

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
};

const mutations = {
  setTransactions(state, transactions) {
    state.transactions.items = transactions;
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
