<template>
  <div class="m-header">
    <div class="m-header-title">电影</div>
    <div class="m-header-search">
      <span class="m-header-search-city">
        <span @click="choseCity">{{getCity|formatCity}}</span>
        <div id="allmap" v-show="false"></div>
      </span>
      <span class="m-header-search-keyword">
        <form action="/">
          <van-search
            v-model="keyword"
            placeholder="请输入搜索关键词"
            @search="onSearch"
            @cancel="onCancel"
            @clear="onClear"
            @focus="goToSearch"
          />
        </form>
      </span>
    </div>
    <div class="m-header-nav">
      <span @click="changeNav(index)" v-for="(link,index) in links" :key="index">
        <router-link
          :class="navIndex==index?'selected':''"
          :to="{name:link.name,path:link.path,query:{city:getCity}}"
        >{{link.text}}</router-link>
      </span>
    </div>
  </div>
</template>
<script>
let links = [
  {
    name: "wellReceived",
    path: "/",
    text: "正在热映"
  },
  {
    name: "toBeShownSoon",
    path: "/toBeShownSoon",
    text: "即将上映"
  }
];
import Vue from "vue";
export default {
  name: "mheader",
  computed: {
    getCity() {
      if (this.$route.query.city) {
        return this.$route.query.city;
      } else if (Vue.localStorage.get("city")) {
        return Vue.localStorage.get("city");
      } else {
        return this.city;
      }
    },
    getNavIndex() {
      return Vue.localStorage.get("navIndex")
        ? 0
        : Vue.localStorage.get("navIndex");
    }
  },
  data() {
    let self = this;
    return {
      links: links,
      keyword: "",
      navIndex: "",
      center: [119.24958, 26.04322],
      lng: 0,
      lat: 0,
      loaded: false,
      city: "福州"
    };
  },
  created() {
    //获取地名
  },
  methods: {
    onSearch() {},
    goToSearch() {
      // console.log("test");
      this.$router.push({
        name: "search",
        path: "/search"
      });
    },
    onCancel() {},
    onClear() {},
    changeNav(index) {
      this.navIndex = index;
      Vue.localStorage.set("navIndex", index);
    },
    choseCity() {
      this.$router.push({
        name: "province",
        path: "/province"
      });
    }
  },
  filters: {
    formatCity: function(city) {
      if (city != null && city != "" && city.length >= 2) {
        return city.substring(0, 2);
      }
    }
  },
  mounted() {
    // console.log( Vue.localStorage.get("navIndex"));
    this.navIndex = Vue.localStorage.get("navIndex");
    var map = new BMap.Map("allmap");
    var point = new BMap.Point(116.331398, 39.897445);
    map.centerAndZoom(point, 12);
    var geolocation = new BMap.Geolocation();
    var that = this;
    geolocation.getCurrentPosition(
      function(r) {
        if (this.getStatus() == BMAP_STATUS_SUCCESS) {
          // that.city = r.address.city.replace("市", "");
          Vue.localStorage.set("city", that.city);
        } else {
          alert("failed" + this.getStatus());
        }
      },
      { enableHighAccuracy: true }
    );
  }
};
</script>
<style scoped>
.m-header {
  position: fixed;
  width: 100%;
  background: #fff;
  z-index: 9000;
}
.m-header-title {
  width: 100%;
  height: 32px;
  line-height: 32px;
  background-color: rgb(25, 137, 250);
  color: #fff;
  text-indent: 10px;
  /* border-radius: 5px; */
}
.m-header-search {
  display: flex;
  line-height: 54px;
  height: 54px;
}
.m-header-search-city {
  display: inline-block;
  text-align: center;
  width: 50px;
}
.m-header-search-keyword {
  flex-grow: 1;
}
.m-header-nav {
  width: 100%;
  height: 32px;
  display: flex;
  line-height: 32px;
}
.m-header-nav span {
  width: 50%;
  text-align: center;
  display: inline-block;
}
a:link {
  color: #000;
}
a:visited {
  color: #000;
}
.m-header-nav span a {
  width: 100%;
  text-align: center;
  display: inline-block;
  font-size: 16px;
  transition: all 0.2s;
}
.m-header-nav span a.selected {
  color: rgb(25, 137, 250);
  font-weight: bold;
  border-bottom: solid 2px rgb(25, 137, 250);
}
.m-header-search-city {
  position: relative;
}
.m-header-search-city::after {
  position: absolute;
  content: "";
  z-index: 100;
  border: 5px solid #7d7e80;
  border-top: 5px solid transparent;
  border-right: 5px solid transparent;
  top: 50%;
  margin-top: -8px;
  right: -8px;
  transform: rotate(-45deg);
  /* width:10px;
  height: 10px;; */
}
</style>


