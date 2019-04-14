<template>
  <div class="well-received">
    <ItemInfo :apiurl="url"/>
  </div>
</template>
<script>
import ItemInfo from "./ItemInfo";
export default {
  name: "well-received",
  data() {
    return {
      url: this.$apiUrl.in_theaters + "?city=" + this.$route.query.city
    };
  },
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
