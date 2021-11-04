/* eslint no-shadow: ["error", { "allow": ["state"] }] */

import {
  getCategories,
  createCategory,
  deleteCategory,
  updateCategory,
} from '../../service';

const state = {
  categories: {
    items: [],
    isLoading: false,
  },
};

const getters = {
  categoryList: (state) => state.categories.items,
  isCategoryListLoading: (state) => state.categories.isLoading,
};

const actions = {
  async fetchCategories({ commit }) {
    commit('setCategoriesLoading', true);
    const response = await getCategories();
    if (response.status === 200) {
      const body = await response.json();
      commit('setCategoriesLoading', false);
      commit('setCategories', body);
    }
  },

  async createCategory({ commit }, payload) {
    const response = await createCategory(payload);
    if (response.status === 201) {
      const body = await response.json();
      commit('createCategory', body);
    }
  },

  async deleteCategory({ commit }, id) {
    const response = await deleteCategory(id);
    if (response.status === 204) {
      commit('deleteCategory', id);
    }
  },

  async updateCategory({ commit }, payload) {
    const response = await updateCategory(payload);
    if (response.status === 200) {
      const body = await response.json();
      commit('updateCategory', body);
    }
  },
};

const mutations = {
  setCategories(state, categories) {
    state.categories.items = categories;
  },

  createCategory(state, category) {
    state.categories.items.unshift({ ...category });
  },

  deleteCategory(state, id) {
    state.categories.items = state.categories.items.filter((category) => category.id !== id);
  },

  updateCategory(state, category) {
    state.categories.items = state.categories.items.map((item) => {
      if (item.id === category.id) {
        return category;
      }
      return item;
    });
  },

  setCategoriesLoading(state, isLoading) {
    state.categories.isLoading = isLoading;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
