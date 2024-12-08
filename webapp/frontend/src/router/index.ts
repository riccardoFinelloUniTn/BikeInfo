// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
import Index from '@/views/Index.vue';
import GoogleMap from '@/views/GoogleMap.vue';
import ServerError from '@/views/ServerError.vue';
import Login from '@/views/Login.vue';
import Register from '@/views/Register.vue';
import Terms from '@/components/Terms.vue';

const routes = [
  { path: '/', redirect: '/index' },
  { path: '/index', name: 'Index', component: Index, props: true },
  { path: '/map', name: 'Map', component: GoogleMap, props: true },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/serverError', name: 'ServerError', component: ServerError },
  { path: '/terms', name: 'Terms', component: Terms },
  { path: '/:pathMatch(.*)*', redirect: '/serverError' },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
