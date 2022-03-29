/* eslint no-shadow: ["error", { "allow": ["state"] }] */

import { IGetBudgetForPeriod, BudgetToggle } from '@/types/Budget';

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
  selectedMonth: new Date(),
  usage: [],
  plan: [],
  transactions: [],
  budgetToggle: BudgetToggle.Monthly,
  isLoading: false,
};

const getters = {
  budgetUsage: (state: any) => state.usage,
  budgetPlan: (state: any) => state.plan,
  budgetedTransactions: (state: any) => state.transactions,
  budgetSelectedMonth: (state: any) => state.selectedMonth,
  isBudgetListLoading: (state: any) => state.isLoading,
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
      console.log('created');
    }
  },

  async updateStatusBudget({ commit }: any, payload: any) {
    const response = await updateBudget(payload);
    if (response.status === 200) {
      console.log('updated');
    }
  },

  async updateBudget({ commit }: any, payload: any) {
    const response = await updateBudget(payload);
    if (response.status === 200) {
      console.log('updated');
    }
  },

  async deleteBudget({ commit }: any, id: number) {
    const response = await deleteBudget(id);
    if (response.status === 204) {
      console.log('deleted');
    }
  },
};

const mutations = {
  setBudgetUsage(state: any, budget: any) {
    state.usage = budget;
  },

  setBudgetPlan(state: any, budget: any) {
    state.plan = budget;
  },

  setBudgetedTransactions(state: any, budget: any) {
    state.transactions = budget;
  },

  setBudgetLoading(state: any, isLoading: boolean) {
    state.isLoading = isLoading;
  },

  setBudgetToggle(state: any, value: BudgetToggle) {
    state.budgetToggle = value;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
