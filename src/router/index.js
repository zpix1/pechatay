import { createWebHistory, createRouter } from 'vue-router';
import TyperMenu from '@/views/TyperMenu.vue';
import BookSelect from '@/views/BookSelect.vue';

const routes = [
  {
    path: '/',
    name: 'BookSelect',
    component: BookSelect,
  },
  {
    path: '/typer/:id',
    name: 'TyperMenu',
    component: TyperMenu,
    props: true
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;