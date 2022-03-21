/* eslint no-shadow: ["error", { "allow": ["state"] }] */

import { IGetBudgetForPeriod } from '@/types/Budget';

import {
  getBudget,
  getBudgetUsage,
  getBudgetPlan,
  getTransactions,
  createBudget,
  updateBudget,
  deleteBudget,
} from '../../service';

const state = {
  budget: {
    selectedMonth: new Date(),
    usage: [],
    plan: [],
    transactions: [],
    isLoading: false,
  },
};

const getters = {
  budgetUsage: (state: any) => state.budget.usage,
  budgetPlan: (state: any) => state.budget.plan,
  budgetedTransactions: (state: any) => state.budget.transactions,
  budgetSelectedMonth: (state: any) => state.budget.selectedMonth,
  isBudgetListLoading: (state: any) => state.budget.isLoading,
};

const actions = {
  async fetchBudgetUsage({ commit }: any, payload: IGetBudgetForPeriod) {
    commit('setBudgetLoading', true);
    const response = await getBudgetUsage(payload);
    if (response.status === 200) {
      const body = await response.json();
      commit('setBudgetUsage', body);
    }
    commit('setBudgetLoading', false);
  },

  async fetchBudgetPlan({ commit }: any, payload: any) {
    commit('setBudgetLoading', true);
    const response = await getBudgetPlan(payload);
    if (response.status === 200) {
      const body = await response.json();
      commit('setBudgetPlan', body);
    }
    commit('setBudgetLoading', false);
  },

  async fetchBudgetedTransactions({ commit }: any, payload: any) {
    commit('setBudgetLoading', true);
    const response = await getTransactions(payload);
    if (response.status === 200) {
      const body = await response.json();
      commit('setBudgetedTransactions', body);
    }
    commit('setBudgetLoading', false);
  },

  async createBudget({ commit }: any, payload: any) {
    const response = await createBudget(payload);
    if (response.status === 201) {
      const body = await response.json();
      commit('createBudget', body);
    }
  },

  async updateStatusBudget({ commit }: any, payload: any) {
    const response = await updateBudget(payload);
    if (response.status === 200) {
      const body = await response.json();
      commit('updateBudget', body);
    }
  },

  async updateBudget({ commit }: any, payload: any) {
    const response = await updateBudget(payload);
    if (response.status === 200) {
      const body = await response.json();
      commit('updateBudget', body);
    }
  },

  async deleteBudget({ commit }: any, id: number) {
    const response = await deleteBudget(id);
    if (response.status === 204) {
      commit('deleteBudget', id);
    }
  },
};

const mutations = {
  setBudgetUsage(state: any, budget: any) {
    state.budget.usage = budget;
  },

  setBudgetPlan(state: any, budget: any) {
    state.budget.plan = budget;
  },

  setBudgetedTransactions(state: any, budget: any) {
    state.budget.transactions = budget;
  },

  createBudget(state: any, budget: any) {
    state.budget.items.push({ ...budget });
  },

  updateBudget(state: any, budget: any) {
    state.budget.items = state.budget.items.map((item: any) => {
      if (item.id === budget.id) {
        return budget;
      }
      return item;
    });
  },

  deleteBudget(state: any, id: number) {
    state.budget.items = state.budget.items.filter((budget: any) => budget.id !== id);
  },

  setBudgetLoading(state: any, isLoading: boolean) {
    state.budget.isLoading = isLoading;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
