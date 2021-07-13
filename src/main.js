import { createApp } from 'vue';
import { VuesticPlugin } from 'vuestic-ui';
import 'vuestic-ui/dist/vuestic-ui.css';
import router from './router';
import store from './store';
import App from './App.vue';

const app = createApp(App).use(store).use(router).mount('#app');
app.use(VuesticPlugin);
