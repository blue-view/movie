<template>
  <div class="search">
    <div class="m-search-page">
      <form action="/">
        <van-search
          background="rgb(25, 137, 250)"
          v-model="keyword"
          showAction
          placeholder="请输入搜索关键词"
          :finished="finished"
          finished-text="没有更多了"
          :error.sync="error"
          error-text="请求失败，点击重新加载"
          @cancel="onCancel"
          @search="onKeySearch"
        />
      </form>
    </div>
    <div class="record" v-if="this.searchList['total']">
      共搜索到
      <span class="reccolor">{{this.searchList['total']}}</span>记录
    </div>
    <div class="iteminfo">
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <van-list
          :immediate-check="false"
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          :error.sync="error"
          error-text="请求失败，点击重新加载"
          @load="onLoad"
        >
          <div
            @click="gotoDetail(searchResult.id)"
            class="moviesitem"
            v-for="(searchResult,index) in searchList['list']"
            :key="searchResult.id+'_'+index"
          >
            <span class="moviesitem-img">
              <img v-lazy="searchResult.images.small">
            </span>
            <span class="moviesitem-info">
              <div class="moviesitem-info-title-rate">
                <span class="moviesitem-info-title">{{searchResult.title}}</span>
                <span class="moviesitem-info-rate">
                  <van-tag
                    size="medium"
                    type="primary"
                  >{{(searchResult.rating.average+"").length==1?searchResult.rating.average+".0":searchResult.rating.average}}</van-tag>
                </span>
              </div>
              <div>
                <span>
                  类型：
                  <span v-for="(genre,index) in searchResult.genres" :key="index">
                    {{
                    genre+" "}}
                  </span>
                </span>
              </div>
              <div>
                <span>
                  导演：
                  <span
                    v-for="(director,index) in searchResult.directors"
                    :key="index"
                  >{{director.name+" "}}</span>
                </span>
              </div>
              <div>
                <span>
                  演员：
                  <span v-for="(cast,index) in searchResult.casts" :key="index">{{cast.name+" "}}</span>
                </span>
              </div>
            </span>
          </div>
        </van-list>
      </van-pull-refresh>
      <div class="loading" v-if="loadingBox">
        <van-loading color="white"/>
      </div>
    </div>
    <div class="noresult" v-if="noresult">没有搜索到相关数据</div>
  </div>
</template>

<script>
import Vue from "vue";

