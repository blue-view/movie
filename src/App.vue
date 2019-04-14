<template>
  <div id="app">
    <!-- <Header/> -->
    <router-view name="header"/>
    <div class="m-content">
      <keep-alive>
        <transition name="fade">
          <router-view/>
        </transition>
      </keep-alive>
    </div>
  </div>
</template>

<script>
export default {
  name: "app"
  // components: {
  //   Header
  // }
};
</script>

<style>
#app {
  color: #000;
  font-size: 14px;
  /* padding: 0 5px; */
  /* touch-action: none; */
}
.m-content {
  /* padding-top: 118px; */
}
</style>
