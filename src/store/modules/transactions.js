/* eslint no-shadow: ["error", { "allow": ["state"] }] */

import { getTransactions } from '../../service';

const state = {
  transactions: [],
};

const getters = {
  transactionList: (state) => state.transactions,
};

const actions = {
  async fetchTransactions({ commit }) {
    const response = await getTransactions();
    commit('setTransactions', response);
  },
};

const mutations = {
  setTransactions(state, transactions) {
    state.transactions = transactions;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