export default {
  name: "search",
  data() {
    return {
      keyword: "",
      searchList: {
        list: [],
        total: 0,
        start: 0,
        count: 0
      },
      apiurl: this.$apiUrl.search + "?q=",
      score: 0,
      loadingBox: false,
      isLoading: false,
      loading: false,
      finished: false,
      check: false,
      error: false,
      noresult: false
    };
  },
  watch: {
    keyword(newvaule) {
      if (!newvaule) {
        this.searchList = {
          list: [],
          total: 0,
          start: 0,
          count: 0
        };
        // this.apiurl = "";
        this.score = 0;
        this.loadingBox = false;
        this.isLoading = false;
        this.loading = false;
        this.finished = false;
        this.check = false;
        this.error = false;
      } else {
        // this.apiurl += "?q=" + newvaule;
      }
    }
  },
  created() {
    if (Vue.localStorage.get("keyword")) {
      this.keyword = Vue.localStorage.get("keyword");
      this.apiurl += Vue.localStorage.get("keyword");
      this.initData();
    }
  },
  methods: {
    gotoDetail(id) {
      let node = document.documentElement || document.body;
      this.$setScrollTop(node, 0);
      this.$router.push({
        name: "detail",
        path: "/detail",
        query: {
          id: id
        }
      });
    },

    onKeySearch() {
      this.apiurl += this.keyword;
      this.initData();
    },
    onCancel() {
      Vue.localStorage.set("keyword", "");
      this.$router.go(-1);
    },
    onRefresh() {
      this._onRefresh();
    },
    _onRefresh: function() {
      let that = this;
      let in_search = this.apiurl;
      try {
        this.$getHttp(in_search)
          .then(function(res) {
            let dataobj = res.data;
            let temData = {};
            temData["list"] = [];
            temData["total"] = dataobj.total;
            temData["start"] = dataobj.start;
            temData["count"] = dataobj.count;
            dataobj.subjects.forEach(item => {
              temData["list"].push(item);
            });
            that.searchList = temData;
            that.$toast("刷新成功");
            that.isLoading = false;
          })
          .catch(function(err) {
            that.isLoading = false;
            err.message && that.$toast(err.message);
          });
      } catch (error) {
        that.isLoading = false;
      }
    },
    initData() {
      // let node = document.documentElement || document.body;
      // this.$setScrollTop(node, 0);
      let that = this;
      let in_search = this.apiurl;
      this.loadingBox = true;
      try {
        this.$getHttp(in_search)
          .then(function(res) {
            // console.log(res);
            let dataobj = res.data;
            let temData = {};
            temData["list"] = [];
            temData["total"] = dataobj.total;
            temData["start"] = dataobj.start;
            temData["count"] = dataobj.count;
            dataobj.subjects.forEach(item => {
              temData["list"].push(item);
            });
            that.searchList = temData;
            that.loadingBox = false;
            // console.log(that.searchList);
            Vue.localStorage.set("keyword", that.keyword);
            dataobj.subjects.length == 0
              ? (that.noresult = true)
              : (that.noresult = false);
          })
          .catch(function(err) {
            // console.log(err.message);
            that.loadingBox = false;
            err.message && that.$toast(err.message);
          });
      } catch (error) {
        that.loadingBox = false;
      }
    },
    _onLoad() {
      // 异步更新数据
      let that = this;
      let in_search = this.apiurl;
      var obj = that.searchList;
      let totalCount = obj.total;
      let start = obj.start + obj.list.length;
      let count = 0;
      if (totalCount - start > count) {
        count = obj.count;
      } else {
        count = totalCount - start;
      }
      if (count < 0) {
        that.loading = false;
        that.finished = true;
        return;
      }
      if (start > totalCount) {
        that.loading = false;
        that.finished = true;
        return;
      }

      let url = `${in_search}&start=${start}&count=${count}`;
      try {
        this.$getHttp(url)
          .then(function(res) {
            let dataobj = res.data;
            that.searchList["total"] = dataobj.total;
            that.searchList["start"] = dataobj.start;
            that.searchList["count"] = dataobj.count;
            dataobj.subjects.forEach(item => {
              that.searchList["list"].push(item);
            });
            // 加载状态结束
            that.loading = false;
            // 数据全部加载完成
            if (that.searchList["list"].length >= that.searchList["total"]) {
              that.finished = true;
            }
          })
          .catch(function(err) {
            that.loading = false;
            that.finished = true;
            that.error = true;
            err.message && that.$toast(err.message);
          });
      } catch (error) {
        that.loading = false;
        that.error = true;
        that.finished = true;
      }
    },
    onLoad() {
      this._onLoad();
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.m-content {
  padding: 0px;
}
.m-search-page {
  position: fixed;
  width: 100%;
  height: 54px;
  z-index: 10;
}
.van-search__action {
  color: #fff;
}
.iteminfo {
  padding: 0px 5px 0 5px;
  width: 100%;
  box-sizing: border-box;
}
.record {
  color: #000;
  padding-top: 65px;
  text-indent: 5px;
}
.reccolor {
  color: rgb(25, 137, 250);
}
img {
  width: 100px;
  height: 140px;
}

.moviesitem {
  margin-top: 10px;
  width: 100%;
  height: 140px;
  overflow: hidden;
  display: flex;
  background: #fff;
  font-size: 13px;
  color: rgba(0, 0, 0, 0.9);
}
.moviesitem-info {
  width: 100%;
  flex-grow: 1;
  margin-left: 10px;
  margin-right: 10px;
  box-sizing: border-box;
  line-height: 22px;
  overflow: hidden;
}
.moviesitem-info-title {
  font-size: 17px;
  color: #000;
  font-weight: bolder;
  overflow: hidden;
  height: 22px;
  line-height: 22px;
}
.moviesitem-info-title-rate {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}
.loading {
  position: fixed;
  z-index: 100;
  top: 50%;
  left: 50%;
  padding: 10px;
  border-radius: 3px;
  background-color: rgba(0, 0, 0, 0.5);
  transform: translate(-25px, -25px);
}
.noresult {
  padding-top: 64px;
  padding-bottom: 10px;
  width: 100%;
  text-align: center;
  box-shadow: 0 0 8px gray;
  color: gray;
  border-radius: 2px;
}
</style>
