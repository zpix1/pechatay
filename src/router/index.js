import {createWebHistory, createRouter} from "vue-router";
import TyperMenu from "@/views/TyperMenu.vue";
import BookSelect from "@/views/BookSelect.vue";
import About from "@/views/About";

const routes = [
  {
    path: "/",
    name: "BookSelect",
    component: BookSelect,
  },
  {
    path: "/typer/:id",
    name: "TyperMenu",
    component: TyperMenu,
    props: true
  },
  {
    path: "/about",
    name: "About",
    component: About
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/"
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;