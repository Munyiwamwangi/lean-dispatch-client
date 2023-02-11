import '@fortawesome/fontawesome-free/css/all.css';
import 'material-design-icons-iconfont/dist/material-design-icons.css';
import Vue from 'vue';
// import Vuetify from 'vuetify/lib/framework';
import Vuetify from 'vuetify/lib';

// Translation provided by Vuetify (javascript)
import et from 'vuetify/lib/locale/et';
import en from 'vuetify/lib/locale/en';


Vue.use(Vuetify);

const vuetify = new Vuetify({
  icons: {
    iconfont: 'fa' || 'md',
  },

  lang: {
    locales: {en, et},
    current: 'en',
  },

  theme: { 
    themes: {
      light: {
        primary: '#1e22aa',
        secondary: '#e40046',
        accent: '#536878',
        error: '#b71c1c',
        success: '#2B7410',
        warning: '#FFA500',
      },
    },
  },
});

export default vuetify;
