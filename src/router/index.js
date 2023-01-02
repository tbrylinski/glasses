import { createRouter, createWebHistory } from 'vue-router'
const Home = () => import('../pages/Home.vue')
const App = () => import('../pages/App.vue')


export const router = createRouter({
  history: createWebHistory(),
  mode: 'history',
  routes: [
    { path: '/', name: 'Home', component: Home },
    { path: '/app', name: 'App', component: App },
    { path: '/:pathMatch(.*)*', name: 'NotFound', redirect: '/' },
  ],
})