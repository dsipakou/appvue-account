import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import SignUp from '../views/SignUp.vue';
import Accounts from '../views/Accounts.vue';
import Transactions from '../views/Transactions.vue';
import Categories from '../views/Categories.vue';
import Currencies from '../views/Currencies.vue';
import Reports from '../views/Reports.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: SignUp,
  },
  {
    path: '/accounts',
    name: 'Accounts',
    component: Accounts,
  },
  {
    path: '/transactions',
    name: 'Transactions',
    component: Transactions,
  },
  {
    path: '/categories',
    name: 'Categories',
    component: Categories,
  },
  {
    path: '/currencies',
    name: 'Currencies',
    component: Currencies,
  },
  {
    path: '/reports',
    name: 'Reports',
    component: Reports,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
