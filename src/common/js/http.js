import axios from "axios";
import pending from "../js/pending";

axios.defaults.timeout = 5000;
// axios.defaults.baseURL = "/api";
// https://api.douban.com/v2
axios.defaults.baseURL =
  "https://bird.ioliu.cn/v1?url=https://api.douban.com/v2";

let cancelToken = axios.CancelToken;
let removePending = ever => {
  for (let p in pending._axiosPromiseCancel) {
    if (pending._axiosPromiseCancel[p].u === ever.url + "&" + ever.method) {
      //当当前请求在数组中存在时执行函数体
      pending._axiosPromiseCancel[p].f(); //执行取消操作
      pending._axiosPromiseCancel.splice(p, 1); //把这条记录从数组中移除
    }
  }
};

axios.defaults.headers.post["Content-Type"] = "application/json";
//http request 拦截器
axios.interceptors.request.use(
  config => {
    config.data = JSON.stringify(config.data);
    config.headers = {
      "Content-Type": "application/x-www-form-urlencoded"
    };
    // ------------------------------------------------------------------------------------
    removePending(config); //在一个ajax发送前执行一下取消操作
    config.cancelToken = new cancelToken(c => {
      // 这里的ajax标识我是用请求地址&请求方式拼接的字符串，当然你可以选择其他的一些方式
      pending._axiosPromiseCancel.push({
        u: config.url + "&" + config.method,
        f: c
      });
    });
    // -----------------------------------------------------------------------------------------

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

//http response 拦截器
axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    // return Promise.reject(error);
    if (axios.isCancel(error)) {
      // 为了终结promise链 就是实际请求 不会走到.catch(rej=>{});这样就不会触发错误提示之类了。
      return new Promise(() => {});
    } else {
      return Promise.reject(error);
    }
  }
);
export function getHttp(url, params = {}) {
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        params: params
      })
      .then(response => {
        resolve(response);
      })
      .catch(err => {
        reject(err);
      });
  });
}
export function postHttp(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.post(url, data).then(
      response => {
        resolve(response);
      },
      err => {
        reject(err);
      }
    );
  });
}

/**
 * 封装patch请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function patchHttp(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.patch(url, data).then(
      response => {
        resolve(response.data);
      },
      err => {
        reject(err);
      }
    );
  });
}

/**
 * 封装put请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function putHttp(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.put(url, data).then(
      response => {
        resolve(response.data);
      },
      err => {
        reject(err);
      }
    );
  });
}
/**
 * 豆瓣电影接口
 */
export function ApiUrl() {
  return {
    in_theaters: "/movie/in_theaters", //正在热映
    search: "/movie/search", //搜索
    movie_detail: "/movie/subject", //电影详情
    coming_soon: "/movie/coming_soon", //即将上映
    detail: "/movie/subject/"
  };
}
export function setScrollTop(element, value) {
  // "scrollTop" in element
  //   ? (element.scrollTop = value)
  //   : element.scrollTo(element.scrollX, value);
    window.scrollTo(0, 0);
}
