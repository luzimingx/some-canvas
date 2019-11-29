import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [{
        path: "/",
        name: "home",
        component: Home
    },
    {
        path: "/data-pick",
        name: "data-pick",
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
            import ( /* webpackChunkName: "data-pick" */ "../views/DataPick.vue")
    }
];

const router = new VueRouter({
    base: process.env.BASE_URL,
    routes
});

export default router;