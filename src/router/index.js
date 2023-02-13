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

// const HrSettings = () =>
//   import(/* webpackChunkName: "HrSettings" */ '../views/hr/settings.vue');

// const HrSettingsLandingPage = () =>
//   import(
//     /* webpackChunkName: "HrSettingsLandingPage" */ "../views/admin/settings/SettingsLanding.vue"
//   );

// const SettingsPlaceHolder = () =>
//   import(
//     /* webpackChunkName: "SettingsPlaceHolder" */ "../views/admin/settings/SettingsPlaceHolder.vue"
//   );
// const PackagesSettingsDash = () =>
//   import(
//     /* webpackChunkName: "PackagesSettingsDash" */ "../views/admin/settings/PackagesSettingsDash.vue"
//   );

// const BonusSettingsDash = () =>
//   import(
//     /* webpackChunkName: "BonusSettingsDash" */ "../views/admin/settings/BonusSettingsDash.vue"
//   );

// const WelcomeMessageSettingsDash = () =>
//   import(
//     /* webpackChunkName: "WelcomeMessageSettingsDash" */ "../views/admin/settings/WelcomeMessageSettingsDash.vue"
//   );

// const EmployeeSettings = () =>
//   import(
//     /* webpackChunkName: "EmployeeSettings" */ "../views/employee/settings.vue"
//   );

// const MyAccount = () =>
//   import(/* webpackChunkName: "my account" */ "../views/my-account.vue");

// const BonusRequestsList = () =>
//   import(
//     /* webpackChunkName: "bonus requests" */ "../views/BonusRequestsList.vue"
//   );

const UserGroups = () =>
  import(
    /* webpackChunkName: "user groups" */ "../views/admin/user-access-management/users.groups.vue"
  );

const ManageEmployees = () =>
  import(
    /* webpackChunkName: "manage employees" */ "../views/admin/user-access-management/employees.vue"
  );

const Logs = () =>
  import(
    /* webpackChunkName: "logs" */ "../views/admin/user-access-management/logs.vue"
  );

const UsersGroupsAndRoleManagement = () =>
  import(
    /* webpackChunkName: "UsersGroupsAndRoleManagement" */ "../views/admin/user-access-management/users-transition-window.vue"
  );

const singleUserPermissionDetails = () =>
  import(
    /* webpackChunkName: "singleUserPermissionDetails" */ "../views/admin/user-access-management/single-user-permission-details.vue"
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
  // {
  //   path: "/settings",
  //   name: "hr-settings",
  //   component: SettingsPlaceHolder,
  //   meta: {
  //     title: "MM Grupp - HR Settings",
  //     requiresAuth: true,
  //     hr: true,
  //   },
  //   children: [
  //     {
  //       path: "",
  //       name: "hr-settings",
  //       component: HrSettingsLandingPage,
  //       meta: {
  //         title: "MM Grupp - HR Settings ",
  //         requiresAuth: true,
  //         hr: true,
  //       },
  //     },
  //     {
  //       path: "packages",
  //       name: "manage-bonuses",
  //       component: PackagesSettingsDash,
  //       meta: {
  //         title: "MM Grupp - Employee Bonus Settings ",
  //         requiresAuth: true,
  //         hr: true,
  //       },
  //     },
  //     {
  //       path: "bonuses",
  //       name: "manage-packages",
  //       component: BonusSettingsDash,
  //       meta: {
  //         title: "MM Grupp - Employee Package Settings ",
  //         requiresAuth: true,
  //         hr: true,
  //       },
  //     },
  //     {
  //       path: "messaging",
  //       name: "welcome-messages",
  //       component: WelcomeMessageSettingsDash,
  //       meta: {
  //         title: "MM Grupp - Employee Welcome Message Setting ",
  //         requiresAuth: true,
  //         hr: true,
  //       },
  //     },
  //   ],
  // },
  // {
  //   path: "/bonus/tracker",
  //   name: "bonus-tracker",
  //   component: EmployeeList,
  //   meta: {
  //     title: "MM Grupp - Bonus Tracker",
  //     requiresAuth: true,
  //     hr: true,
  //   },
  //   children: [
  //     {
  //       path: "",
  //       name: "employees-bonus-tracker",
  //       component: HRBonusTracker,
  //       meta: {
  //         title: "MM Grupp - Employee Bonus Tracker",
  //         requiresAuth: true,
  //         hr: true,
  //       },
  //     },
  //     {
  //       path: "employee/:id",
  //       name: "hr-employee-bonuses",
  //       component: EmployeeBonuses,
  //       meta: {
  //         title: "MM Grupp - Employee Bonus Tracker",
  //         requiresAuth: true,
  //         hr: true,
  //       },
  //     },
  //   ],
  // },

  {
    path: "/admin/groups",
    name: "admin-groups",
    component: UsersGroupsAndRoleManagement,
    meta: {
      title: "Users",
      requiresAuth: true,
      hr: true,
    },
    children: [
      {
        path: "",
        name: "user-info",
        component: UserGroups,
        meta: {
          title: "MM Grupp - User Information",
          requiresAuth: true,
          hr: true,
        },
      },
      {
        path: "user/:id",
        name: "user-perm-detail",
        component: singleUserPermissionDetails,
        meta: {
          title: "MM Grupp - User Permission Detail",
          requiresAuth: true,
          hr: true,
        },
      },
    ],
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

  {
    path: "/admin/groups",
    name: "user-groups",
    component: UserGroups,
    meta: {
      title: "MM Grupp - My Account",
      requiresAuth: true,
    },
  },
  {
    path: "/admin/employees",
    name: "manage-employees",
    component: ManageEmployees,
    meta: {
      title: "MM Grupp - My Account",
      requiresAuth: true,
    },
  },
  {
    path: "/admin/logs",
    name: "manage-logs",
    component: Logs,
    meta: {
      title: "MM Grupp - My Account",
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
