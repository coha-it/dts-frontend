function page(path) {
  return () =>
    import(/* webpackChunkName: '' */ `@/pages/${path}`).then(
      (m) => m.default || m
    );
}

export default [
  // Unauthentificated
  { path: "/", name: "welcome", component: page("_guest/welcome.vue") },
  { path: "/auth", name: "auth", component: page("_guest/auth/auth.vue") },
  { path: "/pan", name: "pan", component: page("_guest/auth/pan.vue") },
  { path: "/pan*", component: page("_guest/auth/pan.vue") },
  { path: "/p/:pan", redirect: { path: "/pan/:pan" } },
  { path: "/login", name: "login", component: page("_guest/auth/login.vue") },
  {
    path: "/register",
    name: "register",
    component: page("_guest/auth/register.vue"),
  },
  {
    path: "/password/reset",
    name: "password.request",
    component: page("_guest/auth/password/email.vue"),
    meta: { title: "reset_password" },
  },
  {
    path: "/password/reset/:token",
    name: "password.reset",
    component: page("_guest/auth/password/reset.vue"),
  },
  {
    path: "/email/verify/:id",
    name: "verification.verify",
    component: page("_guest/auth/verification/verify.vue"),
    meta: { title: "verify_email" },
  },
  {
    path: "/email/resend",
    name: "verification.resend",
    component: page("_guest/auth/verification/resend.vue"),
    meta: { title: "verify_email" },
  },

  // Authentificated
  {
    path: "/",
    component: page("index.vue"),
    // meta: {
    //   middleware: 'auth'
    // },
    children: [
      // Landing Pages
      {
        path: "/home",
        name: "home",
        component: page("home.vue"),
        meta: {
          title: "home",
        },
      },
      {
        path: "/faq",
        name: "faq",
        component: page("faq.vue"),
        meta: {
          title: "FAQ",
        },
      },

      // Surveys
      {
        path: "/surveys",
        name: "surveys",
        component: page("surveys/surveys.vue"),
        meta: {
          title: "surveys",
        },
      },

      // Account Settings
      {
        path: "/settings",
        name: "settings",
        component: page("settings"),
        meta: {
          title: "settings",
        },
      },

      // Old Settings
      // { path: '/settings',
      //   component: page('settings/index.vue'),
      //   children: [
      //     { path: '', redirect: { name: 'settings.profile' } },
      //     { path: 'profile', name: 'settings.profile', component: page('settings/profile.vue') },
      //     { path: 'password', name: 'settings.password', component: page('settings/password.vue'), meta: {title: 'settings'} }
      //   ]
      // }
    ],
  },

  {
    path: "/survey/:id",
    name: "survey",
    component: page("surveys/survey.vue"),
    meta: {
      middleware: 'auth',
      title: "survey",
    },
  },

  // Managment / Verwaltung
  {
    path: "/backend",
    component: page("backend/index.vue"),
    meta: {
      title: "managment",
      middleware: 'auth',
    },
    children: [
      {
        path: "users",
        name: "backend.users",
        component: page("backend/users.vue"),
        meta: {
          title: "users",
        },
      },
      {
        path: "groups",
        name: "backend.groups",
        component: page("backend/groups.vue"),
        meta: {
          title: "groups",
        },
      },
      {
        path: "surveys",
        name: "backend.surveys",
        component: page("backend/surveys/backend_surveys.vue"),
        meta: {
          title: "surveys",
        },
      },
      {
        path: "survey/:id",
        name: "backend.survey",
        component: page("backend/surveys/backend_survey.vue"),
        meta: {
          title: "edit_survey",
        },
      },
      {
        path: "statistics/select",
        name: "backend.statistics.select",
        component: page("backend/statistics/select.vue"),
        meta: {
          title: "select_statistics",
        },
      },
      {
        path: "statistics/surveys=:survey_ids/statistic=:statistic_id?/view=:view_id?",
        name: "backend.statistics.view",
        component: page("backend/statistics/view.vue"),
        props: true,
        meta: {
          title: "view_statistics",
        },
      },
    ],
  },

  // All
  {
    path: "*",
    component: page("_all/errors/404.vue"),
    meta: {
      title: "404 Not Found",
    },
  },
];
