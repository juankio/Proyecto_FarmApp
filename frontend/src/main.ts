import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './App.vue';
import { router } from './router';
import './styles/global.css';
import './styles/app-shell.css';

const app = createApp(App);

app.config.errorHandler = (err, instance, info) => {
  console.error('[FarmApp] Error no controlado:', err, info);
};

app.use(createPinia()).use(router).mount('#app');
