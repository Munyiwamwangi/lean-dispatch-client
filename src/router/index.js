import Vue from "vue";
import VueRouter from "vue-router";
// import store from '../store/index';
import NProgress from "nprogress";
import "../design/nprogress.css"; //

NProgress.configure({ showSpinner: false }); // NProgress Configuration

Vue.use(VueRouter);

// route level code-splitting
// this generates a separate chunk (about.[hash].js) for this route
// which is lazy-loaded when the route is visited.
const Login = () =>
  import(
    /* webpackChunkName: "login" */ "../views/account-management/Login.vue"
  );

const ForgotPassword = () =>
  import(
    /* webpackChunkName: "login" */ "../views/account-management/ForgotPassword.vue"
  );

const ResetPassword = () =>
  import(
    /* webpackChunkName: "reset-password" */ "../views/account-management/ResetPassword.vue"
  );

const Dashboard = () =>
  import(/* webpackChunkName: "Dashboard" */ "../views/admin/Dashboard.vue");

const AccountManagement = () =>
  import(
    /* webpackChunkName: "AccountManagement" */ "../views/account-management/AccountManagement.vue"
  );

const routes = [
  {
    path: "/",
    redirect: "/dashboard",
  },

  {
    path: "/login",
    name: "login",
    meta: {
      title: "MM Grupp - Login",
    },
    component: Login,
  },
  {
    path: "/forgot-password",
    name: "forgot-password",
    meta: {
      title: "MM Grupp - Forgot - Password",
    },
    component: ForgotPassword,
  },
  {
    path: "/reset-password/:token",
    name: "reset-password",
    meta: {
      title: "MM Grupp - Reset Password",
    },
    component: ResetPassword,
  },
  {
    path: "/dashboard",
    name: "hr-dashboard",
    component: Dashboard,
    meta: {
      title: "MM Grupp - HR Dashboard",
      requiresAuth: true,
      hr: true,
    },
  },
  {
    path: "/accounts",
    name: "accounts",
    component: AccountManagement,
    meta: {
      title: "MM Grupp - My Bonuses",
      requiresAuth: true,
      hr: true,
      approver: true,
    },
  },

  {
    path: "/bonus/tracker",
    name: "employee-bonus-tracker",
    component: AccountManagement,
    meta: {
      title: "MM Grupp - Employee Bonus Tracker",
      requiresAuth: true,
    },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

// router.beforeEach((to, from, next) => {
//   //route refresh to reuse the state's selected language
//   i18n.locale = localStorage.getItem('language') || 'en';

//   // start progress bar
//   NProgress.start();
//   // This goes through the matched routes from last to first, finding the closest route with a title.
//   // e.g., if we have `/some/deep/nested/route` and `/some`, `/deep`, and `/nested` have titles,
//   // `/nested`'s will be chosen.
//   const nearestWithTitle = to.matched
//     .slice()
//     .reverse()
//     .find((r) => r.meta && r.meta.title);

//   const previousNearestWithTitle = from.matched
//     .slice()
//     .reverse()
//     .find((r) => r.meta && r.meta.title);

//   // If a route with a title was found, set the document (page) title to that value.
//   if (nearestWithTitle) {
//     document.title = nearestWithTitle.meta.title;
//   } else if (previousNearestWithTitle) {
//     document.title = previousNearestWithTitle.meta.title;
//   }

//   // define protection and redirection for admin and employees section
//   if (to.matched.some((record) => record.meta.requiresAuth)) {
//     if (localStorage.getItem('token') === null) {
//       next({
//         path: '/login',
//         params: { nextUrl: to.fullPath },
//       });
//     } else {
//       // console.log('token found', from.path);

//       let employeeData = JSON.parse(localStorage.getItem('employee'));
//       if (to.matched.some((record) => record.meta.hr)) {
//         if (
//           employeeData.role === 'company_hr' ||
//           employeeData.role === 'group_hr'
//         ) {
//           next();
//         } else {
//           // for approver bonus request route.
//           next();
//         }
//       } else {
//         // normal routes accessible to everyone.
//         next();
//       }
//     }

//     NProgress.done();
//   } else {
//     next();
//   }
//   // define protection and redirection for admin and employees ends
// });

router.afterEach(() => {
  // finish progress bar
  NProgress.done();
});

export default router;
