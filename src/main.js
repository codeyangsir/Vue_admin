// 引入路由
import Vue from 'vue'
import App from './App.vue'
import router from '@/router.js'
// 引入ElementUI组件
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 添加整个网站的全局样式和重置样式
import '@/styles/index.less'
// ElementUI
Vue.use(ElementUI)
// 设置当前环境为部署(开发+上线)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
