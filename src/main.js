import Vue from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import router from './router';
import store from './store';

//Plugins
import '@/plugins/date-format';

// add axios global instance
import api from './services/api';
Vue.prototype.$http = api;

// register service worker for PWA support
import wb from './registerServiceWorker';

import i18n from './i18n';
Vue.prototype.$workbox = wb;

Vue.config.productionTip = false;

new Vue({
  vuetify,
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount('#app');
