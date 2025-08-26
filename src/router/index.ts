import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import AuthView from '@/views/AuthView.vue'
import ProfileView from '@/views/ProfileView.vue'
import EventsView from '@/views/EventView.vue'
import NewsfeedView from '@/views/NewsfeedView.vue'
import CalendarView from '@/views/CalendarView.vue'
import AvailabilityView from '@/views/AvailabilityView.vue'
import HoursView from '@/views/HoursView.vue'
import SettingsView from '@/views/SettingsView.vue'
import AdminView from '@/views/AdminView.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/auth',
      name: 'auth',
      component: AuthView,
    },
    {
      path: '/calendar',
      name: 'calendar',
      component: CalendarView,
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
    },
     {
      path: '/events',
      name: 'events',
      component: EventsView,
    },
     {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
    },
     {
      path: '/news',
      name: 'news',
      component: NewsfeedView,
    },
      {
      path: '/availability',
      name: 'availability',
      component: AvailabilityView,
    },
     {
      path: '/hours',
      name: 'hours',
      component: HoursView,
    },
     {
      path: '/settings',
      name: 'settings',
      component: SettingsView,
    },
     {
      path: '/admin',
      name: 'admin',
      component: AdminView,
    },
    
  ],
})

export default router
