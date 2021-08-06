import { createStore } from 'vuex';
import transactions from './modules/transactions';
import accounts from './modules/accounts';
import categories from './modules/categories';
import users from './modules/users';
import currencies from './modules/currencies';

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
    categories,
    users,
    currencies,
  },
});
