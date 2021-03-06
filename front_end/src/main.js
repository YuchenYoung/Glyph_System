import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en'
import axios from 'axios'

Vue.config.productionTip = false

Vue.use(ElementUI, {locale})

Vue.prototype.$axios = axios
// axios.defaults.baseURL = 'http://127.0.0.1:8000/';
axios.defaults.baseURL = 'http://47.102.211.179/';
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
