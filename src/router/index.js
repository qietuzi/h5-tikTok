import Vue from 'vue'
import Router from 'vue-router'

import spread from '../components/spread'

let routes = [
  {
    path: '/',
    name: '/',
    component: spread,
    meta: {
      keepAlive: true,
      title: '仿抖音加载'
    }
  }
]

Vue.use(Router)
export default new Router({
  routes: routes,
  linkActiveClass: 'active'
})
