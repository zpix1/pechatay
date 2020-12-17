import {createWebHistory, createRouter} from "vue-router";
import TyperMenu from "@/views/TyperMenu.vue";
import BookSelect from "@/views/BookSelect.vue";
import OnlineTyperMenu from "@/views/OnlineTyperMenu";
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
    path: "/fight/:id",
    name: "OnlineTyperMenu",
    component: OnlineTyperMenu,
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
  base: process.env.NODE_ENV === "production"
    ? "/pechatay/"
    : "/",
  history: createWebHistory(),
  routes,
});

export default router;