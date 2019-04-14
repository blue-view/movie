import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    keyWord: ""
  },
  getters: {},
  mutations: {
    search(state, keyWord) {
      state.keyWord = keyWord;
    }
  },
  actions: {
    search(context, keyWord) {
      context.commit("search", keyWord);
    }
  }
});
