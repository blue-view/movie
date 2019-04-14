
<template>
  <div class="detail">
    <div class="nav">
      <span class="nav-link" @click="go">&lt;</span>
      <span class="nav-city">电影</span>
      <span class="nav-share">
        <span style="opacity:0;">分享</span>
      </span>
    </div>
    <div class="detail-item">
      <img :src="detailObj.images.small">
    </div>
    <div class="detail-item2">
      <img :src="detailObj.images.small" v-if="detailObj.images.small">
    </div>
    <div class="detail-ins">
      <div>
        <span class="m-title">
          {{
          detailObj.title
          }}
        </span>
        <span>{{detailObj.year}}</span>
        <span v-for=" (genre,index) in detailObj.genres" :key="index">/ {{genre}}</span>
        <span
          class="m-original_title"
          v-if="detailObj.original_title"
        >原名：{{detailObj.original_title}}</span>
        <span class="m-countries" v-if="detailObj.countries.length">
          制片国家/地区：
          <span
            v-for=" (countrie,index) in detailObj.countries"
            :key="index"
          >{{countrie}} {{index==detailObj.countries.length-1?"":'/'}}</span>
        </span>
        <span class="m-summary" v-if="detailObj.summary">
          <span class="m-summary-simple">简介</span>
          <span>{{detailObj.summary}}</span>
        </span>
        <div class="m-artist">
          <div class="m-artist-title" v-show="showRate">影人</div>
          <div class="wrapper" ref="wrapper">
            <ul class="content" :style="{width:getContentWidth}">
              <li v-for="(art,index) in detailObj.artist" :key="index">
                <span class="m-artist-img">
                  <img v-lazy="art.img">
                </span>
                <span class="m-artist-name">{{art.name}}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="m-rating" v-show="showRate">
        <div class="m-rating-title">豆瓣评分</div>
        <div class="m-rating-average">{{detailObj.rating.average}}</div>
        <div class="m-rating-average-icon">
          <van-rate readonly :size="10" v-model="value"/>
        </div>
        <div class="m-rating-count">{{detailObj.ratings_count}}人</div>
      </div>
    </div>
    <div class="detail-artist"></div>
    <div class="loading" v-if="loadingBox">
      <van-loading color="white"/>
    </div>
  </div>
</template>
<script>
import BScroll from "better-scroll";

export default {
  name: "detail",
  methods: {
    go() {
      this.$router.go(-1);
    }
  },
  computed: {
    getContentWidth() {
      return this.detailObj.artist.length * ((90 * 100) / 320) + "vw";
    }
  },
  watch: {},
  data() {
    return {
      wchildren: [],
      loadingBox: false,
      value: 0,
      detailObj: {
        countries: [],
        original_title: "",
        images: {
          small: ""
        },
        year: "",
        genres: [],
        title: "",
        summary: "",
        rating: {
          average: ""
        },
        ratings_count: "",
        artist: []
      },
      showRate: false
    };
  },
  created() {},
  mounted() {
    this.loadingBox = true;
    var id = this.$route.query.id;
    let that = this;
    let in_detail = this.$apiUrl.detail + id;
    try {
      this.$getHttp(in_detail)
        .then(function(res) {
          let dataobj = res.data;
          dataobj.artist = [];
          dataobj.directors.forEach(director => {
            dataobj.artist.push({
              img: (director.avatars && director.avatars.small) || "",
              id: director.id || 0,
              name: director.name || "",
              job: "导演"
            });
          });
          dataobj.casts.forEach(cast => {
            dataobj.artist.push({
              img: (cast.avatars && cast.avatars.small) || "",
              id: cast.id || 0,
              name: cast.name || "",
              job: "演员"
            });
          });
          that.detailObj = dataobj;
          that.value = parseInt(dataobj.rating.stars) / 10;
          that.loadingBox = false;
          that.showRate = true;
          that.$nextTick(() => {
            that.scroll = new BScroll(that.$refs.wrapper, {
              scrollX: true,
              click: true,
              bounce: {
                top: true,
                bottom: true,
                left: true,
                right: true
              }
            });
          });
        })
        .catch(function(err) {
          err.message && that.$toast(err.message);
          that.loadingBox = false;
        });
    } catch (error) {
      that.$toast(error);
      that.loadingBox = false;
    }
  }
};
</script>

<style>
.van-rate__item {
  padding: 0;
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
.nav {
  width: 100%;
  height: 40px;
  line-height: 40px;
  /* background-color: rgb(25, 137, 250); */
  color: #fff;
  position: absolute;
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
  flex-grow: 1;
}
.nav-link {
  font-size: 25px;
  left: 10px;
  text-align: left;
  padding-left: 10px;
  flex-grow: 1;
}
.nav-share {
  text-align: right;
  padding-right: 15px;
}
.detail-item {
  width: 100%;
  height: 300px;
  position: relative;
  overflow: hidden;
}
.detail-item img {
  width: 100%;
  height: 300px;
  filter: blur(80px);
  transform: translate3D(0, 0, 0);
}
.detail-item2 {
  width: 100%;
  height: 260px;
  position: absolute;
  top: 40px;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.detail-item2 img {
  width: 150px;
  height: 220px;
}
.detail-ins {
  padding: 20px;
  font-size: 12px;
  line-height: 20px;
  color: #323232;
  position: relative;
}
.m-title {
  font-size: 25px;
  display: block;
  padding-bottom: 15px;
}
.m-original_title {
  display: block;
}
.m-countries {
  display: block;
}
.m-summary {
  padding-top: 15px;
  display: block;
}
.m-summary-simple {
  display: block;
  padding-bottom: 5px;
  color: gray;
}
.m-rating {
  position: absolute;
  right: 15px;
  top: 15px;
  width: 80px;
  height: 80px;
  box-shadow: 0px 0px 8px gray;
  padding: 5px;
  background: #fff;
}
.m-rating-title {
  width: 100%;
  text-align: center;
  font-size: 12px;
  color: gray;
}
.m-rating-average {
  width: 100%;
  text-align: center;
  font-size: 25px;
  color: #000;
  font-weight: bold;
}
.m-rating-average-icon {
  width: 100%;
  text-align: center;
}
.m-rating-count {
  width: 100%;
  text-align: center;
  line-height: 12px;
  color: gray;
}

.m-artist-img {
  display: block;
  width: 100%;
  text-align: left;
}
.m-artist-name {
  display: block;
  width: 100%;
  text-align: center;
  padding-right: 10px;
  box-sizing: border-box;
  line-height: 20px;
  height: 20px;
  overflow: hidden;
}

.m-artist {
  padding-top: 20px;
}
.m-artist-title {
  padding-bottom: 10px;
}
[v-cloak] {
  display: none;
}
.wrapper {
  width: 100%;
  /* height: 100px; */
  overflow: hidden;
}
.content {
  /* display: flex;
  flex-wrap: nowrap; */
  /* width: 450px; */
  overflow-x: auto;
}
.content li {
  width: 90px;
  display: inline-block;
  height: 100px;
  box-sizing: border-box;
}
.content img {
  width: 80px;
  height: 100px;
}
</style>

