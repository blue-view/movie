<template>
  <div class="toBeShownSoon">
    <ItemInfo :apiurl="this.$apiUrl.coming_soon+'?city='+this.$route.query.city"/>
  </div>
</template>
<script>
import ItemInfo from "./ItemInfo";
export default {
  name: "toBeShownSoon",
  components: {
    ItemInfo
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.well-received {
  padding-top: 5px;
}
</style>

