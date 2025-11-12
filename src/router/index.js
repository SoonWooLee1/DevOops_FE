import { createRouter, createWebHistory } from 'vue-router'


// Imports 각각 위치 맞춰서

//common
import MainView from '../components/view/MainView.vue';
import AboutView from '../components/view/AboutView.vue';
import ContactView from '../components/view/ContactView.vue';

// 형석님
import NoticeView from '../components/view/NoticeView.vue';
import NoticeRegistView from '../components/view/NoticeRegistView.vue';
import NoticeEditView from '../components/view/NoticeEditView.vue';
import MyPageView from '../components/view/MyPageView.vue';

// 지현님
import LoginView from '@/components/view/LoginView.vue';
import SignUpView from '@/components/view/SignUpView.vue';

// 건일님
import AdminMember from '@/components/admin/AdminMember.vue';
import AdminReport from '@/components/admin/AdminReport.vue';
import AdminTag from '@/components/admin/AdminTag.vue';
// 서진님

// 순우님
import BookMark from '../components/bookmark/BookMark.vue';
import Follow from '../components/follow/Follow.vue';

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
      path: '/notice/insertNotice',
      name: 'InsertNotice',
      component: NoticeRegistView
      // meta: { requiresAuth: true, adminOnly: true } // 이건 권한 생기면 

    },
    { 
      path: '/notice/updateNotice/:id',
      name: 'UpdateNotice',
      component: NoticeEditView
      // meta: { requiresAuth: true, adminOnly: true } // 이건 권한 생기면 
    },
   // router/index.js
    {
      path: '/mypage',
      component: () => import('../components/view/MyPageView.vue'),
      redirect: { name: 'mypage-info' },
      children: [
        { path: 'info',      name:'mypage-info',      component: () => import('../components/mypage/InfoTab.vue'),      meta:{label:'개인정보 수정'} },
        { path: 'oops',      name:'mypage-oops',      component: () => import('../components/mypage/OopsTab.vue'),      meta:{label:'Oops 기록'} },
        { path: 'ooh',       name:'mypage-ooh',       component: () => import('../components/mypage/OohTab.vue'),       meta:{label:'Ooh 기록'} },
        { path: 'growth',    name:'mypage-growth',    component: () => import('../components/mypage/GrowthTab.vue'),    meta:{label:'성장 그래프', keepAlive:true} },
        { path: 'reco',      name:'mypage-reco',      component: () => import('../components/mypage/RecommendTab.vue'), meta:{label:'추천게시글'} },
        { path: 'bookmarks', name:'mypage-bookmarks', redirect: '/bookmarks',
        meta:{label:'북마크기록'} },
        { path: 'followers', name:'mypage-followers', redirect: '/follow',
        meta:{label:'팔로우기록'} },
        { path: 'settings',  name:'mypage-settings',  component: () => import('../components/mypage/SettingsTab.vue'),  meta:{label:'설정'} },
      ]
    },


    { 
      path: '/bookmarks',
      name: 'BookMark',
      component: BookMark
    },
    { 
      path: '/follow',
      name: 'Follow',
      component: Follow 
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
    { 
      path: '/login',
      name: 'Login',
      component: LoginView
    },
    { 
      path: '/signup',
      name: 'Signup',
      component: SignUpView
    },

    // { 
    //   path: '/',
    //   name: '',
    //   component: 
    // },
],
})

export default router
