/* eslint no-shadow: ["error", { "allow": ["state"] }] */

import { GetBudgetForPeriod, BudgetToggle } from '@/types/Budget';
import { startOfDay } from 'date-fns';

/* eslint import/no-cycle: [2, { maxDepth: 1 }] */
import {
  getBudgetUsage,
  getBudgetPlan,
  createBudget,
  updateBudget,
  deleteBudget,
  getWeeklyBudgetUsage,
  getBudgetArchive,
  duplicateBudget,
  getDuplicateCandidates,
} from '../../service/budget';

const state = {
  selectedMonth: startOfDay(new Date()),
  usage: [],
  weeklyUsage: [],
  plan: [],
  archive: [],
  budgetToggle: BudgetToggle.Monthly,
  duplicatedItems: [],
  isLoading: false,
};

const getters = {
  budgetUsage: (state: any) => state.usage,
  weeklyUsage: (state: any) => state.weeklyUsage,
  budgetPlan: (state: any) => state.plan,
  budgetArchive: (state: any) => state.archive,
  budgetSelectedMonth: (state: any) => state.selectedMonth,
  budgetDuplicatedItems: (state: any) => state.duplicatedItems,
  isBudgetListLoading: (state: any) => state.isLoading,
};

const actions = {
  async fetchMonthlyUsage({ commit }: any, payload: GetBudgetForPeriod) {
    commit('setBudgetLoading', true);
    const response = await getBudgetUsage(payload);
    if (response.status === 200) {
      const body = await response.json();
      commit('setBudgetUsage', body);
    }
    commit('setBudgetLoading', false);
  },

  async fetchWeeklyUsage({ commit }: any, payload: GetBudgetForPeriod) {
    commit('setBudgetLoading', true);
    const response = await getWeeklyBudgetUsage(payload);
    if (response.status === 200) {
      const body = await response.json();
      commit('setWeeklyBudgetUsage', body);
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

  async fetchBudgetArchive({ commit }: any, payload: string) {
    commit('setBudgetLoading', true);
    const response = await getBudgetArchive(payload);
    if (response.status === 200) {
      const body = await response.json();
      commit('setBudgetArchive', body);
    }
    commit('setBudgetLoading', false);
  },

  async createBudget({ commit }: any, payload: any) {
    const response = await createBudget(payload);
    if (response.status === 201) {
      const body = await response.json();
      console.log(body);
    }
  },

  async updateStatusBudget({ commit }: any, payload: any) {
    const response = await updateBudget(payload);
    if (response.status === 200) {
      commit('setStatusUpdate', payload);
    }
  },

  async updateBudget({ commit }: any, payload: any) {
    const response = await updateBudget(payload);
    if (response.status === 200) {
      console.log('updated');
    }
  },

  async deleteBudget({ commit }: any, id: number) {
    commit('setBudgetLoading', true);
    const response = await deleteBudget(id);
    if (response.status === 204) {
      commit('deleteBudget', id);
      console.log('deleted');
    }
    commit('setBudgetLoading', false);
  },

  async getDuplicateBudgetCandidates({ commit }: any, type: string) {
    commit('setBudgetLoading', true);
    const response = await getDuplicateCandidates(type);
    if (response.status === 200) {
      const data = await response.json();
      commit('setDuplicatedItems', data);
    }
    commit('setBudgetLoading', false);
  },

  async duplicateBudget({ commit }: any, uuids: string[]) {
    commit('setBudgetLoading', true);
    const response = await duplicateBudget(uuids);
    commit('setBudgetLoading', false);
  },

  async clearDuplicatedItems({ commit }: any) {
    commit('clearDuplicatedItems');
  },
};

const mutations = {
  setBudgetUsage(state: any, budget: any) {
    state.usage = budget;
  },

  setWeeklyBudgetUsage(state: any, budget: any) {
    state.weeklyUsage = budget;
  },

  setBudgetPlan(state: any, budget: any) {
    state.plan = budget;
  },

  setBudgetArchive(state: any, archive: any) {
    state.archive = archive;
  },

  setBudgetLoading(state: any, isLoading: boolean) {
    state.isLoading = isLoading;
  },

  setBudgetToggle(state: any, value: BudgetToggle) {
    state.budgetToggle = value;
  },

  setStatusUpdate(state: any, item: any) {
    state.weeklyUsage = state.weeklyUsage.map((usageItem: any) => (
      usageItem.uuid === item.uuid
        ? { ...usageItem, isCompleted: item.isCompleted }
        : usageItem
    ));
    state.plan = state.plan.map((plan: any) => (
      plan.id === item.id
        ? { ...plan, isCompleted: !plan.isCompleted }
        : plan
    ));
    state.usage = state.usage.map((usage: any) => (
      usage.id === item.id
        ? { ...usage, isCompleted: !usage.isCompleted }
        : usage
    ));
  },

  setBudgetMonth(state: any, value: string) {
    state.selectedMonth = value;
  },

  setDuplicatedItems(state: any, value: any) {
    state.duplicatedItems = value;
  },

  clearDuplicatedItems(state: any) {
    state.duplicatedItems = [];
  },

  deleteBudget(state: any, id: number) {
    console.log('deleting...');
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
