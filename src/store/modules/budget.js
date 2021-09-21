/* eslint no-shadow: ["error", { "allow": ["state"] }] */

import {
  getBudget,
  getTransactions,
  getBudgetUsage,
  createBudget,
  updateBudget,
  deleteBudget,
} from '../../service';

const state = {
  budget: {
    items: [],
    usage: [],
    transactions: [],
    isLoading: false,
  },
};

const getters = {
  budgetList: (state) => state.budget.items,
  budgetUsage: (state) => state.budget.usage,
  budgetedTransactions: (state) => state.budget.transactions,
  isBudgetListLoading: (state) => state.budget.isLoading,
};

const actions = {
  async fetchBudget({ commit }) {
    commit('setBudgetLoading', true);
    const response = await getBudget();
    if (response.status === 200) {
      const body = await response.json();
      commit('setBudgetLoading', false);
      commit('setBudget', body);
    }
  },

  async fetchBudgetUsage({ commit }, payload) {
    commit('setBudgetLoading', true);
    const response = await getBudgetUsage(payload);
    if (response.status === 200) {
      const body = await response.json();
      commit('setBudgetUsage', body);
    }
    commit('setBudgetLoading', false);
  },

  async fetchBudgetedTransactions({ commit }, payload) {
    commit('setBudgetLoading', true);
    const response = await getTransactions(payload);
    if (response.status === 200) {
      const body = await response.json();
      commit('setBudgetedTransactions', body);
    }
    commit('setBudgetLoading', false);
  },

  async createBudget({ commit }, payload) {
    const response = await createBudget(payload);
    if (response.status === 201) {
      const body = await response.json();
      commit('createBudget', body);
    }
  },

  async updateStatusBudget({ commit }, payload) {
    const response = await updateBudget(payload);
    if (response.status === 200) {
      const body = await response.json();
      commit('updateBudget', body);
    }
  },

  async updateBudget({ commit }, payload) {
    const response = await updateBudget(payload);
    if (response.status === 200) {
      const body = await response.json();
      commit('updateBudget', body);
    }
  },

  async deleteBudget({ commit }, id) {
    const response = await deleteBudget(id);
    if (response.status === 204) {
      commit('deleteBudget', id);
    }
  },
};

const mutations = {
  setBudget(state, budget) {
    state.budget.items = budget;
  },

  setBudgetUsage(state, budget) {
    state.budget.usage = budget;
  },

  setBudgetedTransactions(state, budget) {
    state.budget.transactions = budget;
  },

  createBudget(state, budget) {
    state.budget.items.push({ ...budget });
  },

  updateBudget(state, budget) {
    state.budget.items = state.budget.items.map((item) => {
      if (item.id === budget.id) {
        return budget;
      }
      return item;
    });
  },

  deleteBudget(state, id) {
    state.budget.items = state.budget.items.filter((budget) => budget.id !== id);
  },

  setBudgetLoading(state, isLoading) {
    state.budget.isLoading = isLoading;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
