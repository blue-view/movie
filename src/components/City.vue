<template>
  <div class="city">
    <div class="nav">
      <span class="nav-link" @click="go">&lt;</span>
      <span class="nav-city">选择城市</span>
    </div>
    <div class="city-list">
      <van-list v-model="loading" :finished="finished" finished-text @load="onLoad">
        <div v-for="(item,index) in cities" :key="index" v-show="item.length==0?false:true">
          <div class="letter">{{index}}</div>
          <div class="letter-city" v-for="(city,index_city) in item" :key="index_city">
            <router-link :to="{path:city.path,query:{city:city.name}}">{{city.name}}</router-link>
          </div>
        </div>
      </van-list>
    </div>
  </div>
</template>
<script>
import citylist from "../common/data/city.json";
import { makePy } from "../common/js/pinying.js";
import Vue from "vue";

export default {
  name: "city",
  data() {
    return {
      cities: {},
      list: [],
      loading: false,
      finished: true,
      value: ""
    };
  },
  methods: {
    onSearch() {},
    onCancel() {},
    onLoad() {
      // 异步更新数据
    },
    go() {
      this.$router.go(-1);
    }
  },
  created() {
    let that = this;
    var path = Vue.localStorage.get("path");
    let zm = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let i = 0; i < zm.length; i++) {
      this.cities[zm[i]] = [];
    }
    citylist.map(function(item) {
      if (item.name == that.$route.query.city) {
        item.sub.map(function(city_item) {
          let firstLetter = makePy(city_item.name)[0].substring(0, 1); //获取每一个市区的首字母
          for (let i in that.cities) {
            if (i === firstLetter) {
              city_item.path = path;
              that.cities[i].push(city_item);
            }
          }
        });
      }
    });
  }
};
</script>
<style scoped>
.m-content {
  padding-top: 0;
}
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
.city {
  width: 100%;
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


