/* eslint no-shadow: ["error", { "allow": ["state"] }] */

import {
  getBudget,
  createBudget,
  updateBudget,
  deleteBudget,
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

  async updateStatusBudget({ commit }, payload) {
    const response = await updateBudget(payload);
    if (response.status === 200) {
      const body = await response.json();
      commit('updateBudget', body);
    }
  },

  async updateBudget({ commit }, payload) {
    console.log(payload);
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
