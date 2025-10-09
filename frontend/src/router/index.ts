import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth';
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
import RegisterView from '@/views/RegisterView.vue'
import UserListView from '@/views/UserListView.vue';
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
      meta: { allowedRoles: [1, 2] } // 1 = Admin, 2 = Manager
    },
     {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
     {
      path: '/userlist',
      name: 'userlist',
      component: UserListView,
    },
    
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  authStore.restoreSession(); // make sure the persisted session is loaded

  const publicPages = ['/auth', '/register'];
  const authRequired = !publicPages.includes(to.path);

  if (authRequired && !authStore.user) {
    // Redirect to login if not logged in
    return next({ path: '/auth' });
  }

  next();
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  const allowedRoles = to.meta.allowedRoles;

  if (allowedRoles) {
    const userRoleId = authStore.user?.role_id;

    if (!userRoleId || !allowedRoles.includes(userRoleId)) {
      return next({ name: 'home' });
    }
  }

  next();
});

export default router
