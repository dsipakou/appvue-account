import { createStore } from 'vuex';
import transactions from './modules/transactions';
import accounts from './modules/accounts';
import categories from './modules/categories';
import users from './modules/users';
import currencies from './modules/currencies';
import rates from './modules/rates';
import budget from './modules/budget';

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
    rates,
    budget,
  },
});
