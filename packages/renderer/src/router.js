import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '@/components/Home.vue';

const routes = [
  { path: '/', name: 'Home', component: Home },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/components/Settings.vue'),
  },
];

export default createRouter({
  routes,
  history: createWebHashHistory(),
});
