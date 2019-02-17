import Vue from 'vue'

import App from './App.vue'
import router from './router'
import * as filters from './filter'

// 添加全局过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
