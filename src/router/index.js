import Vue from 'vue';
import Router from 'vue-router';
import SignUp from '@/pages/SignUp';
import Home from '@/views/Home';

Vue.use(Router);

export default new Router({
  routes: [
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
  ],
});
