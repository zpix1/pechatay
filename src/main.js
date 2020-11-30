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
      scheme: null
    };
  },
  mutations: {
    init(state) {
      state.loading = true;
      state.db.init().then(() => {
        state.loading = false;
        state.scheme = state.db.getScheme();
      });
    },
    setCurrentBook(state, book) {
      console.log('setCurrentBook mutation', book);
      state.currentBook = book;
      state.db.setSettingsValue('currentBook', book);
    }
  },
  getters: {
    currentBook(state) {
      return state.currentBook;
    }
  }
});

app
  .use(router)
  .use(store)
  .mount('#app');
