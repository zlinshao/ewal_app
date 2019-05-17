// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuex from 'vuex'
import store from './store/index.js'
import Boss from './config/boss.config.js'
import remAndPhoneConfig from './config/remConfig.js'
import fun from './utils/fun.prototype.js'
import myUtils from './utils/myUtils.js'
import httpZll from './utils/httpZll.js'
import httpTj from './utils/httpTj.js'
import httpHs from './utils/httpHs.js'
import Vant from 'vant';
import 'vant/lib/index.css';
import './assets/scss/rest.css'
import './assets/scss/currency.css'
import '@/assets/js/dictData.js'
import '@/assets/js/formData.js'

Vue.use(Vant);
Vue.use(Vuex);
Vue.use(Boss);
Vue.use(fun);
remAndPhoneConfig();
Vue.prototype.myUtils = myUtils;
Vue.config.productionTip = false;
Vue.prototype.$httpZll = httpZll;
Vue.prototype.$httpTj = httpTj;
Vue.prototype.$httpHs = httpHs;

// import VConsole from 'vconsole/dist/vconsole.min.js'; //import vconsole
// let vConsole = new VConsole(); // 初始化
// Vue.use(vConsole);

// 监听软键盘
(function () {
  let u = navigator.userAgent;
  let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //Android
  let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
  if (isAndroid) {
    let winHeight = window.innerHeight;   // 获取当前页面高度
    window.onresize = function () {
      if (winHeight - this.innerHeight > 50) {
        //当软键盘弹出，在这里面操作
        store.dispatch('key_up_status', true);
      } else {
        //当软键盘收起，在此处操作
        store.dispatch('key_up_status', false);
      }
    }
  }
  if (isIOS) {
    document.body.addEventListener('focusin', () => {
      //软键盘弹出的事件处理
      store.dispatch('key_up_status', true);
    });
    document.body.addEventListener('focusout', () => {
      //软键盘收起的事件处理
      store.dispatch('key_up_status', false);
    });
  }
})();

router.afterEach(route => {
  // 从路由的元信息中获取 title 属性
  if (route.meta.title) {
    // dd.biz.navigation.setTitle({
    //   title: route.meta.title,//控制标题文本，空字符串表示显示默认文本
    //   onSuccess(result) {
    //   },
    //   onFail(err) {
    //   }
    // });
  }
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {App},
  template: '<App/>'
});
