/* eslint no-shadow: ["error", { "allow": ["state"] }] */

import { getDate, getMonth, getYear } from 'date-fns';
import {
  getTransactions,
  getGroupedTransactions,
  deleteTransaction,
  updateTransaction,
  createTransaction,
} from '@/service/transactions';
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

  archive: {
    month: getMonth(new Date()) + 1,
    day: getDate(new Date()),
    year: getYear(new Date()),
  },

  lastAdded: {
    date: null,
    budget: null,
  },
};

const getters = {
  transactionList: (state: any) => state.transactions.items,
  groupedTransactionList: (state: any) => state.groupedTransactions.items,
  transactionListLoaded: (state: any) => state.transactions.status === itemStatus.LOADED,
  transactionArchive: (state: any) => state.archive,
  transactionLastAdded: (state: any) => state.lastAdded,
};

const actions = {
  async fetchTransactions({ commit }: any, payload: any) {
    commit('setTransactionsStatus', itemStatus.LOADING);
    const response = await getTransactions(payload);
    if (response.status === 200) {
      const body = await response.json();
      commit('setTransactions', body);
    }
    commit('setTransactionsStatus', itemStatus.LOADED);
  },

  async fetchGroupedTransaction({ commit }: any, payload: any) {
    commit('setGroupedTransactionsStatus', itemStatus.LOADING);
    const response = await getGroupedTransactions(payload);
    if (response.status === 200) {
      const body = await response.json();
      commit('setGroupedTransactions', body);
    }
    commit('setGroupedTransactionsStatus', itemStatus.LOADED);
  },

  async createTransaction({ commit }: any, payload: any) {
    const response = await createTransaction(payload);
    if (response.status === 201) {
      const body = await response.json();
      commit('createTransaction', body);
    }
  },

  async deleteTransaction({ commit }: any, uuid: string) {
    const response = await deleteTransaction(uuid);
    if (response.status === 204) {
      commit('deleteTransaction', uuid);
    }
  },

  async updateTransaction({ commit }: any, payload: any) {
    const response = await updateTransaction(payload);
    if (response.status === 200) {
      const body = await response.json();
      commit('updateTransaction', body);
    }
  },

  async setTransactionArchiveDay({ commit }: any, day: any) {
    commit('setArchiveDay', day);
  },

  async setTransactionArchiveMonth({ commit }: any, month: any) {
    commit('setArchiveMonth', month);
  },

  async setTransactionArchiveYear({ commit }: any, year: any) {
    commit('setArchiveYear', year);
  },

  async setTransactionLastAdded({ commit }: any, payload: any) {
    commit('setLastAdded', payload);
  },

  async clearTransactions({ commit }: any) {
    commit('clearTransactions');
  },
};

const mutations = {
  setTransactions(state: any, transactions: any) {
    state.transactions.items = transactions;
  },

  setGroupedTransactions(state: any, amounts: any) {
    state.groupedTransactions.items = amounts;
  },

  setArchiveDay(state: any, day: any) {
    state.archive.day = day;
  },

  setArchiveMonth(state: any, month: any) {
    state.archive.month = month;
  },

  setArchiveYear(state: any, year: any) {
    state.archive.year = year;
  },

  setLastAdded(state: any, payload: any) {
    state.lastAdded = {
      ...payload,
    };
  },

  createTransaction(state: any, transaction: any) {
    state.transactions.items.unshift({ ...transaction });
  },

  deleteTransaction(state: any, uuid: string) {
    state.transactions.items = state.transactions.items.filter((user: any) => user.uuid !== uuid);
  },

  updateTransaction(state: any, newItem: any) {
    state.transactions.items = state.transactions.items.map((item: any) => {
      if (item.id === newItem.id) {
        return newItem;
      }
      return item;
    });
  },

  clearTransactions(state: any) {
    state.transactions.items = [];
  },

  setTransactionsStatus(state: any, status: any) {
    state.transactions.status = status;
  },

  setGroupedTransactionsStatus(state: any, status: any) {
    state.groupedTransactions.status = status;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
