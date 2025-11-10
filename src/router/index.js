import { createRouter, createWebHistory } from 'vue-router'


// Imports 각각 위치 맞춰서

//common
import MainView from '../components/view/MainView.vue';
import AboutView from '../components/view/AboutView.vue';
import ContactView from '../components/view/ContactView.vue';
import NoticeView from '../components/view/NoticeView.vue';

// 형석님

// 지현님

// 건일님
import AdminMember from '@/components/admin/AdminMember.vue';
import AdminReport from '@/components/admin/AdminReport.vue';
import AdminTag from '@/components/admin/AdminTag.vue';
// 서진님

// 순우님

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/',
      redirect: '/main'
    },
    { 
      path: '/main',
      name: 'Main',
      component: MainView
    },
    { 
      path: '/about',
      name: 'About',
      component: AboutView
    },
    { 
      path: '/contact',
      name: 'Contact',
      component: ContactView
    },
    { 
      path: '/notice',
      name: 'Notice',
      component: NoticeView
    },
    {
      path: '/admin',
      component: () => import('@/components/view/AdminLayout.vue'),
      meta: { isAdmin: true },
      children: [
        { path: '', redirect: '/admin/member'},  
        { path: 'member', component: AdminMember },
        { path: 'report', component: AdminReport },
        { path: 'tag', component: AdminTag}
      ]
    },


    // { 
    //   path: '/',
    //   name: '',
    //   component: 
    // },
],
})

export default router
