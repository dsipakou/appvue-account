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
  userList: (state: any) => state.users.items,
  isUserListLoading: (state: any) => state.users.isLoading,
};

const actions = {
  async fetchUsers({ commit }: any) {
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
  setUsers(state: any, users: any) {
    state.users.items = users;
  },

  setUsersLoading(state: any, isLoading: boolean) {
    state.users.isLoading = isLoading;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
