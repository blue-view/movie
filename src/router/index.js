import Vue from "vue";
import Router from "vue-router";
import pending from "../common/js/pending";

Vue.use(Router);

//路由懒加载

const WellReceived = resolve => {
  import("@/components/WellReceived").then(module => {
    resolve(module);
  });
};
const ToBeShownSoon = resolve => {
  import("@/components/ToBeShownSoon").then(module => {
    resolve(module);
  });
};

const Search = resolve => {
  import("@/components/Search").then(module => {
    resolve(module);
  });
};
const City = resolve => {
  import("@/components/City").then(module => {
    resolve(module);
  });
};
const Province = resolve => {
  import("@/components/Province").then(module => {
    resolve(module);
  });
};
const Header = resolve => {
  import("@/components/Header").then(module => {
    resolve(module);
  });
};
const Detail = resolve => {
  import("@/components/Detail").then(module => {
    resolve(module);
  });
};

var router = new Router({
  // mode: 'history',
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { x: 0, y: 0 };
    }
  },

  routes: [
    {
      path: "/",
      name: "wellReceived",
      // component: WellReceived
      components: {
        default: WellReceived,
        header: Header
      }
    },
    {
      path: "/toBeShownSoon",
      name: "toBeShownSoon",
      // component: ToBeShownSoon,
      components: {
        default: ToBeShownSoon,
        header: Header
      }
    },
    {
      path: "/search",
      name: "search",
      components: {
        default: Search
      }
    },
    {
      path: "/city",
      name: "city",
      components: {
        default: City
      }
    },
    {
      path: "/province",
      name: "province",
      components: {
        default: Province
      }
    },
    {
      path: "/detail",
      name: "detail",
      components: {
        default: Detail
      }
    }
  ]
});
// console.log(pending);
router.beforeEach((to, from, next) => {
  pending._axiosPromiseCancel.forEach(e => {
    e && e.f();
  });
  pending._axiosPromiseCancel = [];
  next();
});

export default router;
