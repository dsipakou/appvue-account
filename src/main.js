import { createApp } from 'vue';
import { VuesticPlugin } from 'vuestic-ui';
import { Quasar } from 'quasar';
import moment from 'moment';
import router from './router';
import store from './store';
import App from './App.vue';
import 'vuestic-ui/dist/vuestic-ui.css';
import quasarUserOptions from './quasar-user-options';

moment.locale('ru');
moment.updateLocale('ru', {
  week: {
    dow: 1,
  },
});

createApp(App).use(Quasar, quasarUserOptions)
  .use(store)
  .use(router)
  .use(VuesticPlugin)
  .mount('#app');
