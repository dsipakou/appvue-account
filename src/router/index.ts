import { createRouter, createWebHistory } from 'vue-router';
import DailyTransactions from '@/views/transaction/DailyTransactions.vue';
import TableTransactions from '@/views/transaction/TableTransactions.vue';
import Home from '@/views/Home.vue';
import { Login, PasswordReset, Signup } from '@/views/user';
import Accounts from '@/views/Accounts.vue';
import Transactions from '@/views/Transactions.vue';
import Categories from '@/views/Categories.vue';
import Currencies from '@/views/Currencies.vue';
import Reports from '@/views/Reports.vue';
import Budget from '@/views/Budget.vue';
import MonthPlanner from '@/views/budget/MonthPlanner.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/reset',
    name: 'PasswordReset',
    component: PasswordReset,
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
    path: '/transactions/daily',
    name: 'DailyTransactions',
    component: DailyTransactions,
  },
  {
    path: '/transactions/table',
    name: 'TableTransactions',
    component: TableTransactions,
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
  {
    path: '/budget',
    name: 'Budget',
    component: Budget,
  },
  {
    path: '/budget/planner',
    name: 'MonthPlanner',
    component: MonthPlanner,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
