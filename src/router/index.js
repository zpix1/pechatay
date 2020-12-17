import {createWebHashHistory, createRouter} from "vue-router";
import TyperMenu from "@/views/TyperMenu.vue";
import BookSelect from "@/views/BookSelect.vue";
import OnlineTyperMenu from "@/views/OnlineTyperMenu";
import About from "@/views/About";
import {publicPath} from "@/../vue.config";

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
  history: createWebHashHistory(publicPath),
  routes,
});

export default router;