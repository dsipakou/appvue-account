import { createStore } from 'vuex';
import transactions from './modules/transactions';
import accounts from './modules/accounts';
import users from './modules/users';

export default createStore({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    transactions,
    accounts,
    users,
  },
});
