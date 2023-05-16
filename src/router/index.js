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

const Registration = () =>
  import(/* webpackChunkName: "login" */ "../views/Registration.vue");

const VerifyEmail = () =>
  import(
    /* webpackChunkName: "login" */ "../views/account-management/VerifyEmail.vue"
  );

const ForgotPassword = () =>
  import(
    /* webpackChunkName: "login" */ "../views/account-management/ForgotPassword.vue"
  );

const ResetPassword = () =>
  import(
    /* webpackChunkName: "reset-password" */ "../views/account-management/ResetPassword.vue"
  );

const MerchantDash = () =>
  import(
    /* webpackChunkName: "MerchantDash" */ "../views/merchant/Dashboard.vue"
  );

const AccountManagement = () =>
  import(
    /* webpackChunkName: "AccountManagement" */ "../views/account-management/AccountManagement.vue"
  );

const MyAccount = () =>
  import(
    /* webpackChunkName: "MyAccount" */ "../views/account-management/MyAccount.vue"
  );

const Orders = () =>
  import(/* webpackChunkName: "MyAccount" */ "../views/orders/Orders.vue");

const Riders = () =>
  import(/* webpackChunkName: "MyAccount" */ "../views/riders/Riders.vue");

const Customers = () =>
  import(
    /* webpackChunkName: "MyAccount" */ "../views/customers/Customers.vue"
  );

const routes = [
  {
    path: "/",
    redirect: "/orders",
  },

  {
    path: "/login",
    name: "login",
    meta: {
      title: "LD - Login",
    },
    component: Login,
  },
  {
    path: "/signup",
    name: "signup",
    meta: {
      title: "LD - Registration",
    },
    component: Registration,
  },
  {
    path: "/forgot-password",
    name: "forgot-password",
    meta: {
      title: "LD - Forgot - Password",
    },
    component: ForgotPassword,
  },
  {
    path: "/reset-password/:token",
    name: "reset-password",
    meta: {
      title: "LD - Reset Password",
    },
    component: ResetPassword,
  },
  {
    path: "/verify-email/:token",
    name: "verify-email",
    meta: {
      title: "LD - Verify Email",
    },
    component: VerifyEmail,
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: MerchantDash,
    meta: {
      title: "LD MerchantDash",
      requiresAuth: true,
      hr: true,
    },
  },

  {
    path: "/orders",
    name: "orders",
    component: Orders,
    meta: {
      title: "LD-orders",
      requiresAuth: true,
    },
  },
  {
    path: "/riders",
    name: "riders",
    component: Riders,
    meta: {
      title: "LD-riders",
      requiresAuth: true,
    },
  },
  {
    path: "/customers",
    name: "customers",
    component: Customers,
    meta: {
      title: "LD-customers",
      requiresAuth: true,
      hr: true,
    },
  },
  {
    path: "/accounts",
    name: "accounts",
    component: AccountManagement,
    meta: {
      title: "LD - Accounts",
      requiresAuth: true,
    },
  },

  {
    path: "/my-account",
    name: "my-account",
    component: MyAccount,
    meta: {
      title: "LD Account",
      requiresAuth: true,
    },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  //route refresh to reuse the state's selected language

  // start progress bar
  NProgress.start();
  // This goes through the matched routes from last to first, finding the closest route with a title.
  // e.g., if we have `/some/deep/nested/route` and `/some`, `/deep`, and `/nested` have titles,
  // `/nested`'s will be chosen.
  const nearestWithTitle = to.matched
    .slice()
    .reverse()
    .find((r) => r.meta && r.meta.title);

  const previousNearestWithTitle = from.matched
    .slice()
    .reverse()
    .find((r) => r.meta && r.meta.title);

  // If a route with a title was found, set the document (page) title to that value.
  if (nearestWithTitle) {
    document.title = nearestWithTitle.meta.title;
  } else if (previousNearestWithTitle) {
    document.title = previousNearestWithTitle.meta.title;
  }

  // define protection and redirection for admin and employees section
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (localStorage.getItem("token") === null) {
      next({
        path: "/login",
        params: { nextUrl: to.fullPath },
      });
    } else {
      next();
      // console.log("token found", from.path);
      // let currentUser = JSON.parse(localStorage.getItem("user"));
      // // if (to.matched.some((record) => record.meta.hr)) {
      // if (to.matched.some((record) => record.meta.hr)) {
      //   if (
      //     currentUser.role === "company_hr" ||
      //     currentUser.role === "group_hr"
      //   ) {
      //     next();
      //   } else {
      //     // for approver bonus request route.
      //     next();
      //   }
      // } else {
      //   // normal routes accessible to everyone.
      //   next();
      // }
    }

    NProgress.done();
  } else {
    next();
  }
  // define protection and redirection for admin and employees ends
});

router.afterEach(() => {
  // finish progress bar
  NProgress.done();
});

export default router;
