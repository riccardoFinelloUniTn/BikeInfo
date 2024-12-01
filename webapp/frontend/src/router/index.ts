// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
import Index from '@/components/Index.vue';
import GoogleMap from '@/components/GoogleMap.vue';
import Login from '@/components/Login.vue';
import Register from '@/components/Register.vue';

const routes = [
  { path: '/', name: 'Index', component: Index },
  { path: '/map', name: 'Map', component: GoogleMap },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
