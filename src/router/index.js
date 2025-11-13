import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/useUserInfo'

// Imports 각각 위치 맞춰서

//common
import MainView from '../components/view/MainView.vue';
import AboutView from '../components/view/AboutView.vue';
import ContactView from '../components/view/ContactView.vue';

// 형석님
import NoticeView from '../components/view/NoticeView.vue';
import NoticeRegistView from '../components/view/NoticeRegistView.vue';
import NoticeEditView from '../components/view/NoticeEditView.vue';
import OopsView from '../components/view/OopsView.vue'
import OopsEditView from '../components/view/OopsEditView.vue';
import OopsRegistView from '../components/view/OopsRegistView.vue';
import OopsDetailView from '../components/view/OopsDetailView.vue';
import OohView from '../components/view/OohView.vue'
import OohEditView from '../components/view/OohEditView.vue';
import OohRegistView from '../components/view/OohRegistView.vue';
import OohDetailView from '../components/view/OohDetailView.vue';


// 지현님
import LoginView from '@/components/view/LoginView.vue';
import SignUpView from '@/components/view/SignUpView.vue';
import FindIdView from '@/components/view/FindIdView.vue';
import FindPwView from '@/components/view/FindPwView.vue';
import VerifyCodeView from '@/components/view/VerifyCodeView.vue';

// 건일님
import AdminMember from '@/components/admin/AdminMember.vue';
import AdminReport from '@/components/admin/AdminReport.vue';
import AdminTag from '@/components/admin/AdminTag.vue';

// 서진님
import CommentEdit from '@/components/view/CommentEdit.vue';

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
    component: NoticeView, // 공지 리스트 or 레이아웃
    },
    { 
      path: '/notice/insertNotice',
      name: 'InsertNotice',
      component: NoticeRegistView
    },
    { 
      path: '/notice/updateNotice/:id',
      name: 'UpdateNotice',
      component: NoticeEditView
    },
    { 
      path: '/oops',
      name: 'Oops',
      component: OopsView,
    },
    { 
      path: '/oops/insertOops',
      name: 'InsertOops',
      component: OopsRegistView,
    },
    { 
      path: '/oops/updateOops/:id',
      name: 'UpdateOops',
      component: OopsEditView,
    },
    { 
      path: '/oops/:id/detail',
      name: 'DetailOops',
      component: OopsDetailView,
      props: true,
    },
    { 
      path: '/ooh',
      name: 'Ooh',
      component: OohView,
    },
    { 
      path: '/ooh/insertOoh',
      name: 'InsertOoh',
      component: OohRegistView,
    },
    { 
      path: '/ooh/updateOoh/:id',
      name: 'UpdateOoh',
      component: OohEditView,
    },
    { 
      path: '/ooh/:id/detail',
      name: 'DetailOoh',
      component: OohDetailView,
      props: true,
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
        { path: 'bookmarks', name:'mypage-bookmarks', component: BookMark,
        meta:{label:'북마크기록'} },
        { path: 'followers', name:'mypage-followers', component: Follow,
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
    { 
      path: '/find-id',
      name: 'FindId',
      component: FindIdView
    },
    { 
      path: '/find-pw',
      name: 'FindPw',
      component: FindPwView
    },
    { 
      path: '/verify-code/:email',
      name: 'VerifyCode',
      component: VerifyCodeView
    },
    {
      path: '/notice/updateComment/:commentId/:noticeId',
      name: 'UpdateComment',
      component: CommentEdit
      // meta: { requiresAuth: true, adminOnly: true } // 이건 권한 생기면 
    },

    // { 
    //   path: '/',
    //   name: '',
    //   component: 
    // },
],
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  const userAuth = userStore.auth || []
  const token = userStore.token || ''

  // 관리자 전용 페이지 접근 차단
  if (to.meta.isAdmin) {
    if (userAuth.includes('ROLE_ADMIN')) {
      // 관리자 권한 있음 → 통과
      next()
    } else {
      // 관리자 아님 → 접근 차단
      alert('관리자만 접근할 수 있습니다.')
      next('/main')
    }
    return
  }

  // 로그인 필요 페이지
  if(to.path.startsWith('/mypage')) {
    if(!token) {
      alert('로그인 후 이용할 수 있습니다.')
      next('/login')
      return
    }
  }
  
  next()
})

export default router
