import { createStore } from 'vuex';
/* eslint import/no-cycle: [2, { maxDepth: 2 }] */
import transactions from '@/store/modules/transactions';
import accounts from '@/store/modules/accounts';
import categories from '@/store/modules/categories';
import users from '@/store/modules/users';
import currencies from '@/store/modules/currencies';
import rates from '@/store/modules/rates';
import budget from '@/store/modules/budget';

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
