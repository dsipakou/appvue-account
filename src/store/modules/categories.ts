/* eslint no-shadow: ["error", { "allow": ["state"] }] */

import {
  getCategories,
  createCategory,
  deleteCategory,
  updateCategory,
} from '../../service/categories';

const state = {
  categories: {
    items: [],
    isLoading: false,
  },
};

const getters = {
  categoryList: (state: any) => state.categories.items,
  isCategoryListLoading: (state: any) => state.categories.isLoading,
};

const actions = {
  async fetchCategories({ commit }: any) {
    commit('setCategoriesLoading', true);
    const response = await getCategories();
    if (response.status === 200) {
      const body = await response.json();
      commit('setCategoriesLoading', false);
      commit('setCategories', body);
    }
  },

  async createCategory({ commit }: any, payload: any) {
    const response = await createCategory(payload);
    if (response.status === 201) {
      const body = await response.json();
      commit('createCategory', body);
    }
  },

  async deleteCategory({ commit }: any, id: number) {
    const response = await deleteCategory(id);
    if (response.status === 204) {
      commit('deleteCategory', id);
    }
  },

  async updateCategory({ commit }: any, payload: any) {
    const response = await updateCategory(payload);
    if (response.status === 200) {
      const body = await response.json();
      commit('updateCategory', body);
    }
  },
};

const mutations = {
  setCategories(state: any, categories: any) {
    state.categories.items = categories;
  },

  createCategory(state: any, category: any) {
    state.categories.items.unshift({ ...category });
  },

  deleteCategory(state: any, id: number) {
    state.categories.items = state.categories.items.filter((category: any) => category.id !== id);
  },

  updateCategory(state: any, category: any) {
    state.categories.items = state.categories.items.map((item: any) => {
      if (item.id === category.id) {
        return category;
      }
      return item;
    });
  },

  setCategoriesLoading(state: any, isLoading: boolean) {
    state.categories.isLoading = isLoading;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
