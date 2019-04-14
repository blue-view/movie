<template>
  <div class="province">
    <div class="nav">
      <span class="nav-link" @click="go">&lt;</span>
      <span class="nav-city">选择城市</span>
    </div>
    <div class="search-bar">
      <form action="/">
        <van-search v-model="value" placeholder="输入城市名称" @search="onSearch" @cancel="onCancel"/>
      </form>
    </div>
    <div class="city-content">
      <div v-show="isShowCity">
        <div class="hot-city-title">热门城市</div>
        <div class="hot-city">
          <span v-for="(city,index) in hotCity.citys" :key="index">
            <router-link :to="{path:hotCity.path,query:{city:city}}">{{city}}</router-link>
          </span>
        </div>
      </div>

      <div class="city-list">
        <van-list v-model="loading" :finished="finished"  @load="onLoad">
          <div v-for="(item,index) in cities" :key="index" v-show="item.length==0?false:true">
            <div class="letter">{{index}}</div>
            <div class="letter-city" v-for="(city,index_city) in item" :key="index_city">
              <router-link :to="{path:city.path,query:{city:city.name}}">{{city.name}}</router-link>
            </div>
          </div>
        </van-list>
        <!-- <div v-show="!ities.length">没有找到城市</div> -->
      </div>
      <div class="nav-letter" v-show="false">
        <span v-for="(le,index) in letter" :key="index">{{le}}</span>
      </div>
    </div>
  </div>
</template>
<script>
import citylist from "../common/data/city.json";
import { makePy } from "../common/js/pinying.js"; //导入插件获取所有城市中文的大写首字母
import Vue from "vue";
import { exists } from "fs";
Vue.hotCity = {
  path: "",
  citys: [
    "北京",
    "上海",
    "广州",
    "深圳",
    "成都",
    "武汉",
    "杭州",
    "重庆",
    "郑州"
  ]
};
export default {
  name: "Province",
  computed: {},
  watch: {
    value(newValue) {
      if (newValue) {
        this._search();
      } else {
        this.isShowCity = true;
        this.initData();
      }
    }
  },
  data() {
    return {
      hotCity: Vue.hotCity,
      cities: {},
      letter: [],
      list: [],
      loading: false,
      finished: true,
      value: "",
      isShowCity: true,
      islock: false
    };
  },

  beforeRouteEnter(to, from, next) {
    // 在渲染该组件的对应路由被 confirm 前调用
    // 不！能！获取组件实例 `this`
    // 因为当守卫执行前，组件实例还没被创建
    // console.log(from.path);
    Vue.localStorage.set("path", from.path);
    
    Vue.hotCity.path = from.path;
    next();
  },
  beforeRouteLeave(to, from, next) {
    Vue.localStorage.set("city", to.query.city);
    next();
  },
  methods: {
    onSearch() {
      var that = this;
      if (this.value) {
        this.islock = true;
        if (this.islock) {
          setTimeout(() => {
            that._search();
          }, 50);
        }
      }
    },
    _search() {
      var that = this;
      this.isShowCity = false;
      var tem = [];
      var result3 = [];
      citylist.map(function(item) {
        if (
          item.name.indexOf(that.value) > -1 &&
          !/['省'|'区‘]/.test(item.name)
        ) {
          result3.push(item);
        }

        item.sub.map(function(item2) {
          if (
            item2.name.indexOf(that.value) > -1 &&
            !/['省'|'区‘]/.test(item2.name)
          ) {
            result3.push(item2);
          }
        });
      });

      var zm = that.letter;
      var temobj = null;
      temobj = {};
      for (let i in zm) {
        temobj[zm[i]] = [];
      }

      result3.map(function(item) {
        let firstLetter = makePy(item.name)[0].substring(0, 1); //获取每一个市区的首字母
        for (let i in zm) {
          if (that.letter[i] === firstLetter) {
            item.path = Vue.localStorage.get("path");
            if (
              !temobj[zm[i]].find(function(t) {
                return t.name == item.name;
              })
            ) {
              temobj[zm[i]].push({
                path: Vue.localStorage.get("path"),
                name: item.name
              });
            }
          }
        }
      });
      that.cities = temobj;
      that.islock = false;
    },
    onCancel() {
      this.isShowCity = true;
    },
    onLoad() {
      // 异步更新数据
    },
    go() {
      this.$router.go(-1);
    },
    initData() {
      let that = this;
      let zm = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      for (let i = 0; i < zm.length; i++) {
        this.letter.push(zm[i]);
        this.cities[zm[i]] = [];
      }
      citylist.map(function(item) {
        let firstLetter = makePy(item.name)[0].substring(0, 1); //获取每一个市区的首字母
        for (let i in that.cities) {
          if (i === firstLetter) {
            var lastChar = item.name[item.name.length - 1];

            if (
              lastChar == "市" ||
              item.name == "澳门特别行政区" ||
              item.name == "香港特别行政区"
            ) {
              item.path = Vue.localStorage.get("path");
            } else {
              item.path = "/city";
            }
            that.cities[i].push(item);
          }
        }
      });
    }
  },
  created() {
    this.initData();
  }
};
</script>

<style scoped>
.nav {
  width: 100%;
  height: 40px;
  line-height: 40px;
  background-color: rgb(25, 137, 250);
  color: #fff;
  position: fixed;
  z-index: 8000;
  top: 0;
  left: 0;
  display: flex;
}
.nav-city {
  position: relative;
  display: inline-block;
  box-sizing: border-box;
  padding: 0 20px;
}
.nav-link {
  /* position: absolute; */
  font-size: 25px;
  left: 10px;
  text-align: left;
  padding-left: 10px;
}
.province {
  position: absolute;
  left: 0;
  top: 40px;
}
.search-bar {
  position: fixed;
  background: #fff;
  width: 100%;
}
.city-content {
  width: 320px;
  padding-top: 54px;
}
.hot-city-title {
  width: 100%;
  padding: 10px 10px;
  box-sizing: border-box;
}
.hot-city {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-content: center;
  padding: 0 10px;
  box-sizing: border-box;
}
.hot-city span {
  width: 30%;
  height: 30px;
  display: inline-block;
  flex-flow: 1;
  line-height: 30px;
  text-align: center;
  border-radius: 5px;
  border: 1px solid #ccc;
  margin-bottom: 10px;
}
.nav-letter {
  position: fixed;
  display: flex;
  flex-direction: column;
  right: 10px;
  top: 50px;
  z-index: 10000;
}
.nav-letter span {
  display: inline-block;
  color: rgb(25, 137, 250);
  padding: 1px;
}
.city-list {
  width: 100%;
  /* padding: 0 10px; */
}
.letter {
  width: 100%;
  background: #d9dbe0;
  height: 30px;
  line-height: 30px;
  padding-left: 10px;
  box-sizing: border-box;
}
.letter-city {
  width: 100%;
  background: #fff;
  height: 40px;
  line-height: 40px;
  border-bottom: 1px solid #d9dbe0;
  padding-left: 10px;
  box-sizing: border-box;
}
.letter-city a {
  display: inline-block;
  width: 100%;
  height: 40px;
  line-height: 40px;
}
</style>

