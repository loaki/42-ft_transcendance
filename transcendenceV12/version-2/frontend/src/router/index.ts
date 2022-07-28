import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import About from '@/views/AboutView.vue'
import ProfilView from '@/views/ProfilView.vue'
import GameView from '@/views/GameView.vue'


const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    component: About,
  },
  {
    path: '/profil',
    name: 'profil',
    component: ProfilView,
    props: true
  },
  {
    path: '/game',
    name: 'game',
    component: GameView,
    props: true
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
