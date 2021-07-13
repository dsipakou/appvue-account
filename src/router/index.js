import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import SignUp from '../views/SignUp.vue';
import AccountList from '../views/AccountList.vue';
import Transactions from '../views/Transactions.vue';

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
    component: AccountList,
  },
  {
    path: '/transactions',
    name: 'Transactions',
    component: Transactions,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
