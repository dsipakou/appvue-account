/* eslint no-shadow: ["error", { "allow": ["state"] }] */

import {
  getBudget,
  createBudget,
} from '../../service';

const state = {
  budget: {
    items: [],
    isLoading: false,
  },
};

const getters = {
  budgetList: (state) => state.budget.items,
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

  async createBudget({ commit }, payload) {
    const response = await createBudget(payload);
    if (response.status === 201) {
      const body = await response.json();
      commit('createBudget', body);
    }
  },
};

const mutations = {
  setBudget(state, budget) {
    state.budget.items = budget;
  },

  createBudget(state, budget) {
    state.budget.items.unshift({ ...budget });
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
