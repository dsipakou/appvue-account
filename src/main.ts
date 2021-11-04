import { createApp } from 'vue';
import { VuesticPlugin } from 'vuestic-ui';
import { Quasar } from 'quasar';
import moment from 'moment';
import router from './router';
import store from './store';
import App from './App.vue';
import 'vuestic-ui/dist/vuestic-ui.css';
import quasarUserOptions from './quasar-user-options';

moment.updateLocale('ru', {
  calendar: {
    sameDay: '[Сегодня]',
    lastDay: '[Вчера]',
    sameElse: 'LL',
    lastWeek(now) {
      if (now.week() !== this.week()) {
        switch (this.day()) {
          case 0:
            return '[В прошлое] dddd';
          case 1:
          case 2:
          case 4:
            return '[В прошлый] dddd';
          case 3:
          case 5:
          case 6:
            return '[В прошлую] dddd';
          default:
            return 'dddd';
        }
      } else {
        if (this.day() === 2) {
          return '[Во] dddd';
        }
        return '[В] dddd';
      }
    },
  },

  week: {
    dow: 1,
  },
});

createApp(App).use(Quasar, quasarUserOptions)
  .use(store)
  .use(router)
  .use(VuesticPlugin)
  .mount('#app');
