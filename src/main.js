// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import '@vant/touch-emulator';
import {
  RadioGroup,
  Radio,
  Sticky,
  Switch,
  Icon
} from 'vant';


Vue.use(Icon);
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(Sticky);
Vue.use(Switch);
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
