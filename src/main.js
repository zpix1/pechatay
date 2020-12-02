import { createApp } from 'vue';
import { createStore } from 'vuex';
import App from './App.vue';

import router from './router';

import Database from '@/lib/database';

let app = createApp(App);

const store = createStore({
  state() {
    return {
      loading: false,
      db: new Database(),
      currentBook: null,
      scheme: null,
      settings: {},
      settingsTemplate: {
        font: ['Roboto Mono', 'Source Code Pro'],
        theme: ['Light', 'Dark']
      }
    };
  },
  mutations: {
    init(state) {
      state.loading = true;
      state.db.init().then(() => {
        state.loading = false;
        state.scheme = state.db.getScheme();
        state.currentBook = state.db.getSettingsValue('currentBook');

        for (let k in state.settingsTemplate) {
          const userRes = state.db.getSettingsValue('settings_' + k);
          if (state.settingsTemplate[k].includes(userRes)) {
            state.settings[k] = userRes;
          } else {
            state.settings[k] = state.settingsTemplate[k][0];
          }
        }
      });
    },
    setCurrentBook(state, book) {
      state.currentBook = book;
      state.db.setSettingsValue('currentBook', book);
    },
    setSetting(state, { setting, value }) {
      state.settings[setting] = value;
      state.db.setSettingsValue('settings_' + setting, value);
    }
  }
});

app
  .use(router)
  .use(store)
  .mount('#app');
