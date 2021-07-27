/* eslint no-shadow: ["error", { "allow": ["state"] }] */

import {
  getAccounts,
  createAccount,
  deleteAccount,
  updateAccount,
} from '../../service';

const state = {
  accounts: {
    items: [],
    isLoading: false,
  },
};

const getters = {
  accountList: (state) => state.accounts.items,
  isAccountListLoading: (state) => state.accounts.isLoading,
};

const actions = {
  async fetchAccounts({ commit }) {
    commit('setAccountsLoading', true);
    const response = await getAccounts();
    if (response.status === 200) {
      const body = await response.json();
      commit('setAccountsLoading', false);
      commit('setAccounts', body);
    }
  },

  async createAccount({ commit }, payload) {
    console.log(payload);
    const response = await createAccount(payload);
    if (response.status === 201) {
      const body = await response.json();
      commit('createAccount', body);
    }
  },

  async deleteAccount({ commit }, id) {
    const response = await deleteAccount(id);
    if (response.status === 204) {
      commit('deleteAccount', id);
    }
  },

  async updateAccount({ commit }, payload) {
    const response = await updateAccount(payload);
    console.log(response.status);
    if (response.status === 200) {
      const body = await response.json();
      commit('updateAccount', body);
    }
  },
};

const mutations = {
  setAccounts(state, accounts) {
    state.accounts.items = accounts;
  },

  createAccount(state, account) {
    state.accounts.items.unshift({ ...account });
  },

  deleteAccount(state, id) {
    state.accounts.items = state.accounts.items.filter((account) => account.id !== id);
  },

  updateAccount(state, account) {
    state.accounts.items = state.accounts.items.map((item) => {
      if (item.id === account.id) {
        return account;
      }
      return item;
    });
  },

  setAccountsLoading(state, isLoading) {
    state.accounts.isLoading = isLoading;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
