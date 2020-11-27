import { createApp } from 'vue'
import App from './App.vue'

import router from './router'

import Database from '@/lib/database'

let app = createApp(App);

app.config.globalProperties.database = new Database();

app.config.globalProperties.database.init().then(()=> {
  app
    .use(router)
    .mount('#app');
})
