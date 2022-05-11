import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from '@/apis/http.js'
Vue.prototype.$axios = axios

let myip = '192.168.240.238'
// 文章图片上传路径(服务器路由地址)
Vue.prototype.$up_article = 'http://' + myip + ':8088/imgFileUpload'
// 共享服务图片上传路径(服务器路由地址)
Vue.prototype.$up_share = 'http://' + myip + ':8088/shareImgUpload'
// 二维码图片的路径
Vue.prototype.$qrurl = 'http://' + myip + ':8088/image/Share/ShareCR/'
// 共享服务图片的路径
Vue.prototype.$sharePath = 'http://' + myip + ':8088/image/Share/'
// 文章图片的路径
Vue.prototype.$articlePath = 'http://' + myip + ':8088/image/article_img/'

Vue.config.productionTip = false
Vue.use(ElementUI);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')