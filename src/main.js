import { createApp } from 'vue';
import { VuesticPlugin } from 'vuestic-ui';
import router from './router';
import store from './store';
import App from './App.vue';
import 'vuestic-ui/dist/vuestic-ui.css';

createApp(App)
  .use(store)
  .use(router)
  .use(VuesticPlugin)
  .mount('#app');
