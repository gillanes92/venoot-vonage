import { createAuth } from "@websanova/vue-auth";
import driverAuthBearer from "@websanova/vue-auth/dist/drivers/auth/bearer.esm.js";
import driverHttpAxios from "@websanova/vue-auth/dist/drivers/http/axios.1.x.esm.js";
import driverRouterVueRouter from "@websanova/vue-auth/dist/drivers/router/vue-router.2.x.esm.js";

import axios from "../axios";
import router from "../../router";

const auth = createAuth({
  plugins: {
    http: axios,
    router,
  },

  drivers: {
    http: driverHttpAxios,
    auth: driverAuthBearer,
    router: driverRouterVueRouter,
  },

  options: {
    loginData: {
      url: "chatter/auth/login",
      fetchUser: false,
      rememberMe: true,
    },
    logoutData: {
      url: "chatter/auth/logout",
      method: "POST",
      makeRequest: true,
    },
    fetchData: { url: "chatter/auth/me", method: "GET", enabled: true },
    refreshData: { url: "chatter/auth/refresh", enabled: false, interval: 15 },
  },
});

export { auth, axios, router };
