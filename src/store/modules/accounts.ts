/* eslint no-shadow: ["error", { "allow": ["state"] }] */

import {
  getAccounts,
  createAccount,
  deleteAccount,
  updateAccount,
} from '../../service/accounts';

const state = {
  accounts: {
    items: [],
    isLoading: false,
  },
};

const getters = {
  accountList: (state: any) => state.accounts.items,
  isAccountListLoading: (state: any) => state.accounts.isLoading,
};

const actions = {
  async fetchAccounts({ commit }: any) {
    commit('setAccountsLoading', true);
    const response = await getAccounts();
    if (response.status === 200) {
      const body = await response.json();
      commit('setAccountsLoading', false);
      commit('setAccounts', body);
    }
  },

  async createAccount({ commit }: any, payload: any) {
    const response = await createAccount(payload);
    if (response.status === 201) {
      const body = await response.json();
      commit('createAccount', body);
    }
  },

  async deleteAccount({ commit }: any, uuid: string) {
    const response = await deleteAccount(uuid);
    if (response.status === 204) {
      commit('deleteAccount', uuid);
    }
  },

  async updateAccount({ commit }: any, payload: any) {
    const response = await updateAccount(payload);
    if (response.status === 200) {
      const body = await response.json();
      commit('updateAccount', body);
    }
  },
};

const mutations = {
  setAccounts(state: any, accounts: any) {
    state.accounts.items = accounts;
  },

  createAccount(state: any, account: any) {
    state.accounts.items.unshift({ ...account });
  },

  deleteAccount(state: any, uuid: any) {
    state.accounts.items = state.accounts.items.filter((account: any) => account.uuid !== uuid);
  },

  updateAccount(state: any, account: any) {
    state.accounts.items = state.accounts.items.map((item: any) => {
      if (item.uuid === account.uuid) {
        return account;
      }
      return item;
    });
  },

  setAccountsLoading(state: any, isLoading: any) {
    state.accounts.isLoading = isLoading;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
