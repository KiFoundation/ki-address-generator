import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    name: 'main',
    history: true,
    component: resolve => require(['@/components/main'], resolve)
  }]
})