import Vue from 'vue';
import Vuex from 'vuex';
import app from './module/app.js';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    windowInnerWidth: window.innerWidth,
    windowInnerHeight: window.innerHeight,
  },
  modules: {
    app,
  },
});

export default store
