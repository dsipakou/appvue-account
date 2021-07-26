/* eslint no-shadow: ["error", { "allow": ["state"] }] */

import {
  getUsers,
} from '../../service';

const state = {
  users: {
    items: [],
    isLoading: false,
  },
};

const getters = {
  userList: (state) => state.users.items,
  isUserListLoading: (state) => state.users.isLoading,
};

const actions = {
  async fetchUsers({ commit }) {
    commit('setUsersLoading', true);
    const response = await getUsers();
    if (response.status === 200) {
      const body = await response.json();
      commit('setUsersLoading', false);
      commit('setUsers', body);
    }
  },
};

const mutations = {
  setUsers(state, users) {
    state.users.items = users;
  },

  setUsersLoading(state, isLoading) {
    state.users.isLoading = isLoading;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
