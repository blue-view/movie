import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./common/css/reset.css";
import { getHttp, ApiUrl, setScrollTop } from "./common/js/http";
import _ from "lodash";
import VueLocalStorage from "vue-localstorage";
import axios from "axios";
import store from "./store";
import attachFastClick from "fastclick";

import {
  Row,
  Col,
  Search,
  Rate,
  Tag,
  Lazyload,
  Loading,
  PullRefresh,
  Toast,
  List
} from "vant";

Vue.prototype._ = _;
Vue.prototype.$getHttp = getHttp;
Vue.prototype.$setScrollTop = setScrollTop;
Vue.prototype.$apiUrl = new ApiUrl();

Vue.config.productionTip = false;

Vue.use(Row)
  .use(Col)
  .use(Search)
  .use(Rate)
  .use(Tag)
  .use(Lazyload, {
    attempt: 3,
    lazyComponent: true,
    loading: require("./assets/movie_default.jpg"),
    error: require("./assets/error.jpg")
  })
  .use(Loading)
  .use(PullRefresh)
  .use(Toast)
  .use(List)
  .use(VueLocalStorage);

// 消除 click 移动浏览器300ms延迟
attachFastClick.attach(document.body);



new Vue({
  store,
  router,
  render: h => h(App)
}).$mount("#app");
