/* eslint no-shadow: ["error", { "allow": ["state"] }] */

import {
  getUsers,
  userLogin,
  createUser,
  resetUser,
  LoginPayload,
  SignupPayload,
  ResetUserPayload,
} from '@/service/users/';
import idb, { User } from '@/utils/indexDBUtils';

const state = {
  username: null,
  token: null,
  users: {
    items: [],
    isLoading: false,
  },
};

const getters = {
  activeUser: (state: any) => state.username,
  token: (state: any) => state.token,
  userList: (state: any) => state.users.items,
  isUserListLoading: (state: any) => state.users.isLoading,
};

const actions = {
  async loadUser({ commit }: any) {
    const user = await idb.getUser();
    if (user) {
      commit('login', user);
    }
  },

  async loginUser({ commit }: any, payload: LoginPayload) {
    const user = {
      username: payload.email,
      token: '',
    } as User;
    const response = await userLogin(payload);
    if (response.status === 200) {
      const data = await response.json();
      user.token = data.token;
      await idb.addUser(user);
      commit('login', user);
    } else {
      commit('logout');
      await idb.removeUser(user);
    }
  },

  async logoutUser({ commit }: any) {
    await idb.removeUser({ username: state.username || '', token: state.token || '' });
    commit('logout');
  },

  async createUser({ commit }: any, payload: SignupPayload) {
    const response = await createUser(payload);
    if (response.status === 200) {
      console.log('User created');
    }
  },

  async resetUser({ commit }: any, payload: ResetUserPayload) {
    const response = await resetUser(payload);
    if (response.status === 200) {
      console.log('Reset success');
    }
  },

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
  login(state: any, user: User) {
    state.username = user.username;
    state.token = user.token;
  },

  logout(state: any) {
    state.username = null;
    state.token = null;
  },

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
