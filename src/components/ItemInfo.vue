<template>
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
          class="moviesitem"
          v-for="wellReceived in wellReceivedList['list']"
          :key="wellReceived.id"
          @click="gotoDetail(wellReceived.id)"
        >
          <span class="moviesitem-img">
            <img v-lazy="wellReceived.images.small">
          </span>
          <span class="moviesitem-info">
            <div class="moviesitem-info-title-rate">
              <span class="moviesitem-info-title">{{wellReceived.title}}</span>
              <span class="moviesitem-info-rate">
                <van-tag
                  size="medium"
                  type="primary"
                >{{(wellReceived.rating.average+"").length==1?wellReceived.rating.average+".0":wellReceived.rating.average}}</van-tag>
              </span>
            </div>
            <div>
              <span>
                类型：
                <span v-for="(genre,index) in wellReceived.genres" :key="index">
                  {{
                  genre+" "}}
                </span>
              </span>
            </div>
            <div>
              <span>
                导演：
                <span
                  v-for="(director,index) in wellReceived.directors"
                  :key="index"
                >{{director.name+" "}}</span>
              </span>
            </div>
            <div>
              <span>
                演员：
                <span v-for="(cast,index) in wellReceived.casts" :key="index">{{cast.name+" "}}</span>
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
</template>
<script>
// import Vue from "vue";
export default {
  name: "iteminfo",
  props: ["apiurl"],
  data() {
    return {
      wellReceivedList: {
        list: [],
        total: 0,
        start: 0,
        count: 0
      },
      score: 0,
      loadingBox: false,
      isLoading: false,
      loading: false,
      finished: false,
      check: false,
      error: false
    };
  },
  watch: {},
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
    onRefresh() {
      this._onRefresh();
    },
    _onRefresh: function() {
      let that = this;
      let in_theaters = this.apiurl;
      try {
        this.$getHttp(in_theaters)
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
            that.wellReceivedList = temData;
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
      this.wellReceivedList = {
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
      let that = this;
      let in_theaters = this.apiurl;
      this.loadingBox = true;
      try {
        this.$getHttp(in_theaters)
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
            that.wellReceivedList = temData;
            that.loadingBox = false;
          })
          .catch(function(err) {
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
      let in_theaters = this.apiurl;
      var obj = that.wellReceivedList;
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

      let url = `${in_theaters}&start=${start}&count=${count}`;
      try {
        this.$getHttp(url)
          .then(function(res) {
            let dataobj = res.data;
            that.wellReceivedList["total"] = dataobj.total;
            that.wellReceivedList["start"] = dataobj.start;
            that.wellReceivedList["count"] = dataobj.count;
            dataobj.subjects.forEach(item => {
              that.wellReceivedList["list"].push(item);
            });
            // 加载状态结束
            that.loading = false;
            // 数据全部加载完成
            if (
              that.wellReceivedList["list"].length >=
              that.wellReceivedList["total"]
            ) {
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
  },
  created() {
    this.initData();
  }
};
</script>

<style>
.iteminfo {
  padding: 118px 5px 0px 5px;
  width: 100%;
  box-sizing: border-box;
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
</style>


